import {
  mapAcceptanceCriterion,
  mapAcceptanceCriterionVersion,
  AcceptanceCriterionApiResource,
  AcceptanceCriterionVersionApiResource,
} from './acceptance-criterion.contracts';

const stubApi: AcceptanceCriterionApiResource = {
  id: 1,
  project_id: 5,
  requirement_id: 3,
  ref: 'AC-001',
  title: 'Login succeeds with valid SSO token',
  description: 'Full description',
  measurement_method: 'Manual test',
  acceptance_threshold: 'Under 2s response',
  verifier: { id: 10, name: 'Alice', email: null, job_title: null, organization: null },
  verification_method: 'test',
  status: 'draft',
  version: 1,
  approved_by: null,
  approved_at: null,
  supplier_passed: true,
  supplier_passed_at: '2026-06-01T10:00:00Z',
  supplier_decision: 'pending',
  supplier_decided_by: null,
  supplier_decided_at: null,
  supplier_decision_note: null,
  client_passed: false,
  client_passed_at: '2026-06-01T10:00:00Z',
  client_decision: 'pending',
  client_decided_by: null,
  client_decided_at: null,
  client_decision_note: null,
  accepted_at: null,
  requirement: { id: 3, ref: 'REQ-001', title: 'System must support SSO', type: 'classic' },
  created_by: { id: 11, name: 'Bob', email: null, job_title: null, organization: null },
  updated_by: null,
  created_at: '2026-06-01T09:00:00Z',
  updated_at: '2026-06-01T09:00:00Z',
};

describe('mapAcceptanceCriterion()', () => {
  it('maps all fields correctly', () => {
    const ac = mapAcceptanceCriterion(stubApi);
    expect(ac.id).toBe(1);
    expect(ac.projectId).toBe(5);
    expect(ac.requirementId).toBe(3);
    expect(ac.ref).toBe('AC-001');
    expect(ac.title).toBe('Login succeeds with valid SSO token');
    expect(ac.verifier?.name).toBe('Alice');
    expect(ac.verificationMethod).toBe('test');
    expect(ac.status).toBe('draft');
    expect(ac.supplierPassed).toBe(true);
    expect(ac.clientPassed).toBe(false);
    expect(ac.supplierDecision).toBe('pending');
    expect(ac.requirement?.ref).toBe('REQ-001');
    expect(ac.createdAt).toBe('2026-06-01T09:00:00Z');
  });

  it('handles null verifier, approvedBy, and decision-by fields', () => {
    const ac = mapAcceptanceCriterion({
      ...stubApi,
      verifier: null,
      approved_by: null,
      supplier_decided_by: null,
      client_decided_by: null,
    });
    expect(ac.verifier).toBeNull();
    expect(ac.approvedBy).toBeNull();
    expect(ac.supplierDecidedBy).toBeNull();
    expect(ac.clientDecidedBy).toBeNull();
  });

  it('handles a missing nested requirement', () => {
    const { requirement, ...withoutRequirement } = stubApi;
    const ac = mapAcceptanceCriterion(withoutRequirement as AcceptanceCriterionApiResource);
    expect(ac.requirement).toBeNull();
  });
});

describe('mapAcceptanceCriterionVersion()', () => {
  const stubVersionApi: AcceptanceCriterionVersionApiResource = {
    id: 1,
    acceptance_criterion_id: 1,
    version_number: 2,
    title: 'Login succeeds with valid SSO token',
    description: 'Full description',
    verifier: { id: 10, name: 'Alice', email: null, job_title: null, organization: null },
    verification_method: 'test',
    status: 'approved',
    supplier_passed: true,
    client_passed: true,
    supplier_decision: 'accepted',
    supplier_decision_note: null,
    client_decision: 'rejected',
    client_decision_note: 'Client flagged a UX issue despite the test passing',
    created_by: { id: 11, name: 'Bob', email: null, job_title: null, organization: null },
    created_at: '2026-06-02T10:00:00Z',
  };

  it('maps all fields correctly', () => {
    const v = mapAcceptanceCriterionVersion(stubVersionApi);
    expect(v.id).toBe(1);
    expect(v.acceptanceCriterionId).toBe(1);
    expect(v.versionNumber).toBe(2);
    expect(v.status).toBe('approved');
    expect(v.supplierDecision).toBe('accepted');
    expect(v.clientDecision).toBe('rejected');
    expect(v.clientDecisionNote).toBe('Client flagged a UX issue despite the test passing');
    expect(v.createdBy?.name).toBe('Bob');
  });

  it('handles null verifier and createdBy', () => {
    const v = mapAcceptanceCriterionVersion({ ...stubVersionApi, verifier: null, created_by: null });
    expect(v.verifier).toBeNull();
    expect(v.createdBy).toBeNull();
  });
});
