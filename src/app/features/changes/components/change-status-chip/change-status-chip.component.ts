import { Component, input } from '@angular/core';
import { ChangeStatus, CHANGE_STATUS_LABELS } from '../../contracts/change.contracts';

@Component({
  selector: 'app-change-status-chip',
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
      &--proposed    { background: color-mix(in srgb, var(--mat-sys-primary) 12%, transparent); color: var(--mat-sys-primary); }
      &--assessed    { background: color-mix(in srgb, #f9a825 12%, transparent); color: #f57f17; }
      &--approved    { background: color-mix(in srgb, #2e7d32 12%, transparent); color: #2e7d32; }
      &--rejected    { background: color-mix(in srgb, var(--mat-sys-error) 12%, transparent); color: var(--mat-sys-error); }
      &--implemented { background: color-mix(in srgb, #00897b 12%, transparent); color: #00695c; }
    }
  `,
})
export class ChangeStatusChipComponent {
  readonly status = input.required<ChangeStatus>();
  protected readonly labels = CHANGE_STATUS_LABELS;
}
