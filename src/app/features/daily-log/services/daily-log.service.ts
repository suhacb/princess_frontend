import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateDailyLogEntryPayload,
  DailyLogEntry,
  DailyLogEntryApiResource,
  UpdateDailyLogEntryPayload,
  mapDailyLogEntry,
} from '../contracts/daily-log.contracts';

@Injectable({ providedIn: 'root' })
export class DailyLogService {
  private readonly api = inject(ApiService);

  private readonly _entries = signal<DailyLogEntry[]>([]);
  private readonly _loading = signal(false);

  readonly entries = this._entries.asReadonly();
  readonly loading = this._loading.asReadonly();

  private base(projectId: number): string {
    return `/projects/${projectId}/daily-log`;
  }

  list(projectId: number): Observable<DailyLogEntry[]> {
    this._loading.set(true);
    return this.api.get<ApiResource<DailyLogEntryApiResource[]>>(this.base(projectId)).pipe(
      map(res => res.data.map(mapDailyLogEntry)),
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

  create(projectId: number, payload: CreateDailyLogEntryPayload): Observable<DailyLogEntry> {
    return this.api.post<ApiResource<DailyLogEntryApiResource>>(this.base(projectId), payload).pipe(
      map(res => mapDailyLogEntry(res.data)),
      tap(entry => this._entries.update(list => [entry, ...list])),
    );
  }

  update(projectId: number, entryId: number, payload: UpdateDailyLogEntryPayload): Observable<DailyLogEntry> {
    return this.api
      .patch<ApiResource<DailyLogEntryApiResource>>(`${this.base(projectId)}/${entryId}`, payload)
      .pipe(
        map(res => mapDailyLogEntry(res.data)),
        tap(updated => this._entries.update(list => list.map(e => (e.id === entryId ? updated : e)))),
      );
  }

  remove(projectId: number, entryId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${entryId}`).pipe(
      tap(() => this._entries.update(list => list.filter(e => e.id !== entryId))),
    );
  }
}
