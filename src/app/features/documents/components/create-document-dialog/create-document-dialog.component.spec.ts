import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateDocumentDialogComponent } from './create-document-dialog.component';

function setup() {
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [CreateDocumentDialogComponent, BrowserAnimationsModule],
    providers: [{ provide: MatDialogRef, useValue: dialogRef }],
  });
  const fixture: ComponentFixture<CreateDocumentDialogComponent> = TestBed.createComponent(CreateDocumentDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('CreateDocumentDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders title field and Create button', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('input[formcontrolname="title"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Create');
  });

  it('Create button is disabled when form is invalid', () => {
    const { fixture } = setup();
    const btn = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(btn.disabled).toBe(true);
  });

  it('does not close dialog when form is invalid', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('closes with payload when form is valid', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.setValue({ title: 'Project Brief', type: 'project_brief', description: '' });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith({
      title: 'Project Brief',
      type: 'project_brief',
      description: null,
    });
  });
});
