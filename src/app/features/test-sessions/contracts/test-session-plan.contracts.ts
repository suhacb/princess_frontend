export type TeamType = 'supplier' | 'client';

export const TEAM_TYPE_LABELS: Record<TeamType, string> = {
  supplier: 'Supplier',
  client: 'Client',
};

export const TEAM_TYPES: TeamType[] = ['supplier', 'client'];

export type TestSessionPlanStatus = 'draft' | 'active' | 'completed' | 'cancelled';

export const TEST_SESSION_PLAN_STATUS_LABELS: Record<TestSessionPlanStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export interface TestSessionPlanApiResource {
  id: number;
  ref: string;
  title: string;
  team_type: TeamType;
  status: TestSessionPlanStatus;
  planned_date: string | null;
}

export interface TestSessionPlan {
  id: number;
  ref: string;
  title: string;
  teamType: TeamType;
  status: TestSessionPlanStatus;
  plannedDate: string | null;
}

export function mapTestSessionPlan(api: TestSessionPlanApiResource): TestSessionPlan {
  return {
    id: api.id,
    ref: api.ref,
    title: api.title,
    teamType: api.team_type,
    status: api.status,
    plannedDate: api.planned_date,
  };
}
