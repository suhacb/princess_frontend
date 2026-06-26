import { Component, input } from '@angular/core';
import { TASK_STATUS_LABELS, TaskStatus } from '../../contracts/task.contracts';

@Component({
  selector: 'app-task-status-chip',
  imports: [],
  template: `<span class="ts-chip ts-chip--{{ status() }}">{{ label() }}</span>`,
  styles: `
    .ts-chip {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .ts-chip--todo        { background: color-mix(in srgb, var(--status-neutral) 14%, transparent); color: var(--status-neutral); }
    .ts-chip--in_progress { background: color-mix(in srgb, var(--status-info) 14%, transparent);    color: var(--status-info); }
    .ts-chip--done        { background: color-mix(in srgb, var(--status-success) 14%, transparent); color: var(--status-success); }
    .ts-chip--blocked     { background: color-mix(in srgb, var(--status-danger) 14%, transparent);  color: var(--status-danger); }
  `,
})
export class TaskStatusChipComponent {
  readonly status = input.required<TaskStatus>();
  protected readonly label = () => TASK_STATUS_LABELS[this.status()] ?? this.status();
}
