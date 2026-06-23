import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateRiskPayload,
  Risk,
  RiskApiResource,
  UpdateRiskPayload,
  mapRisk,
} from '../contracts/risk.contracts';

@Injectable({ providedIn: 'root' })
export class RiskService {
  private readonly api = inject(ApiService);

  private readonly _risks = signal<Risk[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedRisk = signal<Risk | null>(null);

  readonly risks = this._risks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedRisk = this._selectedRisk.asReadonly();

  private base(projectId: number): string {
    return `/projects/${projectId}/risks`;
  }

  list(projectId: number): Observable<Risk[]> {
    this._loading.set(true);
    return this.api.get<ApiResource<RiskApiResource[]>>(this.base(projectId)).pipe(
      map(res => res.data.map(mapRisk)),
      tap(risks => {
        this._risks.set(risks);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  load(projectId: number, riskId: number): Observable<Risk> {
    this._loading.set(true);
    this._selectedRisk.set(null);
    return this.api.get<ApiResource<RiskApiResource>>(`${this.base(projectId)}/${riskId}`).pipe(
      map(res => mapRisk(res.data)),
      tap(risk => {
        this._selectedRisk.set(risk);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  create(projectId: number, payload: CreateRiskPayload): Observable<Risk> {
    return this.api.post<ApiResource<RiskApiResource>>(this.base(projectId), payload).pipe(
      map(res => mapRisk(res.data)),
      tap(risk => this._risks.update(list => [risk, ...list])),
    );
  }

  update(projectId: number, riskId: number, payload: UpdateRiskPayload): Observable<Risk> {
    return this.api
      .patch<ApiResource<RiskApiResource>>(`${this.base(projectId)}/${riskId}`, payload)
      .pipe(
        map(res => mapRisk(res.data)),
        tap(updated => this.syncUpdated(riskId, updated)),
      );
  }

  remove(projectId: number, riskId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${riskId}`).pipe(
      tap(() => {
        this._risks.update(list => list.filter(r => r.id !== riskId));
        if (this._selectedRisk()?.id === riskId) this._selectedRisk.set(null);
      }),
    );
  }

  private syncUpdated(riskId: number, updated: Risk): void {
    this._risks.update(list => list.map(r => (r.id === riskId ? updated : r)));
    if (this._selectedRisk()?.id === riskId) this._selectedRisk.set(updated);
  }
}
