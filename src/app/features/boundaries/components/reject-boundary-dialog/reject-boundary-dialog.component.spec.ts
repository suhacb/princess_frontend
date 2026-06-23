import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RejectBoundaryDialogComponent } from './reject-boundary-dialog.component';

function setup() {
  const closeFn = vi.fn();
  TestBed.configureTestingModule({
    imports: [RejectBoundaryDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: { boundaryTitle: 'Q1 Close' } },
      { provide: MatDialogRef, useValue: { close: closeFn } },
    ],
  });
  const fixture = TestBed.createComponent(RejectBoundaryDialogComponent);
  fixture.detectChanges();
  return { fixture, closeFn };
}

describe('RejectBoundaryDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('shows boundary title in heading', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Q1 Close');
  });

  it('closes with payload on reject', () => {
    const { fixture, closeFn } = setup();
    const rejectBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Reject'));
    rejectBtn?.click();
    expect(closeFn).toHaveBeenCalledWith({ rejection_reason: null });
  });
});
