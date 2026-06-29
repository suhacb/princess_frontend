import { Component, computed, input } from '@angular/core';
import { DocumentStatus, DOCUMENT_STATUS_LABELS } from '../../contracts/document.contracts';
import { StatusChipComponent, StatusChipTone } from '../../../../shared/components/status-chip/status-chip.component';

const STATUS_TONES: Record<DocumentStatus, StatusChipTone> = {
  draft: 'neutral',
  in_review: 'warning',
  confirmed: 'success',
  superseded: 'neutral',
};

@Component({
  selector: 'app-document-status-chip',
  imports: [StatusChipComponent],
  template: `<app-status-chip [label]="label()" [tone]="tone()" />`,
})
export class DocumentStatusChipComponent {
  readonly status = input.required<DocumentStatus>();
  protected readonly label = computed(() => DOCUMENT_STATUS_LABELS[this.status()]);
  protected readonly tone = computed(() => STATUS_TONES[this.status()]);
}
