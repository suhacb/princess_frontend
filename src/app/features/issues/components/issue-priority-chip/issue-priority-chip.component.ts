import { Component, computed, input } from '@angular/core';
import { BadgeComponent, BadgeTone } from '../../../../shared/components/badge/badge.component';
import { IssuePriority, ISSUE_PRIORITY_LABELS } from '../../contracts/issue.contracts';

const PRIORITY_TONES: Record<IssuePriority, BadgeTone> = {
  low:      'neutral',
  medium:   'warning',
  high:     'danger',
  critical: 'danger',
};

@Component({
  selector: 'app-issue-priority-chip',
  imports: [BadgeComponent],
  template: `<app-badge [tone]="tone()" [solid]="priority() === 'critical'">{{ labels[priority()] }}</app-badge>`,
})
export class IssuePriorityChipComponent {
  readonly priority = input.required<IssuePriority>();
  protected readonly labels = ISSUE_PRIORITY_LABELS;
  protected readonly tone = computed(() => PRIORITY_TONES[this.priority()]);
}
