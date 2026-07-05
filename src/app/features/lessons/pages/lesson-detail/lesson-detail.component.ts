import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { LessonService } from '../../services/lesson.service';
import { ProjectService } from '../../../projects/services/project.service';
import {
  LESSON_SOURCES,
  LESSON_SOURCE_LABELS,
  LessonSource,
  UpdateLessonPayload,
} from '../../contracts/lesson.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PageScrollComponent } from '../../../../shared/components/page-scroll/page-scroll.component';

@Component({
  selector: 'app-lesson-detail',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DatePipe,
    SkeletonComponent,
    PageScrollComponent,
  ],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.scss',
})
export class LessonDetailComponent {
  readonly lessonId = input<string>();

  private readonly lessonService = inject(LessonService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly lesson = this.lessonService.selectedLesson;
  protected readonly project = this.projectService.selectedProject;
  protected readonly loading = this.lessonService.loading;

  protected readonly sources = LESSON_SOURCES;
  protected readonly sourceLabels = LESSON_SOURCE_LABELS;

  protected readonly loadError = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);

  protected readonly form = this.fb.group({
    source: ['' as LessonSource],
    category: [''],
    description: [''],
    recommendation: [''],
  });

  constructor() {
    effect(() => {
      const id = this.lessonId();
      const project = this.project();
      if (id && project) {
        this.loadError.set(null);
        this.lessonService.load(project.id, +id).subscribe({
          error: () => this.loadError.set('Failed to load lesson.'),
        });
      }
    });

    effect(() => {
      const l = this.lesson();
      if (l) {
        this.form.patchValue({
          source: l.source,
          category: l.category ?? '',
          description: l.description,
          recommendation: l.recommendation ?? '',
        });
        this.form.markAsPristine();
      }
    });
  }

  protected goBack(): void {
    const project = this.project();
    if (project) this.router.navigate(['/p', project.id, 'lessons']);
  }

  protected save(): void {
    const l = this.lesson();
    const project = this.project();
    if (!l || !project) return;

    const v = this.form.value;
    const payload: UpdateLessonPayload = {
      source: v.source as LessonSource,
      category: v.category || null,
      description: v.description!,
      recommendation: v.recommendation || null,
    };
    this.saveError.set(null);
    this.lessonService.update(project.id, l.id, payload).subscribe({
      next: () => this.form.markAsPristine(),
      error: () => this.saveError.set('Save failed. Please try again.'),
    });
  }

  protected deleteLesson(): void {
    const l = this.lesson();
    const project = this.project();
    if (!l || !project) return;
    this.lessonService.remove(project.id, l.id).subscribe({
      next: () => this.goBack(),
      error: () => this.saveError.set('Delete failed. Please try again.'),
    });
  }
}
