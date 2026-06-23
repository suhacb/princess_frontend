import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { BoundaryService } from './boundary.service';
import { ApiService } from '../../../core/http/api.service';
import { StageBoundaryApiResource } from '../contracts/boundary.contracts';

const stubApi: StageBoundaryApiResource = {
  id: 1, stage_id: 3, type: 'end_stage_report', status: 'draft',
  title: 'Q1', notes: null, next_stage_id: null, exception_summary: null,
  submitted_at: null, submitted_by: null, approved_at: null, approved_by: null,
  created_by: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
};

const submittedApi: StageBoundaryApiResource = { ...stubApi, status: 'submitted' };
const approvedApi: StageBoundaryApiResource = { ...stubApi, status: 'approved' };
const rejectedApi: StageBoundaryApiResource = { ...stubApi, status: 'rejected' };

function setup(overrides: Partial<Record<'get' | 'post' | 'patch' | 'delete', unknown>> = {}) {
  const apiService = {
    get: vi.fn().mockReturnValue(of({ data: [stubApi] })),
    post: vi.fn().mockReturnValue(of({ data: stubApi })),
    patch: vi.fn().mockReturnValue(of({ data: submittedApi })),
    delete: vi.fn().mockReturnValue(of(undefined)),
    ...overrides,
  };
  TestBed.configureTestingModule({ providers: [BoundaryService, { provide: ApiService, useValue: apiService }] });
  return { service: TestBed.inject(BoundaryService), apiService };
}

describe('BoundaryService', () => {
  afterEach(() => TestBed.resetTestingModule());

  describe('list()', () => {
    it('sets boundaries signal', () => {
      const { service } = setup();
      service.list(5, 3).subscribe();
      expect(service.boundaries().length).toBe(1);
      expect(service.boundaries()[0].title).toBe('Q1');
    });

    it('resets loading on error', () => {
      const { service } = setup({ get: vi.fn().mockReturnValue(throwError(() => new Error())) });
      service.list(5, 3).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets selectedBoundary', () => {
      const { service } = setup({ get: vi.fn().mockReturnValue(of({ data: stubApi })) });
      service.load(5, 3, 1).subscribe();
      expect(service.selectedBoundary()?.id).toBe(1);
    });

    it('clears selectedBoundary before loading', () => {
      const { service } = setup({ get: vi.fn().mockReturnValue(of({ data: stubApi })) });
      service.load(5, 3, 1).subscribe();
      expect(service.selectedBoundary()).not.toBeNull();
    });

    it('resets loading on error', () => {
      const { service } = setup({ get: vi.fn().mockReturnValue(throwError(() => new Error())) });
      service.load(5, 3, 1).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('appends new boundary to list', () => {
      const newApi = { ...stubApi, id: 2, title: 'New' };
      const { service } = setup({
        get: vi.fn().mockReturnValue(of({ data: [stubApi] })),
        post: vi.fn().mockReturnValue(of({ data: newApi })),
      });
      service.list(5, 3).subscribe();
      service.create(5, 3, { type: 'end_stage_report' }).subscribe();
      expect(service.boundaries().length).toBe(2);
      expect(service.boundaries()[1].id).toBe(2);
    });
  });

  describe('update()', () => {
    it('updates boundary in list', () => {
      const updatedApi = { ...stubApi, title: 'Updated' };
      const { service } = setup({
        get: vi.fn().mockReturnValue(of({ data: [stubApi] })),
        patch: vi.fn().mockReturnValue(of({ data: updatedApi })),
      });
      service.list(5, 3).subscribe();
      service.update(5, 3, 1, { title: 'Updated' }).subscribe();
      expect(service.boundaries()[0].title).toBe('Updated');
    });
  });

  describe('submit()', () => {
    it('updates boundary status to submitted', () => {
      const { service } = setup();
      service.list(5, 3).subscribe();
      service.submit(5, 3, 1).subscribe();
      expect(service.boundaries()[0].status).toBe('submitted');
    });
  });

  describe('approve()', () => {
    it('updates boundary status to approved', () => {
      const { service } = setup({ patch: vi.fn().mockReturnValue(of({ data: approvedApi })) });
      service.list(5, 3).subscribe();
      service.approve(5, 3, 1).subscribe();
      expect(service.boundaries()[0].status).toBe('approved');
    });
  });

  describe('reject()', () => {
    it('updates boundary status to rejected', () => {
      const { service } = setup({ patch: vi.fn().mockReturnValue(of({ data: rejectedApi })) });
      service.list(5, 3).subscribe();
      service.reject(5, 3, 1, {}).subscribe();
      expect(service.boundaries()[0].status).toBe('rejected');
    });
  });

  describe('remove()', () => {
    it('removes boundary from signal', () => {
      const { service } = setup();
      service.list(5, 3).subscribe();
      service.remove(5, 3, 1).subscribe();
      expect(service.boundaries().length).toBe(0);
    });
  });
});
