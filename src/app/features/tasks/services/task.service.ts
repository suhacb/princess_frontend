import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateTaskPayload,
  Task,
  TaskApiResource,
  TaskHistoryApiResource,
  TaskHistoryEntry,
  UpdateTaskPayload,
  mapTask,
  mapTaskHistory,
} from '../contracts/task.contracts';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly api = inject(ApiService);

  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal(false);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();

  load(projectId: number): Observable<void> {
    this._loading.set(true);
    return this.api.get<ApiResource<TaskApiResource[]>>(`/projects/${projectId}/tasks`).pipe(
      tap(res => {
        this._tasks.set(res.data.map(mapTask));
        this._loading.set(false);
      }),
      map(() => undefined),
    );
  }

  create(projectId: number, payload: CreateTaskPayload): Observable<Task> {
    return this.api.post<ApiResource<TaskApiResource>>(`/projects/${projectId}/tasks`, payload).pipe(
      map(res => mapTask(res.data)),
      tap(task => this._tasks.update(list => [...list, task])),
    );
  }

  update(projectId: number, taskId: number, payload: UpdateTaskPayload): Observable<Task> {
    return this.api
      .put<ApiResource<TaskApiResource>>(`/projects/${projectId}/tasks/${taskId}`, payload)
      .pipe(
        map(res => mapTask(res.data)),
        tap(updated =>
          this._tasks.update(list => list.map(t => (t.id === taskId ? updated : t))),
        ),
      );
  }

  remove(projectId: number, taskId: number): Observable<void> {
    return this.api.delete<void>(`/projects/${projectId}/tasks/${taskId}`).pipe(
      tap(() => this._tasks.update(list => list.filter(t => t.id !== taskId))),
    );
  }

  loadHistory(projectId: number, taskId: number): Observable<TaskHistoryEntry[]> {
    return this.api
      .get<ApiResource<TaskHistoryApiResource[]>>(`/projects/${projectId}/tasks/${taskId}/history`)
      .pipe(map(res => res.data.map(mapTaskHistory)));
  }
}
