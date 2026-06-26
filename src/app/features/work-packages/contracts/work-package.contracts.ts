// ─── Product (Product Breakdown Structure) ───────────────────────────────────

export type ProductStatus = 'draft' | 'in_development' | 'baselined' | 'superseded';
export type ProductType = 'specialist' | 'management' | 'external';

export const PRODUCT_STATUSES: ProductStatus[] = ['draft', 'in_development', 'baselined', 'superseded'];
export const PRODUCT_TYPES: ProductType[] = ['specialist', 'management', 'external'];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  draft: 'Draft',
  in_development: 'In Development',
  baselined: 'Baselined',
  superseded: 'Superseded',
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  specialist: 'Specialist',
  management: 'Management',
  external: 'External',
};

export interface ProductApiResource {
  id: number;
  project_id: number;
  parent_id: number | null;
  identifier: string | null;
  title: string;
  purpose: string | null;
  type: ProductType;
  status: ProductStatus;
  children: ProductApiResource[];
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  projectId: number;
  parentId: number | null;
  identifier: string | null;
  title: string;
  purpose: string | null;
  type: ProductType;
  status: ProductStatus;
  children: Product[];
}

export function mapProduct(api: ProductApiResource): Product {
  return {
    id: api.id,
    projectId: api.project_id,
    parentId: api.parent_id,
    identifier: api.identifier,
    title: api.title,
    purpose: api.purpose,
    type: api.type,
    status: api.status,
    children: (api.children ?? []).map(mapProduct),
  };
}

export interface CreateProductPayload {
  title: string;
  type: ProductType;
  parent_id?: number | null;
  purpose?: string | null;
}

export interface UpdateProductPayload {
  title?: string;
  type?: ProductType;
  purpose?: string | null;
}

// ─── Work Package ─────────────────────────────────────────────────────────────

export type WorkPackageStatus = 'draft' | 'authorized' | 'in_progress' | 'completed' | 'cancelled';

export const WP_STATUSES: WorkPackageStatus[] = ['draft', 'authorized', 'in_progress', 'completed', 'cancelled'];

export const WP_STATUS_LABELS: Record<WorkPackageStatus, string> = {
  draft: 'Draft',
  authorized: 'Authorized',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export interface PersonSummary {
  id: number;
  name: string;
}

export interface WorkPackageApiResource {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  status: WorkPackageStatus;
  team_manager_id: number;
  team_manager: PersonSummary | null;
  planned_start: string;
  planned_end: string;
  actual_start: string | null;
  actual_end: string | null;
  products: ProductApiResource[];
  created_at: string;
  updated_at: string;
}

export interface WorkPackage {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: WorkPackageStatus;
  teamManagerId: number;
  teamManager: PersonSummary | null;
  plannedStart: string;
  plannedEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  products: Product[];
}

export function mapWorkPackage(api: WorkPackageApiResource): WorkPackage {
  return {
    id: api.id,
    projectId: api.project_id,
    title: api.title,
    description: api.description,
    status: api.status,
    teamManagerId: api.team_manager_id,
    teamManager: api.team_manager ?? null,
    plannedStart: api.planned_start,
    plannedEnd: api.planned_end,
    actualStart: api.actual_start,
    actualEnd: api.actual_end,
    products: (api.products ?? []).map(mapProduct),
  };
}

export interface CreateWorkPackagePayload {
  title: string;
  team_manager_id: number;
  planned_start: string;
  planned_end: string;
  description?: string | null;
}

export interface UpdateWorkPackagePayload {
  title?: string;
  description?: string | null;
  team_manager_id?: number;
  planned_start?: string;
  planned_end?: string;
}

// ─── Project member (used for team manager picker) ────────────────────────────

export interface ProjectMemberApiResource {
  id: number;
  person: PersonSummary;
  role: string;
}

export interface ProjectMember {
  id: number;
  person: PersonSummary;
  role: string;
}

export function mapProjectMember(api: ProjectMemberApiResource): ProjectMember {
  return { id: api.id, person: api.person, role: api.role };
}

// ─── PBS export ───────────────────────────────────────────────────────────────

export function exportPbsToText(products: Product[]): string {
  function serialize(p: Product, depth: number): string[] {
    return [
      '  '.repeat(depth) + p.title,
      ...p.children.flatMap(child => serialize(child, depth + 1)),
    ];
  }
  return products.flatMap(p => serialize(p, 0)).join('\n');
}

// ─── PBS selection ────────────────────────────────────────────────────────────

export interface PbsSelection {
  productId: number;
  parentId: number | null;
  node: Product;
}
