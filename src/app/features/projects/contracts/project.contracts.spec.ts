import { mapProject, ProjectApiResource } from './project.contracts';

const stubApi: ProjectApiResource = {
  id: 1,
  name: 'Alpha',
  reference: 'PROJ-001',
  status: 'initiation',
  current_stage_name: 'Stage 1',
  tolerances: {
    time: { min: -5, max: 10 },
    cost: { min: -1000, max: 2000 },
    scope: 'No scope creep',
    risk: 'Low',
    quality: 'ISO standards',
    benefit: 'ROI > 15%',
  },
  created_by: 'jdoe',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
};

describe('mapProject()', () => {
  it('maps snake_case fields to camelCase', () => {
    const project = mapProject(stubApi);
    expect(project.currentStageName).toBe('Stage 1');
    expect(project.createdBy).toBe('jdoe');
    expect(project.createdAt).toBe('2026-01-01T00:00:00Z');
  });

  it('preserves scalar fields unchanged', () => {
    const project = mapProject(stubApi);
    expect(project.id).toBe(1);
    expect(project.name).toBe('Alpha');
    expect(project.reference).toBe('PROJ-001');
    expect(project.status).toBe('initiation');
  });

  it('passes tolerances object through as-is', () => {
    const project = mapProject(stubApi);
    expect(project.tolerances.time).toEqual({ min: -5, max: 10 });
    expect(project.tolerances.scope).toBe('No scope creep');
  });

  it('handles null current_stage_name', () => {
    const project = mapProject({ ...stubApi, current_stage_name: null });
    expect(project.currentStageName).toBeNull();
  });

  it('does not include updated_at in the frontend model', () => {
    const project = mapProject(stubApi);
    expect((project as unknown as Record<string, unknown>)['updatedAt']).toBeUndefined();
  });
});
