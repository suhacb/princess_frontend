import { Component, input } from '@angular/core';
import { PRODUCT_STATUS_LABELS, ProductStatus } from '../../contracts/work-package.contracts';

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

      &--draft         { background: color-mix(in srgb, var(--status-neutral) 12%, transparent); color: var(--status-neutral); }
      &--in_development{ background: color-mix(in srgb, var(--mat-sys-primary) 12%, transparent); color: var(--mat-sys-primary); }
      &--baselined     { background: color-mix(in srgb, var(--status-success) 12%, transparent); color: var(--status-success); }
      &--superseded    { background: color-mix(in srgb, var(--status-warning) 12%, transparent); color: var(--status-warning); }
    }
  `,
})
export class WbsStatusChipComponent {
  readonly status = input.required<ProductStatus>();
  protected readonly labels = PRODUCT_STATUS_LABELS;
}
