import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  Activity,
  ActivityApiResource,
  CreateActivityPayload,
  CreateProductPayload,
  CreateWorkPackagePayload,
  Product,
  ProductApiResource,
  ReorderPayload,
  UpdateActivityPayload,
  UpdateProductPayload,
  UpdateWorkPackagePayload,
  WorkPackage,
  WorkPackageApiResource,
  mapActivity,
  mapProduct,
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

  // ─── Work Package CRUD ────────────────────────────────────────────────────

  createWorkPackage(projectId: number, payload: CreateWorkPackagePayload): Observable<WorkPackage> {
    return this.api.post<ApiResource<WorkPackageApiResource>>(this.base(projectId), payload).pipe(
      map(res => mapWorkPackage(res.data)),
      tap(wp => this._workPackages.update(list => [...list, wp])),
    );
  }

  updateWorkPackage(projectId: number, wpId: number, payload: UpdateWorkPackagePayload): Observable<WorkPackage> {
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

  removeWorkPackage(projectId: number, wpId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${wpId}`).pipe(
      tap(() => this._workPackages.update(list => list.filter(wp => wp.id !== wpId))),
    );
  }

  reorderWorkPackages(projectId: number, payload: ReorderPayload): Observable<void> {
    return this.api.post<void>(`${this.base(projectId)}/reorder`, payload);
  }

  reorderWorkPackagesLocal(items: WorkPackage[]): void {
    this._workPackages.set(items);
  }

  // ─── Product CRUD ─────────────────────────────────────────────────────────

  createProduct(projectId: number, wpId: number, payload: CreateProductPayload): Observable<Product> {
    return this.api
      .post<ApiResource<ProductApiResource>>(`${this.base(projectId)}/${wpId}/products`, payload)
      .pipe(
        map(res => mapProduct(res.data)),
        tap(product =>
          this._workPackages.update(list =>
            list.map(wp =>
              wp.id === wpId ? { ...wp, products: [...wp.products, product] } : wp,
            ),
          ),
        ),
      );
  }

  updateProduct(projectId: number, prodId: number, payload: UpdateProductPayload): Observable<Product> {
    return this.api
      .patch<ApiResource<ProductApiResource>>(`/projects/${projectId}/products/${prodId}`, payload)
      .pipe(
        map(res => mapProduct(res.data)),
        tap(updated =>
          this._workPackages.update(list =>
            list.map(wp => ({
              ...wp,
              products: wp.products.map(p =>
                p.id === prodId ? { ...updated, activities: p.activities } : p,
              ),
            })),
          ),
        ),
      );
  }

  removeProduct(projectId: number, wpId: number, prodId: number): Observable<void> {
    return this.api.delete<void>(`/projects/${projectId}/products/${prodId}`).pipe(
      tap(() =>
        this._workPackages.update(list =>
          list.map(wp =>
            wp.id === wpId
              ? { ...wp, products: wp.products.filter(p => p.id !== prodId) }
              : wp,
          ),
        ),
      ),
    );
  }

  reorderProducts(projectId: number, wpId: number, payload: ReorderPayload): Observable<void> {
    return this.api.post<void>(`${this.base(projectId)}/${wpId}/products/reorder`, payload);
  }

  reorderProductsLocal(wpId: number, products: Product[]): void {
    this._workPackages.update(list =>
      list.map(wp => (wp.id === wpId ? { ...wp, products } : wp)),
    );
  }

  // ─── Activity CRUD ────────────────────────────────────────────────────────

  createActivity(
    projectId: number,
    wpId: number,
    prodId: number,
    payload: CreateActivityPayload,
  ): Observable<Activity> {
    return this.api
      .post<ApiResource<ActivityApiResource>>(
        `/projects/${projectId}/products/${prodId}/activities`,
        payload,
      )
      .pipe(
        map(res => mapActivity(res.data)),
        tap(activity =>
          this._workPackages.update(list =>
            list.map(wp =>
              wp.id !== wpId
                ? wp
                : {
                    ...wp,
                    products: wp.products.map(p =>
                      p.id !== prodId ? p : { ...p, activities: [...p.activities, activity] },
                    ),
                  },
            ),
          ),
        ),
      );
  }

  updateActivity(
    projectId: number,
    wpId: number,
    prodId: number,
    actId: number,
    payload: UpdateActivityPayload,
  ): Observable<Activity> {
    return this.api
      .patch<ApiResource<ActivityApiResource>>(
        `/projects/${projectId}/activities/${actId}`,
        payload,
      )
      .pipe(
        map(res => mapActivity(res.data)),
        tap(updated =>
          this._workPackages.update(list =>
            list.map(wp =>
              wp.id !== wpId
                ? wp
                : {
                    ...wp,
                    products: wp.products.map(p =>
                      p.id !== prodId
                        ? p
                        : { ...p, activities: p.activities.map(a => (a.id === actId ? updated : a)) },
                    ),
                  },
            ),
          ),
        ),
      );
  }

  removeActivity(
    projectId: number,
    wpId: number,
    prodId: number,
    actId: number,
  ): Observable<void> {
    return this.api.delete<void>(`/projects/${projectId}/activities/${actId}`).pipe(
      tap(() =>
        this._workPackages.update(list =>
          list.map(wp =>
            wp.id !== wpId
              ? wp
              : {
                  ...wp,
                  products: wp.products.map(p =>
                    p.id !== prodId
                      ? p
                      : { ...p, activities: p.activities.filter(a => a.id !== actId) },
                  ),
                },
          ),
        ),
      ),
    );
  }

  reorderActivities(
    projectId: number,
    wpId: number,
    prodId: number,
    payload: ReorderPayload,
  ): Observable<void> {
    return this.api.post<void>(
      `/projects/${projectId}/products/${prodId}/activities/reorder`,
      payload,
    );
  }

  reorderActivitiesLocal(wpId: number, prodId: number, activities: Activity[]): void {
    this._workPackages.update(list =>
      list.map(wp =>
        wp.id !== wpId
          ? wp
          : {
              ...wp,
              products: wp.products.map(p => (p.id !== prodId ? p : { ...p, activities })),
            },
      ),
    );
  }
}
