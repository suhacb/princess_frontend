import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiErrorHandler } from './api-error.handler';
import { environment } from '../../../environments/environment';

const BASE = environment.apiUrl;

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpTestingController;
  let mockErrorHandler: { handle: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockErrorHandler = { handle: vi.fn().mockReturnValue({ ok: false, status: 0 }) };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiErrorHandler, useValue: mockErrorHandler },
      ],
    });
    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('get()', () => {
    it('sends a GET request to the correct API URL', () => {
      service.get('/projects').subscribe();
      const req = http.expectOne(`${BASE}/projects`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('passes query params to the request', () => {
      service.get('/projects', { status: 'active' }).subscribe();
      const req = http.expectOne(r => r.url === `${BASE}/projects`);
      expect(req.request.params.get('status')).toBe('active');
      req.flush([]);
    });

    it('returns the response body', () => {
      let result: unknown;
      service.get<{ id: number }>('/projects/1').subscribe(v => (result = v));
      http.expectOne(`${BASE}/projects/1`).flush({ id: 1 });
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('post()', () => {
    it('sends a POST request with the given body', () => {
      service.post('/projects', { name: 'Proj A' }).subscribe();
      const req = http.expectOne(`${BASE}/projects`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ name: 'Proj A' });
      req.flush({ id: 1 });
    });
  });

  describe('put()', () => {
    it('sends a PUT request with the given body', () => {
      service.put('/projects/1', { name: 'Updated' }).subscribe();
      const req = http.expectOne(`${BASE}/projects/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ name: 'Updated' });
      req.flush({ id: 1 });
    });
  });

  describe('patch()', () => {
    it('sends a PATCH request with the given body', () => {
      service.patch('/projects/1/submit', {}).subscribe();
      const req = http.expectOne(`${BASE}/projects/1/submit`);
      expect(req.request.method).toBe('PATCH');
      req.flush({ id: 1 });
    });
  });

  describe('delete()', () => {
    it('sends a DELETE request to the correct URL', () => {
      service.delete('/projects/1').subscribe();
      const req = http.expectOne(`${BASE}/projects/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('error handling', () => {
    it('calls the error handler when the request fails', () => {
      service.get('/projects').subscribe({ error: () => {} });
      http.expectOne(`${BASE}/projects`).flush('Not found', { status: 404, statusText: 'Not Found' });
      expect(mockErrorHandler.handle).toHaveBeenCalledWith(expect.any(HttpErrorResponse));
    });

    it('re-throws the error after handling so callers can react', () => {
      let caughtError: unknown;
      service.get('/projects').subscribe({ error: (e) => (caughtError = e) });
      http.expectOne(`${BASE}/projects`).flush('Server error', { status: 500, statusText: 'Error' });
      expect(caughtError).toBeInstanceOf(HttpErrorResponse);
    });
  });
});
