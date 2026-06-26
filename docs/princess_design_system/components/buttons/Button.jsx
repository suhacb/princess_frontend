import React from 'react';

/**
 * Princess button — Material 3 styling on the Sinecon azure theme.
 * Variants mirror the app's mat-flat / mat-stroked / mat-button / tonal usage.
 */

const STYLE_ID = 'pds-button-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;
    font-family:var(--font-display);font-weight:500;letter-spacing:.01em;
    border:1px solid transparent;border-radius:var(--radius-pill);cursor:pointer;
    white-space:nowrap;text-decoration:none;user-select:none;
    transition:background var(--duration-base) var(--ease-standard),
      box-shadow var(--duration-base) var(--ease-standard),
      border-color var(--duration-base) var(--ease-standard),
      color var(--duration-base) var(--ease-standard);}
  .pds-btn--sm{height:32px;padding:0 14px;font-size:.8125rem;}
  .pds-btn--md{height:40px;padding:0 22px;font-size:.875rem;}
  .pds-btn--lg{height:48px;padding:0 28px;font-size:.9375rem;}
  .pds-btn .material-icons{font-size:18px;width:18px;height:18px;}
  .pds-btn:disabled{cursor:not-allowed;opacity:.38;box-shadow:none;}
  /* filled */
  .pds-btn--filled{background:var(--mat-sys-primary);color:var(--mat-sys-on-primary);}
  .pds-btn--filled:not(:disabled):hover{background:color-mix(in srgb,var(--mat-sys-primary) 90%,#000);box-shadow:var(--elevation-1);}
  .pds-btn--filled:not(:disabled):active{background:color-mix(in srgb,var(--mat-sys-primary) 82%,#000);}
  /* tonal */
  .pds-btn--tonal{background:var(--mat-sys-secondary-container);color:var(--mat-sys-on-secondary-container);}
  .pds-btn--tonal:not(:disabled):hover{background:color-mix(in srgb,var(--mat-sys-secondary-container) 88%,#000);}
  /* outlined */
  .pds-btn--outlined{background:transparent;color:var(--mat-sys-primary);border-color:var(--mat-sys-outline-variant);}
  .pds-btn--outlined:not(:disabled):hover{background:color-mix(in srgb,var(--mat-sys-primary) 8%,transparent);border-color:var(--mat-sys-primary);}
  /* text */
  .pds-btn--text{background:transparent;color:var(--mat-sys-primary);padding-left:14px;padding-right:14px;}
  .pds-btn--text:not(:disabled):hover{background:color-mix(in srgb,var(--mat-sys-primary) 8%,transparent);}
  /* danger */
  .pds-btn--danger{background:var(--mat-sys-error);color:var(--mat-sys-on-error);}
  .pds-btn--danger:not(:disabled):hover{background:color-mix(in srgb,var(--mat-sys-error) 90%,#000);box-shadow:var(--elevation-1);}
  .pds-btn:focus-visible{outline:none;box-shadow:var(--focus-ring);}
  `;
  document.head.appendChild(el);
}

export function Button({
  children,
  variant = 'filled',
  size = 'md',
  icon,
  trailingIcon,
  disabled = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  ensureStyles();
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`pds-btn pds-btn--${variant} pds-btn--${size}`}
      style={style}
      {...rest}
    >
      {icon && <span className="material-icons" aria-hidden="true">{icon}</span>}
      {children}
      {trailingIcon && <span className="material-icons" aria-hidden="true">{trailingIcon}</span>}
    </button>
  );
}
