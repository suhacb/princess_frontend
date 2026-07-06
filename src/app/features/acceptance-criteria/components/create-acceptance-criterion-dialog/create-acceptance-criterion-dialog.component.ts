import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Member } from '../../../members/contracts/member.contracts';
import {
  CreateAcceptanceCriterionPayload,
  RequirementRef,
  VERIFICATION_METHODS,
  VERIFICATION_METHOD_LABELS,
  VerificationMethod,
} from '../../contracts/acceptance-criterion.contracts';

export interface CreateAcceptanceCriterionDialogData {
  requirements: RequirementRef[];
  members: Member[];
  preselectedRequirementId?: number;
}

@Component({
  selector: 'app-create-acceptance-criterion-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>New Acceptance Criterion</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Requirement</mat-label>
          <mat-select formControlName="requirement_id">
            @for (r of data.requirements; track r.id) {
              <mat-option [value]="r.id">{{ r.ref }} — {{ r.title }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Short summary" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Verification method (optional)</mat-label>
            <mat-select formControlName="verification_method">
              <mat-option [value]="null">None</mat-option>
              @for (m of methods; track m) {
                <mat-option [value]="m">{{ methodLabels[m] }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Verifier (optional)</mat-label>
            <mat-select formControlName="verifier_id">
              <mat-option [value]="null">None</mat-option>
              @for (m of data.members; track m.id) {
                <mat-option [value]="m.person.id">{{ m.person.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Measurement method (optional)</mat-label>
          <input matInput formControlName="measurement_method" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Acceptance threshold (optional)</mat-label>
          <input matInput formControlName="acceptance_threshold" placeholder="e.g. Response time under 200ms" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="confirm()">Create</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 4px; min-width: 520px; padding-top: 8px; }
    .form-row { display: flex; gap: 12px; mat-form-field { flex: 1; } }
    .full-width { width: 100%; }
  `,
})
export class CreateAcceptanceCriterionDialogComponent {
  protected readonly data = inject<CreateAcceptanceCriterionDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CreateAcceptanceCriterionDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly methods = VERIFICATION_METHODS;
  protected readonly methodLabels = VERIFICATION_METHOD_LABELS;

  protected readonly form = this.fb.group({
    requirement_id: [this.data.preselectedRequirementId ?? null, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.required],
    verification_method: [null as VerificationMethod | null],
    verifier_id: [null as number | null],
    measurement_method: [''],
    acceptance_threshold: [''],
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: CreateAcceptanceCriterionPayload = {
      requirement_id: v.requirement_id!,
      title: v.title!,
      description: v.description!,
      verification_method: v.verification_method || null,
      verifier_id: v.verifier_id ?? null,
      measurement_method: v.measurement_method || null,
      acceptance_threshold: v.acceptance_threshold || null,
    };
    this.dialogRef.close(payload);
  }
}
