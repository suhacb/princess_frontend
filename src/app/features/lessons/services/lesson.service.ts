import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateLessonPayload,
  Lesson,
  LessonApiResource,
  UpdateLessonPayload,
  mapLesson,
} from '../contracts/lesson.contracts';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private readonly api = inject(ApiService);

  private readonly _lessons = signal<Lesson[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedLesson = signal<Lesson | null>(null);

  readonly lessons = this._lessons.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedLesson = this._selectedLesson.asReadonly();

  private base(projectId: number): string {
    return `/projects/${projectId}/lessons`;
  }

  list(projectId: number): Observable<Lesson[]> {
    this._loading.set(true);
    return this.api.get<ApiResource<LessonApiResource[]>>(this.base(projectId)).pipe(
      map(res => res.data.map(mapLesson)),
      tap(lessons => {
        this._lessons.set(lessons);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  load(projectId: number, lessonId: number): Observable<Lesson> {
    this._loading.set(true);
    this._selectedLesson.set(null);
    return this.api.get<ApiResource<LessonApiResource>>(`${this.base(projectId)}/${lessonId}`).pipe(
      map(res => mapLesson(res.data)),
      tap(lesson => {
        this._selectedLesson.set(lesson);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  create(projectId: number, payload: CreateLessonPayload): Observable<Lesson> {
    return this.api.post<ApiResource<LessonApiResource>>(this.base(projectId), payload).pipe(
      map(res => mapLesson(res.data)),
      tap(lesson => this._lessons.update(list => [lesson, ...list])),
    );
  }

  update(projectId: number, lessonId: number, payload: UpdateLessonPayload): Observable<Lesson> {
    return this.api
      .patch<ApiResource<LessonApiResource>>(`${this.base(projectId)}/${lessonId}`, payload)
      .pipe(
        map(res => mapLesson(res.data)),
        tap(updated => this.syncUpdated(lessonId, updated)),
      );
  }

  remove(projectId: number, lessonId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${lessonId}`).pipe(
      tap(() => {
        this._lessons.update(list => list.filter(l => l.id !== lessonId));
        if (this._selectedLesson()?.id === lessonId) this._selectedLesson.set(null);
      }),
    );
  }

  private syncUpdated(lessonId: number, updated: Lesson): void {
    this._lessons.update(list => list.map(l => (l.id === lessonId ? updated : l)));
    if (this._selectedLesson()?.id === lessonId) this._selectedLesson.set(updated);
  }
}
