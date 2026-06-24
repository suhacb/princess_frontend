import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ai-suggestion-card',
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="ai-card">
      <div class="ai-card__header">
        <span class="ai-card__spark-tile">
          <mat-icon class="ai-card__spark-icon">auto_awesome</mat-icon>
        </span>
        <span class="ai-card__eyebrow">{{ eyebrow() }}</span>
      </div>

      <p class="ai-card__title">{{ title() }}</p>
      <div class="ai-card__body"><ng-content /></div>

      <div class="ai-card__actions">
        <button mat-flat-button class="ai-card__accept" (click)="accepted.emit()">
          <mat-icon>check</mat-icon>
          {{ acceptLabel() }}
        </button>
        <button mat-button class="ai-card__dismiss" (click)="dismissed.emit()">
          {{ dismissLabel() }}
        </button>
      </div>
    </div>
  `,
  styles: `
    .ai-card {
      position: relative;
      border-radius: var(--radius-card);
      padding: 16px 18px;
      background: color-mix(in srgb, var(--mat-sys-primary) 6%, var(--mat-sys-surface-container-lowest));
      border: 1px solid color-mix(in srgb, var(--mat-sys-primary) 22%, transparent);
      overflow: hidden;

      /* 3px left gradient accent bar */
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: var(--brand-gradient);
      }

      &__header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }

      &__spark-tile {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: var(--brand-gradient-diagonal);
        flex-shrink: 0;
      }

      &__spark-icon {
        font-size: 15px;
        width: 15px;
        height: 15px;
        color: #fff;
      }

      &__eyebrow {
        font-family: var(--font-display);
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--mat-sys-primary);
      }

      &__title {
        margin: 0 0 6px;
        font-family: var(--font-display);
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--mat-sys-on-surface);
      }

      &__body {
        font-family: var(--font-sans);
        font-size: 0.875rem;
        line-height: 1.5;
        color: var(--mat-sys-on-surface-variant);
      }

      &__actions {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 14px;
      }

      &__accept.mat-mdc-button {
        height: 34px;
        border-radius: var(--radius-pill);
        font-family: var(--font-display);
        font-size: 0.8125rem;
      }

      &__dismiss.mat-mdc-button {
        height: 34px;
        border-radius: var(--radius-pill);
        font-family: var(--font-display);
        font-size: 0.8125rem;
        color: var(--mat-sys-on-surface-variant);
      }
    }
  `,
})
export class AISuggestionCardComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input<string>('AI Suggestion');
  readonly acceptLabel = input<string>('Apply');
  readonly dismissLabel = input<string>('Dismiss');

  readonly accepted = output<void>();
  readonly dismissed = output<void>();
}
