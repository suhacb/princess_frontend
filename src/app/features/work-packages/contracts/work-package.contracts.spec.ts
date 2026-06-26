import {
  mapProduct,
  mapWorkPackage,
  exportPbsToText,
  ProductApiResource,
  WorkPackageApiResource,
} from './work-package.contracts';

const stubChildApi: ProductApiResource = {
  id: 20, project_id: 7, parent_id: 1, identifier: null,
  title: 'Auth Module', purpose: null, type: 'specialist', status: 'in_development',
  children: [], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
};

const stubProductApi: ProductApiResource = {
  id: 1, project_id: 7, parent_id: null, identifier: 'P001',
  title: 'Backend System', purpose: 'Core API layer', type: 'specialist', status: 'draft',
  children: [stubChildApi], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
};

const stubWpApi: WorkPackageApiResource = {
  id: 10, project_id: 7, title: 'Build Auth', description: null,
  status: 'draft',
  team_manager_id: 5, team_manager: { id: 5, name: 'Alice' },
  planned_start: '2026-02-01', planned_end: '2026-04-30',
  actual_start: null, actual_end: null,
  products: [stubProductApi],
  created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
};

describe('mapProduct', () => {
  it('maps snake_case fields to camelCase', () => {
    const p = mapProduct(stubProductApi);
    expect(p.id).toBe(1);
    expect(p.projectId).toBe(7);
    expect(p.parentId).toBeNull();
    expect(p.identifier).toBe('P001');
    expect(p.purpose).toBe('Core API layer');
    expect(p.type).toBe('specialist');
    expect(p.status).toBe('draft');
  });

  it('maps nested children recursively', () => {
    const p = mapProduct(stubProductApi);
    expect(p.children).toHaveLength(1);
    expect(p.children[0].id).toBe(20);
    expect(p.children[0].parentId).toBe(1);
  });

  it('defaults children to empty array when absent', () => {
    const api = { ...stubProductApi, children: undefined as unknown as ProductApiResource[] };
    expect(mapProduct(api).children).toEqual([]);
  });

  it('passes null purpose through', () => {
    expect(mapProduct({ ...stubProductApi, purpose: null }).purpose).toBeNull();
  });
});

describe('mapWorkPackage', () => {
  it('maps snake_case fields to camelCase', () => {
    const wp = mapWorkPackage(stubWpApi);
    expect(wp.id).toBe(10);
    expect(wp.projectId).toBe(7);
    expect(wp.teamManagerId).toBe(5);
    expect(wp.teamManager?.name).toBe('Alice');
    expect(wp.plannedStart).toBe('2026-02-01');
    expect(wp.plannedEnd).toBe('2026-04-30');
    expect(wp.actualStart).toBeNull();
  });

  it('maps nested products', () => {
    const wp = mapWorkPackage(stubWpApi);
    expect(wp.products).toHaveLength(1);
    expect(wp.products[0].title).toBe('Backend System');
  });

  it('handles missing products array', () => {
    const api = { ...stubWpApi, products: undefined as unknown as WorkPackageApiResource['products'] };
    expect(mapWorkPackage(api).products).toEqual([]);
  });

  it('handles null team_manager', () => {
    expect(mapWorkPackage({ ...stubWpApi, team_manager: null }).teamManager).toBeNull();
  });
});

describe('exportPbsToText', () => {
  it('returns empty string for empty list', () => {
    expect(exportPbsToText([])).toBe('');
  });

  it('outputs root product title with no indentation', () => {
    const p = mapProduct({ ...stubProductApi, children: [] });
    expect(exportPbsToText([p])).toBe('Backend System');
  });

  it('indents children with two spaces', () => {
    const p = mapProduct(stubProductApi);
    const lines = exportPbsToText([p]).split('\n');
    expect(lines[0]).toBe('Backend System');
    expect(lines[1]).toBe('  Auth Module');
  });

  it('handles multiple root products', () => {
    const p1 = mapProduct({ ...stubProductApi, id: 1, title: 'P1', children: [] });
    const p2 = mapProduct({ ...stubProductApi, id: 2, title: 'P2', children: [] });
    const lines = exportPbsToText([p1, p2]).split('\n');
    expect(lines[0]).toBe('P1');
    expect(lines[1]).toBe('P2');
  });

  it('indents deeply nested children', () => {
    const grandchild: ProductApiResource = { ...stubChildApi, id: 30, parent_id: 20, title: 'Token Store', children: [] };
    const child: ProductApiResource = { ...stubChildApi, children: [grandchild] };
    const root: ProductApiResource = { ...stubProductApi, children: [child] };
    const lines = exportPbsToText([mapProduct(root)]).split('\n');
    expect(lines[2]).toBe('    Token Store');
  });
});
