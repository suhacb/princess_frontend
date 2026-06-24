import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ai-assist-button',
  imports: [MatIconModule],
  template: `
    <button
      class="ai-assist-btn"
      [class.ai-assist-btn--solid]="solid()"
      type="button"
    >
      <mat-icon class="ai-assist-btn__icon">auto_awesome</mat-icon>
      <ng-content />
    </button>
  `,
  styles: `
    .ai-assist-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      height: 36px;
      padding: 0 16px;
      border-radius: var(--radius-pill);
      font-family: var(--font-display);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition:
        filter var(--duration-base) var(--ease-standard),
        background var(--duration-base) var(--ease-standard);

      /* Default: gradient border via padding + background-clip */
      background: var(--mat-sys-surface-container-lowest);
      color: var(--mat-sys-primary);
      border: none;
      position: relative;

      /* Gradient border using outline + box-shadow trick */
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1px;
        background: var(--brand-gradient-diagonal);
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
      }

      &:hover {
        background: color-mix(in srgb, var(--mat-sys-primary) 7%, var(--mat-sys-surface-container-lowest));
      }

      &:focus-visible {
        outline: none;
        box-shadow: var(--focus-ring);
      }

      &__icon {
        font-size: 17px;
        width: 17px;
        height: 17px;
        background: var(--brand-gradient-diagonal);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      /* Solid variant */
      &--solid {
        background: var(--brand-gradient-diagonal);
        color: #fff;

        &::before {
          display: none;
        }

        &:hover {
          filter: brightness(1.06);
        }
      }

      &--solid &__icon {
        background: none;
        -webkit-background-clip: unset;
        background-clip: unset;
        -webkit-text-fill-color: #fff;
        color: #fff;
      }
    }
  `,
})
export class AIAssistButtonComponent {
  readonly solid = input<boolean>(false);
}
