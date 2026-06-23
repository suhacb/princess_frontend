import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateQualityEntryPayload,
  QualityEntry,
  QualityEntryApiResource,
  UpdateQualityEntryPayload,
  mapQualityEntry,
} from '../contracts/quality-register.contracts';

@Injectable({ providedIn: 'root' })
export class QualityRegisterService {
  private readonly api = inject(ApiService);

  private readonly _entries = signal<QualityEntry[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedEntry = signal<QualityEntry | null>(null);

  readonly entries = this._entries.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedEntry = this._selectedEntry.asReadonly();

  private base(projectId: number): string {
    return `/projects/${projectId}/quality-register`;
  }

  list(projectId: number): Observable<QualityEntry[]> {
    this._loading.set(true);
    return this.api.get<ApiResource<QualityEntryApiResource[]>>(this.base(projectId)).pipe(
      map(res => res.data.map(mapQualityEntry)),
      tap(entries => {
        this._entries.set(entries);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  load(projectId: number, entryId: number): Observable<QualityEntry> {
    this._loading.set(true);
    this._selectedEntry.set(null);
    return this.api.get<ApiResource<QualityEntryApiResource>>(`${this.base(projectId)}/${entryId}`).pipe(
      map(res => mapQualityEntry(res.data)),
      tap(entry => {
        this._selectedEntry.set(entry);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  create(projectId: number, payload: CreateQualityEntryPayload): Observable<QualityEntry> {
    return this.api.post<ApiResource<QualityEntryApiResource>>(this.base(projectId), payload).pipe(
      map(res => mapQualityEntry(res.data)),
      tap(entry => this._entries.update(list => [entry, ...list])),
    );
  }

  update(projectId: number, entryId: number, payload: UpdateQualityEntryPayload): Observable<QualityEntry> {
    return this.api
      .patch<ApiResource<QualityEntryApiResource>>(`${this.base(projectId)}/${entryId}`, payload)
      .pipe(
        map(res => mapQualityEntry(res.data)),
        tap(updated => this.syncUpdated(entryId, updated)),
      );
  }

  remove(projectId: number, entryId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${entryId}`).pipe(
      tap(() => {
        this._entries.update(list => list.filter(e => e.id !== entryId));
        if (this._selectedEntry()?.id === entryId) this._selectedEntry.set(null);
      }),
    );
  }

  private syncUpdated(entryId: number, updated: QualityEntry): void {
    this._entries.update(list => list.map(e => (e.id === entryId ? updated : e)));
    if (this._selectedEntry()?.id === entryId) this._selectedEntry.set(updated);
  }
}
