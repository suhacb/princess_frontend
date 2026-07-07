import { Component, input } from '@angular/core';
import { TestResultStatus, TEST_RESULT_STATUS_LABELS } from '../../contracts/test-session-result.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const TONES: Record<TestResultStatus, StatusChipTone> = {
  pass: 'success',
  fail: 'danger',
  blocked: 'warning',
  not_run: 'neutral',
  skipped: 'neutral',
};

@Component({
  selector: 'app-test-result-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [tone]="tones[result()]" [label]="labels[result()]" />`,
})
export class TestResultChipComponent {
  readonly result = input.required<TestResultStatus>();
  protected readonly tones = TONES;
  protected readonly labels = TEST_RESULT_STATUS_LABELS;
}
