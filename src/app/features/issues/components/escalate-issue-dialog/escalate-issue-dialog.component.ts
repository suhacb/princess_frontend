import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EscalateIssuePayload } from '../../contracts/issue.contracts';

export interface EscalateIssueDialogData {
  issueTitle: string;
}

@Component({
  selector: 'app-escalate-issue-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>Escalate Issue</h2>
    <mat-dialog-content>
      <p class="issue-ref">{{ data.issueTitle }}</p>
      <p class="hint">Escalating will notify the project board and mark this issue as escalated.</p>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Escalation Reason</mat-label>
          <textarea matInput formControlName="escalation_reason" rows="4"
            placeholder="Explain why this issue needs board attention…"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="warn" [disabled]="form.invalid" (click)="confirm()">Escalate</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { min-width: 420px; padding-top: 8px; }
    .full-width { width: 100%; }
    .issue-ref { font-weight: 600; margin: 0 0 4px; }
    .hint { font-size: 0.875rem; color: var(--mat-sys-on-surface-variant); margin: 0 0 16px; }
  `,
})
export class EscalateIssueDialogComponent {
  protected readonly data: EscalateIssueDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EscalateIssueDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    escalation_reason: ['', Validators.required],
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const payload: EscalateIssuePayload = {
      escalation_reason: this.form.value.escalation_reason!,
    };
    this.dialogRef.close(payload);
  }
}
