import { PersonApiResource, Person, mapPerson } from '../../members/contracts/member.contracts';
import { TestCase, TestCaseApiResource, mapTestCase } from '../../test-scenarios/contracts/test-case.contracts';
import { TestScenario, TestScenarioApiResource, mapTestScenario } from '../../test-scenarios/contracts/test-scenario.contracts';

export type TestResultStatus = 'pass' | 'fail' | 'blocked' | 'not_run' | 'skipped';

export const TEST_RESULT_STATUS_LABELS: Record<TestResultStatus, string> = {
  pass: 'Pass',
  fail: 'Fail',
  blocked: 'Blocked',
  not_run: 'Not run',
  skipped: 'Skipped',
};

export const TEST_RESULT_STATUSES: TestResultStatus[] = ['pass', 'fail', 'blocked', 'not_run', 'skipped'];

export type StepResultStatus = 'pass' | 'fail' | 'blocked';

export const STEP_RESULT_STATUSES: StepResultStatus[] = ['pass', 'fail', 'blocked'];

export interface StepResultApiResource {
  step_index: number;
  result: StepResultStatus;
  actual_result: string | null;
  defect_ref: string | null;
}

export interface StepResult {
  stepIndex: number;
  result: StepResultStatus;
  actualResult: string | null;
  defectRef: string | null;
}

export function mapStepResult(api: StepResultApiResource): StepResult {
  return {
    stepIndex: api.step_index,
    result: api.result,
    actualResult: api.actual_result,
    defectRef: api.defect_ref,
  };
}

export interface TestSessionAttachmentApiResource {
  id: number;
  step_index: number | null;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  created_by: PersonApiResource | null;
  created_at: string;
}

export interface TestSessionAttachment {
  id: number;
  stepIndex: number | null;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  createdBy: Person | null;
  createdAt: string;
}

export function mapTestSessionAttachment(api: TestSessionAttachmentApiResource): TestSessionAttachment {
  return {
    id: api.id,
    stepIndex: api.step_index,
    fileName: api.file_name,
    fileSizeBytes: api.file_size_bytes,
    mimeType: api.mime_type,
    createdBy: api.created_by ? mapPerson(api.created_by) : null,
    createdAt: api.created_at,
  };
}

export type AttachmentGroupsApiResource = Record<string, TestSessionAttachmentApiResource[]>;
export type AttachmentGroups = Record<string, TestSessionAttachment[]>;

export function mapAttachmentGroups(api: AttachmentGroupsApiResource | undefined): AttachmentGroups {
  const groups: AttachmentGroups = {};
  for (const key of Object.keys(api ?? {})) {
    groups[key] = (api![key] ?? []).map(mapTestSessionAttachment);
  }
  return groups;
}

export interface TestSessionResultApiResource {
  id: number;
  test_session_id: number;
  test_scenario: TestScenarioApiResource;
  test_case: TestCaseApiResource | null;
  result: TestResultStatus;
  step_results: StepResultApiResource[] | null;
  notes: string | null;
  defect_ref: string | null;
  executed_at: string | null;
  attachments?: AttachmentGroupsApiResource;
}

export interface TestSessionResult {
  id: number;
  testSessionId: number;
  testScenario: TestScenario;
  testCase: TestCase | null;
  result: TestResultStatus;
  stepResults: StepResult[] | null;
  notes: string | null;
  defectRef: string | null;
  executedAt: string | null;
  attachments: AttachmentGroups;
}

export function mapTestSessionResult(api: TestSessionResultApiResource): TestSessionResult {
  return {
    id: api.id,
    testSessionId: api.test_session_id,
    testScenario: mapTestScenario(api.test_scenario),
    testCase: api.test_case ? mapTestCase(api.test_case) : null,
    result: api.result,
    stepResults: api.step_results ? api.step_results.map(mapStepResult) : null,
    notes: api.notes,
    defectRef: api.defect_ref,
    executedAt: api.executed_at,
    attachments: mapAttachmentGroups(api.attachments),
  };
}

export interface UpdateScenarioResultPayload {
  result: TestResultStatus;
  notes?: string | null;
  defect_ref?: string | null;
}

export interface StepResultInput {
  step_index: number;
  result: StepResultStatus;
  actual_result?: string | null;
  defect_ref?: string | null;
}

export type UpdateTestCaseResultPayload =
  | { result: TestResultStatus; notes?: string | null; defect_ref?: string | null }
  | { step_results: StepResultInput[]; notes?: string | null; defect_ref?: string | null };
