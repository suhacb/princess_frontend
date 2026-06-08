import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { LayoutService } from '../../core/services/layout.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
      { label: 'PRINCE2 Guide', icon: 'menu_book', route: '/guide' },
    ],
  },
  {
    label: 'Project',
    items: [
      { label: 'Projects', icon: 'folder_open', route: '/projects' },
    ],
  },
  {
    label: 'Planning',
    items: [
      { label: 'Work Breakdown', icon: 'account_tree', route: '/planning/wbs' },
      { label: 'Timeline', icon: 'calendar_view_week', route: '/planning/timeline' },
      { label: 'Tasks', icon: 'check_circle_outline', route: '/planning/tasks' },
      { label: 'Meetings', icon: 'groups', route: '/planning/meetings' },
    ],
  },
  {
    label: 'Logs',
    items: [
      { label: 'Daily Log', icon: 'edit_note', route: '/logs/daily' },
      { label: 'Issue Log', icon: 'bug_report', route: '/logs/issues' },
      { label: 'Risk Log', icon: 'warning_amber', route: '/logs/risks' },
      { label: 'Change Log', icon: 'sync_alt', route: '/logs/changes' },
      { label: 'Quality Register', icon: 'fact_check', route: '/logs/quality' },
      { label: 'Lessons Log', icon: 'school', route: '/logs/lessons' },
    ],
  },
  {
    label: 'Quality',
    items: [
      { label: 'Requirements', icon: 'list_alt', route: '/qa/requirements' },
      { label: 'Acceptance Criteria', icon: 'task_alt', route: '/qa/acceptance-criteria' },
      { label: 'Test Cases', icon: 'science', route: '/qa/test-cases' },
      { label: 'Test Sessions', icon: 'play_circle_outline', route: '/qa/sessions' },
      { label: 'Traceability', icon: 'hub', route: '/qa/traceability' },
    ],
  },
  {
    label: 'Documents',
    items: [
      { label: 'Registry', icon: 'folder', route: '/documents' },
      { label: 'Review Queue', icon: 'rate_review', route: '/documents/queue' },
      { label: 'Search', icon: 'manage_search', route: '/documents/search' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { label: 'Highlight Reports', icon: 'summarize', route: '/reports/highlight' },
      { label: 'Checkpoint Reports', icon: 'flag', route: '/reports/checkpoint' },
      { label: 'Plan vs Actual', icon: 'insights', route: '/reports/plan-vs-actual' },
      { label: 'Exception Reports', icon: 'report_problem', route: '/reports/exceptions' },
    ],
  },
  {
    label: 'Microsoft 365',
    items: [
      { label: 'Email', icon: 'mail_outline', route: '/m365/email' },
      { label: 'SharePoint', icon: 'cloud_queue', route: '/m365/sharepoint' },
      { label: 'Teams & Calendar', icon: 'video_call', route: '/m365/teams' },
    ],
  },
  {
    label: 'AI',
    items: [
      { label: 'Suggestions', icon: 'auto_awesome', route: '/ai/suggestions' },
    ],
  },
];

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatTooltipModule, MatRippleModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected readonly layout = inject(LayoutService);
  protected readonly navGroups = NAV_GROUPS;
}
