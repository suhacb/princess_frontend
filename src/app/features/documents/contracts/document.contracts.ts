export type DocumentCategory =
  | 'initiation'
  | 'planning'
  | 'control'
  | 'delivery'
  | 'closure'
  | 'governance';

export type DocumentType =
  | 'project_mandate'
  | 'project_brief'
  | 'project_initiation_document'
  | 'benefits_management_approach'
  | 'project_plan'
  | 'stage_plan'
  | 'team_plan'
  | 'exception_plan'
  | 'product_description'
  | 'work_package'
  | 'highlight_report'
  | 'checkpoint_report'
  | 'exception_report'
  | 'issue_register'
  | 'risk_register'
  | 'change_log'
  | 'quality_register'
  | 'product_status_account'
  | 'daily_log'
  | 'lessons_log'
  | 'end_stage_report'
  | 'end_project_report'
  | 'lessons_learned_report'
  | 'communication_management_approach'
  | 'change_control_approach';

export type DocumentStatus = 'draft' | 'in_review' | 'confirmed' | 'superseded';

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  initiation: 'Initiation',
  planning: 'Planning',
  control: 'Control',
  delivery: 'Delivery',
  closure: 'Closure',
  governance: 'Governance',
};

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'initiation',
  'planning',
  'control',
  'delivery',
  'closure',
  'governance',
];

export const DOCUMENT_TYPE_BY_CATEGORY: Record<DocumentCategory, { key: DocumentType; label: string }[]> = {
  initiation: [
    { key: 'project_mandate', label: 'Project Mandate' },
    { key: 'project_brief', label: 'Project Brief' },
    { key: 'project_initiation_document', label: 'Project Initiation Document' },
    { key: 'benefits_management_approach', label: 'Benefits Management Approach' },
  ],
  planning: [
    { key: 'project_plan', label: 'Project Plan' },
    { key: 'stage_plan', label: 'Stage Plan' },
    { key: 'team_plan', label: 'Team Plan' },
    { key: 'exception_plan', label: 'Exception Plan' },
    { key: 'product_description', label: 'Product Description' },
    { key: 'work_package', label: 'Work Package' },
  ],
  control: [
    { key: 'highlight_report', label: 'Highlight Report' },
    { key: 'checkpoint_report', label: 'Checkpoint Report' },
    { key: 'exception_report', label: 'Exception Report' },
    { key: 'issue_register', label: 'Issue Register' },
    { key: 'risk_register', label: 'Risk Register' },
    { key: 'change_log', label: 'Change Log' },
    { key: 'quality_register', label: 'Quality Register' },
  ],
  delivery: [
    { key: 'product_status_account', label: 'Product Status Account' },
    { key: 'daily_log', label: 'Daily Log' },
    { key: 'lessons_log', label: 'Lessons Log' },
  ],
  closure: [
    { key: 'end_stage_report', label: 'End Stage Report' },
    { key: 'end_project_report', label: 'End Project Report' },
    { key: 'lessons_learned_report', label: 'Lessons Learned Report' },
  ],
  governance: [
    { key: 'communication_management_approach', label: 'Communication Management Approach' },
    { key: 'change_control_approach', label: 'Change Control Approach' },
  ],
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = Object.fromEntries(
  DOCUMENT_CATEGORIES.flatMap(cat =>
    DOCUMENT_TYPE_BY_CATEGORY[cat].map(({ key, label }) => [key, label]),
  ),
) as Record<DocumentType, string>;

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  confirmed: 'Confirmed',
  superseded: 'Superseded',
};

export const DOCUMENT_STATUSES: DocumentStatus[] = ['draft', 'in_review', 'confirmed', 'superseded'];

export const DOCUMENT_STATUS_TRANSITIONS: Record<DocumentStatus, DocumentStatus[]> = {
  draft: ['in_review'],
  in_review: ['confirmed', 'draft'],
  confirmed: ['superseded'],
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
  owner: { id: number; name: string } | null;
  currentVersion: DocumentVersion | null;
  versionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentFilters {
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
    owner: api.owner,
    currentVersion: api.current_version
      ? mapDocumentVersion({ ...api.current_version, document_id: api.id })
      : null,
    versionCount: api.version_count,
    createdAt: new Date(api.created_at),
    updatedAt: new Date(api.updated_at),
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
