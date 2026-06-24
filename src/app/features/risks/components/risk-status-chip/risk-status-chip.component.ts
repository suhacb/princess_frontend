import { Component, input } from '@angular/core';
import { RiskStatus } from '../../contracts/risk.contracts';
import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip.component';

@Component({
  selector: 'app-risk-status-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [status]="status()" />`,
})
export class RiskStatusChipComponent {
  readonly status = input.required<RiskStatus>();
}
