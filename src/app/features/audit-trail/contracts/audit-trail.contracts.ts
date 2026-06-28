export type AuditEntityType =
  | 'task'
  | 'meeting'
  | 'meeting_action_item'
  | 'issue'
  | 'risk'
  | 'change'
  | 'requirement'
  | 'quality_register_entry'
  | 'stage'
  | 'work_package'
  | 'project'
  | 'project_member';

export type AuditEvent = 'created' | 'updated' | 'deleted';

export const AUDIT_ENTITY_TYPES: AuditEntityType[] = [
  'task', 'meeting', 'meeting_action_item', 'issue', 'risk', 'change',
  'requirement', 'quality_register_entry', 'stage', 'work_package',
  'project', 'project_member',
];

export const AUDIT_ENTITY_LABELS: Record<AuditEntityType, string> = {
  task:                   'Task',
  meeting:                'Meeting',
  meeting_action_item:    'Action item',
  issue:                  'Issue',
  risk:                   'Risk',
  change:                 'Change',
  requirement:            'Requirement',
  quality_register_entry: 'Quality register',
  stage:                  'Stage',
  work_package:           'Work package',
  project:                'Project',
  project_member:         'Member',
};

// ─── API shape ────────────────────────────────────────────────────────────────

export interface AuditEntryApiResource {
  id:           number;
  entity_type:  string;
  entity_id:    number;
  entity_title: string;
  event:        string;
  causer:       { id: number; name: string } | null;
  occurred_at:  string;
  changes:      Record<string, { old: unknown; new: unknown }>;
}

export interface AuditTrailMeta {
  current_page: number;
  last_page:    number;
  per_page:     number;
  total:        number;
}

export interface AuditTrailApiResponse {
  data: AuditEntryApiResource[];
  meta: AuditTrailMeta;
}

// ─── Domain model ─────────────────────────────────────────────────────────────

export interface AuditChange {
  field:    string;
  oldValue: unknown;
  newValue: unknown;
}

export interface AuditEntry {
  id:          number;
  entityType:  AuditEntityType;
  entityId:    number;
  entityTitle: string;
  event:       AuditEvent;
  causerName:  string | null;
  causerId:    number | null;
  occurredAt:  string;
  changes:     AuditChange[];
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface AuditTrailFilters {
  entity_type?: AuditEntityType | null;
  actor?:       number | null;
  from?:        string | null;
  to?:          string | null;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

export function mapAuditEntry(api: AuditEntryApiResource): AuditEntry {
  const changes: AuditChange[] = Object.entries(api.changes ?? {}).map(([field, val]) => ({
    field,
    oldValue: val.old,
    newValue: val.new,
  }));

  return {
    id:          api.id,
    entityType:  api.entity_type as AuditEntityType,
    entityId:    api.entity_id,
    entityTitle: api.entity_title,
    event:       api.event as AuditEvent,
    causerName:  api.causer?.name ?? null,
    causerId:    api.causer?.id ?? null,
    occurredAt:  api.occurred_at,
    changes,
  };
}
