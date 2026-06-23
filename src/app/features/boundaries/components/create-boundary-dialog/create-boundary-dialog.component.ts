import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  BOUNDARY_TYPES,
  BOUNDARY_TYPE_LABELS,
  BoundaryType,
  CreateBoundaryPayload,
} from '../../contracts/boundary.contracts';

@Component({
  selector: 'app-create-boundary-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>New Boundary</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="create-form">
        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            @for (type of types; track type) {
              <mat-option [value]="type">{{ typeLabels[type] }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Title (optional)</mat-label>
          <input matInput formControlName="title" placeholder="e.g. End of Initiation Stage" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button [disabled]="form.invalid" (click)="confirm()">Create</button>
    </mat-dialog-actions>
  `,
  styles: `
    .create-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 360px;
      padding-top: 8px;
    }
    mat-form-field { width: 100%; }
  `,
})
export class CreateBoundaryDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateBoundaryDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly types = BOUNDARY_TYPES;
  protected readonly typeLabels = BOUNDARY_TYPE_LABELS;

  protected readonly form = this.fb.group({
    type: ['' as BoundaryType, Validators.required],
    title: [''],
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const payload: CreateBoundaryPayload = {
      type: this.form.value.type as BoundaryType,
      title: this.form.value.title || null,
    };
    this.dialogRef.close(payload);
  }
}
