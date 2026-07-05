import { Component, input } from '@angular/core';
import { RequirementStatus, REQUIREMENT_STATUS_LABELS } from '../../contracts/requirement.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const TONES: Record<RequirementStatus, StatusChipTone> = {
  draft: 'neutral',
  reviewed: 'primary',
  approved: 'success',
  rejected: 'danger',
  deferred: 'warning',
};

@Component({
  selector: 'app-requirement-status-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [tone]="tones[status()]" [label]="labels[status()]" />`,
})
export class RequirementStatusChipComponent {
  readonly status = input.required<RequirementStatus>();
  protected readonly tones = TONES;
  protected readonly labels = REQUIREMENT_STATUS_LABELS;
}
