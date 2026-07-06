import { PersonApiResource, Person, mapPerson } from '../../members/contracts/member.contracts';
import { TestCase, TestCaseApiResource, mapTestCase } from './test-case.contracts';

export type TestScenarioType = 'feature' | 'e2e';
export type TestScenarioStatus = 'draft' | 'ready' | 'obsolete';

export const TEST_SCENARIO_TYPE_LABELS: Record<TestScenarioType, string> = {
  feature: 'Feature',
  e2e: 'End-to-end',
};

export const TEST_SCENARIO_STATUS_LABELS: Record<TestScenarioStatus, string> = {
  draft: 'Draft',
  ready: 'Ready',
  obsolete: 'Obsolete',
};

export const TEST_SCENARIO_TYPES: TestScenarioType[] = ['feature', 'e2e'];
export const TEST_SCENARIO_STATUSES: TestScenarioStatus[] = ['draft', 'ready', 'obsolete'];

export interface AcceptanceCriterionRef {
  id: number;
  ref: string;
  title: string;
}

export interface TestScenarioApiResource {
  id: number;
  project_id: number;
  ref: string;
  title: string;
  description: string | null;
  preconditions: string | null;
  type: TestScenarioType;
  status: TestScenarioStatus;
  is_testable: boolean;
  testable_notes: string | null;
  test_cases?: TestCaseApiResource[];
  acceptance_criteria?: AcceptanceCriterionRef[];
  created_by: PersonApiResource | null;
  updated_by: PersonApiResource | null;
  created_at: string;
  updated_at: string;
}

export interface TestScenario {
  id: number;
  projectId: number;
  ref: string;
  title: string;
  description: string | null;
  preconditions: string | null;
  type: TestScenarioType;
  status: TestScenarioStatus;
  isTestable: boolean;
  testableNotes: string | null;
  testCases: TestCase[];
  acceptanceCriteria: AcceptanceCriterionRef[];
  createdBy: Person | null;
  updatedBy: Person | null;
  createdAt: string;
  updatedAt: string;
}

export function mapTestScenario(api: TestScenarioApiResource): TestScenario {
  return {
    id: api.id,
    projectId: api.project_id,
    ref: api.ref,
    title: api.title,
    description: api.description,
    preconditions: api.preconditions,
    type: api.type,
    status: api.status,
    isTestable: api.is_testable,
    testableNotes: api.testable_notes,
    testCases: (api.test_cases ?? []).map(mapTestCase),
    acceptanceCriteria: api.acceptance_criteria ?? [],
    createdBy: api.created_by ? mapPerson(api.created_by) : null,
    updatedBy: api.updated_by ? mapPerson(api.updated_by) : null,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

export interface CreateTestScenarioPayload {
  title: string;
  description?: string | null;
  preconditions?: string | null;
  type: TestScenarioType;
  acceptance_criterion_ids?: number[];
}

export interface UpdateTestScenarioPayload {
  title?: string;
  description?: string | null;
  preconditions?: string | null;
  acceptance_criterion_ids?: number[];
}

export interface MarkTestablePayload {
  testable_notes?: string | null;
}
