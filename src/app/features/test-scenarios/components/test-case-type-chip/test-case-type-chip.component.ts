import { Component, input } from '@angular/core';
import { TestCaseType, TEST_CASE_TYPE_LABELS } from '../../contracts/test-case.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const TONES: Record<TestCaseType, StatusChipTone> = {
  positive: 'success',
  negative: 'danger',
  edge: 'warning',
};

@Component({
  selector: 'app-test-case-type-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [tone]="tones[type()]" [label]="labels[type()]" />`,
})
export class TestCaseTypeChipComponent {
  readonly type = input.required<TestCaseType>();
  protected readonly tones = TONES;
  protected readonly labels = TEST_CASE_TYPE_LABELS;
}
