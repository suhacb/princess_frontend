import { Component, OnInit, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DocumentTypeSelectComponent } from '../document-type-select/document-type-select.component';
import { ClassifyDocumentPayload, Document, DocumentType } from '../../contracts/document.contracts';

@Component({
  selector: 'app-classify-panel',
  imports: [
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    DocumentTypeSelectComponent,
  ],
  templateUrl: './classify-panel.component.html',
  styleUrl: './classify-panel.component.scss',
})
export class ClassifyPanelComponent implements OnInit {
  readonly document = input.required<Document>();

  readonly accepted = output<ClassifyDocumentPayload>();
  readonly skipped = output<void>();

  protected readonly selectedType = signal<DocumentType | null>(null);
  protected readonly tags = signal<string[]>([]);
  protected readonly separatorKeyCodes = [ENTER, COMMA];

  ngOnInit(): void {
    this.selectedType.set(this.document().type);
    this.tags.set([...this.document().tags]);
  }

  protected addTag(event: MatChipInputEvent): void {
    const value = (event.value ?? '').trim();
    if (value && !this.tags().includes(value)) {
      this.tags.update(t => [...t, value]);
    }
    event.chipInput?.clear();
  }

  protected removeTag(tag: string): void {
    this.tags.update(t => t.filter(x => x !== tag));
  }

  protected onTypeChange(type: DocumentType | null): void {
    this.selectedType.set(type);
  }

  protected accept(): void {
    const payload: ClassifyDocumentPayload = {};
    const type = this.selectedType();
    if (type) payload.type = type;
    payload.tags = this.tags();
    this.accepted.emit(payload);
  }

  protected skip(): void {
    this.skipped.emit();
  }
}
