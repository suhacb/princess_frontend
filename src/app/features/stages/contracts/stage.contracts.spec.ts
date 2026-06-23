import { availableTransitions, mapStage, StageApiResource } from './stage.contracts';

const stubApi: StageApiResource = {
  id: 1,
  project_id: 10,
  name: 'Initiation Stage',
  type: 'initiation',
  status: 'planned',
  planned_start_date: '2026-01-01',
  planned_end_date: '2026-02-01',
  actual_start_date: null,
  actual_end_date: null,
  tolerances: {
    time: { min: -5, max: 10 },
    cost: { min: -500, max: 1000 },
    scope: 'Minor scope only',
    risk: 'Low',
    quality: null,
    benefit: null,
  },
  tolerance_status: {
    time: 'within',
    cost: null,
    scope: null,
    risk: null,
    quality: null,
    benefit: null,
  },
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('mapStage', () => {
  it('maps snake_case API fields to camelCase', () => {
    const stage = mapStage(stubApi);
    expect(stage.id).toBe(1);
    expect(stage.projectId).toBe(10);
    expect(stage.name).toBe('Initiation Stage');
    expect(stage.plannedStartDate).toBe('2026-01-01');
    expect(stage.plannedEndDate).toBe('2026-02-01');
    expect(stage.actualStartDate).toBeNull();
    expect(stage.toleranceStatus.time).toBe('within');
    expect(stage.createdAt).toBe('2026-01-01T00:00:00Z');
  });

  it('preserves tolerances object', () => {
    const stage = mapStage(stubApi);
    expect(stage.tolerances.time.min).toBe(-5);
    expect(stage.tolerances.scope).toBe('Minor scope only');
  });
});

describe('availableTransitions', () => {
  it('returns [start] for planned', () => {
    expect(availableTransitions('planned')).toEqual(['start']);
  });

  it('returns [complete, exception] for active', () => {
    expect(availableTransitions('active')).toEqual(['complete', 'exception']);
  });

  it('returns [] for completed', () => {
    expect(availableTransitions('completed')).toEqual([]);
  });

  it('returns [] for exception', () => {
    expect(availableTransitions('exception')).toEqual([]);
  });
});
