import { mapQualityEntry, QualityEntryApiResource } from './quality-register.contracts';

const stubApi: QualityEntryApiResource = {
  id: 1,
  project_id: 5,
  stage_id: null,
  product_name: 'User manual',
  quality_method: 'review',
  planned_date: '2026-07-01',
  actual_date: null,
  reviewers: [10, 20],
  result: null,
  issues_raised: null,
  sign_off_at: null,
  sign_off_by: null,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
};

describe('mapQualityEntry()', () => {
  it('maps all fields correctly', () => {
    const e = mapQualityEntry(stubApi);
    expect(e.id).toBe(1);
    expect(e.projectId).toBe(5);
    expect(e.stageId).toBeNull();
    expect(e.productName).toBe('User manual');
    expect(e.qualityMethod).toBe('review');
    expect(e.plannedDate).toBe('2026-07-01');
    expect(e.actualDate).toBeNull();
    expect(e.reviewers).toEqual([10, 20]);
    expect(e.result).toBeNull();
    expect(e.issuesRaised).toBeNull();
    expect(e.signOffAt).toBeNull();
    expect(e.signOffBy).toBeNull();
  });

  it('maps result and sign-off fields when completed', () => {
    const e = mapQualityEntry({
      ...stubApi,
      actual_date: '2026-07-05',
      result: 'passed',
      sign_off_at: '2026-07-06T09:00:00Z',
      sign_off_by: { id: 10, name: 'Alice' },
    });
    expect(e.result).toBe('passed');
    expect(e.actualDate).toBe('2026-07-05');
    expect(e.signOffAt).toBe('2026-07-06T09:00:00Z');
    expect(e.signOffBy?.name).toBe('Alice');
  });

  it('handles null reviewers', () => {
    const e = mapQualityEntry({ ...stubApi, reviewers: null });
    expect(e.reviewers).toBeNull();
  });

  it('handles issues_raised text', () => {
    const e = mapQualityEntry({ ...stubApi, issues_raised: 'Section 3 unclear', result: 'conditional' });
    expect(e.issuesRaised).toBe('Section 3 unclear');
    expect(e.result).toBe('conditional');
  });
});
