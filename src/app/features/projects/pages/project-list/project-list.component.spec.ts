import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ProjectListComponent } from './project-list.component';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../contracts/project.contracts';

const stubProject = (overrides: Partial<Project> = {}): Project => ({
  id: 1,
  name: 'Alpha',
  reference: 'PROJ-001',
  status: 'initiation',
  currentStageName: 'Stage 1',
  tolerances: { time: { min: -5, max: 10 }, cost: { min: null, max: null }, scope: null, risk: null, quality: null, benefit: null },
  createdBy: 'jdoe',
  createdAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

describe('ProjectListComponent', () => {
  let fixture: ComponentFixture<ProjectListComponent>;
  let mockService: {
    projects: ReturnType<typeof signal<Project[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    list: ReturnType<typeof vi.fn>;
  };

  const setup = async (projects: Project[] = [], loading = false) => {
    mockService = {
      projects: signal(projects),
      loading: signal(loading),
      list: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [
        provideRouter([]),
        { provide: ProjectService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    fixture.detectChanges();
  };

  it('creates successfully', async () => {
    await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('calls projectService.list() on init', async () => {
    await setup();
    expect(mockService.list).toHaveBeenCalledOnce();
  });

  it('shows empty state when no projects', async () => {
    await setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).not.toBeNull();
  });

  it('shows skeleton rows while loading', async () => {
    await setup([], true);
    expect(fixture.nativeElement.querySelector('.skeleton-list')).not.toBeNull();
  });

  it('renders a table row for each project', async () => {
    await setup([stubProject(), stubProject({ id: 2, name: 'Beta', reference: 'PROJ-002' })]);
    const rows = fixture.nativeElement.querySelectorAll('.project-row');
    expect(rows.length).toBe(2);
  });

  it('renders project name and reference in the table', async () => {
    await setup([stubProject()]);
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Alpha');
    expect(text).toContain('PROJ-001');
  });

  it('shows the project count badge', async () => {
    await setup([stubProject(), stubProject({ id: 2, name: 'Beta', reference: 'PROJ-002' })]);
    expect(fixture.nativeElement.querySelector('.project-count').textContent.trim()).toBe('2');
  });

  describe('toleranceHealth()', () => {
    it('returns full when all tolerances are set', async () => {
      await setup();
      const fullProject = stubProject({
        tolerances: {
          time: { min: -5, max: 10 },
          cost: { min: -1000, max: 5000 },
          scope: 'defined',
          risk: 'defined',
          quality: 'defined',
          benefit: 'defined',
        },
      });
      expect(fixture.componentInstance['toleranceHealth'](fullProject)).toBe('full');
    });

    it('returns none when no tolerances are set', async () => {
      await setup();
      const emptyProject = stubProject({
        tolerances: { time: { min: null, max: null }, cost: { min: null, max: null }, scope: null, risk: null, quality: null, benefit: null },
      });
      expect(fixture.componentInstance['toleranceHealth'](emptyProject)).toBe('none');
    });

    it('returns partial when some tolerances are set', async () => {
      await setup();
      const partial = stubProject();
      expect(fixture.componentInstance['toleranceHealth'](partial)).toBe('partial');
    });
  });
});
