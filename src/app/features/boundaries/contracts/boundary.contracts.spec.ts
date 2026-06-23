import {
  mapBoundary,
  StageBoundaryApiResource,
  canEdit,
  canSubmit,
  canApproveReject,
} from './boundary.contracts';

const stubApi: StageBoundaryApiResource = {
  id: 1,
  stage_id: 3,
  type: 'end_stage_report',
  status: 'draft',
  title: 'Q1 Close',
  notes: 'Some notes',
  next_stage_id: 4,
  exception_summary: null,
  submitted_at: null,
  submitted_by: null,
  approved_at: null,
  approved_by: null,
  created_by: { id: 10, name: 'Alice' },
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
};

describe('mapBoundary', () => {
  it('maps snake_case fields to camelCase', () => {
    const b = mapBoundary(stubApi);
    expect(b.id).toBe(1);
    expect(b.stageId).toBe(3);
    expect(b.nextStageId).toBe(4);
    expect(b.exceptionSummary).toBeNull();
    expect(b.createdBy?.name).toBe('Alice');
    expect(b.createdAt).toBe('2026-01-01T00:00:00Z');
  });

  it('maps null fields correctly', () => {
    const b = mapBoundary({ ...stubApi, title: null, notes: null, next_stage_id: null });
    expect(b.title).toBeNull();
    expect(b.notes).toBeNull();
    expect(b.nextStageId).toBeNull();
  });
});

describe('workflow guards', () => {
  it('canEdit: only draft', () => {
    expect(canEdit('draft')).toBe(true);
    expect(canEdit('submitted')).toBe(false);
    expect(canEdit('approved')).toBe(false);
    expect(canEdit('rejected')).toBe(false);
  });

  it('canSubmit: only draft', () => {
    expect(canSubmit('draft')).toBe(true);
    expect(canSubmit('submitted')).toBe(false);
  });

  it('canApproveReject: only submitted', () => {
    expect(canApproveReject('submitted')).toBe(true);
    expect(canApproveReject('draft')).toBe(false);
    expect(canApproveReject('approved')).toBe(false);
  });
});
