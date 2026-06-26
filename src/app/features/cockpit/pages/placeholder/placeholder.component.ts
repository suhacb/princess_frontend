import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-placeholder',
  imports: [MatIconModule],
  template: `
    <div class="placeholder">
      <mat-icon class="placeholder__icon">{{ routeData['icon'] }}</mat-icon>
      <h2 class="placeholder__title">{{ routeData['label'] }}</h2>
      <p class="placeholder__message">{{ routeData['message'] }}</p>
    </div>
  `,
  styles: [`
    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 24px;
      gap: 12px;
      text-align: center;
    }
    .placeholder__icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--mat-sys-on-surface-variant);
      opacity: 0.4;
    }
    .placeholder__title {
      font-family: 'Instrument Sans', sans-serif;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
      margin: 0;
    }
    .placeholder__message {
      font-size: 0.875rem;
      color: var(--mat-sys-on-surface-variant);
      max-width: 360px;
      margin: 0;
    }
  `],
})
export class PlaceholderComponent {
  protected readonly routeData = inject(ActivatedRoute).snapshot.data as Record<string, string>;
}
