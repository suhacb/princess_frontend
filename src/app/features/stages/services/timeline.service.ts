import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  TimelineRow,
  TimelineStageApiResource,
  VarianceResponseData,
} from '../contracts/timeline.contracts';

@Injectable({ providedIn: 'root' })
export class TimelineService {
  private readonly api = inject(ApiService);

  private readonly _rows = signal<TimelineRow[]>([]);
  private readonly _loading = signal(false);

  readonly rows = this._rows.asReadonly();
  readonly loading = this._loading.asReadonly();

  load(projectId: number): Observable<void> {
    this._loading.set(true);
    this._rows.set([]);

    return this.api
      .get<ApiResource<TimelineStageApiResource[]>>(`/projects/${projectId}/stages`)
      .pipe(
        switchMap(res => {
          const stages = res.data;
          if (!stages.length) return of({ stages, variances: [] as ({ data: VarianceResponseData } | null)[] });

          const variance$ = stages.map(stage =>
            this.api
              .get<{ data: VarianceResponseData }>(
                `/projects/${projectId}/stages/${stage.id}/variance`,
              )
              .pipe(catchError(() => of(null))),
          );

          return forkJoin(variance$).pipe(map(variances => ({ stages, variances })));
        }),
        tap(({ stages, variances }) => {
          const rows: TimelineRow[] = [];

          stages.forEach((stage, i) => {
            rows.push({
              type: 'stage',
              id: stage.id,
              label: stage.name,
              stageId: stage.id,
              plannedStart: stage.planned_start,
              plannedEnd: stage.planned_end,
              actualStart: stage.actual_start,
              actualEnd: stage.actual_end,
              status: stage.status,
              timeVarianceDays: null,
              toleranceTime: null,
              toleranceBreached: false,
            });

            const v = variances[i]?.data;
            if (v) {
              v.work_packages.forEach(wp => {
                rows.push({
                  type: 'wp',
                  id: wp.id,
                  label: wp.title,
                  stageId: stage.id,
                  plannedStart: wp.planned_start,
                  plannedEnd: wp.planned_end,
                  actualStart: wp.actual_start,
                  actualEnd: wp.actual_end,
                  status: 'active',
                  timeVarianceDays: wp.time_variance_days,
                  toleranceTime: wp.tolerance_time,
                  toleranceBreached: wp.tolerance_breached,
                });
              });
            }
          });

          this._rows.set(rows);
          this._loading.set(false);
        }),
        map(() => undefined),
        catchError(err => {
          this._loading.set(false);
          throw err;
        }),
      );
  }
}
