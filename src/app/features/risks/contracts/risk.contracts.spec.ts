import { mapRisk, riskScoreClass, RiskApiResource } from './risk.contracts';

const stubApi: RiskApiResource = {
  id: 1,
  project_id: 5,
  stage_id: null,
  title: 'Server outage',
  description: 'Risk of outage',
  category: 'Technical',
  probability: 3,
  impact: 4,
  risk_score: 12,
  proximity: 'near',
  response_type: 'reduce',
  response_action: 'Add redundancy',
  residual_probability: 1,
  residual_impact: 2,
  residual_risk_score: 2,
  status: 'open',
  raised_at: '2026-06-01T10:00:00Z',
  owner: { id: 10, name: 'Alice' },
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('mapRisk()', () => {
  it('maps all fields correctly', () => {
    const r = mapRisk(stubApi);
    expect(r.id).toBe(1);
    expect(r.projectId).toBe(5);
    expect(r.stageId).toBeNull();
    expect(r.title).toBe('Server outage');
    expect(r.riskScore).toBe(12);
    expect(r.proximity).toBe('near');
    expect(r.responseType).toBe('reduce');
    expect(r.responseAction).toBe('Add redundancy');
    expect(r.residualProbability).toBe(1);
    expect(r.residualRiskScore).toBe(2);
    expect(r.status).toBe('open');
    expect(r.owner?.name).toBe('Alice');
  });

  it('handles null owner', () => {
    const r = mapRisk({ ...stubApi, owner: null });
    expect(r.owner).toBeNull();
  });

  it('handles null residual fields', () => {
    const r = mapRisk({ ...stubApi, residual_probability: null, residual_impact: null, residual_risk_score: null });
    expect(r.residualProbability).toBeNull();
    expect(r.residualRiskScore).toBeNull();
  });
});

describe('riskScoreClass()', () => {
  it('returns low for score 1-4', () => {
    expect(riskScoreClass(1)).toBe('low');
    expect(riskScoreClass(4)).toBe('low');
  });

  it('returns medium for score 5-9', () => {
    expect(riskScoreClass(5)).toBe('medium');
    expect(riskScoreClass(9)).toBe('medium');
  });

  it('returns high for score 10-15', () => {
    expect(riskScoreClass(10)).toBe('high');
    expect(riskScoreClass(15)).toBe('high');
  });

  it('returns critical for score 16-25', () => {
    expect(riskScoreClass(16)).toBe('critical');
    expect(riskScoreClass(25)).toBe('critical');
  });
});
