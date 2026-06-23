import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { ApiErrorHandler } from './api-error.handler';

function makeError(status: number, body: unknown = {}): HttpErrorResponse {
  return new HttpErrorResponse({ status, error: body, url: '/test' });
}

describe('ApiErrorHandler', () => {
  let handler: ApiErrorHandler;
  let mockToast: { error: ReturnType<typeof vi.fn>; success: ReturnType<typeof vi.fn>; info: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockToast = { error: vi.fn(), success: vi.fn(), info: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        ApiErrorHandler,
        { provide: ToastService, useValue: mockToast },
      ],
    });
    handler = TestBed.inject(ApiErrorHandler);
  });

  describe('status 500+', () => {
    it('shows a server error toast', () => {
      handler.handle(makeError(500));
      expect(mockToast.error).toHaveBeenCalledWith(expect.stringContaining('500'));
    });

    it('returns { ok: false, status: 500 }', () => {
      const result = handler.handle(makeError(500));
      expect(result).toEqual({ ok: false, status: 500 });
    });
  });

  describe('status 422', () => {
    it('shows a validation toast', () => {
      handler.handle(makeError(422, { errors: { name: ['Required'] } }));
      expect(mockToast.error).toHaveBeenCalled();
    });

    it('returns validationErrors from the response body', () => {
      const result = handler.handle(makeError(422, { errors: { name: ['Required'] } }));
      expect(result.status).toBe(422);
      expect(result.validationErrors?.['name']).toEqual(['Required']);
    });

    it('returns empty validationErrors when body has no errors field', () => {
      const result = handler.handle(makeError(422, {}));
      expect(result.validationErrors).toEqual({});
    });
  });

  describe('status 409', () => {
    it('shows the message from the response body when present', () => {
      handler.handle(makeError(409, { message: 'Only drafts can be updated.' }));
      expect(mockToast.error).toHaveBeenCalledWith(expect.stringContaining('Only drafts can be updated.'));
    });

    it('falls back to a generic conflict message when body has no message', () => {
      handler.handle(makeError(409, {}));
      expect(mockToast.error).toHaveBeenCalled();
    });

    it('returns { ok: false, status: 409 }', () => {
      expect(handler.handle(makeError(409)).ok).toBe(false);
      expect(handler.handle(makeError(409)).status).toBe(409);
    });
  });

  describe('status 403', () => {
    it('shows a forbidden toast', () => {
      handler.handle(makeError(403));
      expect(mockToast.error).toHaveBeenCalled();
    });

    it('returns { ok: false, status: 403 }', () => {
      expect(handler.handle(makeError(403)).status).toBe(403);
    });
  });

  describe('status 401', () => {
    it('shows an unauthorized toast', () => {
      handler.handle(makeError(401));
      expect(mockToast.error).toHaveBeenCalled();
    });

    it('returns { ok: false, status: 401 }', () => {
      expect(handler.handle(makeError(401)).status).toBe(401);
    });
  });

  describe('status 404', () => {
    it('shows a not found toast', () => {
      handler.handle(makeError(404));
      expect(mockToast.error).toHaveBeenCalled();
    });

    it('returns { ok: false, status: 404 }', () => {
      expect(handler.handle(makeError(404)).status).toBe(404);
    });
  });

  describe('unknown 4xx', () => {
    it('shows the message from the response body when present', () => {
      handler.handle(makeError(429, { message: 'Too many requests' }));
      expect(mockToast.error).toHaveBeenCalledWith(expect.stringContaining('Too many requests'));
    });

    it('falls back to a generic message when body has no message', () => {
      handler.handle(makeError(429, {}));
      expect(mockToast.error).toHaveBeenCalled();
    });
  });
});
