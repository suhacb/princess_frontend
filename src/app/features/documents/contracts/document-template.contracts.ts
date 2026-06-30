import {
  DocumentCategory,
  DocumentType,
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_TYPE_LABELS,
} from './document.contracts';

export type TemplateLevel = 'global' | 'project';
export type TemplateNodeKind = 'root' | 'category' | 'type';

export interface TemplateSettings {
  fontFamily?: string;
  fontSize?: number;
  primaryColor?: string;
  logoS3Key?: string;
  headerText?: string;
  footerText?: string;
  margins?: Partial<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>;
}

export interface DocumentTemplateApiResource {
  id: number;
  parent_id: number | null;
  level: TemplateLevel;
  category: DocumentCategory | null;
  type: DocumentType | null;
  name: string;
  description: string | null;
  file_name: string | null;
  s3_key: string | null;
  settings: TemplateSettings;
  created_at: string;
  updated_at: string;
}

export interface DocumentTemplate {
  id: number;
  parentId: number | null;
  level: TemplateLevel;
  category: DocumentCategory | null;
  type: DocumentType | null;
  name: string;
  description: string | null;
  fileName: string | null;
  s3Key: string | null;
  settings: TemplateSettings;
  kind: TemplateNodeKind;
  categoryLabel: string | null;
  typeLabel: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentTemplateNode extends DocumentTemplate {
  children: DocumentTemplateNode[];
  effectiveSettings: TemplateSettings;
}

export interface CreateTemplatePayload {
  name: string;
  parent_id?: number | null;
  category?: DocumentCategory | null;
  type?: DocumentType | null;
  description?: string | null;
  settings?: TemplateSettings;
}

export interface UpdateTemplatePayload {
  name?: string;
  description?: string | null;
  settings?: TemplateSettings;
}

export function deriveKind(api: Pick<DocumentTemplateApiResource, 'category' | 'type'>): TemplateNodeKind {
  if (api.type !== null) return 'type';
  if (api.category !== null) return 'category';
  return 'root';
}

export function mapDocumentTemplate(api: DocumentTemplateApiResource): DocumentTemplate {
  const kind = deriveKind(api);
  return {
    id: api.id,
    parentId: api.parent_id,
    level: api.level,
    category: api.category,
    type: api.type,
    name: api.name,
    description: api.description,
    fileName: api.file_name,
    s3Key: api.s3_key,
    settings: api.settings ?? {},
    kind,
    categoryLabel: api.category ? DOCUMENT_CATEGORY_LABELS[api.category] : null,
    typeLabel: api.type ? DOCUMENT_TYPE_LABELS[api.type] : null,
    createdAt: new Date(api.created_at),
    updatedAt: new Date(api.updated_at),
  };
}

export function mergeSettings(parent: TemplateSettings, child: TemplateSettings): TemplateSettings {
  const merged: TemplateSettings = { ...parent, ...child };
  if (parent.margins || child.margins) {
    merged.margins = { ...(parent.margins ?? {}), ...(child.margins ?? {}) };
  }
  return merged;
}

export function buildTemplateTree(templates: DocumentTemplate[]): DocumentTemplateNode[] {
  const nodeMap = new Map<number, DocumentTemplateNode>();

  for (const t of templates) {
    nodeMap.set(t.id, { ...t, children: [], effectiveSettings: {} });
  }

  const roots: DocumentTemplateNode[] = [];

  for (const node of nodeMap.values()) {
    if (node.parentId === null) {
      roots.push(node);
    } else {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  }

  function propagate(node: DocumentTemplateNode, parentEffective: TemplateSettings): void {
    node.effectiveSettings = mergeSettings(parentEffective, node.settings);
    for (const child of node.children) {
      propagate(child, node.effectiveSettings);
    }
  }

  for (const root of roots) {
    propagate(root, {});
  }

  return roots;
}
