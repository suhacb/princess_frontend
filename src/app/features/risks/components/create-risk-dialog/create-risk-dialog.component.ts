import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Member } from '../../../members/contracts/member.contracts';
import {
  RISK_PROXIMITIES,
  RISK_PROXIMITY_LABELS,
  RISK_RESPONSE_TYPES,
  RISK_RESPONSE_TYPE_LABELS,
  SCORE_LEVELS,
  RiskProximity,
  RiskResponseType,
  CreateRiskPayload,
} from '../../contracts/risk.contracts';

export interface CreateRiskDialogData {
  members: Member[];
}

@Component({
  selector: 'app-create-risk-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Raise Risk</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Brief summary of the risk" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category (optional)</mat-label>
          <input matInput formControlName="category" placeholder="e.g. Technical, Resource, External" />
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Probability (1–5)</mat-label>
            <mat-select formControlName="probability">
              @for (n of scoreLevels; track n) {
                <mat-option [value]="n">{{ n }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Impact (1–5)</mat-label>
            <mat-select formControlName="impact">
              @for (n of scoreLevels; track n) {
                <mat-option [value]="n">{{ n }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <div class="score-preview">
            <span class="score-label">Score</span>
            <span class="score-value score-value--{{ previewScoreClass() }}">{{ previewScore() }}</span>
          </div>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Proximity</mat-label>
            <mat-select formControlName="proximity">
              @for (p of proximities; track p) {
                <mat-option [value]="p">{{ proximityLabels[p] }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Response type</mat-label>
            <mat-select formControlName="response_type">
              @for (r of responseTypes; track r) {
                <mat-option [value]="r">{{ responseTypeLabels[r] }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Risk owner</mat-label>
          <mat-select formControlName="risk_owner">
            @for (m of data.members; track m.id) {
              <mat-option [value]="m.person.id">{{ m.person.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description (optional)</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Details, context, potential impact…"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="confirm()">Raise Risk</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 4px; min-width: 520px; padding-top: 8px; }
    .form-row { display: flex; gap: 12px; align-items: flex-start; mat-form-field { flex: 1; } }
    .full-width { width: 100%; }
    .score-preview {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-width: 56px; padding-bottom: 22px;
    }
    .score-label { font-size: 0.7rem; color: var(--mat-sys-on-surface-variant); margin-bottom: 2px; }
    .score-value {
      width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-weight: 700; font-size: 0.9rem;
      &--low      { background: color-mix(in srgb, #2e7d32 15%, transparent); color: #2e7d32; }
      &--medium   { background: color-mix(in srgb, #f9a825 15%, transparent); color: #f57f17; }
      &--high     { background: color-mix(in srgb, #e65100 15%, transparent); color: #e65100; }
      &--critical { background: color-mix(in srgb, var(--mat-sys-error) 15%, transparent); color: var(--mat-sys-error); }
    }
  `,
})
export class CreateRiskDialogComponent {
  protected readonly data = inject<CreateRiskDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CreateRiskDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly scoreLevels = SCORE_LEVELS;
  protected readonly proximities = RISK_PROXIMITIES;
  protected readonly proximityLabels = RISK_PROXIMITY_LABELS;
  protected readonly responseTypes = RISK_RESPONSE_TYPES;
  protected readonly responseTypeLabels = RISK_RESPONSE_TYPE_LABELS;

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    category: [''],
    probability: [null as number | null, Validators.required],
    impact: [null as number | null, Validators.required],
    proximity: ['' as RiskProximity, Validators.required],
    response_type: ['' as RiskResponseType, Validators.required],
    risk_owner: [null as number | null, Validators.required],
    description: [''],
  });

  protected readonly previewScore = computed(() => {
    const p = this.form.get('probability')?.value ?? 0;
    const i = this.form.get('impact')?.value ?? 0;
    return (p ?? 0) * (i ?? 0);
  });

  protected readonly previewScoreClass = computed(() => {
    const s = this.previewScore();
    if (s >= 16) return 'critical';
    if (s >= 10) return 'high';
    if (s >= 5) return 'medium';
    return 'low';
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: CreateRiskPayload = {
      title: v.title!,
      category: v.category || null,
      probability: v.probability!,
      impact: v.impact!,
      proximity: v.proximity as RiskProximity,
      response_type: v.response_type as RiskResponseType,
      risk_owner: v.risk_owner!,
      description: v.description || null,
    };
    this.dialogRef.close(payload);
  }
}
