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
import { ChangeService } from '../../services/change.service';
import { ProjectService } from '../../../projects/services/project.service';
import { ChangeStatusChipComponent } from '../../components/change-status-chip/change-status-chip.component';
import {
  DecideChangeDialogComponent,
  DecideChangeDialogData,
} from '../../components/decide-change-dialog/decide-change-dialog.component';
import {
  CHANGE_REQUEST_TYPES,
  CHANGE_REQUEST_TYPE_LABELS,
  CHANGE_STATUSES,
  CHANGE_STATUS_LABELS,
  ChangeRequestType,
  ChangeStatus,
  DecideChangePayload,
  UpdateChangePayload,
  canDecide,
} from '../../contracts/change.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-change-detail',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    DatePipe,
    ChangeStatusChipComponent,
    SkeletonComponent,
  ],
  templateUrl: './change-detail.component.html',
  styleUrl: './change-detail.component.scss',
})
export class ChangeDetailComponent {
  readonly changeId = input<string>();

  private readonly changeService = inject(ChangeService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  protected readonly change = this.changeService.selectedChange;
  protected readonly project = this.projectService.selectedProject;
  protected readonly loading = this.changeService.loading;

  protected readonly types = CHANGE_REQUEST_TYPES;
  protected readonly typeLabels = CHANGE_REQUEST_TYPE_LABELS;
  protected readonly statuses = CHANGE_STATUSES;
  protected readonly statusLabels = CHANGE_STATUS_LABELS;

  protected readonly loadError = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);

  protected readonly canDecide = computed(() => {
    const c = this.change();
    return c ? canDecide(c.status) : false;
  });

  protected readonly form = this.fb.group({
    request_type: ['' as ChangeRequestType],
    title: [''],
    description: [''],
    impact_assessment: [''],
    priority: [''],
    status: ['' as ChangeStatus],
    implementation_due: [''],
    implemented_at: [''],
  });

  constructor() {
    effect(() => {
      const id = this.changeId();
      const project = this.project();
      if (id && project) {
        this.loadError.set(null);
        this.changeService.load(project.id, +id).subscribe({
          error: () => this.loadError.set('Failed to load change request.'),
        });
      }
    });

    effect(() => {
      const c = this.change();
      if (c) {
        this.form.patchValue({
          request_type: c.requestType,
          title: c.title,
          description: c.description ?? '',
          impact_assessment: c.impactAssessment ?? '',
          priority: c.priority ?? '',
          status: c.status,
          implementation_due: c.implementationDue ?? '',
          implemented_at: c.implementedAt ?? '',
        });
        this.form.markAsPristine();
      }
    });
  }

  protected goBack(): void {
    const project = this.project();
    if (project) this.router.navigate(['/p', project.id, 'changes']);
  }

  protected save(): void {
    const c = this.change();
    const project = this.project();
    if (!c || !project) return;

    const v = this.form.value;
    const payload: UpdateChangePayload = {
      request_type: v.request_type as ChangeRequestType,
      title: v.title!,
      description: v.description || null,
      impact_assessment: v.impact_assessment || null,
      priority: v.priority || null,
      status: v.status as ChangeStatus,
      implementation_due: v.implementation_due || null,
      implemented_at: v.implemented_at || null,
    };
    this.saveError.set(null);
    this.changeService.update(project.id, c.id, payload).subscribe({
      next: () => this.form.markAsPristine(),
      error: () => this.saveError.set('Save failed. Please try again.'),
    });
  }

  protected openDecideDialog(action: 'approve' | 'reject'): void {
    const c = this.change();
    const project = this.project();
    if (!c || !project) return;

    const data: DecideChangeDialogData = { action, changeTitle: c.title };
    this.dialog
      .open(DecideChangeDialogComponent, { panelClass: 'princess-dialog', data })
      .afterClosed()
      .subscribe((payload: DecideChangePayload | undefined) => {
        if (payload === undefined) return;
        this.actionError.set(null);
        const op =
          action === 'approve'
            ? this.changeService.approve(project.id, c.id, payload)
            : this.changeService.reject(project.id, c.id, payload);
        op.subscribe({
          error: () => this.actionError.set(`${action === 'approve' ? 'Approval' : 'Rejection'} failed. Please try again.`),
        });
      });
  }

  protected deleteChange(): void {
    const c = this.change();
    const project = this.project();
    if (!c || !project) return;
    this.changeService.remove(project.id, c.id).subscribe({
      next: () => this.goBack(),
      error: () => this.actionError.set('Delete failed. Please try again.'),
    });
  }
}
