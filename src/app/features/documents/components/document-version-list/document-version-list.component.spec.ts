import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { DocumentVersionListComponent } from './document-version-list.component';
import { DocumentService } from '../../services/document.service';
import { Document, DocumentVersion } from '../../contracts/document.contracts';

const stubVersion1: DocumentVersion = {
  id: 12,
  documentId: 1,
  versionNumber: 1,
  fileName: 'brief_v1.docx',
  fileSize: 1024,
  mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  comment: 'Initial upload',
  uploadedBy: { id: 5, name: 'Alice' },
  uploadedAt: new Date('2026-06-01T10:00:00Z'),
};

const stubVersion2: DocumentVersion = {
  id: 13,
  documentId: 1,
  versionNumber: 2,
  fileName: 'brief_v2.docx',
  fileSize: 2048,
  mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  comment: null,
  uploadedBy: { id: 5, name: 'Alice' },
  uploadedAt: new Date('2026-06-02T10:00:00Z'),
};

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
  owner: null,
  currentVersion: stubVersion2,
  versionCount: 2,
  createdAt: new Date('2026-06-01T09:00:00Z'),
  updatedAt: new Date('2026-06-02T10:00:00Z'),
};

function setup(
  doc: Document | null = stubDoc,
  versions: DocumentVersion[] = [stubVersion2, stubVersion1],
) {
  const docSignal = signal(doc);
  const documentService = {
    selectedDocument: docSignal.asReadonly(),
    listVersions: vi.fn().mockReturnValue(of(versions)),
    revertVersion: vi.fn().mockReturnValue(of(stubVersion2)),
    download: vi.fn(),
  };
  const dialog = { open: vi.fn().mockReturnValue({ afterClosed: () => of(undefined) }) };

  TestBed.configureTestingModule({
    imports: [DocumentVersionListComponent, BrowserAnimationsModule],
    providers: [
      { provide: DocumentService, useValue: documentService },
      { provide: MatDialog, useValue: dialog },
    ],
  });

  const fixture: ComponentFixture<DocumentVersionListComponent> =
    TestBed.createComponent(DocumentVersionListComponent);
  fixture.componentRef.setInput('projectId', 3);
  fixture.componentRef.setInput('docId', 1);
  fixture.detectChanges();
  return { fixture, documentService, dialog, docSignal };
}

describe('DocumentVersionListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls listVersions on init', () => {
    const { documentService } = setup();
    expect(documentService.listVersions).toHaveBeenCalledWith(3, 1);
  });

  it('renders version badges', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('v1');
    expect(fixture.nativeElement.textContent).toContain('v2');
  });

  it('renders file names', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('brief_v1.docx');
    expect(fixture.nativeElement.textContent).toContain('brief_v2.docx');
  });

  it('renders version comment when present', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Initial upload');
  });

  it('renders uploader name', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('shows no-versions message when version list is empty', () => {
    const { fixture } = setup(stubDoc, []);
    expect(fixture.nativeElement.textContent).toContain('No version history yet');
  });

  it('shows error message on load failure', () => {
    const documentService = {
      selectedDocument: signal(stubDoc).asReadonly(),
      listVersions: vi.fn().mockReturnValue(throwError(() => new Error('fail'))),
      revertVersion: vi.fn(),
      download: vi.fn(),
    };
    TestBed.configureTestingModule({
      imports: [DocumentVersionListComponent, BrowserAnimationsModule],
      providers: [
        { provide: DocumentService, useValue: documentService },
        { provide: MatDialog, useValue: { open: vi.fn() } },
      ],
    });
    const fixture = TestBed.createComponent(DocumentVersionListComponent);
    fixture.componentRef.setInput('projectId', 3);
    fixture.componentRef.setInput('docId', 1);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Failed to load version history');
  });

  it('current version row has is-current class', () => {
    const { fixture } = setup();
    const rows = fixture.nativeElement.querySelectorAll('.version-row');
    expect(rows[0].classList.contains('is-current')).toBe(true);
    expect(rows[1].classList.contains('is-current')).toBe(false);
  });

  it('revert button is disabled on current version', () => {
    const { fixture } = setup();
    const rows = fixture.nativeElement.querySelectorAll('.version-row');
    const revertBtn = rows[0].querySelector('button:last-child') as HTMLButtonElement;
    expect(revertBtn.disabled).toBe(true);
  });

  it('revert button is enabled for non-current version of draft doc', () => {
    const { fixture } = setup();
    const rows = fixture.nativeElement.querySelectorAll('.version-row');
    const revertBtn = rows[1].querySelector('button:last-child') as HTMLButtonElement;
    expect(revertBtn.disabled).toBe(false);
  });

  it('revert button is disabled for all versions when doc is confirmed', () => {
    const confirmedDoc: Document = { ...stubDoc, status: 'confirmed' };
    const { fixture } = setup(confirmedDoc);
    const revertBtns = fixture.nativeElement.querySelectorAll('button:last-child');
    for (const btn of Array.from(revertBtns) as HTMLButtonElement[]) {
      expect(btn.disabled).toBe(true);
    }
  });

  it('download button calls documentService.download with versionId', () => {
    const { fixture, documentService } = setup();
    const rows = fixture.nativeElement.querySelectorAll('.version-row');
    const downloadBtn = rows[0].querySelector('button:first-child') as HTMLButtonElement;
    downloadBtn.click();
    expect(documentService.download).toHaveBeenCalledWith(3, 1, stubVersion2.id);
  });

  it('openRevertDialog opens dialog with correct data', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    const mockDialog = { open: vi.fn().mockReturnValue({ afterClosed: () => of(undefined) }) };
    comp['dialog'] = mockDialog;
    comp.openRevertDialog(stubVersion1);
    expect(mockDialog.open).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        data: expect.objectContaining({ fromVersion: 1, toVersion: 3 }),
      }),
    );
  });

  it('calls revertVersion and reloads list on confirm', () => {
    const { fixture, documentService } = setup();
    const comp = fixture.componentInstance as any;
    const mockDialog = { open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }) };
    comp['dialog'] = mockDialog;
    comp.openRevertDialog(stubVersion1);
    expect(documentService.revertVersion).toHaveBeenCalledWith(3, 1, stubVersion1.id);
    expect(documentService.listVersions).toHaveBeenCalledTimes(2);
  });

  it('shows error message when revert fails', () => {
    const { fixture, documentService } = setup();
    const comp = fixture.componentInstance as any;
    const mockDialog = { open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }) };
    comp['dialog'] = mockDialog;
    documentService.revertVersion.mockReturnValue(throwError(() => new Error('fail')));
    comp.openRevertDialog(stubVersion1);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Revert failed');
  });
});
