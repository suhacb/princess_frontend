import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutService } from '../../core/services/layout.service';
import { AuthStore } from '../../core/auth/auth.store';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { AIAssistButtonComponent } from '../../shared/components/ai-assist-button/ai-assist-button.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-top-bar',
  imports: [
    RouterLink,
    MatDividerModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    AvatarComponent,
    AIAssistButtonComponent,
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  protected readonly layout = inject(LayoutService);
  private readonly authStore = inject(AuthStore);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  protected readonly user = this.authStore.user;

  protected readonly userName = computed(() => {
    const u = this.authStore.user();
    if (!u) return '';
    return `${u.name ?? ''} ${u.familyName ?? ''}`.trim() || u.username;
  });

  protected signOut(): void {
    const data: ConfirmDialogData = {
      title: 'Sign out',
      message: 'Are you sure you want to sign out?',
      confirmLabel: 'Sign out',
      confirmColor: 'warn',
    };
    this.dialog
      .open(ConfirmDialogComponent, { panelClass: 'princess-dialog', data })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) => {
        if (!confirmed) return;
        this.authStore.logout().subscribe(() => {
          window.location.href = `${environment.authFrontendUrl}/login?appName=${environment.appName}&appUrl=${environment.appUrl}`;
        });
      });
  }
}
