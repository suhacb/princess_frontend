import { Component, input } from '@angular/core';
import { IssuePriority, ISSUE_PRIORITY_LABELS } from '../../contracts/issue.contracts';

@Component({
  selector: 'app-issue-priority-chip',
  imports: [],
  template: `<span class="priority-chip priority-chip--{{ priority() }}">{{ labels[priority()] }}</span>`,
  styles: `
    .priority-chip {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      &--low      { background: color-mix(in srgb, var(--mat-sys-outline) 15%, transparent); color: var(--mat-sys-on-surface-variant); }
      &--medium   { background: color-mix(in srgb, #f9a825 12%, transparent); color: #f57f17; }
      &--high     { background: color-mix(in srgb, #e65100 12%, transparent); color: #e65100; }
      &--critical { background: color-mix(in srgb, var(--mat-sys-error) 15%, transparent); color: var(--mat-sys-error); }
    }
  `,
})
export class IssuePriorityChipComponent {
  readonly priority = input.required<IssuePriority>();
  protected readonly labels = ISSUE_PRIORITY_LABELS;
}
