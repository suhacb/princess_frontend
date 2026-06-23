import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  LESSON_SOURCES,
  LESSON_SOURCE_LABELS,
  LessonSource,
  CreateLessonPayload,
} from '../../contracts/lesson.contracts';

@Component({
  selector: 'app-create-lesson-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Record Lesson</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Source</mat-label>
          <mat-select formControlName="source">
            @for (s of sources; track s) {
              <mat-option [value]="s">{{ sourceLabels[s] }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category (optional)</mat-label>
          <input matInput formControlName="category" placeholder="e.g. Planning, Communication" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4" placeholder="What was learned?"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Recommendation (optional)</mat-label>
          <textarea matInput formControlName="recommendation" rows="3" placeholder="What should be done differently?"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="confirm()">Record</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 4px; min-width: 520px; padding-top: 8px; }
    .full-width { width: 100%; }
  `,
})
export class CreateLessonDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateLessonDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly sources = LESSON_SOURCES;
  protected readonly sourceLabels = LESSON_SOURCE_LABELS;

  protected readonly form = this.fb.group({
    source: ['' as LessonSource, Validators.required],
    category: [''],
    description: ['', Validators.required],
    recommendation: [''],
  });

  protected confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: CreateLessonPayload = {
      source: v.source as LessonSource,
      description: v.description!,
      category: v.category || null,
      recommendation: v.recommendation || null,
    };
    this.dialogRef.close(payload);
  }
}
