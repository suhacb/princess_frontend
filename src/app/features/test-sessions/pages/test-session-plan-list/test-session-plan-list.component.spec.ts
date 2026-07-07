import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { TestSessionPlanListComponent } from './test-session-plan-list.component';
import { TestSessionPlanService } from '../../services/test-session-plan.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { TestScenarioService } from '../../../test-scenarios/services/test-scenario.service';
import { TestSessionPlan } from '../../contracts/test-session-plan.contracts';

const stubPlan: TestSessionPlan = {
  id: 1,
  projectId: 5,
  ref: 'TSP-001',
  title: 'Sprint 4 supplier session plan',
  description: null,
  plannedDate: '2026-07-10',
  teamType: 'supplier',
  assignee: { id: 3, name: 'Carol', email: null, jobTitle: null, organization: null },
  status: 'draft',
  scenarios: [],
  createdBy: null,
  updatedBy: null,
  createdAt: '2026-07-01T10:00:00Z',
  updatedAt: '2026-07-01T10:00:00Z',
};

function setup(plans: TestSessionPlan[] = []) {
  const planService = {
    plans: signal(plans).asReadonly(),
    loading: signal(false).asReadonly(),
    list: vi.fn().mockReturnValue(of(plans)),
    create: vi.fn().mockReturnValue(of(stubPlan)),
    update: vi.fn().mockReturnValue(of(stubPlan)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    activate: vi.fn().mockReturnValue(of({ ...stubPlan, status: 'active' })),
    complete: vi.fn().mockReturnValue(of({ ...stubPlan, status: 'completed' })),
    cancel: vi.fn().mockReturnValue(of({ ...stubPlan, status: 'cancelled' })),
  };
  const memberService = {
    members: signal([]).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };
  const scenarioService = { list: vi.fn().mockReturnValue(of([])) };
  const projectService = { selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly() };

  TestBed.configureTestingModule({
    imports: [TestSessionPlanListComponent, BrowserAnimationsModule],
    providers: [
      { provide: TestSessionPlanService, useValue: planService },
      { provide: MemberService, useValue: memberService },
      { provide: ProjectService, useValue: projectService },
      { provide: TestScenarioService, useValue: scenarioService },
    ],
  });

  const fixture: ComponentFixture<TestSessionPlanListComponent> = TestBed.createComponent(TestSessionPlanListComponent);
  fixture.detectChanges();
  return { fixture, planService, scenarioService };
}

describe('TestSessionPlanListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { planService } = setup();
    expect(planService.list).toHaveBeenCalledWith(5);
  });

  it('shows empty state when there are no plans', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders the plan ref and title', () => {
    const { fixture } = setup([stubPlan]);
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('TSP-001');
    expect(text).toContain('Sprint 4 supplier session plan');
  });

  it('filters by status', () => {
    const active: TestSessionPlan = { ...stubPlan, id: 2, ref: 'TSP-002', title: 'Active plan', status: 'active' };
    const { fixture } = setup([stubPlan, active]);
    const comp = fixture.componentInstance as any;
    comp.statusFilter.set('active');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.plan-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Active plan');
  });

  it('filters by team type', () => {
    const client: TestSessionPlan = { ...stubPlan, id: 2, ref: 'TSP-002', title: 'Client plan', teamType: 'client' };
    const { fixture } = setup([stubPlan, client]);
    const comp = fixture.componentInstance as any;
    comp.teamTypeFilter.set('client');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.plan-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Client plan');
  });

  it('opens the create dialog and creates a plan on confirm', () => {
    const { fixture, planService, scenarioService } = setup([]);
    const comp = fixture.componentInstance as any;
    const dialogSpy = { afterClosed: () => of({ title: 'New', planned_date: '2026-07-10', team_type: 'supplier' }) };
    comp['dialog'] = { open: vi.fn().mockReturnValue(dialogSpy) };
    comp.openCreateDialog();
    expect(scenarioService.list).toHaveBeenCalledWith(5, { is_testable: true });
    expect(planService.create).toHaveBeenCalledWith(5, { title: 'New', planned_date: '2026-07-10', team_type: 'supplier' });
  });

  it('opens the edit dialog only for draft plans', () => {
    const { fixture } = setup([stubPlan]);
    const comp = fixture.componentInstance as any;
    const openSpy = vi.fn().mockReturnValue({ afterClosed: () => of(undefined) });
    comp['dialog'] = { open: openSpy };
    const activePlan: TestSessionPlan = { ...stubPlan, status: 'active' };
    comp.openEditDialog(activePlan);
    expect(openSpy).not.toHaveBeenCalled();
    comp.openEditDialog(stubPlan);
    expect(openSpy).toHaveBeenCalled();
  });

  it('updates a plan when the edit dialog closes with a payload', () => {
    const { fixture, planService } = setup([stubPlan]);
    const comp = fixture.componentInstance as any;
    const dialogSpy = { afterClosed: () => of({ title: 'Edited' }) };
    comp['dialog'] = { open: vi.fn().mockReturnValue(dialogSpy) };
    comp.openEditDialog(stubPlan);
    expect(planService.update).toHaveBeenCalledWith(5, 1, { title: 'Edited' });
  });

  it('deletes a plan', () => {
    const { fixture, planService } = setup([stubPlan]);
    const comp = fixture.componentInstance as any;
    comp.deletePlan(stubPlan);
    expect(planService.remove).toHaveBeenCalledWith(5, 1);
  });

  it('activates a draft plan', () => {
    const { fixture, planService } = setup([stubPlan]);
    const comp = fixture.componentInstance as any;
    comp.activatePlan(stubPlan);
    expect(planService.activate).toHaveBeenCalledWith(5, 1);
  });

  it('completes and cancels an active plan', () => {
    const { fixture, planService } = setup([stubPlan]);
    const comp = fixture.componentInstance as any;
    comp.completePlan(stubPlan);
    expect(planService.complete).toHaveBeenCalledWith(5, 1);
    comp.cancelPlan(stubPlan);
    expect(planService.cancel).toHaveBeenCalledWith(5, 1);
  });
});
