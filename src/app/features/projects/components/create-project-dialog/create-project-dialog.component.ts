import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-create-project-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-project-dialog.component.html',
  styleUrl: './create-project-dialog.component.scss',
})
export class CreateProjectDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateProjectDialogComponent>);
  private readonly projectService = inject(ProjectService);

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly basicForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    reference: ['', [Validators.required, Validators.maxLength(30)]],
  });

  protected readonly tolerancesForm = this.fb.group({
    time_min: [null as number | null],
    time_max: [null as number | null],
    cost_min: [null as number | null],
    cost_max: [null as number | null],
    scope: [''],
    risk: [''],
    quality: [''],
    benefit: [''],
  });

  protected submit(): void {
    if (this.basicForm.invalid || this.submitting()) return;

    this.submitting.set(true);
    this.error.set(null);

    const { name, reference } = this.basicForm.getRawValue();
    const t = this.tolerancesForm.getRawValue();

    this.projectService.create({
      name: name!,
      reference: reference!,
      tolerances: {
        time: { min: t.time_min ?? null, max: t.time_max ?? null },
        cost: { min: t.cost_min ?? null, max: t.cost_max ?? null },
        scope: t.scope || null,
        risk: t.risk || null,
        quality: t.quality || null,
        benefit: t.benefit || null,
      },
    }).subscribe({
      next: project => {
        this.submitting.set(false);
        this.dialogRef.close(project);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('Failed to create project. Please try again.');
      },
    });
  }
}
