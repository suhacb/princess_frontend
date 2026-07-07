import { mapTestSessionPlan, TestSessionPlanApiResource } from './test-session-plan.contracts';

const stubApi: TestSessionPlanApiResource = {
  id: 1,
  ref: 'TSP-001',
  title: 'Sprint 4 supplier session plan',
  team_type: 'supplier',
  status: 'active',
  planned_date: '2026-07-10',
};

describe('mapTestSessionPlan()', () => {
  it('maps all fields correctly', () => {
    const plan = mapTestSessionPlan(stubApi);
    expect(plan.id).toBe(1);
    expect(plan.ref).toBe('TSP-001');
    expect(plan.title).toBe('Sprint 4 supplier session plan');
    expect(plan.teamType).toBe('supplier');
    expect(plan.status).toBe('active');
    expect(plan.plannedDate).toBe('2026-07-10');
  });

  it('handles a null planned date', () => {
    const plan = mapTestSessionPlan({ ...stubApi, planned_date: null });
    expect(plan.plannedDate).toBeNull();
  });
});
