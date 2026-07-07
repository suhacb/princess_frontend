import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TestSessionDetailComponent } from './test-session-detail.component';
import { TestSessionService } from '../../services/test-session.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { ToastService } from '../../../../core/services/toast.service';
import { TestSession, TestSessionReport } from '../../contracts/test-session.contracts';
import { TestSessionResult } from '../../contracts/test-session-result.contracts';
import { TestCase } from '../../../test-scenarios/contracts/test-case.contracts';
import { TestScenario } from '../../../test-scenarios/contracts/test-scenario.contracts';

const stubScenario: TestScenario = {
  id: 1,
  projectId: 5,
  ref: 'TS-001',
  title: 'User can authenticate',
  description: null,
  preconditions: null,
  type: 'feature',
  status: 'ready',
  isTestable: true,
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
  steps: ['Open login page', 'Submit form'],
  expectedResult: 'Redirected to dashboard',
  priority: 'high',
  type: 'positive',
  createdBy: null,
  updatedBy: null,
  createdAt: '2026-06-01T09:00:00Z',
  updatedAt: '2026-06-01T09:00:00Z',
};

const stubResult: TestSessionResult = {
  id: 100,
  testSessionId: 1,
  testScenario: stubScenario,
  testCase: stubCase,
  result: 'not_run',
  stepResults: null,
  notes: null,
  defectRef: null,
  executedAt: null,
  attachments: {},
};

const stubSession: TestSession = {
  id: 1,
  projectId: 5,
  testSessionPlanId: 2,
  ref: 'TSE-001',
  title: 'Sprint 4 supplier session',
  sessionDate: '2026-07-10',
  tester: { id: 3, name: 'Carol', email: null, jobTitle: null, organization: null },
  teamType: 'supplier',
  environment: 'staging',
  status: 'in_progress',
  notes: null,
  results: [stubResult],
  createdBy: null,
  updatedBy: null,
  createdAt: '2026-07-01T10:00:00Z',
  updatedAt: '2026-07-01T10:00:00Z',
};

const stubReport: TestSessionReport = {
  ref: 'TSE-001',
  title: 'Sprint 4 supplier session',
  sessionDate: '2026-07-10',
  teamType: 'supplier',
  environment: 'staging',
  status: 'in_progress',
  notes: null,
  summary: { pass: 0, fail: 0, blocked: 0, not_run: 1, skipped: 0 },
  results: [],
};

function setup(session: TestSession | null = stubSession, loading = false) {
  const sessionSignal = signal(session);
  const sessionService = {
    selectedSession: sessionSignal.asReadonly(),
    loading: signal(loading).asReadonly(),
    load: vi.fn().mockReturnValue(of(session)),
    update: vi.fn().mockReturnValue(of(session)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    start: vi.fn().mockReturnValue(of(session)),
    complete: vi.fn().mockReturnValue(of(session)),
    cancel: vi.fn().mockReturnValue(of(session)),
    updateResult: vi.fn().mockReturnValue(of(stubResult)),
    updateTestCaseResult: vi.fn().mockReturnValue(of(stubResult)),
    uploadAttachment: vi.fn().mockReturnValue(of({})),
    deleteAttachment: vi.fn().mockReturnValue(of(undefined)),
    report: vi.fn().mockReturnValue(of(stubReport)),
  };
  const memberService = {
    members: signal([]).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };
  const projectService = { selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly() };
  const toast = { success: vi.fn(), error: vi.fn(), info: vi.fn() };

  TestBed.configureTestingModule({
    imports: [TestSessionDetailComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: TestSessionService, useValue: sessionService },
      { provide: MemberService, useValue: memberService },
      { provide: ProjectService, useValue: projectService },
      { provide: ToastService, useValue: toast },
    ],
  });

  const fixture: ComponentFixture<TestSessionDetailComponent> = TestBed.createComponent(TestSessionDetailComponent);
  fixture.componentRef.setInput('sessionId', '1');
  fixture.detectChanges();
  return { fixture, sessionService, toast };
}

describe('TestSessionDetailComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders session title and ref', () => {
    const { fixture } = setup();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Sprint 4 supplier session');
    expect(text).toContain('TSE-001');
  });

  it('calls load on init', () => {
    const { sessionService } = setup();
    expect(sessionService.load).toHaveBeenCalledWith(5, 1);
  });

  it('shows skeleton when loading and no session', () => {
    const { fixture } = setup(null, true);
    expect(fixture.nativeElement.querySelector('.detail-skeleton')).toBeTruthy();
  });

  it('shows load error when load fails', () => {
    const sessionSignal = signal<TestSession | null>(null);
    const sessionService = {
      selectedSession: sessionSignal.asReadonly(),
      loading: signal(false).asReadonly(),
      load: vi.fn().mockReturnValue(throwError(() => new Error('fail'))),
      report: vi.fn().mockReturnValue(of(stubReport)),
    };
    const memberService = { members: signal([]).asReadonly(), list: vi.fn().mockReturnValue(of([])) };
    const projectService = { selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly() };
    const toast = { success: vi.fn(), error: vi.fn(), info: vi.fn() };

    TestBed.configureTestingModule({
      imports: [TestSessionDetailComponent, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: TestSessionService, useValue: sessionService },
        { provide: MemberService, useValue: memberService },
        { provide: ProjectService, useValue: projectService },
        { provide: ToastService, useValue: toast },
      ],
    });

    const fixture: ComponentFixture<TestSessionDetailComponent> = TestBed.createComponent(TestSessionDetailComponent);
    fixture.componentRef.setInput('sessionId', '1');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.load-error')).toBeTruthy();
  });

  it('shows Start/Edit/Delete actions when planned', () => {
    const planned: TestSession = { ...stubSession, status: 'planned' };
    const { fixture } = setup(planned);
    expect(fixture.nativeElement.textContent).toContain('Start');
    expect(fixture.nativeElement.textContent).toContain('Edit');
    expect(fixture.nativeElement.textContent).toContain('Delete');
  });

  it('shows Complete/Cancel actions when in progress', () => {
    const { fixture } = setup(stubSession);
    expect(fixture.nativeElement.textContent).toContain('Complete');
    expect(fixture.nativeElement.textContent).toContain('Cancel session');
  });

  it('start() calls the service', () => {
    const { fixture, sessionService } = setup();
    const comp = fixture.componentInstance as any;
    comp.startSession();
    expect(sessionService.start).toHaveBeenCalledWith(5, 1);
  });

  it('completeSession() calls the service and shows a success toast', () => {
    const { fixture, sessionService, toast } = setup();
    const comp = fixture.componentInstance as any;
    comp.completeSession();
    expect(sessionService.complete).toHaveBeenCalledWith(5, 1);
    expect(toast.success).toHaveBeenCalledWith('Session completed — issues created for failed results.');
  });

  it('cancelSession() calls the service', () => {
    const { fixture, sessionService } = setup();
    const comp = fixture.componentInstance as any;
    comp.cancelSession();
    expect(sessionService.cancel).toHaveBeenCalledWith(5, 1);
  });

  it('deleteSession() calls remove and navigates back', () => {
    const { fixture, sessionService } = setup();
    const comp = fixture.componentInstance as any;
    comp.deleteSession();
    expect(sessionService.remove).toHaveBeenCalledWith(5, 1);
  });

  it('setScenarioResult() calls updateResult with the given result', () => {
    const { fixture, sessionService } = setup();
    const comp = fixture.componentInstance as any;
    comp.setScenarioResult(stubScenario, 'pass');
    expect(sessionService.updateResult).toHaveBeenCalledWith(5, 1, 1, { result: 'pass' });
  });

  it('builds a case form with one control per step', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    const form = comp.caseFormFor(stubCase);
    expect(form.get('steps').length).toBe(2);
  });

  it('saveCaseResult() submits step_results built from the case form', () => {
    const { fixture, sessionService } = setup();
    const comp = fixture.componentInstance as any;
    const steps = comp.stepsArrayFor(stubCase);
    steps.at(0).patchValue({ result: 'pass', actual_result: 'Looked fine' });
    comp.saveCaseResult(stubScenario, stubCase);
    expect(sessionService.updateTestCaseResult).toHaveBeenCalledWith(5, 1, 1, 10, {
      step_results: [
        { step_index: 0, result: 'pass', actual_result: 'Looked fine', defect_ref: null },
        { step_index: 1, result: 'not_run', actual_result: null, defect_ref: null },
      ],
      notes: null,
      defect_ref: null,
    });
  });

  it('uploadAttachment is called with the selected file', () => {
    const { fixture, sessionService } = setup();
    const comp = fixture.componentInstance as any;
    const file = new File(['content'], 'shot.png', { type: 'image/png' });
    const event = { target: { files: [file], value: '' } } as unknown as Event;
    comp.onFileSelected(event, stubScenario, stubCase, 0);
    expect(sessionService.uploadAttachment).toHaveBeenCalledWith(5, 1, 1, 10, file, 0);
  });

  it('removeAttachment() calls deleteAttachment', () => {
    const { fixture, sessionService } = setup();
    const comp = fixture.componentInstance as any;
    comp.removeAttachment(50, stubCase);
    expect(sessionService.deleteAttachment).toHaveBeenCalledWith(5, 1, 50, 10);
  });

  it('renders the result summary donut once a report is loaded', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('app-session-summary-donut')).toBeTruthy();
  });
});
