import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { LessonService } from '../../services/lesson.service';
import { ProjectService } from '../../../projects/services/project.service';
import { CreateLessonDialogComponent } from '../../components/create-lesson-dialog/create-lesson-dialog.component';
import {
  Lesson,
  LESSON_SOURCE_LABELS,
  LESSON_SOURCES,
  LessonSource,
  CreateLessonPayload,
} from '../../contracts/lesson.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PageScrollComponent } from '../../../../shared/components/page-scroll/page-scroll.component';

@Component({
  selector: 'app-lesson-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    DatePipe,
    EmptyStateComponent,
    SkeletonComponent,
    PageScrollComponent,
  ],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.scss',
})
export class LessonListComponent {
  private readonly lessonService = inject(LessonService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.lessonService.loading;
  protected readonly sourceLabels = LESSON_SOURCE_LABELS;
  protected readonly lessonSources = LESSON_SOURCES;
  protected readonly sourceFilter = signal<LessonSource | 'all'>('all');

  protected readonly filteredLessons = computed<Lesson[]>(() => {
    const filter = this.sourceFilter();
    const lessons = this.lessonService.lessons();
    return filter === 'all' ? lessons : lessons.filter(l => l.source === filter);
  });

  constructor() {
    effect(() => {
      const project = this.projectService.selectedProject();
      if (project) this.lessonService.list(project.id).subscribe();
    });
  }

  protected openCreateDialog(): void {
    this.dialog
      .open(CreateLessonDialogComponent, { panelClass: 'princess-dialog', disableClose: true })
      .afterClosed()
      .subscribe((payload: CreateLessonPayload | undefined) => {
        if (!payload) return;
        const project = this.projectService.selectedProject();
        if (!project) return;
        this.lessonService.create(project.id, payload).subscribe({
          next: lesson => this.navigateToLesson(lesson.id),
        });
      });
  }

  protected navigateToLesson(lessonId: number): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.router.navigate(['/p', project.id, 'lessons', lessonId]);
  }
}
