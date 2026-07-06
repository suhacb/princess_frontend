import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateTestCasePayload,
  TestCase,
  TestCaseApiResource,
  UpdateTestCasePayload,
  mapTestCase,
} from '../contracts/test-case.contracts';

@Injectable({ providedIn: 'root' })
export class TestCaseService {
  private readonly api = inject(ApiService);

  private readonly _casesByScenario = signal<Record<number, TestCase[]>>({});
  private readonly _loadingScenarioIds = signal<ReadonlySet<number>>(new Set());

  readonly casesByScenario = this._casesByScenario.asReadonly();

  isLoading(scenarioId: number): boolean {
    return this._loadingScenarioIds().has(scenarioId);
  }

  casesFor(scenarioId: number): TestCase[] {
    return this._casesByScenario()[scenarioId] ?? [];
  }

  private base(projectId: number, scenarioId: number): string {
    return `/projects/${projectId}/test-scenarios/${scenarioId}/test-cases`;
  }

  list(projectId: number, scenarioId: number): Observable<TestCase[]> {
    this.setLoading(scenarioId, true);
    return this.api.get<ApiResource<TestCaseApiResource[]>>(this.base(projectId, scenarioId)).pipe(
      map(res => res.data.map(mapTestCase)),
      tap(cases => {
        this._casesByScenario.update(m => ({ ...m, [scenarioId]: cases }));
        this.setLoading(scenarioId, false);
      }),
      catchError(err => {
        this.setLoading(scenarioId, false);
        throw err;
      }),
    );
  }

  create(
    projectId: number,
    scenarioId: number,
    payload: CreateTestCasePayload,
  ): Observable<TestCase> {
    return this.api
      .post<ApiResource<TestCaseApiResource>>(this.base(projectId, scenarioId), payload)
      .pipe(
        map(res => mapTestCase(res.data)),
        tap(created =>
          this._casesByScenario.update(m => ({
            ...m,
            [scenarioId]: [...(m[scenarioId] ?? []), created],
          })),
        ),
      );
  }

  update(
    projectId: number,
    scenarioId: number,
    caseId: number,
    payload: UpdateTestCasePayload,
  ): Observable<TestCase> {
    return this.api
      .patch<ApiResource<TestCaseApiResource>>(`${this.base(projectId, scenarioId)}/${caseId}`, payload)
      .pipe(
        map(res => mapTestCase(res.data)),
        tap(updated =>
          this._casesByScenario.update(m => ({
            ...m,
            [scenarioId]: (m[scenarioId] ?? []).map(c => (c.id === caseId ? updated : c)),
          })),
        ),
      );
  }

  remove(projectId: number, scenarioId: number, caseId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId, scenarioId)}/${caseId}`).pipe(
      tap(() =>
        this._casesByScenario.update(m => ({
          ...m,
          [scenarioId]: (m[scenarioId] ?? []).filter(c => c.id !== caseId),
        })),
      ),
    );
  }

  clearCache(scenarioId: number): void {
    this._casesByScenario.update(m => {
      const next = { ...m };
      delete next[scenarioId];
      return next;
    });
  }

  private setLoading(scenarioId: number, loading: boolean): void {
    this._loadingScenarioIds.update(set => {
      const next = new Set(set);
      if (loading) next.add(scenarioId);
      else next.delete(scenarioId);
      return next;
    });
  }
}
