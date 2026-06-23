import { TestBed } from '@angular/core/testing';
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { appHeadersInterceptor } from './app-headers.interceptor';
import { AuthStore } from '../auth/auth.store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
class TestClient {
  private http = inject(HttpClient);
  getApi() { return this.http.get(`${environment.apiUrl}/test`); }
  getExternal() { return this.http.get('https://graph.microsoft.com/v1.0/me'); }
}

const API_URL = `${environment.apiUrl}/test`;
const EXTERNAL_URL = 'https://graph.microsoft.com/v1.0/me';

describe('appHeadersInterceptor', () => {
  let client: TestClient;
  let http: HttpTestingController;
  let mockAuthStore: {
    accessToken: ReturnType<typeof signal<string | null>>;
    refreshToken: ReturnType<typeof signal<string | null>>;
  };

  beforeEach(() => {
    mockAuthStore = {
      accessToken: signal<string | null>('test-access-token'),
      refreshToken: signal<string | null>('test-refresh-token'),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([appHeadersInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    });

    client = TestBed.inject(TestClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('adds X-Application-Name to API requests', () => {
    client.getApi().subscribe();
    const req = http.expectOne(API_URL);
    expect(req.request.headers.get('X-Application-Name')).toBe(environment.appName);
    req.flush({});
  });

  it('adds X-Client-Url to API requests', () => {
    client.getApi().subscribe();
    const req = http.expectOne(API_URL);
    expect(req.request.headers.get('X-Client-Url')).toBe(environment.appUrl);
    req.flush({});
  });

  it('adds Authorization header when access token is set', () => {
    client.getApi().subscribe();
    const req = http.expectOne(API_URL);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-access-token');
    req.flush({});
  });

  it('adds X-Refresh-Token header when refresh token is set', () => {
    client.getApi().subscribe();
    const req = http.expectOne(API_URL);
    expect(req.request.headers.get('X-Refresh-Token')).toBe('test-refresh-token');
    req.flush({});
  });

  it('omits Authorization header when access token is null', () => {
    mockAuthStore.accessToken.set(null);
    client.getApi().subscribe();
    const req = http.expectOne(API_URL);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('omits X-Refresh-Token when refresh token is null', () => {
    mockAuthStore.refreshToken.set(null);
    client.getApi().subscribe();
    const req = http.expectOne(API_URL);
    expect(req.request.headers.has('X-Refresh-Token')).toBe(false);
    req.flush({});
  });

  it('does not add auth headers to non-API requests', () => {
    client.getExternal().subscribe();
    const req = http.expectOne(EXTERNAL_URL);
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(req.request.headers.has('X-Application-Name')).toBe(false);
    req.flush({});
  });
});
