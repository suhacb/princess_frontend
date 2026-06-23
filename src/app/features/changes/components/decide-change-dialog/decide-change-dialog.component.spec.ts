import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DecideChangeDialogComponent,
  DecideChangeDialogData,
} from './decide-change-dialog.component';

function setup(action: 'approve' | 'reject') {
  const dialogRef = { close: vi.fn() };
  const data: DecideChangeDialogData = { action, changeTitle: 'Add new field' };
  TestBed.configureTestingModule({
    imports: [DecideChangeDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: data },
    ],
  });
  const fixture: ComponentFixture<DecideChangeDialogComponent> =
    TestBed.createComponent(DecideChangeDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('DecideChangeDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('shows Approve title for approve action', () => {
    const { fixture } = setup('approve');
    expect(fixture.nativeElement.textContent).toContain('Approve');
  });

  it('shows Reject title for reject action', () => {
    const { fixture } = setup('reject');
    expect(fixture.nativeElement.textContent).toContain('Reject');
  });

  it('shows the change title', () => {
    const { fixture } = setup('approve');
    expect(fixture.nativeElement.textContent).toContain('Add new field');
  });

  it('closes with payload including rationale', () => {
    const { fixture, dialogRef } = setup('approve');
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ decision_rationale: 'Good idea' });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith({ decision_rationale: 'Good idea' });
  });

  it('closes with null rationale when left empty', () => {
    const { fixture, dialogRef } = setup('reject');
    const comp = fixture.componentInstance as any;
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith({ decision_rationale: null });
  });
});
