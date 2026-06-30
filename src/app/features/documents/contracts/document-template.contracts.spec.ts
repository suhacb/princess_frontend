import {
  mergeSettings,
  buildTemplateTree,
  mapDocumentTemplate,
  DocumentTemplateApiResource,
} from './document-template.contracts';

const makeApi = (overrides: Partial<DocumentTemplateApiResource> = {}): DocumentTemplateApiResource => ({
  id: 1,
  parent_id: null,
  level: 'project',
  category: null,
  type: null,
  name: 'Root',
  description: null,
  file_name: null,
  s3_key: null,
  settings: {},
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
  ...overrides,
});

describe('mergeSettings()', () => {
  it('returns child scalar values over parent', () => {
    const result = mergeSettings({ fontFamily: 'Arial' }, { fontFamily: 'Times' });
    expect(result.fontFamily).toBe('Times');
  });

  it('inherits parent scalar values not set in child', () => {
    const result = mergeSettings({ fontFamily: 'Arial', fontSize: 11 }, { fontSize: 12 });
    expect(result.fontFamily).toBe('Arial');
    expect(result.fontSize).toBe(12);
  });

  it('deep-merges margins: child partial override preserves parent sides', () => {
    const parent = { margins: { top: 10, right: 20, bottom: 10, left: 20 } };
    const child = { margins: { top: 25 } };
    const result = mergeSettings(parent, child);
    expect(result.margins?.top).toBe(25);
    expect(result.margins?.right).toBe(20);
    expect(result.margins?.bottom).toBe(10);
    expect(result.margins?.left).toBe(20);
  });

  it('uses parent margins when child has no margins', () => {
    const parent = { margins: { top: 10, right: 10, bottom: 10, left: 10 } };
    const result = mergeSettings(parent, {});
    expect(result.margins).toEqual({ top: 10, right: 10, bottom: 10, left: 10 });
  });

  it('uses child margins when parent has no margins', () => {
    const child = { margins: { top: 5, right: 5, bottom: 5, left: 5 } };
    const result = mergeSettings({}, child);
    expect(result.margins).toEqual({ top: 5, right: 5, bottom: 5, left: 5 });
  });

  it('returns empty object when both parent and child are empty', () => {
    const result = mergeSettings({}, {});
    expect(result).toEqual({});
  });
});

describe('buildTemplateTree()', () => {
  it('builds root → category → type hierarchy', () => {
    const templates = [
      mapDocumentTemplate(makeApi({ id: 1 })),
      mapDocumentTemplate(makeApi({ id: 2, parent_id: 1, category: 'initiation', name: 'Cat' })),
      mapDocumentTemplate(makeApi({ id: 3, parent_id: 2, category: 'initiation', type: 'project_brief', name: 'Leaf' })),
    ];
    const tree = buildTemplateTree(templates);
    expect(tree[0].children[0].children[0].kind).toBe('type');
  });

  it('handles multiple root nodes', () => {
    const templates = [
      mapDocumentTemplate(makeApi({ id: 1, name: 'Root A' })),
      mapDocumentTemplate(makeApi({ id: 2, name: 'Root B' })),
    ];
    const tree = buildTemplateTree(templates);
    expect(tree.length).toBe(2);
  });

  it('propagates effective settings through 3 levels correctly', () => {
    const templates = [
      mapDocumentTemplate(makeApi({ id: 1, settings: { fontFamily: 'Arial', margins: { top: 10, right: 10, bottom: 10, left: 10 } } })),
      mapDocumentTemplate(makeApi({ id: 2, parent_id: 1, category: 'initiation', settings: { fontSize: 12 } })),
      mapDocumentTemplate(makeApi({ id: 3, parent_id: 2, category: 'initiation', type: 'project_brief', settings: { margins: { top: 25 } } })),
    ];
    const tree = buildTemplateTree(templates);
    const leaf = tree[0].children[0].children[0];
    expect(leaf.effectiveSettings.fontFamily).toBe('Arial');
    expect(leaf.effectiveSettings.fontSize).toBe(12);
    expect(leaf.effectiveSettings.margins?.top).toBe(25);
    expect(leaf.effectiveSettings.margins?.right).toBe(10);
  });

  it('derives correct kind from category/type fields', () => {
    const templates = [
      mapDocumentTemplate(makeApi({ id: 1 })),
      mapDocumentTemplate(makeApi({ id: 2, parent_id: 1, category: 'planning' })),
      mapDocumentTemplate(makeApi({ id: 3, parent_id: 2, category: 'planning', type: 'project_plan' })),
    ];
    const tree = buildTemplateTree(templates);
    expect(tree[0].kind).toBe('root');
    expect(tree[0].children[0].kind).toBe('category');
    expect(tree[0].children[0].children[0].kind).toBe('type');
  });

  it('returns empty array for no templates', () => {
    expect(buildTemplateTree([])).toEqual([]);
  });
});
