import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DocumentTemplateService } from './document-template.service';
import { ApiService } from '../../../core/http/api.service';
import { DocumentTemplateApiResource } from '../contracts/document-template.contracts';

const stubApi: DocumentTemplateApiResource = {
  id: 1,
  parent_id: null,
  level: 'project',
  category: null,
  type: null,
  name: 'Root Template',
  description: null,
  file_name: null,
  s3_key: null,
  settings: { fontFamily: 'Arial', fontSize: 11 },
  created_at: '2026-06-01T09:00:00Z',
  updated_at: '2026-06-01T09:00:00Z',
};

const stubCategoryApi: DocumentTemplateApiResource = {
  ...stubApi,
  id: 2,
  parent_id: 1,
  category: 'initiation',
  type: null,
  name: 'Initiation Templates',
  settings: {},
};

const stubTypeApi: DocumentTemplateApiResource = {
  ...stubApi,
  id: 3,
  parent_id: 2,
  category: 'initiation',
  type: 'project_brief',
  name: 'Project Brief Template',
  file_name: 'project_brief.docx',
  s3_key: 'templates/project_brief.docx',
  settings: { primaryColor: '#003399' },
};

function setup() {
  const apiMock = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  TestBed.configureTestingModule({
    providers: [
      DocumentTemplateService,
      { provide: ApiService, useValue: apiMock },
    ],
  });
  const service = TestBed.inject(DocumentTemplateService);
  return { service, apiMock };
}

describe('DocumentTemplateService', () => {
  afterEach(() => TestBed.resetTestingModule());

  describe('list()', () => {
    it('populates templates signal and clears loading on success', () => {
      const { service, apiMock } = setup();
      apiMock.get.mockReturnValue(of({ data: [stubApi, stubCategoryApi, stubTypeApi] }));
      service.list(3).subscribe();
      expect(service.templates().length).toBe(3);
      expect(service.loading()).toBe(false);
    });

    it('builds tree with root → category → type', () => {
      const { service, apiMock } = setup();
      apiMock.get.mockReturnValue(of({ data: [stubApi, stubCategoryApi, stubTypeApi] }));
      service.list(3).subscribe();
      const roots = service.tree();
      expect(roots.length).toBe(1);
      expect(roots[0].kind).toBe('root');
      expect(roots[0].children.length).toBe(1);
      expect(roots[0].children[0].kind).toBe('category');
      expect(roots[0].children[0].children[0].kind).toBe('type');
    });

    it('propagates effective settings from root down to type', () => {
      const { service, apiMock } = setup();
      apiMock.get.mockReturnValue(of({ data: [stubApi, stubCategoryApi, stubTypeApi] }));
      service.list(3).subscribe();
      const leaf = service.tree()[0].children[0].children[0];
      expect(leaf.effectiveSettings.fontFamily).toBe('Arial');
      expect(leaf.effectiveSettings.primaryColor).toBe('#003399');
    });

    it('sets loading false on error', () => {
      const { service, apiMock } = setup();
      apiMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.list(3).subscribe({ error: () => {} });
      expect(service.loading()).toBe(false);
    });
  });

  describe('create()', () => {
    it('appends new template to signal', () => {
      const { service, apiMock } = setup();
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      apiMock.post.mockReturnValue(of({ data: stubCategoryApi }));
      service.list(3).subscribe();
      service.create(3, { name: 'Initiation Templates', parent_id: 1, category: 'initiation' }).subscribe();
      expect(service.templates().length).toBe(2);
      expect(service.saving()).toBe(false);
    });

    it('sets saving false on error', () => {
      const { service, apiMock } = setup();
      apiMock.post.mockReturnValue(throwError(() => new Error('fail')));
      service.create(3, { name: 'Test' }).subscribe({ error: () => {} });
      expect(service.saving()).toBe(false);
    });
  });

  describe('update()', () => {
    it('replaces template in signal with updated version', () => {
      const { service, apiMock } = setup();
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      const updatedApi = { ...stubApi, name: 'Updated Root' };
      apiMock.put.mockReturnValue(of({ data: updatedApi }));
      service.list(3).subscribe();
      service.update(3, 1, { name: 'Updated Root' }).subscribe();
      expect(service.templates()[0].name).toBe('Updated Root');
    });
  });

  describe('remove()', () => {
    it('removes template from signal', () => {
      const { service, apiMock } = setup();
      apiMock.get.mockReturnValue(of({ data: [stubApi, stubCategoryApi] }));
      apiMock.delete.mockReturnValue(of(undefined));
      service.list(3).subscribe();
      service.remove(3, 2).subscribe();
      expect(service.templates().find(t => t.id === 2)).toBeUndefined();
    });

    it('clears selection when selected template is removed', () => {
      const { service, apiMock } = setup();
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      apiMock.delete.mockReturnValue(of(undefined));
      service.list(3).subscribe();
      service.select(1);
      service.remove(3, 1).subscribe();
      expect(service.selectedId()).toBeNull();
    });
  });

  describe('select()', () => {
    it('sets selectedId and resolves selected node from tree', () => {
      const { service, apiMock } = setup();
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(3).subscribe();
      service.select(1);
      expect(service.selectedId()).toBe(1);
      expect(service.selected()?.name).toBe('Root Template');
    });

    it('returns null when no id selected', () => {
      const { service, apiMock } = setup();
      apiMock.get.mockReturnValue(of({ data: [stubApi] }));
      service.list(3).subscribe();
      expect(service.selected()).toBeNull();
    });
  });

  describe('uploadFile()', () => {
    it('updates template fileName after upload', () => {
      const { service, apiMock } = setup();
      apiMock.get.mockReturnValue(of({ data: [stubTypeApi] }));
      const updatedApi = { ...stubTypeApi, file_name: 'new_brief.docx', s3_key: 'templates/new_brief.docx' };
      apiMock.post.mockReturnValue(of({ data: updatedApi }));
      service.list(3).subscribe();
      const file = new File([''], 'new_brief.docx');
      service.uploadFile(3, 3, file).subscribe();
      expect(service.templates().find(t => t.id === 3)?.fileName).toBe('new_brief.docx');
    });
  });
});
