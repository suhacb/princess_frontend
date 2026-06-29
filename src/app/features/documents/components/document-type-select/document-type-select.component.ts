import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  DocumentCategory,
  DocumentType,
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_TYPE_BY_CATEGORY,
} from '../../contracts/document.contracts';

@Component({
  selector: 'app-document-type-select',
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DocumentTypeSelectComponent),
      multi: true,
    },
  ],
  template: `
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>{{ label() }}</mat-label>
      <mat-select [(ngModel)]="value" (ngModelChange)="onChange($event)" (blur)="onTouched()">
        @for (cat of categories; track cat) {
          <mat-optgroup [label]="categoryLabels[cat]">
            @for (t of typesByCategory[cat]; track t.key) {
              <mat-option [value]="t.key">{{ t.label }}</mat-option>
            }
          </mat-optgroup>
        }
      </mat-select>
    </mat-form-field>
  `,
  styles: `.full-width { width: 100%; }`,
})
export class DocumentTypeSelectComponent implements ControlValueAccessor {
  readonly label = input('Document type');

  protected readonly categories: DocumentCategory[] = DOCUMENT_CATEGORIES;
  protected readonly categoryLabels = DOCUMENT_CATEGORY_LABELS;
  protected readonly typesByCategory = DOCUMENT_TYPE_BY_CATEGORY;

  protected value: DocumentType | null = null;
  protected onChange: (v: DocumentType | null) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(v: DocumentType | null): void {
    this.value = v;
  }

  registerOnChange(fn: (v: DocumentType | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
