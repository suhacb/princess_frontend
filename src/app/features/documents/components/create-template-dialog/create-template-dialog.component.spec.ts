import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CreateTemplateDialogComponent,
  CreateTemplateDialogData,
} from './create-template-dialog.component';
import { DocumentTemplateNode } from '../../contracts/document-template.contracts';

const stubRoot: DocumentTemplateNode = {
  id: 1, parentId: null, level: 'project', category: null, type: null,
  name: 'Root', description: null, fileName: null, s3Key: null,
  settings: {}, kind: 'root', categoryLabel: null, typeLabel: null,
  createdAt: new Date(), updatedAt: new Date(),
  children: [], effectiveSettings: {},
};

const stubCategoryNode: DocumentTemplateNode = {
  ...stubRoot,
  id: 2, parentId: 1, category: 'initiation', type: null,
  name: 'Initiation', kind: 'category', categoryLabel: 'Initiation',
};

function setup(data: CreateTemplateDialogData) {
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [CreateTemplateDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: data },
      { provide: MatDialogRef, useValue: dialogRef },
    ],
  });
  const fixture: ComponentFixture<CreateTemplateDialogComponent> =
    TestBed.createComponent(CreateTemplateDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('CreateTemplateDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('shows "Create root template" title when parent is null', () => {
    const { fixture } = setup({ parent: null });
    const title = fixture.nativeElement.querySelector('[mat-dialog-title]');
    expect(title.textContent).toContain('Create root template');
  });

  it('shows "Add category template" title when parent is root', () => {
    const { fixture } = setup({ parent: stubRoot });
    const title = fixture.nativeElement.querySelector('[mat-dialog-title]');
    expect(title.textContent).toContain('Add category template');
  });

  it('shows "Add type template" title when parent is category', () => {
    const { fixture } = setup({ parent: stubCategoryNode });
    const title = fixture.nativeElement.querySelector('[mat-dialog-title]');
    expect(title.textContent).toContain('Add type template');
  });

  it('closes with null on Cancel', () => {
    const { fixture, dialogRef } = setup({ parent: null });
    const cancelBtn = fixture.nativeElement.querySelector('[mat-dialog-close]');
    cancelBtn.click();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('does not close with payload when form is invalid (name empty)', () => {
    const { fixture, dialogRef } = setup({ parent: null });
    const confirmBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[mat-flat-button]');
    confirmBtn.click();
    expect(dialogRef.close).not.toHaveBeenCalledWith(expect.objectContaining({ name: expect.any(String) }));
  });
});
