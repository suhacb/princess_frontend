import React, { useState } from 'react';

/** Material 3 switch toggle with optional label. */

const STYLE_ID = 'pds-switch-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-switch{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-sans);
    font-size:.9375rem;color:var(--mat-sys-on-surface);cursor:pointer;user-select:none;}
  .pds-switch__track{width:44px;height:24px;border-radius:12px;flex:none;position:relative;
    background:var(--mat-sys-surface-container-highest);border:2px solid var(--mat-sys-outline);
    transition:background var(--duration-base) var(--ease-standard),border-color var(--duration-base) var(--ease-standard);}
  .pds-switch__thumb{position:absolute;top:50%;left:4px;transform:translateY(-50%);
    width:12px;height:12px;border-radius:50%;background:var(--mat-sys-outline);
    transition:all var(--duration-base) var(--ease-standard);}
  .pds-switch--on .pds-switch__track{background:var(--mat-sys-primary);border-color:var(--mat-sys-primary);}
  .pds-switch--on .pds-switch__thumb{left:22px;width:16px;height:16px;background:var(--mat-sys-on-primary);}
  .pds-switch--disabled{opacity:.38;cursor:not-allowed;}
  `;
  document.head.appendChild(el);
}

export function Switch({ label, checked, defaultChecked = false, disabled = false, onChange, style }) {
  ensureStyles();
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked !== undefined ? checked : internal;
  return (
    <label className={`pds-switch${on ? ' pds-switch--on' : ''}${disabled ? ' pds-switch--disabled' : ''}`} style={style}>
      <span className="pds-switch__track"><span className="pds-switch__thumb" /></span>
      <input type="checkbox" checked={on} disabled={disabled} hidden
        onChange={(e) => { setInternal(e.target.checked); onChange?.(e.target.checked); }} />
      {label}
    </label>
  );
}
