import { Component, computed, input } from '@angular/core';
import { BOUNDARY_STATUS_LABELS, BoundaryStatus } from '../../contracts/boundary.contracts';

@Component({
  selector: 'app-boundary-status-chip',
  template: `<span class="status-chip status-chip--{{ status() }}">{{ label() }}</span>`,
  styles: `
    .status-chip {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: var(--princess-border-radius-chip);
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .status-chip--draft {
      background: color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent);
      color: var(--mat-sys-on-surface-variant);
    }
    .status-chip--submitted {
      background: color-mix(in srgb, var(--mat-sys-secondary) 15%, transparent);
      color: var(--mat-sys-secondary);
    }
    .status-chip--approved {
      background: color-mix(in srgb, #1b5e20 15%, transparent);
      color: #2e7d32;
    }
    .status-chip--rejected {
      background: color-mix(in srgb, var(--mat-sys-error) 15%, transparent);
      color: var(--mat-sys-error);
    }
  `,
})
export class BoundaryStatusChipComponent {
  readonly status = input.required<BoundaryStatus>();
  protected readonly label = computed(() => BOUNDARY_STATUS_LABELS[this.status()]);
}
