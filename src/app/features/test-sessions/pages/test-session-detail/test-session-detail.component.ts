import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TestSessionService } from '../../services/test-session.service';
import { MemberService } from '../../../members/services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { ToastService } from '../../../../core/services/toast.service';
import { TestSessionStatusChipComponent } from '../../components/test-session-status-chip/test-session-status-chip.component';
import { TestResultChipComponent } from '../../components/test-result-chip/test-result-chip.component';
import { SessionSummaryDonutComponent } from '../../components/session-summary-donut/session-summary-donut.component';
import {
  TestSession,
  TestSessionReport,
  UpdateTestSessionPayload,
} from '../../contracts/test-session.contracts';
import { TEAM_TYPE_LABELS, TEAM_TYPES, TeamType } from '../../contracts/test-session-plan.contracts';
import {
  STEP_RESULT_STATUSES,
  StepResultInput,
  StepResultStatus,
  TEST_RESULT_STATUS_LABELS,
  TestResultStatus,
  TestSessionResult,
  UpdateTestCaseResultPayload,
} from '../../contracts/test-session-result.contracts';
import { TestCase } from '../../../test-scenarios/contracts/test-case.contracts';
import { TestScenario } from '../../../test-scenarios/contracts/test-scenario.contracts';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PageScrollComponent } from '../../../../shared/components/page-scroll/page-scroll.component';

interface ScenarioGroup {
  scenario: TestScenario;
  scenarioResult: TestSessionResult | null;
  caseResults: TestSessionResult[];
}

const SCENARIO_RESULT_OPTIONS: TestResultStatus[] = ['pass', 'fail', 'blocked'];

@Component({
  selector: 'app-test-session-detail',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TestSessionStatusChipComponent,
    TestResultChipComponent,
    SessionSummaryDonutComponent,
    SkeletonComponent,
    PageScrollComponent,
  ],
  templateUrl: './test-session-detail.component.html',
  styleUrl: './test-session-detail.component.scss',
})
export class TestSessionDetailComponent {
  readonly sessionId = input<string>();

  private readonly sessionService = inject(TestSessionService);
  protected readonly memberService = inject(MemberService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly session = this.sessionService.selectedSession;
  protected readonly project = this.projectService.selectedProject;
  protected readonly loading = this.sessionService.loading;

  protected readonly teamTypeLabels = TEAM_TYPE_LABELS;
  protected readonly teamTypes = TEAM_TYPES;
  protected readonly scenarioResultOptions = SCENARIO_RESULT_OPTIONS;
  protected readonly stepResultOptions = STEP_RESULT_STATUSES;
  protected readonly resultLabels = TEST_RESULT_STATUS_LABELS;

  protected readonly loadError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);
  protected readonly editing = signal(false);
  protected readonly expandedScenarioIds = signal<ReadonlySet<number>>(new Set());
  protected readonly report = signal<TestSessionReport | null>(null);

  private readonly caseForms = signal<ReadonlyMap<number, FormGroup>>(new Map());

  protected readonly scenarioGroups = computed<ScenarioGroup[]>(() => {
    const s = this.session();
    if (!s) return [];
    const map = new Map<number, ScenarioGroup>();
    for (const r of s.results) {
      const scenarioId = r.testScenario.id;
      let group = map.get(scenarioId);
      if (!group) {
        group = { scenario: r.testScenario, scenarioResult: null, caseResults: [] };
        map.set(scenarioId, group);
      }
      if (r.testCase) group.caseResults.push(r);
      else group.scenarioResult = r;
    }
    return Array.from(map.values());
  });

  protected readonly editForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    session_date: ['', Validators.required],
    tester_id: [null as number | null, Validators.required],
    team_type: ['supplier' as TeamType, Validators.required],
    environment: [''],
    notes: [''],
  });

  constructor() {
    effect(() => {
      const id = this.sessionId();
      const project = this.project();
      if (id && project) {
        this.loadError.set(null);
        this.report.set(null);
        this.sessionService.load(project.id, +id).subscribe({
          error: () => this.loadError.set('Failed to load test session.'),
        });
        if (this.memberService.members().length === 0) {
          this.memberService.list(project.id).subscribe();
        }
      }
    });

    effect(() => {
      const s = this.session();
      if (s) {
        this.editForm.patchValue({
          title: s.title,
          session_date: s.sessionDate,
          tester_id: s.tester.id,
          team_type: s.teamType,
          environment: s.environment ?? '',
          notes: s.notes ?? '',
        });
        this.editForm.markAsPristine();
        this.buildMissingCaseForms(s);
        this.loadReport(s);
      }
    });
  }

  private loadReport(s: TestSession): void {
    const project = this.project();
    if (!project) return;
    this.sessionService.report(project.id, s.id).subscribe(report => this.report.set(report));
  }

  private buildMissingCaseForms(session: TestSession): void {
    const current = this.caseForms();
    let changed = false;
    const next = new Map(current);
    for (const result of session.results) {
      if (!result.testCase) continue;
      if (next.has(result.testCase.id)) continue;
      next.set(result.testCase.id, this.buildCaseForm(result.testCase, result));
      changed = true;
    }
    if (changed) this.caseForms.set(next);
  }

  private buildCaseForm(testCase: TestCase, result: TestSessionResult): FormGroup {
    const stepGroups = testCase.steps.map((_, index) => {
      const existing = result.stepResults?.find(sr => sr.stepIndex === index) ?? null;
      return this.fb.group({
        step_index: [index],
        result: [(existing?.result ?? 'not_run') as StepResultStatus | 'not_run'],
        actual_result: [existing?.actualResult ?? ''],
        defect_ref: [existing?.defectRef ?? ''],
      });
    });
    return this.fb.group({
      steps: this.fb.array(stepGroups),
      notes: [result.notes ?? ''],
      defect_ref: [result.defectRef ?? ''],
    });
  }

  protected caseFormFor(testCase: TestCase): FormGroup {
    return this.caseForms().get(testCase.id)!;
  }

  protected stepsArrayFor(testCase: TestCase): FormArray {
    return this.caseFormFor(testCase).get('steps') as FormArray;
  }

  protected isExpanded(scenarioId: number): boolean {
    return this.expandedScenarioIds().has(scenarioId);
  }

  protected toggleExpand(scenarioId: number): void {
    this.expandedScenarioIds.update(set => {
      const next = new Set(set);
      if (next.has(scenarioId)) next.delete(scenarioId);
      else next.add(scenarioId);
      return next;
    });
  }

  protected goBack(): void {
    const project = this.project();
    if (project) this.router.navigate(['/p', project.id, 'test-sessions']);
  }

  protected toggleEdit(): void {
    this.editing.update(v => !v);
  }

  protected saveEdit(): void {
    const s = this.session();
    const project = this.project();
    if (!s || !project || this.editForm.invalid) return;
    const v = this.editForm.value;
    const payload: UpdateTestSessionPayload = {
      title: v.title!,
      session_date: v.session_date!,
      tester_id: v.tester_id!,
      team_type: v.team_type as TeamType,
      environment: v.environment || null,
      notes: v.notes || null,
    };
    this.actionError.set(null);
    this.sessionService.update(project.id, s.id, payload).subscribe({
      next: () => {
        this.editing.set(false);
        this.editForm.markAsPristine();
      },
      error: () => this.actionError.set('Save failed. Please try again.'),
    });
  }

  protected deleteSession(): void {
    const s = this.session();
    const project = this.project();
    if (!s || !project) return;
    this.sessionService.remove(project.id, s.id).subscribe({
      next: () => this.goBack(),
      error: () => this.actionError.set('Delete failed — only planned sessions can be deleted.'),
    });
  }

  protected startSession(): void {
    const s = this.session();
    const project = this.project();
    if (!s || !project) return;
    this.actionError.set(null);
    this.sessionService.start(project.id, s.id).subscribe({
      error: () => this.actionError.set('Could not start the session.'),
    });
  }

  protected completeSession(): void {
    const s = this.session();
    const project = this.project();
    if (!s || !project) return;
    this.actionError.set(null);
    this.sessionService.complete(project.id, s.id).subscribe({
      next: () => this.toast.success('Session completed — issues created for failed results.'),
      error: () => this.actionError.set('Could not complete the session.'),
    });
  }

  protected cancelSession(): void {
    const s = this.session();
    const project = this.project();
    if (!s || !project) return;
    this.actionError.set(null);
    this.sessionService.cancel(project.id, s.id).subscribe({
      error: () => this.actionError.set('Could not cancel the session.'),
    });
  }

  protected setScenarioResult(scenario: TestScenario, result: TestResultStatus): void {
    const s = this.session();
    const project = this.project();
    if (!s || !project) return;
    this.actionError.set(null);
    this.sessionService.updateResult(project.id, s.id, scenario.id, { result }).subscribe({
      error: () => this.actionError.set('Could not record the scenario result.'),
    });
  }

  protected saveCaseResult(scenario: TestScenario, testCase: TestCase): void {
    const s = this.session();
    const project = this.project();
    const form = this.caseForms().get(testCase.id);
    if (!s || !project || !form) return;

    const steps = (form.get('steps') as FormArray).controls.map(ctrl => {
      const v = ctrl.value;
      return {
        step_index: v.step_index,
        result: v.result,
        actual_result: v.actual_result || null,
        defect_ref: v.defect_ref || null,
      } as StepResultInput;
    });

    const payload: UpdateTestCaseResultPayload = {
      step_results: steps,
      notes: form.value.notes || null,
      defect_ref: form.value.defect_ref || null,
    };

    this.actionError.set(null);
    this.sessionService.updateTestCaseResult(project.id, s.id, scenario.id, testCase.id, payload).subscribe({
      next: () => this.toast.success('Test case result saved.'),
      error: () => this.actionError.set('Could not save the test case result.'),
    });
  }

  protected onFileSelected(event: Event, scenario: TestScenario, testCase: TestCase, stepIndex?: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const s = this.session();
    const project = this.project();
    if (!s || !project) return;
    this.sessionService.uploadAttachment(project.id, s.id, scenario.id, testCase.id, file, stepIndex).subscribe({
      error: () => this.actionError.set('Attachment upload failed.'),
    });
    input.value = '';
  }

  protected removeAttachment(attachmentId: number, testCase: TestCase): void {
    const s = this.session();
    const project = this.project();
    if (!s || !project) return;
    this.sessionService.deleteAttachment(project.id, s.id, attachmentId, testCase.id).subscribe({
      error: () => this.actionError.set('Could not delete the attachment.'),
    });
  }

  protected attachmentsFor(result: TestSessionResult, key: string): TestSessionResult['attachments'][string] {
    return result.attachments[key] ?? [];
  }

  protected isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }
}
