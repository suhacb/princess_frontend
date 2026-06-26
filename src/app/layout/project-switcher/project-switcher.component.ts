import { Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectService } from '../../features/projects/services/project.service';
import { ShellStore } from '../../core/services/shell.store';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { Project } from '../../features/projects/contracts/project.contracts';

@Component({
  selector: 'app-project-switcher',
  imports: [MatIconModule, MatButtonModule, StatusChipComponent],
  templateUrl: './project-switcher.component.html',
  styleUrl: './project-switcher.component.scss',
})
export class ProjectSwitcherComponent {
  protected readonly shell = inject(ShellStore);
  protected readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);

  protected readonly projects = this.projectService.projects;
  protected readonly activeId = this.shell.activeProjectId;

  protected selectProject(project: Project): void {
    this.shell.setProject(project.id);
    this.shell.closeSwitcher();
    this.router.navigate(['/p', project.id, 'home']);
  }

  protected goToPortfolio(): void {
    this.shell.closeSwitcher();
    this.router.navigate(['/projects']);
  }

  @HostListener('document:keydown.escape')
  protected close(): void {
    this.shell.closeSwitcher();
  }

  protected onBackdropClick(): void {
    this.shell.closeSwitcher();
  }
}
