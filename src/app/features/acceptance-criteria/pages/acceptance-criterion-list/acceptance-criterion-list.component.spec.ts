import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AcceptanceCriterionListComponent } from './acceptance-criterion-list.component';
import { AcceptanceCriterionService } from '../../services/acceptance-criterion.service';
import { RequirementService } from '../../../requirements/services/requirement.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { AcceptanceCriterion } from '../../contracts/acceptance-criterion.contracts';
import { Requirement } from '../../../requirements/contracts/requirement.contracts';

const stubRequirement: Requirement = {
  id: 3,
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
  status: 'approved',
  source: null,
  owner: null,
  version: 1,
  approvedBy: null,
  approvedAt: null,
  children: [],
  createdBy: null,
  updatedBy: null,
  createdAt: '2026-06-01T09:00:00Z',
  updatedAt: '2026-06-01T09:00:00Z',
};

const stubCriterion: AcceptanceCriterion = {
  id: 1,
  projectId: 5,
  requirementId: 3,
  ref: 'AC-001',
  title: 'Login succeeds with valid SSO token',
  description: 'desc',
  measurementMethod: null,
  acceptanceThreshold: null,
  verifier: null,
  verificationMethod: 'test',
  status: 'draft',
  version: 1,
  approvedBy: null,
  approvedAt: null,
  supplierPassed: false,
  supplierPassedAt: null,
  supplierDecision: 'pending',
  supplierDecidedBy: null,
  supplierDecidedAt: null,
  supplierDecisionNote: null,
  clientPassed: false,
  clientPassedAt: null,
  clientDecision: 'pending',
  clientDecidedBy: null,
  clientDecidedAt: null,
  clientDecisionNote: null,
  acceptedAt: null,
  requirement: { id: 3, ref: 'REQ-001', title: 'System must support SSO', type: 'classic' },
  createdAt: '2026-06-01T09:00:00Z',
  updatedAt: '2026-06-01T09:00:00Z',
};

function setup(criteria: AcceptanceCriterion[] = []) {
  const criteriaSignal = signal(criteria);
  const acService = {
    criteria: criteriaSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    selectedCriterion: signal<AcceptanceCriterion | null>(null).asReadonly(),
    list: vi.fn().mockReturnValue(of(criteria)),
    create: vi.fn().mockReturnValue(of(stubCriterion)),
    load: vi.fn().mockReturnValue(of(stubCriterion)),
    update: vi.fn().mockReturnValue(of(stubCriterion)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    approve: vi.fn().mockReturnValue(of(stubCriterion)),
    supplierDecision: vi.fn().mockReturnValue(of(stubCriterion)),
    clientDecision: vi.fn().mockReturnValue(of(stubCriterion)),
    listVersions: vi.fn().mockReturnValue(of({ versions: [], currentPage: 1, lastPage: 1, total: 0 })),
  };
  const requirementService = {
    requirements: signal([stubRequirement]).asReadonly(),
    list: vi.fn().mockReturnValue(of([stubRequirement])),
  };
  const memberService = {
    members: signal([]).asReadonly(),
    list: vi.fn().mockReturnValue(of([])),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [AcceptanceCriterionListComponent, BrowserAnimationsModule],
    providers: [
      { provide: AcceptanceCriterionService, useValue: acService },
      { provide: RequirementService, useValue: requirementService },
      { provide: MemberService, useValue: memberService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<AcceptanceCriterionListComponent> = TestBed.createComponent(
    AcceptanceCriterionListComponent,
  );
  fixture.detectChanges();
  return { fixture, acService, requirementService };
}

describe('AcceptanceCriterionListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { acService } = setup();
    expect(acService.list).toHaveBeenCalledWith(5);
  });

  it('loads requirements for the filter and create dialog', () => {
    const { requirementService } = setup();
    expect(requirementService.list).toHaveBeenCalledWith(5);
  });

  it('shows empty state when there are no criteria', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders the criterion title, ref, and linked requirement ref', () => {
    const { fixture } = setup([stubCriterion]);
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Login succeeds with valid SSO token');
    expect(text).toContain('AC-001');
    expect(text).toContain('REQ-001');
  });

  it('filters by status', () => {
    const approved: AcceptanceCriterion = { ...stubCriterion, id: 2, ref: 'AC-002', title: 'Approved AC', status: 'approved' };
    const { fixture } = setup([stubCriterion, approved]);
    const comp = fixture.componentInstance as any;
    comp.statusFilter.set('approved');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.ac-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Approved AC');
  });

  it('filters by requirement', () => {
    const otherReq: AcceptanceCriterion = { ...stubCriterion, id: 2, ref: 'AC-002', title: 'Other req AC', requirementId: 99 };
    const { fixture } = setup([stubCriterion, otherReq]);
    const comp = fixture.componentInstance as any;
    comp.requirementFilter.set(3);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.ac-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Login succeeds with valid SSO token');
  });

  it('opens the detail panel on row click', () => {
    const { fixture } = setup([stubCriterion]);
    const row = fixture.nativeElement.querySelector('.ac-row');
    row?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-acceptance-criterion-detail-panel')).toBeTruthy();
  });

  it('closes the detail panel when close is emitted', () => {
    const { fixture } = setup([stubCriterion]);
    const comp = fixture.componentInstance as any;
    comp.openCriterion(1);
    fixture.detectChanges();
    comp.closePanel();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-acceptance-criterion-detail-panel')).toBeFalsy();
  });
});
