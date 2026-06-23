import { TestBed } from '@angular/core/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject, of } from 'rxjs';
import { LayoutService } from './layout.service';

const SIDEBAR_KEY = 'princess.sidebar.collapsed';

function buildBreakpointState(mobile: boolean, tablet: boolean): BreakpointState {
  return {
    matches: mobile || tablet,
    breakpoints: {
      '(max-width: 767px)': mobile,
      '(min-width: 768px) and (max-width: 1023px)': tablet,
    },
  };
}

describe('LayoutService', () => {
  let breakpointSubject: Subject<BreakpointState>;
  let mockObserver: { observe: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    breakpointSubject = new Subject<BreakpointState>();
    mockObserver = {
      observe: vi.fn().mockReturnValue(breakpointSubject.asObservable()),
    };
  });

  afterEach(() => localStorage.clear());

  function createService(): LayoutService {
    TestBed.configureTestingModule({
      providers: [{ provide: BreakpointObserver, useValue: mockObserver }],
    });
    return TestBed.inject(LayoutService);
  }

  describe('sidebarCollapsed initial state', () => {
    it('defaults to false when localStorage is empty', () => {
      localStorage.clear();
      const service = createService();
      expect(service.sidebarCollapsed()).toBe(false);
    });

    it('restores true from localStorage', () => {
      localStorage.setItem(SIDEBAR_KEY, 'true');
      const service = createService();
      expect(service.sidebarCollapsed()).toBe(true);
    });
  });

  describe('toggleSidebar()', () => {
    it('flips collapsed from false to true', () => {
      const service = createService();
      service.toggleSidebar();
      expect(service.sidebarCollapsed()).toBe(true);
    });

    it('flips collapsed from true back to false', () => {
      localStorage.setItem(SIDEBAR_KEY, 'true');
      const service = createService();
      service.toggleSidebar();
      expect(service.sidebarCollapsed()).toBe(false);
    });

    it('persists the new value to localStorage', () => {
      const service = createService();
      service.toggleSidebar();
      TestBed.flushEffects();
      expect(localStorage.getItem(SIDEBAR_KEY)).toBe('true');
    });
  });

  describe('breakpoint computed signals', () => {
    it('isMobile is true when mobile breakpoint matches', () => {
      const service = createService();
      breakpointSubject.next(buildBreakpointState(true, false));
      expect(service.isMobile()).toBe(true);
    });

    it('isTablet is true when tablet breakpoint matches', () => {
      const service = createService();
      breakpointSubject.next(buildBreakpointState(false, true));
      expect(service.isTablet()).toBe(true);
    });

    it('isDesktop is true when neither mobile nor tablet matches', () => {
      const service = createService();
      breakpointSubject.next(buildBreakpointState(false, false));
      expect(service.isDesktop()).toBe(true);
    });

    it('isDesktop is false when mobile matches', () => {
      const service = createService();
      breakpointSubject.next(buildBreakpointState(true, false));
      expect(service.isDesktop()).toBe(false);
    });
  });
});
