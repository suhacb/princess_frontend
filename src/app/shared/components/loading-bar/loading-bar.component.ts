import { Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-bar',
  imports: [MatProgressBarModule],
  template: `
    @if (loading.isLoading()) {
      <mat-progress-bar class="loading-bar" mode="query" />
    }
  `,
  styles: [`
    .loading-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      height: 3px;
    }
  `],
})
export class LoadingBarComponent {
  protected readonly loading = inject(LoadingService);
}
