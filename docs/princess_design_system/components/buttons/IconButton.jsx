import React from 'react';

/**
 * Princess icon button — round, icon-only target. Used in the top bar
 * (notifications, menu toggle) and table rows (more_vert). Material Icons.
 */

const STYLE_ID = 'pds-iconbutton-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-iconbtn{display:inline-flex;align-items:center;justify-content:center;
    border:none;background:transparent;border-radius:50%;cursor:pointer;
    color:var(--mat-sys-on-surface-variant);position:relative;
    transition:background var(--duration-base) var(--ease-standard),color var(--duration-base) var(--ease-standard);}
  .pds-iconbtn--sm{width:32px;height:32px;}
  .pds-iconbtn--sm .material-icons{font-size:18px;}
  .pds-iconbtn--md{width:40px;height:40px;}
  .pds-iconbtn--md .material-icons{font-size:22px;}
  .pds-iconbtn:not(:disabled):hover{background:color-mix(in srgb,var(--mat-sys-on-surface) 8%,transparent);color:var(--mat-sys-on-surface);}
  .pds-iconbtn:not(:disabled):active{background:color-mix(in srgb,var(--mat-sys-on-surface) 14%,transparent);}
  .pds-iconbtn--active{color:var(--mat-sys-primary);}
  .pds-iconbtn:disabled{opacity:.38;cursor:not-allowed;}
  .pds-iconbtn:focus-visible{outline:none;box-shadow:var(--focus-ring);}
  .pds-iconbtn__badge{position:absolute;top:5px;right:5px;min-width:16px;height:16px;
    padding:0 4px;border-radius:8px;background:var(--mat-sys-error);color:#fff;
    font-family:var(--font-display);font-size:10px;font-weight:600;line-height:16px;
    display:flex;align-items:center;justify-content:center;}
  `;
  document.head.appendChild(el);
}

export function IconButton({
  icon,
  size = 'md',
  active = false,
  badge,
  disabled = false,
  ariaLabel,
  onClick,
  style,
  ...rest
}) {
  ensureStyles();
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`pds-iconbtn pds-iconbtn--${size}${active ? ' pds-iconbtn--active' : ''}`}
      style={style}
      {...rest}
    >
      <span className="material-icons" aria-hidden="true">{icon}</span>
      {badge != null && <span className="pds-iconbtn__badge">{badge}</span>}
    </button>
  );
}
