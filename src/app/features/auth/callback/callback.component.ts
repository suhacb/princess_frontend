import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-callback',
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="callback-container">
      <mat-spinner diameter="48" />
    </div>
  `,
  styles: `
    .callback-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: var(--mat-sys-surface);
    }
  `,
})
export class CallbackComponent {}
