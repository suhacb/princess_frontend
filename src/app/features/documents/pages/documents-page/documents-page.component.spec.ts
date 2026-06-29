import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { DocumentsPageComponent } from './documents-page.component';
import { DocumentService } from '../../services/document.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Document } from '../../contracts/document.contracts';

const stubDoc: Document = {
  id: 1,
  projectId: 3,
  title: 'Project Brief',
  type: 'project_brief',
  typeLabel: 'Project Brief',
  category: 'initiation',
  categoryLabel: 'Initiation',
  status: 'draft',
  tags: [],
  owner: { id: 5, name: 'Alice' },
  currentVersion: {
    id: 12,
    documentId: 1,
    versionNumber: 2,
    fileName: 'brief.docx',
    fileSize: 204800,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    comment: null,
    uploadedBy: { id: 5, name: 'Alice' },
    uploadedAt: new Date('2026-06-01T10:00:00Z'),
  },
  versionCount: 2,
  createdAt: new Date('2026-06-01T09:00:00Z'),
  updatedAt: new Date('2026-06-28T10:00:00Z'),
};

const confirmedDoc: Document = {
  ...stubDoc,
  id: 2,
  title: 'Project Plan',
  type: 'project_plan',
  typeLabel: 'Project Plan',
  category: 'planning',
  categoryLabel: 'Planning',
  status: 'confirmed',
};

function setup(docs: Document[] = [], docId: string | null = null) {
  const docsSignal = signal(docs);
  const selectedDocSignal = signal<Document | null>(stubDoc);
  const documentService = {
    documents: docsSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    selectedDocument: selectedDocSignal.asReadonly(),
    uploading: signal(false).asReadonly(),
    list: vi.fn().mockReturnValue(of(docs)),
    create: vi.fn().mockReturnValue(of(stubDoc)),
    load: vi.fn().mockReturnValue(of(stubDoc)),
    update: vi.fn().mockReturnValue(of(stubDoc)),
    classify: vi.fn().mockReturnValue(of(stubDoc)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    uploadVersion: vi.fn().mockReturnValue(of({})),
    download: vi.fn(),
    listVersions: vi.fn().mockReturnValue(of([])),
    revertVersion: vi.fn().mockReturnValue(of({})),
  };
  const projectService = {
    selectedProject: signal({ id: 3, name: 'Test Project' } as never).asReadonly(),
  };
  const route = {
    snapshot: { params: docId ? { docId } : {} },
    params: of(docId ? { docId } : {}),
  };

  TestBed.configureTestingModule({
    imports: [DocumentsPageComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: DocumentService, useValue: documentService },
      { provide: ProjectService, useValue: projectService },
      { provide: ActivatedRoute, useValue: route },
    ],
  });

  const fixture: ComponentFixture<DocumentsPageComponent> = TestBed.createComponent(DocumentsPageComponent);
  fixture.detectChanges();
  return { fixture, documentService };
}

describe('DocumentsPageComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls list on init', () => {
    const { documentService } = setup();
    expect(documentService.list).toHaveBeenCalledWith(3, {});
  });

  it('shows empty state when no documents', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders document title', () => {
    const { fixture } = setup([stubDoc]);
    expect(fixture.nativeElement.textContent).toContain('Project Brief');
  });

  it('renders category label with colour class', () => {
    const { fixture } = setup([stubDoc]);
    expect(fixture.nativeElement.querySelector('.cat-initiation')).toBeTruthy();
  });

  it('renders status chip', () => {
    const { fixture } = setup([stubDoc]);
    expect(fixture.nativeElement.querySelector('app-document-status-chip')).toBeTruthy();
  });

  it('renders version info', () => {
    const { fixture } = setup([stubDoc]);
    expect(fixture.nativeElement.textContent).toContain('v2');
  });

  it('renders owner name', () => {
    const { fixture } = setup([stubDoc]);
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('filters by category', () => {
    const { fixture } = setup([stubDoc, confirmedDoc]);
    const comp = fixture.componentInstance as any;
    comp.categoryFilter.set('planning');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.doc-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Project Plan');
  });

  it('filters by status', () => {
    const { fixture } = setup([stubDoc, confirmedDoc]);
    const comp = fixture.componentInstance as any;
    comp.statusFilter.set('confirmed');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.doc-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Project Plan');
  });

  it('filters by type', () => {
    const { fixture } = setup([stubDoc, confirmedDoc]);
    const comp = fixture.componentInstance as any;
    comp.typeFilter.set('project_brief');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.doc-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Project Brief');
  });

  it('filters by search query', () => {
    const { fixture } = setup([stubDoc, confirmedDoc]);
    const comp = fixture.componentInstance as any;
    comp.searchQuery.set('plan');
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.doc-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Project Plan');
  });

  it('shows detail pane when docId is set', () => {
    const { fixture } = setup([stubDoc], '1');
    expect(fixture.nativeElement.querySelector('app-document-detail')).toBeTruthy();
  });

  it('does not show detail pane when no docId', () => {
    const { fixture } = setup([stubDoc]);
    expect(fixture.nativeElement.querySelector('app-document-detail')).toBeFalsy();
  });

  it('navigates to document on row click', () => {
    const { fixture } = setup([stubDoc]);
    const comp = fixture.componentInstance as any;
    const navigateSpy = vi.spyOn(comp['router'], 'navigate').mockImplementation(() => Promise.resolve(true));
    const row = fixture.nativeElement.querySelector('.doc-row');
    row?.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/p', 3, 'documents', 1]);
  });

  it('closeDetail() navigates to the documents list route', () => {
    const { fixture } = setup([stubDoc], '1');
    const comp = fixture.componentInstance as any;
    const navigateSpy = vi.spyOn(comp['router'], 'navigate').mockImplementation(() => Promise.resolve(true));
    comp.closeDetail();
    expect(navigateSpy).toHaveBeenCalledWith(['/p', 3, 'documents']);
  });

  it('openCreateDialog() opens CreateDocumentDialogComponent', () => {
    const { fixture } = setup([stubDoc]);
    const comp = fixture.componentInstance as any;
    const openSpy = vi.spyOn(comp['dialog'], 'open').mockReturnValue({
      afterClosed: () => of(undefined),
    });
    comp.openCreateDialog();
    expect(openSpy).toHaveBeenCalled();
  });
});
