import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RequirementService } from './requirement.service';
import { ApiService } from '../../../core/http/api.service';
import { RequirementApiResource } from '../contracts/requirement.contracts';

const stubApiRequirement: RequirementApiResource = {
  id: 1,
  project_id: 5,
  type: 'classic',
  parent_id: null,
  ref: 'REQ-001',
  title: 'System must support SSO',
  description: null,
  role: null,
  action: null,
  benefit: null,
  priority: 'must',
  status: 'draft',
  source: null,
  owner: { id: 10, name: 'Alice', email: null, job_title: null, organization: null },
  version: 1,
  approved_by: null,
  approved_at: null,
  created_by: null,
  updated_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('RequirementService', () => {
  let service: RequirementService;
  let apiMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiMock = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [RequirementService, { provide: ApiService, useValue: apiMock }],
    });
    service = TestBed.inject(RequirementService);
  });

  describe('list()', () => {
    it('sets requirements and clears loading on success', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiRequirement] }));
      service.list(5).subscribe();
      expect(service.requirements()).toHaveLength(1);
      expect(service.requirements()[0].ref).toBe('REQ-001');
      expect(service.loading()).toBe(false);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.list(5).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets selectedRequirement and clears loading', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiRequirement }));
      service.load(5, 1).subscribe();
      expect(service.selectedRequirement()?.id).toBe(1);
      expect(service.loading()).toBe(false);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.load(5, 1).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('prepends new requirement to list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiRequirement] }));
      service.list(5).subscribe();
      const created: RequirementApiResource = { ...stubApiRequirement, id: 2, title: 'New requirement' };
      apiMock.post.mockReturnValue(of({ data: created }));
      service.create(5, { type: 'classic', title: 'New requirement', priority: 'should' }).subscribe();
      expect(service.requirements()[0].id).toBe(2);
      expect(service.requirements()).toHaveLength(2);
    });
  });

  describe('update()', () => {
    it('updates requirement in list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiRequirement] }));
      service.list(5).subscribe();
      const updated: RequirementApiResource = { ...stubApiRequirement, title: 'Updated', version: 2 };
      apiMock.patch.mockReturnValue(of({ data: updated }));
      service.update(5, 1, { title: 'Updated' }).subscribe();
      expect(service.requirements()[0].title).toBe('Updated');
      expect(service.requirements()[0].version).toBe(2);
    });

    it('propagates to selectedRequirement when it matches', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiRequirement }));
      service.load(5, 1).subscribe();
      const updated: RequirementApiResource = { ...stubApiRequirement, title: 'Updated' };
      apiMock.patch.mockReturnValue(of({ data: updated }));
      service.update(5, 1, { title: 'Updated' }).subscribe();
      expect(service.selectedRequirement()?.title).toBe('Updated');
    });
  });

  describe('remove()', () => {
    it('removes requirement from list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApiRequirement] }));
      service.list(5).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.requirements()).toHaveLength(0);
    });

    it('clears selectedRequirement if it was the deleted one', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiRequirement }));
      service.load(5, 1).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.selectedRequirement()).toBeNull();
    });
  });

  describe('workflow transitions', () => {
    it('review() updates status in list and selection', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiRequirement }));
      service.load(5, 1).subscribe();
      const reviewed: RequirementApiResource = { ...stubApiRequirement, status: 'reviewed' };
      apiMock.post.mockReturnValue(of({ data: reviewed }));
      service.review(5, 1).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/requirements/1/review', {});
      expect(service.selectedRequirement()?.status).toBe('reviewed');
    });

    it('approve() calls the approve endpoint', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiRequirement }));
      service.load(5, 1).subscribe();
      const approved: RequirementApiResource = { ...stubApiRequirement, status: 'approved' };
      apiMock.post.mockReturnValue(of({ data: approved }));
      service.approve(5, 1).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/requirements/1/approve', {});
      expect(service.selectedRequirement()?.status).toBe('approved');
    });

    it('reject() calls the reject endpoint', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiRequirement }));
      service.load(5, 1).subscribe();
      const rejected: RequirementApiResource = { ...stubApiRequirement, status: 'rejected' };
      apiMock.post.mockReturnValue(of({ data: rejected }));
      service.reject(5, 1).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/requirements/1/reject', {});
      expect(service.selectedRequirement()?.status).toBe('rejected');
    });

    it('defer() calls the defer endpoint', () => {
      apiMock.get.mockReturnValue(of({ data: stubApiRequirement }));
      service.load(5, 1).subscribe();
      const deferred: RequirementApiResource = { ...stubApiRequirement, status: 'deferred' };
      apiMock.post.mockReturnValue(of({ data: deferred }));
      service.defer(5, 1).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/projects/5/requirements/1/defer', {});
      expect(service.selectedRequirement()?.status).toBe('deferred');
    });
  });
});
