import { Component, HostListener, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../core/services/layout.service';
import { ShellStore } from '../../core/services/shell.store';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LoadingBarComponent } from '../../shared/components/loading-bar/loading-bar.component';
import { AiDockComponent } from '../ai-dock/ai-dock.component';
import { CommandPaletteComponent } from '../command-palette/command-palette.component';
import { ProjectSwitcherComponent } from '../project-switcher/project-switcher.component';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    TopBarComponent,
    SidebarComponent,
    LoadingBarComponent,
    AiDockComponent,
    CommandPaletteComponent,
    ProjectSwitcherComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  protected readonly layout = inject(LayoutService);
  protected readonly shell = inject(ShellStore);

  constructor() {
    effect(() => {
      if (this.layout.isMobile() && !this.layout.sidebarCollapsed()) {
        this.layout.toggleSidebar();
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.shell.openPalette();
    }
  }
}
