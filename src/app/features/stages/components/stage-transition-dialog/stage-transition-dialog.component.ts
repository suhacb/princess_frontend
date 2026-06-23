import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StageTransitionAction, STAGE_TRANSITION_LABELS } from '../../contracts/stage.contracts';

export interface StageTransitionDialogData {
  stageName: string;
  action: StageTransitionAction;
}

const ACTION_MESSAGES: Record<StageTransitionAction, string> = {
  start: 'This will mark the stage as active. You can no longer undo this transition.',
  complete: 'This will mark the stage as completed.',
  exception: 'This will raise an exception on the stage. The project board will need to review the situation.',
};

const ACTION_ICONS: Record<StageTransitionAction, string> = {
  start: 'play_arrow',
  complete: 'check_circle',
  exception: 'warning',
};

@Component({
  selector: 'app-stage-transition-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ label }}</h2>
    <mat-dialog-content>
      <div class="transition-body">
        <mat-icon class="transition-icon transition-icon--{{ data.action }}">{{ icon }}</mat-icon>
        <div>
          <p class="transition-stage">{{ data.stageName }}</p>
          <p class="transition-message">{{ message }}</p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button
        mat-flat-button
        [class.action-exception]="data.action === 'exception'"
        (click)="confirm()"
      >{{ label }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .transition-body {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 8px 0;
    }

    .transition-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
    }

    .transition-icon--start { color: #2e7d32; }
    .transition-icon--complete { color: var(--mat-sys-primary); }
    .transition-icon--exception { color: var(--mat-sys-error); }

    .transition-stage {
      font-weight: 600;
      margin: 0 0 4px;
    }

    .transition-message {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.875rem;
    }

    .action-exception {
      background: var(--mat-sys-error) !important;
      color: var(--mat-sys-on-error) !important;
    }
  `,
})
export class StageTransitionDialogComponent {
  protected readonly data = inject<StageTransitionDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<StageTransitionDialogComponent>);

  protected readonly label = STAGE_TRANSITION_LABELS[this.data.action];
  protected readonly message = ACTION_MESSAGES[this.data.action];
  protected readonly icon = ACTION_ICONS[this.data.action];

  protected confirm(): void {
    this.dialogRef.close(true);
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
