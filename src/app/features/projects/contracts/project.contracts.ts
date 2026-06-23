export type ProjectStatus = 'pre_project' | 'initiation' | 'delivery' | 'closing' | 'closed';

export const PROJECT_STATUSES: ProjectStatus[] = [
  'pre_project', 'initiation', 'delivery', 'closing', 'closed',
];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  pre_project: 'Pre-Project',
  initiation: 'Initiation',
  delivery: 'Delivery',
  closing: 'Closing',
  closed: 'Closed',
};

export interface ToleranceRange {
  min: number | null;
  max: number | null;
}

export interface ProjectTolerances {
  time: ToleranceRange;
  cost: ToleranceRange;
  scope: string | null;
  risk: string | null;
  quality: string | null;
  benefit: string | null;
}

export interface ProjectApiResource {
  id: number;
  name: string;
  reference: string;
  status: ProjectStatus;
  current_stage_name: string | null;
  tolerances: ProjectTolerances;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  reference: string;
  status: ProjectStatus;
  currentStageName: string | null;
  tolerances: ProjectTolerances;
  createdBy: string;
  createdAt: string;
}

export function normalizeTolerances(raw: ProjectTolerances | null | undefined): ProjectTolerances {
  return {
    time: raw?.time ?? { min: null, max: null },
    cost: raw?.cost ?? { min: null, max: null },
    scope: raw?.scope ?? null,
    risk: raw?.risk ?? null,
    quality: raw?.quality ?? null,
    benefit: raw?.benefit ?? null,
  };
}

export function mapProject(api: ProjectApiResource): Project {
  return {
    id: api.id,
    name: api.name,
    reference: api.reference,
    status: api.status,
    currentStageName: api.current_stage_name,
    tolerances: normalizeTolerances(api.tolerances),
    createdBy: api.created_by,
    createdAt: api.created_at,
  };
}

export interface CreateProjectPayload {
  name: string;
  reference: string;
  tolerances: ProjectTolerances;
}

export interface UpdateProjectPayload {
  name?: string;
  reference?: string;
  status?: ProjectStatus;
  tolerances?: Partial<ProjectTolerances>;
}
