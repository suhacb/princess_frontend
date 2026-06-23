import { Component, computed, input } from '@angular/core';
import { STAGE_STATUS_LABELS, StageStatus } from '../../contracts/stage.contracts';

@Component({
  selector: 'app-stage-status-chip',
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

    .status-chip--planned {
      background: color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent);
      color: var(--mat-sys-on-surface-variant);
    }

    .status-chip--active {
      background: color-mix(in srgb, #1b5e20 15%, transparent);
      color: #2e7d32;
    }

    .status-chip--completed {
      background: color-mix(in srgb, var(--mat-sys-primary) 15%, transparent);
      color: var(--mat-sys-primary);
    }

    .status-chip--exception {
      background: color-mix(in srgb, var(--mat-sys-error) 15%, transparent);
      color: var(--mat-sys-error);
    }
  `,
})
export class StageStatusChipComponent {
  readonly status = input.required<StageStatus>();
  protected readonly label = computed(() => STAGE_STATUS_LABELS[this.status()]);
}
