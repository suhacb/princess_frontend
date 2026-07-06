import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CreateAcceptanceCriterionDialogComponent,
  CreateAcceptanceCriterionDialogData,
} from './create-acceptance-criterion-dialog.component';
import { Member } from '../../../members/contracts/member.contracts';
import { RequirementRef } from '../../contracts/acceptance-criterion.contracts';

const stubMember: Member = {
  id: 1,
  person: { id: 10, name: 'Alice', email: null, jobTitle: null, organization: null },
  role: 'project_manager',
  side: null,
  createdAt: '2026-01-01T00:00:00Z',
};

const stubRequirement: RequirementRef = { id: 3, ref: 'REQ-001', title: 'System must support SSO', type: 'classic' };

function setup(overrides: Partial<CreateAcceptanceCriterionDialogData> = {}) {
  const dialogData: CreateAcceptanceCriterionDialogData = {
    requirements: [stubRequirement],
    members: [stubMember],
    ...overrides,
  };
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [CreateAcceptanceCriterionDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: dialogData },
    ],
  });
  const fixture: ComponentFixture<CreateAcceptanceCriterionDialogComponent> = TestBed.createComponent(
    CreateAcceptanceCriterionDialogComponent,
  );
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('CreateAcceptanceCriterionDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('creates successfully', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('Create button is disabled when form is invalid', () => {
    const { fixture } = setup();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(btn.disabled).toBe(true);
  });

  it('preselects the requirement when provided', () => {
    const { fixture } = setup({ preselectedRequirementId: 3 });
    const comp = fixture.componentInstance as any;
    expect(comp.form.value.requirement_id).toBe(3);
  });

  it('closes with a payload when the form is valid', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({
      requirement_id: 3,
      title: 'Login succeeds with valid SSO token',
      description: 'User can log in via SSO and land on the dashboard',
      verification_method: 'test',
      verifier_id: 10,
    });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith(
      expect.objectContaining({
        requirement_id: 3,
        title: 'Login succeeds with valid SSO token',
        verification_method: 'test',
        verifier_id: 10,
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
