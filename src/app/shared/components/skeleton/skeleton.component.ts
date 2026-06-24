import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `<div class="skeleton" [style.width]="width()" [style.height]="height()" [style.border-radius]="borderRadius()"></div>`,
  styles: [`
    .skeleton {
      background: linear-gradient(
        90deg,
        var(--mat-sys-surface-variant) 25%,
        var(--mat-sys-surface-container-high) 50%,
        var(--mat-sys-surface-variant) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }

    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .skeleton { animation: none; }
    }
  `],
})
export class SkeletonComponent {
  readonly width = input<string>('100%');
  readonly height = input<string>('1rem');
  readonly borderRadius = input<string>('4px');
}
