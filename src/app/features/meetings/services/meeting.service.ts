import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateActionItemPayload,
  CreateMeetingPayload,
  Meeting,
  MeetingActionItem,
  MeetingActionItemApiResource,
  MeetingApiResource,
  UpdateActionItemPayload,
  UpdateMeetingPayload,
  mapMeeting,
  mapMeetingActionItem,
} from '../contracts/meeting.contracts';

@Injectable({ providedIn: 'root' })
export class MeetingService {
  private readonly api = inject(ApiService);

  private readonly _meetings = signal<Meeting[]>([]);
  private readonly _loading  = signal(false);

  readonly meetings = this._meetings.asReadonly();
  readonly loading  = this._loading.asReadonly();

  load(projectId: number): Observable<void> {
    this._loading.set(true);
    return this.api.get<ApiResource<MeetingApiResource[]>>(`/projects/${projectId}/meetings`).pipe(
      tap(res => {
        this._meetings.set(res.data.map(mapMeeting));
        this._loading.set(false);
      }),
      map(() => undefined),
    );
  }

  show(projectId: number, meetingId: number): Observable<Meeting> {
    return this.api
      .get<ApiResource<MeetingApiResource>>(`/projects/${projectId}/meetings/${meetingId}`)
      .pipe(map(res => mapMeeting(res.data)));
  }

  create(projectId: number, payload: CreateMeetingPayload): Observable<Meeting> {
    return this.api
      .post<ApiResource<MeetingApiResource>>(`/projects/${projectId}/meetings`, payload)
      .pipe(
        map(res => mapMeeting(res.data)),
        tap(m => this._meetings.update(list => [m, ...list])),
      );
  }

  update(projectId: number, meetingId: number, payload: UpdateMeetingPayload): Observable<Meeting> {
    return this.api
      .put<ApiResource<MeetingApiResource>>(`/projects/${projectId}/meetings/${meetingId}`, payload)
      .pipe(
        map(res => mapMeeting(res.data)),
        tap(updated =>
          this._meetings.update(list => list.map(m => (m.id === meetingId ? updated : m))),
        ),
      );
  }

  remove(projectId: number, meetingId: number): Observable<void> {
    return this.api.delete<void>(`/projects/${projectId}/meetings/${meetingId}`).pipe(
      tap(() => this._meetings.update(list => list.filter(m => m.id !== meetingId))),
    );
  }

  // ─── Action items ─────────────────────────────────────────────────────────────

  addActionItem(
    projectId: number,
    meetingId: number,
    payload: CreateActionItemPayload,
  ): Observable<MeetingActionItem> {
    return this.api
      .post<ApiResource<MeetingActionItemApiResource>>(
        `/projects/${projectId}/meetings/${meetingId}/action-items`,
        payload,
      )
      .pipe(
        map(res => mapMeetingActionItem(res.data)),
        tap(item => this._patchMeetingActionItems(meetingId, items => [...items, item])),
      );
  }

  updateActionItem(
    projectId: number,
    meetingId: number,
    actionItemId: number,
    payload: UpdateActionItemPayload,
  ): Observable<MeetingActionItem> {
    return this.api
      .patch<ApiResource<MeetingActionItemApiResource>>(
        `/projects/${projectId}/meetings/${meetingId}/action-items/${actionItemId}`,
        payload,
      )
      .pipe(
        map(res => mapMeetingActionItem(res.data)),
        tap(updated =>
          this._patchMeetingActionItems(meetingId, items =>
            items.map(i => (i.id === actionItemId ? updated : i)),
          ),
        ),
      );
  }

  removeActionItem(projectId: number, meetingId: number, actionItemId: number): Observable<void> {
    return this.api
      .delete<void>(
        `/projects/${projectId}/meetings/${meetingId}/action-items/${actionItemId}`,
      )
      .pipe(
        tap(() =>
          this._patchMeetingActionItems(meetingId, items =>
            items.filter(i => i.id !== actionItemId),
          ),
        ),
      );
  }

  private _patchMeetingActionItems(
    meetingId: number,
    updater: (items: MeetingActionItem[]) => MeetingActionItem[],
  ): void {
    this._meetings.update(list =>
      list.map(m => {
        if (m.id !== meetingId) return m;
        const updated = updater(m.actionItems);
        const open   = updated.filter(i => i.status === 'open').length;
        const closed = updated.filter(i => i.status === 'closed').length;
        return { ...m, actionItems: updated, actionItemsOpen: open, actionItemsClosed: closed };
      }),
    );
  }
}
