import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentTemplateService } from '../../services/document-template.service';
import { ProjectService } from '../../../projects/services/project.service';
import { DocumentTemplateNode } from '../../contracts/document-template.contracts';
import { TemplateNodeDetailComponent } from '../../components/template-node-detail/template-node-detail.component';
import {
  CreateTemplateDialogComponent,
  CreateTemplateDialogData,
} from '../../components/create-template-dialog/create-template-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-templates-page',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TemplateNodeDetailComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './templates-page.component.html',
  styleUrl: './templates-page.component.scss',
})
export class TemplatesPageComponent {
  private readonly templateService = inject(DocumentTemplateService);
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);

  protected readonly tree = this.templateService.tree;
  protected readonly loading = this.templateService.loading;
  protected readonly project = this.projectService.selectedProject;
  protected readonly selected = this.templateService.selected;

  protected readonly expandedIds = signal<Set<number>>(new Set());

  constructor() {
    effect(() => {
      const project = this.project();
      if (project) {
        this.templateService.list(project.id).subscribe();
      }
    });
  }

  protected toggleExpanded(id: number): void {
    this.expandedIds.update(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  protected selectNode(node: DocumentTemplateNode): void {
    this.templateService.select(node.id);
  }

  protected closeDetail(): void {
    this.templateService.select(null);
  }

  protected onNodeDeleted(): void {
    this.templateService.select(null);
  }

  protected openCreateRoot(): void {
    const ref = this.dialog.open<
      CreateTemplateDialogComponent,
      CreateTemplateDialogData
    >(CreateTemplateDialogComponent, {
      data: { parent: null },
    });
    ref.afterClosed().subscribe(payload => {
      if (!payload) return;
      const project = this.project();
      if (!project) return;
      this.templateService.create(project.id, payload).subscribe();
    });
  }
}
