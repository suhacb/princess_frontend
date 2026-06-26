export type WbsStatus = 'planned' | 'in_progress' | 'complete';
export const WBS_STATUSES: WbsStatus[] = ['planned', 'in_progress', 'complete'];
export const WBS_STATUS_LABELS: Record<WbsStatus, string> = {
  planned: 'Planned',
  in_progress: 'In Progress',
  complete: 'Complete',
};

export interface WbsPersonSummary {
  id: number;
  name: string;
}

// ─── Activity ────────────────────────────────────────────────────────────────

export interface ActivityApiResource {
  id: number;
  product_id: number;
  title: string;
  description: string | null;
  status: WbsStatus;
  owner: WbsPersonSummary | null;
  sort_order: number;
}

export interface Activity {
  id: number;
  productId: number;
  title: string;
  description: string | null;
  status: WbsStatus;
  owner: WbsPersonSummary | null;
  sortOrder: number;
}

export function mapActivity(api: ActivityApiResource): Activity {
  return {
    id: api.id,
    productId: api.product_id,
    title: api.title,
    description: api.description,
    status: api.status,
    owner: api.owner,
    sortOrder: api.sort_order,
  };
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface ProductApiResource {
  id: number;
  work_package_id: number;
  title: string;
  description: string | null;
  status: WbsStatus;
  owner: WbsPersonSummary | null;
  sort_order: number;
  acceptance_criteria_count: number;
  activities: ActivityApiResource[];
}

export interface Product {
  id: number;
  workPackageId: number;
  title: string;
  description: string | null;
  status: WbsStatus;
  owner: WbsPersonSummary | null;
  sortOrder: number;
  acceptanceCriteriaCount: number;
  activities: Activity[];
}

export function mapProduct(api: ProductApiResource): Product {
  return {
    id: api.id,
    workPackageId: api.work_package_id,
    title: api.title,
    description: api.description,
    status: api.status,
    owner: api.owner,
    sortOrder: api.sort_order,
    acceptanceCriteriaCount: api.acceptance_criteria_count,
    activities: api.activities.map(mapActivity),
  };
}

// ─── Work Package ─────────────────────────────────────────────────────────────

export interface WorkPackageApiResource {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  status: WbsStatus;
  owner: WbsPersonSummary | null;
  sort_order: number;
  products: ProductApiResource[];
}

export interface WorkPackage {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: WbsStatus;
  owner: WbsPersonSummary | null;
  sortOrder: number;
  products: Product[];
}

export function mapWorkPackage(api: WorkPackageApiResource): WorkPackage {
  return {
    id: api.id,
    projectId: api.project_id,
    title: api.title,
    description: api.description,
    status: api.status,
    owner: api.owner,
    sortOrder: api.sort_order,
    products: api.products.map(mapProduct),
  };
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateWorkPackagePayload {
  title: string;
  description?: string | null;
}

export interface UpdateWorkPackagePayload {
  title?: string;
  description?: string | null;
  status?: WbsStatus;
}

export interface CreateProductPayload {
  title: string;
  description?: string | null;
}

export interface UpdateProductPayload {
  title?: string;
  description?: string | null;
  status?: WbsStatus;
}

export interface CreateActivityPayload {
  title: string;
  description?: string | null;
}

export interface UpdateActivityPayload {
  title?: string;
  description?: string | null;
  status?: WbsStatus;
}

export interface ReorderPayload {
  items: { id: number; sort_order: number }[];
}

// ─── Export ──────────────────────────────────────────────────────────────────

export function exportWbsToText(packages: WorkPackage[]): string {
  return packages
    .flatMap(wp => [
      wp.title,
      ...wp.products.flatMap(prod => [
        `  ${prod.title}`,
        ...prod.activities.map(act => `    ${act.title}`),
      ]),
    ])
    .join('\n');
}

// ─── Selection ───────────────────────────────────────────────────────────────

export type WbsNodeType = 'wp' | 'prod' | 'act';

export interface WbsSelection {
  type: WbsNodeType;
  wpId: number;
  prodId?: number;
  actId?: number;
  node: WorkPackage | Product | Activity;
}
