import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { IssueListComponent } from './issue-list.component';
import { IssueService } from '../../services/issue.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Issue } from '../../contracts/issue.contracts';

const stubIssue: Issue = {
  id: 1, projectId: 5, stageId: null,
  issueType: 'problem', title: 'Login fails', description: null,
  priority: 'high', status: 'open',
  raisedAt: '2026-06-09T10:00:00Z', escalatedAt: null, escalationReason: null,
  resolvedAt: null, resolution: null,
  raisedBy: { id: 10, name: 'Alice' }, assignedTo: null,
  createdAt: '2026-06-09T10:00:00Z',
};

const lowIssue: Issue = { ...stubIssue, id: 2, priority: 'low', title: 'Minor thing' };

function setup(issues: Issue[] = []) {
  const issuesSignal = signal(issues);
  const issueService = {
    issues: issuesSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    list: vi.fn().mockReturnValue(of(issues)),
    create: vi.fn().mockReturnValue(of(stubIssue)),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [IssueListComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: IssueService, useValue: issueService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<IssueListComponent> = TestBed.createComponent(IssueListComponent);
  fixture.detectChanges();
  return { fixture, issueService };
}

describe('IssueListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { issueService } = setup();
    expect(issueService.list).toHaveBeenCalledWith(5);
  });

  it('shows empty state when no issues', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders issue title', () => {
    const { fixture } = setup([stubIssue]);
    expect(fixture.nativeElement.textContent).toContain('Login fails');
  });

  it('renders type badge', () => {
    const { fixture } = setup([stubIssue]);
    expect(fixture.nativeElement.querySelector('app-badge')).toBeTruthy();
  });

  it('renders status chip', () => {
    const { fixture } = setup([stubIssue]);
    expect(fixture.nativeElement.querySelector('app-issue-status-chip')).toBeTruthy();
  });

  it('renders priority chip', () => {
    const { fixture } = setup([stubIssue]);
    expect(fixture.nativeElement.querySelector('app-issue-priority-chip')).toBeTruthy();
  });

  it('sorts by priority by default (critical before low)', () => {
    const { fixture } = setup([lowIssue, stubIssue]);
    const rows = fixture.nativeElement.querySelectorAll('.issue-row');
    expect(rows[0].textContent).toContain('Login fails');
    expect(rows[1].textContent).toContain('Minor thing');
  });

  it('switches sort to newest', () => {
    const { fixture } = setup([stubIssue, lowIssue]);
    const comp = fixture.componentInstance as any;
    comp.sortKey.set('raised_at');
    fixture.detectChanges();
    expect(comp.sortKey()).toBe('raised_at');
  });

  it('renders raised by name', () => {
    const { fixture } = setup([stubIssue]);
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('navigates to issue detail on row click', () => {
    const { fixture } = setup([stubIssue]);
    const comp = fixture.componentInstance as any;
    const navigateSpy = vi.spyOn(comp.router ?? comp['router'], 'navigate').mockImplementation(() => Promise.resolve(true));
    const row = fixture.nativeElement.querySelector('.issue-row');
    row?.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/p', 5, 'issues', 1]);
  });
});
