import { Component, computed, input } from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<AvatarSize, { box: string; font: string }> = {
  sm: { box: '28px', font: '10px' },
  md: { box: '36px', font: '12px' },
  lg: { box: '48px', font: '16px' },
};

@Component({
  selector: 'app-avatar',
  template: `
    @if (src()) {
      <img
        class="avatar"
        [src]="src()"
        [alt]="name()"
        [style.width]="sizeBox()"
        [style.height]="sizeBox()"
      />
    } @else {
      <span
        class="avatar avatar--initials"
        [style.width]="sizeBox()"
        [style.height]="sizeBox()"
        [style.font-size]="sizeFontSize()"
        [attr.aria-label]="name()"
      >{{ initials() }}</span>
    }
  `,
  styles: `
    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      flex-shrink: 0;

      &--initials {
        background: var(--brand-gradient-diagonal);
        color: #fff;
        font-family: var(--font-display);
        font-weight: 500;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }
    }

    img.avatar {
      object-fit: cover;
    }
  `,
})
export class AvatarComponent {
  readonly name = input<string>('');
  readonly src = input<string>('');
  readonly size = input<AvatarSize>('md');

  protected readonly initials = computed(() => {
    const words = this.name().trim().split(/\s+/).filter(Boolean);
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  });

  protected readonly sizeBox = computed(() => SIZE_MAP[this.size()].box);
  protected readonly sizeFontSize = computed(() => SIZE_MAP[this.size()].font);
}
