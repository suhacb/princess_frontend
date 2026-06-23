import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  Member,
  MemberApiResource,
  UpdateMemberPayload,
  mapMember,
} from '../contracts/member.contracts';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private readonly api = inject(ApiService);

  private readonly _members = signal<Member[]>([]);
  private readonly _loading = signal(false);

  readonly members = this._members.asReadonly();
  readonly loading = this._loading.asReadonly();

  list(projectId: number): Observable<Member[]> {
    this._loading.set(true);
    return this.api.get<ApiResource<MemberApiResource[]>>(`/projects/${projectId}/members`).pipe(
      map(res => res.data.map(mapMember)),
      tap(members => {
        this._members.set(members);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      }),
    );
  }

  update(projectId: number, memberId: number, payload: UpdateMemberPayload): Observable<Member> {
    return this.api
      .patch<ApiResource<MemberApiResource>>(
        `/projects/${projectId}/members/${memberId}`,
        payload,
      )
      .pipe(
        map(res => mapMember(res.data)),
        tap(updated => {
          this._members.update(list => list.map(m => (m.id === memberId ? updated : m)));
        }),
      );
  }

  remove(projectId: number, memberId: number): Observable<void> {
    return this.api
      .delete<void>(`/projects/${projectId}/members/${memberId}`)
      .pipe(tap(() => this._members.update(list => list.filter(m => m.id !== memberId))));
  }
}
