import { Injectable, signal } from '@angular/core';

export type AppRole = 'pm' | 'pmo' | 'tm';
export type AiDockTab = 'insight' | 'guidance' | 'chat' | 'proposals';

export interface AiDockContext {
  route: string;
  item?: { ref: string; title: string };
}

@Injectable({ providedIn: 'root' })
export class ShellStore {
  readonly activeProjectId = signal<number | null>(null);
  readonly role = signal<AppRole>('pm');
  readonly aiDockOpen = signal(false);
  readonly aiDockTab = signal<AiDockTab>('insight');
  readonly aiDockContext = signal<AiDockContext | null>(null);
  readonly paletteOpen = signal(false);
  readonly switcherOpen = signal(false);

  setProject(id: number | null): void {
    this.activeProjectId.set(id);
  }

  setRole(role: AppRole): void {
    this.role.set(role);
  }

  toggleAiDock(): void {
    this.aiDockOpen.update(v => !v);
  }

  setAiDockTab(tab: AiDockTab): void {
    this.aiDockTab.set(tab);
  }

  setAiContext(ctx: AiDockContext | null): void {
    this.aiDockContext.set(ctx);
  }

  openPalette(): void {
    this.paletteOpen.set(true);
  }

  closePalette(): void {
    this.paletteOpen.set(false);
  }

  openSwitcher(): void {
    this.switcherOpen.set(true);
  }

  closeSwitcher(): void {
    this.switcherOpen.set(false);
  }
}
