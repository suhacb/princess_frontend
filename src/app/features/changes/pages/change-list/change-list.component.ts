import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ChangeService } from '../../services/change.service';
import { ProjectService } from '../../../projects/services/project.service';
import { ChangeStatusChipComponent } from '../../components/change-status-chip/change-status-chip.component';
import { CreateChangeDialogComponent } from '../../components/create-change-dialog/create-change-dialog.component';
import {
  Change,
  CHANGE_REQUEST_TYPE_LABELS,
  CHANGE_STATUS_LABELS,
  CHANGE_STATUSES,
  ChangeRequestType,
  ChangeStatus,
  CreateChangePayload,
} from '../../contracts/change.contracts';
import { BadgeComponent, BadgeTone } from '../../../../shared/components/badge/badge.component';

const CHANGE_TYPE_TONES: Record<ChangeRequestType, BadgeTone> = {
  rfc:      'primary',
  off_spec: 'tertiary',
};

const PRIORITY_TONES: Record<string, BadgeTone> = {
  low:      'neutral',
  medium:   'warning',
  high:     'danger',
  critical: 'danger',
};
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-change-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    DatePipe,
    BadgeComponent,
    ChangeStatusChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './change-list.component.html',
  styleUrl: './change-list.component.scss',
})
export class ChangeListComponent {
  private readonly changeService = inject(ChangeService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.changeService.loading;
  protected readonly typeLabels = CHANGE_REQUEST_TYPE_LABELS;
  protected readonly typeTone = (type: ChangeRequestType): BadgeTone => CHANGE_TYPE_TONES[type];
  protected readonly priorityTone = (p: string | null): BadgeTone => PRIORITY_TONES[p ?? ''] ?? 'neutral';
  protected readonly statusLabels = CHANGE_STATUS_LABELS;
  protected readonly changeStatuses = CHANGE_STATUSES;
  protected readonly statusFilter = signal<ChangeStatus | 'all'>('all');

  protected readonly filteredChanges = computed<Change[]>(() => {
    const filter = this.statusFilter();
    const changes = this.changeService.changes();
    return filter === 'all' ? changes : changes.filter(c => c.status === filter);
  });

  constructor() {
    effect(() => {
      const project = this.projectService.selectedProject();
      if (project) this.changeService.list(project.id).subscribe();
    });
  }

  protected openCreateDialog(): void {
    this.dialog
      .open(CreateChangeDialogComponent, { panelClass: 'princess-dialog', disableClose: true })
      .afterClosed()
      .subscribe((payload: CreateChangePayload | undefined) => {
        if (!payload) return;
        const project = this.projectService.selectedProject();
        if (!project) return;
        this.changeService.create(project.id, payload).subscribe({
          next: change => this.navigateToChange(change.id),
        });
      });
  }

  protected navigateToChange(changeId: number): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.router.navigate(['/projects', project.id, 'changes', changeId]);
  }
}
