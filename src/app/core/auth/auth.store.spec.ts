import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from './auth.store';
import { AccessToken } from './auth.contracts';
import { environment } from '../../../environments/environment';

function b64url(s: string): string {
  return btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function makeJwt(payload: Record<string, unknown>): string {
  return `${b64url(JSON.stringify({ alg: 'RS256' }))}.${b64url(JSON.stringify(payload))}.sig`;
}

const VALIDATE_URL = `${environment.apiUrl}/auth/validate-access-token`;

const stubToken: AccessToken = {
  accessToken: 'at',
  tokenType: 'Bearer',
  expiresIn: 300,
  refreshToken: 'rt',
  refreshExpiresIn: 1800,
  scope: 'openid',
  idToken: 'it',
  notBeforePolicy: '0',
  sessionState: 'ss',
};

describe('AuthStore', () => {
  let store: AuthStore;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(AuthStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  describe('initial state', () => {
    it('all token signals are null', () => {
      expect(store.accessToken()).toBeNull();
      expect(store.refreshToken()).toBeNull();
    });

    it('isLoggedIn is false', () => {
      expect(store.isLoggedIn()).toBe(false);
    });

    it('user is null', () => {
      expect(store.user()).toBeNull();
    });
  });

  describe('setToken()', () => {
    it('updates token signals', () => {
      store.setToken(stubToken);
      expect(store.accessToken()).toBe('at');
      expect(store.refreshToken()).toBe('rt');
      expect(store.tokenType()).toBe('Bearer');
    });

    it('isLoggedIn becomes true after setting a token', () => {
      store.setToken(stubToken);
      expect(store.isLoggedIn()).toBe(true);
    });

    it('persists all token fields to localStorage', () => {
      store.setToken(stubToken);
      expect(localStorage.getItem('access_token')).toBe('at');
      expect(localStorage.getItem('refresh_token')).toBe('rt');
      expect(localStorage.getItem('expires_in')).toBe('300');
    });

    it('clears signals when called with null', () => {
      store.setToken(stubToken);
      store.setToken(null);
      expect(store.accessToken()).toBeNull();
      expect(store.refreshToken()).toBeNull();
    });

    it('removes localStorage keys when called with null', () => {
      store.setToken(stubToken);
      store.setToken(null);
      expect(localStorage.getItem('access_token')).toBeNull();
    });
  });

  describe('resetToken()', () => {
    it('clears all token signals', () => {
      store.setToken(stubToken);
      store.resetToken();
      expect(store.accessToken()).toBeNull();
      expect(store.isLoggedIn()).toBe(false);
    });
  });

  describe('loadFromStorage()', () => {
    it('hydrates signals from localStorage', () => {
      localStorage.setItem('access_token', 'stored-at');
      localStorage.setItem('refresh_token', 'stored-rt');
      localStorage.setItem('expires_in', '600');
      store.loadFromStorage();
      expect(store.accessToken()).toBe('stored-at');
      expect(store.refreshToken()).toBe('stored-rt');
      expect(store.expiresIn()).toBe(600);
    });

    it('does nothing when localStorage has no access_token', () => {
      localStorage.clear();
      store.loadFromStorage();
      expect(store.accessToken()).toBeNull();
    });
  });

  describe('user computed signal', () => {
    it('returns parsed user fields from the JWT payload', () => {
      const jwt = makeJwt({
        preferred_username: 'jdoe',
        given_name: 'John',
        family_name: 'Doe',
        email: 'john@example.com',
      });
      store.setToken({ ...stubToken, accessToken: jwt });
      expect(store.user()?.username).toBe('jdoe');
      expect(store.user()?.name).toBe('John');
      expect(store.user()?.familyName).toBe('Doe');
      expect(store.user()?.email).toBe('john@example.com');
    });

    it('returns null when access token is not a valid JWT', () => {
      store.setToken({ ...stubToken, accessToken: 'not-a-jwt' });
      expect(store.user()).toBeNull();
    });
  });

  describe('validateAccessToken()', () => {
    it('returns true when the backend responds with boolean true', async () => {
      const result$ = firstValueFrom(store.validateAccessToken());
      http.expectOne(VALIDATE_URL).flush(true);
      expect(await result$).toBe(true);
    });

    it('returns true when the backend responds with the string "true"', async () => {
      const result$ = firstValueFrom(store.validateAccessToken());
      http.expectOne(VALIDATE_URL).flush('true');
      expect(await result$).toBe(true);
    });

    it('updates the token when the backend returns a refreshed token', async () => {
      const result$ = firstValueFrom(store.validateAccessToken());
      http.expectOne(VALIDATE_URL).flush({
        access_token: 'new-at',
        token_type: 'Bearer',
        expires_in: 300,
        refresh_token: 'new-rt',
        refresh_expires_in: 1800,
        scope: 'openid',
        id_token: 'new-it',
        not_before_policy: '0',
        session_state: 'new-ss',
      });
      expect(await result$).toBe(true);
      expect(store.accessToken()).toBe('new-at');
    });

    it('returns false and resets the token on HTTP error', async () => {
      store.setToken(stubToken);
      const result$ = firstValueFrom(store.validateAccessToken());
      http.expectOne(VALIDATE_URL).flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      expect(await result$).toBe(false);
      expect(store.accessToken()).toBeNull();
    });
  });
});
