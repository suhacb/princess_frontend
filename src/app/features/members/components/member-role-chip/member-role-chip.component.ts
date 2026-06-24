import { Component, computed, input } from '@angular/core';
import { BadgeComponent, BadgeTone } from '../../../../shared/components/badge/badge.component';
import { PROJECT_ROLE_LABELS, ProjectRole, ROLE_GROUP, RoleGroup } from '../../contracts/member.contracts';

const GROUP_TONE: Record<RoleGroup, BadgeTone> = {
  board:      'tertiary',
  management: 'primary',
  assurance:  'info',
  change:     'warning',
  team:       'neutral',
  observer:   'neutral',
};

@Component({
  selector: 'app-member-role-chip',
  imports: [BadgeComponent],
  template: `<app-badge [tone]="tone()">{{ label() }}</app-badge>`,
})
export class MemberRoleChipComponent {
  readonly role = input.required<ProjectRole>();
  protected readonly label = computed(() => PROJECT_ROLE_LABELS[this.role()]);
  protected readonly tone = computed(() => GROUP_TONE[ROLE_GROUP[this.role()]]);
}
