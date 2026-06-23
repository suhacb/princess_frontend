import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ProjectDetailComponent } from './project-detail.component';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../contracts/project.contracts';

const stubProject: Project = {
  id: 1,
  name: 'Alpha',
  reference: 'PROJ-001',
  status: 'initiation',
  currentStageName: 'Stage 1',
  tolerances: { time: { min: -5, max: 10 }, cost: { min: null, max: null }, scope: null, risk: null, quality: null, benefit: null },
  createdBy: 'jdoe',
  createdAt: '2026-01-01T00:00:00Z',
};

describe('ProjectDetailComponent', () => {
  let fixture: ComponentFixture<ProjectDetailComponent>;
  let mockService: {
    loading: ReturnType<typeof signal<boolean>>;
    selectedProject: ReturnType<typeof signal<Project | null>>;
    load: ReturnType<typeof vi.fn>;
  };

  const setup = async (project: Project | null = stubProject, loading = false) => {
    mockService = {
      loading: signal(loading),
      selectedProject: signal(project),
      load: vi.fn().mockReturnValue(of(project)),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectDetailComponent],
      providers: [
        provideRouter([]),
        { provide: ProjectService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailComponent);
  };

  it('creates successfully', async () => {
    await setup();
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows skeleton when loading and no project is loaded yet', async () => {
    await setup(null, true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.detail-skeleton')).not.toBeNull();
  });

  it('renders project name in the header', async () => {
    await setup();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Alpha');
  });

  it('renders project reference', async () => {
    await setup();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('PROJ-001');
  });

  it('renders the PRINCE2 lifecycle stepper', async () => {
    await setup();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lifecycle-stepper')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.lifecycle-step').length).toBe(5);
  });

  it('renders navigation tabs', async () => {
    await setup();
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('.detail-tab');
    expect(tabs.length).toBe(10);
  });

  it('calls projectService.load() when id input is set', async () => {
    await setup();
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
    expect(mockService.load).toHaveBeenCalledWith(1);
  });

  describe('isStepCompleted()', () => {
    it('returns true for statuses before the current one', async () => {
      await setup(stubProject);
      fixture.detectChanges();
      expect(fixture.componentInstance['isStepCompleted']('pre_project')).toBe(true);
    });

    it('returns false for the current status', async () => {
      await setup(stubProject);
      fixture.detectChanges();
      expect(fixture.componentInstance['isStepCompleted']('initiation')).toBe(false);
    });

    it('returns false for statuses after the current one', async () => {
      await setup(stubProject);
      fixture.detectChanges();
      expect(fixture.componentInstance['isStepCompleted']('delivery')).toBe(false);
    });
  });

  describe('isStepActive()', () => {
    it('returns true for the current status', async () => {
      await setup(stubProject);
      fixture.detectChanges();
      expect(fixture.componentInstance['isStepActive']('initiation')).toBe(true);
    });

    it('returns false for other statuses', async () => {
      await setup(stubProject);
      fixture.detectChanges();
      expect(fixture.componentInstance['isStepActive']('delivery')).toBe(false);
    });
  });
});
