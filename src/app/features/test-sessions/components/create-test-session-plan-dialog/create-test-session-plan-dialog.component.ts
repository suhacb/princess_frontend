import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Member } from '../../../members/contracts/member.contracts';
import { TestScenario } from '../../../test-scenarios/contracts/test-scenario.contracts';
import {
  CreateTestSessionPlanPayload,
  TEAM_TYPE_LABELS,
  TEAM_TYPES,
  TeamType,
  TestSessionPlan,
} from '../../contracts/test-session-plan.contracts';

export interface CreateTestSessionPlanDialogData {
  members: Member[];
  scenarios: TestScenario[];
  plan?: TestSessionPlan | null;
}

@Component({
  selector: 'app-create-test-session-plan-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './create-test-session-plan-dialog.component.html',
  styleUrl: './create-test-session-plan-dialog.component.scss',
})
export class CreateTestSessionPlanDialogComponent {
  protected readonly data = inject<CreateTestSessionPlanDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CreateTestSessionPlanDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly teamTypes = TEAM_TYPES;
  protected readonly teamTypeLabels = TEAM_TYPE_LABELS;
  protected readonly isEdit = !!this.data.plan;

  private readonly scenarioPool = computed<TestScenario[]>(() => {
    const pool = new Map<number, TestScenario>();
    for (const s of this.data.scenarios) pool.set(s.id, s);
    for (const s of this.data.plan?.scenarios ?? []) {
      if (!pool.has(s.id)) pool.set(s.id, s);
    }
    return Array.from(pool.values());
  });

  protected readonly selectedIds = signal<number[]>(this.data.plan?.scenarios.map(s => s.id) ?? []);

  protected readonly selectedScenarios = computed<TestScenario[]>(() => {
    const pool = this.scenarioPool();
    return this.selectedIds()
      .map(id => pool.find(s => s.id === id))
      .filter((s): s is TestScenario => !!s);
  });

  protected readonly availableScenarios = computed<TestScenario[]>(() => {
    const selected = new Set(this.selectedIds());
    return this.scenarioPool().filter(s => !selected.has(s.id));
  });

  protected readonly form = this.fb.group({
    title: [this.data.plan?.title ?? '', [Validators.required, Validators.maxLength(255)]],
    description: [this.data.plan?.description ?? ''],
    planned_date: [this.data.plan?.plannedDate ?? '', Validators.required],
    team_type: [(this.data.plan?.teamType ?? 'supplier') as TeamType, Validators.required],
    assignee_id: [this.data.plan?.assignee?.id ?? (null as number | null)],
  });

  protected addScenario(scenario: TestScenario): void {
    this.selectedIds.update(ids => [...ids, scenario.id]);
  }

  protected removeScenario(scenario: TestScenario): void {
    this.selectedIds.update(ids => ids.filter(id => id !== scenario.id));
  }

  protected moveUp(index: number): void {
    if (index <= 0) return;
    this.selectedIds.update(ids => {
      const next = [...ids];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  protected moveDown(index: number): void {
    this.selectedIds.update(ids => {
      if (index >= ids.length - 1) return ids;
      const next = [...ids];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  protected confirm(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: CreateTestSessionPlanPayload = {
      title: v.title!,
      description: v.description || null,
      planned_date: v.planned_date!,
      team_type: v.team_type as TeamType,
      assignee_id: v.assignee_id || null,
      scenario_ids: this.selectedIds(),
    };
    this.dialogRef.close(payload);
  }
}
