import { TestCaseApiResource } from '../../test-scenarios/contracts/test-case.contracts';
import { TestScenarioApiResource } from '../../test-scenarios/contracts/test-scenario.contracts';
import {
  mapAttachmentGroups,
  mapStepResult,
  mapTestSessionAttachment,
  mapTestSessionResult,
  StepResultApiResource,
  TestSessionAttachmentApiResource,
  TestSessionResultApiResource,
} from './test-session-result.contracts';

const stubScenario: TestScenarioApiResource = {
  id: 1,
  project_id: 5,
  ref: 'TS-001',
  title: 'User can authenticate',
  description: null,
  preconditions: null,
  type: 'feature',
  status: 'ready',
  is_testable: true,
  testable_notes: null,
  test_cases: [],
  acceptance_criteria: [],
  created_by: null,
  updated_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

const stubCase: TestCaseApiResource = {
  id: 10,
  test_scenario_id: 1,
  project_id: 5,
  ref: 'TC-001',
  title: 'Log in with valid credentials',
  steps: ['Open login page', 'Submit form'],
  expected_result: 'Redirected to dashboard',
  priority: 'high',
  type: 'positive',
  created_by: null,
  updated_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

const stubStepResultApi: StepResultApiResource = {
  step_index: 0,
  result: 'pass',
  actual_result: 'Login page loaded as expected',
  defect_ref: null,
};

const stubAttachmentApi: TestSessionAttachmentApiResource = {
  id: 99,
  step_index: 0,
  file_name: 'screenshot.png',
  file_size_bytes: 1024,
  mime_type: 'image/png',
  created_by: { id: 3, name: 'Bob', email: null, job_title: null, organization: null },
  created_at: '2026-07-01T12:00:00Z',
};

describe('mapStepResult()', () => {
  it('maps all fields', () => {
    const s = mapStepResult(stubStepResultApi);
    expect(s.stepIndex).toBe(0);
    expect(s.result).toBe('pass');
    expect(s.actualResult).toBe('Login page loaded as expected');
    expect(s.defectRef).toBeNull();
  });
});

describe('mapTestSessionAttachment()', () => {
  it('maps all fields', () => {
    const a = mapTestSessionAttachment(stubAttachmentApi);
    expect(a.id).toBe(99);
    expect(a.stepIndex).toBe(0);
    expect(a.fileName).toBe('screenshot.png');
    expect(a.fileSizeBytes).toBe(1024);
    expect(a.mimeType).toBe('image/png');
    expect(a.createdBy?.name).toBe('Bob');
  });
});

describe('mapAttachmentGroups()', () => {
  it('maps keyed groups', () => {
    const groups = mapAttachmentGroups({ case: [stubAttachmentApi], '0': [] });
    expect(groups['case']).toHaveLength(1);
    expect(groups['0']).toHaveLength(0);
  });

  it('handles undefined input', () => {
    expect(mapAttachmentGroups(undefined)).toEqual({});
  });
});

describe('mapTestSessionResult()', () => {
  const stubResultApi: TestSessionResultApiResource = {
    id: 1,
    test_session_id: 5,
    test_scenario: stubScenario,
    test_case: stubCase,
    result: 'pass',
    step_results: [stubStepResultApi],
    notes: 'All good',
    defect_ref: null,
    executed_at: '2026-07-01T12:00:00Z',
    attachments: { case: [stubAttachmentApi] },
  };

  it('maps all fields correctly', () => {
    const r = mapTestSessionResult(stubResultApi);
    expect(r.id).toBe(1);
    expect(r.testSessionId).toBe(5);
    expect(r.testScenario.ref).toBe('TS-001');
    expect(r.testCase?.ref).toBe('TC-001');
    expect(r.result).toBe('pass');
    expect(r.stepResults).toHaveLength(1);
    expect(r.notes).toBe('All good');
    expect(r.attachments['case']).toHaveLength(1);
  });

  it('handles a null test case and step results', () => {
    const r = mapTestSessionResult({ ...stubResultApi, test_case: null, step_results: null, attachments: undefined });
    expect(r.testCase).toBeNull();
    expect(r.stepResults).toBeNull();
    expect(r.attachments).toEqual({});
  });
});
