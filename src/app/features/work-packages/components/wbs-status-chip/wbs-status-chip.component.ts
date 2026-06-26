import { Component, input } from '@angular/core';
import { WbsStatus, WBS_STATUS_LABELS } from '../../contracts/work-package.contracts';

@Component({
  selector: 'app-wbs-status-chip',
  imports: [],
  template: `<span class="wbs-chip wbs-chip--{{ status() }}">{{ labels[status()] }}</span>`,
  styles: `
    .wbs-chip {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      white-space: nowrap;
      flex-shrink: 0;

      &--planned    { background: color-mix(in srgb, var(--status-neutral) 12%, transparent); color: var(--status-neutral); }
      &--in_progress{ background: color-mix(in srgb, var(--mat-sys-primary) 12%, transparent); color: var(--mat-sys-primary); }
      &--complete   { background: color-mix(in srgb, var(--status-success) 12%, transparent); color: var(--status-success); }
    }
  `,
})
export class WbsStatusChipComponent {
  readonly status = input.required<WbsStatus>();
  protected readonly labels = WBS_STATUS_LABELS;
}
