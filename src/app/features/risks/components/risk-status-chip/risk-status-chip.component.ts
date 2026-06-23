import { Component, input } from '@angular/core';
import { RiskStatus, RISK_STATUS_LABELS } from '../../contracts/risk.contracts';

@Component({
  selector: 'app-risk-status-chip',
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
      &--mitigated   { background: color-mix(in srgb, #2e7d32 12%, transparent); color: #2e7d32; }
      &--closed      { background: color-mix(in srgb, #546e7a 12%, transparent); color: #546e7a; }
      &--materialised{ background: color-mix(in srgb, var(--mat-sys-error) 12%, transparent); color: var(--mat-sys-error); }
    }
  `,
})
export class RiskStatusChipComponent {
  readonly status = input.required<RiskStatus>();
  protected readonly labels = RISK_STATUS_LABELS;
}
