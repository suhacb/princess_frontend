import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DocumentTypeSelectComponent } from '../document-type-select/document-type-select.component';
import { CreateDocumentPayload, DocumentType } from '../../contracts/document.contracts';

@Component({
  selector: 'app-create-document-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    DocumentTypeSelectComponent,
  ],
  template: `
    <h2 mat-dialog-title>New Document</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Document title" />
        </mat-form-field>

        <app-document-type-select formControlName="type" />

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description (optional)</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Brief description of the document's purpose"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="confirm()">Create</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 4px; min-width: 480px; padding-top: 8px; }
    .full-width { width: 100%; }
  `,
})
export class CreateDocumentDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateDocumentDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    type: [null as DocumentType | null, Validators.required],
    description: [''],
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: CreateDocumentPayload = {
      title: v.title!,
      type: v.type as DocumentType,
      description: v.description || null,
    };
    this.dialogRef.close(payload);
  }
}
