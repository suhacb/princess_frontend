import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { RequirementListComponent } from './requirement-list.component';
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
  description: null,
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

const reviewedRequirement: Requirement = {
  ...stubRequirement,
  id: 2,
  ref: 'REQ-002',
  title: 'Reports must be exportable',
  status: 'reviewed',
  priority: 'should',
};

function setup(requirements: Requirement[] = []) {
  const requirementsSignal = signal(requirements);
  const requirementService = {
    requirements: requirementsSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    list: vi.fn().mockReturnValue(of(requirements)),
    create: vi.fn().mockReturnValue(of(stubRequirement)),
  };
  const memberService = {
    members: signal([]).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [RequirementListComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: RequirementService, useValue: requirementService },
      { provide: MemberService, useValue: memberService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<RequirementListComponent> = TestBed.createComponent(RequirementListComponent);
  fixture.detectChanges();
  return { fixture, requirementService, memberService };
}

describe('RequirementListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { requirementService } = setup();
    expect(requirementService.list).toHaveBeenCalledWith(5);
  });

  it('calls member list on init', () => {
    const { memberService } = setup();
    expect(memberService.list).toHaveBeenCalledWith(5);
  });

  it('shows empty state when no requirements', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders requirement title and ref', () => {
    const { fixture } = setup([stubRequirement]);
    expect(fixture.nativeElement.textContent).toContain('System must support SSO');
    expect(fixture.nativeElement.textContent).toContain('REQ-001');
  });

  it('renders priority chip', () => {
    const { fixture } = setup([stubRequirement]);
    expect(fixture.nativeElement.querySelector('app-requirement-priority-chip')).toBeTruthy();
  });

  it('renders status chip', () => {
    const { fixture } = setup([stubRequirement]);
    expect(fixture.nativeElement.querySelector('app-requirement-status-chip')).toBeTruthy();
  });

  it('renders owner name', () => {
    const { fixture } = setup([stubRequirement]);
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('renders version badge', () => {
    const { fixture } = setup([stubRequirement]);
    expect(fixture.nativeElement.textContent).toContain('v1');
  });

  it('filters by status', () => {
    const { fixture } = setup([stubRequirement, reviewedRequirement]);
    const comp = fixture.componentInstance as any;
    comp.statusFilter.set('reviewed');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.requirement-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Reports must be exportable');
  });

  it('filters by type', () => {
    const epic: Requirement = { ...stubRequirement, id: 3, ref: 'REQ-003', type: 'epic', title: 'Onboarding' };
    const { fixture } = setup([stubRequirement, epic]);
    const comp = fixture.componentInstance as any;
    comp.typeFilter.set('epic');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.requirement-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Onboarding');
  });

  it('shows the parent epic title for a child requirement', () => {
    const epic: Requirement = { ...stubRequirement, id: 3, ref: 'REQ-003', type: 'epic', title: 'Onboarding' };
    const child: Requirement = { ...stubRequirement, id: 4, ref: 'US-001', parentId: 3, title: 'Sign up' };
    const { fixture } = setup([epic, child]);
    const rows = fixture.nativeElement.querySelectorAll('.requirement-row');
    const childRow = Array.from(rows).find((r: any) => r.textContent.includes('Sign up')) as HTMLElement;
    expect(childRow.textContent).toContain('Onboarding');
  });

  it('navigates to requirement detail on row click', () => {
    const { fixture } = setup([stubRequirement]);
    const comp = fixture.componentInstance as any;
    const navigateSpy = vi.spyOn(comp['router'], 'navigate').mockImplementation(() => Promise.resolve(true));
    const row = fixture.nativeElement.querySelector('.requirement-row');
    row?.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/p', 5, 'requirements', 1]);
  });
});
