import { TestBed, ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { LayoutService } from '../../core/services/layout.service';

function makeLayoutService(collapsed = false) {
  return {
    sidebarCollapsed: signal(collapsed),
    toggleSidebar: vi.fn(),
    isMobile: signal(false),
    isTablet: signal(false),
    isDesktop: signal(true),
  };
}

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let mockLayout: ReturnType<typeof makeLayoutService>;

  async function setup(collapsed = false) {
    mockLayout = makeLayoutService(collapsed);
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        { provide: LayoutService, useValue: mockLayout },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
  }

  it('creates successfully', async () => {
    await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders nav items for all navigation groups', async () => {
    await setup();
    const items = fixture.nativeElement.querySelectorAll('a.sidebar__item');
    expect(items.length).toBeGreaterThan(0);
  });

  it('renders group labels when sidebar is expanded', async () => {
    await setup(false);
    const labels = fixture.nativeElement.querySelectorAll('.sidebar__group-label');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('hides group labels and shows dividers when sidebar is collapsed', async () => {
    await setup(true);
    expect(fixture.nativeElement.querySelector('.sidebar__group-label')).toBeNull();
    expect(fixture.nativeElement.querySelector('.sidebar__group-divider')).not.toBeNull();
  });

  it('hides item labels when sidebar is collapsed', async () => {
    await setup(true);
    expect(fixture.nativeElement.querySelector('.sidebar__item-label')).toBeNull();
  });

  it('shows item labels when sidebar is expanded', async () => {
    await setup(false);
    const labels = fixture.nativeElement.querySelectorAll('.sidebar__item-label');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('applies the collapsed CSS class to the nav when collapsed', async () => {
    await setup(true);
    expect(fixture.nativeElement.querySelector('nav.sidebar--collapsed')).not.toBeNull();
  });
});
