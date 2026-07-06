import { PersonApiResource, Person, mapPerson } from '../../members/contracts/member.contracts';

export type RequirementType = 'epic' | 'classic' | 'user_story';
export type RequirementPriority = 'must' | 'should' | 'could' | 'wont';
export type RequirementStatus = 'draft' | 'reviewed' | 'approved' | 'rejected' | 'deferred';

export const REQUIREMENT_TYPE_LABELS: Record<RequirementType, string> = {
  epic: 'Epic',
  classic: 'Requirement',
  user_story: 'User Story',
};

export const REQUIREMENT_PRIORITY_LABELS: Record<RequirementPriority, string> = {
  must: 'Must',
  should: 'Should',
  could: 'Could',
  wont: "Won't",
};

export const REQUIREMENT_STATUS_LABELS: Record<RequirementStatus, string> = {
  draft: 'Draft',
  reviewed: 'Reviewed',
  approved: 'Approved',
  rejected: 'Rejected',
  deferred: 'Deferred',
};

export const REQUIREMENT_TYPES: RequirementType[] = ['epic', 'classic', 'user_story'];
export const REQUIREMENT_PRIORITIES: RequirementPriority[] = ['must', 'should', 'could', 'wont'];
export const REQUIREMENT_STATUSES: RequirementStatus[] = [
  'draft',
  'reviewed',
  'approved',
  'rejected',
  'deferred',
];

export interface RequirementApiResource {
  id: number;
  project_id: number;
  type: RequirementType;
  parent_id: number | null;
  ref: string;
  title: string;
  description: string | null;
  role: string | null;
  action: string | null;
  benefit: string | null;
  priority: RequirementPriority;
  status: RequirementStatus;
  source: string | null;
  owner: PersonApiResource | null;
  version: number;
  approved_by: PersonApiResource | null;
  approved_at: string | null;
  children?: RequirementApiResource[];
  created_by: PersonApiResource | null;
  updated_by: PersonApiResource | null;
  created_at: string;
  updated_at: string;
}

export interface Requirement {
  id: number;
  projectId: number;
  type: RequirementType;
  parentId: number | null;
  ref: string;
  title: string;
  description: string | null;
  role: string | null;
  action: string | null;
  benefit: string | null;
  priority: RequirementPriority;
  status: RequirementStatus;
  source: string | null;
  owner: Person | null;
  version: number;
  approvedBy: Person | null;
  approvedAt: string | null;
  children: Requirement[];
  createdBy: Person | null;
  updatedBy: Person | null;
  createdAt: string;
  updatedAt: string;
}

export function mapRequirement(api: RequirementApiResource): Requirement {
  return {
    id: api.id,
    projectId: api.project_id,
    type: api.type,
    parentId: api.parent_id,
    ref: api.ref,
    title: api.title,
    description: api.description,
    role: api.role,
    action: api.action,
    benefit: api.benefit,
    priority: api.priority,
    status: api.status,
    source: api.source,
    owner: api.owner ? mapPerson(api.owner) : null,
    version: api.version,
    approvedBy: api.approved_by ? mapPerson(api.approved_by) : null,
    approvedAt: api.approved_at,
    children: (api.children ?? []).map(mapRequirement),
    createdBy: api.created_by ? mapPerson(api.created_by) : null,
    updatedBy: api.updated_by ? mapPerson(api.updated_by) : null,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

export interface CreateRequirementPayload {
  type: RequirementType;
  parent_id?: number | null;
  title: string;
  description?: string | null;
  role?: string | null;
  action?: string | null;
  benefit?: string | null;
  priority: RequirementPriority;
  source?: string | null;
  owner_id?: number | null;
}

export interface UpdateRequirementPayload {
  title?: string;
  description?: string | null;
  role?: string | null;
  action?: string | null;
  benefit?: string | null;
  priority?: RequirementPriority;
  source?: string | null;
  owner_id?: number | null;
  parent_id?: number | null;
}

export interface RequirementVersionApiResource {
  id: number;
  requirement_id: number;
  version_number: number;
  title: string;
  description: string | null;
  type: RequirementType;
  priority: RequirementPriority;
  status: RequirementStatus;
  role: string | null;
  action: string | null;
  benefit: string | null;
  owner: PersonApiResource | null;
  created_by: PersonApiResource | null;
  created_at: string;
}

export interface RequirementVersion {
  id: number;
  requirementId: number;
  versionNumber: number;
  title: string;
  description: string | null;
  type: RequirementType;
  priority: RequirementPriority;
  status: RequirementStatus;
  role: string | null;
  action: string | null;
  benefit: string | null;
  owner: Person | null;
  createdBy: Person | null;
  createdAt: string;
}

export function mapRequirementVersion(api: RequirementVersionApiResource): RequirementVersion {
  return {
    id: api.id,
    requirementId: api.requirement_id,
    versionNumber: api.version_number,
    title: api.title,
    description: api.description,
    type: api.type,
    priority: api.priority,
    status: api.status,
    role: api.role,
    action: api.action,
    benefit: api.benefit,
    owner: api.owner ? mapPerson(api.owner) : null,
    createdBy: api.created_by ? mapPerson(api.created_by) : null,
    createdAt: api.created_at,
  };
}
