import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  Member,
  ProjectRole,
  PersonSide,
  PROJECT_ROLES,
  PROJECT_ROLE_LABELS,
  PERSON_SIDES,
  PERSON_SIDE_LABELS,
  UpdateMemberPayload,
} from '../../contracts/member.contracts';

export interface EditMemberDialogData {
  member: Member;
}

@Component({
  selector: 'app-edit-member-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Edit {{ data.member.person.name }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="edit-form">
        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            @for (role of roles; track role) {
              <mat-option [value]="role">{{ roleLabels[role] }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Side</mat-label>
          <mat-select formControlName="side">
            <mat-option [value]="null">— Not set</mat-option>
            @for (side of sides; track side) {
              <mat-option [value]="side">{{ sideLabels[side] }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button [disabled]="form.invalid" (click)="confirm()">Save</button>
    </mat-dialog-actions>
  `,
  styles: `
    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 320px;
      padding-top: 8px;
    }
    mat-form-field { width: 100%; }
  `,
})
export class EditMemberDialogComponent {
  protected readonly data: EditMemberDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EditMemberDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly roles = PROJECT_ROLES;
  protected readonly roleLabels = PROJECT_ROLE_LABELS;
  protected readonly sides = PERSON_SIDES;
  protected readonly sideLabels = PERSON_SIDE_LABELS;

  protected readonly form = this.fb.group({
    role: [this.data.member.role as ProjectRole, Validators.required],
    side: [this.data.member.side as PersonSide | null],
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const payload: UpdateMemberPayload = {
      role: this.form.value.role as ProjectRole,
      side: this.form.value.side ?? null,
    };
    this.dialogRef.close(payload);
  }
}
