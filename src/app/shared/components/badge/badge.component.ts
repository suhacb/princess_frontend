import { Component, computed, input } from '@angular/core';

export type BadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'tertiary';

const TONE_COLORS: Record<BadgeTone, string> = {
  primary:  '#475d92',
  success:  '#2e7d32',
  warning:  '#f57c00',
  danger:   '#ba1a1a',
  neutral:  '#546e7a',
  info:     '#475d92',
  tertiary: '#8f4d00',
};

@Component({
  selector: 'app-badge',
  template: `
    <span
      class="badge"
      [style.color]="badgeColor()"
      [style.background]="badgeBg()"
    ><ng-content /></span>
  `,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 12px;
      font-family: var(--font-display);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      white-space: nowrap;

      ::ng-deep mat-icon,
      ::ng-deep .material-icons {
        font-size: 13px;
        width: 13px;
        height: 13px;
      }
    }
  `,
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('primary');
  readonly solid = input<boolean>(false);

  private readonly color = computed(() => TONE_COLORS[this.tone()]);

  protected readonly badgeColor = computed(() => this.solid() ? '#fff' : this.color());
  protected readonly badgeBg = computed(() =>
    this.solid()
      ? this.color()
      : `color-mix(in srgb, ${this.color()} 12%, transparent)`
  );
}
