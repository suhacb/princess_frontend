import { mapTestSession, mapTestSessionReport, TestSessionApiResource, TestSessionReportApiResource } from './test-session.contracts';

const stubApi: TestSessionApiResource = {
  id: 1,
  project_id: 5,
  test_session_plan_id: 2,
  ref: 'TSE-001',
  title: 'Sprint 4 supplier session',
  session_date: '2026-07-10',
  tester: { id: 3, name: 'Carol', email: null, job_title: null, organization: null },
  team_type: 'supplier',
  environment: 'staging',
  status: 'planned',
  notes: null,
  results: [],
  created_by: null,
  updated_by: null,
  created_at: '2026-07-01T10:00:00Z',
  updated_at: '2026-07-01T10:00:00Z',
};

describe('mapTestSession()', () => {
  it('maps all fields correctly', () => {
    const s = mapTestSession(stubApi);
    expect(s.id).toBe(1);
    expect(s.projectId).toBe(5);
    expect(s.testSessionPlanId).toBe(2);
    expect(s.ref).toBe('TSE-001');
    expect(s.title).toBe('Sprint 4 supplier session');
    expect(s.sessionDate).toBe('2026-07-10');
    expect(s.tester.name).toBe('Carol');
    expect(s.teamType).toBe('supplier');
    expect(s.environment).toBe('staging');
    expect(s.status).toBe('planned');
    expect(s.results).toEqual([]);
  });

  it('handles a null test session plan id', () => {
    const s = mapTestSession({ ...stubApi, test_session_plan_id: null });
    expect(s.testSessionPlanId).toBeNull();
  });
});

describe('mapTestSessionReport()', () => {
  const stubReportApi: TestSessionReportApiResource = {
    ref: 'TSE-001',
    title: 'Sprint 4 supplier session',
    session_date: '2026-07-10',
    team_type: 'supplier',
    environment: 'staging',
    status: 'completed',
    notes: null,
    summary: { pass: 3, fail: 1, blocked: 0, not_run: 0, skipped: 0 },
    results: [
      {
        scenario_ref: 'TS-001',
        scenario_title: 'User can authenticate',
        result: 'pass',
        notes: null,
        defect_ref: null,
        executed_at: '2026-07-10T10:00:00Z',
      },
    ],
  };

  it('maps summary and result lines', () => {
    const report = mapTestSessionReport(stubReportApi);
    expect(report.summary.pass).toBe(3);
    expect(report.results).toHaveLength(1);
    expect(report.results[0].scenarioRef).toBe('TS-001');
    expect(report.results[0].scenarioTitle).toBe('User can authenticate');
  });
});
