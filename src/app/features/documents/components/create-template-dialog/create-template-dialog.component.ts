import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  DocumentCategory,
  DocumentType,
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_TYPE_BY_CATEGORY,
} from '../../contracts/document.contracts';
import {
  DocumentTemplateNode,
  TemplateNodeKind,
  CreateTemplatePayload,
} from '../../contracts/document-template.contracts';

export interface CreateTemplateDialogData {
  parent: DocumentTemplateNode | null;
}

@Component({
  selector: 'app-create-template-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Template name" />
        </mat-form-field>

        @if (childKind === 'category') {
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Document category</mat-label>
            <mat-select formControlName="category">
              @for (cat of categories; track cat) {
                <mat-option [value]="cat">{{ categoryLabels[cat] }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        }

        @if (childKind === 'type') {
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Document type</mat-label>
            <mat-select formControlName="type">
              @for (t of availableTypes; track t.key) {
                <mat-option [value]="t.key">{{ t.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        }

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description (optional)</mat-label>
          <textarea matInput formControlName="description" rows="2"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="confirm()">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 4px; min-width: 420px; padding-top: 8px; }
    .full-width { width: 100%; }
  `,
})
export class CreateTemplateDialogComponent {
  protected readonly data = inject<CreateTemplateDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CreateTemplateDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly categories = DOCUMENT_CATEGORIES;
  protected readonly categoryLabels = DOCUMENT_CATEGORY_LABELS;

  protected get childKind(): TemplateNodeKind {
    if (!this.data.parent) return 'root';
    if (this.data.parent.kind === 'root') return 'category';
    return 'type';
  }

  protected get availableTypes(): { key: DocumentType; label: string }[] {
    const parentCategory = this.data.parent?.category;
    if (!parentCategory) return [];
    return DOCUMENT_TYPE_BY_CATEGORY[parentCategory];
  }

  protected get title(): string {
    if (!this.data.parent) return 'Create root template';
    if (this.data.parent.kind === 'root') return 'Add category template';
    return 'Add type template';
  }

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    category: [null as DocumentCategory | null],
    type: [null as DocumentType | null],
    description: [''],
  });

  constructor() {
    if (this.childKind === 'category') {
      this.form.controls.category.setValidators(Validators.required);
    }
    if (this.childKind === 'type') {
      this.form.controls.type.setValidators(Validators.required);
    }
  }

  protected confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: CreateTemplatePayload = {
      name: v.name!,
      parent_id: this.data.parent?.id ?? null,
      description: v.description || null,
    };
    if (this.childKind === 'category' && v.category) {
      payload.category = v.category;
    }
    if (this.childKind === 'type' && v.type) {
      payload.type = v.type;
      payload.category = this.data.parent?.category ?? undefined;
    }
    this.dialogRef.close(payload);
  }
}
