import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { UploadVersionDialogComponent } from './upload-version-dialog.component';

function setup() {
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [UploadVersionDialogComponent, BrowserAnimationsModule],
    providers: [{ provide: MatDialogRef, useValue: dialogRef }],
  });
  const fixture: ComponentFixture<UploadVersionDialogComponent> = TestBed.createComponent(UploadVersionDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('UploadVersionDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders file picker and Upload button', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.querySelector('input[type="file"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Upload');
  });

  it('Upload button is disabled when no file selected', () => {
    const { fixture } = setup();
    const btn = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(btn.disabled).toBe(true);
  });

  it('shows "No file selected" when no file', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('No file selected');
  });

  it('shows file name when file is selected', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    comp.selectedFile.set(new File([''], 'report.docx'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('report.docx');
  });

  it('does not close when no file', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('closes with file and comment on confirm', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    const file = new File(['content'], 'report.docx');
    comp.selectedFile.set(file);
    comp.form.setValue({ comment: 'Updated figures' });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith({ file, comment: 'Updated figures' });
  });

  it('passes null comment when comment is empty', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    const file = new File([''], 'f.docx');
    comp.selectedFile.set(file);
    comp.form.setValue({ comment: '' });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith({ file, comment: null });
  });
});
