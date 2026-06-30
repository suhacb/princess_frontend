import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TemplateNodeDetailComponent } from './template-node-detail.component';
import { DocumentTemplateService } from '../../services/document-template.service';
import { DocumentTemplateNode } from '../../contracts/document-template.contracts';

const stubRootNode: DocumentTemplateNode = {
  id: 1, parentId: null, level: 'project', category: null, type: null,
  name: 'Root Template', description: 'Root desc', fileName: null, s3Key: null,
  settings: { fontFamily: 'Arial', fontSize: 11, primaryColor: '#003399' },
  kind: 'root', categoryLabel: null, typeLabel: null,
  createdAt: new Date(), updatedAt: new Date(),
  children: [], effectiveSettings: { fontFamily: 'Arial', fontSize: 11, primaryColor: '#003399' },
};

const stubTypeNode: DocumentTemplateNode = {
  ...stubRootNode,
  id: 3, parentId: 2, category: 'initiation', type: 'project_brief',
  name: 'Project Brief Template',
  fileName: 'brief.docx', s3Key: 'templates/brief.docx',
  settings: { primaryColor: '#FF0000' },
  kind: 'type', categoryLabel: 'Initiation', typeLabel: 'Project Brief',
  effectiveSettings: { fontFamily: 'Arial', fontSize: 11, primaryColor: '#FF0000' },
};

function setup(node: DocumentTemplateNode) {
  const templateService = {
    saving: signal(false).asReadonly(),
    tree: signal([]).asReadonly(),
    update: vi.fn().mockReturnValue(of(node)),
    uploadFile: vi.fn().mockReturnValue(of(node)),
    remove: vi.fn().mockReturnValue(of(undefined)),
    create: vi.fn().mockReturnValue(of(node)),
  };
  const dialogSpy = { open: vi.fn().mockReturnValue({ afterClosed: () => of(null) }) };

  TestBed.configureTestingModule({
    imports: [TemplateNodeDetailComponent, BrowserAnimationsModule],
    providers: [
      { provide: DocumentTemplateService, useValue: templateService },
      { provide: MatDialog, useValue: dialogSpy },
    ],
  });

  const fixture: ComponentFixture<TemplateNodeDetailComponent> =
    TestBed.createComponent(TemplateNodeDetailComponent);
  fixture.componentRef.setInput('node', node);
  fixture.componentRef.setInput('projectId', 3);
  fixture.detectChanges();
  return { fixture, templateService, dialogSpy };
}

describe('TemplateNodeDetailComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders node kind badge with correct kind', () => {
    const { fixture } = setup(stubRootNode);
    expect(fixture.nativeElement.querySelector('.node-kind-badge').textContent.trim()).toBe('root');
  });

  it('shows category label breadcrumb for type nodes', () => {
    const { fixture } = setup(stubTypeNode);
    expect(fixture.nativeElement.textContent).toContain('Initiation');
    expect(fixture.nativeElement.textContent).toContain('Project Brief');
  });

  it('populates form with node own settings on init', () => {
    const { fixture } = setup(stubRootNode);
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="fontFamily"]');
    expect(input.value).toBe('Arial');
  });

  it('shows "Add child" button for non-leaf nodes', () => {
    const { fixture } = setup(stubRootNode);
    expect(fixture.nativeElement.textContent).toContain('Add child');
  });

  it('does not show "Add child" button for type (leaf) nodes', () => {
    const { fixture } = setup(stubTypeNode);
    expect(fixture.nativeElement.textContent).not.toContain('Add child');
  });

  it('shows file upload section only for type nodes', () => {
    const { fixture } = setup(stubTypeNode);
    expect(fixture.nativeElement.querySelector('input[type="file"]')).not.toBeNull();
  });

  it('does not show file upload section for non-leaf nodes', () => {
    const { fixture } = setup(stubRootNode);
    expect(fixture.nativeElement.querySelector('input[type="file"]')).toBeNull();
  });

  it('shows existing file name for type nodes with a file', () => {
    const { fixture } = setup(stubTypeNode);
    expect(fixture.nativeElement.textContent).toContain('brief.docx');
  });

  it('calls templateService.update on save with dirty form', () => {
    const { fixture, templateService } = setup(stubRootNode);
    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="name"]');
    nameInput.value = 'New Name';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const saveBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    saveBtn.click();
    fixture.detectChanges();
    expect(templateService.update).toHaveBeenCalledWith(3, 1, expect.objectContaining({ name: 'New Name' }));
  });

  it('opens delete dialog on delete button click', () => {
    const { fixture, dialogSpy } = setup(stubRootNode);
    const deleteBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="warn"]');
    deleteBtn.click();
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
