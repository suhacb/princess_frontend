import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource, PaginatedApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateStagePayload,
  Stage,
  StageApiResource,
  StageTransitionAction,
  UpdateStagePayload,
  mapStage,
} from '../contracts/stage.contracts';

@Injectable({ providedIn: 'root' })
export class StageService {
  private readonly api = inject(ApiService);

  private readonly _stages = signal<Stage[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedStage = signal<Stage | null>(null);

  readonly stages = this._stages.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedStage = this._selectedStage.asReadonly();

  list(projectId: number): Observable<PaginatedApiResource<StageApiResource>> {
    this._loading.set(true);
    return this.api.get<PaginatedApiResource<StageApiResource>>(`/projects/${projectId}/stages`).pipe(
      tap(res => {
        this._stages.set(res.data.map(mapStage));
        this._loading.set(false);
      }),
    );
  }

  load(projectId: number, stageId: number): Observable<Stage> {
    this._loading.set(true);
    return this.api.get<ApiResource<StageApiResource>>(`/projects/${projectId}/stages/${stageId}`).pipe(
      map(res => mapStage(res.data)),
      tap(stage => {
        this._selectedStage.set(stage);
        this._loading.set(false);
      }),
    );
  }

  create(projectId: number, payload: CreateStagePayload): Observable<Stage> {
    return this.api.post<ApiResource<StageApiResource>>(`/projects/${projectId}/stages`, payload).pipe(
      map(res => mapStage(res.data)),
      tap(stage => this._stages.update(list => [...list, stage])),
    );
  }

  update(projectId: number, stageId: number, payload: UpdateStagePayload): Observable<Stage> {
    return this.api.patch<ApiResource<StageApiResource>>(
      `/projects/${projectId}/stages/${stageId}`,
      payload,
    ).pipe(
      map(res => mapStage(res.data)),
      tap(updated => {
        this._stages.update(list => list.map(s => (s.id === stageId ? updated : s)));
        if (this._selectedStage()?.id === stageId) this._selectedStage.set(updated);
      }),
    );
  }

  remove(projectId: number, stageId: number): Observable<void> {
    return this.api.delete<void>(`/projects/${projectId}/stages/${stageId}`).pipe(
      tap(() => {
        this._stages.update(list => list.filter(s => s.id !== stageId));
        if (this._selectedStage()?.id === stageId) this._selectedStage.set(null);
      }),
    );
  }

  transition(projectId: number, stageId: number, action: StageTransitionAction): Observable<Stage> {
    return this.api
      .patch<ApiResource<StageApiResource>>(`/projects/${projectId}/stages/${stageId}/transition`, { action })
      .pipe(
        map(res => mapStage(res.data)),
        tap(updated => {
          this._stages.update(list => list.map(s => (s.id === stageId ? updated : s)));
          if (this._selectedStage()?.id === stageId) this._selectedStage.set(updated);
        }),
      );
  }
}
