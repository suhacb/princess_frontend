import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AcceptanceCriterionVersionListComponent } from './acceptance-criterion-version-list.component';
import { AcceptanceCriterionService } from '../../services/acceptance-criterion.service';
import { AcceptanceCriterionVersion } from '../../contracts/acceptance-criterion.contracts';

const stubVersion1: AcceptanceCriterionVersion = {
  id: 1,
  acceptanceCriterionId: 1,
  versionNumber: 1,
  title: 'Login succeeds with valid SSO token',
  description: 'desc',
  verifier: null,
  verificationMethod: 'test',
  status: 'draft',
  supplierPassed: false,
  clientPassed: false,
  supplierDecision: 'pending',
  supplierDecisionNote: null,
  clientDecision: 'pending',
  clientDecisionNote: null,
  createdBy: { id: 5, name: 'Alice', email: null, jobTitle: null, organization: null },
  createdAt: '2026-06-01T10:00:00Z',
};

const stubVersion2: AcceptanceCriterionVersion = {
  ...stubVersion1,
  id: 2,
  versionNumber: 2,
  status: 'approved',
  supplierDecision: 'accepted',
  clientDecision: 'rejected',
  clientDecisionNote: 'Client flagged a UX issue',
};

function paginatedResult(
  versions: AcceptanceCriterionVersion[],
  overrides: Partial<{ currentPage: number; lastPage: number; total: number }> = {},
) {
  return {
    versions,
    currentPage: overrides.currentPage ?? 1,
    lastPage: overrides.lastPage ?? 1,
    total: overrides.total ?? versions.length,
  };
}

function setup(listVersionsResult: ReturnType<typeof paginatedResult> = paginatedResult([stubVersion2, stubVersion1])) {
  const acService = {
    listVersions: vi.fn().mockReturnValue(of(listVersionsResult)),
  };

  TestBed.configureTestingModule({
    imports: [AcceptanceCriterionVersionListComponent],
    providers: [{ provide: AcceptanceCriterionService, useValue: acService }],
  });

  const fixture: ComponentFixture<AcceptanceCriterionVersionListComponent> = TestBed.createComponent(
    AcceptanceCriterionVersionListComponent,
  );
  fixture.componentRef.setInput('projectId', 5);
  fixture.componentRef.setInput('criterionId', 1);
  fixture.detectChanges();
  return { fixture, acService };
}

describe('AcceptanceCriterionVersionListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('loads versions on init', () => {
    const { acService } = setup();
    expect(acService.listVersions).toHaveBeenCalledWith(5, 1, 1);
  });

  it('renders each version row', () => {
    const { fixture } = setup();
    const rows = fixture.nativeElement.querySelectorAll('.version-row');
    expect(rows.length).toBe(2);
  });

  it('shows the decision note when present', () => {
    const { fixture } = setup(paginatedResult([stubVersion2]));
    expect(fixture.nativeElement.textContent).toContain('Client flagged a UX issue');
  });

  it('shows the pass/fail signal alongside the decision', () => {
    const { fixture } = setup(paginatedResult([stubVersion2]));
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Accepted');
    expect(text).toContain('Rejected');
  });

  it('shows empty state when there is no version history', () => {
    const { fixture } = setup(paginatedResult([]));
    expect(fixture.nativeElement.textContent).toContain('No version history yet.');
  });

  it('shows an error message when loading fails', () => {
    const acService = { listVersions: vi.fn().mockReturnValue(throwError(() => new Error('fail'))) };
    TestBed.configureTestingModule({
      imports: [AcceptanceCriterionVersionListComponent],
      providers: [{ provide: AcceptanceCriterionService, useValue: acService }],
    });
    const fixture: ComponentFixture<AcceptanceCriterionVersionListComponent> = TestBed.createComponent(
      AcceptanceCriterionVersionListComponent,
    );
    fixture.componentRef.setInput('projectId', 5);
    fixture.componentRef.setInput('criterionId', 1);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Failed to load version history.');
  });
});
