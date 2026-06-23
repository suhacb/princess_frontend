import { mapDailyLogEntry, DailyLogEntryApiResource } from './daily-log.contracts';

const stubApi: DailyLogEntryApiResource = {
  id: 1,
  project_id: 5,
  stage_id: 3,
  date: '2026-06-09',
  entry_type: 'note',
  body: 'Test entry',
  source: 'manual',
  author: { id: 10, name: 'Alice', job_title: 'PM', organization: 'Acme' },
  created_at: '2026-06-09T10:00:00Z',
  updated_at: '2026-06-09T10:00:00Z',
};

describe('mapDailyLogEntry', () => {
  it('maps snake_case fields to camelCase', () => {
    const entry = mapDailyLogEntry(stubApi);
    expect(entry.id).toBe(1);
    expect(entry.projectId).toBe(5);
    expect(entry.stageId).toBe(3);
    expect(entry.entryType).toBe('note');
    expect(entry.createdAt).toBe('2026-06-09T10:00:00Z');
  });

  it('maps author fields', () => {
    const entry = mapDailyLogEntry(stubApi);
    expect(entry.author?.name).toBe('Alice');
    expect(entry.author?.jobTitle).toBe('PM');
  });

  it('handles null author', () => {
    const entry = mapDailyLogEntry({ ...stubApi, author: null });
    expect(entry.author).toBeNull();
  });

  it('handles null stage_id', () => {
    const entry = mapDailyLogEntry({ ...stubApi, stage_id: null });
    expect(entry.stageId).toBeNull();
  });
});
