import { Component, input } from '@angular/core';
import { QualityResult, QUALITY_RESULT_LABELS } from '../../contracts/quality-register.contracts';

@Component({
  selector: 'app-quality-result-chip',
  imports: [],
  template: `<span class="result-chip result-chip--{{ result() }}">{{ labels[result()] }}</span>`,
  styles: `
    .result-chip {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      &--passed      { background: color-mix(in srgb, #2e7d32 12%, transparent); color: #2e7d32; }
      &--failed      { background: color-mix(in srgb, var(--mat-sys-error) 12%, transparent); color: var(--mat-sys-error); }
      &--conditional { background: color-mix(in srgb, #f9a825 12%, transparent); color: #f57f17; }
    }
  `,
})
export class QualityResultChipComponent {
  readonly result = input.required<QualityResult>();
  protected readonly labels = QUALITY_RESULT_LABELS;
}
