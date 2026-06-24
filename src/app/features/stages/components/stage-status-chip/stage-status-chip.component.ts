import { Component, computed, input } from '@angular/core';
import { STAGE_STATUS_LABELS, StageStatus } from '../../contracts/stage.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const STAGE_TONES: Record<StageStatus, StatusChipTone> = {
  planned:   'neutral',
  active:    'success',
  completed: 'primary',
  exception: 'danger',
};

@Component({
  selector: 'app-stage-status-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [label]="label()" [tone]="tone()" />`,
})
export class StageStatusChipComponent {
  readonly status = input.required<StageStatus>();
  protected readonly label = computed(() => STAGE_STATUS_LABELS[this.status()]);
  protected readonly tone = computed(() => STAGE_TONES[this.status()]);
}
