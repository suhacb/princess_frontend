import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lifecycle-stepper',
  imports: [MatIconModule],
  template: `
    <div class="stepper">
      @for (step of steps(); track step; let i = $index) {
        @if (i > 0) {
          <div class="stepper__connector" [class.stepper__connector--done]="i <= activeIndex()"></div>
        }
        <div class="stepper__step">
          <div
            class="stepper__dot"
            [class.stepper__dot--done]="i < activeIndex()"
            [class.stepper__dot--active]="i === activeIndex()"
          >
            @if (i < activeIndex()) {
              <mat-icon class="stepper__check">check</mat-icon>
            }
          </div>
          <span
            class="stepper__label"
            [class.stepper__label--done]="i < activeIndex()"
            [class.stepper__label--active]="i === activeIndex()"
          >{{ step }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    .stepper {
      display: flex;
      align-items: flex-start;
      padding: 16px 20px;
      background: var(--mat-sys-surface-container-low);
      border-radius: var(--radius-card);
      font-family: var(--font-display);
    }

    .stepper__step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      min-width: 90px;
    }

    .stepper__connector {
      flex: 1;
      height: 2px;
      background: var(--mat-sys-outline-variant);
      margin-bottom: 22px;
      transition: background var(--duration-base) var(--ease-standard);

      &--done {
        background: var(--mat-sys-primary);
      }
    }

    .stepper__dot {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: var(--radius-full);
      border: 2px solid var(--mat-sys-outline);
      background: var(--mat-sys-surface);
      transition:
        background var(--duration-base) var(--ease-standard),
        border-color var(--duration-base) var(--ease-standard);

      &--done {
        background: var(--mat-sys-primary);
        border-color: var(--mat-sys-primary);
      }

      &--active {
        border: 3px solid var(--mat-sys-primary);
        background: color-mix(in srgb, var(--mat-sys-primary) 12%, transparent);
      }
    }

    .stepper__check {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #fff;
    }

    .stepper__label {
      font-size: 0.7rem;
      color: var(--mat-sys-on-surface-variant);
      text-align: center;
      transition: color var(--duration-base) var(--ease-standard);

      &--done {
        color: var(--mat-sys-primary);
      }

      &--active {
        color: var(--mat-sys-primary);
        font-weight: 600;
      }
    }
  `,
})
export class LifecycleStepperComponent {
  readonly steps = input.required<string[]>();
  readonly activeIndex = input<number>(0);
}
