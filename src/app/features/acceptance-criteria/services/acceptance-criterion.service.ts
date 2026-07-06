import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource, PaginatedApiResource } from '../../../shared/contracts/api.contracts';
import {
  AcceptanceCriterion,
  AcceptanceCriterionApiResource,
  AcceptanceCriterionStatus,
  AcceptanceCriterionVersion,
  AcceptanceCriterionVersionApiResource,
  CreateAcceptanceCriterionPayload,
  RecordDecisionPayload,
  UpdateAcceptanceCriterionPayload,
  mapAcceptanceCriterion,
  mapAcceptanceCriterionVersion,
} from '../contracts/acceptance-criterion.contracts';

export interface AcceptanceCriterionFilters {
  requirement_id?: number | null;
  status?: AcceptanceCriterionStatus | null;
}

@Injectable({ providedIn: 'root' })
export class AcceptanceCriterionService {
  private readonly api = inject(ApiService);

  private readonly _criteria = signal<AcceptanceCriterion[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedCriterion = signal<AcceptanceCriterion | null>(null);

  readonly criteria = this._criteria.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedCriterion = this._selectedCriterion.asReadonly();

  private base(projectId: number): string {
    return `/projects/${projectId}/acceptance-criteria`;
  }

  list(projectId: number, filters: AcceptanceCriterionFilters = {}): Observable<AcceptanceCriterion[]> {
    this._loading.set(true);
    const params: Record<string, string | number> = {};
    if (filters.requirement_id) params['requirement_id'] = filters.requirement_id;
    if (filters.status) params['status'] = filters.status;
    return this.api.get<ApiResource<AcceptanceCriterionApiResource[]>>(this.base(projectId), params).pipe(
      map(res => res.data.map(mapAcceptanceCriterion)),
      tap(criteria => {
        this._criteria.set(criteria);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  load(projectId: number, criterionId: number): Observable<AcceptanceCriterion> {
    this._loading.set(true);
    this._selectedCriterion.set(null);
    return this.api
      .get<ApiResource<AcceptanceCriterionApiResource>>(`${this.base(projectId)}/${criterionId}`)
      .pipe(
        map(res => mapAcceptanceCriterion(res.data)),
        tap(criterion => {
          this._selectedCriterion.set(criterion);
          this._loading.set(false);
        }),
        catchError(err => {
          this._loading.set(false);
          throw err;
        }),
      );
  }

  create(projectId: number, payload: CreateAcceptanceCriterionPayload): Observable<AcceptanceCriterion> {
    return this.api
      .post<ApiResource<AcceptanceCriterionApiResource>>(this.base(projectId), payload)
      .pipe(
        map(res => mapAcceptanceCriterion(res.data)),
        tap(criterion => this._criteria.update(list => [criterion, ...list])),
      );
  }

  update(
    projectId: number,
    criterionId: number,
    payload: UpdateAcceptanceCriterionPayload,
  ): Observable<AcceptanceCriterion> {
    return this.api
      .patch<ApiResource<AcceptanceCriterionApiResource>>(`${this.base(projectId)}/${criterionId}`, payload)
      .pipe(
        map(res => mapAcceptanceCriterion(res.data)),
        tap(updated => this.syncUpdated(criterionId, updated)),
      );
  }

  remove(projectId: number, criterionId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${criterionId}`).pipe(
      tap(() => {
        this._criteria.update(list => list.filter(c => c.id !== criterionId));
        if (this._selectedCriterion()?.id === criterionId) this._selectedCriterion.set(null);
      }),
    );
  }

  approve(projectId: number, criterionId: number): Observable<AcceptanceCriterion> {
    return this.api
      .post<ApiResource<AcceptanceCriterionApiResource>>(`${this.base(projectId)}/${criterionId}/approve`, {})
      .pipe(
        map(res => mapAcceptanceCriterion(res.data)),
        tap(updated => this.syncUpdated(criterionId, updated)),
      );
  }

  supplierDecision(
    projectId: number,
    criterionId: number,
    payload: RecordDecisionPayload,
  ): Observable<AcceptanceCriterion> {
    return this.decide(projectId, criterionId, 'supplier-decision', payload);
  }

  clientDecision(
    projectId: number,
    criterionId: number,
    payload: RecordDecisionPayload,
  ): Observable<AcceptanceCriterion> {
    return this.decide(projectId, criterionId, 'client-decision', payload);
  }

  private decide(
    projectId: number,
    criterionId: number,
    action: 'supplier-decision' | 'client-decision',
    payload: RecordDecisionPayload,
  ): Observable<AcceptanceCriterion> {
    return this.api
      .post<ApiResource<AcceptanceCriterionApiResource>>(
        `${this.base(projectId)}/${criterionId}/${action}`,
        payload,
      )
      .pipe(
        map(res => mapAcceptanceCriterion(res.data)),
        tap(updated => this.syncUpdated(criterionId, updated)),
      );
  }

  listVersions(
    projectId: number,
    criterionId: number,
    page = 1,
  ): Observable<{ versions: AcceptanceCriterionVersion[]; currentPage: number; lastPage: number; total: number }> {
    return this.api
      .get<PaginatedApiResource<AcceptanceCriterionVersionApiResource>>(
        `${this.base(projectId)}/${criterionId}/versions`,
        { page },
      )
      .pipe(
        map(res => ({
          versions: res.data.map(mapAcceptanceCriterionVersion),
          currentPage: res.meta.current_page,
          lastPage: res.meta.last_page,
          total: res.meta.total,
        })),
      );
  }

  private syncUpdated(criterionId: number, updated: AcceptanceCriterion): void {
    this._criteria.update(list => list.map(c => (c.id === criterionId ? updated : c)));
    if (this._selectedCriterion()?.id === criterionId) this._selectedCriterion.set(updated);
  }
}
