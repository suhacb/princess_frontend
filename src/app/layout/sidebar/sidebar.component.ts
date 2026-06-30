import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { LayoutService } from '../../core/services/layout.service';
import { ShellStore, AppRole } from '../../core/services/shell.store';
import { ProjectService } from '../../features/projects/services/project.service';
import { DocumentService } from '../../features/documents/services/document.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: AppRole[];
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  roles?: AppRole[];
}

const PORTFOLIO_ITEMS: NavItem[] = [
  { label: 'All projects', icon: 'folder_open', route: '/projects' },
];

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule, MatRippleModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected readonly layout = inject(LayoutService);
  protected readonly shell = inject(ShellStore);
  protected readonly projectService = inject(ProjectService);
  private readonly documentService = inject(DocumentService);
  private readonly router = inject(Router);

  protected readonly portfolioItems = PORTFOLIO_ITEMS;
  protected readonly project = this.projectService.selectedProject;
  protected readonly role = this.shell.role;

  protected readonly projectNavGroups = computed<NavGroup[]>(() => {
    const id = this.shell.activeProjectId();
    const role = this.role();
    const queueCount = this.documentService.reviewQueueCount();
    if (!id) return [];

    const base = `/p/${id}`;
    const all: NavGroup[] = [
      {
        label: 'Overview',
        items: [
          { label: 'Home', icon: 'dashboard', route: `${base}/home` },
        ],
      },
      {
        label: 'Planning',
        roles: ['pm', 'pmo'],
        items: [
          { label: 'Plan & stages', icon: 'account_tree', route: `${base}/plan`, roles: ['pm', 'pmo'] },
        ],
      },
      {
        label: 'Logs',
        items: [
          { label: 'Risk Log',    icon: 'warning_amber', route: `${base}/risks` },
          { label: 'Issue Log',   icon: 'bug_report',    route: `${base}/issues` },
          { label: 'Change Log',  icon: 'sync_alt',      route: `${base}/changes`,  roles: ['pm', 'pmo'] },
          { label: 'Quality',     icon: 'fact_check',    route: `${base}/quality`,  roles: ['pm', 'pmo'] },
          { label: 'Lessons',     icon: 'school',        route: `${base}/lessons`,  roles: ['pm', 'pmo'] },
        ],
      },
      {
        label: 'Reports',
        roles: ['pm', 'pmo'],
        items: [
          { label: 'Highlight',  icon: 'summarize',      route: `${base}/reports/highlight` },
          { label: 'Exceptions', icon: 'report_problem', route: `${base}/reports/exceptions` },
        ],
      },
      {
        label: 'Documents',
        items: [
          { label: 'Documents',     icon: 'folder_open', route: `${base}/documents` },
          {
            label: 'Review Queue',
            icon: 'rate_review',
            route: `${base}/documents/review-queue`,
            roles: ['pm', 'pmo'],
            badge: queueCount > 0 ? queueCount : undefined,
          },
          {
            label: 'Templates',
            icon: 'style',
            route: `${base}/documents/templates`,
            roles: ['pmo'],
          },
        ],
      },
    ];

    return all
      .filter(g => !g.roles || g.roles.includes(role))
      .map(g => ({
        ...g,
        items: g.items.filter(i => !i.roles || i.roles.includes(role)),
      }))
      .filter(g => g.items.length > 0);
  });

  protected readonly collapsed = computed(() => this.layout.sidebarCollapsed());

  protected openSwitcher(): void {
    this.shell.openSwitcher();
  }

  protected goToPortfolio(): void {
    this.shell.setProject(null);
    this.router.navigate(['/projects']);
  }
}
