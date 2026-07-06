import { Component, input } from '@angular/core';
import { AC_DECISION_LABELS, AcceptanceCriterionDecision } from '../../contracts/acceptance-criterion.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const TONES: Record<AcceptanceCriterionDecision, StatusChipTone> = {
  pending: 'neutral',
  accepted: 'success',
  rejected: 'danger',
};

@Component({
  selector: 'app-ac-decision-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [tone]="tones[decision()]" [label]="labels[decision()]" />`,
})
export class AcDecisionChipComponent {
  readonly decision = input.required<AcceptanceCriterionDecision>();
  protected readonly tones = TONES;
  protected readonly labels = AC_DECISION_LABELS;
}
