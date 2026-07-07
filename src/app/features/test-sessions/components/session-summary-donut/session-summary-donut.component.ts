import { Component, computed, input } from '@angular/core';
import { TestSessionReportSummary } from '../../contracts/test-session.contracts';

interface DonutSegment {
  key: string;
  label: string;
  value: number;
  color: string;
  dashArray: string;
  dashOffset: number;
}

const SEGMENT_META: { key: keyof TestSessionReportSummary; label: string; color: string }[] = [
  { key: 'pass', label: 'Pass', color: 'var(--status-success)' },
  { key: 'fail', label: 'Fail', color: 'var(--status-danger)' },
  { key: 'blocked', label: 'Blocked', color: 'var(--status-warning)' },
  { key: 'not_run', label: 'Not run', color: 'var(--status-neutral)' },
  { key: 'skipped', label: 'Skipped', color: 'var(--mat-sys-outline-variant)' },
];

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

@Component({
  selector: 'app-session-summary-donut',
  template: `
    <div class="donut-wrap">
      <svg viewBox="0 0 100 100" class="donut" role="img" [attr.aria-label]="'Result summary: ' + total() + ' total results'">
        <circle cx="50" cy="50" [attr.r]="radius" class="donut-track" />
        @for (seg of segments(); track seg.key) {
          @if (seg.value > 0) {
            <circle
              cx="50" cy="50" [attr.r]="radius"
              class="donut-segment"
              [attr.stroke]="seg.color"
              [attr.stroke-dasharray]="seg.dashArray"
              [attr.stroke-dashoffset]="seg.dashOffset"
            />
          }
        }
        <text x="50" y="47" text-anchor="middle" class="donut-total">{{ total() }}</text>
        <text x="50" y="62" text-anchor="middle" class="donut-total-label">results</text>
      </svg>
      <ul class="donut-legend">
        @for (seg of segments(); track seg.key) {
          <li>
            <span class="legend-swatch" [style.background]="seg.color"></span>
            {{ seg.label }}: {{ seg.value }}
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './session-summary-donut.component.scss',
})
export class SessionSummaryDonutComponent {
  readonly summary = input.required<TestSessionReportSummary>();

  protected readonly radius = RADIUS;

  protected readonly total = computed(() => {
    const s = this.summary();
    return s.pass + s.fail + s.blocked + s.not_run + s.skipped;
  });

  protected readonly segments = computed<DonutSegment[]>(() => {
    const s = this.summary();
    const total = this.total();
    let offsetAccumulated = 0;
    return SEGMENT_META.map(meta => {
      const value = s[meta.key];
      const fraction = total > 0 ? value / total : 0;
      const length = fraction * CIRCUMFERENCE;
      const dashArray = `${length} ${CIRCUMFERENCE - length}`;
      const dashOffset = -offsetAccumulated;
      offsetAccumulated += length;
      return { key: meta.key, label: meta.label, value, color: meta.color, dashArray, dashOffset };
    });
  });
}
