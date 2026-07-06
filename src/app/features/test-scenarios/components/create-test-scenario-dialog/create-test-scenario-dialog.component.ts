import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  AcceptanceCriterionRef,
  CreateTestScenarioPayload,
  TEST_SCENARIO_TYPE_LABELS,
  TestScenarioType,
} from '../../contracts/test-scenario.contracts';

export interface CreateTestScenarioDialogData {
  acceptanceCriteria: AcceptanceCriterionRef[];
  preselectedAcceptanceCriterionId?: number;
}

@Component({
  selector: 'app-create-test-scenario-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>New Test Scenario</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              @for (t of typeOptions; track t) {
                <mat-option [value]="t">{{ typeLabels[t] }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Short summary" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description (optional)</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Preconditions (optional)</mat-label>
          <textarea matInput formControlName="preconditions" rows="2"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Linked acceptance criteria (optional)</mat-label>
          <mat-select formControlName="acceptance_criterion_ids" multiple>
            @for (ac of data.acceptanceCriteria; track ac.id) {
              <mat-option [value]="ac.id">{{ ac.ref }} — {{ ac.title }}</mat-option>
            }
          </mat-select>
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
    .form-row { display: flex; gap: 12px; mat-form-field { flex: 1; } }
    .full-width { width: 100%; }
  `,
})
export class CreateTestScenarioDialogComponent {
  protected readonly data = inject<CreateTestScenarioDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CreateTestScenarioDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly typeOptions: TestScenarioType[] = ['feature', 'e2e'];
  protected readonly typeLabels = TEST_SCENARIO_TYPE_LABELS;

  protected readonly form = this.fb.group({
    type: ['feature' as TestScenarioType, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    preconditions: [''],
    acceptance_criterion_ids: [
      this.data.preselectedAcceptanceCriterionId ? [this.data.preselectedAcceptanceCriterionId] : ([] as number[]),
    ],
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: CreateTestScenarioPayload = {
      type: v.type as TestScenarioType,
      title: v.title!,
      description: v.description || null,
      preconditions: v.preconditions || null,
      acceptance_criterion_ids: v.acceptance_criterion_ids ?? [],
    };
    this.dialogRef.close(payload);
  }
}
