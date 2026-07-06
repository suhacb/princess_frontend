import { Component, input } from '@angular/core';
import { TestCasePriority, TEST_CASE_PRIORITY_LABELS } from '../../contracts/test-case.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const TONES: Record<TestCasePriority, StatusChipTone> = {
  low: 'neutral',
  medium: 'primary',
  high: 'danger',
};

@Component({
  selector: 'app-test-case-priority-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [tone]="tones[priority()]" [label]="labels[priority()]" />`,
})
export class TestCasePriorityChipComponent {
  readonly priority = input.required<TestCasePriority>();
  protected readonly tones = TONES;
  protected readonly labels = TEST_CASE_PRIORITY_LABELS;
}
