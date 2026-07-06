import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateTestScenarioPayload,
  MarkTestablePayload,
  TestScenario,
  TestScenarioApiResource,
  TestScenarioStatus,
  TestScenarioType,
  UpdateTestScenarioPayload,
  mapTestScenario,
} from '../contracts/test-scenario.contracts';

export interface TestScenarioFilters {
  type?: TestScenarioType | null;
  status?: TestScenarioStatus | null;
  is_testable?: boolean | null;
  acceptance_criterion_id?: number | null;
}

@Injectable({ providedIn: 'root' })
export class TestScenarioService {
  private readonly api = inject(ApiService);

  private readonly _scenarios = signal<TestScenario[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedScenario = signal<TestScenario | null>(null);

  readonly scenarios = this._scenarios.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedScenario = this._selectedScenario.asReadonly();

  private base(projectId: number): string {
    return `/projects/${projectId}/test-scenarios`;
  }

  list(projectId: number, filters: TestScenarioFilters = {}): Observable<TestScenario[]> {
    this._loading.set(true);
    const params: Record<string, string | number> = {};
    if (filters.type) params['type'] = filters.type;
    if (filters.status) params['status'] = filters.status;
    if (filters.is_testable !== undefined && filters.is_testable !== null) {
      params['is_testable'] = filters.is_testable ? 1 : 0;
    }
    if (filters.acceptance_criterion_id) params['acceptance_criterion_id'] = filters.acceptance_criterion_id;
    return this.api.get<ApiResource<TestScenarioApiResource[]>>(this.base(projectId), params).pipe(
      map(res => res.data.map(mapTestScenario)),
      tap(scenarios => {
        this._scenarios.set(scenarios);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  load(projectId: number, scenarioId: number): Observable<TestScenario> {
    this._loading.set(true);
    this._selectedScenario.set(null);
    return this.api
      .get<ApiResource<TestScenarioApiResource>>(`${this.base(projectId)}/${scenarioId}`)
      .pipe(
        map(res => mapTestScenario(res.data)),
        tap(scenario => {
          this._selectedScenario.set(scenario);
          this._loading.set(false);
        }),
        catchError(err => {
          this._loading.set(false);
          throw err;
        }),
      );
  }

  create(projectId: number, payload: CreateTestScenarioPayload): Observable<TestScenario> {
    return this.api
      .post<ApiResource<TestScenarioApiResource>>(this.base(projectId), payload)
      .pipe(
        map(res => mapTestScenario(res.data)),
        tap(scenario => this._scenarios.update(list => [scenario, ...list])),
      );
  }

  update(
    projectId: number,
    scenarioId: number,
    payload: UpdateTestScenarioPayload,
  ): Observable<TestScenario> {
    return this.api
      .patch<ApiResource<TestScenarioApiResource>>(`${this.base(projectId)}/${scenarioId}`, payload)
      .pipe(
        map(res => mapTestScenario(res.data)),
        tap(updated => this.syncUpdated(scenarioId, updated)),
      );
  }

  remove(projectId: number, scenarioId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${scenarioId}`).pipe(
      tap(() => {
        this._scenarios.update(list => list.filter(s => s.id !== scenarioId));
        if (this._selectedScenario()?.id === scenarioId) this._selectedScenario.set(null);
      }),
    );
  }

  ready(projectId: number, scenarioId: number): Observable<TestScenario> {
    return this.transition(projectId, scenarioId, 'ready');
  }

  obsolete(projectId: number, scenarioId: number): Observable<TestScenario> {
    return this.transition(projectId, scenarioId, 'obsolete');
  }

  reopen(projectId: number, scenarioId: number): Observable<TestScenario> {
    return this.transition(projectId, scenarioId, 'reopen');
  }

  markTestable(
    projectId: number,
    scenarioId: number,
    payload: MarkTestablePayload = {},
  ): Observable<TestScenario> {
    return this.api
      .post<ApiResource<TestScenarioApiResource>>(
        `${this.base(projectId)}/${scenarioId}/mark-testable`,
        payload,
      )
      .pipe(
        map(res => mapTestScenario(res.data)),
        tap(updated => this.syncUpdated(scenarioId, updated)),
      );
  }

  markNotTestable(projectId: number, scenarioId: number): Observable<TestScenario> {
    return this.transition(projectId, scenarioId, 'mark-not-testable');
  }

  private transition(
    projectId: number,
    scenarioId: number,
    action: 'ready' | 'obsolete' | 'reopen' | 'mark-not-testable',
  ): Observable<TestScenario> {
    return this.api
      .post<ApiResource<TestScenarioApiResource>>(
        `${this.base(projectId)}/${scenarioId}/${action}`,
        {},
      )
      .pipe(
        map(res => mapTestScenario(res.data)),
        tap(updated => this.syncUpdated(scenarioId, updated)),
      );
  }

  private syncUpdated(scenarioId: number, updated: TestScenario): void {
    this._scenarios.update(list => list.map(s => (s.id === scenarioId ? updated : s)));
    if (this._selectedScenario()?.id === scenarioId) this._selectedScenario.set(updated);
  }
}
