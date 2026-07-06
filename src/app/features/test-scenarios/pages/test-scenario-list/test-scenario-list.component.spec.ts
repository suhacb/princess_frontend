import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { TestScenarioListComponent } from './test-scenario-list.component';
import { TestScenarioService } from '../../services/test-scenario.service';
import { TestCaseService } from '../../services/test-case.service';
import { AcceptanceCriterionService } from '../../../acceptance-criteria/services/acceptance-criterion.service';
import { ProjectService } from '../../../projects/services/project.service';
import { TestScenario } from '../../contracts/test-scenario.contracts';
import { TestCase } from '../../contracts/test-case.contracts';

const stubScenario: TestScenario = {
  id: 1,
  projectId: 5,
  ref: 'TS-001',
  title: 'User can authenticate',
  description: null,
  preconditions: null,
  type: 'feature',
  status: 'draft',
  isTestable: false,
  testableNotes: null,
  testCases: [],
  acceptanceCriteria: [],
  createdBy: null,
  updatedBy: null,
  createdAt: '2026-06-01T09:00:00Z',
  updatedAt: '2026-06-01T09:00:00Z',
};

const stubCase: TestCase = {
  id: 10,
  testScenarioId: 1,
  projectId: 5,
  ref: 'TC-001',
  title: 'Log in with valid credentials',
  steps: ['Open login page'],
  expectedResult: 'Redirected to dashboard',
  priority: 'medium',
  type: 'positive',
  createdBy: null,
  updatedBy: null,
  createdAt: '2026-06-01T09:00:00Z',
  updatedAt: '2026-06-01T09:00:00Z',
};

function setup(scenarios: TestScenario[] = [], casesByScenario: Record<number, TestCase[]> = {}) {
  const scenarioService = {
    scenarios: signal(scenarios).asReadonly(),
    loading: signal(false).asReadonly(),
    selectedScenario: signal<TestScenario | null>(null).asReadonly(),
    list: vi.fn().mockReturnValue(of(scenarios)),
    create: vi.fn().mockReturnValue(of(stubScenario)),
    update: vi.fn().mockReturnValue(of(stubScenario)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    ready: vi.fn().mockReturnValue(of(stubScenario)),
    obsolete: vi.fn().mockReturnValue(of(stubScenario)),
    reopen: vi.fn().mockReturnValue(of(stubScenario)),
    markTestable: vi.fn().mockReturnValue(of(stubScenario)),
    markNotTestable: vi.fn().mockReturnValue(of(stubScenario)),
  };
  const caseService = {
    casesByScenario: signal(casesByScenario).asReadonly(),
    isLoading: vi.fn().mockReturnValue(false),
    casesFor: vi.fn((id: number) => casesByScenario[id] ?? []),
    list: vi.fn().mockReturnValue(of([])),
    create: vi.fn().mockReturnValue(of(stubCase)),
    update: vi.fn().mockReturnValue(of(stubCase)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    clearCache: vi.fn(),
  };
  const acceptanceCriterionService = {
    criteria: signal([]).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [TestScenarioListComponent, BrowserAnimationsModule],
    providers: [
      { provide: TestScenarioService, useValue: scenarioService },
      { provide: TestCaseService, useValue: caseService },
      { provide: AcceptanceCriterionService, useValue: acceptanceCriterionService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<TestScenarioListComponent> = TestBed.createComponent(TestScenarioListComponent);
  fixture.detectChanges();
  return { fixture, scenarioService, caseService };
}

describe('TestScenarioListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { scenarioService } = setup();
    expect(scenarioService.list).toHaveBeenCalledWith(5);
  });

  it('shows empty state when there are no scenarios', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders the scenario ref and title', () => {
    const { fixture } = setup([stubScenario]);
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('TS-001');
    expect(text).toContain('User can authenticate');
  });

  it('filters by status', () => {
    const ready: TestScenario = { ...stubScenario, id: 2, ref: 'TS-002', title: 'Ready scenario', status: 'ready' };
    const { fixture } = setup([stubScenario, ready]);
    const comp = fixture.componentInstance as any;
    comp.statusFilter.set('ready');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.scenario-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Ready scenario');
  });

  it('filters by type', () => {
    const e2e: TestScenario = { ...stubScenario, id: 2, ref: 'TS-002', title: 'E2E scenario', type: 'e2e' };
    const { fixture } = setup([stubScenario, e2e]);
    const comp = fixture.componentInstance as any;
    comp.typeFilter.set('e2e');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.scenario-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('E2E scenario');
  });

  it('filters by testable flag', () => {
    const testable: TestScenario = { ...stubScenario, id: 2, ref: 'TS-002', title: 'Testable scenario', isTestable: true };
    const { fixture } = setup([stubScenario, testable]);
    const comp = fixture.componentInstance as any;
    comp.testableFilter.set('yes');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.scenario-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Testable scenario');
  });

  it('expands a scenario and loads its test cases on first expand', () => {
    const { fixture, caseService } = setup([stubScenario]);
    const comp = fixture.componentInstance as any;
    comp.toggleExpand(stubScenario);
    fixture.detectChanges();
    expect(caseService.list).toHaveBeenCalledWith(5, 1);
    expect(fixture.nativeElement.querySelector('.scenario-cases')).toBeTruthy();
  });

  it('collapses an expanded scenario without refetching', () => {
    const { fixture, caseService } = setup([stubScenario], { 1: [stubCase] });
    const comp = fixture.componentInstance as any;
    comp.toggleExpand(stubScenario);
    fixture.detectChanges();
    expect(caseService.list).not.toHaveBeenCalled();
    comp.toggleExpand(stubScenario);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.scenario-cases')).toBeFalsy();
  });

  it('renders cached test cases once expanded', () => {
    const { fixture } = setup([stubScenario], { 1: [stubCase] });
    const comp = fixture.componentInstance as any;
    comp.toggleExpand(stubScenario);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('TC-001');
  });

  it('markReady() calls the service', () => {
    const { fixture, scenarioService } = setup([stubScenario]);
    const comp = fixture.componentInstance as any;
    comp.markReady(stubScenario);
    expect(scenarioService.ready).toHaveBeenCalledWith(5, 1);
  });

  it('deleteScenario() calls remove', () => {
    const { fixture, scenarioService } = setup([stubScenario]);
    const comp = fixture.componentInstance as any;
    comp.deleteScenario(stubScenario);
    expect(scenarioService.remove).toHaveBeenCalledWith(5, 1);
  });

  it('deleteCase() calls case remove', () => {
    const { fixture, caseService } = setup([stubScenario], { 1: [stubCase] });
    const comp = fixture.componentInstance as any;
    comp.deleteCase(stubScenario, stubCase);
    expect(caseService.remove).toHaveBeenCalledWith(5, 1, 10);
  });
});
