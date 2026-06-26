import { Component, computed, inject, input, output } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  Task,
  TaskStatus,
  isDueThisWeek,
  isOverdue,
} from '../../contracts/task.contracts';
import { TaskService } from '../../services/task.service';
import { TaskPriorityChipComponent } from '../task-priority-chip/task-priority-chip.component';

interface KanbanColumn {
  status: TaskStatus;
  label: string;
  tasks: Task[];
}

@Component({
  selector: 'app-task-board',
  imports: [DragDropModule, MatButtonModule, MatIconModule, MatTooltipModule, SkeletonComponent, TaskPriorityChipComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss',
})
export class TaskBoardComponent {
  readonly projectId = input.required<number>();
  readonly tasks     = input.required<Task[]>();
  readonly loading   = input.required<boolean>();

  readonly taskSelected  = output<Task>();
  readonly createClicked = output<void>();

  private readonly taskService = inject(TaskService);

  protected readonly isOverdue    = isOverdue;
  protected readonly isDueThisWeek = isDueThisWeek;
  protected readonly statusLabels = TASK_STATUS_LABELS;

  protected readonly columnIds = TASK_STATUSES.map(s => `col-${s}`);

  protected readonly columns = computed<KanbanColumn[]>(() => {
    const taskList = this.tasks();
    return TASK_STATUSES.map(status => ({
      status,
      label: TASK_STATUS_LABELS[status],
      tasks: taskList.filter(t => t.status === status),
    }));
  });

  protected dropped(event: CdkDragDrop<Task[]>, targetStatus: TaskStatus): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }
    const task: Task = event.previousContainer.data[event.previousIndex];
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    this.taskService.update(this.projectId(), task.id, { status: targetStatus }).subscribe();
  }

  protected colId(status: TaskStatus): string {
    return `col-${status}`;
  }
}
