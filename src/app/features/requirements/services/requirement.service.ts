import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource, PaginatedApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateRequirementPayload,
  Requirement,
  RequirementApiResource,
  RequirementVersion,
  RequirementVersionApiResource,
  UpdateRequirementPayload,
  mapRequirement,
  mapRequirementVersion,
} from '../contracts/requirement.contracts';

@Injectable({ providedIn: 'root' })
export class RequirementService {
  private readonly api = inject(ApiService);

  private readonly _requirements = signal<Requirement[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedRequirement = signal<Requirement | null>(null);

  readonly requirements = this._requirements.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedRequirement = this._selectedRequirement.asReadonly();

  private base(projectId: number): string {
    return `/projects/${projectId}/requirements`;
  }

  list(projectId: number): Observable<Requirement[]> {
    this._loading.set(true);
    return this.api.get<ApiResource<RequirementApiResource[]>>(this.base(projectId)).pipe(
      map(res => res.data.map(mapRequirement)),
      tap(requirements => {
        this._requirements.set(requirements);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  load(projectId: number, requirementId: number): Observable<Requirement> {
    this._loading.set(true);
    this._selectedRequirement.set(null);
    return this.api
      .get<ApiResource<RequirementApiResource>>(`${this.base(projectId)}/${requirementId}`)
      .pipe(
        map(res => mapRequirement(res.data)),
        tap(requirement => {
          this._selectedRequirement.set(requirement);
          this._loading.set(false);
        }),
        catchError(err => {
          this._loading.set(false);
          throw err;
        }),
      );
  }

  create(projectId: number, payload: CreateRequirementPayload): Observable<Requirement> {
    return this.api
      .post<ApiResource<RequirementApiResource>>(this.base(projectId), payload)
      .pipe(
        map(res => mapRequirement(res.data)),
        tap(requirement => this._requirements.update(list => [requirement, ...list])),
      );
  }

  update(
    projectId: number,
    requirementId: number,
    payload: UpdateRequirementPayload,
  ): Observable<Requirement> {
    return this.api
      .patch<ApiResource<RequirementApiResource>>(`${this.base(projectId)}/${requirementId}`, payload)
      .pipe(
        map(res => mapRequirement(res.data)),
        tap(updated => this.syncUpdated(requirementId, updated)),
      );
  }

  remove(projectId: number, requirementId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${requirementId}`).pipe(
      tap(() => {
        this._requirements.update(list => list.filter(r => r.id !== requirementId));
        if (this._selectedRequirement()?.id === requirementId) this._selectedRequirement.set(null);
      }),
    );
  }

  review(projectId: number, requirementId: number): Observable<Requirement> {
    return this.transition(projectId, requirementId, 'review');
  }

  approve(projectId: number, requirementId: number): Observable<Requirement> {
    return this.transition(projectId, requirementId, 'approve');
  }

  reject(projectId: number, requirementId: number): Observable<Requirement> {
    return this.transition(projectId, requirementId, 'reject');
  }

  defer(projectId: number, requirementId: number): Observable<Requirement> {
    return this.transition(projectId, requirementId, 'defer');
  }

  listVersions(
    projectId: number,
    requirementId: number,
    page = 1,
  ): Observable<{ versions: RequirementVersion[]; currentPage: number; lastPage: number; total: number }> {
    return this.api
      .get<PaginatedApiResource<RequirementVersionApiResource>>(
        `${this.base(projectId)}/${requirementId}/versions`,
        { page },
      )
      .pipe(
        map(res => ({
          versions: res.data.map(mapRequirementVersion),
          currentPage: res.meta.current_page,
          lastPage: res.meta.last_page,
          total: res.meta.total,
        })),
      );
  }

  private transition(
    projectId: number,
    requirementId: number,
    action: 'review' | 'approve' | 'reject' | 'defer',
  ): Observable<Requirement> {
    return this.api
      .post<ApiResource<RequirementApiResource>>(
        `${this.base(projectId)}/${requirementId}/${action}`,
        {},
      )
      .pipe(
        map(res => mapRequirement(res.data)),
        tap(updated => this.syncUpdated(requirementId, updated)),
      );
  }

  private syncUpdated(requirementId: number, updated: Requirement): void {
    this._requirements.update(list => list.map(r => (r.id === requirementId ? updated : r)));
    if (this._selectedRequirement()?.id === requirementId) this._selectedRequirement.set(updated);
  }
}
