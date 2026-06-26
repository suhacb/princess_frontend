import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateWorkPackagePayload,
  UpdateWorkPackagePayload,
  WorkPackage,
  WorkPackageApiResource,
  mapWorkPackage,
} from '../contracts/work-package.contracts';

@Injectable({ providedIn: 'root' })
export class WorkPackageService {
  private readonly api = inject(ApiService);

  private readonly _workPackages = signal<WorkPackage[]>([]);
  private readonly _loading = signal(false);

  readonly workPackages = this._workPackages.asReadonly();
  readonly loading = this._loading.asReadonly();

  private base(projectId: number): string {
    return `/projects/${projectId}/work-packages`;
  }

  list(projectId: number): Observable<WorkPackage[]> {
    this._loading.set(true);
    return this.api.get<ApiResource<WorkPackageApiResource[]>>(this.base(projectId)).pipe(
      map(res => res.data.map(mapWorkPackage)),
      tap(wps => {
        this._workPackages.set(wps);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  create(projectId: number, payload: CreateWorkPackagePayload): Observable<WorkPackage> {
    return this.api.post<ApiResource<WorkPackageApiResource>>(this.base(projectId), payload).pipe(
      map(res => mapWorkPackage(res.data)),
      tap(wp => this._workPackages.update(list => [wp, ...list])),
    );
  }

  update(projectId: number, wpId: number, payload: UpdateWorkPackagePayload): Observable<WorkPackage> {
    return this.api
      .patch<ApiResource<WorkPackageApiResource>>(`${this.base(projectId)}/${wpId}`, payload)
      .pipe(
        map(res => mapWorkPackage(res.data)),
        tap(updated =>
          this._workPackages.update(list =>
            list.map(wp => (wp.id === wpId ? { ...updated, products: wp.products } : wp)),
          ),
        ),
      );
  }

  remove(projectId: number, wpId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${wpId}`).pipe(
      tap(() => this._workPackages.update(list => list.filter(wp => wp.id !== wpId))),
    );
  }

  authorize(projectId: number, wpId: number): Observable<WorkPackage> {
    return this.api
      .post<ApiResource<WorkPackageApiResource>>(`${this.base(projectId)}/${wpId}/authorize`, {})
      .pipe(
        map(res => mapWorkPackage(res.data)),
        tap(updated =>
          this._workPackages.update(list =>
            list.map(wp => (wp.id === wpId ? { ...updated, products: wp.products } : wp)),
          ),
        ),
      );
  }

  accept(projectId: number, wpId: number): Observable<WorkPackage> {
    return this.api
      .post<ApiResource<WorkPackageApiResource>>(`${this.base(projectId)}/${wpId}/accept`, {})
      .pipe(
        map(res => mapWorkPackage(res.data)),
        tap(updated =>
          this._workPackages.update(list =>
            list.map(wp => (wp.id === wpId ? { ...updated, products: wp.products } : wp)),
          ),
        ),
      );
  }

  complete(projectId: number, wpId: number): Observable<WorkPackage> {
    return this.api
      .post<ApiResource<WorkPackageApiResource>>(`${this.base(projectId)}/${wpId}/complete`, {})
      .pipe(
        map(res => mapWorkPackage(res.data)),
        tap(updated =>
          this._workPackages.update(list =>
            list.map(wp => (wp.id === wpId ? { ...updated, products: wp.products } : wp)),
          ),
        ),
      );
  }

  cancel(projectId: number, wpId: number): Observable<WorkPackage> {
    return this.api
      .post<ApiResource<WorkPackageApiResource>>(`${this.base(projectId)}/${wpId}/cancel`, {})
      .pipe(
        map(res => mapWorkPackage(res.data)),
        tap(updated =>
          this._workPackages.update(list =>
            list.map(wp => (wp.id === wpId ? { ...updated, products: wp.products } : wp)),
          ),
        ),
      );
  }
}
