import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { QualityRegisterService } from './quality-register.service';
import { ApiService } from '../../../core/http/api.service';
import { QualityEntryApiResource } from '../contracts/quality-register.contracts';

const stubApi: QualityEntryApiResource = {
  id: 1,
  project_id: 5,
  stage_id: null,
  product_name: 'User manual',
  quality_method: 'review',
  planned_date: '2026-07-01',
  actual_date: null,
  reviewers: null,
  result: null,
  issues_raised: null,
  sign_off_at: null,
  sign_off_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('QualityRegisterService', () => {
  let service: QualityRegisterService;
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
      providers: [QualityRegisterService, { provide: ApiService, useValue: apiMock }],
    });
    service = TestBed.inject(QualityRegisterService);
  });

  describe('list()', () => {
    it('sets entries and clears loading on success', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      expect(service.entries()).toHaveLength(1);
      expect(service.entries()[0].productName).toBe('User manual');
      expect(service.loading()).toBe(false);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.list(5).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets selectedEntry and clears loading', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(5, 1).subscribe();
      expect(service.selectedEntry()?.id).toBe(1);
      expect(service.loading()).toBe(false);
    });

    it('clears selectedEntry before loading', () => {
      apiMock.get
        .mockReturnValueOnce(of({ data: stubApi }))
        .mockReturnValueOnce(of({ data: { ...stubApi, id: 2, product_name: 'Spec doc' } }));
      service.load(5, 1).subscribe();
      service.load(5, 2).subscribe();
      expect(service.selectedEntry()?.id).toBe(2);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.load(5, 1).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('prepends new entry to list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      apiMock.post.mockReturnValue(of({ data: { ...stubApi, id: 2, product_name: 'Spec doc' } }));
      service.create(5, { product_name: 'Spec doc', quality_method: 'test' }).subscribe();
      expect(service.entries()[0].id).toBe(2);
      expect(service.entries()).toHaveLength(2);
    });
  });

  describe('update()', () => {
    it('updates entry in list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      apiMock.patch.mockReturnValue(of({ data: { ...stubApi, product_name: 'Updated doc' } }));
      service.update(5, 1, { product_name: 'Updated doc' }).subscribe();
      expect(service.entries()[0].productName).toBe('Updated doc');
    });

    it('propagates to selectedEntry when it matches', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(5, 1).subscribe();
      apiMock.patch.mockReturnValue(of({ data: { ...stubApi, product_name: 'Updated doc' } }));
      service.update(5, 1, { product_name: 'Updated doc' }).subscribe();
      expect(service.selectedEntry()?.productName).toBe('Updated doc');
    });
  });

  describe('remove()', () => {
    it('removes entry from list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.entries()).toHaveLength(0);
    });

    it('clears selectedEntry if it was the deleted one', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(5, 1).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.selectedEntry()).toBeNull();
    });
  });
});
