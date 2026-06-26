import React, { useState } from 'react';

/** Material 3 checkbox with label. Controlled or uncontrolled. */

const STYLE_ID = 'pds-checkbox-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-check{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-sans);
    font-size:.9375rem;color:var(--mat-sys-on-surface);cursor:pointer;user-select:none;}
  .pds-check__box{width:18px;height:18px;border-radius:3px;border:2px solid var(--mat-sys-on-surface-variant);
    display:flex;align-items:center;justify-content:center;flex:none;
    transition:background var(--duration-fast) var(--ease-standard),border-color var(--duration-fast) var(--ease-standard);}
  .pds-check__box .material-icons{font-size:16px;color:var(--mat-sys-on-primary);transform:scale(0);transition:transform var(--duration-fast) var(--ease-standard);}
  .pds-check--on .pds-check__box{background:var(--mat-sys-primary);border-color:var(--mat-sys-primary);}
  .pds-check--on .pds-check__box .material-icons{transform:scale(1);}
  .pds-check--disabled{opacity:.38;cursor:not-allowed;}
  `;
  document.head.appendChild(el);
}

export function Checkbox({ label, checked, defaultChecked = false, disabled = false, onChange, style }) {
  ensureStyles();
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked !== undefined ? checked : internal;
  return (
    <label className={`pds-check${on ? ' pds-check--on' : ''}${disabled ? ' pds-check--disabled' : ''}`} style={style}>
      <span className="pds-check__box">
        <span className="material-icons" aria-hidden="true">check</span>
      </span>
      <input type="checkbox" checked={on} disabled={disabled} hidden
        onChange={(e) => { setInternal(e.target.checked); onChange?.(e.target.checked); }} />
      {label}
    </label>
  );
}
