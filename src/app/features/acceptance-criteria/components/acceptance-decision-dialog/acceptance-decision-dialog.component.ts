import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RecordDecisionPayload } from '../../contracts/acceptance-criterion.contracts';

export interface AcceptanceDecisionDialogData {
  side: 'Supplier' | 'Client';
  computedPassed: boolean;
}

@Component({
  selector: 'app-acceptance-decision-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ data.side }} sign-off</h2>
    <mat-dialog-content>
      <p class="signal-note">
        Automated test signal: <strong>{{ data.computedPassed ? 'Passed' : 'Failed' }}</strong>
      </p>

      <div class="decision-buttons">
        <button
          mat-stroked-button
          color="primary"
          [class.selected]="decision() === 'accepted'"
          (click)="decision.set('accepted')"
        >Accept</button>
        <button
          mat-stroked-button
          color="warn"
          [class.selected]="decision() === 'rejected'"
          (click)="decision.set('rejected')"
        >Reject</button>
      </div>

      @if (decision()) {
        <form [formGroup]="form" class="form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Note {{ noteRequired() ? '(required)' : '(optional)' }}</mat-label>
            <textarea matInput formControlName="note" rows="3"
              [placeholder]="noteRequired() ? 'Required because this decision contradicts the test result' : 'Optional context'"
            ></textarea>
          </mat-form-field>
        </form>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="!canConfirm()" (click)="confirm()">Confirm</button>
    </mat-dialog-actions>
  `,
  styles: `
    .signal-note { margin: 0 0 12px; font-size: 0.875rem; color: var(--mat-sys-on-surface-variant); }
    .decision-buttons { display: flex; gap: 8px; margin-bottom: 12px; }
    .decision-buttons button.selected { outline: 2px solid currentColor; outline-offset: 1px; }
    .form { min-width: 420px; }
    .full-width { width: 100%; }
  `,
})
export class AcceptanceDecisionDialogComponent {
  protected readonly data = inject<AcceptanceDecisionDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AcceptanceDecisionDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly decision = signal<'accepted' | 'rejected' | null>(null);

  protected readonly noteRequired = computed(() => {
    const d = this.decision();
    if (!d) return false;
    return (d === 'rejected' && this.data.computedPassed) || (d === 'accepted' && !this.data.computedPassed);
  });

  protected readonly form = this.fb.group({
    note: [''],
  });

  protected canConfirm(): boolean {
    const d = this.decision();
    if (!d) return false;
    if (this.noteRequired() && !this.form.value.note?.trim()) return false;
    return true;
  }

  protected confirm(): void {
    if (!this.canConfirm()) return;
    const payload: RecordDecisionPayload = {
      decision: this.decision()!,
      note: this.form.value.note?.trim() || null,
    };
    this.dialogRef.close(payload);
  }
}
