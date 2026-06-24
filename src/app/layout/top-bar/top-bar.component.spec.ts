import { TestBed, ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TopBarComponent } from './top-bar.component';
import { LayoutService } from '../../core/services/layout.service';
import { AuthStore } from '../../core/auth/auth.store';

function makeLayoutService(collapsed = false) {
  const sidebarCollapsed = signal(collapsed);
  return {
    sidebarCollapsed,
    toggleSidebar: vi.fn().mockImplementation(() => sidebarCollapsed.update(v => !v)),
    isMobile: signal(false),
    isTablet: signal(false),
    isDesktop: signal(true),
  };
}

function makeAuthStore(user: { name: string; familyName: string; email: string; username: string } | null = null) {
  return {
    user: signal(user).asReadonly(),
    logout: vi.fn().mockReturnValue(of(undefined)),
  };
}

function setup(opts: {
  collapsed?: boolean;
  user?: { name: string; familyName: string; email: string; username: string } | null;
  dialogResult?: boolean | undefined;
} = {}) {
  const mockLayout = makeLayoutService(opts.collapsed ?? false);
  const mockAuth = makeAuthStore(
    opts.user !== undefined ? opts.user : { name: 'Blaž', familyName: 'Suhač', email: 'blaz@suhac.eu', username: 'blaz' },
  );
  const afterClosedSubject = new Subject<boolean | undefined>();
  const dialogMock = {
    open: vi.fn().mockReturnValue({ afterClosed: () => afterClosedSubject.asObservable() }),
  };

  TestBed.configureTestingModule({
    imports: [TopBarComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: LayoutService, useValue: mockLayout },
      { provide: AuthStore, useValue: mockAuth },
    ],
  });
  TestBed.overrideComponent(TopBarComponent, {
    set: { providers: [{ provide: MatDialog, useValue: dialogMock }] },
  });

  const fixture: ComponentFixture<TopBarComponent> = TestBed.createComponent(TopBarComponent);
  fixture.detectChanges();
  return { fixture, mockLayout, mockAuth, dialogMock, afterClosedSubject };
}

describe('TopBarComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('creates successfully', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders user initials from AuthStore', () => {
    const { fixture } = setup({ user: { name: 'Blaž', familyName: 'Suhač', email: 'b@s.eu', username: 'blaz' } });
    const avatar = fixture.nativeElement.querySelector('app-avatar .avatar--initials');
    expect(avatar?.textContent?.trim()).toBe('BS');
  });

  it('falls back to username initial when name is missing', () => {
    const { fixture } = setup({ user: { name: '', familyName: '', email: 'b@s.eu', username: 'blaz' } });
    const avatar = fixture.nativeElement.querySelector('app-avatar .avatar--initials');
    expect(avatar?.textContent?.trim()).toBe('B');
  });

  it('renders avatar when no user', () => {
    const { fixture } = setup({ user: null });
    expect(fixture.nativeElement.querySelector('app-avatar')).toBeTruthy();
  });

  it('calls toggleSidebar() when the menu button is clicked', () => {
    const { fixture, mockLayout } = setup();
    fixture.nativeElement.querySelector('.top-bar__menu-btn').click();
    expect(mockLayout.toggleSidebar).toHaveBeenCalled();
  });

  it('shows "menu" icon when sidebar is expanded', () => {
    const { fixture, mockLayout } = setup();
    mockLayout.sidebarCollapsed.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.top-bar__menu-btn mat-icon').textContent?.trim()).toBe('menu');
  });

  it('shows "menu_open" icon when sidebar is collapsed', () => {
    const { fixture, mockLayout } = setup();
    mockLayout.sidebarCollapsed.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.top-bar__menu-btn mat-icon').textContent?.trim()).toBe('menu_open');
  });

  describe('sign out', () => {
    it('opens confirm dialog when Sign out is clicked', () => {
      const { fixture, dialogMock } = setup();
      const comp = fixture.componentInstance as any;
      comp.signOut();
      expect(dialogMock.open).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ data: expect.objectContaining({ title: 'Sign out' }) }),
      );
    });

    it('calls authStore.logout() when dialog is confirmed', () => {
      const { fixture, mockAuth, afterClosedSubject } = setup();
      const comp = fixture.componentInstance as any;
      comp.signOut();
      afterClosedSubject.next(true);
      expect(mockAuth.logout).toHaveBeenCalled();
    });

    it('does not call authStore.logout() when dialog is cancelled', () => {
      const { fixture, mockAuth, afterClosedSubject } = setup();
      const comp = fixture.componentInstance as any;
      comp.signOut();
      afterClosedSubject.next(undefined);
      expect(mockAuth.logout).not.toHaveBeenCalled();
    });
  });
});
