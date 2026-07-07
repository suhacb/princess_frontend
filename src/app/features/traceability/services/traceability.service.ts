import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import {
  TraceabilityMatrix,
  TraceabilityMatrixApiResource,
  mapTraceabilityMatrix,
} from '../contracts/traceability.contracts';

@Injectable({ providedIn: 'root' })
export class TraceabilityService {
  private readonly api = inject(ApiService);

  private readonly _matrix = signal<TraceabilityMatrix | null>(null);
  private readonly _loading = signal(false);

  readonly matrix = this._matrix.asReadonly();
  readonly loading = this._loading.asReadonly();

  load(projectId: number): Observable<TraceabilityMatrix> {
    this._loading.set(true);
    return this.api.get<TraceabilityMatrixApiResource>(`/projects/${projectId}/traceability`).pipe(
      map(mapTraceabilityMatrix),
      tap(matrix => {
        this._matrix.set(matrix);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }
}
