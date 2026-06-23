import { Component, computed, input } from '@angular/core';
import { PROJECT_ROLE_LABELS, ProjectRole, ROLE_GROUP } from '../../contracts/member.contracts';

@Component({
  selector: 'app-member-role-chip',
  template: `<span class="role-chip role-chip--{{ group() }}">{{ label() }}</span>`,
  styles: `
    .role-chip {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: var(--princess-border-radius-chip);
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
    .role-chip--board {
      background: color-mix(in srgb, var(--mat-sys-tertiary) 15%, transparent);
      color: var(--mat-sys-tertiary);
    }
    .role-chip--management {
      background: color-mix(in srgb, var(--mat-sys-primary) 15%, transparent);
      color: var(--mat-sys-primary);
    }
    .role-chip--assurance {
      background: color-mix(in srgb, var(--mat-sys-secondary) 15%, transparent);
      color: var(--mat-sys-secondary);
    }
    .role-chip--change {
      background: color-mix(in srgb, #f57f17 15%, transparent);
      color: #e65100;
    }
    .role-chip--team {
      background: color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent);
      color: var(--mat-sys-on-surface-variant);
    }
    .role-chip--observer {
      background: transparent;
      color: var(--mat-sys-outline);
      border: 1px solid var(--mat-sys-outline-variant);
    }
  `,
})
export class MemberRoleChipComponent {
  readonly role = input.required<ProjectRole>();
  protected readonly label = computed(() => PROJECT_ROLE_LABELS[this.role()]);
  protected readonly group = computed(() => ROLE_GROUP[this.role()]);
}
