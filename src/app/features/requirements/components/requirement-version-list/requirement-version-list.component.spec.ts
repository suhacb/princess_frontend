import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RequirementVersionListComponent } from './requirement-version-list.component';
import { RequirementService } from '../../services/requirement.service';
import { RequirementVersion } from '../../contracts/requirement.contracts';

const stubVersion1: RequirementVersion = {
  id: 1,
  requirementId: 1,
  versionNumber: 1,
  title: 'System must support SSO',
  description: null,
  type: 'classic',
  priority: 'must',
  status: 'draft',
  role: null,
  action: null,
  benefit: null,
  owner: null,
  createdBy: { id: 5, name: 'Alice', email: null, jobTitle: null, organization: null },
  createdAt: '2026-06-01T10:00:00Z',
};

const stubVersion2: RequirementVersion = {
  ...stubVersion1,
  id: 2,
  versionNumber: 2,
  status: 'reviewed',
};

function paginatedResult(
  versions: RequirementVersion[],
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
  const requirementService = {
    listVersions: vi.fn().mockReturnValue(of(listVersionsResult)),
  };

  TestBed.configureTestingModule({
    imports: [RequirementVersionListComponent],
    providers: [{ provide: RequirementService, useValue: requirementService }],
  });

  const fixture: ComponentFixture<RequirementVersionListComponent> = TestBed.createComponent(RequirementVersionListComponent);
  fixture.componentRef.setInput('projectId', 5);
  fixture.componentRef.setInput('requirementId', 1);
  fixture.detectChanges();
  return { fixture, requirementService };
}

describe('RequirementVersionListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('loads versions on init', () => {
    const { requirementService } = setup();
    expect(requirementService.listVersions).toHaveBeenCalledWith(5, 1, 1);
  });

  it('renders each version row', () => {
    const { fixture } = setup();
    const rows = fixture.nativeElement.querySelectorAll('.version-row');
    expect(rows.length).toBe(2);
  });

  it('shows the version title and status/priority meta', () => {
    const { fixture } = setup(paginatedResult([stubVersion1]));
    expect(fixture.nativeElement.textContent).toContain('System must support SSO');
    expect(fixture.nativeElement.textContent).toContain('Draft');
    expect(fixture.nativeElement.textContent).toContain('Must');
  });

  it('shows the author name', () => {
    const { fixture } = setup(paginatedResult([stubVersion1]));
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('shows empty state when there is no version history', () => {
    const { fixture } = setup(paginatedResult([]));
    expect(fixture.nativeElement.textContent).toContain('No version history yet.');
  });

  it('shows pagination controls when there is more than one page', () => {
    const { fixture } = setup(paginatedResult([stubVersion1], { lastPage: 2 }));
    expect(fixture.nativeElement.querySelector('.vl-pagination')).toBeTruthy();
  });

  it('hides pagination controls when there is a single page', () => {
    const { fixture } = setup(paginatedResult([stubVersion1], { lastPage: 1 }));
    expect(fixture.nativeElement.querySelector('.vl-pagination')).toBeFalsy();
  });

  it('loads the next page on click', () => {
    const { fixture, requirementService } = setup(paginatedResult([stubVersion1], { lastPage: 2 }));
    const nextBtn: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.vl-pagination button')[1];
    nextBtn.click();
    expect(requirementService.listVersions).toHaveBeenCalledWith(5, 1, 2);
  });

  it('shows an error message when loading fails', () => {
    const requirementService = { listVersions: vi.fn().mockReturnValue(throwError(() => new Error('fail'))) };
    TestBed.configureTestingModule({
      imports: [RequirementVersionListComponent],
      providers: [{ provide: RequirementService, useValue: requirementService }],
    });
    const fixture: ComponentFixture<RequirementVersionListComponent> = TestBed.createComponent(RequirementVersionListComponent);
    fixture.componentRef.setInput('projectId', 5);
    fixture.componentRef.setInput('requirementId', 1);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Failed to load version history.');
  });
});
