import { Component, EventEmitter, Output, computed, effect, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { DocumentStatusChipComponent } from '../document-status-chip/document-status-chip.component';
import { DocumentTypeSelectComponent } from '../document-type-select/document-type-select.component';
import { UploadVersionDialogComponent, UploadVersionResult } from '../upload-version-dialog/upload-version-dialog.component';
import { DocumentVersionHistoryDialogComponent } from '../document-version-history-dialog/document-version-history-dialog.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  DocumentType,
  DocumentStatus,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_TRANSITIONS,
  ONLYOFFICE_EDITABLE_MIME_TYPES,
  UpdateDocumentPayload,
  ClassifyDocumentPayload,
  formatFileSize,
} from '../../contracts/document.contracts';

@Component({
  selector: 'app-document-detail',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatDividerModule,
    MatTooltipModule,
    DatePipe,
    DocumentStatusChipComponent,
    DocumentTypeSelectComponent,
    SkeletonComponent,
  ],
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.scss',
})
export class DocumentDetailComponent {
  readonly docId = input.required<number>();
  readonly projectId = input.required<number>();

  @Output() readonly documentDeleted = new EventEmitter<void>();

  private readonly documentService = inject(DocumentService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  protected readonly doc = this.documentService.selectedDocument;
  protected readonly loading = this.documentService.loading;
  protected readonly uploading = this.documentService.uploading;

  protected readonly loadError = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);
  protected readonly classifyError = signal<string | null>(null);

  protected readonly statusLabels = DOCUMENT_STATUS_LABELS;
  protected readonly formatFileSize = formatFileSize;

  protected readonly availableTransitions = computed<DocumentStatus[]>(() => {
    const d = this.doc();
    return d ? DOCUMENT_STATUS_TRANSITIONS[d.status] : [];
  });

  protected readonly isEditable = computed(() => {
    const d = this.doc();
    if (!d || !d.currentVersion) return false;
    if (d.status === 'confirmed' || d.status === 'superseded') return false;
    const mime = d.currentVersion.mimeType;
    if (!mime) return true; // backend omits mime_type; let OnlyOffice reject unsupported formats
    return ONLYOFFICE_EDITABLE_MIME_TYPES.has(mime);
  });

  protected readonly form = this.fb.group({
    title: [''],
    type: [null as DocumentType | null],
  });

  protected readonly classifyForm = this.fb.group({
    tags: [''],
  });

  constructor() {
    effect(() => {
      const id = this.docId();
      const projectId = this.projectId();
      if (id && projectId) {
        this.loadError.set(null);
        this.documentService.load(projectId, id).subscribe({
          error: () => this.loadError.set('Failed to load document.'),
        });
      }
    });

    effect(() => {
      const d = this.doc();
      if (d) {
        this.form.patchValue({ title: d.title, type: d.type });
        this.form.markAsPristine();
        this.classifyForm.patchValue({ tags: d.tags.join(', ') });
        this.classifyForm.markAsPristine();
      }
    });
  }

  protected save(): void {
    const d = this.doc();
    const projectId = this.projectId();
    if (!d || !projectId) return;

    const v = this.form.value;
    const payload: UpdateDocumentPayload = {
      title: v.title ?? d.title,
      type: (v.type as DocumentType) ?? d.type,
    };
    this.saveError.set(null);
    this.documentService.update(projectId, d.id, payload).subscribe({
      next: () => this.form.markAsPristine(),
      error: () => this.saveError.set('Save failed. Please try again.'),
    });
  }

  protected classify(): void {
    const d = this.doc();
    const projectId = this.projectId();
    if (!d || !projectId) return;

    const rawTags = this.classifyForm.value.tags ?? '';
    const tags = rawTags
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);

    const payload: ClassifyDocumentPayload = { tags };
    this.classifyError.set(null);
    this.documentService.classify(projectId, d.id, payload).subscribe({
      next: () => this.classifyForm.markAsPristine(),
      error: () => this.classifyError.set('Classification failed. Please try again.'),
    });
  }

  protected transitionStatus(status: DocumentStatus): void {
    const d = this.doc();
    const projectId = this.projectId();
    if (!d || !projectId) return;
    this.actionError.set(null);
    this.documentService.update(projectId, d.id, { status }).subscribe({
      error: () => this.actionError.set('Status update failed. Please try again.'),
    });
  }

  protected openUploadDialog(): void {
    const d = this.doc();
    const projectId = this.projectId();
    if (!d || !projectId) return;

    this.dialog
      .open(UploadVersionDialogComponent, { panelClass: 'princess-dialog', disableClose: true })
      .afterClosed()
      .subscribe((result: UploadVersionResult | undefined) => {
        if (!result) return;
        this.actionError.set(null);
        this.documentService.uploadVersion(projectId, d.id, result.file, result.comment ?? undefined).subscribe({
          error: () => this.actionError.set('Upload failed. Please try again.'),
        });
      });
  }

  protected openVersionHistory(): void {
    const d = this.doc();
    const projectId = this.projectId();
    if (!d || !projectId) return;
    this.dialog.open(DocumentVersionHistoryDialogComponent, {
      panelClass: 'princess-dialog',
      minWidth: '520px',
      data: { projectId, docId: d.id },
    });
  }

  protected openEditor(): void {
    const d = this.doc();
    const projectId = this.projectId();
    if (!d || !projectId) return;
    window.open(`/editor/${projectId}/documents/${d.id}`, '_blank');
  }

  protected download(): void {
    const d = this.doc();
    const projectId = this.projectId();
    if (!d || !projectId) return;
    this.documentService.download(projectId, d.id);
  }

  protected deleteDocument(): void {
    const d = this.doc();
    const projectId = this.projectId();
    if (!d || !projectId) return;
    this.actionError.set(null);
    this.documentService.remove(projectId, d.id).subscribe({
      next: () => this.documentDeleted.emit(),
      error: () => this.actionError.set('Delete failed. Please try again.'),
    });
  }

  protected statusTransitionLabel(status: DocumentStatus): string {
    const labels: Record<DocumentStatus, string> = {
      draft: 'Revert to Draft',
      in_review: 'Submit for Review',
      confirmed: 'Confirm',
      superseded: 'Supersede',
    };
    return labels[status];
  }
}
