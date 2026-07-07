import { PersonApiResource, Person, mapPerson } from '../../members/contracts/member.contracts';
import {
  TestScenario,
  TestScenarioApiResource,
  mapTestScenario,
} from '../../test-scenarios/contracts/test-scenario.contracts';

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

export const TEST_SESSION_PLAN_STATUSES: TestSessionPlanStatus[] = ['draft', 'active', 'completed', 'cancelled'];

export interface TestSessionPlanApiResource {
  id: number;
  project_id: number;
  ref: string;
  title: string;
  description: string | null;
  planned_date: string | null;
  team_type: TeamType;
  assignee: PersonApiResource | null;
  status: TestSessionPlanStatus;
  scenarios: TestScenarioApiResource[];
  created_by: PersonApiResource | null;
  updated_by: PersonApiResource | null;
  created_at: string;
  updated_at: string;
}

export interface TestSessionPlan {
  id: number;
  projectId: number;
  ref: string;
  title: string;
  description: string | null;
  plannedDate: string | null;
  teamType: TeamType;
  assignee: Person | null;
  status: TestSessionPlanStatus;
  scenarios: TestScenario[];
  createdBy: Person | null;
  updatedBy: Person | null;
  createdAt: string;
  updatedAt: string;
}

export function mapTestSessionPlan(api: TestSessionPlanApiResource): TestSessionPlan {
  return {
    id: api.id,
    projectId: api.project_id,
    ref: api.ref,
    title: api.title,
    description: api.description,
    plannedDate: api.planned_date,
    teamType: api.team_type,
    assignee: api.assignee ? mapPerson(api.assignee) : null,
    status: api.status,
    scenarios: (api.scenarios ?? []).map(mapTestScenario),
    createdBy: api.created_by ? mapPerson(api.created_by) : null,
    updatedBy: api.updated_by ? mapPerson(api.updated_by) : null,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

export interface CreateTestSessionPlanPayload {
  title: string;
  description?: string | null;
  planned_date: string;
  team_type: TeamType;
  assignee_id?: number | null;
  scenario_ids?: number[];
}

export interface UpdateTestSessionPlanPayload {
  title?: string;
  description?: string | null;
  planned_date?: string;
  team_type?: TeamType;
  assignee_id?: number | null;
  scenario_ids?: number[];
}
