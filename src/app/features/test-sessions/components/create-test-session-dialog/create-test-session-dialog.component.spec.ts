import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CreateTestSessionDialogComponent,
  CreateTestSessionDialogData,
} from './create-test-session-dialog.component';
import { Member } from '../../../members/contracts/member.contracts';
import { ProjectService } from '../../../projects/services/project.service';
import { TestSessionPlan } from '../../contracts/test-session-plan.contracts';

const stubMember: Member = {
  id: 1,
  person: { id: 3, name: 'Carol', email: null, jobTitle: null, organization: null },
  role: 'team_member',
  side: null,
  createdAt: '2026-06-01T00:00:00Z',
};

const stubPlan: TestSessionPlan = {
  id: 2,
  projectId: 5,
  ref: 'TSP-001',
  title: 'Sprint 4 supplier session plan',
  description: null,
  teamType: 'supplier',
  assignee: null,
  status: 'active',
  plannedDate: '2026-07-10',
  scenarios: [],
  createdBy: null,
  updatedBy: null,
  createdAt: '2026-06-01T00:00:00Z',
  updatedAt: '2026-06-01T00:00:00Z',
};

const dialogData: CreateTestSessionDialogData = { members: [stubMember], plans: [stubPlan] };

function setup(data: CreateTestSessionDialogData = dialogData) {
  const dialogRef = { close: vi.fn() };
  const router = { navigate: vi.fn() };
  const projectService = { selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly() };
  TestBed.configureTestingModule({
    imports: [CreateTestSessionDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: data },
      { provide: Router, useValue: router },
      { provide: ProjectService, useValue: projectService },
    ],
  });
  const fixture: ComponentFixture<CreateTestSessionDialogComponent> = TestBed.createComponent(CreateTestSessionDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef, router };
}

describe('CreateTestSessionDialogComponent', () => {
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

  it('defaults to supplier team type', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.form.value.team_type).toBe('supplier');
  });

  it('closes with a create payload once all required fields are set', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({
      title: 'Sprint 4 supplier session',
      session_date: '2026-07-10',
      tester_id: 3,
      test_session_plan_id: 2,
    });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Sprint 4 supplier session',
        session_date: '2026-07-10',
        tester_id: 3,
        test_session_plan_id: 2,
        team_type: 'supplier',
      }),
    );
  });

  it('does not close when form is invalid', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('closes the dialog and navigates to the plan list when managing plans', () => {
    const { fixture, dialogRef, router } = setup();
    const comp = fixture.componentInstance as any;
    comp.managePlans();
    expect(dialogRef.close).toHaveBeenCalledWith();
    expect(router.navigate).toHaveBeenCalledWith(['/p', 5, 'test-session-plans']);
  });
});
