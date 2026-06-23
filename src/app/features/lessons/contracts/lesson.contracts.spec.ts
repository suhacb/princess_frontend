import { mapLesson, LessonApiResource } from './lesson.contracts';

const stubApi: LessonApiResource = {
  id: 1,
  project_id: 5,
  stage_id: null,
  category: 'Planning',
  description: 'Estimations were too optimistic',
  recommendation: 'Use three-point estimation',
  source: 'retrospective',
  raised_by: { id: 10, name: 'Alice' },
  raised_at: '2026-06-01T10:00:00Z',
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('mapLesson()', () => {
  it('maps all fields correctly', () => {
    const l = mapLesson(stubApi);
    expect(l.id).toBe(1);
    expect(l.projectId).toBe(5);
    expect(l.stageId).toBeNull();
    expect(l.category).toBe('Planning');
    expect(l.description).toBe('Estimations were too optimistic');
    expect(l.recommendation).toBe('Use three-point estimation');
    expect(l.source).toBe('retrospective');
    expect(l.raisedBy?.name).toBe('Alice');
    expect(l.raisedAt).toBe('2026-06-01T10:00:00Z');
    expect(l.createdAt).toBe('2026-06-01T10:00:00Z');
  });

  it('handles null category and recommendation', () => {
    const l = mapLesson({ ...stubApi, category: null, recommendation: null });
    expect(l.category).toBeNull();
    expect(l.recommendation).toBeNull();
  });

  it('handles null raised_by', () => {
    const l = mapLesson({ ...stubApi, raised_by: null });
    expect(l.raisedBy).toBeNull();
  });

  it('maps incident source', () => {
    const l = mapLesson({ ...stubApi, source: 'incident' });
    expect(l.source).toBe('incident');
  });

  it('maps observation source', () => {
    const l = mapLesson({ ...stubApi, source: 'observation' });
    expect(l.source).toBe('observation');
  });
});
