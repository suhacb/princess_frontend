import { Component, HostListener, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ShellStore } from '../../core/services/shell.store';

interface PaletteGroup {
  label: string;
  items: { icon: string; label: string; meta?: string }[];
}

@Component({
  selector: 'app-command-palette',
  imports: [MatIconModule],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss',
})
export class CommandPaletteComponent {
  protected readonly shell = inject(ShellStore);
  protected readonly query = signal('');

  protected readonly groups: PaletteGroup[] = [
    {
      label: 'Actions',
      items: [
        { icon: 'add', label: 'Raise risk', meta: 'Risk Log' },
        { icon: 'add', label: 'Raise issue', meta: 'Issue Log' },
        { icon: 'auto_awesome', label: 'Ask Princess', meta: 'AI' },
      ],
    },
    {
      label: 'Navigate',
      items: [
        { icon: 'dashboard', label: 'Project Home', meta: '/home' },
        { icon: 'warning_amber', label: 'Risk Log', meta: '/risks' },
        { icon: 'bug_report', label: 'Issue Log', meta: '/issues' },
        { icon: 'account_tree', label: 'Plan & stages', meta: '/plan' },
      ],
    },
  ];

  @HostListener('document:keydown.escape')
  protected close(): void {
    this.shell.closePalette();
  }

  protected onBackdropClick(): void {
    this.shell.closePalette();
  }
}
