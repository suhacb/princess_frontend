import { Component, computed, input } from '@angular/core';
import { PROJECT_STATUS_LABELS, ProjectStatus } from '../../contracts/project.contracts';

@Component({
  selector: 'app-project-status-chip',
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

    .status-chip--pre_project {
      background: color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent);
      color: var(--mat-sys-on-surface-variant);
    }

    .status-chip--initiation {
      background: color-mix(in srgb, var(--mat-sys-primary) 15%, transparent);
      color: var(--mat-sys-primary);
    }

    .status-chip--delivery {
      background: color-mix(in srgb, #1b5e20 15%, transparent);
      color: #2e7d32;
    }

    .status-chip--closing {
      background: color-mix(in srgb, var(--mat-sys-tertiary) 15%, transparent);
      color: var(--mat-sys-tertiary);
    }

    .status-chip--closed {
      background: color-mix(in srgb, var(--mat-sys-on-surface) 8%, transparent);
      color: var(--mat-sys-on-surface-variant);
    }
  `,
})
export class ProjectStatusChipComponent {
  readonly status = input.required<ProjectStatus>();
  protected readonly label = computed(() => PROJECT_STATUS_LABELS[this.status()]);
}
