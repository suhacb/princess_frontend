import { Component, input } from '@angular/core';
import { AC_STATUS_LABELS, AcceptanceCriterionStatus } from '../../contracts/acceptance-criterion.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const TONES: Record<AcceptanceCriterionStatus, StatusChipTone> = {
  draft: 'neutral',
  approved: 'success',
};

@Component({
  selector: 'app-ac-status-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [tone]="tones[status()]" [label]="labels[status()]" />`,
})
export class AcStatusChipComponent {
  readonly status = input.required<AcceptanceCriterionStatus>();
  protected readonly tones = TONES;
  protected readonly labels = AC_STATUS_LABELS;
}
