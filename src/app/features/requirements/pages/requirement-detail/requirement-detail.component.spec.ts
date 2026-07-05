import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { RequirementDetailComponent } from './requirement-detail.component';
import { RequirementService } from '../../services/requirement.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Requirement } from '../../contracts/requirement.contracts';

const stubRequirement: Requirement = {
  id: 1,
  projectId: 5,
  type: 'classic',
  parentId: null,
  ref: 'REQ-001',
  title: 'System must support SSO',
  description: 'Full description',
  role: null,
  action: null,
  benefit: null,
  priority: 'must',
  status: 'draft',
  source: null,
  owner: { id: 10, name: 'Alice', email: null, jobTitle: null, organization: null },
  version: 1,
  approvedBy: null,
  approvedAt: null,
  children: [],
  createdBy: null,
  updatedBy: null,
  createdAt: '2026-06-01T10:00:00Z',
  updatedAt: '2026-06-01T10:00:00Z',
};

function buildRequirementServiceMock(requirement: Requirement | null, loading = false) {
  const requirementSignal = signal(requirement);
  return {
    selectedRequirement: requirementSignal.asReadonly(),
    loading: signal(loading).asReadonly(),
    load: vi.fn().mockReturnValue(of(requirement)),
    update: vi.fn().mockReturnValue(of(requirement)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    review: vi.fn().mockReturnValue(of(requirement)),
    approve: vi.fn().mockReturnValue(of(requirement)),
    reject: vi.fn().mockReturnValue(of(requirement)),
    defer: vi.fn().mockReturnValue(of(requirement)),
  };
}

function setup(requirement: Requirement | null = stubRequirement, loading = false) {
  const requirementService = buildRequirementServiceMock(requirement, loading);
  const memberService = {
    members: signal([]).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [RequirementDetailComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: RequirementService, useValue: requirementService },
      { provide: MemberService, useValue: memberService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<RequirementDetailComponent> = TestBed.createComponent(RequirementDetailComponent);
  fixture.componentRef.setInput('requirementId', '1');
  fixture.detectChanges();
  return { fixture, requirementService, memberService };
}

describe('RequirementDetailComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders requirement title and ref', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('System must support SSO');
    expect(fixture.nativeElement.textContent).toContain('REQ-001');
  });

  it('calls load on init', () => {
    const { requirementService } = setup();
    expect(requirementService.load).toHaveBeenCalledWith(5, 1);
  });

  it('shows skeleton when loading and no requirement', () => {
    const { fixture } = setup(null, true);
    expect(fixture.nativeElement.querySelector('.detail-skeleton')).toBeTruthy();
  });

  it('renders status and priority chips', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('app-requirement-status-chip')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-requirement-priority-chip')).toBeTruthy();
  });

  it('shows the delete button only when status is draft', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('.delete-btn')).toBeTruthy();
  });

  it('hides the delete button when status is approved', () => {
    const { fixture } = setup({ ...stubRequirement, status: 'approved' });
    expect(fixture.nativeElement.querySelector('.delete-btn')).toBeFalsy();
  });

  it('shows "Send for review" action for a draft requirement', () => {
    const { fixture } = setup({ ...stubRequirement, status: 'draft' });
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Send for review');
  });

  it('shows Approve and Reject actions for a reviewed requirement', () => {
    const { fixture } = setup({ ...stubRequirement, status: 'reviewed' });
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Approve');
    expect(text).toContain('Reject');
  });

  it('shows no workflow actions for an approved requirement', () => {
    const { fixture } = setup({ ...stubRequirement, status: 'approved' });
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('No further workflow actions');
  });

  it('shows role/action/benefit fields for a user story', () => {
    const { fixture } = setup({ ...stubRequirement, type: 'user_story', role: 'customer', action: 'log in', benefit: 'access account' });
    expect(fixture.nativeElement.textContent).toContain('As a…');
  });

  it('calls review() when Send for review is clicked', () => {
    const { fixture, requirementService } = setup({ ...stubRequirement, status: 'draft' });
    const comp = fixture.componentInstance as any;
    comp.sendForReview();
    expect(requirementService.review).toHaveBeenCalledWith(5, 1);
  });

  it('calls approve() and reject()', () => {
    const { fixture, requirementService } = setup({ ...stubRequirement, status: 'reviewed' });
    const comp = fixture.componentInstance as any;
    comp.approve();
    expect(requirementService.approve).toHaveBeenCalledWith(5, 1);
    comp.reject();
    expect(requirementService.reject).toHaveBeenCalledWith(5, 1);
  });

  it('calls defer()', () => {
    const { fixture, requirementService } = setup();
    const comp = fixture.componentInstance as any;
    comp.defer();
    expect(requirementService.defer).toHaveBeenCalledWith(5, 1);
  });

  it('shows an action error banner when a transition fails', () => {
    const requirementService = buildRequirementServiceMock(stubRequirement);
    requirementService.approve.mockReturnValue(throwError(() => new Error('403')));
    const memberService = { members: signal([]).asReadonly(), list: vi.fn().mockReturnValue(of([])) };
    const projectService = { selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly() };

    TestBed.configureTestingModule({
      imports: [RequirementDetailComponent, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: RequirementService, useValue: requirementService },
        { provide: MemberService, useValue: memberService },
        { provide: ProjectService, useValue: projectService },
      ],
    });
    const fixture: ComponentFixture<RequirementDetailComponent> = TestBed.createComponent(RequirementDetailComponent);
    fixture.componentRef.setInput('requirementId', '1');
    fixture.detectChanges();
    const comp = fixture.componentInstance as any;
    comp.approve();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.error-banner')).toBeTruthy();
  });

  it('Save button is disabled when form is pristine', () => {
    const { fixture } = setup();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(btn?.disabled).toBe(true);
  });

  it('calls update on save via button click', () => {
    const { fixture, requirementService } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.markAsDirty();
    fixture.detectChanges();
    const saveBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
    saveBtn?.click();
    expect(requirementService.update).toHaveBeenCalledWith(5, 1, expect.any(Object));
  });

  it('renders back button', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('button[aria-label="Back"]')).toBeTruthy();
  });

  it('calls remove on delete', () => {
    const { fixture, requirementService } = setup();
    const comp = fixture.componentInstance as any;
    comp.deleteRequirement();
    expect(requirementService.remove).toHaveBeenCalledWith(5, 1);
  });

  it('shows load error when load fails', () => {
    const requirementSignal = signal<Requirement | null>(null);
    const requirementService = {
      selectedRequirement: requirementSignal.asReadonly(),
      loading: signal(false).asReadonly(),
      load: vi.fn().mockReturnValue(throwError(() => new Error('fail'))),
      update: vi.fn(),
      remove: vi.fn(),
      review: vi.fn(),
      approve: vi.fn(),
      reject: vi.fn(),
      defer: vi.fn(),
    };
    const memberService = { members: signal([]).asReadonly(), list: vi.fn().mockReturnValue(of([])) };
    const projectService = { selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly() };

    TestBed.configureTestingModule({
      imports: [RequirementDetailComponent, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: RequirementService, useValue: requirementService },
        { provide: MemberService, useValue: memberService },
        { provide: ProjectService, useValue: projectService },
      ],
    });

    const fixture: ComponentFixture<RequirementDetailComponent> = TestBed.createComponent(RequirementDetailComponent);
    fixture.componentRef.setInput('requirementId', '1');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.load-error')).toBeTruthy();
  });

  it('renders child requirements section when children are present', () => {
    const child: Requirement = { ...stubRequirement, id: 2, ref: 'US-001', title: 'Sign up flow', parentId: 1 };
    const { fixture } = setup({ ...stubRequirement, type: 'epic', children: [child] });
    expect(fixture.nativeElement.textContent).toContain('Sign up flow');
  });
});
