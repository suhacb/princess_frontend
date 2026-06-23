import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DecideChangePayload } from '../../contracts/change.contracts';

export interface DecideChangeDialogData {
  action: 'approve' | 'reject';
  changeTitle: string;
}

@Component({
  selector: 'app-decide-change-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.action === 'approve' ? 'Approve' : 'Reject' }} Change Request</h2>
    <mat-dialog-content>
      <p class="change-title">{{ data.changeTitle }}</p>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Decision rationale (optional)</mat-label>
          <textarea
            matInput
            formControlName="decision_rationale"
            rows="4"
            placeholder="Reason for this decision…"
          ></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-flat-button
        [color]="data.action === 'approve' ? 'primary' : 'warn'"
        (click)="confirm()"
      >{{ data.action === 'approve' ? 'Approve' : 'Reject' }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .change-title { font-style: italic; color: var(--mat-sys-on-surface-variant); margin-bottom: 12px; }
    .full-width { width: 100%; min-width: 420px; }
  `,
})
export class DecideChangeDialogComponent {
  protected readonly data = inject<DecideChangeDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DecideChangeDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    decision_rationale: [''],
  });

  protected confirm(): void {
    const v = this.form.value;
    const payload: DecideChangePayload = {
      decision_rationale: v.decision_rationale || null,
    };
    this.dialogRef.close(payload);
  }
}
