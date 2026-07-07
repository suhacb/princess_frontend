import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CreateTestSessionPlanDialogComponent,
  CreateTestSessionPlanDialogData,
} from './create-test-session-plan-dialog.component';
import { Member } from '../../../members/contracts/member.contracts';
import { TestScenario } from '../../../test-scenarios/contracts/test-scenario.contracts';
import { TestSessionPlan } from '../../contracts/test-session-plan.contracts';

const stubMember: Member = {
  id: 1,
  person: { id: 3, name: 'Carol', email: null, jobTitle: null, organization: null },
  role: 'team_member',
  side: null,
  createdAt: '2026-06-01T00:00:00Z',
};

function scenario(id: number, ref: string, title: string): TestScenario {
  return {
    id,
    projectId: 5,
    ref,
    title,
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
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z',
  };
}

const stubScenarios: TestScenario[] = [scenario(10, 'TSC-001', 'Login works'), scenario(11, 'TSC-002', 'Logout works')];

const dialogData: CreateTestSessionPlanDialogData = { members: [stubMember], scenarios: stubScenarios };

function setup(data: CreateTestSessionPlanDialogData = dialogData) {
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [CreateTestSessionPlanDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: data },
    ],
  });
  const fixture: ComponentFixture<CreateTestSessionPlanDialogComponent> = TestBed.createComponent(
    CreateTestSessionPlanDialogComponent,
  );
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('CreateTestSessionPlanDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('creates successfully', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('Create button is disabled until required fields are filled', () => {
    const { fixture } = setup();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(btn.disabled).toBe(true);
  });

  it('lists all testable scenarios as available initially', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.availableScenarios()).toHaveLength(2);
    expect(comp.selectedScenarios()).toHaveLength(0);
  });

  it('moves a scenario from available to selected and preserves order on add', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    comp.addScenario(stubScenarios[1]);
    comp.addScenario(stubScenarios[0]);
    expect(comp.selectedScenarios().map((s: TestScenario) => s.id)).toEqual([11, 10]);
    expect(comp.availableScenarios()).toHaveLength(0);
  });

  it('reorders selected scenarios with moveUp/moveDown', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    comp.addScenario(stubScenarios[0]);
    comp.addScenario(stubScenarios[1]);
    comp.moveUp(1);
    expect(comp.selectedScenarios().map((s: TestScenario) => s.id)).toEqual([11, 10]);
    comp.moveDown(0);
    expect(comp.selectedScenarios().map((s: TestScenario) => s.id)).toEqual([10, 11]);
  });

  it('removes a scenario from selected back to available', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    comp.addScenario(stubScenarios[0]);
    comp.removeScenario(stubScenarios[0]);
    expect(comp.selectedScenarios()).toHaveLength(0);
    expect(comp.availableScenarios()).toHaveLength(2);
  });

  it('closes with a create payload including ordered scenario_ids', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ title: 'Sprint 4 plan', planned_date: '2026-07-10' });
    comp.addScenario(stubScenarios[1]);
    comp.addScenario(stubScenarios[0]);
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Sprint 4 plan',
        planned_date: '2026-07-10',
        team_type: 'supplier',
        scenario_ids: [11, 10],
      }),
    );
  });

  it('does not close when form is invalid', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('pre-populates the form and selection when editing an existing plan', () => {
    const plan: TestSessionPlan = {
      id: 9,
      projectId: 5,
      ref: 'TSP-001',
      title: 'Existing plan',
      description: 'desc',
      plannedDate: '2026-07-11',
      teamType: 'client',
      assignee: { id: 3, name: 'Carol', email: null, jobTitle: null, organization: null },
      status: 'draft',
      scenarios: [scenario(10, 'TSC-001', 'Login works')],
      createdBy: null,
      updatedBy: null,
      createdAt: '2026-07-01T00:00:00Z',
      updatedAt: '2026-07-01T00:00:00Z',
    };
    const { fixture } = setup({ ...dialogData, plan });
    const comp = fixture.componentInstance as any;
    expect(comp.form.value.title).toBe('Existing plan');
    expect(comp.form.value.team_type).toBe('client');
    expect(comp.form.value.assignee_id).toBe(3);
    expect(comp.selectedScenarios().map((s: TestScenario) => s.id)).toEqual([10]);
    expect(comp.isEdit).toBe(true);
  });
});
