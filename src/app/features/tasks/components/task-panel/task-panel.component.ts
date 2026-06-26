import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../contracts/task.contracts';
import { TaskService } from '../../services/task.service';
import { TaskBoardComponent } from '../task-board/task-board.component';
import { TaskDrawerComponent } from '../task-drawer/task-drawer.component';
import { TaskListComponent } from '../task-list/task-list.component';

type ViewMode = 'list' | 'board';

@Component({
  selector: 'app-task-panel',
  imports: [MatButtonModule, MatIconModule, TaskListComponent, TaskBoardComponent, TaskDrawerComponent],
  templateUrl: './task-panel.component.html',
  styleUrl: './task-panel.component.scss',
})
export class TaskPanelComponent {
  readonly projectId = input.required<number>();

  private readonly taskService = inject(TaskService);

  protected readonly tasks   = this.taskService.tasks;
  protected readonly loading = this.taskService.loading;

  protected readonly view          = signal<ViewMode>('list');
  protected readonly drawerTask    = signal<Task | null>(null);
  protected readonly drawerOpen    = signal(false);

  constructor() {
    effect(() => {
      this.taskService.load(this.projectId()).subscribe();
    });
  }

  protected openCreate(): void {
    this.drawerTask.set(null);
    this.drawerOpen.set(true);
  }

  protected openEdit(task: Task): void {
    this.drawerTask.set(task);
    this.drawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
    this.drawerTask.set(null);
  }

  protected onSaved(): void {
    this.closeDrawer();
  }
}
