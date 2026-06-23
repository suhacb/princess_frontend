import { TestBed, ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ProjectOverviewComponent } from './project-overview.component';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../contracts/project.contracts';

const stubProject: Project = {
  id: 1,
  name: 'Alpha',
  reference: 'PROJ-001',
  status: 'initiation',
  currentStageName: 'Stage 1',
  tolerances: {
    time: { min: -5, max: 10 },
    cost: { min: null, max: null },
    scope: 'No creep',
    risk: null,
    quality: null,
    benefit: null,
  },
  createdBy: 'jdoe',
  createdAt: '2026-01-01T00:00:00Z',
};

describe('ProjectOverviewComponent', () => {
  let fixture: ComponentFixture<ProjectOverviewComponent>;

  const setup = async (project: Project | null = stubProject) => {
    await TestBed.configureTestingModule({
      imports: [ProjectOverviewComponent],
      providers: [
        {
          provide: ProjectService,
          useValue: { selectedProject: signal(project) },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ProjectOverviewComponent);
    fixture.detectChanges();
  };

  it('creates successfully', async () => {
    await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders nothing when no project is loaded', async () => {
    await setup(null);
    expect(fixture.nativeElement.querySelector('.overview-grid')).toBeNull();
  });

  it('renders project name and reference', async () => {
    await setup();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Alpha');
    expect(text).toContain('PROJ-001');
  });

  it('shows defined time tolerance', async () => {
    await setup();
    expect(fixture.nativeElement.textContent).toContain('-5');
    expect(fixture.nativeElement.textContent).toContain('10');
  });

  it('shows Not set for null cost tolerance', async () => {
    await setup();
    const costSection = fixture.nativeElement.querySelectorAll('.not-set');
    expect(costSection.length).toBeGreaterThan(0);
  });

  it('shows defined scope tolerance', async () => {
    await setup();
    expect(fixture.nativeElement.textContent).toContain('No creep');
  });

  it('shows current stage when present', async () => {
    await setup();
    expect(fixture.nativeElement.textContent).toContain('Stage 1');
  });

  it('omits current stage row when null', async () => {
    await setup({ ...stubProject, currentStageName: null });
    expect(fixture.nativeElement.textContent).not.toContain('Current stage');
  });
});
