import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource, PaginatedApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateProjectPayload,
  Project,
  ProjectApiResource,
  UpdateProjectPayload,
  mapProject,
} from '../contracts/project.contracts';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly api = inject(ApiService);

  private readonly _projects = signal<Project[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedProject = signal<Project | null>(null);

  readonly projects = this._projects.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedProject = this._selectedProject.asReadonly();

  list(params?: Record<string, string | number>): Observable<PaginatedApiResource<ProjectApiResource>> {
    this._loading.set(true);
    return this.api.get<PaginatedApiResource<ProjectApiResource>>('/projects', params).pipe(
      tap(res => {
        this._projects.set(res.data.map(mapProject));
        this._loading.set(false);
      }),
    );
  }

  load(id: number): Observable<Project> {
    this._loading.set(true);
    return this.api.get<ApiResource<ProjectApiResource>>(`/projects/${id}`).pipe(
      map(res => mapProject(res.data)),
      tap(project => {
        this._selectedProject.set(project);
        this._loading.set(false);
      }),
    );
  }

  create(payload: CreateProjectPayload): Observable<Project> {
    return this.api.post<ApiResource<ProjectApiResource>>('/projects', payload).pipe(
      map(res => mapProject(res.data)),
      tap(project => this._projects.update(list => [project, ...list])),
    );
  }

  update(id: number, payload: UpdateProjectPayload): Observable<Project> {
    return this.api.patch<ApiResource<ProjectApiResource>>(`/projects/${id}`, payload).pipe(
      map(res => mapProject(res.data)),
      tap(updated => {
        this._projects.update(list => list.map(p => p.id === id ? updated : p));
        if (this._selectedProject()?.id === id) this._selectedProject.set(updated);
      }),
    );
  }

  remove(id: number): Observable<void> {
    return this.api.delete<void>(`/projects/${id}`).pipe(
      tap(() => {
        this._projects.update(list => list.filter(p => p.id !== id));
        if (this._selectedProject()?.id === id) this._selectedProject.set(null);
      }),
    );
  }

  setCurrentStage(projectId: number, stageId: number): Observable<Project> {
    return this.api
      .patch<ApiResource<ProjectApiResource>>(`/projects/${projectId}/current-stage`, { stage_id: stageId })
      .pipe(
        map(res => mapProject(res.data)),
        tap(updated => {
          this._projects.update(list => list.map(p => (p.id === projectId ? updated : p)));
          if (this._selectedProject()?.id === projectId) this._selectedProject.set(updated);
        }),
      );
  }
}
