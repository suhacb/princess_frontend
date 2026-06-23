import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LessonService } from './lesson.service';
import { ApiService } from '../../../core/http/api.service';
import { LessonApiResource } from '../contracts/lesson.contracts';

const stubApi: LessonApiResource = {
  id: 1,
  project_id: 5,
  stage_id: null,
  category: 'Planning',
  description: 'Estimations were too optimistic',
  recommendation: null,
  source: 'retrospective',
  raised_by: { id: 10, name: 'Alice' },
  raised_at: '2026-06-01T10:00:00Z',
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('LessonService', () => {
  let service: LessonService;
  let apiMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiMock = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
    TestBed.configureTestingModule({
      providers: [LessonService, { provide: ApiService, useValue: apiMock }],
    });
    service = TestBed.inject(LessonService);
  });

  describe('list()', () => {
    it('sets lessons and clears loading on success', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      expect(service.lessons()).toHaveLength(1);
      expect(service.lessons()[0].description).toBe('Estimations were too optimistic');
      expect(service.loading()).toBe(false);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.list(5).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('load()', () => {
    it('sets selectedLesson and clears loading', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(5, 1).subscribe();
      expect(service.selectedLesson()?.id).toBe(1);
      expect(service.loading()).toBe(false);
    });

    it('clears selectedLesson before loading', () => {
      apiMock.get
        .mockReturnValueOnce(of({ data: stubApi }))
        .mockReturnValueOnce(of({ data: { ...stubApi, id: 2, description: 'Another lesson' } }));
      service.load(5, 1).subscribe();
      service.load(5, 2).subscribe();
      expect(service.selectedLesson()?.id).toBe(2);
    });

    it('clears loading on error', () => {
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.load(5, 1).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('prepends new lesson to list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      apiMock.post.mockReturnValue(of({ data: { ...stubApi, id: 2, description: 'New lesson' } }));
      service.create(5, { description: 'New lesson', source: 'incident' }).subscribe();
      expect(service.lessons()[0].id).toBe(2);
      expect(service.lessons()).toHaveLength(2);
    });
  });

  describe('update()', () => {
    it('updates lesson in list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      apiMock.patch.mockReturnValue(of({ data: { ...stubApi, description: 'Updated' } }));
      service.update(5, 1, { description: 'Updated' }).subscribe();
      expect(service.lessons()[0].description).toBe('Updated');
    });

    it('propagates to selectedLesson when it matches', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(5, 1).subscribe();
      apiMock.patch.mockReturnValue(of({ data: { ...stubApi, description: 'Updated' } }));
      service.update(5, 1, { description: 'Updated' }).subscribe();
      expect(service.selectedLesson()?.description).toBe('Updated');
    });
  });

  describe('remove()', () => {
    it('removes lesson from list', () => {
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(5).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.lessons()).toHaveLength(0);
    });

    it('clears selectedLesson if it was the deleted one', () => {
      apiMock.get.mockReturnValue(of({ data: stubApi }));
      service.load(5, 1).subscribe();
      apiMock.delete.mockReturnValue(of(undefined));
      service.remove(5, 1).subscribe();
      expect(service.selectedLesson()).toBeNull();
    });
  });
});
