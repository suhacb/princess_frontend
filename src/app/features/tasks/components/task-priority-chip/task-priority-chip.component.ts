import { Component, input } from '@angular/core';
import { TASK_PRIORITY_LABELS, TaskPriority } from '../../contracts/task.contracts';

@Component({
  selector: 'app-task-priority-chip',
  imports: [],
  template: `<span class="tp-chip tp-chip--{{ priority() }}">{{ label() }}</span>`,
  styles: `
    .tp-chip {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .tp-chip--low      { background: color-mix(in srgb, var(--status-neutral) 12%, transparent); color: var(--status-neutral); }
    .tp-chip--medium   { background: color-mix(in srgb, var(--status-caution) 15%, transparent); color: var(--status-caution-text); }
    .tp-chip--high     { background: color-mix(in srgb, var(--status-warning) 15%, transparent); color: var(--status-warning-strong); }
    .tp-chip--critical { background: color-mix(in srgb, var(--status-danger) 15%, transparent);  color: var(--status-danger); }
  `,
})
export class TaskPriorityChipComponent {
  readonly priority = input.required<TaskPriority>();
  protected readonly label = () => TASK_PRIORITY_LABELS[this.priority()] ?? this.priority();
}
