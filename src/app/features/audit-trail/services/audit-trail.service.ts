import { Injectable, inject, signal } from '@angular/core';
import { EMPTY, Observable, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import {
  AuditEntry,
  AuditTrailApiResponse,
  AuditTrailFilters,
  AuditTrailMeta,
  mapAuditEntry,
} from '../contracts/audit-trail.contracts';

@Injectable({ providedIn: 'root' })
export class AuditTrailService {
  private readonly api = inject(ApiService);

  private readonly _entries = signal<AuditEntry[]>([]);
  private readonly _loading = signal(false);
  private readonly _meta    = signal<AuditTrailMeta | null>(null);

  readonly entries = this._entries.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly meta    = this._meta.asReadonly();

  load(projectId: number, filters: AuditTrailFilters = {}): Observable<void> {
    this._loading.set(true);
    return this.api
      .get<AuditTrailApiResponse>(`/projects/${projectId}/audit-trail`, this._buildParams(filters, 1))
      .pipe(
        tap(res => {
          this._entries.set(res.data.map(mapAuditEntry));
          this._meta.set(res.meta);
          this._loading.set(false);
        }),
        map(() => undefined),
      );
  }

  loadMore(projectId: number, filters: AuditTrailFilters = {}): Observable<void> {
    const meta = this._meta();
    if (!meta || meta.current_page >= meta.last_page) return EMPTY;
    this._loading.set(true);
    return this.api
      .get<AuditTrailApiResponse>(
        `/projects/${projectId}/audit-trail`,
        this._buildParams(filters, meta.current_page + 1),
      )
      .pipe(
        tap(res => {
          this._entries.update(list => [...list, ...res.data.map(mapAuditEntry)]);
          this._meta.set(res.meta);
          this._loading.set(false);
        }),
        map(() => undefined),
      );
  }

  private _buildParams(
    filters: AuditTrailFilters,
    page: number,
  ): Record<string, string | number | boolean> {
    const params: Record<string, string | number | boolean> = { page };
    if (filters.entity_type) params['entity_type'] = filters.entity_type;
    if (filters.actor)       params['actor']       = filters.actor;
    if (filters.from)        params['from']        = filters.from;
    if (filters.to)          params['to']          = filters.to;
    return params;
  }
}
