import { ProjectTolerances, normalizeTolerances } from '../../projects/contracts/project.contracts';

export type StageType = 'initiation' | 'delivery' | 'final';
export type StageStatus = 'planned' | 'active' | 'completed' | 'exception';
export type StageTransitionAction = 'start' | 'complete' | 'exception';
export type ToleranceHealth = 'within' | 'warning' | 'exception' | null;

export const STAGE_TYPE_LABELS: Record<StageType, string> = {
  initiation: 'Initiation',
  delivery: 'Delivery',
  final: 'Final',
};

export const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  planned: 'Planned',
  active: 'Active',
  completed: 'Completed',
  exception: 'Exception',
};

export const STAGE_TRANSITION_LABELS: Record<StageTransitionAction, string> = {
  start: 'Start',
  complete: 'Complete',
  exception: 'Flag Exception',
};

export const STAGE_TYPES: StageType[] = ['initiation', 'delivery', 'final'];

export interface StageToleranceStatus {
  time: ToleranceHealth;
  cost: ToleranceHealth;
  scope: ToleranceHealth;
  risk: ToleranceHealth;
  quality: ToleranceHealth;
  benefit: ToleranceHealth;
}

export interface StageApiResource {
  id: number;
  project_id: number;
  name: string;
  type: StageType;
  status: StageStatus;
  planned_start_date: string | null;
  planned_end_date: string | null;
  actual_start_date: string | null;
  actual_end_date: string | null;
  tolerances: ProjectTolerances;
  tolerance_status: StageToleranceStatus;
  created_at: string;
  updated_at: string;
}

export interface Stage {
  id: number;
  projectId: number;
  name: string;
  type: StageType;
  status: StageStatus;
  plannedStartDate: string | null;
  plannedEndDate: string | null;
  actualStartDate: string | null;
  actualEndDate: string | null;
  tolerances: ProjectTolerances;
  toleranceStatus: StageToleranceStatus;
  createdAt: string;
}

export function mapStage(api: StageApiResource): Stage {
  return {
    id: api.id,
    projectId: api.project_id,
    name: api.name,
    type: api.type,
    status: api.status,
    plannedStartDate: api.planned_start_date,
    plannedEndDate: api.planned_end_date,
    actualStartDate: api.actual_start_date,
    actualEndDate: api.actual_end_date,
    tolerances: normalizeTolerances(api.tolerances),
    toleranceStatus: api.tolerance_status,
    createdAt: api.created_at,
  };
}

export interface CreateStagePayload {
  name: string;
  type: StageType;
  planned_start_date: string | null;
  planned_end_date: string | null;
  tolerances: ProjectTolerances;
}

export interface UpdateStagePayload {
  name?: string;
  type?: StageType;
  planned_start_date?: string | null;
  planned_end_date?: string | null;
  tolerances?: Partial<ProjectTolerances>;
}

export interface TransitionStagePayload {
  action: StageTransitionAction;
}

export function availableTransitions(status: StageStatus): StageTransitionAction[] {
  switch (status) {
    case 'planned': return ['start'];
    case 'active': return ['complete', 'exception'];
    default: return [];
  }
}
