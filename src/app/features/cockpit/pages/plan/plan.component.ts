import { Component, inject } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectService } from '../../../projects/services/project.service';
import { LifecycleStepperComponent } from '../../../../shared/components/lifecycle-stepper/lifecycle-stepper.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { WbsTreeComponent } from '../../../work-packages/components/wbs-tree/wbs-tree.component';
import { WorkPackageListComponent } from '../../../work-packages/components/work-package-list/work-package-list.component';
import { StageTimelineComponent } from '../../../stages/components/stage-timeline/stage-timeline.component';
import { TaskPanelComponent } from '../../../tasks/components/task-panel/task-panel.component';
import { MeetingPanelComponent } from '../../../meetings/components/meeting-panel/meeting-panel.component';
import { AuditTrailFeedComponent } from '../../../audit-trail/components/audit-trail-feed/audit-trail-feed.component';
import { PageScrollComponent } from '../../../../shared/components/page-scroll/page-scroll.component';

const LIFECYCLE_STEPS = ['Pre-Project', 'Initiation', 'Delivery', 'Closing', 'Closed'];
const STATUS_INDEX: Record<string, number> = {
  pre_project: 0, initiation: 1, delivery: 2, closing: 3, closed: 4,
};

@Component({
  selector: 'app-plan',
  imports: [MatIconModule, MatButtonModule, LifecycleStepperComponent, EmptyStateComponent, WbsTreeComponent, WorkPackageListComponent, StageTimelineComponent, TaskPanelComponent, MeetingPanelComponent, AuditTrailFeedComponent, PageScrollComponent],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss',
})
export class PlanComponent {
  private readonly projectService = inject(ProjectService);

  protected readonly project = this.projectService.selectedProject;
  protected readonly lifecycleSteps = LIFECYCLE_STEPS;

  protected activeStepIndex(): number {
    const p = this.project();
    return p ? (STATUS_INDEX[p.status] ?? 0) : 0;
  }
}
