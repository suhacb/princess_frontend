import { Component, input } from '@angular/core';
import {
  TraceabilityDerivedStatus,
  TRACEABILITY_DERIVED_STATUS_LABELS,
} from '../../contracts/traceability.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const TONES: Record<TraceabilityDerivedStatus, StatusChipTone> = {
  not_tested: 'neutral',
  partial: 'warning',
  covered: 'success',
  failing: 'danger',
};

@Component({
  selector: 'app-traceability-status-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [tone]="tones[status()]" [label]="labels[status()]" />`,
})
export class TraceabilityStatusChipComponent {
  readonly status = input.required<TraceabilityDerivedStatus>();
  protected readonly tones = TONES;
  protected readonly labels = TRACEABILITY_DERIVED_STATUS_LABELS;
}
