import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  TestSessionPlan,
  TestSessionPlanApiResource,
  TestSessionPlanStatus,
  mapTestSessionPlan,
} from '../contracts/test-session-plan.contracts';

@Injectable({ providedIn: 'root' })
export class TestSessionPlanService {
  private readonly api = inject(ApiService);

  private readonly _plans = signal<TestSessionPlan[]>([]);
  private readonly _loading = signal(false);

  readonly plans = this._plans.asReadonly();
  readonly loading = this._loading.asReadonly();

  list(projectId: number, status?: TestSessionPlanStatus | null): Observable<TestSessionPlan[]> {
    this._loading.set(true);
    const params: Record<string, string> = {};
    if (status) params['status'] = status;
    return this.api
      .get<ApiResource<TestSessionPlanApiResource[]>>(`/projects/${projectId}/test-session-plans`, params)
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
}
