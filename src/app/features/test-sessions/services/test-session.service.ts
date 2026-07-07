import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import { TeamType } from '../contracts/test-session-plan.contracts';
import {
  CreateTestSessionPayload,
  TestSession,
  TestSessionApiResource,
  TestSessionReport,
  TestSessionReportApiResource,
  TestSessionStatus,
  UpdateTestSessionPayload,
  mapTestSession,
  mapTestSessionReport,
} from '../contracts/test-session.contracts';
import {
  TestSessionAttachment,
  TestSessionAttachmentApiResource,
  TestSessionResult,
  TestSessionResultApiResource,
  UpdateScenarioResultPayload,
  UpdateTestCaseResultPayload,
  mapTestSessionAttachment,
  mapTestSessionResult,
} from '../contracts/test-session-result.contracts';

export interface TestSessionFilters {
  team_type?: TeamType | null;
  status?: TestSessionStatus | null;
  tester_id?: number | null;
  test_session_plan_id?: number | null;
}

@Injectable({ providedIn: 'root' })
export class TestSessionService {
  private readonly api = inject(ApiService);

  private readonly _sessions = signal<TestSession[]>([]);
  private readonly _loading = signal(false);
  private readonly _selectedSession = signal<TestSession | null>(null);

  readonly sessions = this._sessions.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedSession = this._selectedSession.asReadonly();

  private base(projectId: number): string {
    return `/projects/${projectId}/test-sessions`;
  }

  list(projectId: number, filters: TestSessionFilters = {}): Observable<TestSession[]> {
    this._loading.set(true);
    const params: Record<string, string | number> = {};
    if (filters.team_type) params['team_type'] = filters.team_type;
    if (filters.status) params['status'] = filters.status;
    if (filters.tester_id) params['tester_id'] = filters.tester_id;
    if (filters.test_session_plan_id) params['test_session_plan_id'] = filters.test_session_plan_id;
    return this.api.get<ApiResource<TestSessionApiResource[]>>(this.base(projectId), params).pipe(
      map(res => res.data.map(mapTestSession)),
      tap(sessions => {
        this._sessions.set(sessions);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  load(projectId: number, sessionId: number): Observable<TestSession> {
    this._loading.set(true);
    this._selectedSession.set(null);
    return this.api.get<ApiResource<TestSessionApiResource>>(`${this.base(projectId)}/${sessionId}`).pipe(
      map(res => mapTestSession(res.data)),
      tap(session => {
        this._selectedSession.set(session);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  create(projectId: number, payload: CreateTestSessionPayload): Observable<TestSession> {
    return this.api.post<ApiResource<TestSessionApiResource>>(this.base(projectId), payload).pipe(
      map(res => mapTestSession(res.data)),
      tap(session => this._sessions.update(list => [session, ...list])),
    );
  }

  update(projectId: number, sessionId: number, payload: UpdateTestSessionPayload): Observable<TestSession> {
    return this.api.patch<ApiResource<TestSessionApiResource>>(`${this.base(projectId)}/${sessionId}`, payload).pipe(
      map(res => mapTestSession(res.data)),
      tap(updated => this.syncUpdated(sessionId, updated)),
    );
  }

  remove(projectId: number, sessionId: number): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${sessionId}`).pipe(
      tap(() => {
        this._sessions.update(list => list.filter(s => s.id !== sessionId));
        if (this._selectedSession()?.id === sessionId) this._selectedSession.set(null);
      }),
    );
  }

  start(projectId: number, sessionId: number): Observable<TestSession> {
    return this.transition(projectId, sessionId, 'start');
  }

  complete(projectId: number, sessionId: number): Observable<TestSession> {
    return this.transition(projectId, sessionId, 'complete');
  }

  cancel(projectId: number, sessionId: number): Observable<TestSession> {
    return this.transition(projectId, sessionId, 'cancel');
  }

  private transition(
    projectId: number,
    sessionId: number,
    action: 'start' | 'complete' | 'cancel',
  ): Observable<TestSession> {
    return this.api.post<ApiResource<TestSessionApiResource>>(`${this.base(projectId)}/${sessionId}/${action}`, {}).pipe(
      map(res => mapTestSession(res.data)),
      tap(updated => this.syncUpdated(sessionId, updated)),
    );
  }

  updateResult(
    projectId: number,
    sessionId: number,
    testScenarioId: number,
    payload: UpdateScenarioResultPayload,
  ): Observable<TestSessionResult> {
    return this.api
      .put<ApiResource<TestSessionResultApiResource>>(
        `${this.base(projectId)}/${sessionId}/results/${testScenarioId}`,
        payload,
      )
      .pipe(
        map(res => mapTestSessionResult(res.data)),
        tap(result => this.syncResult(sessionId, result)),
      );
  }

  updateTestCaseResult(
    projectId: number,
    sessionId: number,
    testScenarioId: number,
    testCaseId: number,
    payload: UpdateTestCaseResultPayload,
  ): Observable<TestSessionResult> {
    return this.api
      .put<ApiResource<TestSessionResultApiResource>>(
        `${this.base(projectId)}/${sessionId}/results/${testScenarioId}/test-cases/${testCaseId}`,
        payload,
      )
      .pipe(
        map(res => mapTestSessionResult(res.data)),
        tap(result => this.syncResult(sessionId, result)),
      );
  }

  uploadAttachment(
    projectId: number,
    sessionId: number,
    testScenarioId: number,
    testCaseId: number,
    file: File,
    stepIndex?: number,
  ): Observable<TestSessionAttachment> {
    const form = new FormData();
    form.append('file', file, file.name);
    if (stepIndex !== undefined) form.append('step_index', String(stepIndex));

    return this.api
      .post<ApiResource<TestSessionAttachmentApiResource>>(
        `${this.base(projectId)}/${sessionId}/results/${testScenarioId}/test-cases/${testCaseId}/attachments`,
        form,
      )
      .pipe(
        map(res => mapTestSessionAttachment(res.data)),
        tap(attachment => this.addAttachmentLocally(sessionId, testCaseId, attachment)),
      );
  }

  deleteAttachment(
    projectId: number,
    sessionId: number,
    attachmentId: number,
    testCaseId: number,
  ): Observable<void> {
    return this.api.delete<void>(`${this.base(projectId)}/${sessionId}/attachments/${attachmentId}`).pipe(
      tap(() => this.removeAttachmentLocally(sessionId, testCaseId, attachmentId)),
    );
  }

  report(projectId: number, sessionId: number): Observable<TestSessionReport> {
    return this.api
      .get<ApiResource<TestSessionReportApiResource>>(`${this.base(projectId)}/${sessionId}/report`)
      .pipe(map(res => mapTestSessionReport(res.data)));
  }

  private syncUpdated(sessionId: number, updated: TestSession): void {
    this._sessions.update(list => list.map(s => (s.id === sessionId ? updated : s)));
    if (this._selectedSession()?.id === sessionId) this._selectedSession.set(updated);
  }

  private syncResult(sessionId: number, result: TestSessionResult): void {
    const selected = this._selectedSession();
    if (!selected || selected.id !== sessionId) return;
    const exists = selected.results.some(r => r.id === result.id);
    const results = exists
      ? selected.results.map(r => (r.id === result.id ? result : r))
      : [...selected.results, result];
    this._selectedSession.set({ ...selected, results });
  }

  private addAttachmentLocally(sessionId: number, testCaseId: number, attachment: TestSessionAttachment): void {
    const selected = this._selectedSession();
    if (!selected || selected.id !== sessionId) return;
    const key = attachment.stepIndex === null ? 'case' : String(attachment.stepIndex);
    const results = selected.results.map(r => {
      if (r.testCase?.id !== testCaseId) return r;
      const existing = r.attachments[key] ?? [];
      return { ...r, attachments: { ...r.attachments, [key]: [...existing, attachment] } };
    });
    this._selectedSession.set({ ...selected, results });
  }

  private removeAttachmentLocally(sessionId: number, testCaseId: number, attachmentId: number): void {
    const selected = this._selectedSession();
    if (!selected || selected.id !== sessionId) return;
    const results = selected.results.map(r => {
      if (r.testCase?.id !== testCaseId) return r;
      const attachments: typeof r.attachments = {};
      for (const key of Object.keys(r.attachments)) {
        attachments[key] = r.attachments[key].filter(a => a.id !== attachmentId);
      }
      return { ...r, attachments };
    });
    this._selectedSession.set({ ...selected, results });
  }
}
