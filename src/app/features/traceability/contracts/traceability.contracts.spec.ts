import {
  mapTraceabilityMatrix,
  TraceabilityMatrixApiResource,
  TraceabilityClassicRequirementApiResource,
  TraceabilityEpicRequirementApiResource,
} from './traceability.contracts';

const stubScenario = {
  id: 1,
  ref: 'TS-001',
  title: 'User can log in',
  type: 'feature' as const,
  is_testable: true,
  latest_supplier_result: 'pass' as const,
  latest_client_result: null,
  test_cases: [{ id: 1, title: 'Valid login', priority: 'high' as const, type: 'positive' as const }],
};

const stubAc = {
  id: 1,
  ref: 'AC-001',
  description: 'User is redirected to dashboard',
  supplier_passed: true,
  client_passed: false,
  accepted_at: null,
  test_scenarios: [stubScenario],
};

const stubClassic: TraceabilityClassicRequirementApiResource = {
  id: 1,
  ref: 'REQ-001',
  type: 'classic',
  title: 'Users can authenticate',
  priority: 'must',
  status: 'approved',
  derived_status: 'partial',
  acceptance_criteria: [stubAc],
};

const stubEpic: TraceabilityEpicRequirementApiResource = {
  id: 2,
  ref: 'REQ-002',
  type: 'epic',
  title: 'Account management',
  priority: 'should',
  status: 'draft',
  derived_status: 'not_tested',
  user_stories: [
    {
      id: 3,
      ref: 'REQ-003',
      title: 'As a user I can reset my password',
      role: 'user',
      status: 'draft',
      acceptance_criteria: [stubAc],
      derived_status: 'not_tested',
    },
  ],
};

describe('mapTraceabilityMatrix()', () => {
  it('maps classic requirements with acceptance criteria', () => {
    const api: TraceabilityMatrixApiResource = {
      data: [stubClassic],
      stats: {
        acs_total: 1,
        acs_with_test: 1,
        acs_with_test_pct: 100,
        test_cases_total: 1,
        test_cases_passed: 1,
        test_cases_passed_pct: 100,
      },
    };
    const matrix = mapTraceabilityMatrix(api);
    expect(matrix.requirements).toHaveLength(1);
    const req = matrix.requirements[0];
    expect(req.type).toBe('classic');
    if (req.type === 'classic') {
      expect(req.acceptanceCriteria[0].ref).toBe('AC-001');
      expect(req.acceptanceCriteria[0].testScenarios[0].testCases[0].title).toBe('Valid login');
      expect(req.acceptanceCriteria[0].testScenarios[0].latestSupplierResult).toBe('pass');
    }
    expect(matrix.stats.acsWithTestPct).toBe(100);
    expect(matrix.stats.testCasesPassed).toBe(1);
  });

  it('maps epic requirements with nested user stories', () => {
    const api: TraceabilityMatrixApiResource = {
      data: [stubEpic],
      stats: {
        acs_total: 1,
        acs_with_test: 0,
        acs_with_test_pct: 0,
        test_cases_total: 0,
        test_cases_passed: 0,
        test_cases_passed_pct: 0,
      },
    };
    const matrix = mapTraceabilityMatrix(api);
    const req = matrix.requirements[0];
    expect(req.type).toBe('epic');
    if (req.type === 'epic') {
      expect(req.userStories).toHaveLength(1);
      expect(req.userStories[0].role).toBe('user');
      expect(req.userStories[0].acceptanceCriteria[0].ref).toBe('AC-001');
    }
  });
});
