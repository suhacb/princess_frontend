import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { DocumentVersionHistoryDialogComponent } from './document-version-history-dialog.component';
import { DocumentService } from '../../services/document.service';

function setup(data: { projectId: number; docId: number } = { projectId: 3, docId: 1 }): {
  fixture: ComponentFixture<DocumentVersionHistoryDialogComponent>;
  dialogRef: { close: ReturnType<typeof vi.fn> };
  documentService: { listVersions: ReturnType<typeof vi.fn> };
} {
  const dialogRef = { close: vi.fn() };
  const documentService = {
    selectedDocument: signal(null).asReadonly(),
    listVersions: vi.fn().mockReturnValue(of({ versions: [], currentPage: 1, lastPage: 1, total: 0 })),
    revertVersion: vi.fn().mockReturnValue(of({})),
    download: vi.fn(),
  };

  TestBed.configureTestingModule({
    imports: [DocumentVersionHistoryDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: data },
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: DocumentService, useValue: documentService },
      { provide: MatDialog, useValue: { open: vi.fn() } },
    ],
  });

  const fixture = TestBed.createComponent(DocumentVersionHistoryDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef, documentService };
}

describe('DocumentVersionHistoryDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders the dialog title', () => {
    const { fixture } = setup();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2')?.textContent).toContain('Version History');
  });

  it('passes projectId and docId through to the version list', () => {
    const { documentService } = setup({ projectId: 7, docId: 42 });
    expect(documentService.listVersions).toHaveBeenCalledWith(7, 42, 1);
  });

  it('closes the dialog when Close is clicked', () => {
    const { fixture, dialogRef } = setup();
    const el = fixture.nativeElement as HTMLElement;
    const closeBtn = Array.from(el.querySelectorAll<HTMLButtonElement>('button'))
      .find(b => b.textContent?.includes('Close'));
    closeBtn?.click();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
