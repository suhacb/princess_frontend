export type DocumentCategory =
  | 'initiation'
  | 'planning'
  | 'reporting'
  | 'register'
  | 'qa'
  | 'meeting'
  | 'general';

export type DocumentType =
  // initiation
  | 'project_brief'
  | 'project_initiation_document'
  | 'project_product_description'
  // planning
  | 'project_plan'
  | 'stage_plan'
  | 'team_plan'
  | 'exception_plan'
  | 'work_package'
  // reporting
  | 'highlight_report'
  | 'checkpoint_report'
  | 'end_stage_report'
  | 'end_project_report'
  | 'exception_report'
  | 'lessons_report'
  // register
  | 'risk_register'
  | 'issue_register'
  | 'quality_register'
  | 'change_log'
  | 'lessons_log'
  | 'daily_log'
  // qa
  | 'requirements_specification'
  | 'test_specification'
  | 'test_session_plan'
  | 'test_execution_report'
  | 'traceability_matrix'
  // meeting
  | 'meeting_agenda'
  | 'meeting_minutes'
  // general
  | 'general';

export type DocumentStatus = 'draft' | 'in_review' | 'confirmed' | 'superseded';

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  initiation: 'Initiation',
  planning:   'Planning',
  reporting:  'Reporting',
  register:   'Register',
  qa:         'QA',
  meeting:    'Meeting',
  general:    'General',
};

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'initiation',
  'planning',
  'reporting',
  'register',
  'qa',
  'meeting',
  'general',
];

export const DOCUMENT_TYPE_BY_CATEGORY: Record<DocumentCategory, { key: DocumentType; label: string }[]> = {
  initiation: [
    { key: 'project_brief',                  label: 'Project Brief' },
    { key: 'project_initiation_document',    label: 'Project Initiation Document' },
    { key: 'project_product_description',    label: 'Project Product Description' },
  ],
  planning: [
    { key: 'project_plan',   label: 'Project Plan' },
    { key: 'stage_plan',     label: 'Stage Plan' },
    { key: 'team_plan',      label: 'Team Plan' },
    { key: 'exception_plan', label: 'Exception Plan' },
    { key: 'work_package',   label: 'Work Package' },
  ],
  reporting: [
    { key: 'highlight_report',    label: 'Highlight Report' },
    { key: 'checkpoint_report',   label: 'Checkpoint Report' },
    { key: 'end_stage_report',    label: 'End Stage Report' },
    { key: 'end_project_report',  label: 'End Project Report' },
    { key: 'exception_report',    label: 'Exception Report' },
    { key: 'lessons_report',      label: 'Lessons Report' },
  ],
  register: [
    { key: 'risk_register',    label: 'Risk Register' },
    { key: 'issue_register',   label: 'Issue Register' },
    { key: 'quality_register', label: 'Quality Register' },
    { key: 'change_log',       label: 'Change Log' },
    { key: 'lessons_log',      label: 'Lessons Log' },
    { key: 'daily_log',        label: 'Daily Log' },
  ],
  qa: [
    { key: 'requirements_specification', label: 'Requirements Specification' },
    { key: 'test_specification',         label: 'Test Specification' },
    { key: 'test_session_plan',          label: 'Test Session Plan' },
    { key: 'test_execution_report',      label: 'Test Execution Report' },
    { key: 'traceability_matrix',        label: 'Traceability Matrix' },
  ],
  meeting: [
    { key: 'meeting_agenda',  label: 'Meeting Agenda' },
    { key: 'meeting_minutes', label: 'Meeting Minutes' },
  ],
  general: [
    { key: 'general', label: 'General' },
  ],
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = Object.fromEntries(
  DOCUMENT_CATEGORIES.flatMap(cat =>
    DOCUMENT_TYPE_BY_CATEGORY[cat].map(({ key, label }) => [key, label]),
  ),
) as Record<DocumentType, string>;

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  draft:      'Draft',
  in_review:  'In Review',
  confirmed:  'Confirmed',
  superseded: 'Superseded',
};

export const DOCUMENT_STATUSES: DocumentStatus[] = ['draft', 'in_review', 'confirmed', 'superseded'];

export const DOCUMENT_STATUS_TRANSITIONS: Record<DocumentStatus, DocumentStatus[]> = {
  draft:      ['in_review'],
  in_review:  ['confirmed', 'draft'],
  confirmed:  ['superseded'],
  superseded: [],
};

export interface DocumentVersionApiResource {
  id: number;
  document_id: number;
  version_number: number;
  file_name: string;
  file_size: number;
  mime_type: string;
  comment: string | null;
  uploaded_by: { id: number; name: string };
  uploaded_at: string;
}

export interface DocumentApiResource {
  id: number;
  project_id: number;
  title: string;
  type: DocumentType;
  type_label: string;
  category: DocumentCategory;
  category_label: string;
  status: DocumentStatus;
  tags: string[];
  owner: { id: number; name: string } | null;
  current_version: DocumentVersionApiResource | null;
  version_count: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: number;
  documentId: number;
  versionNumber: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  comment: string | null;
  uploadedBy: { id: number; name: string };
  uploadedAt: Date;
}

export interface Document {
  id: number;
  projectId: number;
  title: string;
  type: DocumentType;
  typeLabel: string;
  category: DocumentCategory;
  categoryLabel: string;
  status: DocumentStatus;
  tags: string[];
  owner: { id: number; name: string } | null;
  currentVersion: DocumentVersion | null;
  versionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentFilters {
  category?: DocumentCategory;
  type?: DocumentType;
  status?: DocumentStatus;
  search?: string;
}

export interface CreateDocumentPayload {
  title: string;
  type: DocumentType;
  owner_id?: number | null;
  description?: string | null;
}

export interface UpdateDocumentPayload {
  title?: string;
  type?: DocumentType;
  status?: DocumentStatus;
  owner_id?: number | null;
}

export interface ClassifyDocumentPayload {
  type?: DocumentType;
  tags?: string[];
}

export function mapDocumentVersion(api: DocumentVersionApiResource): DocumentVersion {
  return {
    id: api.id,
    documentId: api.document_id,
    versionNumber: api.version_number,
    fileName: api.file_name,
    fileSize: api.file_size,
    mimeType: api.mime_type,
    comment: api.comment,
    uploadedBy: api.uploaded_by,
    uploadedAt: new Date(api.uploaded_at),
  };
}

export function mapDocument(api: DocumentApiResource): Document {
  return {
    id: api.id,
    projectId: api.project_id,
    title: api.title,
    type: api.type,
    typeLabel: api.type_label,
    category: api.category,
    categoryLabel: api.category_label,
    status: api.status,
    tags: api.tags ?? [],
    owner: api.owner,
    currentVersion: api.current_version
      ? mapDocumentVersion({ ...api.current_version, document_id: api.id })
      : null,
    versionCount: api.version_count,
    createdAt: new Date(api.created_at),
    updatedAt: new Date(api.updated_at),
  };
}

// ─── Entity document link contracts ───────────────────────────────────────────

export type DocumentLinkableType =
  | 'meeting'
  | 'stage'
  | 'project'
  | 'highlight_report'
  | 'checkpoint_report'
  | 'exception_report';

export const ENTITY_DOCUMENT_TYPES: Record<DocumentLinkableType, DocumentType[]> = {
  meeting:           ['meeting_agenda', 'meeting_minutes'],
  stage:             ['stage_plan'],
  project:           ['project_initiation_document'],
  highlight_report:  ['highlight_report'],
  checkpoint_report: ['checkpoint_report'],
  exception_report:  ['exception_report'],
};

export interface LinkDocumentPayload {
  linkable_type: DocumentLinkableType;
  linkable_id: number;
}

export interface EditorConfigApiResource {
  document: {
    fileType: string;
    key: string;
    title: string;
    url: string;
  };
  documentType: string;
  editorConfig: {
    callbackUrl: string;
    user: { id: string; name: string };
    lang: string;
  };
  token: string;
}

export const ONLYOFFICE_EDITABLE_MIME_TYPES = new Set([
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'application/vnd.oasis.opendocument.presentation',
  'text/plain',
  'application/rtf',
  'text/csv',
]);

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
