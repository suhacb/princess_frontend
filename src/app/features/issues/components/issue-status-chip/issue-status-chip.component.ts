import { Component, input } from '@angular/core';
import { IssueStatus, ISSUE_STATUS_LABELS } from '../../contracts/issue.contracts';

@Component({
  selector: 'app-issue-status-chip',
  imports: [],
  template: `<span class="status-chip status-chip--{{ status() }}">{{ labels[status()] }}</span>`,
  styles: `
    .status-chip {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      &--open        { background: color-mix(in srgb, var(--mat-sys-primary) 12%, transparent); color: var(--mat-sys-primary); }
      &--under_review{ background: color-mix(in srgb, #f9a825 12%, transparent); color: #f57f17; }
      &--escalated   { background: color-mix(in srgb, #e65100 12%, transparent); color: #e65100; }
      &--closed      { background: color-mix(in srgb, #2e7d32 12%, transparent); color: #2e7d32; }
    }
  `,
})
export class IssueStatusChipComponent {
  readonly status = input.required<IssueStatus>();
  protected readonly labels = ISSUE_STATUS_LABELS;
}
