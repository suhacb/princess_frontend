import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateBoundaryPayload,
  RejectBoundaryPayload,
  StageBoundary,
  StageBoundaryApiResource,
  UpdateBoundaryPayload,
  mapBoundary,
} from '../contracts/boundary.contracts';

@Injectable({ providedIn: 'root' })
export class BoundaryService {
  private readonly api = inject(ApiService);

  private readonly _boundaries = signal<StageBoundary[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedBoundary = signal<StageBoundary | null>(null);

  readonly boundaries = this._boundaries.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedBoundary = this._selectedBoundary.asReadonly();

  private base(projectId: number, stageId: number): string {
    return `/projects/${projectId}/stages/${stageId}/boundaries`;
  }

  list(projectId: number, stageId: number): Observable<StageBoundary[]> {
    this._loading.set(true);
    return this.api.get<ApiResource<StageBoundaryApiResource[]>>(this.base(projectId, stageId)).pipe(
      map(res => res.data.map(mapBoundary)),
      tap(boundaries => {
        this._boundaries.set(boundaries);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  load(projectId: number, stageId: number, boundaryId: number): Observable<StageBoundary> {
    this._loading.set(true);
    this._selectedBoundary.set(null);
    return this.api
      .get<ApiResource<StageBoundaryApiResource>>(`${this.base(projectId, stageId)}/${boundaryId}`)
      .pipe(
        map(res => mapBoundary(res.data)),
        tap(b => {
          this._selectedBoundary.set(b);
          this._loading.set(false);
        }),
        catchError(err => {
          this._loading.set(false);
          throw err;
        }),
      );
  }

  create(projectId: number, stageId: number, payload: CreateBoundaryPayload): Observable<StageBoundary> {
    return this.api
      .post<ApiResource<StageBoundaryApiResource>>(this.base(projectId, stageId), payload)
      .pipe(
        map(res => mapBoundary(res.data)),
        tap(b => this._boundaries.update(list => [...list, b])),
      );
  }

  update(projectId: number, stageId: number, id: number, payload: UpdateBoundaryPayload): Observable<StageBoundary> {
    return this.api
      .patch<ApiResource<StageBoundaryApiResource>>(`${this.base(projectId, stageId)}/${id}`, payload)
      .pipe(
        map(res => mapBoundary(res.data)),
        tap(updated => this.syncUpdated(id, updated)),
      );
  }

  remove(projectId: number, stageId: number, id: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId, stageId)}/${id}`).pipe(
      tap(() => {
        this._boundaries.update(list => list.filter(b => b.id !== id));
        if (this._selectedBoundary()?.id === id) this._selectedBoundary.set(null);
      }),
    );
  }

  submit(projectId: number, stageId: number, id: number): Observable<StageBoundary> {
    return this.workflowAction(projectId, stageId, id, 'submit');
  }

  approve(projectId: number, stageId: number, id: number): Observable<StageBoundary> {
    return this.workflowAction(projectId, stageId, id, 'approve');
  }

  reject(projectId: number, stageId: number, id: number, payload: RejectBoundaryPayload): Observable<StageBoundary> {
    return this.api
      .patch<ApiResource<StageBoundaryApiResource>>(
        `${this.base(projectId, stageId)}/${id}/reject`,
        payload,
      )
      .pipe(
        map(res => mapBoundary(res.data)),
        tap(updated => this.syncUpdated(id, updated)),
      );
  }

  private workflowAction(projectId: number, stageId: number, id: number, action: string): Observable<StageBoundary> {
    return this.api
      .patch<ApiResource<StageBoundaryApiResource>>(
        `${this.base(projectId, stageId)}/${id}/${action}`,
        {},
      )
      .pipe(
        map(res => mapBoundary(res.data)),
        tap(updated => this.syncUpdated(id, updated)),
      );
  }

  private syncUpdated(id: number, updated: StageBoundary): void {
    this._boundaries.update(list => list.map(b => (b.id === id ? updated : b)));
    if (this._selectedBoundary()?.id === id) this._selectedBoundary.set(updated);
  }
}
