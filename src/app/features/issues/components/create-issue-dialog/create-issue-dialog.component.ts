import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  ISSUE_TYPES,
  ISSUE_TYPE_LABELS,
  ISSUE_PRIORITIES,
  ISSUE_PRIORITY_LABELS,
  IssueType,
  IssuePriority,
  CreateIssuePayload,
} from '../../contracts/issue.contracts';

@Component({
  selector: 'app-create-issue-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Raise Issue</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select formControlName="issue_type">
              @for (t of types; track t) {
                <mat-option [value]="t">{{ typeLabels[t] }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              @for (p of priorities; track p) {
                <mat-option [value]="p">{{ priorityLabels[p] }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Brief summary of the issue" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description (optional)</mat-label>
          <textarea matInput formControlName="description" rows="4" placeholder="Details, impact, context…"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="confirm()">Raise Issue</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 4px; min-width: 480px; padding-top: 8px; }
    .form-row { display: flex; gap: 12px; mat-form-field { flex: 1; } }
    .full-width { width: 100%; }
  `,
})
export class CreateIssueDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateIssueDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly types = ISSUE_TYPES;
  protected readonly typeLabels = ISSUE_TYPE_LABELS;
  protected readonly priorities = ISSUE_PRIORITIES;
  protected readonly priorityLabels = ISSUE_PRIORITY_LABELS;

  protected readonly form = this.fb.group({
    issue_type: ['' as IssueType, Validators.required],
    priority: ['' as IssuePriority, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: CreateIssuePayload = {
      issue_type: v.issue_type as IssueType,
      priority: v.priority as IssuePriority,
      title: v.title!,
      description: v.description || null,
    };
    this.dialogRef.close(payload);
  }
}
