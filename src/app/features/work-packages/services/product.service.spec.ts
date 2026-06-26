import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProductService } from './product.service';
import { ApiService } from '../../../core/http/api.service';
import { ProductApiResource } from '../contracts/work-package.contracts';

const stubChildApi: ProductApiResource = {
  id: 20, project_id: 7, parent_id: 1, identifier: null,
  title: 'Auth Module', purpose: null, type: 'specialist', status: 'in_development',
  children: [], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
};

const stubProductApi: ProductApiResource = {
  id: 1, project_id: 7, parent_id: null, identifier: 'P001',
  title: 'Backend System', purpose: null, type: 'specialist', status: 'draft',
  children: [stubChildApi], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
};

function setup(overrides: Partial<Record<'get' | 'post' | 'patch' | 'delete', unknown>> = {}) {
  const apiService = {
    get: vi.fn().mockReturnValue(of({ data: [stubProductApi] })),
    post: vi.fn().mockReturnValue(of({ data: stubProductApi })),
    patch: vi.fn().mockReturnValue(of({ data: stubProductApi })),
    delete: vi.fn().mockReturnValue(of(undefined)),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [ProductService, { provide: ApiService, useValue: apiService }],
  });
  return { service: TestBed.inject(ProductService), apiService };
}

describe('ProductService', () => {
  afterEach(() => TestBed.resetTestingModule());

  describe('list()', () => {
    it('populates products signal with tree', () => {
      const { service } = setup();
      service.list(7).subscribe();
      expect(service.products().length).toBe(1);
      expect(service.products()[0].title).toBe('Backend System');
    });

    it('maps nested children', () => {
      const { service } = setup();
      service.list(7).subscribe();
      expect(service.products()[0].children[0].title).toBe('Auth Module');
    });

    it('calls the tree endpoint', () => {
      const { service, apiService } = setup();
      service.list(7).subscribe();
      expect(apiService.get).toHaveBeenCalledWith('/projects/7/products/tree');
    });

    it('sets loading to false after success', () => {
      const { service } = setup();
      service.list(7).subscribe();
      expect(service.loading()).toBe(false);
    });

    it('sets loading to false on error', () => {
      const { service } = setup({ get: vi.fn().mockReturnValue(throwError(() => new Error())) });
      service.list(7).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('create() — root product', () => {
    it('appends root product to signal when parent_id is null', () => {
      const newProd: ProductApiResource = { ...stubProductApi, id: 99, title: 'New Root', parent_id: null, children: [] };
      const { service } = setup({ post: vi.fn().mockReturnValue(of({ data: newProd })) });
      service.list(7).subscribe();
      service.create(7, { title: 'New Root', type: 'specialist' }).subscribe();
      expect(service.products().length).toBe(2);
      expect(service.products()[1].title).toBe('New Root');
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.create(7, { title: 'New', type: 'specialist' }).subscribe();
      expect(apiService.post).toHaveBeenCalledWith('/projects/7/products', expect.objectContaining({
        title: 'New',
        type: 'specialist',
      }));
    });
  });

  describe('create() — child product', () => {
    it('appends child product to parent in signal', () => {
      const childProd: ProductApiResource = { ...stubProductApi, id: 50, title: 'Child', parent_id: 1, children: [] };
      const { service } = setup({ post: vi.fn().mockReturnValue(of({ data: childProd })) });
      service.list(7).subscribe();
      service.create(7, { title: 'Child', type: 'specialist', parent_id: 1 }).subscribe();
      const parent = service.products()[0];
      expect(parent.children.length).toBe(2);
      expect(parent.children[1].title).toBe('Child');
    });
  });

  describe('update()', () => {
    it('updates product title while preserving children', () => {
      const updated: ProductApiResource = { ...stubProductApi, title: 'Renamed', children: [] };
      const { service } = setup({ patch: vi.fn().mockReturnValue(of({ data: updated })) });
      service.list(7).subscribe();
      service.update(7, 1, { title: 'Renamed' }).subscribe();
      const p = service.products()[0];
      expect(p.title).toBe('Renamed');
      expect(p.children.length).toBe(1);
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.update(7, 1, { title: 'Renamed' }).subscribe();
      expect(apiService.patch).toHaveBeenCalledWith('/projects/7/products/1', expect.any(Object));
    });
  });

  describe('remove()', () => {
    it('removes root product from signal', () => {
      const { service } = setup();
      service.list(7).subscribe();
      service.remove(7, 1).subscribe();
      expect(service.products().length).toBe(0);
    });

    it('removes child product from parent', () => {
      const { service } = setup();
      service.list(7).subscribe();
      service.remove(7, 20).subscribe();
      expect(service.products()[0].children.length).toBe(0);
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.remove(7, 1).subscribe();
      expect(apiService.delete).toHaveBeenCalledWith('/projects/7/products/1');
    });
  });

  describe('baseline()', () => {
    it('updates product status to baselined', () => {
      const baselined: ProductApiResource = { ...stubProductApi, status: 'baselined', children: [] };
      const { service } = setup({ post: vi.fn().mockReturnValue(of({ data: baselined })) });
      service.list(7).subscribe();
      service.baseline(7, 1).subscribe();
      expect(service.products()[0].status).toBe('baselined');
    });

    it('calls correct endpoint', () => {
      const { service, apiService } = setup();
      service.baseline(7, 1).subscribe();
      expect(apiService.post).toHaveBeenCalledWith('/projects/7/products/1/baseline', {});
    });
  });
});
