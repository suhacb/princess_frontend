import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { signal } from '@angular/core';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthStore } from './auth.store';
import { environment } from '../../../environments/environment';

const EXPECTED_LOGIN_URL = `${environment.authFrontendUrl}/login?appName=${environment.appName}&appUrl=${encodeURIComponent(environment.appUrl)}`;

async function resolveGuard(result: ReturnType<typeof authGuard>): Promise<boolean> {
  if (isObservable(result)) return firstValueFrom(result) as Promise<boolean>;
  return result as boolean;
}

describe('authGuard', () => {
  let locationHref: string;
  let mockAuthStore: {
    accessToken: ReturnType<typeof signal<string | null>>;
    loadFromStorage: ReturnType<typeof vi.fn>;
    validateAccessToken: ReturnType<typeof vi.fn>;
    resetToken: ReturnType<typeof vi.fn>;
  };

  const callGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: {
        get href() { return locationHref; },
        set href(v: string) { locationHref = v; },
      },
    });
  });

  beforeEach(() => {
    locationHref = '';
    mockAuthStore = {
      accessToken: signal<string | null>(null),
      loadFromStorage: vi.fn(),
      validateAccessToken: vi.fn(),
      resetToken: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    });
  });

  describe('when no token exists anywhere', () => {
    it('redirects to the auth frontend login URL', async () => {
      const result = await resolveGuard(callGuard());
      expect(result).toBe(false);
      expect(locationHref).toBe(EXPECTED_LOGIN_URL);
    });

    it('calls loadFromStorage before checking the store', async () => {
      await resolveGuard(callGuard());
      expect(mockAuthStore.loadFromStorage).toHaveBeenCalledOnce();
    });

    it('does not call validateAccessToken', async () => {
      await resolveGuard(callGuard());
      expect(mockAuthStore.validateAccessToken).not.toHaveBeenCalled();
    });
  });

  describe('when token is present in the store', () => {
    beforeEach(() => {
      mockAuthStore.accessToken = signal<string | null>('valid-at');
    });

    it('allows navigation when validateAccessToken returns true', async () => {
      mockAuthStore.validateAccessToken.mockReturnValue(of(true));
      const result = await resolveGuard(callGuard());
      expect(result).toBe(true);
      expect(locationHref).toBe('');
    });

    it('resets token and redirects when validateAccessToken returns false', async () => {
      mockAuthStore.validateAccessToken.mockReturnValue(of(false));
      const result = await resolveGuard(callGuard());
      expect(result).toBe(false);
      expect(mockAuthStore.resetToken).toHaveBeenCalledOnce();
      expect(locationHref).toBe(EXPECTED_LOGIN_URL);
    });

    it('resets token and redirects when validateAccessToken errors', async () => {
      mockAuthStore.validateAccessToken.mockReturnValue(throwError(() => new Error('Network error')));
      const result = await resolveGuard(callGuard());
      expect(result).toBe(false);
      expect(mockAuthStore.resetToken).toHaveBeenCalledOnce();
      expect(locationHref).toBe(EXPECTED_LOGIN_URL);
    });

    it('does not call loadFromStorage when store already has a token', async () => {
      mockAuthStore.validateAccessToken.mockReturnValue(of(true));
      await resolveGuard(callGuard());
      expect(mockAuthStore.loadFromStorage).not.toHaveBeenCalled();
    });
  });

  describe('when token is in localStorage but store is empty', () => {
    beforeEach(() => {
      const storedToken = signal<string | null>(null);
      mockAuthStore.loadFromStorage = vi.fn().mockImplementation(() => {
        storedToken.set('restored-at');
      });
      mockAuthStore.accessToken = storedToken;
    });

    it('hydrates store from localStorage then validates', async () => {
      mockAuthStore.validateAccessToken.mockReturnValue(of(true));
      const result = await resolveGuard(callGuard());
      expect(mockAuthStore.loadFromStorage).toHaveBeenCalledOnce();
      expect(result).toBe(true);
    });
  });
});
