import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { IssueService } from './issue.service';
import { ApiService } from '../../../core/http/api.service';
import { IssueApiResource } from '../contracts/issue.contracts';

const stubApi: IssueApiResource = {
  id: 1, project_id: 5, stage_id: null,
  issue_type: 'problem', title: 'Login fails', description: null,
  priority: 'high', status: 'open',
  raised_at: '2026-06-09T10:00:00Z', escalated_at: null, escalation_reason: null,
  resolved_at: null, resolution: null,
  raised_by: { id: 10, name: 'Alice' }, assigned_to: null,
  created_at: '2026-06-09T10:00:00Z', updated_at: '2026-06-09T10:00:00Z',
};

const escalatedApi: IssueApiResource = { ...stubApi, status: 'escalated', escalation_reason: 'Critical path' };
const closedApi: IssueApiResource = { ...stubApi, status: 'closed', resolution: 'Fixed' };

function setup(overrides: Partial<Record<'get' | 'post' | 'patch' | 'delete', unknown>> = {}) {
  const apiService = {
    get: vi.fn().mockReturnValue(of({ data: [stubApi] })),
    post: vi.fn().mockReturnValue(of({ data: stubApi })),
    patch: vi.fn().mockReturnValue(of({ data: { ...stubApi, title: 'Updated' } })),
    delete: vi.fn().mockReturnValue(of(undefined)),
    ...overrides,
  };
  TestBed.configureTestingModule({ providers: [IssueService, { provide: ApiService, useValue: apiService }] });
  return { service: TestBed.inject(IssueService), apiService };
}

describe('IssueService', () => {
  afterEach(() => TestBed.resetTestingModule());

  describe('list()', () => {
    it('sets issues signal', () => {
      const { service } = setup();
      service.list(5).subscribe();
      expect(service.issues().length).toBe(1);
      expect(service.issues()[0].title).toBe('Login fails');
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.list(5).subscribe();
      expect(apiService.get).toHaveBeenCalledWith('/projects/5/issues');
    });

    it('resets loading on error', () => {
      const { service } = setup({ get: vi.fn().mockReturnValue(throwError(() => new Error())) });
      service.list(5).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets selectedIssue', () => {
      const { service } = setup({ get: vi.fn().mockReturnValue(of({ data: stubApi })) });
      service.load(5, 1).subscribe();
      expect(service.selectedIssue()?.id).toBe(1);
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup({ get: vi.fn().mockReturnValue(of({ data: stubApi })) });
      service.load(5, 1).subscribe();
      expect(apiService.get).toHaveBeenCalledWith('/projects/5/issues/1');
    });

    it('resets loading on error', () => {
      const { service } = setup({ get: vi.fn().mockReturnValue(throwError(() => new Error())) });
      service.load(5, 1).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('prepends new issue to list', () => {
      const { service } = setup({ post: vi.fn().mockReturnValue(of({ data: { ...stubApi, id: 2 } })) });
      service.list(5).subscribe();
      service.create(5, { issue_type: 'problem', title: 'New', priority: 'low' }).subscribe();
      expect(service.issues().length).toBe(2);
      expect(service.issues()[0].id).toBe(2);
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.create(5, { issue_type: 'problem', title: 'New', priority: 'low' }).subscribe();
      expect(apiService.post).toHaveBeenCalledWith('/projects/5/issues', expect.any(Object));
    });
  });

  describe('update()', () => {
    it('updates issue in list', () => {
      const { service } = setup();
      service.list(5).subscribe();
      service.update(5, 1, { title: 'Updated' }).subscribe();
      expect(service.issues()[0].title).toBe('Updated');
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.update(5, 1, { title: 'Updated' }).subscribe();
      expect(apiService.patch).toHaveBeenCalledWith('/projects/5/issues/1', expect.any(Object));
    });
  });

  describe('escalate()', () => {
    it('updates issue status to escalated', () => {
      const { service } = setup({ post: vi.fn().mockReturnValue(of({ data: escalatedApi })) });
      service.list(5).subscribe();
      service.escalate(5, 1, { escalation_reason: 'Critical path' }).subscribe();
      expect(service.issues()[0].status).toBe('escalated');
      expect(service.issues()[0].escalationReason).toBe('Critical path');
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup({ post: vi.fn().mockReturnValue(of({ data: escalatedApi })) });
      service.escalate(5, 1, { escalation_reason: 'Critical path' }).subscribe();
      expect(apiService.post).toHaveBeenCalledWith('/projects/5/issues/1/escalate', expect.any(Object));
    });
  });

  describe('resolve()', () => {
    it('updates issue status to closed', () => {
      const { service } = setup({ post: vi.fn().mockReturnValue(of({ data: closedApi })) });
      service.list(5).subscribe();
      service.resolve(5, 1, { resolution: 'Fixed' }).subscribe();
      expect(service.issues()[0].status).toBe('closed');
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup({ post: vi.fn().mockReturnValue(of({ data: closedApi })) });
      service.resolve(5, 1, { resolution: 'Fixed' }).subscribe();
      expect(apiService.post).toHaveBeenCalledWith('/projects/5/issues/1/resolve', expect.any(Object));
    });
  });

  describe('remove()', () => {
    it('removes issue from list', () => {
      const { service } = setup();
      service.list(5).subscribe();
      service.remove(5, 1).subscribe();
      expect(service.issues().length).toBe(0);
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.remove(5, 1).subscribe();
      expect(apiService.delete).toHaveBeenCalledWith('/projects/5/issues/1');
    });
  });
});
