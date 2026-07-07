import { Component, input } from '@angular/core';
import { TestSessionStatus, TEST_SESSION_STATUS_LABELS } from '../../contracts/test-session.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const TONES: Record<TestSessionStatus, StatusChipTone> = {
  planned: 'neutral',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'danger',
};

@Component({
  selector: 'app-test-session-status-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [tone]="tones[status()]" [label]="labels[status()]" />`,
})
export class TestSessionStatusChipComponent {
  readonly status = input.required<TestSessionStatus>();
  protected readonly tones = TONES;
  protected readonly labels = TEST_SESSION_STATUS_LABELS;
}
