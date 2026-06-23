import { Component, OnInit, computed, effect, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../services/project.service';
import { PROJECT_STATUS_LABELS, PROJECT_STATUSES, ProjectStatus } from '../../contracts/project.contracts';
import { ProjectStatusChipComponent } from '../../components/project-status-chip/project-status-chip.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

const TABS = [
  { label: 'Overview', path: 'overview' },
  { label: 'Stages', path: 'stages' },
  { label: 'Members', path: 'members' },
  { label: 'Daily Log', path: 'daily-log' },
  { label: 'Audit', path: 'audit' },
] as const;

@Component({
  selector: 'app-project-detail',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    ProjectStatusChipComponent,
    SkeletonComponent,
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnInit {
  readonly id = input<string>();

  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);

  protected readonly loading = this.projectService.loading;
  protected readonly project = this.projectService.selectedProject;
  protected readonly tabs = TABS;
  protected readonly statuses = PROJECT_STATUSES;
  protected readonly statusLabels = PROJECT_STATUS_LABELS;

  protected readonly stepperIndex = computed(() => {
    const status = this.project()?.status;
    return status ? PROJECT_STATUSES.indexOf(status) : -1;
  });

  constructor() {
    effect(() => {
      const id = this.id();
      if (id) this.projectService.load(+id).subscribe();
    });
  }

  ngOnInit(): void {}

  protected isStepCompleted(status: ProjectStatus): boolean {
    const current = this.project()?.status;
    if (!current) return false;
    return PROJECT_STATUSES.indexOf(status) < PROJECT_STATUSES.indexOf(current);
  }

  protected isStepActive(status: ProjectStatus): boolean {
    return this.project()?.status === status;
  }
}
