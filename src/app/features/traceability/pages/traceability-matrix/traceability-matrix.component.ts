import { Component, computed, effect, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TraceabilityService } from '../../services/traceability.service';
import { ProjectService } from '../../../projects/services/project.service';
import { TraceabilityStatusChipComponent } from '../../components/traceability-status-chip/traceability-status-chip.component';
import { RequirementPriorityChipComponent } from '../../../requirements/components/requirement-priority-chip/requirement-priority-chip.component';
import { TestResultChipComponent } from '../../../test-sessions/components/test-result-chip/test-result-chip.component';
import { TestScenarioTypeChipComponent } from '../../../test-scenarios/components/test-scenario-type-chip/test-scenario-type-chip.component';
import { TestCasePriorityChipComponent } from '../../../test-scenarios/components/test-case-priority-chip/test-case-priority-chip.component';
import { TestCaseTypeChipComponent } from '../../../test-scenarios/components/test-case-type-chip/test-case-type-chip.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PageScrollComponent } from '../../../../shared/components/page-scroll/page-scroll.component';
import {
  TraceabilityAc,
  TraceabilityDerivedStatus,
  TraceabilityRequirement,
  TraceabilityUserStory,
  TRACEABILITY_DERIVED_STATUS_LABELS,
} from '../../contracts/traceability.contracts';

const DERIVED_STATUSES: TraceabilityDerivedStatus[] = ['not_tested', 'partial', 'covered', 'failing'];

@Component({
  selector: 'app-traceability-matrix',
  imports: [
    NgTemplateOutlet,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    TraceabilityStatusChipComponent,
    RequirementPriorityChipComponent,
    TestResultChipComponent,
    TestScenarioTypeChipComponent,
    TestCasePriorityChipComponent,
    TestCaseTypeChipComponent,
    EmptyStateComponent,
    SkeletonComponent,
    PageScrollComponent,
  ],
  templateUrl: './traceability-matrix.component.html',
  styleUrl: './traceability-matrix.component.scss',
})
export class TraceabilityMatrixComponent {
  private readonly traceabilityService = inject(TraceabilityService);
  private readonly projectService = inject(ProjectService);

  protected readonly loading = this.traceabilityService.loading;
  protected readonly stats = computed(() => this.traceabilityService.matrix()?.stats ?? null);
  protected readonly statusLabels = TRACEABILITY_DERIVED_STATUS_LABELS;
  protected readonly derivedStatuses = DERIVED_STATUSES;

  protected readonly statusFilter = signal<TraceabilityDerivedStatus | 'all'>('all');
  protected readonly search = signal('');
  protected readonly expandedKeys = signal<ReadonlySet<string>>(new Set());

  protected readonly filteredRequirements = computed<TraceabilityRequirement[]>(() => {
    const status = this.statusFilter();
    const term = this.search().trim().toLowerCase();
    let items = this.traceabilityService.matrix()?.requirements ?? [];
    if (status !== 'all') items = items.filter(r => r.derivedStatus === status);
    if (term) items = items.filter(r => this.requirementMatchesSearch(r, term));
    return items;
  });

  constructor() {
    effect(() => {
      const project = this.projectService.selectedProject();
      if (project) {
        this.traceabilityService.load(project.id).subscribe();
      }
    });
  }

  protected isExpanded(key: string): boolean {
    return this.expandedKeys().has(key);
  }

  protected toggle(key: string): void {
    this.expandedKeys.update(set => {
      const next = new Set(set);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  protected acceptanceCriteriaOf(req: TraceabilityRequirement): TraceabilityAc[] | null {
    return req.type === 'classic' ? req.acceptanceCriteria : null;
  }

  protected userStoriesOf(req: TraceabilityRequirement): TraceabilityUserStory[] | null {
    return req.type === 'epic' ? req.userStories : null;
  }

  private requirementMatchesSearch(req: TraceabilityRequirement, term: string): boolean {
    if (req.ref.toLowerCase().includes(term) || req.title.toLowerCase().includes(term)) return true;
    const acs = req.type === 'classic' ? req.acceptanceCriteria : req.userStories.flatMap(us => us.acceptanceCriteria);
    return acs.some(ac => this.acMatchesSearch(ac, term));
  }

  private acMatchesSearch(ac: TraceabilityAc, term: string): boolean {
    if (ac.ref.toLowerCase().includes(term) || ac.description.toLowerCase().includes(term)) return true;
    return ac.testScenarios.some(
      s =>
        s.ref.toLowerCase().includes(term) ||
        s.title.toLowerCase().includes(term) ||
        s.testCases.some(tc => tc.title.toLowerCase().includes(term)),
    );
  }
}
