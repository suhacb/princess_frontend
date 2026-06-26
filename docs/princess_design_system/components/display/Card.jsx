import React from 'react';

/**
 * Surface card. Default = flat tonal (surface-container-low, no shadow) as used
 * across the app's overview/info cards. variant="outlined" adds a border;
 * variant="elevated" floats with shadow (menus/dialogs aesthetic).
 */

const STYLE_ID = 'pds-card-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-card{border-radius:var(--radius-card);padding:20px 24px;font-family:var(--font-sans);
    color:var(--mat-sys-on-surface);}
  .pds-card--tonal{background:var(--mat-sys-surface-container-low);}
  .pds-card--outlined{background:var(--mat-sys-surface-container-lowest);border:1px solid var(--mat-sys-outline-variant);}
  .pds-card--elevated{background:var(--mat-sys-surface-container-lowest);box-shadow:var(--elevation-1);}
  .pds-card__title{margin:0 0 14px;font-family:var(--font-display);font-size:.875rem;font-weight:600;
    text-transform:uppercase;letter-spacing:.06em;color:var(--mat-sys-on-surface-variant);}
  `;
  document.head.appendChild(el);
}

export function Card({ children, title, variant = 'tonal', style, ...rest }) {
  ensureStyles();
  return (
    <section className={`pds-card pds-card--${variant}`} style={style} {...rest}>
      {title && <h3 className="pds-card__title">{title}</h3>}
      {children}
    </section>
  );
}
