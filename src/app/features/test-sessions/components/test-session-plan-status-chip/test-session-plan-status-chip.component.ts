import { Component, input } from '@angular/core';
import { TestSessionPlanStatus, TEST_SESSION_PLAN_STATUS_LABELS } from '../../contracts/test-session-plan.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const TONES: Record<TestSessionPlanStatus, StatusChipTone> = {
  draft: 'neutral',
  active: 'primary',
  completed: 'success',
  cancelled: 'danger',
};

@Component({
  selector: 'app-test-session-plan-status-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [tone]="tones[status()]" [label]="labels[status()]" />`,
})
export class TestSessionPlanStatusChipComponent {
  readonly status = input.required<TestSessionPlanStatus>();
  protected readonly tones = TONES;
  protected readonly labels = TEST_SESSION_PLAN_STATUS_LABELS;
}
