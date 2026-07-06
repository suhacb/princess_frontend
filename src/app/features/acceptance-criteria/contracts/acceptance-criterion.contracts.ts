import { PersonApiResource, Person, mapPerson } from '../../members/contracts/member.contracts';
import { RequirementType } from '../../requirements/contracts/requirement.contracts';

export type AcceptanceCriterionStatus = 'draft' | 'approved';
export type VerificationMethod = 'test' | 'demo' | 'review' | 'inspection';
export type AcceptanceCriterionDecision = 'pending' | 'accepted' | 'rejected';

export const AC_STATUS_LABELS: Record<AcceptanceCriterionStatus, string> = {
  draft: 'Draft',
  approved: 'Approved',
};

export const AC_STATUSES: AcceptanceCriterionStatus[] = ['draft', 'approved'];

export const VERIFICATION_METHOD_LABELS: Record<VerificationMethod, string> = {
  test: 'Test',
  demo: 'Demo',
  review: 'Review',
  inspection: 'Inspection',
};

export const VERIFICATION_METHODS: VerificationMethod[] = ['test', 'demo', 'review', 'inspection'];

export const AC_DECISION_LABELS: Record<AcceptanceCriterionDecision, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export interface RequirementRef {
  id: number;
  ref: string;
  title: string;
  type: RequirementType;
}

export interface AcceptanceCriterionApiResource {
  id: number;
  project_id: number;
  requirement_id: number;
  ref: string;
  title: string;
  description: string;
  measurement_method: string | null;
  acceptance_threshold: string | null;
  verifier: PersonApiResource | null;
  verification_method: VerificationMethod | null;
  status: AcceptanceCriterionStatus;
  version: number;
  approved_by: PersonApiResource | null;
  approved_at: string | null;
  supplier_passed: boolean;
  supplier_passed_at: string | null;
  supplier_decision: AcceptanceCriterionDecision;
  supplier_decided_by: PersonApiResource | null;
  supplier_decided_at: string | null;
  supplier_decision_note: string | null;
  client_passed: boolean;
  client_passed_at: string | null;
  client_decision: AcceptanceCriterionDecision;
  client_decided_by: PersonApiResource | null;
  client_decided_at: string | null;
  client_decision_note: string | null;
  accepted_at: string | null;
  requirement?: RequirementRef | null;
  created_by: PersonApiResource | null;
  updated_by: PersonApiResource | null;
  created_at: string;
  updated_at: string;
}

export interface AcceptanceCriterion {
  id: number;
  projectId: number;
  requirementId: number;
  ref: string;
  title: string;
  description: string;
  measurementMethod: string | null;
  acceptanceThreshold: string | null;
  verifier: Person | null;
  verificationMethod: VerificationMethod | null;
  status: AcceptanceCriterionStatus;
  version: number;
  approvedBy: Person | null;
  approvedAt: string | null;
  supplierPassed: boolean;
  supplierPassedAt: string | null;
  supplierDecision: AcceptanceCriterionDecision;
  supplierDecidedBy: Person | null;
  supplierDecidedAt: string | null;
  supplierDecisionNote: string | null;
  clientPassed: boolean;
  clientPassedAt: string | null;
  clientDecision: AcceptanceCriterionDecision;
  clientDecidedBy: Person | null;
  clientDecidedAt: string | null;
  clientDecisionNote: string | null;
  acceptedAt: string | null;
  requirement: RequirementRef | null;
  createdAt: string;
  updatedAt: string;
}

export function mapAcceptanceCriterion(api: AcceptanceCriterionApiResource): AcceptanceCriterion {
  return {
    id: api.id,
    projectId: api.project_id,
    requirementId: api.requirement_id,
    ref: api.ref,
    title: api.title,
    description: api.description,
    measurementMethod: api.measurement_method,
    acceptanceThreshold: api.acceptance_threshold,
    verifier: api.verifier ? mapPerson(api.verifier) : null,
    verificationMethod: api.verification_method,
    status: api.status,
    version: api.version,
    approvedBy: api.approved_by ? mapPerson(api.approved_by) : null,
    approvedAt: api.approved_at,
    supplierPassed: api.supplier_passed,
    supplierPassedAt: api.supplier_passed_at,
    supplierDecision: api.supplier_decision,
    supplierDecidedBy: api.supplier_decided_by ? mapPerson(api.supplier_decided_by) : null,
    supplierDecidedAt: api.supplier_decided_at,
    supplierDecisionNote: api.supplier_decision_note,
    clientPassed: api.client_passed,
    clientPassedAt: api.client_passed_at,
    clientDecision: api.client_decision,
    clientDecidedBy: api.client_decided_by ? mapPerson(api.client_decided_by) : null,
    clientDecidedAt: api.client_decided_at,
    clientDecisionNote: api.client_decision_note,
    acceptedAt: api.accepted_at,
    requirement: api.requirement ?? null,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

export interface CreateAcceptanceCriterionPayload {
  requirement_id: number;
  title: string;
  description: string;
  measurement_method?: string | null;
  acceptance_threshold?: string | null;
  verifier_id?: number | null;
  verification_method?: VerificationMethod | null;
}

export interface UpdateAcceptanceCriterionPayload {
  title?: string;
  description?: string;
  measurement_method?: string | null;
  acceptance_threshold?: string | null;
  verifier_id?: number | null;
  verification_method?: VerificationMethod | null;
}

export interface RecordDecisionPayload {
  decision: 'accepted' | 'rejected';
  note?: string | null;
}

export interface AcceptanceCriterionVersionApiResource {
  id: number;
  acceptance_criterion_id: number;
  version_number: number;
  title: string;
  description: string;
  verifier: PersonApiResource | null;
  verification_method: VerificationMethod | null;
  status: AcceptanceCriterionStatus;
  supplier_passed: boolean;
  client_passed: boolean;
  supplier_decision: AcceptanceCriterionDecision;
  supplier_decision_note: string | null;
  client_decision: AcceptanceCriterionDecision;
  client_decision_note: string | null;
  created_by: PersonApiResource | null;
  created_at: string;
}

export interface AcceptanceCriterionVersion {
  id: number;
  acceptanceCriterionId: number;
  versionNumber: number;
  title: string;
  description: string;
  verifier: Person | null;
  verificationMethod: VerificationMethod | null;
  status: AcceptanceCriterionStatus;
  supplierPassed: boolean;
  clientPassed: boolean;
  supplierDecision: AcceptanceCriterionDecision;
  supplierDecisionNote: string | null;
  clientDecision: AcceptanceCriterionDecision;
  clientDecisionNote: string | null;
  createdBy: Person | null;
  createdAt: string;
}

export function mapAcceptanceCriterionVersion(
  api: AcceptanceCriterionVersionApiResource,
): AcceptanceCriterionVersion {
  return {
    id: api.id,
    acceptanceCriterionId: api.acceptance_criterion_id,
    versionNumber: api.version_number,
    title: api.title,
    description: api.description,
    verifier: api.verifier ? mapPerson(api.verifier) : null,
    verificationMethod: api.verification_method,
    status: api.status,
    supplierPassed: api.supplier_passed,
    clientPassed: api.client_passed,
    supplierDecision: api.supplier_decision,
    supplierDecisionNote: api.supplier_decision_note,
    clientDecision: api.client_decision,
    clientDecisionNote: api.client_decision_note,
    createdBy: api.created_by ? mapPerson(api.created_by) : null,
    createdAt: api.created_at,
  };
}
