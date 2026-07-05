import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
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
  tags: ['phase1'],
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
    classify: vi.fn().mockReturnValue(of(doc)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    uploadVersion: vi.fn().mockReturnValue(of({})),
    download: vi.fn(),
    listVersions: vi.fn().mockReturnValue(of([])),
    revertVersion: vi.fn().mockReturnValue(of({})),
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
    const btn = fixture.nativeElement.querySelector('.version-actions button') as HTMLButtonElement | null;
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

  it('upload button is disabled when document is confirmed', () => {
    const { fixture } = setup({ ...stubDoc, status: 'confirmed' });
    const btn = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((b: any) => b.textContent?.includes('Upload new version')) as HTMLButtonElement | undefined;
    expect(btn?.disabled).toBe(true);
  });

  it('save() calls documentService.update with form values', () => {
    const { fixture, documentService } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ title: 'New Title' });
    comp.form.markAsDirty();
    comp.save();
    expect(documentService.update).toHaveBeenCalledWith(3, 1, expect.objectContaining({ title: 'New Title' }));
  });

  it('save() sets saveError on failure', () => {
    const { fixture, documentService } = setup();
    documentService.update.mockReturnValue(throwError(() => new Error('fail')));
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ title: 'Bad' });
    comp.save();
    fixture.detectChanges();
    expect(comp.saveError()).toBe('Save failed. Please try again.');
    expect(fixture.nativeElement.textContent).toContain('Save failed');
  });

  it('transitionStatus() calls documentService.update with the target status', () => {
    const { fixture, documentService } = setup();
    const comp = fixture.componentInstance as any;
    comp.transitionStatus('in_review');
    expect(documentService.update).toHaveBeenCalledWith(3, 1, { status: 'in_review' });
  });

  it('transitionStatus() sets actionError on failure', () => {
    const { fixture, documentService } = setup();
    documentService.update.mockReturnValue(throwError(() => new Error('fail')));
    const comp = fixture.componentInstance as any;
    comp.transitionStatus('in_review');
    fixture.detectChanges();
    expect(comp.actionError()).toBe('Status update failed. Please try again.');
  });

  it('deleteDocument() calls documentService.remove and emits documentDeleted', () => {
    const { fixture, documentService } = setup();
    const emitted = vi.fn();
    fixture.componentInstance.documentDeleted.subscribe(emitted);
    const comp = fixture.componentInstance as any;
    comp.deleteDocument();
    expect(documentService.remove).toHaveBeenCalledWith(3, 1);
    expect(emitted).toHaveBeenCalled();
  });

  it('deleteDocument() sets actionError on failure', () => {
    const { fixture, documentService } = setup();
    documentService.remove.mockReturnValue(throwError(() => new Error('fail')));
    const comp = fixture.componentInstance as any;
    comp.deleteDocument();
    fixture.detectChanges();
    expect(comp.actionError()).toBe('Delete failed. Please try again.');
  });

  it('classify() calls documentService.classify with parsed tags', () => {
    const { fixture, documentService } = setup();
    const comp = fixture.componentInstance as any;
    comp.classifyForm.patchValue({ tags: 'qa, urgent, phase2' });
    comp.classify();
    expect(documentService.classify).toHaveBeenCalledWith(3, 1, { tags: ['qa', 'urgent', 'phase2'] });
  });

  it('classify() sets classifyError on failure', () => {
    const { fixture, documentService } = setup();
    documentService.classify.mockReturnValue(throwError(() => new Error('fail')));
    const comp = fixture.componentInstance as any;
    comp.classifyForm.patchValue({ tags: 'qa' });
    comp.classify();
    fixture.detectChanges();
    expect(comp.classifyError()).toBe('Classification failed. Please try again.');
    expect(fixture.nativeElement.textContent).toContain('Classification failed');
  });

  it('renders existing tags', () => {
    const { fixture } = setup({ ...stubDoc, tags: ['phase1', 'risk'] });
    expect(fixture.nativeElement.textContent).toContain('phase1');
    expect(fixture.nativeElement.textContent).toContain('risk');
  });

  describe('Edit button', () => {
    it('isEditable() is true for draft doc with editable MIME type', () => {
      const { fixture } = setup();
      expect((fixture.componentInstance as any).isEditable()).toBe(true);
    });

    it('isEditable() is false for confirmed doc', () => {
      const { fixture } = setup({ ...stubDoc, status: 'confirmed' });
      expect((fixture.componentInstance as any).isEditable()).toBe(false);
    });

    it('isEditable() is false for superseded doc', () => {
      const { fixture } = setup({ ...stubDoc, status: 'superseded' });
      expect((fixture.componentInstance as any).isEditable()).toBe(false);
    });

    it('isEditable() is false when currentVersion is null', () => {
      const { fixture } = setup({ ...stubDoc, currentVersion: null });
      expect((fixture.componentInstance as any).isEditable()).toBe(false);
    });

    it('isEditable() is false for non-editable MIME type (PDF)', () => {
      const { fixture } = setup({
        ...stubDoc,
        currentVersion: { ...stubDoc.currentVersion!, mimeType: 'application/pdf' },
      });
      expect((fixture.componentInstance as any).isEditable()).toBe(false);
    });

    it('edit button is rendered in current-version section', () => {
      const { fixture } = setup();
      const buttons = fixture.nativeElement.querySelectorAll('.version-actions button');
      expect(buttons.length).toBe(2);
    });

    it('edit button is disabled when the document is not editable', () => {
      const { fixture } = setup({ ...stubDoc, status: 'confirmed' });
      const buttons = fixture.nativeElement.querySelectorAll('.version-actions button');
      expect((buttons[1] as HTMLButtonElement).disabled).toBe(true);
    });

    it('openEditor() opens the editor route in a new tab', () => {
      const { fixture } = setup();
      const comp = fixture.componentInstance as any;
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      comp.openEditor();
      expect(openSpy).toHaveBeenCalledWith('/editor/3/documents/1', '_blank');
      openSpy.mockRestore();
    });
  });
});
