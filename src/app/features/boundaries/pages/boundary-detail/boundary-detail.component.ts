import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { BoundaryService } from '../../services/boundary.service';
import { ProjectService } from '../../../projects/services/project.service';
import { StageService } from '../../../stages/services/stage.service';
import { BoundaryStatusChipComponent } from '../../components/boundary-status-chip/boundary-status-chip.component';
import {
  RejectBoundaryDialogComponent,
  RejectBoundaryDialogData,
} from '../../components/reject-boundary-dialog/reject-boundary-dialog.component';
import {
  BOUNDARY_TYPE_LABELS,
  RejectBoundaryPayload,
  UpdateBoundaryPayload,
  canApproveReject,
  canEdit,
  canSubmit,
} from '../../contracts/boundary.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-boundary-detail',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    DatePipe,
    BoundaryStatusChipComponent,
    SkeletonComponent,
  ],
  templateUrl: './boundary-detail.component.html',
  styleUrl: './boundary-detail.component.scss',
})
export class BoundaryDetailComponent {
  readonly stageId = input<string>();
  readonly boundaryId = input<string>();

  private readonly boundaryService = inject(BoundaryService);
  private readonly projectService = inject(ProjectService);
  private readonly stageService = inject(StageService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  protected readonly boundary = this.boundaryService.selectedBoundary;
  protected readonly project = this.projectService.selectedProject;
  protected readonly stages = this.stageService.stages;
  protected readonly loading = this.boundaryService.loading;
  protected readonly typeLabels = BOUNDARY_TYPE_LABELS;

  protected readonly loadError = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  protected readonly canEdit = computed(() => {
    const b = this.boundary();
    return b ? canEdit(b.status) : false;
  });
  protected readonly canSubmit = computed(() => {
    const b = this.boundary();
    return b ? canSubmit(b.status) : false;
  });
  protected readonly canApproveReject = computed(() => {
    const b = this.boundary();
    return b ? canApproveReject(b.status) : false;
  });
  protected readonly isExceptionReport = computed(() => this.boundary()?.type === 'exception_report');
  protected readonly isEndStageReport = computed(() => this.boundary()?.type === 'end_stage_report');
  protected readonly otherStages = computed(() => {
    const b = this.boundary();
    return b ? this.stages().filter(s => s.id !== b.stageId) : [];
  });

  protected readonly form = this.fb.group({
    title: [''],
    notes: [''],
    exception_summary: [''],
    next_stage_id: [null as number | null],
  });

  constructor() {
    effect(() => {
      const id = this.boundaryId();
      const stageId = this.stageId();
      const project = this.project();
      if (id && stageId && project) {
        this.loadError.set(null);
        this.boundaryService.load(project.id, +stageId, +id).subscribe({
          error: () => this.loadError.set('Failed to load boundary.'),
        });
        if (this.stages().length === 0) {
          this.stageService.list(project.id).subscribe();
        }
      }
    });

    effect(() => {
      const b = this.boundary();
      if (b) {
        this.form.patchValue({
          title: b.title ?? '',
          notes: b.notes ?? '',
          exception_summary: b.exceptionSummary ?? '',
          next_stage_id: b.nextStageId,
        });
        if (!canEdit(b.status)) {
          this.form.disable();
        } else {
          this.form.enable();
        }
      }
    });
  }

  protected goBack(): void {
    const project = this.project();
    const stageId = this.stageId();
    if (project && stageId) {
      this.router.navigate(['/projects', project.id, 'stages', +stageId]);
    }
  }

  protected save(): void {
    const b = this.boundary();
    const project = this.project();
    if (!b || !project || !canEdit(b.status)) return;

    const v = this.form.value;
    const payload: UpdateBoundaryPayload = {
      title: v.title || null,
      notes: v.notes || null,
      exception_summary: this.isExceptionReport() ? (v.exception_summary || null) : undefined,
      next_stage_id: this.isEndStageReport() ? (v.next_stage_id ?? null) : undefined,
    };

    this.saveError.set(null);
    this.boundaryService.update(project.id, b.stageId, b.id, payload).subscribe({
      error: () => this.saveError.set('Save failed. Please try again.'),
    });
  }

  protected submit(): void {
    const b = this.boundary();
    const project = this.project();
    if (!b || !project) return;
    this.actionError.set(null);
    this.boundaryService.submit(project.id, b.stageId, b.id).subscribe({
      error: () => this.actionError.set('Submit failed. Please try again.'),
    });
  }

  protected approve(): void {
    const b = this.boundary();
    const project = this.project();
    if (!b || !project) return;
    this.actionError.set(null);
    this.boundaryService.approve(project.id, b.stageId, b.id).subscribe({
      error: () => this.actionError.set('Approve failed. Please try again.'),
    });
  }

  protected openRejectDialog(): void {
    const b = this.boundary();
    const project = this.project();
    if (!b || !project) return;

    const data: RejectBoundaryDialogData = { boundaryTitle: b.title || this.typeLabels[b.type] };
    this.dialog
      .open(RejectBoundaryDialogComponent, { panelClass: 'princess-dialog', data })
      .afterClosed()
      .subscribe((payload: RejectBoundaryPayload | undefined) => {
        if (!payload) return;
        this.actionError.set(null);
        this.boundaryService.reject(project.id, b.stageId, b.id, payload).subscribe({
          error: () => this.actionError.set('Reject failed. Please try again.'),
        });
      });
  }

  protected deleteBoundary(): void {
    const b = this.boundary();
    const project = this.project();
    if (!b || !project) return;
    this.boundaryService.remove(project.id, b.stageId, b.id).subscribe({
      next: () => this.goBack(),
      error: () => this.actionError.set('Delete failed. Please try again.'),
    });
  }
}
