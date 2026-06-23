import {
  mapIssue,
  IssueApiResource,
  canEditIssue,
  canEscalate,
  canResolve,
} from './issue.contracts';

const stubApi: IssueApiResource = {
  id: 1, project_id: 5, stage_id: null,
  issue_type: 'problem', title: 'Login fails', description: 'Cannot log in',
  priority: 'high', status: 'open',
  raised_at: '2026-06-09T10:00:00Z', escalated_at: null, escalation_reason: null,
  resolved_at: null, resolution: null,
  raised_by: { id: 10, name: 'Alice' }, assigned_to: null,
  created_at: '2026-06-09T10:00:00Z', updated_at: '2026-06-09T10:00:00Z',
};

describe('mapIssue', () => {
  it('maps snake_case fields to camelCase', () => {
    const issue = mapIssue(stubApi);
    expect(issue.id).toBe(1);
    expect(issue.projectId).toBe(5);
    expect(issue.issueType).toBe('problem');
    expect(issue.raisedAt).toBe('2026-06-09T10:00:00Z');
    expect(issue.escalationReason).toBeNull();
    expect(issue.raisedBy?.name).toBe('Alice');
  });

  it('handles null optional fields', () => {
    const issue = mapIssue({ ...stubApi, stage_id: null, assigned_to: null, resolution: null });
    expect(issue.stageId).toBeNull();
    expect(issue.assignedTo).toBeNull();
    expect(issue.resolution).toBeNull();
  });
});

describe('workflow guards', () => {
  it('canEditIssue: open and under_review only', () => {
    expect(canEditIssue('open')).toBe(true);
    expect(canEditIssue('under_review')).toBe(true);
    expect(canEditIssue('escalated')).toBe(false);
    expect(canEditIssue('closed')).toBe(false);
  });

  it('canEscalate: open and under_review only', () => {
    expect(canEscalate('open')).toBe(true);
    expect(canEscalate('under_review')).toBe(true);
    expect(canEscalate('escalated')).toBe(false);
    expect(canEscalate('closed')).toBe(false);
  });

  it('canResolve: any status except closed', () => {
    expect(canResolve('open')).toBe(true);
    expect(canResolve('under_review')).toBe(true);
    expect(canResolve('escalated')).toBe(true);
    expect(canResolve('closed')).toBe(false);
  });
});
