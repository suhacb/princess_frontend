import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CHANGE_REQUEST_TYPES,
  CHANGE_REQUEST_TYPE_LABELS,
  ChangeRequestType,
  CreateChangePayload,
} from '../../contracts/change.contracts';

@Component({
  selector: 'app-create-change-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Raise Change Request</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="request_type">
            @for (t of types; track t) {
              <mat-option [value]="t">{{ typeLabels[t] }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Brief summary of the change request" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description (optional)</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="What needs to change and why?"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Impact assessment (optional)</mat-label>
          <textarea matInput formControlName="impact_assessment" rows="3" placeholder="Time, cost, scope, quality impact…"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Priority (optional)</mat-label>
            <input matInput formControlName="priority" placeholder="e.g. high, medium, low" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Implementation due (optional)</mat-label>
            <input matInput type="date" formControlName="implementation_due" />
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="confirm()">Raise</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 4px; min-width: 520px; padding-top: 8px; }
    .form-row { display: flex; gap: 12px; mat-form-field { flex: 1; } }
    .full-width { width: 100%; }
  `,
})
export class CreateChangeDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateChangeDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly types = CHANGE_REQUEST_TYPES;
  protected readonly typeLabels = CHANGE_REQUEST_TYPE_LABELS;

  protected readonly form = this.fb.group({
    request_type: ['' as ChangeRequestType, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    impact_assessment: [''],
    priority: [''],
    implementation_due: [''],
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: CreateChangePayload = {
      request_type: v.request_type as ChangeRequestType,
      title: v.title!,
      description: v.description || null,
      impact_assessment: v.impact_assessment || null,
      priority: v.priority || null,
      implementation_due: v.implementation_due || null,
    };
    this.dialogRef.close(payload);
  }
}
