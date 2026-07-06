import { Component, input } from '@angular/core';
import { RequirementPriority, REQUIREMENT_PRIORITY_LABELS } from '../../contracts/requirement.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const TONES: Record<RequirementPriority, StatusChipTone> = {
  must: 'danger',
  should: 'warning',
  could: 'primary',
  wont: 'neutral',
};

@Component({
  selector: 'app-requirement-priority-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [tone]="tones[priority()]" [label]="labels[priority()]" />`,
})
export class RequirementPriorityChipComponent {
  readonly priority = input.required<RequirementPriority>();
  protected readonly tones = TONES;
  protected readonly labels = REQUIREMENT_PRIORITY_LABELS;
}
