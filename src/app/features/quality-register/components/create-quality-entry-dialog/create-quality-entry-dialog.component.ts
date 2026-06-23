import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  QUALITY_METHODS,
  QUALITY_METHOD_LABELS,
  QualityMethod,
  CreateQualityEntryPayload,
} from '../../contracts/quality-register.contracts';

@Component({
  selector: 'app-create-quality-entry-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Add Quality Entry</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product name</mat-label>
          <input matInput formControlName="product_name" placeholder="Name of the product being reviewed" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Quality method</mat-label>
          <mat-select formControlName="quality_method">
            @for (m of methods; track m) {
              <mat-option [value]="m">{{ methodLabels[m] }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Planned date (optional)</mat-label>
          <input matInput type="date" formControlName="planned_date" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="confirm()">Add</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 4px; min-width: 480px; padding-top: 8px; }
    .full-width { width: 100%; }
  `,
})
export class CreateQualityEntryDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateQualityEntryDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly methods = QUALITY_METHODS;
  protected readonly methodLabels = QUALITY_METHOD_LABELS;

  protected readonly form = this.fb.group({
    product_name: ['', [Validators.required, Validators.maxLength(255)]],
    quality_method: ['' as QualityMethod, Validators.required],
    planned_date: [''],
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: CreateQualityEntryPayload = {
      product_name: v.product_name!,
      quality_method: v.quality_method as QualityMethod,
      planned_date: v.planned_date || null,
    };
    this.dialogRef.close(payload);
  }
}
