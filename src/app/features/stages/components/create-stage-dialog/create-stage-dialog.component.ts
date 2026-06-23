import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StageService } from '../../services/stage.service';
import { ProjectTolerances } from '../../../projects/contracts/project.contracts';
import { STAGE_TYPES, STAGE_TYPE_LABELS } from '../../contracts/stage.contracts';

export interface CreateStageDialogData {
  projectId: number;
  projectTolerances: ProjectTolerances;
}

@Component({
  selector: 'app-create-stage-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-stage-dialog.component.html',
  styleUrl: './create-stage-dialog.component.scss',
})
export class CreateStageDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateStageDialogComponent>);
  private readonly stageService = inject(StageService);
  protected readonly data = inject<CreateStageDialogData>(MAT_DIALOG_DATA);

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly stageTypes = STAGE_TYPES;
  protected readonly stageTypeLabels = STAGE_TYPE_LABELS;

  protected readonly basicForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    type: ['initiation', Validators.required],
    planned_start_date: [''],
    planned_end_date: [''],
  });

  protected readonly tolerancesForm = this.fb.group({
    time_min: [this.data.projectTolerances.time.min as number | null],
    time_max: [this.data.projectTolerances.time.max as number | null],
    cost_min: [this.data.projectTolerances.cost.min as number | null],
    cost_max: [this.data.projectTolerances.cost.max as number | null],
    scope: [this.data.projectTolerances.scope ?? ''],
    risk: [this.data.projectTolerances.risk ?? ''],
    quality: [this.data.projectTolerances.quality ?? ''],
    benefit: [this.data.projectTolerances.benefit ?? ''],
  });

  protected selectedTypeLabel(): string {
    const type = this.basicForm.get('type')?.value;
    return type ? this.stageTypeLabels[type as 'initiation' | 'delivery' | 'final'] : '';
  }

  protected submit(): void {
    if (this.basicForm.invalid || this.submitting()) return;

    this.submitting.set(true);
    this.error.set(null);

    const { name, type, planned_start_date, planned_end_date } = this.basicForm.getRawValue();
    const t = this.tolerancesForm.getRawValue();

    this.stageService.create(this.data.projectId, {
      name: name!,
      type: type as 'initiation' | 'delivery' | 'final',
      planned_start_date: planned_start_date || null,
      planned_end_date: planned_end_date || null,
      tolerances: {
        time: { min: t.time_min ?? null, max: t.time_max ?? null },
        cost: { min: t.cost_min ?? null, max: t.cost_max ?? null },
        scope: t.scope || null,
        risk: t.risk || null,
        quality: t.quality || null,
        benefit: t.benefit || null,
      },
    }).subscribe({
      next: stage => {
        this.submitting.set(false);
        this.dialogRef.close(stage);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('Failed to create stage. Please try again.');
      },
    });
  }
}
