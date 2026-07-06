import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CreateTestCasePayload,
  TEST_CASE_PRIORITIES,
  TEST_CASE_PRIORITY_LABELS,
  TEST_CASE_TYPES,
  TEST_CASE_TYPE_LABELS,
  TestCase,
  TestCasePriority,
  TestCaseType,
  UpdateTestCasePayload,
} from '../../contracts/test-case.contracts';

export interface TestCaseEditorDialogData {
  testCase?: TestCase;
}

export type TestCaseEditorDialogResult =
  | { mode: 'create'; payload: CreateTestCasePayload }
  | { mode: 'edit'; payload: UpdateTestCasePayload };

@Component({
  selector: 'app-test-case-editor-dialog',
  imports: [
    ReactiveFormsModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './test-case-editor-dialog.component.html',
  styleUrl: './test-case-editor-dialog.component.scss',
})
export class TestCaseEditorDialogComponent {
  protected readonly data = inject<TestCaseEditorDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<TestCaseEditorDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly isEdit = !!this.data.testCase;
  protected readonly priorities = TEST_CASE_PRIORITIES;
  protected readonly priorityLabels = TEST_CASE_PRIORITY_LABELS;
  protected readonly types = TEST_CASE_TYPES;
  protected readonly typeLabels = TEST_CASE_TYPE_LABELS;

  protected readonly steps = signal<string[]>(
    this.data.testCase?.steps.length ? [...this.data.testCase.steps] : [''],
  );

  protected readonly form = this.fb.group({
    title: [this.data.testCase?.title ?? '', [Validators.required, Validators.maxLength(255)]],
    expected_result: [this.data.testCase?.expectedResult ?? '', Validators.required],
    priority: [(this.data.testCase?.priority ?? 'medium') as TestCasePriority],
    type: [(this.data.testCase?.type ?? 'positive') as TestCaseType, Validators.required],
  });

  protected readonly stepsValid = computed(() => this.steps().some(s => s.trim().length > 0));

  protected updateStep(index: number, value: string): void {
    this.steps.update(steps => steps.map((s, i) => (i === index ? value : s)));
  }

  protected addStep(): void {
    this.steps.update(steps => [...steps, '']);
  }

  protected removeStep(index: number): void {
    this.steps.update(steps => (steps.length > 1 ? steps.filter((_, i) => i !== index) : steps));
  }

  protected dropped(event: CdkDragDrop<string[]>): void {
    const next = [...this.steps()];
    moveItemInArray(next, event.previousIndex, event.currentIndex);
    this.steps.set(next);
  }

  protected confirm(): void {
    if (this.form.invalid || !this.stepsValid()) return;
    const v = this.form.value;
    const steps = this.steps()
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (this.isEdit) {
      const payload: UpdateTestCasePayload = {
        title: v.title!,
        steps,
        expected_result: v.expected_result!,
        priority: v.priority as TestCasePriority,
        type: v.type as TestCaseType,
      };
      this.dialogRef.close({ mode: 'edit', payload } satisfies TestCaseEditorDialogResult);
    } else {
      const payload: CreateTestCasePayload = {
        title: v.title!,
        steps,
        expected_result: v.expected_result!,
        priority: v.priority as TestCasePriority,
        type: v.type as TestCaseType,
      };
      this.dialogRef.close({ mode: 'create', payload } satisfies TestCaseEditorDialogResult);
    }
  }
}
