import { Component, EventEmitter, Output, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { DocumentStatusChipComponent } from '../document-status-chip/document-status-chip.component';
import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DocumentService } from '../../services/document.service';
import {
  Document,
  DocumentLinkableType,
  DocumentType,
  DOCUMENT_TYPE_LABELS,
  ENTITY_DOCUMENT_TYPES,
  CreateDocumentPayload,
  ONLYOFFICE_EDITABLE_MIME_TYPES,
} from '../../contracts/document.contracts';
import {
  LinkDocumentDialogComponent,
  LinkDocumentDialogData,
} from '../link-document-dialog/link-document-dialog.component';

@Component({
  selector: 'app-entity-document-card',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    SkeletonComponent,
    DocumentStatusChipComponent,
    StatusChipComponent,
  ],
  templateUrl: './entity-document-card.component.html',
  styleUrl: './entity-document-card.component.scss',
})
export class EntityDocumentCardComponent {
  readonly projectId       = input.required<number>();
  readonly entityType      = input.required<DocumentLinkableType>();
  readonly entityId        = input.required<number>();
  readonly loading         = input(false);
  readonly initialDocument = input<Document | null>(null);

  @Output() readonly linkChanged = new EventEmitter<Document | null>();

  private readonly documentService = inject(DocumentService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  protected readonly linkedDocument = signal<Document | null>(null);
  protected readonly working = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly allowedTypes = computed<DocumentType[]>(() =>
    ENTITY_DOCUMENT_TYPES[this.entityType()],
  );

  constructor() {
    effect(() => {
      const doc = this.initialDocument();
      this.linkedDocument.set(doc);
    });
  }

  protected readonly typeLabels = DOCUMENT_TYPE_LABELS;

  protected readonly canEdit = computed(() => {
    const d = this.linkedDocument();
    if (!d || !d.currentVersion) return false;
    if (d.status === 'confirmed' || d.status === 'superseded') return false;
    return ONLYOFFICE_EDITABLE_MIME_TYPES.has(d.currentVersion.mimeType);
  });

  protected openInRegistry(): void {
    const d = this.linkedDocument();
    if (!d) return;
    this.router.navigate(['/p', this.projectId(), 'documents', d.id]);
  }

  protected openEditor(): void {
    const d = this.linkedDocument();
    if (!d) return;
    this.router.navigate(['/p', this.projectId(), 'documents', d.id, 'edit']);
  }

  protected openLinkDialog(): void {
    const data: LinkDocumentDialogData = {
      projectId: this.projectId(),
      allowedTypes: this.allowedTypes(),
    };
    this.dialog
      .open(LinkDocumentDialogComponent, { panelClass: 'princess-dialog', data, width: '560px' })
      .afterClosed()
      .subscribe((doc: Document | undefined) => {
        if (!doc) return;
        this.working.set(true);
        this.error.set(null);
        this.documentService
          .linkDocument(this.projectId(), doc.id, this.entityType(), this.entityId())
          .subscribe({
            next: () => {
              this.linkedDocument.set(doc);
              this.working.set(false);
              this.linkChanged.emit(doc);
            },
            error: () => {
              this.error.set('Failed to link document.');
              this.working.set(false);
            },
          });
      });
  }

  createAndLink(type: DocumentType): void {
    const payload: CreateDocumentPayload = {
      title: DOCUMENT_TYPE_LABELS[type],
      type,
    };
    this.working.set(true);
    this.error.set(null);
    this.documentService.create(this.projectId(), payload).subscribe({
      next: newDoc => {
        this.documentService
          .linkDocument(this.projectId(), newDoc.id, this.entityType(), this.entityId())
          .subscribe({
            next: () => {
              this.linkedDocument.set(newDoc);
              this.working.set(false);
              this.linkChanged.emit(newDoc);
              this.router.navigate(['/p', this.projectId(), 'documents', newDoc.id]);
            },
            error: () => {
              this.error.set('Document created but linking failed.');
              this.working.set(false);
            },
          });
      },
      error: () => {
        this.error.set('Failed to create document.');
        this.working.set(false);
      },
    });
  }

  protected confirmUnlink(): void {
    const d = this.linkedDocument();
    if (!d) return;
    const data: ConfirmDialogData = {
      title: 'Remove document link',
      message: 'Remove this document link? The document will remain in the registry.',
      confirmLabel: 'Remove link',
      confirmColor: 'warn',
    };
    this.dialog
      .open(ConfirmDialogComponent, { panelClass: 'princess-dialog', data })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.working.set(true);
        this.error.set(null);
        this.documentService.unlinkDocument(this.projectId(), d.id).subscribe({
          next: () => {
            this.linkedDocument.set(null);
            this.working.set(false);
            this.linkChanged.emit(null);
          },
          error: () => {
            this.error.set('Failed to remove link.');
            this.working.set(false);
          },
        });
      });
  }
}
