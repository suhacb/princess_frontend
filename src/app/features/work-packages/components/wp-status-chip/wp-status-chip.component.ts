import { Component, input } from '@angular/core';
import { WP_STATUS_LABELS, WorkPackageStatus } from '../../contracts/work-package.contracts';

@Component({
  selector: 'app-wp-status-chip',
  imports: [],
  template: `<span class="wp-chip wp-chip--{{ status() }}">{{ labels[status()] }}</span>`,
  styles: `
    .wp-chip {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      white-space: nowrap;
      flex-shrink: 0;

      &--draft        { background: color-mix(in srgb, var(--status-neutral) 12%, transparent); color: var(--status-neutral); }
      &--authorized   { background: color-mix(in srgb, var(--mat-sys-primary) 12%, transparent); color: var(--mat-sys-primary); }
      &--in_progress  { background: color-mix(in srgb, var(--status-info, var(--mat-sys-tertiary)) 12%, transparent); color: var(--status-info, var(--mat-sys-tertiary)); }
      &--completed    { background: color-mix(in srgb, var(--status-success) 12%, transparent); color: var(--status-success); }
      &--cancelled    { background: color-mix(in srgb, var(--status-danger) 12%, transparent); color: var(--status-danger); }
    }
  `,
})
export class WpStatusChipComponent {
  readonly status = input.required<WorkPackageStatus>();
  protected readonly labels = WP_STATUS_LABELS;
}
