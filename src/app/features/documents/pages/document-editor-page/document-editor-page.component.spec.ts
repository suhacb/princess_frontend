import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { DocumentEditorPageComponent } from './document-editor-page.component';
import { DocumentService } from '../../services/document.service';
import { ProjectService } from '../../../projects/services/project.service';

const stubConfig = {
  document: { fileType: 'docx', key: 'key1', title: 'Project Brief', url: 'https://s3/file' },
  documentType: 'word',
  editorConfig: { callbackUrl: 'https://api/callback', user: { id: 'u1', name: 'Alice' }, lang: 'en' },
  token: 'jwt',
};

const stubProject = { id: 3, name: 'Project A' };

function setup(options: {
  config?: object | 'error';
  projectId?: number | null;
  docId?: number | null;
} = {}) {
  const { config = stubConfig, projectId = 3, docId = 1 } = options;

  const documentService = {
    loadEditorConfig: vi.fn().mockReturnValue(
      config === 'error'
        ? throwError(() => new Error('fail'))
        : of(config),
    ),
  };

  const projectService = {
    selectedProject: signal(projectId !== null ? { ...stubProject, id: projectId } : null).asReadonly(),
  };

  const router = { navigate: vi.fn() };

  const activatedRoute = {
    snapshot: { params: docId !== null ? { docId: String(docId) } : {} },
  };

  (globalThis as any).DocsAPI = {
    DocEditor: vi.fn().mockReturnValue({ destroyEditor: vi.fn() }),
  };

  TestBed.configureTestingModule({
    imports: [DocumentEditorPageComponent, BrowserAnimationsModule],
    providers: [
      { provide: DocumentService, useValue: documentService },
      { provide: ProjectService, useValue: projectService },
      { provide: Router, useValue: router },
      { provide: ActivatedRoute, useValue: activatedRoute },
    ],
  });

  const fixture: ComponentFixture<DocumentEditorPageComponent> = TestBed.createComponent(DocumentEditorPageComponent);
  fixture.detectChanges();
  return { fixture, documentService, projectService, router };
}

describe('DocumentEditorPageComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    delete (globalThis as any).DocsAPI;
    document.querySelectorAll('script[src*="onlyoffice"]').forEach(s => s.remove());
  });

  it('calls loadEditorConfig with project and doc ids', () => {
    const { documentService } = setup();
    expect(documentService.loadEditorConfig).toHaveBeenCalledWith(3, 1);
  });

  it('is loading while script is pending', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.loading()).toBe(true);
  });

  it('sets error when loadEditorConfig fails', () => {
    const { fixture } = setup({ config: 'error' });
    const comp = fixture.componentInstance as any;
    expect(comp.error()).toBe('Failed to load editor configuration.');
    expect(comp.loading()).toBe(false);
  });

  it('sets error when project is missing', () => {
    const { fixture } = setup({ projectId: null });
    const comp = fixture.componentInstance as any;
    expect(comp.error()).toBe('Could not determine project or document.');
    expect(comp.loading()).toBe(false);
  });

  it('renders error message when error is set', () => {
    const { fixture } = setup({ config: 'error' });
    expect(fixture.nativeElement.textContent).toContain('Failed to load editor configuration');
  });

  it('renders toolbar back button', () => {
    const { fixture } = setup();
    const backBtn = fixture.nativeElement.querySelector('button[aria-label="Back to document"]');
    expect(backBtn).toBeTruthy();
  });

  it('goBack() navigates to document detail', () => {
    const { fixture, router } = setup();
    const comp = fixture.componentInstance as any;
    comp.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/p', 3, 'documents', '1']);
  });

  it('destroyEditor is called on destroy when editor is set', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    const destroySpy = vi.fn();
    comp.editor = { destroyEditor: destroySpy };
    fixture.destroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('sets error when docId is missing from route params', () => {
    const { fixture } = setup({ docId: null });
    const comp = fixture.componentInstance as any;
    expect(comp.error()).toBe('Could not determine project or document.');
    expect(comp.loading()).toBe(false);
  });

  it('sets error when script fails to load', async () => {
    const { fixture, documentService } = setup();
    const comp = fixture.componentInstance as any;

    comp.loading.set(true);
    comp.error.set(null);
    vi.spyOn(comp, 'loadScript').mockRejectedValue(new Error('net::ERR_CONNECTION_REFUSED'));

    comp.initEditor(3, 1);
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(comp.error()).toBe('Failed to load document editor. Is OnlyOffice running?');
    expect(comp.loading()).toBe(false);
    expect(documentService.loadEditorConfig).toHaveBeenCalledTimes(2);
  });

  it('loadScript resolves immediately when script tag already exists', async () => {
    const existing = document.createElement('script');
    existing.src = 'http://localhost:10112/web-apps/apps/api/documents/api.js';
    document.head.appendChild(existing);

    const { documentService } = setup();
    expect(documentService.loadEditorConfig).toHaveBeenCalled();
    existing.remove();
  });

  it('goBack() falls back to navigate(..) when project is missing', () => {
    const { fixture, router } = setup({ projectId: null });
    const comp = fixture.componentInstance as any;
    comp.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['..'], expect.objectContaining({ relativeTo: expect.anything() }));
  });

  it('ngOnDestroy removes the script tag', () => {
    const script = document.createElement('script');
    script.src = 'http://localhost:10112/web-apps/apps/api/documents/api.js';
    document.head.appendChild(script);

    const { fixture } = setup();
    fixture.destroy();

    expect(document.querySelector('script[src*="onlyoffice"]')).toBeNull();
  });
});
