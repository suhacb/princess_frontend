import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CreateTestSessionDialogComponent,
  CreateTestSessionDialogData,
} from './create-test-session-dialog.component';
import { Member } from '../../../members/contracts/member.contracts';
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
  ref: 'TSP-001',
  title: 'Sprint 4 supplier session plan',
  teamType: 'supplier',
  status: 'active',
  plannedDate: '2026-07-10',
};

const dialogData: CreateTestSessionDialogData = { members: [stubMember], plans: [stubPlan] };

function setup(data: CreateTestSessionDialogData = dialogData) {
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [CreateTestSessionDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: data },
    ],
  });
  const fixture: ComponentFixture<CreateTestSessionDialogComponent> = TestBed.createComponent(CreateTestSessionDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
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
});
