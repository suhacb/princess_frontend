import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateIssuePayload,
  EscalateIssuePayload,
  Issue,
  IssueApiResource,
  ResolveIssuePayload,
  UpdateIssuePayload,
  mapIssue,
} from '../contracts/issue.contracts';

@Injectable({ providedIn: 'root' })
export class IssueService {
  private readonly api = inject(ApiService);

  private readonly _issues = signal<Issue[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedIssue = signal<Issue | null>(null);

  readonly issues = this._issues.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedIssue = this._selectedIssue.asReadonly();

  private base(projectId: number): string {
    return `/projects/${projectId}/issues`;
  }

  list(projectId: number): Observable<Issue[]> {
    this._loading.set(true);
    return this.api.get<ApiResource<IssueApiResource[]>>(this.base(projectId)).pipe(
      map(res => res.data.map(mapIssue)),
      tap(issues => {
        this._issues.set(issues);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  load(projectId: number, issueId: number): Observable<Issue> {
    this._loading.set(true);
    this._selectedIssue.set(null);
    return this.api.get<ApiResource<IssueApiResource>>(`${this.base(projectId)}/${issueId}`).pipe(
      map(res => mapIssue(res.data)),
      tap(issue => {
        this._selectedIssue.set(issue);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  create(projectId: number, payload: CreateIssuePayload): Observable<Issue> {
    return this.api.post<ApiResource<IssueApiResource>>(this.base(projectId), payload).pipe(
      map(res => mapIssue(res.data)),
      tap(issue => this._issues.update(list => [issue, ...list])),
    );
  }

  update(projectId: number, issueId: number, payload: UpdateIssuePayload): Observable<Issue> {
    return this.api
      .patch<ApiResource<IssueApiResource>>(`${this.base(projectId)}/${issueId}`, payload)
      .pipe(
        map(res => mapIssue(res.data)),
        tap(updated => this.syncUpdated(issueId, updated)),
      );
  }

  remove(projectId: number, issueId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${issueId}`).pipe(
      tap(() => {
        this._issues.update(list => list.filter(i => i.id !== issueId));
        if (this._selectedIssue()?.id === issueId) this._selectedIssue.set(null);
      }),
    );
  }

  escalate(projectId: number, issueId: number, payload: EscalateIssuePayload): Observable<Issue> {
    return this.api
      .post<ApiResource<IssueApiResource>>(`${this.base(projectId)}/${issueId}/escalate`, payload)
      .pipe(
        map(res => mapIssue(res.data)),
        tap(updated => this.syncUpdated(issueId, updated)),
      );
  }

  resolve(projectId: number, issueId: number, payload: ResolveIssuePayload): Observable<Issue> {
    return this.api
      .post<ApiResource<IssueApiResource>>(`${this.base(projectId)}/${issueId}/resolve`, payload)
      .pipe(
        map(res => mapIssue(res.data)),
        tap(updated => this.syncUpdated(issueId, updated)),
      );
  }

  private syncUpdated(issueId: number, updated: Issue): void {
    this._issues.update(list => list.map(i => (i.id === issueId ? updated : i)));
    if (this._selectedIssue()?.id === issueId) this._selectedIssue.set(updated);
  }
}
