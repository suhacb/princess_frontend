import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RejectBoundaryPayload } from '../../contracts/boundary.contracts';

export interface RejectBoundaryDialogData {
  boundaryTitle: string;
}

@Component({
  selector: 'app-reject-boundary-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>Reject "{{ data.boundaryTitle }}"</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="reject-form">
        <mat-form-field appearance="outline">
          <mat-label>Reason for rejection (optional)</mat-label>
          <textarea matInput formControlName="rejection_reason" rows="4"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button class="reject-btn" (click)="confirm()">Reject</button>
    </mat-dialog-actions>
  `,
  styles: `
    .reject-form {
      min-width: 360px;
      padding-top: 8px;
    }
    mat-form-field { width: 100%; }
    .reject-btn { background: var(--mat-sys-error); color: white; }
  `,
})
export class RejectBoundaryDialogComponent {
  protected readonly data: RejectBoundaryDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RejectBoundaryDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    rejection_reason: [''],
  });

  protected confirm(): void {
    const payload: RejectBoundaryPayload = {
      rejection_reason: this.form.value.rejection_reason || null,
    };
    this.dialogRef.close(payload);
  }
}
