import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ShellStore, AiDockTab } from '../../core/services/shell.store';

const TABS: { key: AiDockTab; label: string }[] = [
  { key: 'insight',   label: 'Insight' },
  { key: 'guidance',  label: 'Guidance' },
  { key: 'chat',      label: 'Chat' },
  { key: 'proposals', label: 'Proposals' },
];

@Component({
  selector: 'app-ai-dock',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './ai-dock.component.html',
  styleUrl: './ai-dock.component.scss',
})
export class AiDockComponent {
  protected readonly shell = inject(ShellStore);
  protected readonly tabs = TABS;
}
