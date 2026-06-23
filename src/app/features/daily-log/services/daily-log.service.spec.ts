import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DailyLogService } from './daily-log.service';
import { ApiService } from '../../../core/http/api.service';
import { DailyLogEntryApiResource } from '../contracts/daily-log.contracts';

const stubApi: DailyLogEntryApiResource = {
  id: 1, project_id: 5, stage_id: null,
  date: '2026-06-09', entry_type: 'note', body: 'Hello',
  source: 'manual', author: { id: 10, name: 'Alice', job_title: null, organization: null },
  created_at: '2026-06-09T10:00:00Z', updated_at: '2026-06-09T10:00:00Z',
};

function setup(overrides: Partial<Record<'get' | 'post' | 'patch' | 'delete', unknown>> = {}) {
  const apiService = {
    get: vi.fn().mockReturnValue(of({ data: [stubApi] })),
    post: vi.fn().mockReturnValue(of({ data: stubApi })),
    patch: vi.fn().mockReturnValue(of({ data: { ...stubApi, body: 'Updated' } })),
    delete: vi.fn().mockReturnValue(of(undefined)),
    ...overrides,
  };
  TestBed.configureTestingModule({ providers: [DailyLogService, { provide: ApiService, useValue: apiService }] });
  return { service: TestBed.inject(DailyLogService), apiService };
}

describe('DailyLogService', () => {
  afterEach(() => TestBed.resetTestingModule());

  describe('list()', () => {
    it('sets entries signal', () => {
      const { service } = setup();
      service.list(5).subscribe();
      expect(service.entries().length).toBe(1);
      expect(service.entries()[0].body).toBe('Hello');
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.list(5).subscribe();
      expect(apiService.get).toHaveBeenCalledWith('/projects/5/daily-log');
    });

    it('resets loading on error', () => {
      const { service } = setup({ get: vi.fn().mockReturnValue(throwError(() => new Error())) });
      service.list(5).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('prepends new entry to list', () => {
      const { service } = setup({ post: vi.fn().mockReturnValue(of({ data: { ...stubApi, id: 2 } })) });
      service.list(5).subscribe();
      service.create(5, { date: '2026-06-09', entry_type: 'note', body: 'New' }).subscribe();
      expect(service.entries().length).toBe(2);
      expect(service.entries()[0].id).toBe(2);
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.create(5, { date: '2026-06-09', entry_type: 'note', body: 'New' }).subscribe();
      expect(apiService.post).toHaveBeenCalledWith('/projects/5/daily-log', expect.any(Object));
    });
  });

  describe('update()', () => {
    it('updates entry in list', () => {
      const { service } = setup();
      service.list(5).subscribe();
      service.update(5, 1, { body: 'Updated' }).subscribe();
      expect(service.entries()[0].body).toBe('Updated');
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.update(5, 1, { body: 'Updated' }).subscribe();
      expect(apiService.patch).toHaveBeenCalledWith('/projects/5/daily-log/1', expect.any(Object));
    });
  });

  describe('remove()', () => {
    it('removes entry from list', () => {
      const { service } = setup();
      service.list(5).subscribe();
      service.remove(5, 1).subscribe();
      expect(service.entries().length).toBe(0);
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.remove(5, 1).subscribe();
      expect(apiService.delete).toHaveBeenCalledWith('/projects/5/daily-log/1');
    });
  });
});
