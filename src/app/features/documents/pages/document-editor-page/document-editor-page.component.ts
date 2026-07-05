import { Component, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DocumentService } from '../../services/document.service';

declare const DocsAPI: any;

const ONLYOFFICE_SCRIPT = 'http://localhost:10112/web-apps/apps/api/documents/api.js';

@Component({
  selector: 'app-document-editor-page',
  imports: [MatProgressSpinnerModule],
  templateUrl: './document-editor-page.component.html',
  styleUrl: './document-editor-page.component.scss',
})
export class DocumentEditorPageComponent implements OnDestroy {
  private readonly documentService = inject(DocumentService);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  private editor: any = null;

  constructor() {
    const projectId = +this.route.snapshot.params['projectId'];
    const docId = +this.route.snapshot.params['docId'];
    const versionId = this.route.snapshot.queryParams['versionId']
      ? +this.route.snapshot.queryParams['versionId']
      : undefined;
    const viewMode = this.route.snapshot.queryParams['view'] === '1';

    if (projectId && docId) {
      this.initEditor(projectId, docId, versionId, viewMode);
    } else {
      this.loading.set(false);
      this.error.set('Could not determine project or document.');
    }
  }

  private initEditor(projectId: number, docId: number, versionId?: number, viewMode = false): void {
    this.documentService.loadEditorConfig(projectId, docId, versionId).subscribe({
      next: config => {
        this.loadScript(ONLYOFFICE_SCRIPT)
          .then(() => {
            this.loading.set(false);
            // Give Angular one event-loop tick to render the now-visible container
            // before DocsAPI measures its dimensions for initialization.
            setTimeout(() => {
              this.editor = new DocsAPI.DocEditor('onlyoffice-editor', {
                ...config,
                editorConfig: {
                  ...config.editorConfig,
                  ...(viewMode ? { mode: 'view' } : {}),
                },
                events: { onRequestClose: () => window.close() },
              });
            }, 0);
          })
          .catch(() => {
            this.loading.set(false);
            this.error.set('Failed to load document editor. Is OnlyOffice running?');
          });
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        // version_id is only ever attached to this request from our own "View
        // v{n}" action, so a 404/422 here means the link is stale (version
        // removed, or the id was tampered with) rather than a config failure.
        this.error.set(
          versionId !== undefined && (err.status === 404 || err.status === 422)
            ? 'This version could not be found. It may have been removed.'
            : 'Failed to load editor configuration.',
        );
      },
    });
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) { resolve(); return; }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.head.appendChild(script);
    });
  }

  protected closeTab(): void {
    window.close();
  }

  ngOnDestroy(): void {
    if (this.editor) {
      try { this.editor.destroyEditor(); } catch { /* ignore */ }
      this.editor = null;
    }
    const script = document.querySelector(`script[src="${ONLYOFFICE_SCRIPT}"]`);
    script?.remove();
  }
}
