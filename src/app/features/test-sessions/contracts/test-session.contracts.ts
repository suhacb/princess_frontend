import { PersonApiResource, Person, mapPerson } from '../../members/contracts/member.contracts';
import { TeamType } from './test-session-plan.contracts';
import {
  TestResultStatus,
  TestSessionResult,
  TestSessionResultApiResource,
  mapTestSessionResult,
} from './test-session-result.contracts';

export type TestSessionStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export const TEST_SESSION_STATUS_LABELS: Record<TestSessionStatus, string> = {
  planned: 'Planned',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const TEST_SESSION_STATUSES: TestSessionStatus[] = ['planned', 'in_progress', 'completed', 'cancelled'];

export interface TestSessionApiResource {
  id: number;
  project_id: number;
  test_session_plan_id: number | null;
  ref: string;
  title: string;
  session_date: string;
  tester: PersonApiResource;
  team_type: TeamType;
  environment: string | null;
  status: TestSessionStatus;
  notes: string | null;
  results: TestSessionResultApiResource[];
  created_by: PersonApiResource | null;
  updated_by: PersonApiResource | null;
  created_at: string;
  updated_at: string;
}

export interface TestSession {
  id: number;
  projectId: number;
  testSessionPlanId: number | null;
  ref: string;
  title: string;
  sessionDate: string;
  tester: Person;
  teamType: TeamType;
  environment: string | null;
  status: TestSessionStatus;
  notes: string | null;
  results: TestSessionResult[];
  createdBy: Person | null;
  updatedBy: Person | null;
  createdAt: string;
  updatedAt: string;
}

export function mapTestSession(api: TestSessionApiResource): TestSession {
  return {
    id: api.id,
    projectId: api.project_id,
    testSessionPlanId: api.test_session_plan_id,
    ref: api.ref,
    title: api.title,
    sessionDate: api.session_date,
    tester: mapPerson(api.tester),
    teamType: api.team_type,
    environment: api.environment,
    status: api.status,
    notes: api.notes,
    results: (api.results ?? []).map(mapTestSessionResult),
    createdBy: api.created_by ? mapPerson(api.created_by) : null,
    updatedBy: api.updated_by ? mapPerson(api.updated_by) : null,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

export interface CreateTestSessionPayload {
  title: string;
  session_date: string;
  tester_id: number;
  team_type: TeamType;
  environment?: string | null;
  notes?: string | null;
  test_session_plan_id?: number | null;
}

export interface UpdateTestSessionPayload {
  title?: string;
  session_date?: string;
  tester_id?: number;
  team_type?: TeamType;
  environment?: string | null;
  notes?: string | null;
}

export interface TestSessionReportSummary {
  pass: number;
  fail: number;
  blocked: number;
  not_run: number;
  skipped: number;
}

export interface TestSessionReportResultLineApiResource {
  scenario_ref: string;
  scenario_title: string;
  result: TestResultStatus;
  notes: string | null;
  defect_ref: string | null;
  executed_at: string | null;
}

export interface TestSessionReportResultLine {
  scenarioRef: string;
  scenarioTitle: string;
  result: TestResultStatus;
  notes: string | null;
  defectRef: string | null;
  executedAt: string | null;
}

export interface TestSessionReportApiResource {
  ref: string;
  title: string;
  session_date: string;
  team_type: TeamType;
  environment: string | null;
  status: TestSessionStatus;
  notes: string | null;
  summary: TestSessionReportSummary;
  results: TestSessionReportResultLineApiResource[];
}

export interface TestSessionReport {
  ref: string;
  title: string;
  sessionDate: string;
  teamType: TeamType;
  environment: string | null;
  status: TestSessionStatus;
  notes: string | null;
  summary: TestSessionReportSummary;
  results: TestSessionReportResultLine[];
}

export function mapTestSessionReport(api: TestSessionReportApiResource): TestSessionReport {
  return {
    ref: api.ref,
    title: api.title,
    sessionDate: api.session_date,
    teamType: api.team_type,
    environment: api.environment,
    status: api.status,
    notes: api.notes,
    summary: api.summary,
    results: (api.results ?? []).map(line => ({
      scenarioRef: line.scenario_ref,
      scenarioTitle: line.scenario_title,
      result: line.result,
      notes: line.notes,
      defectRef: line.defect_ref,
      executedAt: line.executed_at,
    })),
  };
}
