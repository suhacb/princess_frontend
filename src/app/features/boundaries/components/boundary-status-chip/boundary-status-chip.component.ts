import { Component, computed, input } from '@angular/core';
import { BOUNDARY_STATUS_LABELS, BoundaryStatus } from '../../contracts/boundary.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const BOUNDARY_TONES: Record<BoundaryStatus, StatusChipTone> = {
  draft:     'neutral',
  submitted: 'primary',
  approved:  'success',
  rejected:  'danger',
};

@Component({
  selector: 'app-boundary-status-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [label]="label()" [tone]="tone()" />`,
})
export class BoundaryStatusChipComponent {
  readonly status = input.required<BoundaryStatus>();
  protected readonly label = computed(() => BOUNDARY_STATUS_LABELS[this.status()]);
  protected readonly tone = computed(() => BOUNDARY_TONES[this.status()]);
}
