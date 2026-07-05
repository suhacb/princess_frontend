import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { ProjectService } from '../../../projects/services/project.service';
import { DocumentStatusChipComponent } from '../../components/document-status-chip/document-status-chip.component';
import { DocumentDetailComponent } from '../../components/document-detail/document-detail.component';
import { CreateDocumentDialogComponent } from '../../components/create-document-dialog/create-document-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  Document,
  DocumentCategory,
  DocumentFilters,
  DocumentStatus,
  DocumentType,
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_STATUSES,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_TYPE_BY_CATEGORY,
  CreateDocumentPayload,
  formatFileSize,
} from '../../contracts/document.contracts';

@Component({
  selector: 'app-documents-page',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    DatePipe,
    DocumentStatusChipComponent,
    DocumentDetailComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './documents-page.component.html',
  styleUrl: './documents-page.component.scss',
})
export class DocumentsPageComponent {
  private readonly documentService = inject(DocumentService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.documentService.loading;
  protected readonly project = this.projectService.selectedProject;
  protected readonly formatFileSize = formatFileSize;

  protected readonly statuses = DOCUMENT_STATUSES;
  protected readonly statusLabels = DOCUMENT_STATUS_LABELS;
  protected readonly categories = DOCUMENT_CATEGORIES;
  protected readonly categoryLabels = DOCUMENT_CATEGORY_LABELS;
  protected readonly typesByCategory = DOCUMENT_TYPE_BY_CATEGORY;

  protected readonly categoryFilter = signal<DocumentCategory | 'all'>('all');
  protected readonly statusFilter = signal<DocumentStatus | 'all'>('all');
  protected readonly typeFilter = signal<DocumentType | 'all'>('all');
  protected readonly searchQuery = signal('');

  protected readonly selectedDocId = signal<number | null>(null);

  protected readonly filteredDocuments = computed<Document[]>(() => {
    const category = this.categoryFilter();
    const status = this.statusFilter();
    const type = this.typeFilter();
    const search = this.searchQuery().trim().toLowerCase();
    let docs = this.documentService.documents();

    if (category !== 'all') docs = docs.filter(d => d.category === category);
    if (status !== 'all') docs = docs.filter(d => d.status === status);
    if (type !== 'all') docs = docs.filter(d => d.type === type);
    if (search) docs = docs.filter(d => d.title.toLowerCase().includes(search));
    return docs;
  });

  constructor() {
    effect(() => {
      const project = this.project();
      if (project) {
        const filters: DocumentFilters = {};
        this.documentService.list(project.id, filters).subscribe();
      }
    });

    effect(() => {
      const params = this.route.snapshot.params;
      const docId = params['docId'] ? +params['docId'] : null;
      this.selectedDocId.set(docId);
    }, { allowSignalWrites: true });

    this.route.params.subscribe(params => {
      const docId = params['docId'] ? +params['docId'] : null;
      this.selectedDocId.set(docId);
    });
  }

  protected selectDocument(doc: Document): void {
    const project = this.project();
    if (!project) return;
    this.router.navigate(['/p', project.id, 'documents', doc.id]);
  }

  protected closeDetail(): void {
    const project = this.project();
    if (!project) return;
    this.router.navigate(['/p', project.id, 'documents']);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.selectedDocId() !== null) this.closeDetail();
  }

  protected openCreateDialog(): void {
    this.dialog
      .open(CreateDocumentDialogComponent, { panelClass: 'princess-dialog', disableClose: true })
      .afterClosed()
      .subscribe((payload: CreateDocumentPayload | undefined) => {
        if (!payload) return;
        const project = this.project();
        if (!project) return;
        this.documentService.create(project.id, payload).subscribe({
          next: doc => this.selectDocument(doc),
        });
      });
  }
}
