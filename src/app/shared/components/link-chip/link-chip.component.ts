import { Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type LinkChipType =
  | 'risk' | 'issue' | 'change' | 'stage' | 'document' | 'quality' | 'lesson';

const TYPE_ICONS: Record<LinkChipType, string> = {
  risk:     'warning_amber',
  issue:    'bug_report',
  change:   'sync_alt',
  stage:    'layers',
  document: 'description',
  quality:  'fact_check',
  lesson:   'school',
};

const TYPE_COLORS: Record<LinkChipType, string> = {
  risk:     '#ba1a1a',
  issue:    '#f57c00',
  change:   '#475d92',
  stage:    '#2e7d32',
  document: '#546e7a',
  quality:  '#475d92',
  lesson:   '#546e7a',
};

@Component({
  selector: 'app-link-chip',
  imports: [MatIconModule],
  template: `
    <button
      class="link-chip"
      type="button"
      [style.--lc-color]="color()"
      [attr.aria-label]="label()"
      (click)="clicked.emit()"
    >
      <mat-icon class="link-chip__icon">{{ resolvedIcon() }}</mat-icon>
      <span class="link-chip__label">{{ label() }}</span>
    </button>
  `,
  styles: `
    .link-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 26px;
      padding: 0 10px 0 8px;
      border-radius: var(--radius-chip);
      border: 1px solid color-mix(in srgb, var(--lc-color) 30%, transparent);
      background: color-mix(in srgb, var(--lc-color) 8%, transparent);
      color: var(--lc-color);
      font-family: var(--font-display);
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition:
        background var(--duration-fast) var(--ease-standard),
        border-color var(--duration-fast) var(--ease-standard);

      &:hover {
        background: color-mix(in srgb, var(--lc-color) 14%, transparent);
        border-color: color-mix(in srgb, var(--lc-color) 50%, transparent);
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--lc-color) 35%, transparent);
      }

      &__icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
        flex-shrink: 0;
      }

      &__label {
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
      }
    }
  `,
})
export class LinkChipComponent {
  readonly type = input<LinkChipType>('document');
  readonly icon = input<string>('');
  readonly label = input.required<string>();

  readonly clicked = output<void>();

  protected readonly resolvedIcon = computed(() => this.icon() || TYPE_ICONS[this.type()]);
  protected readonly color = computed(() => TYPE_COLORS[this.type()]);
}
