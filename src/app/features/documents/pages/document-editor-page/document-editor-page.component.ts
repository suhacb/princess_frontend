import { Component, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DocumentService } from '../../services/document.service';
import { ProjectService } from '../../../projects/services/project.service';

declare const DocsAPI: any;

const ONLYOFFICE_SCRIPT = 'http://localhost:10112/web-apps/apps/api/documents/api.js';

@Component({
  selector: 'app-document-editor-page',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './document-editor-page.component.html',
  styleUrl: './document-editor-page.component.scss',
})
export class DocumentEditorPageComponent implements OnDestroy {
  private readonly documentService = inject(DocumentService);
  private readonly projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  private editor: any = null;

  constructor() {
    const docId = this.route.snapshot.params['docId']
      ? +this.route.snapshot.params['docId']
      : null;

    const project = this.projectService.selectedProject();

    if (project && docId) {
      this.initEditor(project.id, docId);
    } else {
      this.loading.set(false);
      this.error.set('Could not determine project or document.');
    }
  }

  private initEditor(projectId: number, docId: number): void {
    this.documentService.loadEditorConfig(projectId, docId).subscribe({
      next: config => {
        this.loadScript(ONLYOFFICE_SCRIPT)
          .then(() => {
            this.editor = new DocsAPI.DocEditor('onlyoffice-editor', config);
            this.loading.set(false);
          })
          .catch(() => {
            this.loading.set(false);
            this.error.set('Failed to load document editor. Is OnlyOffice running?');
          });
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load editor configuration.');
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

  protected goBack(): void {
    const project = this.projectService.selectedProject();
    const docId = this.route.snapshot.params['docId'];
    if (project && docId) {
      this.router.navigate(['/p', project.id, 'documents', docId]);
    } else {
      this.router.navigate(['..'], { relativeTo: this.route });
    }
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
