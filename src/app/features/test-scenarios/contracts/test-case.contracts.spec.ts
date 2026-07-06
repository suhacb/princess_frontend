import { mapTestCase, TestCaseApiResource } from './test-case.contracts';

const stubApi: TestCaseApiResource = {
  id: 1,
  test_scenario_id: 5,
  project_id: 2,
  ref: 'TC-001',
  title: 'Log in with valid credentials',
  steps: ['Open login page', 'Enter valid credentials', 'Submit form'],
  expected_result: 'User is redirected to the dashboard',
  priority: 'high',
  type: 'positive',
  created_by: { id: 10, name: 'Alice', email: null, job_title: null, organization: null },
  updated_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('mapTestCase()', () => {
  it('maps all fields correctly', () => {
    const c = mapTestCase(stubApi);
    expect(c.id).toBe(1);
    expect(c.testScenarioId).toBe(5);
    expect(c.projectId).toBe(2);
    expect(c.ref).toBe('TC-001');
    expect(c.title).toBe('Log in with valid credentials');
    expect(c.steps).toEqual(['Open login page', 'Enter valid credentials', 'Submit form']);
    expect(c.expectedResult).toBe('User is redirected to the dashboard');
    expect(c.priority).toBe('high');
    expect(c.type).toBe('positive');
    expect(c.createdBy?.name).toBe('Alice');
    expect(c.updatedBy).toBeNull();
  });

  it('handles null priority/type', () => {
    const c = mapTestCase({ ...stubApi, priority: null, type: null });
    expect(c.priority).toBeNull();
    expect(c.type).toBeNull();
  });
});
