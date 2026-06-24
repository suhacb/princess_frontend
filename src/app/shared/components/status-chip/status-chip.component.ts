import { Component, computed, input } from '@angular/core';

export type StatusChipTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

const STATUS_PRESETS: Record<string, { label: string; color: string }> = {
  pre_project:  { label: 'Pre-Project',  color: '#546e7a' },
  initiation:   { label: 'Initiation',   color: '#475d92' },
  delivery:     { label: 'Delivery',     color: '#2e7d32' },
  closing:      { label: 'Closing',      color: '#8f4d00' },
  closed:       { label: 'Closed',       color: '#546e7a' },
  open:         { label: 'Open',         color: '#475d92' },
  mitigated:    { label: 'Mitigated',    color: '#2e7d32' },
  materialised: { label: 'Materialised', color: '#ba1a1a' },
};

const TONE_COLORS: Record<StatusChipTone, string> = {
  primary: '#475d92',
  success: '#2e7d32',
  warning: '#f57c00',
  danger:  '#ba1a1a',
  neutral: '#546e7a',
};

@Component({
  selector: 'app-status-chip',
  template: `
    <span
      class="status-chip"
      [style.color]="chipColor()"
      [style.background]="chipBg()"
    >{{ displayLabel() }}</span>
  `,
  styles: `
    .status-chip {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: var(--radius-chip);
      font-family: var(--font-display);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      white-space: nowrap;
    }
  `,
})
export class StatusChipComponent {
  readonly status = input<string>();
  readonly tone = input<StatusChipTone>();
  readonly label = input<string>();

  private readonly resolved = computed(() => {
    const s = this.status();
    if (s && STATUS_PRESETS[s]) return STATUS_PRESETS[s];
    const t = this.tone();
    return { label: '', color: t ? TONE_COLORS[t] : TONE_COLORS.neutral };
  });

  protected readonly displayLabel = computed(() => this.label() ?? this.resolved().label);
  protected readonly chipColor = computed(() => this.resolved().color);
  protected readonly chipBg = computed(() => `color-mix(in srgb, ${this.resolved().color} 13%, transparent)`);
}
