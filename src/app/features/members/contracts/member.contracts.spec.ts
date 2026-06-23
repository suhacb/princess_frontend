import { mapMember, mapPerson, MemberApiResource, PersonApiResource } from './member.contracts';

const stubPerson: PersonApiResource = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane@example.com',
  job_title: 'PM',
  organization: 'Acme',
};

const stubMemberApi: MemberApiResource = {
  id: 42,
  person: stubPerson,
  role: 'project_manager',
  side: 'customer',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
};

describe('mapPerson', () => {
  it('maps snake_case fields to camelCase', () => {
    const p = mapPerson(stubPerson);
    expect(p.id).toBe(1);
    expect(p.name).toBe('Jane Doe');
    expect(p.email).toBe('jane@example.com');
    expect(p.jobTitle).toBe('PM');
    expect(p.organization).toBe('Acme');
  });

  it('passes through null fields', () => {
    const p = mapPerson({ ...stubPerson, job_title: null, organization: null });
    expect(p.jobTitle).toBeNull();
    expect(p.organization).toBeNull();
  });
});

describe('mapMember', () => {
  it('maps all fields correctly', () => {
    const m = mapMember(stubMemberApi);
    expect(m.id).toBe(42);
    expect(m.role).toBe('project_manager');
    expect(m.side).toBe('customer');
    expect(m.createdAt).toBe('2026-01-01T00:00:00Z');
    expect(m.person.name).toBe('Jane Doe');
  });

  it('maps null side', () => {
    const m = mapMember({ ...stubMemberApi, side: null });
    expect(m.side).toBeNull();
  });
});
