import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { AuditTrailService } from './audit-trail.service';
import type { AuditEntryApiResource, AuditTrailApiResponse } from '../contracts/audit-trail.contracts';

function makeApiEntry(overrides: Partial<AuditEntryApiResource> = {}): AuditEntryApiResource {
  return {
    id: 1, entity_type: 'task', entity_id: 5, entity_title: 'Task A',
    event: 'created', causer: { id: 2, name: 'Alice' },
    occurred_at: '2026-06-28T10:00:00Z', changes: {},
    ...overrides,
  };
}

function makeResponse(
  entries: AuditEntryApiResource[],
  page = 1,
  lastPage = 1,
): AuditTrailApiResponse {
  return {
    data: entries,
    meta: { current_page: page, last_page: lastPage, per_page: 25, total: entries.length },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setup(apiMock: any) {
  TestBed.configureTestingModule({
    providers: [AuditTrailService, { provide: ApiService, useValue: apiMock }],
  });
  return TestBed.inject(AuditTrailService);
}

afterEach(() => TestBed.resetTestingModule());

describe('AuditTrailService', () => {
  it('initialises with empty entries, loading=false, meta=null', () => {
    const svc = setup({ get: vi.fn().mockReturnValue(of(makeResponse([]))) });
    expect(svc.entries()).toEqual([]);
    expect(svc.loading()).toBe(false);
    expect(svc.meta()).toBeNull();
  });

  describe('load()', () => {
    it('populates entries signal from response', async () => {
      const svc = setup({ get: vi.fn().mockReturnValue(of(makeResponse([makeApiEntry()]))) });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      expect(svc.entries()).toHaveLength(1);
      expect(svc.entries()[0]).toMatchObject({ id: 1, entityType: 'task', entityTitle: 'Task A' });
    });

    it('replaces entries on second load (not appending)', async () => {
      const getMock = vi.fn()
        .mockReturnValueOnce(of(makeResponse([makeApiEntry({ id: 1 })])))
        .mockReturnValueOnce(of(makeResponse([makeApiEntry({ id: 2 })])));
      const svc = setup({ get: getMock });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      expect(svc.entries()).toHaveLength(1);
      expect(svc.entries()[0].id).toBe(2);
    });

    it('populates meta after load', async () => {
      const svc = setup({ get: vi.fn().mockReturnValue(of(makeResponse([makeApiEntry()], 1, 3))) });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      expect(svc.meta()).toMatchObject({ current_page: 1, last_page: 3 });
    });

    it('sets loading false after completion', async () => {
      const svc = setup({ get: vi.fn().mockReturnValue(of(makeResponse([]))) });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      expect(svc.loading()).toBe(false);
    });

    it('calls GET /projects/:id/audit-trail with page=1', () => {
      const getMock = vi.fn().mockReturnValue(of(makeResponse([])));
      const svc = setup({ get: getMock });
      svc.load(5).subscribe();
      expect(getMock).toHaveBeenCalledWith('/projects/5/audit-trail', expect.objectContaining({ page: 1 }));
    });

    it('passes entity_type filter as query param', () => {
      const getMock = vi.fn().mockReturnValue(of(makeResponse([])));
      const svc = setup({ get: getMock });
      svc.load(5, { entity_type: 'task' }).subscribe();
      expect(getMock).toHaveBeenCalledWith(
        '/projects/5/audit-trail',
        expect.objectContaining({ page: 1, entity_type: 'task' }),
      );
    });

    it('passes from/to date filters', () => {
      const getMock = vi.fn().mockReturnValue(of(makeResponse([])));
      const svc = setup({ get: getMock });
      svc.load(5, { from: '2026-06-01', to: '2026-06-30' }).subscribe();
      expect(getMock).toHaveBeenCalledWith(
        '/projects/5/audit-trail',
        expect.objectContaining({ from: '2026-06-01', to: '2026-06-30' }),
      );
    });

    it('does not include null filters in params', () => {
      const getMock = vi.fn().mockReturnValue(of(makeResponse([])));
      const svc = setup({ get: getMock });
      svc.load(5, { entity_type: null, from: null }).subscribe();
      const params = getMock.mock.calls[0][1] as Record<string, unknown>;
      expect(params).not.toHaveProperty('entity_type');
      expect(params).not.toHaveProperty('from');
    });
  });

  describe('loadMore()', () => {
    it('appends entries to signal', async () => {
      const getMock = vi.fn()
        .mockReturnValueOnce(of(makeResponse([makeApiEntry({ id: 1 })], 1, 2)))
        .mockReturnValueOnce(of(makeResponse([makeApiEntry({ id: 2 })], 2, 2)));
      const svc = setup({ get: getMock });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      await new Promise<void>(r => svc.loadMore(5).subscribe({ complete: r }));
      expect(svc.entries()).toHaveLength(2);
      expect(svc.entries()[0].id).toBe(1);
      expect(svc.entries()[1].id).toBe(2);
    });

    it('calls page 2 when current_page=1', async () => {
      const getMock = vi.fn()
        .mockReturnValueOnce(of(makeResponse([makeApiEntry()], 1, 2)))
        .mockReturnValueOnce(of(makeResponse([], 2, 2)));
      const svc = setup({ get: getMock });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      svc.loadMore(5).subscribe();
      expect(getMock).toHaveBeenNthCalledWith(2,
        '/projects/5/audit-trail',
        expect.objectContaining({ page: 2 }),
      );
    });

    it('returns EMPTY (no request) when on last page', async () => {
      const getMock = vi.fn().mockReturnValue(of(makeResponse([makeApiEntry()], 1, 1)));
      const svc = setup({ get: getMock });
      await new Promise<void>(r => svc.load(5).subscribe({ complete: r }));
      svc.loadMore(5).subscribe();
      expect(getMock).toHaveBeenCalledTimes(1);
    });

    it('returns EMPTY when meta is null (not yet loaded)', () => {
      const getMock = vi.fn().mockReturnValue(of(makeResponse([])));
      const svc = setup({ get: getMock });
      svc.loadMore(5).subscribe();
      expect(getMock).not.toHaveBeenCalled();
    });
  });
});
