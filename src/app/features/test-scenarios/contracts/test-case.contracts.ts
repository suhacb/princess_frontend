import { PersonApiResource, Person, mapPerson } from '../../members/contracts/member.contracts';

export type TestCasePriority = 'low' | 'medium' | 'high';
export type TestCaseType = 'positive' | 'negative' | 'edge';

export const TEST_CASE_PRIORITY_LABELS: Record<TestCasePriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const TEST_CASE_TYPE_LABELS: Record<TestCaseType, string> = {
  positive: 'Positive',
  negative: 'Negative',
  edge: 'Edge',
};

export const TEST_CASE_PRIORITIES: TestCasePriority[] = ['low', 'medium', 'high'];
export const TEST_CASE_TYPES: TestCaseType[] = ['positive', 'negative', 'edge'];

export interface TestCaseApiResource {
  id: number;
  test_scenario_id: number;
  project_id: number;
  ref: string;
  title: string;
  steps: string[];
  expected_result: string;
  priority: TestCasePriority | null;
  type: TestCaseType | null;
  created_by: PersonApiResource | null;
  updated_by: PersonApiResource | null;
  created_at: string;
  updated_at: string;
}

export interface TestCase {
  id: number;
  testScenarioId: number;
  projectId: number;
  ref: string;
  title: string;
  steps: string[];
  expectedResult: string;
  priority: TestCasePriority | null;
  type: TestCaseType | null;
  createdBy: Person | null;
  updatedBy: Person | null;
  createdAt: string;
  updatedAt: string;
}

export function mapTestCase(api: TestCaseApiResource): TestCase {
  return {
    id: api.id,
    testScenarioId: api.test_scenario_id,
    projectId: api.project_id,
    ref: api.ref,
    title: api.title,
    steps: api.steps,
    expectedResult: api.expected_result,
    priority: api.priority,
    type: api.type,
    createdBy: api.created_by ? mapPerson(api.created_by) : null,
    updatedBy: api.updated_by ? mapPerson(api.updated_by) : null,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

export interface CreateTestCasePayload {
  title: string;
  steps: string[];
  expected_result: string;
  priority?: TestCasePriority;
  type: TestCaseType;
}

export interface UpdateTestCasePayload {
  title?: string;
  steps?: string[];
  expected_result?: string;
  priority?: TestCasePriority;
  type?: TestCaseType;
}
