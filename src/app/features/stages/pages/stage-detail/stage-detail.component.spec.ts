import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { StageDetailComponent } from './stage-detail.component';
import { StageService } from '../../services/stage.service';
import { ProjectService } from '../../../projects/services/project.service';
import { BoundaryService } from '../../../boundaries/services/boundary.service';
import { Stage } from '../../contracts/stage.contracts';
import { Project } from '../../../projects/contracts/project.contracts';

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

function setup(stage: Stage | null = stubStage): {
  fixture: ComponentFixture<StageDetailComponent>;
  stageService: { load: ReturnType<typeof vi.fn>; transition: ReturnType<typeof vi.fn> };
} {
  const resolved = stage ?? stubStage;
  const stageSignal = signal<Stage | null>(stage);
  const loadFn = vi.fn().mockImplementation(() => { stageSignal.set(resolved); return of(resolved); });

  const stageService = {
    selectedStage: stageSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    load: loadFn,
    transition: vi.fn().mockReturnValue(of(stubStage)),
  };

  const projectService = {
    selectedProject: signal<Project | null>(stubProject).asReadonly(),
    setCurrentStage: vi.fn().mockReturnValue(of(stubProject)),
  };

  const boundaryService = {
    boundaries: signal([]).asReadonly(),
    loading: signal(false).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };

  TestBed.configureTestingModule({
    imports: [StageDetailComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: StageService, useValue: stageService },
      { provide: ProjectService, useValue: projectService },
      { provide: BoundaryService, useValue: boundaryService },
    ],
  });

  const fixture = TestBed.createComponent(StageDetailComponent);
  return { fixture, stageService };
}

describe('StageDetailComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('loads the stage when stageId input is set', () => {
    const { fixture, stageService } = setup(null);
    fixture.componentRef.setInput('stageId', '1');
    fixture.detectChanges();
    expect(stageService.load).toHaveBeenCalledWith(10, 1);
  });

  it('renders stage name and type', () => {
    const { fixture } = setup();
    fixture.componentRef.setInput('stageId', '1');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.detail-header__name')?.textContent).toContain('Initiation Stage');
    expect(el.querySelector('.stage-type-badge')?.textContent?.trim()).toBe('Initiation');
  });

  it('shows Start transition for planned stage', () => {
    const { fixture } = setup();
    fixture.componentRef.setInput('stageId', '1');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons.some(t => t?.includes('Start'))).toBe(true);
  });

  it('shows Complete and Flag Exception for active stage', () => {
    const activeStage = { ...stubStage, status: 'active' as const };
    const { fixture } = setup(activeStage);
    fixture.componentRef.setInput('stageId', '1');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons.some(t => t?.includes('Complete'))).toBe(true);
    expect(buttons.some(t => t?.includes('Flag Exception'))).toBe(true);
  });

  it('shows tolerance dimensions', () => {
    const { fixture } = setup();
    fixture.componentRef.setInput('stageId', '1');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const labels = Array.from(el.querySelectorAll('.tolerance-dim-label')).map(e => e.textContent?.trim().toLowerCase());
    expect(labels).toContain('time');
    expect(labels).toContain('cost');
  });

  it('shows all four tab labels', () => {
    const { fixture } = setup();
    fixture.componentRef.setInput('stageId', '1');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const tabs = Array.from(el.querySelectorAll('.mat-mdc-tab')).map(t => t.textContent?.trim());
    expect(tabs).toContain('Plan');
    expect(tabs).toContain('Logs');
    expect(tabs).toContain('QA');
    expect(tabs).toContain('Boundaries');
  });

  describe('entity-document-card integration', () => {
    it('renders the document card below the info section', () => {
      const { fixture } = setup();
      fixture.componentRef.setInput('stageId', '1');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-entity-document-card')).toBeTruthy();
    });

    it('passes null initialDocument to card when stage has no linked doc', () => {
      const { fixture } = setup();
      fixture.componentRef.setInput('stageId', '1');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.edc__empty')).toBeTruthy();
    });

    it('card is outside the tab group (visible without tab click)', () => {
      const { fixture } = setup();
      fixture.componentRef.setInput('stageId', '1');
      fixture.detectChanges();
      const card = fixture.nativeElement.querySelector('app-entity-document-card');
      const tabGroup = fixture.nativeElement.querySelector('mat-tab-group');
      expect(card).toBeTruthy();
      expect(tabGroup.contains(card)).toBe(false);
    });
  });
});
