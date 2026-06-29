import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface RevertConfirmData {
  fromVersion: number;
  toVersion: number;
}

@Component({
  selector: 'app-revert-confirm-dialog',
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Revert to v{{ data.fromVersion }}?</h2>
    <mat-dialog-content>
      <p>A new version v{{ data.toVersion }} will be created as a copy of v{{ data.fromVersion }}.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="confirm()">Revert</button>
    </mat-dialog-actions>
  `,
})
export class RevertConfirmDialogComponent {
  protected readonly data = inject<RevertConfirmData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RevertConfirmDialogComponent>);

  protected confirm(): void {
    this.dialogRef.close(true);
  }
}
