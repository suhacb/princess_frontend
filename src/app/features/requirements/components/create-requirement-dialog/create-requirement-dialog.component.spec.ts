import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateRequirementDialogComponent, CreateRequirementDialogData } from './create-requirement-dialog.component';
import { Member } from '../../../members/contracts/member.contracts';
import { Requirement } from '../../contracts/requirement.contracts';

const stubMember: Member = {
  id: 1,
  person: { id: 10, name: 'Alice', email: null, jobTitle: null, organization: null },
  role: 'project_manager',
  side: null,
  createdAt: '2026-01-01T00:00:00Z',
};

const stubEpic: Requirement = {
  id: 3,
  projectId: 5,
  type: 'epic',
  parentId: null,
  ref: 'REQ-001',
  title: 'Onboarding epic',
  description: null,
  role: null,
  action: null,
  benefit: null,
  priority: 'must',
  status: 'draft',
  source: null,
  owner: null,
  version: 1,
  approvedBy: null,
  approvedAt: null,
  children: [],
  createdBy: null,
  updatedBy: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const dialogData: CreateRequirementDialogData = { members: [stubMember], epics: [stubEpic] };

function setup() {
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [CreateRequirementDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: dialogData },
    ],
  });
  const fixture: ComponentFixture<CreateRequirementDialogComponent> = TestBed.createComponent(CreateRequirementDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('CreateRequirementDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('creates successfully', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('Create button is disabled when title is empty', () => {
    const { fixture } = setup();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(btn.disabled).toBe(true);
  });

  it('defaults to classic type and should priority', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.form.value.type).toBe('classic');
    expect(comp.form.value.priority).toBe('should');
  });

  it('closes with a classic requirement payload', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ title: 'Support SSO', priority: 'must' });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'classic', title: 'Support SSO', priority: 'must', role: null, action: null, benefit: null }),
    );
  });

  it('includes role/action/benefit for user stories and clears parent_id for epics', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({
      type: 'user_story',
      title: 'Log in',
      role: 'customer',
      action: 'log in',
      benefit: 'access my account',
    });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'user_story',
        role: 'customer',
        action: 'log in',
        benefit: 'access my account',
      }),
    );
  });

  it('forces parent_id to null when type is epic', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ type: 'epic', title: 'New epic', parent_id: 3 });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith(expect.objectContaining({ type: 'epic', parent_id: null }));
  });

  it('does not close when form is invalid', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
