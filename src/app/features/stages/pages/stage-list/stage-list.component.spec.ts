import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { StageListComponent } from './stage-list.component';
import { StageService } from '../../services/stage.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Stage } from '../../contracts/stage.contracts';
import { Project } from '../../../projects/contracts/project.contracts';
import { of } from 'rxjs';

const stubProject: Project = {
  id: 10,
  name: 'Alpha',
  reference: 'PROJ-001',
  status: 'initiation',
  currentStageName: null,
  tolerances: { time: { min: -5, max: 10 }, cost: { min: -500, max: 1000 }, scope: null, risk: null, quality: null, benefit: null },
  createdBy: 'jdoe',
  createdAt: '2026-01-01T00:00:00Z',
};

const stubStage: Stage = {
  id: 1,
  projectId: 10,
  name: 'Initiation Stage',
  type: 'initiation',
  status: 'planned',
  plannedStartDate: '2026-01-01',
  plannedEndDate: '2026-02-01',
  actualStartDate: null,
  actualEndDate: null,
  tolerances: stubProject.tolerances,
  toleranceStatus: { time: 'within', cost: null, scope: null, risk: null, quality: null, benefit: null },
  document: null,
  createdAt: '2026-01-01T00:00:00Z',
};

function setup(stages: Stage[] = [], project: Project | null = stubProject): {
  fixture: ComponentFixture<StageListComponent>;
} {
  const stagesSignal = signal(stages);
  const loadingSignal = signal(false);
  const projectSignal = signal<Project | null>(project);

  const stageService = {
    stages: stagesSignal.asReadonly(),
    loading: loadingSignal.asReadonly(),
    selectedStage: signal<Stage | null>(null).asReadonly(),
    list: vi.fn().mockReturnValue(of({})),
  };

  const projectService = {
    selectedProject: projectSignal.asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [StageListComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: StageService, useValue: stageService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture = TestBed.createComponent(StageListComponent);
  fixture.detectChanges();
  return { fixture };
}

describe('StageListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls stageService.list on init when project is loaded', () => {
    const stagesSignal = signal<Stage[]>([]);
    const stageService = {
      stages: stagesSignal.asReadonly(),
      loading: signal(false).asReadonly(),
      selectedStage: signal<Stage | null>(null).asReadonly(),
      list: vi.fn().mockReturnValue(of({})),
    };
    TestBed.configureTestingModule({
      imports: [StageListComponent, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: StageService, useValue: stageService },
        { provide: ProjectService, useValue: { selectedProject: signal(stubProject).asReadonly() } },
      ],
    });
    const fixture = TestBed.createComponent(StageListComponent);
    fixture.detectChanges();
    expect(stageService.list).toHaveBeenCalledWith(10);
  });

  it('renders stage cards', () => {
    const { fixture } = setup([stubStage]);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.stage-card__name')?.textContent).toContain('Initiation Stage');
  });

  it('shows empty state when no stages', () => {
    const { fixture } = setup([]);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-empty-state')).toBeTruthy();
  });

  it('shows Start button for planned stage', () => {
    const { fixture } = setup([stubStage]);
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll('button');
    const startBtn = Array.from(buttons).find(b => b.textContent?.includes('Start'));
    expect(startBtn).toBeTruthy();
  });

  it('shows Complete and Flag Exception buttons for active stage', () => {
    const activeStage: Stage = { ...stubStage, status: 'active' };
    const { fixture } = setup([activeStage]);
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons.some(t => t?.includes('Complete'))).toBe(true);
    expect(buttons.some(t => t?.includes('Flag Exception'))).toBe(true);
  });

  it('shows no transition buttons for completed stage', () => {
    const completedStage: Stage = { ...stubStage, status: 'completed' };
    const { fixture } = setup([completedStage]);
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons.some(t => t?.includes('Start') || t?.includes('Complete') || t?.includes('Flag Exception'))).toBe(false);
  });
});
