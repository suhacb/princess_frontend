import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestCaseEditorDialogComponent, TestCaseEditorDialogData } from './test-case-editor-dialog.component';
import { TestCase } from '../../contracts/test-case.contracts';

const stubTestCase: TestCase = {
  id: 1,
  testScenarioId: 5,
  projectId: 2,
  ref: 'TC-001',
  title: 'Log in with valid credentials',
  steps: ['Open login page', 'Submit form'],
  expectedResult: 'User is redirected to the dashboard',
  priority: 'high',
  type: 'positive',
  createdBy: null,
  updatedBy: null,
  createdAt: '2026-06-01T10:00:00Z',
  updatedAt: '2026-06-01T10:00:00Z',
};

function setup(data: TestCaseEditorDialogData = {}) {
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [TestCaseEditorDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: data },
    ],
  });
  const fixture: ComponentFixture<TestCaseEditorDialogComponent> = TestBed.createComponent(TestCaseEditorDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('TestCaseEditorDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('creates successfully in create mode with one empty step', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.isEdit).toBe(false);
    expect(comp.steps()).toEqual(['']);
  });

  it('seeds the form and steps from the existing test case in edit mode', () => {
    const { fixture } = setup({ testCase: stubTestCase });
    const comp = fixture.componentInstance as any;
    expect(comp.isEdit).toBe(true);
    expect(comp.form.value.title).toBe('Log in with valid credentials');
    expect(comp.form.value.priority).toBe('high');
    expect(comp.steps()).toEqual(['Open login page', 'Submit form']);
  });

  it('addStep() appends an empty step', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    comp.addStep();
    expect(comp.steps()).toEqual(['', '']);
  });

  it('removeStep() removes a step but keeps at least one', () => {
    const { fixture } = setup({ testCase: stubTestCase });
    const comp = fixture.componentInstance as any;
    comp.removeStep(0);
    expect(comp.steps()).toEqual(['Submit form']);
    comp.removeStep(0);
    expect(comp.steps()).toEqual(['Submit form']);
  });

  it('updateStep() updates the step at the given index', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    comp.updateStep(0, 'Open the app');
    expect(comp.steps()).toEqual(['Open the app']);
  });

  it('dropped() reorders steps', () => {
    const { fixture } = setup({ testCase: stubTestCase });
    const comp = fixture.componentInstance as any;
    comp.dropped({ previousIndex: 0, currentIndex: 1 });
    expect(comp.steps()).toEqual(['Submit form', 'Open login page']);
  });

  it('does not close when there are no non-empty steps', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ title: 'Some case', expected_result: 'Something happens' });
    comp.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('closes with a create payload, trimming empty steps', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ title: 'Some case', expected_result: 'Something happens', type: 'positive' });
    comp.updateStep(0, 'Do the thing');
    comp.addStep();
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith({
      mode: 'create',
      payload: expect.objectContaining({
        title: 'Some case',
        steps: ['Do the thing'],
        expected_result: 'Something happens',
        type: 'positive',
      }),
    });
  });

  it('closes with an edit payload in edit mode', () => {
    const { fixture, dialogRef } = setup({ testCase: stubTestCase });
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ title: 'Updated title' });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith({
      mode: 'edit',
      payload: expect.objectContaining({ title: 'Updated title' }),
    });
  });
});
