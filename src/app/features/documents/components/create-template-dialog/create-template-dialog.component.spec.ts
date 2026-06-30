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

function fillName(fixture: ComponentFixture<CreateTemplateDialogComponent>, name: string): void {
  const input: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="name"]');
  input.value = name;
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
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

  it('does not close with payload when name is empty', () => {
    const { fixture, dialogRef } = setup({ parent: null });
    const confirmBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[mat-flat-button]');
    confirmBtn.click();
    expect(dialogRef.close).not.toHaveBeenCalledWith(expect.objectContaining({ name: expect.any(String) }));
  });

  it('closes with correct payload for root node (no parent)', () => {
    const { fixture, dialogRef } = setup({ parent: null });
    fillName(fixture, 'My Root');
    const confirmBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[mat-flat-button]');
    confirmBtn.click();
    expect(dialogRef.close).toHaveBeenCalledWith(expect.objectContaining({
      name: 'My Root',
      parent_id: null,
    }));
  });

  it('shows category select when parent is root (creating category node)', () => {
    const { fixture } = setup({ parent: stubRoot });
    expect(fixture.nativeElement.querySelector('mat-select[formControlName="category"]')).not.toBeNull();
  });

  it('shows type select when parent is category (creating type node)', () => {
    const { fixture } = setup({ parent: stubCategoryNode });
    expect(fixture.nativeElement.querySelector('mat-select[formControlName="type"]')).not.toBeNull();
  });

  it('does not show category or type select when creating root', () => {
    const { fixture } = setup({ parent: null });
    expect(fixture.nativeElement.querySelector('mat-select[formControlName="category"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('mat-select[formControlName="type"]')).toBeNull();
  });

  it('keeps confirm button disabled when category is required but not selected', () => {
    const { fixture } = setup({ parent: stubRoot });
    fillName(fixture, 'My Category');
    const confirmBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[mat-flat-button]');
    expect(confirmBtn.disabled).toBe(true);
  });

  it('includes parent_id in payload when creating child node', () => {
    const { fixture, dialogRef } = setup({ parent: stubRoot });
    fillName(fixture, 'My Category');
    const component = fixture.componentInstance as unknown as { form: { controls: { category: { setValue: (v: string) => void } } } };
    component.form.controls.category.setValue('initiation');
    fixture.detectChanges();
    const confirmBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[mat-flat-button]');
    confirmBtn.click();
    expect(dialogRef.close).toHaveBeenCalledWith(expect.objectContaining({
      parent_id: 1,
      category: 'initiation',
    }));
  });
});
