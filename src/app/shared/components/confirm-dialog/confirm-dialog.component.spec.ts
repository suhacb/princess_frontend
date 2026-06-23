import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

function setup(data: ConfirmDialogData) {
  const dialogRefMock = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [ConfirmDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: data },
      { provide: MatDialogRef, useValue: dialogRefMock },
    ],
  });
  const fixture: ComponentFixture<ConfirmDialogComponent> = TestBed.createComponent(ConfirmDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRefMock };
}

describe('ConfirmDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders the title', () => {
    const { fixture } = setup({ title: 'Sign out', message: 'Are you sure?' });
    expect(fixture.nativeElement.textContent).toContain('Sign out');
  });

  it('renders the message', () => {
    const { fixture } = setup({ title: 'Sign out', message: 'Are you sure?' });
    expect(fixture.nativeElement.textContent).toContain('Are you sure?');
  });

  it('uses default Cancel and Confirm labels when not provided', () => {
    const { fixture } = setup({ title: 'Delete', message: 'Proceed?' });
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.find(b => b.textContent?.trim() === 'Cancel')).toBeTruthy();
    expect(buttons.find(b => b.textContent?.trim() === 'Confirm')).toBeTruthy();
  });

  it('uses custom labels when provided', () => {
    const { fixture } = setup({ title: 'Sign out', message: 'Are you sure?', confirmLabel: 'Sign out', cancelLabel: 'Stay' });
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.find(b => b.textContent?.trim() === 'Stay')).toBeTruthy();
    expect(buttons.find(b => b.textContent?.trim() === 'Sign out')).toBeTruthy();
  });

  it('closes with true when confirm is clicked', () => {
    const { fixture, dialogRefMock } = setup({ title: 'Sign out', message: 'Are you sure?', confirmLabel: 'Sign out' });
    const btn = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find(b => b.textContent?.trim() === 'Sign out');
    btn?.click();
    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('closes without value when Cancel is clicked via mat-dialog-close', () => {
    const { fixture, dialogRefMock } = setup({ title: 'Sign out', message: 'Are you sure?' });
    const btn = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find(b => b.textContent?.trim() === 'Cancel');
    btn?.click();
    expect(dialogRefMock.close).toHaveBeenCalledWith('');
  });
});
