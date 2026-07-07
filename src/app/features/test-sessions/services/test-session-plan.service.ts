import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateTestSessionPlanPayload,
  TeamType,
  TestSessionPlan,
  TestSessionPlanApiResource,
  TestSessionPlanStatus,
  UpdateTestSessionPlanPayload,
  mapTestSessionPlan,
} from '../contracts/test-session-plan.contracts';

export interface TestSessionPlanFilters {
  team_type?: TeamType | null;
  status?: TestSessionPlanStatus | null;
  planned_date?: string | null;
}

@Injectable({ providedIn: 'root' })
export class TestSessionPlanService {
  private readonly api = inject(ApiService);

  private readonly _plans = signal<TestSessionPlan[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedPlan = signal<TestSessionPlan | null>(null);

  readonly plans = this._plans.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedPlan = this._selectedPlan.asReadonly();

  private base(projectId: number): string {
    return `/projects/${projectId}/test-session-plans`;
  }

  list(projectId: number, filters: TestSessionPlanFilters = {}): Observable<TestSessionPlan[]> {
    this._loading.set(true);
    const params: Record<string, string> = {};
    if (filters.team_type) params['team_type'] = filters.team_type;
    if (filters.status) params['status'] = filters.status;
    if (filters.planned_date) params['planned_date'] = filters.planned_date;
    return this.api
      .get<ApiResource<TestSessionPlanApiResource[]>>(this.base(projectId), params)
      .pipe(
        map(res => res.data.map(mapTestSessionPlan)),
        tap(plans => {
          this._plans.set(plans);
          this._loading.set(false);
        }),
        catchError(err => {
          this._loading.set(false);
          throw err;
        }),
      );
  }

  load(projectId: number, planId: number): Observable<TestSessionPlan> {
    this._loading.set(true);
    this._selectedPlan.set(null);
    return this.api.get<ApiResource<TestSessionPlanApiResource>>(`${this.base(projectId)}/${planId}`).pipe(
      map(res => mapTestSessionPlan(res.data)),
      tap(plan => {
        this._selectedPlan.set(plan);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  create(projectId: number, payload: CreateTestSessionPlanPayload): Observable<TestSessionPlan> {
    return this.api.post<ApiResource<TestSessionPlanApiResource>>(this.base(projectId), payload).pipe(
      map(res => mapTestSessionPlan(res.data)),
      tap(plan => this._plans.update(list => [plan, ...list])),
    );
  }

  update(projectId: number, planId: number, payload: UpdateTestSessionPlanPayload): Observable<TestSessionPlan> {
    return this.api.patch<ApiResource<TestSessionPlanApiResource>>(`${this.base(projectId)}/${planId}`, payload).pipe(
      map(res => mapTestSessionPlan(res.data)),
      tap(updated => this.syncUpdated(planId, updated)),
    );
  }

  remove(projectId: number, planId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${planId}`).pipe(
      tap(() => {
        this._plans.update(list => list.filter(p => p.id !== planId));
        if (this._selectedPlan()?.id === planId) this._selectedPlan.set(null);
      }),
    );
  }

  activate(projectId: number, planId: number): Observable<TestSessionPlan> {
    return this.transition(projectId, planId, 'activate');
  }

  complete(projectId: number, planId: number): Observable<TestSessionPlan> {
    return this.transition(projectId, planId, 'complete');
  }

  cancel(projectId: number, planId: number): Observable<TestSessionPlan> {
    return this.transition(projectId, planId, 'cancel');
  }

  private transition(
    projectId: number,
    planId: number,
    action: 'activate' | 'complete' | 'cancel',
  ): Observable<TestSessionPlan> {
    return this.api
      .post<ApiResource<TestSessionPlanApiResource>>(`${this.base(projectId)}/${planId}/${action}`, {})
      .pipe(
        map(res => mapTestSessionPlan(res.data)),
        tap(updated => this.syncUpdated(planId, updated)),
      );
  }

  private syncUpdated(planId: number, updated: TestSessionPlan): void {
    this._plans.update(list => list.map(p => (p.id === planId ? updated : p)));
    if (this._selectedPlan()?.id === planId) this._selectedPlan.set(updated);
  }
}
