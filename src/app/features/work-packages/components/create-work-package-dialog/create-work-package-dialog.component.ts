import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProjectMember } from '../../contracts/work-package.contracts';

export interface CreateWorkPackageDialogData {
  members: ProjectMember[];
}

@Component({
  selector: 'app-create-work-package-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Create work package</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">

        <mat-form-field appearance="outline" class="dialog-form__field">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="e.g. Build Payment Gateway" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="dialog-form__field">
          <mat-label>Team Manager</mat-label>
          <mat-select formControlName="team_manager_id">
            @for (m of data.members; track m.id) {
              <mat-option [value]="m.person.id">{{ m.person.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="dialog-form__row">
          <mat-form-field appearance="outline" class="dialog-form__field">
            <mat-label>Planned start</mat-label>
            <input matInput formControlName="planned_start" type="date" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="dialog-form__field">
            <mat-label>Planned end</mat-label>
            <input matInput formControlName="planned_end" type="date" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="dialog-form__field">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button [disabled]="form.invalid || saving()" (click)="submit()">
        {{ saving() ? 'Creating…' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 400px;
      padding-top: 8px;

      &__field { width: 100%; }
      &__row { display: flex; gap: 12px; }
      &__row &__field { flex: 1; }
    }
  `,
})
export class CreateWorkPackageDialogComponent {
  protected readonly data = inject<CreateWorkPackageDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<CreateWorkPackageDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly saving = signal(false);

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    team_manager_id: [null as number | null, Validators.required],
    planned_start: ['', Validators.required],
    planned_end: ['', Validators.required],
    description: [''],
  });

  protected submit(): void {
    if (this.form.invalid || this.saving()) return;
    const { title, team_manager_id, planned_start, planned_end, description } = this.form.value;
    this.ref.close({
      title: title!,
      team_manager_id: team_manager_id!,
      planned_start: planned_start!,
      planned_end: planned_end!,
      description: description?.trim() || null,
    });
  }
}
