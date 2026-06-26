import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ShellStore } from '../../../../core/services/shell.store';
import { ProjectService } from '../../../projects/services/project.service';
import { LifecycleStepperComponent } from '../../../../shared/components/lifecycle-stepper/lifecycle-stepper.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-project-home',
  imports: [
    MatIconModule,
    MatButtonModule,
    LifecycleStepperComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './project-home.component.html',
  styleUrl: './project-home.component.scss',
})
export class ProjectHomeComponent {
  protected readonly shell = inject(ShellStore);
  protected readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);

  protected readonly project = this.projectService.selectedProject;
  protected readonly role = this.shell.role;

  protected readonly isPm = computed(() => this.role() === 'pm');
  protected readonly isPmo = computed(() => this.role() === 'pmo');
  protected readonly isTm = computed(() => this.role() === 'tm');

  protected navigateTo(path: string): void {
    const id = this.shell.activeProjectId();
    if (id) this.router.navigate(['/p', id, path]);
  }

  protected raiseRisk(): void {
    this.navigateTo('risks');
  }

  protected raiseIssue(): void {
    this.navigateTo('issues');
  }
}
