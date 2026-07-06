import { mapRequirement, mapRequirementVersion, RequirementApiResource, RequirementVersionApiResource } from './requirement.contracts';

const stubApi: RequirementApiResource = {
  id: 1,
  project_id: 5,
  type: 'user_story',
  parent_id: 3,
  ref: 'US-001',
  title: 'Login as a customer',
  description: 'Full description',
  role: 'customer',
  action: 'log in with SSO',
  benefit: 'I can access my account securely',
  priority: 'must',
  status: 'draft',
  source: 'Stakeholder workshop',
  owner: { id: 10, name: 'Alice', email: 'alice@example.com', job_title: 'PM', organization: 'Acme' },
  version: 1,
  approved_by: null,
  approved_at: null,
  children: [],
  created_by: { id: 11, name: 'Bob', email: null, job_title: null, organization: null },
  updated_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('mapRequirement()', () => {
  it('maps all fields correctly', () => {
    const r = mapRequirement(stubApi);
    expect(r.id).toBe(1);
    expect(r.projectId).toBe(5);
    expect(r.type).toBe('user_story');
    expect(r.parentId).toBe(3);
    expect(r.ref).toBe('US-001');
    expect(r.role).toBe('customer');
    expect(r.action).toBe('log in with SSO');
    expect(r.benefit).toBe('I can access my account securely');
    expect(r.priority).toBe('must');
    expect(r.status).toBe('draft');
    expect(r.version).toBe(1);
    expect(r.owner?.name).toBe('Alice');
    expect(r.createdBy?.name).toBe('Bob');
  });

  it('handles null owner, approvedBy, updatedBy', () => {
    const r = mapRequirement({ ...stubApi, owner: null, approved_by: null, updated_by: null });
    expect(r.owner).toBeNull();
    expect(r.approvedBy).toBeNull();
    expect(r.updatedBy).toBeNull();
  });

  it('recursively maps children', () => {
    const child: RequirementApiResource = { ...stubApi, id: 2, ref: 'US-002', children: [] };
    const r = mapRequirement({ ...stubApi, children: [child] });
    expect(r.children).toHaveLength(1);
    expect(r.children[0].id).toBe(2);
    expect(r.children[0].ref).toBe('US-002');
  });

  it('defaults children to an empty array when absent', () => {
    const { children, ...withoutChildren } = stubApi;
    const r = mapRequirement(withoutChildren as RequirementApiResource);
    expect(r.children).toEqual([]);
  });
});

describe('mapRequirementVersion()', () => {
  const stubVersionApi: RequirementVersionApiResource = {
    id: 1,
    requirement_id: 1,
    version_number: 2,
    title: 'Login as a customer',
    description: 'Full description',
    type: 'user_story',
    priority: 'must',
    status: 'reviewed',
    role: 'customer',
    action: 'log in with SSO',
    benefit: 'I can access my account securely',
    owner: { id: 10, name: 'Alice', email: null, job_title: null, organization: null },
    created_by: { id: 11, name: 'Bob', email: null, job_title: null, organization: null },
    created_at: '2026-06-02T10:00:00Z',
  };

  it('maps all fields correctly', () => {
    const v = mapRequirementVersion(stubVersionApi);
    expect(v.id).toBe(1);
    expect(v.requirementId).toBe(1);
    expect(v.versionNumber).toBe(2);
    expect(v.title).toBe('Login as a customer');
    expect(v.status).toBe('reviewed');
    expect(v.priority).toBe('must');
    expect(v.owner?.name).toBe('Alice');
    expect(v.createdBy?.name).toBe('Bob');
  });

  it('handles null owner and createdBy', () => {
    const v = mapRequirementVersion({ ...stubVersionApi, owner: null, created_by: null });
    expect(v.owner).toBeNull();
    expect(v.createdBy).toBeNull();
  });
});
