import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../core/services/layout.service';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { LoadingBarComponent } from '../../shared/components/loading-bar/loading-bar.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, TopBarComponent, SidebarComponent, BreadcrumbComponent, LoadingBarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  protected readonly layout = inject(LayoutService);

  constructor() {
    effect(() => {
      if (this.layout.isMobile() && !this.layout.sidebarCollapsed()) {
        this.layout.toggleSidebar();
      }
    });
  }
}
