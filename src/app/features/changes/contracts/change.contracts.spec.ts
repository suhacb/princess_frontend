import { mapChange, canDecide, ChangeApiResource } from './change.contracts';

const stubApi: ChangeApiResource = {
  id: 1,
  project_id: 5,
  issue_id: null,
  request_type: 'rfc',
  title: 'Add new field',
  description: 'Needs a description field',
  impact_assessment: 'Low impact',
  priority: 'high',
  status: 'proposed',
  raised_at: '2026-06-01T10:00:00Z',
  decision_at: null,
  decision_rationale: null,
  implementation_due: '2026-07-01',
  implemented_at: null,
  raised_by: { id: 10, name: 'Alice' },
  decision_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('mapChange()', () => {
  it('maps all fields correctly', () => {
    const c = mapChange(stubApi);
    expect(c.id).toBe(1);
    expect(c.projectId).toBe(5);
    expect(c.issueId).toBeNull();
    expect(c.requestType).toBe('rfc');
    expect(c.title).toBe('Add new field');
    expect(c.impactAssessment).toBe('Low impact');
    expect(c.priority).toBe('high');
    expect(c.status).toBe('proposed');
    expect(c.implementationDue).toBe('2026-07-01');
    expect(c.implementedAt).toBeNull();
    expect(c.raisedBy?.name).toBe('Alice');
    expect(c.decisionBy).toBeNull();
  });

  it('maps decision fields when approved', () => {
    const c = mapChange({
      ...stubApi,
      status: 'approved',
      decision_at: '2026-06-10T10:00:00Z',
      decision_rationale: 'Looks good',
      decision_by: { id: 20, name: 'Bob' },
    });
    expect(c.status).toBe('approved');
    expect(c.decisionRationale).toBe('Looks good');
    expect(c.decisionBy?.name).toBe('Bob');
  });

  it('handles null nullable fields', () => {
    const c = mapChange({
      ...stubApi,
      description: null,
      impact_assessment: null,
      priority: null,
    });
    expect(c.description).toBeNull();
    expect(c.impactAssessment).toBeNull();
    expect(c.priority).toBeNull();
  });
});

describe('canDecide()', () => {
  it('returns true for proposed', () => expect(canDecide('proposed')).toBe(true));
  it('returns true for assessed', () => expect(canDecide('assessed')).toBe(true));
  it('returns false for approved', () => expect(canDecide('approved')).toBe(false));
  it('returns false for rejected', () => expect(canDecide('rejected')).toBe(false));
  it('returns false for implemented', () => expect(canDecide('implemented')).toBe(false));
});
