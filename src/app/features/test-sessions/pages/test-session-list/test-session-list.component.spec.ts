import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TestSessionListComponent } from './test-session-list.component';
import { TestSessionService } from '../../services/test-session.service';
import { TestSessionPlanService } from '../../services/test-session-plan.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { TestSession } from '../../contracts/test-session.contracts';

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
  status: 'planned',
  notes: null,
  results: [],
  createdBy: null,
  updatedBy: null,
  createdAt: '2026-07-01T10:00:00Z',
  updatedAt: '2026-07-01T10:00:00Z',
};

function setup(sessions: TestSession[] = []) {
  const sessionService = {
    sessions: signal(sessions).asReadonly(),
    loading: signal(false).asReadonly(),
    list: vi.fn().mockReturnValue(of(sessions)),
    create: vi.fn().mockReturnValue(of(stubSession)),
  };
  const planService = { list: vi.fn().mockReturnValue(of([])) };
  const memberService = {
    members: signal([]).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };
  const projectService = { selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly() };
  const router = { navigate: vi.fn() };

  TestBed.configureTestingModule({
    imports: [TestSessionListComponent, BrowserAnimationsModule],
    providers: [
      { provide: TestSessionService, useValue: sessionService },
      { provide: TestSessionPlanService, useValue: planService },
      { provide: MemberService, useValue: memberService },
      { provide: ProjectService, useValue: projectService },
      { provide: Router, useValue: router },
    ],
  });

  const fixture: ComponentFixture<TestSessionListComponent> = TestBed.createComponent(TestSessionListComponent);
  fixture.detectChanges();
  return { fixture, sessionService, planService, router };
}

describe('TestSessionListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { sessionService } = setup();
    expect(sessionService.list).toHaveBeenCalledWith(5);
  });

  it('shows empty state when there are no sessions', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders the session ref and title', () => {
    const { fixture } = setup([stubSession]);
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('TSE-001');
    expect(text).toContain('Sprint 4 supplier session');
  });

  it('filters by status', () => {
    const completed: TestSession = { ...stubSession, id: 2, ref: 'TSE-002', title: 'Completed session', status: 'completed' };
    const { fixture } = setup([stubSession, completed]);
    const comp = fixture.componentInstance as any;
    comp.statusFilter.set('completed');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.session-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Completed session');
  });

  it('filters by team type', () => {
    const client: TestSession = { ...stubSession, id: 2, ref: 'TSE-002', title: 'Client session', teamType: 'client' };
    const { fixture } = setup([stubSession, client]);
    const comp = fixture.componentInstance as any;
    comp.teamTypeFilter.set('client');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.session-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Client session');
  });

  it('navigates to the detail page on row click', () => {
    const { fixture, router } = setup([stubSession]);
    const comp = fixture.componentInstance as any;
    comp.openSession(stubSession);
    expect(router.navigate).toHaveBeenCalledWith(['/p', 5, 'test-sessions', 1]);
  });

  it('opens the create dialog and navigates to the new session on create', () => {
    const { fixture, sessionService, planService, router } = setup([]);
    const comp = fixture.componentInstance as any;
    const dialogSpy = { afterClosed: () => of({ title: 'New', session_date: '2026-07-10', tester_id: 3, team_type: 'supplier', test_session_plan_id: 2 }) };
    comp['dialog'] = { open: vi.fn().mockReturnValue(dialogSpy) };
    comp.openCreateDialog();
    expect(planService.list).toHaveBeenCalledWith(5);
    expect(sessionService.create).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/p', 5, 'test-sessions', 1]);
  });
});
