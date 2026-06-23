import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ResolveIssuePayload } from '../../contracts/issue.contracts';

export interface ResolveIssueDialogData {
  issueTitle: string;
}

@Component({
  selector: 'app-resolve-issue-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>Resolve Issue</h2>
    <mat-dialog-content>
      <p class="issue-ref">{{ data.issueTitle }}</p>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Resolution</mat-label>
          <textarea matInput formControlName="resolution" rows="4"
            placeholder="Describe how the issue was resolved and what action was taken…"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="confirm()">Mark Resolved</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { min-width: 420px; padding-top: 8px; }
    .full-width { width: 100%; }
    .issue-ref { font-weight: 600; margin: 0 0 12px; }
  `,
})
export class ResolveIssueDialogComponent {
  protected readonly data: ResolveIssueDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ResolveIssueDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    resolution: ['', Validators.required],
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const payload: ResolveIssuePayload = {
      resolution: this.form.value.resolution!,
    };
    this.dialogRef.close(payload);
  }
}
