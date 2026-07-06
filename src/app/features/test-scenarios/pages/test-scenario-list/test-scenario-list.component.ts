import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TestScenarioService } from '../../services/test-scenario.service';
import { TestCaseService } from '../../services/test-case.service';
import { AcceptanceCriterionService } from '../../../acceptance-criteria/services/acceptance-criterion.service';
import { ProjectService } from '../../../projects/services/project.service';
import { TestScenarioStatusChipComponent } from '../../components/test-scenario-status-chip/test-scenario-status-chip.component';
import { TestScenarioTypeChipComponent } from '../../components/test-scenario-type-chip/test-scenario-type-chip.component';
import { TestCasePriorityChipComponent } from '../../components/test-case-priority-chip/test-case-priority-chip.component';
import { TestCaseTypeChipComponent } from '../../components/test-case-type-chip/test-case-type-chip.component';
import {
  CreateTestScenarioDialogComponent,
  CreateTestScenarioDialogData,
} from '../../components/create-test-scenario-dialog/create-test-scenario-dialog.component';
import {
  TestCaseEditorDialogComponent,
  TestCaseEditorDialogData,
  TestCaseEditorDialogResult,
} from '../../components/test-case-editor-dialog/test-case-editor-dialog.component';
import {
  CreateTestScenarioPayload,
  TEST_SCENARIO_STATUS_LABELS,
  TEST_SCENARIO_STATUSES,
  TEST_SCENARIO_TYPE_LABELS,
  TEST_SCENARIO_TYPES,
  TestScenario,
  TestScenarioStatus,
  TestScenarioType,
} from '../../contracts/test-scenario.contracts';
import { TestCase } from '../../contracts/test-case.contracts';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PageScrollComponent } from '../../../../shared/components/page-scroll/page-scroll.component';

type TestableFilter = 'all' | 'yes' | 'no';

@Component({
  selector: 'app-test-scenario-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatTooltipModule,
    TestScenarioStatusChipComponent,
    TestScenarioTypeChipComponent,
    TestCasePriorityChipComponent,
    TestCaseTypeChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
    PageScrollComponent,
  ],
  templateUrl: './test-scenario-list.component.html',
  styleUrl: './test-scenario-list.component.scss',
})
export class TestScenarioListComponent {
  private readonly scenarioService = inject(TestScenarioService);
  protected readonly caseService = inject(TestCaseService);
  private readonly acceptanceCriterionService = inject(AcceptanceCriterionService);
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.scenarioService.loading;
  protected readonly statusLabels = TEST_SCENARIO_STATUS_LABELS;
  protected readonly typeLabels = TEST_SCENARIO_TYPE_LABELS;
  protected readonly testScenarioStatuses = TEST_SCENARIO_STATUSES;
  protected readonly testScenarioTypes = TEST_SCENARIO_TYPES;

  protected readonly statusFilter = signal<TestScenarioStatus | 'all'>('all');
  protected readonly typeFilter = signal<TestScenarioType | 'all'>('all');
  protected readonly testableFilter = signal<TestableFilter>('all');
  protected readonly expandedIds = signal<ReadonlySet<number>>(new Set());
  protected readonly actionError = signal<string | null>(null);

  protected readonly filtered = computed<TestScenario[]>(() => {
    const status = this.statusFilter();
    const type = this.typeFilter();
    const testable = this.testableFilter();
    let items = this.scenarioService.scenarios();
    if (status !== 'all') items = items.filter(s => s.status === status);
    if (type !== 'all') items = items.filter(s => s.type === type);
    if (testable !== 'all') items = items.filter(s => s.isTestable === (testable === 'yes'));
    return items;
  });

  constructor() {
    effect(() => {
      const project = this.projectService.selectedProject();
      if (project) {
        this.scenarioService.list(project.id).subscribe();
        if (this.acceptanceCriterionService.criteria().length === 0) {
          this.acceptanceCriterionService.list(project.id).subscribe();
        }
      }
    });
  }

  protected isExpanded(scenarioId: number): boolean {
    return this.expandedIds().has(scenarioId);
  }

  protected toggleExpand(scenario: TestScenario): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    const isOpen = this.isExpanded(scenario.id);
    this.expandedIds.update(set => {
      const next = new Set(set);
      if (isOpen) next.delete(scenario.id);
      else next.add(scenario.id);
      return next;
    });
    if (!isOpen && this.caseService.casesFor(scenario.id).length === 0) {
      this.caseService.list(project.id, scenario.id).subscribe();
    }
  }

  protected openCreateScenarioDialog(): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    const data: CreateTestScenarioDialogData = {
      acceptanceCriteria: this.acceptanceCriterionService
        .criteria()
        .map(ac => ({ id: ac.id, ref: ac.ref, title: ac.title })),
    };
    this.dialog
      .open(CreateTestScenarioDialogComponent, { panelClass: 'princess-dialog', disableClose: true, data })
      .afterClosed()
      .subscribe((payload: CreateTestScenarioPayload | undefined) => {
        if (!payload) return;
        this.scenarioService.create(project.id, payload).subscribe();
      });
  }

  protected openCreateCaseDialog(scenario: TestScenario): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    const data: TestCaseEditorDialogData = {};
    this.dialog
      .open(TestCaseEditorDialogComponent, { panelClass: 'princess-dialog', disableClose: true, data })
      .afterClosed()
      .subscribe((result: TestCaseEditorDialogResult | undefined) => {
        if (!result || result.mode !== 'create') return;
        this.caseService.create(project.id, scenario.id, result.payload).subscribe();
      });
  }

  protected openEditCaseDialog(scenario: TestScenario, testCase: TestCase): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    const data: TestCaseEditorDialogData = { testCase };
    this.dialog
      .open(TestCaseEditorDialogComponent, { panelClass: 'princess-dialog', disableClose: true, data })
      .afterClosed()
      .subscribe((result: TestCaseEditorDialogResult | undefined) => {
        if (!result || result.mode !== 'edit') return;
        this.caseService.update(project.id, scenario.id, testCase.id, result.payload).subscribe();
      });
  }

  protected deleteCase(scenario: TestScenario, testCase: TestCase): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.caseService.remove(project.id, scenario.id, testCase.id).subscribe();
  }

  protected deleteScenario(scenario: TestScenario): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.actionError.set(null);
    this.scenarioService.remove(project.id, scenario.id).subscribe({
      error: () => this.actionError.set('Delete failed — only draft scenarios with no test sessions can be deleted.'),
    });
  }

  protected markReady(scenario: TestScenario): void {
    this.runAction(scenario, id => this.scenarioService.ready(this.projectService.selectedProject()!.id, id));
  }

  protected markObsolete(scenario: TestScenario): void {
    this.runAction(scenario, id => this.scenarioService.obsolete(this.projectService.selectedProject()!.id, id));
  }

  protected reopen(scenario: TestScenario): void {
    this.runAction(scenario, id => this.scenarioService.reopen(this.projectService.selectedProject()!.id, id));
  }

  protected markTestable(scenario: TestScenario): void {
    this.runAction(scenario, id =>
      this.scenarioService.markTestable(this.projectService.selectedProject()!.id, id),
    );
  }

  protected markNotTestable(scenario: TestScenario): void {
    this.runAction(scenario, id =>
      this.scenarioService.markNotTestable(this.projectService.selectedProject()!.id, id),
    );
  }

  private runAction(
    scenario: TestScenario,
    fn: (id: number) => ReturnType<TestScenarioService['ready']>,
  ): void {
    const project = this.projectService.selectedProject();
    if (!project) return;
    this.actionError.set(null);
    fn(scenario.id).subscribe({
      error: () => this.actionError.set('Action failed — you may not have permission to do this.'),
    });
  }
}
