import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

const SIDEBAR_KEY = 'princess.sidebar.collapsed';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly observer = inject(BreakpointObserver);

  private readonly bp = toSignal(
    this.observer
      .observe(['(max-width: 767px)', '(min-width: 768px) and (max-width: 1023px)'])
      .pipe(
        map((state) => ({
          mobile: state.breakpoints['(max-width: 767px)'],
          tablet: state.breakpoints['(min-width: 768px) and (max-width: 1023px)'],
        }))
      ),
    { initialValue: { mobile: false, tablet: false } }
  );

  readonly isMobile = computed(() => this.bp().mobile);
  readonly isTablet = computed(() => this.bp().tablet);
  readonly isDesktop = computed(() => !this.isMobile() && !this.isTablet());

  readonly sidebarCollapsed = signal<boolean>(
    localStorage.getItem(SIDEBAR_KEY) === 'true'
  );

  constructor() {
    effect(() => {
      localStorage.setItem(SIDEBAR_KEY, String(this.sidebarCollapsed()));
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }
}
