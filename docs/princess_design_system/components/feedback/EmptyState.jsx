import React from 'react';

/** Empty state — centered icon + title + message + optional action. Matches app/shared. */

const STYLE_ID = 'pds-empty-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:64px 24px;text-align:center;gap:8px;font-family:var(--font-sans);}
  .pds-empty__icon{font-size:48px;color:var(--mat-sys-on-surface-variant);opacity:.4;margin-bottom:8px;}
  .pds-empty__title{margin:0;font-family:var(--font-display);font-size:18px;font-weight:600;color:var(--mat-sys-on-surface);}
  .pds-empty__msg{margin:0 0 16px;font-size:14px;color:var(--mat-sys-on-surface-variant);max-width:360px;line-height:1.5;}
  .pds-empty__action{height:40px;padding:0 22px;border-radius:var(--radius-pill);cursor:pointer;
    font-family:var(--font-display);font-weight:500;font-size:.875rem;
    background:transparent;color:var(--mat-sys-primary);border:1px solid var(--mat-sys-outline-variant);}
  .pds-empty__action:hover{background:color-mix(in srgb,var(--mat-sys-primary) 8%,transparent);border-color:var(--mat-sys-primary);}
  `;
  document.head.appendChild(el);
}

export function EmptyState({ icon = 'inbox', title = 'Nothing here', message, actionLabel, onAction, style }) {
  ensureStyles();
  return (
    <div className="pds-empty" style={style}>
      <span className="material-icons pds-empty__icon" aria-hidden="true">{icon}</span>
      <h3 className="pds-empty__title">{title}</h3>
      {message && <p className="pds-empty__msg">{message}</p>}
      {actionLabel && <button className="pds-empty__action" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}
