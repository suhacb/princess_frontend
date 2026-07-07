import { mapTestSessionPlan, TestSessionPlanApiResource } from './test-session-plan.contracts';

const stubApi: TestSessionPlanApiResource = {
  id: 1,
  project_id: 5,
  ref: 'TSP-001',
  title: 'Sprint 4 supplier session plan',
  description: 'Covers the supplier acceptance flows.',
  team_type: 'supplier',
  assignee: { id: 3, name: 'Carol', email: null, job_title: null, organization: null },
  status: 'active',
  planned_date: '2026-07-10',
  scenarios: [],
  created_by: null,
  updated_by: null,
  created_at: '2026-07-01T10:00:00Z',
  updated_at: '2026-07-01T10:00:00Z',
};

describe('mapTestSessionPlan()', () => {
  it('maps all fields correctly', () => {
    const plan = mapTestSessionPlan(stubApi);
    expect(plan.id).toBe(1);
    expect(plan.projectId).toBe(5);
    expect(plan.ref).toBe('TSP-001');
    expect(plan.title).toBe('Sprint 4 supplier session plan');
    expect(plan.description).toBe('Covers the supplier acceptance flows.');
    expect(plan.teamType).toBe('supplier');
    expect(plan.assignee?.name).toBe('Carol');
    expect(plan.status).toBe('active');
    expect(plan.plannedDate).toBe('2026-07-10');
    expect(plan.scenarios).toEqual([]);
  });

  it('handles a null planned date and no assignee', () => {
    const plan = mapTestSessionPlan({ ...stubApi, planned_date: null, assignee: null });
    expect(plan.plannedDate).toBeNull();
    expect(plan.assignee).toBeNull();
  });
});
