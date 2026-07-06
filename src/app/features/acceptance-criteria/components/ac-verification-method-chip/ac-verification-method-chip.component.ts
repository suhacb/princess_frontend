import { Component, input } from '@angular/core';
import { VERIFICATION_METHOD_LABELS, VerificationMethod } from '../../contracts/acceptance-criterion.contracts';
import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip.component';

@Component({
  selector: 'app-ac-verification-method-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip tone="neutral" [label]="labels[method()]" />`,
})
export class AcVerificationMethodChipComponent {
  readonly method = input.required<VerificationMethod>();
  protected readonly labels = VERIFICATION_METHOD_LABELS;
}
