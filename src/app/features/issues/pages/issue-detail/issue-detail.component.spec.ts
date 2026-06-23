import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { IssueDetailComponent } from './issue-detail.component';
import { IssueService } from '../../services/issue.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Issue } from '../../contracts/issue.contracts';

const stubIssue: Issue = {
  id: 1, projectId: 5, stageId: null,
  issueType: 'problem', title: 'Login fails', description: 'Details here',
  priority: 'high', status: 'open',
  raisedAt: '2026-06-09T10:00:00Z', escalatedAt: null, escalationReason: null,
  resolvedAt: null, resolution: null,
  raisedBy: { id: 10, name: 'Alice' }, assignedTo: null,
  createdAt: '2026-06-09T10:00:00Z',
};

const escalatedIssue: Issue = {
  ...stubIssue, status: 'escalated',
  escalationReason: 'Critical path', escalatedAt: '2026-06-10T10:00:00Z',
};

const closedIssue: Issue = {
  ...stubIssue, status: 'closed',
  resolution: 'Fixed by config change', resolvedAt: '2026-06-11T10:00:00Z',
};

function setup(issue: Issue | null = stubIssue) {
  const selectedIssue = signal(issue);
  const issueService = {
    selectedIssue: selectedIssue.asReadonly(),
    loading: signal(false).asReadonly(),
    load: vi.fn().mockReturnValue(of(issue)),
    update: vi.fn().mockReturnValue(of(issue)),
    escalate: vi.fn().mockReturnValue(of(escalatedIssue)),
    resolve: vi.fn().mockReturnValue(of(closedIssue)),
    remove: vi.fn().mockReturnValue(of(undefined)),
  };
  const projectService = {
    selectedProject: signal({ id: 5, name: 'Test' } as never).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [IssueDetailComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: IssueService, useValue: issueService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<IssueDetailComponent> = TestBed.createComponent(IssueDetailComponent);
  fixture.componentRef.setInput('issueId', '1');
  fixture.detectChanges();
  return { fixture, issueService };
}

describe('IssueDetailComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls load on init', () => {
    const { issueService } = setup();
    expect(issueService.load).toHaveBeenCalledWith(5, 1);
  });

  it('renders issue title in form', () => {
    const { fixture } = setup();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input?.value).toBe('Login fails');
  });

  it('renders type badge', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('.type-badge--problem')).toBeTruthy();
  });

  it('shows status and priority chips', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('app-issue-status-chip')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-issue-priority-chip')).toBeTruthy();
  });

  it('shows raised by meta', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('shows Escalate and Mark Resolved buttons for open issue', () => {
    const { fixture } = setup();
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.find(b => b.textContent?.includes('Escalate'))).toBeTruthy();
    expect(buttons.find(b => b.textContent?.includes('Mark Resolved'))).toBeTruthy();
  });

  it('shows escalation reason block for escalated issue', () => {
    const { fixture } = setup(escalatedIssue);
    expect(fixture.nativeElement.textContent).toContain('Critical path');
    expect(fixture.nativeElement.querySelector('.info-block--warn')).toBeTruthy();
  });

  it('shows resolution block for closed issue', () => {
    const { fixture } = setup(closedIssue);
    expect(fixture.nativeElement.textContent).toContain('Fixed by config change');
    expect(fixture.nativeElement.querySelector('.info-block--success')).toBeTruthy();
  });

  it('does not show Escalate or Mark Resolved for closed issue', () => {
    const { fixture } = setup(closedIssue);
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.find(b => b.textContent?.includes('Escalate'))).toBeFalsy();
    expect(buttons.find(b => b.textContent?.includes('Mark Resolved'))).toBeFalsy();
  });

  it('calls update on Save Changes', () => {
    const { fixture, issueService } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ title: 'Updated title' });
    comp.form.markAsDirty();
    fixture.detectChanges();
    const saveBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Save Changes'));
    saveBtn?.click();
    expect(issueService.update).toHaveBeenCalledWith(5, 1, expect.objectContaining({ title: 'Updated title' }));
  });

  it('shows back button', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('button[aria-label="Back to issues"]')).toBeTruthy();
  });
});
