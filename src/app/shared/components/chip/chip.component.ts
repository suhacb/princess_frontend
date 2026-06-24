import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chip',
  imports: [MatIconModule],
  template: `
    <span class="chip" [class.chip--selected]="selected()">
      <ng-content />
      @if (removable()) {
        <button
          class="chip__remove"
          type="button"
          aria-label="Remove"
          (click)="removed.emit()"
        >
          <mat-icon>close</mat-icon>
        </button>
      }
    </span>
  `,
  styles: `
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 32px;
      padding: 0 12px;
      border-radius: var(--radius-chip);
      border: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container-lowest);
      font-family: var(--font-display);
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--mat-sys-on-surface-variant);
      cursor: default;
      transition:
        background var(--duration-base) var(--ease-standard),
        border-color var(--duration-base) var(--ease-standard),
        color var(--duration-base) var(--ease-standard);

      ::ng-deep mat-icon,
      ::ng-deep .material-icons {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &:hover {
        background: color-mix(in srgb, var(--mat-sys-on-surface) 5%, transparent);
      }

      &--selected {
        background: color-mix(in srgb, var(--mat-sys-primary) 12%, transparent);
        border-color: transparent;
        color: var(--mat-sys-primary);
      }
    }

    .chip__remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      padding: 0;
      margin-left: 2px;
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      border-radius: var(--radius-full);
      transition: background var(--duration-fast) var(--ease-standard);

      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }

      &:hover {
        background: color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent);
      }
    }
  `,
})
export class ChipComponent {
  readonly selected = input<boolean>(false);
  readonly removable = input<boolean>(false);
  readonly removed = output<void>();
}
