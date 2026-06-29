import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { DocumentDetailComponent } from './document-detail.component';
import { DocumentService } from '../../services/document.service';
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
  owner: { id: 5, name: 'Alice' },
  currentVersion: {
    id: 12,
    documentId: 1,
    versionNumber: 1,
    fileName: 'brief.docx',
    fileSize: 204800,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    comment: 'Initial upload',
    uploadedBy: { id: 5, name: 'Alice' },
    uploadedAt: new Date('2026-06-01T10:00:00Z'),
  },
  versionCount: 1,
  createdAt: new Date('2026-06-01T09:00:00Z'),
  updatedAt: new Date('2026-06-01T09:00:00Z'),
};

function setup(doc: Document | null = stubDoc) {
  const docSignal = signal(doc);
  const documentService = {
    selectedDocument: docSignal.asReadonly(),
    loading: signal(false).asReadonly(),
    uploading: signal(false).asReadonly(),
    load: vi.fn().mockReturnValue(of(doc)),
    update: vi.fn().mockReturnValue(of(doc)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    uploadVersion: vi.fn().mockReturnValue(of({})),
    download: vi.fn(),
  };
  const dialog = { open: vi.fn().mockReturnValue({ afterClosed: () => of(undefined) }) };

  TestBed.configureTestingModule({
    imports: [DocumentDetailComponent, BrowserAnimationsModule],
    providers: [
      { provide: DocumentService, useValue: documentService },
      { provide: MatDialog, useValue: dialog },
    ],
  });

  const fixture: ComponentFixture<DocumentDetailComponent> = TestBed.createComponent(DocumentDetailComponent);
  fixture.componentRef.setInput('docId', 1);
  fixture.componentRef.setInput('projectId', 3);
  fixture.detectChanges();
  return { fixture, documentService, dialog };
}

describe('DocumentDetailComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls load on init', () => {
    const { documentService } = setup();
    expect(documentService.load).toHaveBeenCalledWith(3, 1);
  });

  it('renders document title', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Project Brief');
  });

  it('renders status chip', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('app-document-status-chip')).toBeTruthy();
  });

  it('renders category and type meta', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Initiation');
    expect(fixture.nativeElement.textContent).toContain('Project Brief');
  });

  it('renders current version file name', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('brief.docx');
  });

  it('renders version comment', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Initial upload');
  });

  it('shows Submit for Review transition for draft', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Submit for Review');
  });

  it('shows no transitions for superseded', () => {
    const { fixture } = setup({ ...stubDoc, status: 'superseded' });
    expect(fixture.nativeElement.textContent).toContain('No further transitions available');
  });

  it('renders owner name', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('renders no-version message when currentVersion is null', () => {
    const { fixture } = setup({ ...stubDoc, currentVersion: null });
    expect(fixture.nativeElement.textContent).toContain('No file uploaded yet');
  });

  it('calls download on download button click', () => {
    const { fixture, documentService } = setup();
    const btn = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((b: any) => b.textContent?.includes('Download')) as HTMLButtonElement | undefined;
    btn?.click();
    expect(documentService.download).toHaveBeenCalledWith(3, 1);
  });

  it('upload button triggers openUploadDialog', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    const spy = vi.spyOn(comp, 'openUploadDialog').mockImplementation(() => {});
    const btn = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((b: any) => b.textContent?.includes('Upload new version')) as HTMLButtonElement | undefined;
    btn?.click();
    expect(spy).toHaveBeenCalled();
  });
});
