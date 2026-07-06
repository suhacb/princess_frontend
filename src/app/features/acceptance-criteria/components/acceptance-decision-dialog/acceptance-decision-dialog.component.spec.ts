import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  AcceptanceDecisionDialogComponent,
  AcceptanceDecisionDialogData,
} from './acceptance-decision-dialog.component';

function setup(data: AcceptanceDecisionDialogData) {
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [AcceptanceDecisionDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: data },
    ],
  });
  const fixture: ComponentFixture<AcceptanceDecisionDialogComponent> = TestBed.createComponent(
    AcceptanceDecisionDialogComponent,
  );
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('AcceptanceDecisionDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('creates successfully', () => {
    const { fixture } = setup({ side: 'Supplier', computedPassed: true });
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('Confirm is disabled until a decision is chosen', () => {
    const { fixture } = setup({ side: 'Supplier', computedPassed: true });
    const comp = fixture.componentInstance as any;
    expect(comp.canConfirm()).toBe(false);
  });

  it('does not require a note when the decision agrees with the computed signal', () => {
    const { fixture } = setup({ side: 'Supplier', computedPassed: true });
    const comp = fixture.componentInstance as any;
    comp.decision.set('accepted');
    fixture.detectChanges();
    expect(comp.noteRequired()).toBe(false);
    expect(comp.canConfirm()).toBe(true);
  });

  it('requires a note when rejecting despite a passing signal', () => {
    const { fixture } = setup({ side: 'Supplier', computedPassed: true });
    const comp = fixture.componentInstance as any;
    comp.decision.set('rejected');
    fixture.detectChanges();
    expect(comp.noteRequired()).toBe(true);
    expect(comp.canConfirm()).toBe(false);
    comp.form.patchValue({ note: 'Manual regression found despite automated pass' });
    expect(comp.canConfirm()).toBe(true);
  });

  it('requires a note when accepting despite a failing signal', () => {
    const { fixture } = setup({ side: 'Client', computedPassed: false });
    const comp = fixture.componentInstance as any;
    comp.decision.set('accepted');
    fixture.detectChanges();
    expect(comp.noteRequired()).toBe(true);
    expect(comp.canConfirm()).toBe(false);
  });

  it('closes with the decision and note on confirm', () => {
    const { fixture, dialogRef } = setup({ side: 'Client', computedPassed: true });
    const comp = fixture.componentInstance as any;
    comp.decision.set('accepted');
    fixture.detectChanges();
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith({ decision: 'accepted', note: null });
  });

  it('does not close when confirm is invalid', () => {
    const { fixture, dialogRef } = setup({ side: 'Client', computedPassed: true });
    const comp = fixture.componentInstance as any;
    comp.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
