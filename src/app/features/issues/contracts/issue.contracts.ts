export type IssueType = 'problem' | 'concern' | 'rfc' | 'off_spec';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueStatus = 'open' | 'under_review' | 'escalated' | 'closed';

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  problem: 'Problem',
  concern: 'Concern',
  rfc: 'RFC',
  off_spec: 'Off-Spec',
};

export const ISSUE_PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
  open: 'Open',
  under_review: 'Under Review',
  escalated: 'Escalated',
  closed: 'Closed',
};

export const ISSUE_TYPES: IssueType[] = ['problem', 'concern', 'rfc', 'off_spec'];
export const ISSUE_PRIORITIES: IssuePriority[] = ['low', 'medium', 'high', 'critical'];

export const PRIORITY_ORDER: Record<IssuePriority, number> = {
  critical: 0, high: 1, medium: 2, low: 3,
};

export interface IssuePersonSummary {
  id: number;
  name: string;
}

export interface IssueApiResource {
  id: number;
  project_id: number;
  stage_id: number | null;
  issue_type: IssueType;
  title: string;
  description: string | null;
  priority: IssuePriority;
  status: IssueStatus;
  raised_at: string | null;
  escalated_at: string | null;
  escalation_reason: string | null;
  resolved_at: string | null;
  resolution: string | null;
  raised_by: { id: number; name: string } | null;
  assigned_to: { id: number; name: string } | null;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: number;
  projectId: number;
  stageId: number | null;
  issueType: IssueType;
  title: string;
  description: string | null;
  priority: IssuePriority;
  status: IssueStatus;
  raisedAt: string | null;
  escalatedAt: string | null;
  escalationReason: string | null;
  resolvedAt: string | null;
  resolution: string | null;
  raisedBy: IssuePersonSummary | null;
  assignedTo: IssuePersonSummary | null;
  createdAt: string;
}

export function mapIssue(api: IssueApiResource): Issue {
  return {
    id: api.id,
    projectId: api.project_id,
    stageId: api.stage_id,
    issueType: api.issue_type,
    title: api.title,
    description: api.description,
    priority: api.priority,
    status: api.status,
    raisedAt: api.raised_at,
    escalatedAt: api.escalated_at,
    escalationReason: api.escalation_reason,
    resolvedAt: api.resolved_at,
    resolution: api.resolution,
    raisedBy: api.raised_by,
    assignedTo: api.assigned_to,
    createdAt: api.created_at,
  };
}

export interface CreateIssuePayload {
  issue_type: IssueType;
  title: string;
  description?: string | null;
  priority: IssuePriority;
  stage_id?: number | null;
}

export interface UpdateIssuePayload {
  issue_type?: IssueType;
  title?: string;
  description?: string | null;
  priority?: IssuePriority;
}

export interface EscalateIssuePayload {
  escalation_reason: string;
}

export interface ResolveIssuePayload {
  resolution: string;
}

export function canEditIssue(status: IssueStatus): boolean {
  return status === 'open' || status === 'under_review';
}

export function canEscalate(status: IssueStatus): boolean {
  return status === 'open' || status === 'under_review';
}

export function canResolve(status: IssueStatus): boolean {
  return status !== 'closed';
}
