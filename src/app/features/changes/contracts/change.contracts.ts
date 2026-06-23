export type ChangeStatus = 'proposed' | 'assessed' | 'approved' | 'rejected' | 'implemented';
export type ChangeRequestType = 'rfc' | 'off_spec';

export const CHANGE_STATUS_LABELS: Record<ChangeStatus, string> = {
  proposed: 'Proposed',
  assessed: 'Assessed',
  approved: 'Approved',
  rejected: 'Rejected',
  implemented: 'Implemented',
};

export const CHANGE_REQUEST_TYPE_LABELS: Record<ChangeRequestType, string> = {
  rfc: 'RFC',
  off_spec: 'Off-Spec',
};

export const CHANGE_STATUSES: ChangeStatus[] = [
  'proposed',
  'assessed',
  'approved',
  'rejected',
  'implemented',
];
export const CHANGE_REQUEST_TYPES: ChangeRequestType[] = ['rfc', 'off_spec'];

export interface ChangePerson {
  id: number;
  name: string;
}

export interface ChangeApiResource {
  id: number;
  project_id: number;
  issue_id: number | null;
  request_type: ChangeRequestType;
  title: string;
  description: string | null;
  impact_assessment: string | null;
  priority: string | null;
  status: ChangeStatus;
  raised_at: string | null;
  decision_at: string | null;
  decision_rationale: string | null;
  implementation_due: string | null;
  implemented_at: string | null;
  raised_by: ChangePerson | null;
  decision_by: ChangePerson | null;
  created_at: string;
  updated_at: string;
}

export interface Change {
  id: number;
  projectId: number;
  issueId: number | null;
  requestType: ChangeRequestType;
  title: string;
  description: string | null;
  impactAssessment: string | null;
  priority: string | null;
  status: ChangeStatus;
  raisedAt: string | null;
  decisionAt: string | null;
  decisionRationale: string | null;
  implementationDue: string | null;
  implementedAt: string | null;
  raisedBy: ChangePerson | null;
  decisionBy: ChangePerson | null;
  createdAt: string;
}

export function mapChange(api: ChangeApiResource): Change {
  return {
    id: api.id,
    projectId: api.project_id,
    issueId: api.issue_id,
    requestType: api.request_type,
    title: api.title,
    description: api.description,
    impactAssessment: api.impact_assessment,
    priority: api.priority,
    status: api.status,
    raisedAt: api.raised_at,
    decisionAt: api.decision_at,
    decisionRationale: api.decision_rationale,
    implementationDue: api.implementation_due,
    implementedAt: api.implemented_at,
    raisedBy: api.raised_by,
    decisionBy: api.decision_by,
    createdAt: api.created_at,
  };
}

export function canDecide(status: ChangeStatus): boolean {
  return status === 'proposed' || status === 'assessed';
}

export interface CreateChangePayload {
  request_type: ChangeRequestType;
  title: string;
  description?: string | null;
  impact_assessment?: string | null;
  priority?: string | null;
  implementation_due?: string | null;
}

export interface UpdateChangePayload {
  request_type?: ChangeRequestType;
  title?: string;
  description?: string | null;
  impact_assessment?: string | null;
  priority?: string | null;
  status?: ChangeStatus;
  implementation_due?: string | null;
  implemented_at?: string | null;
}

export interface DecideChangePayload {
  decision_rationale?: string | null;
}
