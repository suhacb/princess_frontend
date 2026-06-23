import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CallbackComponent } from './callback.component';
import { AuthStore } from '../../../core/auth/auth.store';
import { environment } from '../../../../environments/environment';

const EXPECTED_LOGIN_URL = `${environment.authFrontendUrl}/login?appName=${environment.appName}&appUrl=${encodeURIComponent(environment.appUrl)}`;

const STUB_PARAMS = {
  access_token: 'at',
  token_type: 'Bearer',
  expires_in: '300',
  refresh_token: 'rt',
  refresh_expires_in: '1800',
  scope: 'openid',
  id_token: 'it',
  not_before_policy: '0',
  session_state: 'ss',
};

describe('CallbackComponent', () => {
  let fixture: ComponentFixture<CallbackComponent>;
  let authStore: AuthStore;
  let router: Router;
  let locationHref: string;

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

  // Creates the component but does NOT call detectChanges — tests must trigger ngOnInit themselves.
  const setup = async (queryParams: Record<string, string> = STUB_PARAMS) => {
    locationHref = '';
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CallbackComponent],
      providers: [
        provideRouter([{ path: 'callback', component: CallbackComponent }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
    await router.navigate(['/callback'], { queryParams });

    fixture = TestBed.createComponent(CallbackComponent);
  };

  afterEach(() => localStorage.clear());

  it('creates successfully', async () => {
    await setup();
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a loading spinner', async () => {
    await setup();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-spinner')).not.toBeNull();
  });

  it('renders the spinner inside a centered container', async () => {
    await setup();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.callback-container')).not.toBeNull();
  });

  describe('when all token query params are present', () => {
    it('stores the access token in AuthStore', async () => {
      await setup();
      fixture.detectChanges();
      expect(authStore.accessToken()).toBe('at');
    });

    it('stores all token fields correctly', async () => {
      await setup();
      fixture.detectChanges();
      expect(authStore.tokenType()).toBe('Bearer');
      expect(authStore.expiresIn()).toBe(300);
      expect(authStore.refreshToken()).toBe('rt');
      expect(authStore.refreshExpiresIn()).toBe(1800);
      expect(authStore.scope()).toBe('openid');
      expect(authStore.idToken()).toBe('it');
      expect(authStore.notBeforePolicy()).toBe('0');
      expect(authStore.sessionState()).toBe('ss');
    });

    it('persists the token to localStorage', async () => {
      await setup();
      fixture.detectChanges();
      expect(localStorage.getItem('access_token')).toBe('at');
      expect(localStorage.getItem('refresh_token')).toBe('rt');
    });

    it('navigates to / after storing the token', async () => {
      await setup();
      const navigateSpy = vi.spyOn(router, 'navigate');
      fixture.detectChanges(); // triggers ngOnInit — spy is in place
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('does not redirect to the auth frontend', async () => {
      await setup();
      fixture.detectChanges();
      expect(locationHref).toBe('');
    });
  });

  describe('when access_token query param is missing', () => {
    it('redirects to the auth frontend login URL', async () => {
      await setup({});
      fixture.detectChanges();
      expect(locationHref).toBe(EXPECTED_LOGIN_URL);
    });

    it('does not store any token in AuthStore', async () => {
      await setup({});
      fixture.detectChanges();
      expect(authStore.accessToken()).toBeNull();
    });
  });
});
