export type BoundaryType = 'end_stage_report' | 'exception_report';
export type BoundaryStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export const BOUNDARY_TYPE_LABELS: Record<BoundaryType, string> = {
  end_stage_report: 'End Stage Report',
  exception_report: 'Exception Report',
};

export const BOUNDARY_STATUS_LABELS: Record<BoundaryStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const BOUNDARY_TYPES: BoundaryType[] = ['end_stage_report', 'exception_report'];

export interface BoundaryPersonSummary {
  id: number;
  name: string;
}

export interface StageBoundaryApiResource {
  id: number;
  stage_id: number;
  type: BoundaryType;
  status: BoundaryStatus;
  title: string | null;
  notes: string | null;
  next_stage_id: number | null;
  exception_summary: string | null;
  submitted_at: string | null;
  submitted_by: BoundaryPersonSummary | null;
  approved_at: string | null;
  approved_by: BoundaryPersonSummary | null;
  created_by: BoundaryPersonSummary | null;
  created_at: string;
  updated_at: string;
}

export interface StageBoundary {
  id: number;
  stageId: number;
  type: BoundaryType;
  status: BoundaryStatus;
  title: string | null;
  notes: string | null;
  nextStageId: number | null;
  exceptionSummary: string | null;
  submittedAt: string | null;
  submittedBy: BoundaryPersonSummary | null;
  approvedAt: string | null;
  approvedBy: BoundaryPersonSummary | null;
  createdBy: BoundaryPersonSummary | null;
  createdAt: string;
}

export function mapBoundary(api: StageBoundaryApiResource): StageBoundary {
  return {
    id: api.id,
    stageId: api.stage_id,
    type: api.type,
    status: api.status,
    title: api.title,
    notes: api.notes,
    nextStageId: api.next_stage_id,
    exceptionSummary: api.exception_summary,
    submittedAt: api.submitted_at,
    submittedBy: api.submitted_by,
    approvedAt: api.approved_at,
    approvedBy: api.approved_by,
    createdBy: api.created_by,
    createdAt: api.created_at,
  };
}

export interface CreateBoundaryPayload {
  type: BoundaryType;
  title?: string | null;
}

export interface UpdateBoundaryPayload {
  title?: string | null;
  notes?: string | null;
  next_stage_id?: number | null;
  exception_summary?: string | null;
}

export interface RejectBoundaryPayload {
  rejection_reason?: string | null;
}

export function canEdit(status: BoundaryStatus): boolean {
  return status === 'draft';
}

export function canSubmit(status: BoundaryStatus): boolean {
  return status === 'draft';
}

export function canApproveReject(status: BoundaryStatus): boolean {
  return status === 'submitted';
}
