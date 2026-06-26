import { TestBed, ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { LayoutService } from '../../core/services/layout.service';
import { ShellStore } from '../../core/services/shell.store';
import { ProjectService } from '../../features/projects/services/project.service';

function makeLayoutService(collapsed = false) {
  return {
    sidebarCollapsed: signal(collapsed),
    toggleSidebar: vi.fn(),
    isMobile: signal(false),
    isTablet: signal(false),
    isDesktop: signal(true),
  };
}

function makeShellStore() {
  return {
    activeProjectId: signal<number | null>(null),
    role: signal('pm'),
    aiDockOpen: signal(false),
    openSwitcher: vi.fn(),
    setProject: vi.fn(),
  };
}

function makeProjectService() {
  return {
    selectedProject: signal(null),
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
        { provide: ShellStore, useValue: makeShellStore() },
        { provide: ProjectService, useValue: makeProjectService() },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
  }

  it('creates successfully', async () => {
    await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the project picker button', async () => {
    await setup();
    expect(fixture.nativeElement.querySelector('.sidebar__project-btn')).not.toBeNull();
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
