import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  RevertConfirmDialogComponent,
  RevertConfirmData,
} from './revert-confirm-dialog.component';

function setup(data: RevertConfirmData = { fromVersion: 2, toVersion: 4 }) {
  const dialogRef = { close: vi.fn() };

  TestBed.configureTestingModule({
    imports: [RevertConfirmDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: data },
      { provide: MatDialogRef, useValue: dialogRef },
    ],
  });

  const fixture: ComponentFixture<RevertConfirmDialogComponent> =
    TestBed.createComponent(RevertConfirmDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('RevertConfirmDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders the from-version number in the title', () => {
    const { fixture } = setup({ fromVersion: 2, toVersion: 4 });
    expect(fixture.nativeElement.textContent).toContain('v2');
  });

  it('renders the new version number in the body', () => {
    const { fixture } = setup({ fromVersion: 2, toVersion: 4 });
    expect(fixture.nativeElement.textContent).toContain('v4');
  });

  it('Revert button closes dialog with true', () => {
    const { fixture, dialogRef } = setup();
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const revertBtn = Array.from(buttons).find(b => b.textContent?.trim() === 'Revert');
    revertBtn?.click();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('Cancel button closes dialog', () => {
    const { fixture, dialogRef } = setup();
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const cancelBtn = Array.from(buttons).find(b => b.textContent?.trim() === 'Cancel');
    cancelBtn?.click();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
