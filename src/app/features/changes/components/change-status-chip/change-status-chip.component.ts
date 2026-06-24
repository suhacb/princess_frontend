import { Component, computed, input } from '@angular/core';
import { ChangeStatus, CHANGE_STATUS_LABELS } from '../../contracts/change.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const CHANGE_TONES: Record<ChangeStatus, StatusChipTone> = {
  proposed:    'primary',
  assessed:    'warning',
  approved:    'success',
  rejected:    'danger',
  implemented: 'success',
};

@Component({
  selector: 'app-change-status-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [label]="label()" [tone]="tone()" />`,
})
export class ChangeStatusChipComponent {
  readonly status = input.required<ChangeStatus>();
  protected readonly label = computed(() => CHANGE_STATUS_LABELS[this.status()]);
  protected readonly tone = computed(() => CHANGE_TONES[this.status()]);
}
