import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  Task,
  TaskPriority,
  TaskStatus,
  isDueThisWeek,
  isOverdue,
} from '../../contracts/task.contracts';
import { TaskPriorityChipComponent } from '../task-priority-chip/task-priority-chip.component';
import { TaskStatusChipComponent } from '../task-status-chip/task-status-chip.component';

@Component({
  selector: 'app-task-list',
  imports: [
    FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatTooltipModule,
    EmptyStateComponent, SkeletonComponent,
    TaskStatusChipComponent, TaskPriorityChipComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly tasks   = input.required<Task[]>();
  readonly loading = input.required<boolean>();

  readonly taskSelected = output<Task>();
  readonly createClicked = output<void>();

  protected readonly statuses   = [null as null, ...TASK_STATUSES];
  protected readonly priorities = [null as null, ...TASK_PRIORITIES];
  protected readonly statusLabels   = TASK_STATUS_LABELS;
  protected readonly priorityLabels = TASK_PRIORITY_LABELS;

  filterStatus   = signal<TaskStatus | null>(null);
  filterPriority = signal<TaskPriority | null>(null);
  filterAssignee = signal<string>('');

  protected readonly filtered = computed(() => {
    const st = this.filterStatus();
    const pr = this.filterPriority();
    const as = this.filterAssignee().trim().toLowerCase();
    return this.tasks().filter(t =>
      (!st || t.status === st) &&
      (!pr || t.priority === pr) &&
      (!as || (t.assigneeName ?? '').toLowerCase().includes(as)),
    );
  });

  protected readonly isOverdue    = isOverdue;
  protected readonly isDueThisWeek = isDueThisWeek;

  clearFilters(): void {
    this.filterStatus.set(null);
    this.filterPriority.set(null);
    this.filterAssignee.set('');
  }

  protected hasFilters = computed(() =>
    this.filterStatus() !== null || this.filterPriority() !== null || this.filterAssignee() !== '',
  );
}
