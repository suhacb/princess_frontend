import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ChangeService } from './change.service';
import { ApiService } from '../../../core/http/api.service';
import { ChangeApiResource } from '../contracts/change.contracts';

const stubApi: ChangeApiResource = {
  id: 1,
  project_id: 5,
  issue_id: null,
  request_type: 'rfc',
  title: 'Add new field',
  description: null,
  impact_assessment: null,
  priority: null,
  status: 'proposed',
  raised_at: '2026-06-01T10:00:00Z',
  decision_at: null,
  decision_rationale: null,
  implementation_due: null,
  implemented_at: null,
  raised_by: { id: 10, name: 'Alice' },
  decision_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('ChangeService', () => {
  let service: ChangeService;
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
      providers: [ChangeService, { provide: ApiService, useValue: apiMock }],
    });
    service = TestBed.inject(ChangeService);
  });

  describe('list()', () => {
    it('sets changes and clears loading on success', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      expect(service.changes()).toHaveLength(1);
      expect(service.changes()[0].title).toBe('Add new field');
      expect(service.loading()).toBe(false);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.list(5).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets selectedChange and clears loading', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(5, 1).subscribe();
      expect(service.selectedChange()?.id).toBe(1);
      expect(service.loading()).toBe(false);
    });

    it('clears selectedChange before loading', () => {
      apiMock.get
        .mockReturnValueOnce(of({ data: stubApi }))
        .mockReturnValueOnce(of({ data: { ...stubApi, id: 2 } }));
      service.load(5, 1).subscribe();
      service.load(5, 2).subscribe();
      expect(service.selectedChange()?.id).toBe(2);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.load(5, 1).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('prepends new change to list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      apiMock.post.mockReturnValue(of({ data: { ...stubApi, id: 2, title: 'Another change' } }));
      service.create(5, { request_type: 'rfc', title: 'Another change' }).subscribe();
      expect(service.changes()[0].id).toBe(2);
      expect(service.changes()).toHaveLength(2);
    });
  });

  describe('update()', () => {
    it('updates change in list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      apiMock.patch.mockReturnValue(of({ data: { ...stubApi, title: 'Updated' } }));
      service.update(5, 1, { title: 'Updated' }).subscribe();
      expect(service.changes()[0].title).toBe('Updated');
    });

    it('propagates to selectedChange when it matches', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(5, 1).subscribe();
      apiMock.patch.mockReturnValue(of({ data: { ...stubApi, title: 'Updated' } }));
      service.update(5, 1, { title: 'Updated' }).subscribe();
      expect(service.selectedChange()?.title).toBe('Updated');
    });
  });

  describe('remove()', () => {
    it('removes change from list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.changes()).toHaveLength(0);
    });

    it('clears selectedChange if it was the deleted one', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(5, 1).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.selectedChange()).toBeNull();
    });
  });

  describe('approve()', () => {
    it('updates status to approved', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      apiMock.patch.mockReturnValue(
        of({ data: { ...stubApi, status: 'approved', decision_rationale: 'Good idea' } }),
      );
      service.approve(5, 1, { decision_rationale: 'Good idea' }).subscribe();
      expect(service.changes()[0].status).toBe('approved');
      expect(service.changes()[0].decisionRationale).toBe('Good idea');
    });
  });

  describe('reject()', () => {
    it('updates status to rejected', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      apiMock.patch.mockReturnValue(
        of({ data: { ...stubApi, status: 'rejected' } }),
      );
      service.reject(5, 1, {}).subscribe();
      expect(service.changes()[0].status).toBe('rejected');
    });
  });
});
