import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  Change,
  ChangeApiResource,
  CreateChangePayload,
  DecideChangePayload,
  UpdateChangePayload,
  mapChange,
} from '../contracts/change.contracts';

@Injectable({ providedIn: 'root' })
export class ChangeService {
  private readonly api = inject(ApiService);

  private readonly _changes = signal<Change[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedChange = signal<Change | null>(null);

  readonly changes = this._changes.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedChange = this._selectedChange.asReadonly();

  private base(projectId: number): string {
    return `/projects/${projectId}/changes`;
  }

  list(projectId: number): Observable<Change[]> {
    this._loading.set(true);
    return this.api.get<ApiResource<ChangeApiResource[]>>(this.base(projectId)).pipe(
      map(res => res.data.map(mapChange)),
      tap(changes => {
        this._changes.set(changes);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  load(projectId: number, changeId: number): Observable<Change> {
    this._loading.set(true);
    this._selectedChange.set(null);
    return this.api.get<ApiResource<ChangeApiResource>>(`${this.base(projectId)}/${changeId}`).pipe(
      map(res => mapChange(res.data)),
      tap(change => {
        this._selectedChange.set(change);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  create(projectId: number, payload: CreateChangePayload): Observable<Change> {
    return this.api.post<ApiResource<ChangeApiResource>>(this.base(projectId), payload).pipe(
      map(res => mapChange(res.data)),
      tap(change => this._changes.update(list => [change, ...list])),
    );
  }

  update(projectId: number, changeId: number, payload: UpdateChangePayload): Observable<Change> {
    return this.api
      .patch<ApiResource<ChangeApiResource>>(`${this.base(projectId)}/${changeId}`, payload)
      .pipe(
        map(res => mapChange(res.data)),
        tap(updated => this.syncUpdated(changeId, updated)),
      );
  }

  remove(projectId: number, changeId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${changeId}`).pipe(
      tap(() => {
        this._changes.update(list => list.filter(c => c.id !== changeId));
        if (this._selectedChange()?.id === changeId) this._selectedChange.set(null);
      }),
    );
  }

  approve(projectId: number, changeId: number, payload: DecideChangePayload): Observable<Change> {
    return this.api
      .patch<ApiResource<ChangeApiResource>>(
        `${this.base(projectId)}/${changeId}/approve`,
        payload,
      )
      .pipe(
        map(res => mapChange(res.data)),
        tap(updated => this.syncUpdated(changeId, updated)),
      );
  }

  reject(projectId: number, changeId: number, payload: DecideChangePayload): Observable<Change> {
    return this.api
      .patch<ApiResource<ChangeApiResource>>(
        `${this.base(projectId)}/${changeId}/reject`,
        payload,
      )
      .pipe(
        map(res => mapChange(res.data)),
        tap(updated => this.syncUpdated(changeId, updated)),
      );
  }

  private syncUpdated(changeId: number, updated: Change): void {
    this._changes.update(list => list.map(c => (c.id === changeId ? updated : c)));
    if (this._selectedChange()?.id === changeId) this._selectedChange.set(updated);
  }
}
