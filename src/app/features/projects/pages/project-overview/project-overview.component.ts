import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-overview',
  imports: [DatePipe, MatIconModule, BadgeComponent],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.scss',
})
export class ProjectOverviewComponent {
  protected readonly project = inject(ProjectService).selectedProject;
}
