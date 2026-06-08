import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="empty-state">
      <mat-icon class="empty-state__icon">{{ icon() }}</mat-icon>
      <h3 class="empty-state__title">{{ title() }}</h3>
      <p class="empty-state__message">{{ message() }}</p>
      @if (actionLabel()) {
        <button mat-stroked-button (click)="actionClick.emit()">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
      gap: 8px;

      &__icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--mat-sys-on-surface-variant);
        opacity: 0.4;
        margin-bottom: 8px;
      }

      &__title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--mat-sys-on-surface);
        font-family: 'Instrument Sans', sans-serif;
      }

      &__message {
        margin: 0 0 16px;
        font-size: 14px;
        color: var(--mat-sys-on-surface-variant);
        max-width: 360px;
        line-height: 1.5;
      }
    }
  `],
})
export class EmptyStateComponent {
  readonly icon = input<string>('inbox');
  readonly title = input<string>('Nothing here');
  readonly message = input<string>('');
  readonly actionLabel = input<string>('');
  readonly actionClick = output<void>();
}
