import { Component, ElementRef, effect, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentService } from '../../services/document.service';
import { DocumentVersion, formatFileSize } from '../../contracts/document.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  RevertConfirmDialogComponent,
  RevertConfirmData,
} from '../revert-confirm-dialog/revert-confirm-dialog.component';

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

@Component({
  selector: 'app-document-version-list',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    SkeletonComponent,
  ],
  templateUrl: './document-version-list.component.html',
  styleUrl: './document-version-list.component.scss',
})
export class DocumentVersionListComponent {
  readonly projectId = input.required<number>();
  readonly docId = input.required<number>();

  private readonly documentService = inject(DocumentService);
  private readonly dialog = inject(MatDialog);
  private readonly el = inject(ElementRef);

  protected readonly doc = this.documentService.selectedDocument;

  private readonly _versions = signal<DocumentVersion[]>([]);
  private readonly _loading = signal(false);
  private readonly _reverting = signal(false);
  private readonly _currentPage = signal(1);
  private readonly _lastPage = signal(1);
  private readonly _total = signal(0);

  protected readonly versions = this._versions.asReadonly();
  protected readonly loading = this._loading.asReadonly();
  protected readonly reverting = this._reverting.asReadonly();
  protected readonly currentPage = this._currentPage.asReadonly();
  protected readonly lastPage = this._lastPage.asReadonly();
  protected readonly total = this._total.asReadonly();
  protected readonly error = signal<string | null>(null);

  protected readonly formatFileSize = formatFileSize;
  protected readonly relativeTime = relativeTime;

  constructor() {
    effect(() => {
      const docId = this.docId();
      const projectId = this.projectId();
      if (docId && projectId) {
        this._currentPage.set(1);
        this.load(projectId, docId, 1);
      }
    });
  }

  private load(projectId: number, docId: number, page: number, scrollToTop = false): void {
    this._loading.set(true);
    this.error.set(null);
    this.documentService.listVersions(projectId, docId, page).subscribe({
      next: result => {
        this._versions.set(result.versions);
        this._currentPage.set(result.currentPage);
        this._lastPage.set(result.lastPage);
        this._total.set(result.total);
        this._loading.set(false);
        if (scrollToTop) {
          (this.el.nativeElement as HTMLElement)
            .querySelector('.version-row')
            ?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
        }
      },
      error: () => {
        this._loading.set(false);
        this.error.set('Failed to load version history.');
      },
    });
  }

  protected goToPage(page: number): void {
    this._currentPage.set(page);
    this.load(this.projectId(), this.docId(), page, true);
  }

  protected isCurrentVersion(version: DocumentVersion): boolean {
    return this.doc()?.currentVersion?.id === version.id;
  }

  protected canRevert(version: DocumentVersion): boolean {
    const doc = this.doc();
    if (!doc) return false;
    return doc.status !== 'confirmed' && !this.isCurrentVersion(version);
  }

  protected restoreTooltip(version: DocumentVersion): string {
    if (this.isCurrentVersion(version)) return 'Current version';
    if (this.doc()?.status === 'confirmed') return 'Cannot restore a confirmed document';
    return `Restore v${version.versionNumber} as current`;
  }

  protected downloadVersion(version: DocumentVersion): void {
    this.documentService.download(this.projectId(), this.docId(), version.id);
  }

  protected viewVersion(version: DocumentVersion): void {
    window.open(
      `/editor/${this.projectId()}/documents/${this.docId()}?versionId=${version.id}&view=1`,
      '_blank',
    );
  }

  protected openRevertDialog(version: DocumentVersion): void {
    const doc = this.doc();
    if (!doc) return;

    const data: RevertConfirmData = {
      fromVersion: version.versionNumber,
      toVersion: doc.versionCount + 1,
    };

    this.dialog
      .open(RevertConfirmDialogComponent, { panelClass: 'princess-dialog', data })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) => {
        if (!confirmed) return;
        this._reverting.set(true);
        this.error.set(null);
        this.documentService
          .revertVersion(this.projectId(), this.docId(), version.id)
          .subscribe({
            next: () => {
              this._reverting.set(false);
              this._currentPage.set(1);
              this.load(this.projectId(), this.docId(), 1, true);
            },
            error: () => {
              this._reverting.set(false);
              this.error.set('Revert failed. Please try again.');
            },
          });
      });
  }
}
