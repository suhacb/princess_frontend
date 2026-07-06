import { Component, input } from '@angular/core';
import { TestScenarioStatus, TEST_SCENARIO_STATUS_LABELS } from '../../contracts/test-scenario.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const TONES: Record<TestScenarioStatus, StatusChipTone> = {
  draft: 'neutral',
  ready: 'success',
  obsolete: 'danger',
};

@Component({
  selector: 'app-test-scenario-status-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [tone]="tones[status()]" [label]="labels[status()]" />`,
})
export class TestScenarioStatusChipComponent {
  readonly status = input.required<TestScenarioStatus>();
  protected readonly tones = TONES;
  protected readonly labels = TEST_SCENARIO_STATUS_LABELS;
}
