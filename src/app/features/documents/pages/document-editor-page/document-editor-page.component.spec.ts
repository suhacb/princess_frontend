import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DocumentEditorPageComponent } from './document-editor-page.component';
import { DocumentService } from '../../services/document.service';

const stubConfig = {
  document: { fileType: 'docx', key: 'key1', title: 'Project Brief', url: 'https://s3/file' },
  documentType: 'word',
  editorConfig: { callbackUrl: 'https://api/callback', user: { id: 'u1', name: 'Alice' }, lang: 'en' },
  token: 'jwt',
};

function setup(options: {
  config?: object | 'error';
  projectId?: number | null;
  docId?: number | null;
  versionId?: number | null;
  view?: boolean;
  errorStatus?: number;
} = {}) {
  const { config = stubConfig, projectId = 3, docId = 1, versionId = null, view = false, errorStatus } = options;

  const documentService = {
    loadEditorConfig: vi.fn().mockReturnValue(
      config === 'error'
        ? throwError(() => ({ status: errorStatus, message: 'fail' }))
        : of(config),
    ),
  };

  const activatedRoute = {
    snapshot: {
      params: {
        ...(projectId !== null ? { projectId: String(projectId) } : {}),
        ...(docId !== null ? { docId: String(docId) } : {}),
      },
      queryParams: {
        ...(versionId !== null ? { versionId: String(versionId) } : {}),
        ...(view ? { view: '1' } : {}),
      },
    },
  };

  (globalThis as any).DocsAPI = {
    DocEditor: vi.fn().mockReturnValue({ destroyEditor: vi.fn() }),
  };

  TestBed.configureTestingModule({
    imports: [DocumentEditorPageComponent, BrowserAnimationsModule],
    providers: [
      { provide: DocumentService, useValue: documentService },
      { provide: ActivatedRoute, useValue: activatedRoute },
    ],
  });

  const fixture: ComponentFixture<DocumentEditorPageComponent> = TestBed.createComponent(DocumentEditorPageComponent);
  fixture.detectChanges();
  return { fixture, documentService };
}

describe('DocumentEditorPageComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    delete (globalThis as any).DocsAPI;
    document.querySelectorAll('script[src*="onlyoffice"]').forEach(s => s.remove());
  });

  it('calls loadEditorConfig with project and doc ids', () => {
    const { documentService } = setup();
    expect(documentService.loadEditorConfig).toHaveBeenCalledWith(3, 1, undefined);
  });

  it('calls loadEditorConfig with versionId when present in query params', () => {
    const { documentService } = setup({ versionId: 12 });
    expect(documentService.loadEditorConfig).toHaveBeenCalledWith(3, 1, 12);
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

  it('sets a version-specific error when loadEditorConfig 404s for a stale versionId', () => {
    const { fixture } = setup({ config: 'error', versionId: 12, errorStatus: 404 });
    const comp = fixture.componentInstance as any;
    expect(comp.error()).toBe('This version could not be found. It may have been removed.');
  });

  it('sets a version-specific error when loadEditorConfig 422s for a stale versionId', () => {
    const { fixture } = setup({ config: 'error', versionId: 12, errorStatus: 422 });
    const comp = fixture.componentInstance as any;
    expect(comp.error()).toBe('This version could not be found. It may have been removed.');
  });

  it('sets the generic error for a 404 when no versionId was requested', () => {
    const { fixture } = setup({ config: 'error', errorStatus: 404 });
    const comp = fixture.componentInstance as any;
    expect(comp.error()).toBe('Failed to load editor configuration.');
  });

  it('sets error when project is missing from route params', () => {
    const { fixture } = setup({ projectId: null });
    const comp = fixture.componentInstance as any;
    expect(comp.error()).toBe('Could not determine project or document.');
    expect(comp.loading()).toBe(false);
  });

  it('renders error message when error is set', () => {
    const { fixture } = setup({ config: 'error' });
    expect(fixture.nativeElement.textContent).toContain('Failed to load editor configuration');
  });

  it('renders a close button when an error occurs', () => {
    const { fixture } = setup({ config: 'error' });
    const closeBtn = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((b: any) => b.textContent?.includes('Close')) as HTMLButtonElement | undefined;
    expect(closeBtn).toBeTruthy();
  });

  it('closeTab() calls window.close()', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {});
    comp.closeTab();
    expect(closeSpy).toHaveBeenCalled();
    closeSpy.mockRestore();
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

  it('ngOnDestroy removes the script tag', () => {
    const script = document.createElement('script');
    script.src = 'http://localhost:10112/web-apps/apps/api/documents/api.js';
    document.head.appendChild(script);

    const { fixture } = setup();
    fixture.destroy();

    expect(document.querySelector('script[src*="onlyoffice"]')).toBeNull();
  });
});
