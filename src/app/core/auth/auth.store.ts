import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { decodeJwt } from '../jwt/decode-jwt';
import { AccessToken, AccessTokenApiResource, mapAccessToken } from './auth.contracts';

export interface AuthUser {
  username: string;
  name: string;
  familyName: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly http = inject(HttpClient);

  private readonly _accessToken = signal<string | null>(null);
  private readonly _tokenType = signal<string | null>(null);
  private readonly _expiresIn = signal<number | null>(null);
  private readonly _refreshToken = signal<string | null>(null);
  private readonly _refreshExpiresIn = signal<number | null>(null);
  private readonly _scope = signal<string | null>(null);
  private readonly _idToken = signal<string | null>(null);
  private readonly _notBeforePolicy = signal<string | null>(null);
  private readonly _sessionState = signal<string | null>(null);

  readonly accessToken = this._accessToken.asReadonly();
  readonly tokenType = this._tokenType.asReadonly();
  readonly expiresIn = this._expiresIn.asReadonly();
  readonly refreshToken = this._refreshToken.asReadonly();
  readonly refreshExpiresIn = this._refreshExpiresIn.asReadonly();
  readonly scope = this._scope.asReadonly();
  readonly idToken = this._idToken.asReadonly();
  readonly notBeforePolicy = this._notBeforePolicy.asReadonly();
  readonly sessionState = this._sessionState.asReadonly();

  readonly isLoggedIn = computed(() => !!this._accessToken());

  readonly user = computed((): AuthUser | null => {
    const token = this._accessToken();
    if (!token) return null;
    const payload = decodeJwt(token);
    if (!payload) return null;
    return {
      username: payload['preferred_username'] as string ?? '',
      name: payload['given_name'] as string ?? '',
      familyName: payload['family_name'] as string ?? '',
      email: payload['email'] as string ?? '',
    };
  });

  setToken(token: AccessToken | null = null): void {
    this.persist('access_token', token?.accessToken ?? null);
    this.persist('token_type', token?.tokenType ?? null);
    this.persist('expires_in', token?.expiresIn ?? null);
    this.persist('refresh_token', token?.refreshToken ?? null);
    this.persist('refresh_expires_in', token?.refreshExpiresIn ?? null);
    this.persist('scope', token?.scope ?? null);
    this.persist('id_token', token?.idToken ?? null);
    this.persist('not_before_policy', token?.notBeforePolicy ?? null);
    this.persist('session_state', token?.sessionState ?? null);

    this._accessToken.set(token?.accessToken ?? null);
    this._tokenType.set(token?.tokenType ?? null);
    this._expiresIn.set(token?.expiresIn ?? null);
    this._refreshToken.set(token?.refreshToken ?? null);
    this._refreshExpiresIn.set(token?.refreshExpiresIn ?? null);
    this._scope.set(token?.scope ?? null);
    this._idToken.set(token?.idToken ?? null);
    this._notBeforePolicy.set(token?.notBeforePolicy ?? null);
    this._sessionState.set(token?.sessionState ?? null);
  }

  resetToken(): void {
    this.setToken(null);
  }

  loadFromStorage(): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;
    this.setToken({
      accessToken,
      tokenType: localStorage.getItem('token_type') ?? '',
      expiresIn: Number(localStorage.getItem('expires_in')) || 0,
      refreshToken: localStorage.getItem('refresh_token') ?? '',
      refreshExpiresIn: Number(localStorage.getItem('refresh_expires_in')) || 0,
      scope: localStorage.getItem('scope') ?? '',
      idToken: localStorage.getItem('id_token') ?? '',
      notBeforePolicy: localStorage.getItem('not_before_policy') ?? '',
      sessionState: localStorage.getItem('session_state') ?? '',
    });
  }

  validateAccessToken(): Observable<boolean> {
    return this.http
      .get<AccessTokenApiResource | boolean>(
        `${environment.apiUrl}/auth/validate-access-token`,
        { observe: 'response' }
      )
      .pipe(
        map(response => {
          if (!response.body) return false;
          if (response.body === true) return true;
          if (typeof response.body === 'object' && 'access_token' in response.body) {
            this.setToken(mapAccessToken(response.body as AccessTokenApiResource));
            return true;
          }
          return false;
        }),
        catchError(() => {
          this.resetToken();
          return of(false);
        })
      );
  }

  private persist(key: string, value: string | number | null): void {
    if (value !== null && value !== undefined) {
      localStorage.setItem(key, String(value));
    } else {
      localStorage.removeItem(key);
    }
  }
}
