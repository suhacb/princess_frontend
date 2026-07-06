import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CreateTestScenarioDialogComponent,
  CreateTestScenarioDialogData,
} from './create-test-scenario-dialog.component';

const dialogData: CreateTestScenarioDialogData = {
  acceptanceCriteria: [{ id: 9, ref: 'AC-001', title: 'Valid login redirects to dashboard' }],
};

function setup(data: CreateTestScenarioDialogData = dialogData) {
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [CreateTestScenarioDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: data },
    ],
  });
  const fixture: ComponentFixture<CreateTestScenarioDialogComponent> = TestBed.createComponent(CreateTestScenarioDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('CreateTestScenarioDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('creates successfully', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('Create button is disabled when title is empty', () => {
    const { fixture } = setup();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(btn.disabled).toBe(true);
  });

  it('defaults to feature type', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.form.value.type).toBe('feature');
  });

  it('preselects the acceptance criterion when provided', () => {
    const { fixture } = setup({ ...dialogData, preselectedAcceptanceCriterionId: 9 });
    const comp = fixture.componentInstance as any;
    expect(comp.form.value.acceptance_criterion_ids).toEqual([9]);
  });

  it('closes with a create payload', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ title: 'User can authenticate', type: 'e2e' });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'e2e', title: 'User can authenticate' }),
    );
  });

  it('does not close when form is invalid', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
