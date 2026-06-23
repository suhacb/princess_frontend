import { TestBed, ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ShellComponent } from './shell.component';
import { LayoutService } from '../../core/services/layout.service';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';

function makeLayoutService(mobile = false) {
  const isMobile = signal(mobile);
  const sidebarCollapsed = signal(false);
  return {
    isMobile,
    isTablet: signal(false),
    isDesktop: signal(!mobile),
    sidebarCollapsed,
    toggleSidebar: vi.fn().mockImplementation(() => sidebarCollapsed.update(v => !v)),
  };
}

describe('ShellComponent', () => {
  let fixture: ComponentFixture<ShellComponent>;
  let mockLayout: ReturnType<typeof makeLayoutService>;

  async function setup(mobile = false) {
    mockLayout = makeLayoutService(mobile);
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([]),
        { provide: LayoutService, useValue: mockLayout },
        { provide: BreadcrumbService, useValue: { breadcrumbs: signal([]) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('creates successfully', async () => {
    await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the shell container', async () => {
    await setup();
    expect(fixture.nativeElement.querySelector('.shell')).not.toBeNull();
  });

  it('applies the collapsed CSS class when the sidebar is collapsed', async () => {
    await setup();
    mockLayout.sidebarCollapsed.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.shell--sidebar-collapsed')).not.toBeNull();
  });

  it('does not apply the collapsed class when the sidebar is expanded', async () => {
    await setup();
    expect(fixture.nativeElement.querySelector('.shell--sidebar-collapsed')).toBeNull();
  });

  it('auto-collapses the sidebar when on mobile', async () => {
    await setup(false);
    mockLayout.isMobile.set(true);
    TestBed.flushEffects();
    expect(mockLayout.toggleSidebar).toHaveBeenCalled();
  });

  it('does not auto-collapse the sidebar on desktop', async () => {
    await setup(false);
    expect(mockLayout.toggleSidebar).not.toHaveBeenCalled();
  });
});
