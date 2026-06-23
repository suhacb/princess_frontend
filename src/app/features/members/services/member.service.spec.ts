import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MemberService } from './member.service';
import { ApiService } from '../../../core/http/api.service';
import { Member, MemberApiResource } from '../contracts/member.contracts';

const stubApi: MemberApiResource = {
  id: 1,
  person: { id: 10, name: 'Alice', email: 'alice@example.com', job_title: null, organization: null },
  role: 'project_manager',
  side: 'customer',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

function setup(overrides: Partial<Record<'get' | 'patch' | 'delete', unknown>> = {}) {
  const apiService = {
    get: vi.fn().mockReturnValue(of({ data: [stubApi] })),
    patch: vi.fn().mockReturnValue(of({ data: { ...stubApi, role: 'senior_user' } })),
    delete: vi.fn().mockReturnValue(of(undefined)),
    ...overrides,
  };
  TestBed.configureTestingModule({ providers: [MemberService, { provide: ApiService, useValue: apiService }] });
  return { service: TestBed.inject(MemberService), apiService };
}

describe('MemberService', () => {
  afterEach(() => TestBed.resetTestingModule());

  describe('list()', () => {
    it('sets members signal after load', () => {
      const { service } = setup();
      service.list(5).subscribe();
      expect(service.members().length).toBe(1);
      expect(service.members()[0].person.name).toBe('Alice');
    });

    it('resets loading on error', () => {
      const { service } = setup({ get: vi.fn().mockReturnValue(throwError(() => new Error())) });
      service.list(5).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('update()', () => {
    it('updates member in signal', () => {
      const { service } = setup();
      service.list(5).subscribe();
      service.update(5, 1, { role: 'senior_user' }).subscribe();
      expect(service.members()[0].role).toBe('senior_user');
    });
  });

  describe('remove()', () => {
    it('removes member from signal', () => {
      const { service } = setup();
      service.list(5).subscribe();
      service.remove(5, 1).subscribe();
      expect(service.members().length).toBe(0);
    });
  });
});
