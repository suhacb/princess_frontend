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
  });

  describe('create()', () => {
    it('appends to boundaries signal', () => {
      const { service } = setup();
      service.list(5, 3).subscribe();
      const initial = service.boundaries().length;
      setup({ post: vi.fn().mockReturnValue(of({ data: { ...stubApi, id: 2 } })) });
      TestBed.inject(BoundaryService).create(5, 3, { type: 'end_stage_report' }).subscribe();
    });
  });

  describe('submit()', () => {
    it('updates boundary status in signal', () => {
      const { service } = setup();
      service.list(5, 3).subscribe();
      service.submit(5, 3, 1).subscribe();
      expect(service.boundaries()[0].status).toBe('submitted');
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
