import React from 'react';

/** Filter / input chip. Optional leading icon and removable trailing ×. */

const STYLE_ID = 'pds-chip-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-chip{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;
    border-radius:var(--radius-chip);border:1px solid var(--mat-sys-outline-variant);
    background:var(--mat-sys-surface-container-lowest);font-family:var(--font-display);
    font-size:.8125rem;font-weight:500;color:var(--mat-sys-on-surface-variant);cursor:pointer;
    transition:background var(--duration-base) var(--ease-standard),border-color var(--duration-base) var(--ease-standard),color var(--duration-base) var(--ease-standard);}
  .pds-chip:hover{background:color-mix(in srgb,var(--mat-sys-on-surface) 5%,transparent);}
  .pds-chip--selected{background:color-mix(in srgb,var(--mat-sys-primary) 12%,transparent);
    border-color:transparent;color:var(--mat-sys-primary);}
  .pds-chip .material-icons{font-size:16px;}
  .pds-chip__remove{margin-right:-4px;border-radius:50%;display:flex;}
  .pds-chip__remove:hover{background:color-mix(in srgb,var(--mat-sys-on-surface) 12%,transparent);}
  `;
  document.head.appendChild(el);
}

export function Chip({ children, icon, selected = false, onRemove, onClick, style }) {
  ensureStyles();
  return (
    <span className={`pds-chip${selected ? ' pds-chip--selected' : ''}`} style={style} onClick={onClick}>
      {icon && <span className="material-icons" aria-hidden="true">{icon}</span>}
      {children}
      {onRemove && (
        <span className="material-icons pds-chip__remove" aria-hidden="true"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}>close</span>
      )}
    </span>
  );
}
