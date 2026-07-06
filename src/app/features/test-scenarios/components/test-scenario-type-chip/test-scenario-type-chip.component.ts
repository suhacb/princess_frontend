import { Component, input } from '@angular/core';
import { TestScenarioType, TEST_SCENARIO_TYPE_LABELS } from '../../contracts/test-scenario.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const TONES: Record<TestScenarioType, StatusChipTone> = {
  feature: 'primary',
  e2e: 'warning',
};

@Component({
  selector: 'app-test-scenario-type-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [tone]="tones[type()]" [label]="labels[type()]" />`,
})
export class TestScenarioTypeChipComponent {
  readonly type = input.required<TestScenarioType>();
  protected readonly tones = TONES;
  protected readonly labels = TEST_SCENARIO_TYPE_LABELS;
}
