import { Component, computed, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { DocumentService } from '../../services/document.service';
import { ProjectService } from '../../../projects/services/project.service';
import { ClassifyPanelComponent } from '../../components/classify-panel/classify-panel.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { ClassifyDocumentPayload, Document } from '../../contracts/document.contracts';

@Component({
  selector: 'app-classification-queue-page',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    ClassifyPanelComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './classification-queue-page.component.html',
  styleUrl: './classification-queue-page.component.scss',
})
export class ClassificationQueuePageComponent {
  private readonly documentService = inject(DocumentService);
  private readonly projectService = inject(ProjectService);

  protected readonly queue = this.documentService.reviewQueue;
  protected readonly loading = this.documentService.reviewQueueLoading;
  protected readonly project = this.projectService.selectedProject;

  protected readonly expandedDocId = signal<number | null>(null);
  protected readonly selectedIds = signal<Set<number>>(new Set());
  protected readonly bulkSaving = signal(false);

  protected readonly allSelected = computed(() => {
    const q = this.queue();
    return q.length > 0 && q.every(d => this.selectedIds().has(d.id));
  });

  protected readonly someSelected = computed(
    () => this.selectedIds().size > 0 && !this.allSelected(),
  );

  constructor() {
    effect(() => {
      const project = this.project();
      if (project) {
        this.documentService.listReviewQueue(project.id).subscribe();
      }
    });
  }

  protected toggleExpanded(doc: Document): void {
    this.expandedDocId.update(id => (id === doc.id ? null : doc.id));
  }

  protected onAccepted(doc: Document, payload: ClassifyDocumentPayload): void {
    const project = this.project();
    if (!project) return;
    this.documentService.acceptClassification(project.id, doc.id, payload).subscribe({
      next: () => {
        this.expandedDocId.update(id => (id === doc.id ? null : id));
        this.selectedIds.update(s => {
          const next = new Set(s);
          next.delete(doc.id);
          return next;
        });
      },
    });
  }

  protected onSkipped(doc: Document): void {
    this.expandedDocId.update(id => (id === doc.id ? null : id));
  }

  protected toggleSelect(doc: Document): void {
    this.selectedIds.update(s => {
      const next = new Set(s);
      next.has(doc.id) ? next.delete(doc.id) : next.add(doc.id);
      return next;
    });
  }

  protected toggleSelectAll(): void {
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.queue().map(d => d.id)));
    }
  }

  protected clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  protected bulkConfirm(): void {
    const project = this.project();
    if (!project) return;
    const ids = [...this.selectedIds()];
    if (ids.length === 0) return;

    this.bulkSaving.set(true);
    let remaining = ids.length;

    const finish = (): void => {
      remaining--;
      if (remaining === 0) {
        this.bulkSaving.set(false);
        this.selectedIds.set(new Set());
      }
    };

    for (const id of ids) {
      this.documentService
        .confirmQueueItem(project.id, id)
        .subscribe({ next: finish, error: finish });
    }
  }
}
