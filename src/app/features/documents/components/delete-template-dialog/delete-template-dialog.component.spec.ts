import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  DeleteTemplateDialogComponent,
  DeleteTemplateDialogData,
} from './delete-template-dialog.component';
import { DocumentTemplateNode } from '../../contracts/document-template.contracts';

const stubNode: DocumentTemplateNode = {
  id: 1, parentId: null, level: 'project', category: null, type: null,
  name: 'Root Template', description: null, fileName: null, s3Key: null,
  settings: {}, kind: 'root', categoryLabel: null, typeLabel: null,
  createdAt: new Date(), updatedAt: new Date(),
  children: [], effectiveSettings: {},
};

const stubNodeWithChildren: DocumentTemplateNode = {
  ...stubNode,
  children: [{ ...stubNode, id: 2, name: 'Child', kind: 'category' }],
};

function setup(data: DeleteTemplateDialogData) {
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [DeleteTemplateDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: data },
      { provide: MatDialogRef, useValue: dialogRef },
    ],
  });
  const fixture: ComponentFixture<DeleteTemplateDialogComponent> =
    TestBed.createComponent(DeleteTemplateDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('DeleteTemplateDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('shows node name in content', () => {
    const { fixture } = setup({ node: stubNode });
    expect(fixture.nativeElement.textContent).toContain('Root Template');
  });

  it('does not show cascade warning when node has no children', () => {
    const { fixture } = setup({ node: stubNode });
    expect(fixture.nativeElement.querySelector('.cascade-warning')).toBeNull();
  });

  it('shows cascade warning when node has children', () => {
    const { fixture } = setup({ node: stubNodeWithChildren });
    expect(fixture.nativeElement.querySelector('.cascade-warning')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('1 child template');
  });

  it('closes with true on confirm', () => {
    const { fixture, dialogRef } = setup({ node: stubNode });
    const deleteBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[color="warn"]');
    deleteBtn.click();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('closes without value on Cancel', () => {
    const { fixture, dialogRef } = setup({ node: stubNode });
    const cancelBtn = fixture.nativeElement.querySelector('[mat-dialog-close]');
    cancelBtn.click();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
