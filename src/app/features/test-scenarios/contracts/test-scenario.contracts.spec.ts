import { mapTestScenario, TestScenarioApiResource } from './test-scenario.contracts';
import { TestCaseApiResource } from './test-case.contracts';

const stubApiCase: TestCaseApiResource = {
  id: 1,
  test_scenario_id: 5,
  project_id: 2,
  ref: 'TC-001',
  title: 'Log in with valid credentials',
  steps: ['Open login page'],
  expected_result: 'User is redirected to the dashboard',
  priority: 'high',
  type: 'positive',
  created_by: null,
  updated_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

const stubApi: TestScenarioApiResource = {
  id: 5,
  project_id: 2,
  ref: 'TS-001',
  title: 'User can authenticate',
  description: 'Covers the login flow end to end',
  preconditions: 'A registered user account exists',
  type: 'feature',
  status: 'draft',
  is_testable: true,
  testable_notes: null,
  test_cases: [stubApiCase],
  acceptance_criteria: [{ id: 9, ref: 'AC-001', title: 'Valid login redirects to dashboard' }],
  created_by: { id: 10, name: 'Alice', email: null, job_title: null, organization: null },
  updated_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('mapTestScenario()', () => {
  it('maps all fields correctly', () => {
    const s = mapTestScenario(stubApi);
    expect(s.id).toBe(5);
    expect(s.projectId).toBe(2);
    expect(s.ref).toBe('TS-001');
    expect(s.title).toBe('User can authenticate');
    expect(s.description).toBe('Covers the login flow end to end');
    expect(s.preconditions).toBe('A registered user account exists');
    expect(s.type).toBe('feature');
    expect(s.status).toBe('draft');
    expect(s.isTestable).toBe(true);
    expect(s.testCases).toHaveLength(1);
    expect(s.testCases[0].ref).toBe('TC-001');
    expect(s.acceptanceCriteria).toEqual([{ id: 9, ref: 'AC-001', title: 'Valid login redirects to dashboard' }]);
    expect(s.createdBy?.name).toBe('Alice');
  });

  it('defaults testCases and acceptanceCriteria to empty arrays when absent', () => {
    const s = mapTestScenario({ ...stubApi, test_cases: undefined, acceptance_criteria: undefined });
    expect(s.testCases).toEqual([]);
    expect(s.acceptanceCriteria).toEqual([]);
  });
});
