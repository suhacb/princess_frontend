import { Component, computed, input } from '@angular/core';
import { riskScoreClass } from '../../contracts/risk.contracts';

@Component({
  selector: 'app-risk-score-badge',
  imports: [],
  template: `<span class="score-badge score-badge--{{ scoreClass() }}">{{ score() }}</span>`,
  styles: `
    .score-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 0.8rem;
      font-weight: 700;
      &--low      { background: color-mix(in srgb, #2e7d32 15%, transparent); color: #2e7d32; }
      &--medium   { background: color-mix(in srgb, #f9a825 15%, transparent); color: #f57f17; }
      &--high     { background: color-mix(in srgb, #e65100 15%, transparent); color: #e65100; }
      &--critical { background: color-mix(in srgb, var(--mat-sys-error) 15%, transparent); color: var(--mat-sys-error); }
    }
  `,
})
export class RiskScoreBadgeComponent {
  readonly score = input.required<number>();
  protected readonly scoreClass = computed(() => riskScoreClass(this.score()));
}
