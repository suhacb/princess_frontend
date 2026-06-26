import React, { useState } from 'react';

/** Underline tabs — matches the project-detail tab nav. Controlled or uncontrolled. */

const STYLE_ID = 'pds-tabs-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-tabs{display:flex;gap:4px;border-bottom:1px solid var(--mat-sys-outline-variant);font-family:var(--font-display);}
  .pds-tab{appearance:none;border:none;background:transparent;cursor:pointer;
    padding:10px 16px;font-size:.875rem;font-weight:500;color:var(--mat-sys-on-surface-variant);
    border-bottom:2px solid transparent;margin-bottom:-1px;
    transition:color var(--duration-base) var(--ease-standard),border-color var(--duration-base) var(--ease-standard);}
  .pds-tab:hover{color:var(--mat-sys-on-surface);}
  .pds-tab--active{color:var(--mat-sys-primary);border-bottom-color:var(--mat-sys-primary);}
  `;
  document.head.appendChild(el);
}

export function Tabs({ tabs = [], value, defaultValue, onChange, style }) {
  ensureStyles();
  const items = tabs.map((t) => (typeof t === 'string' ? { value: t, label: t } : t));
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const active = value !== undefined ? value : internal;
  return (
    <div className="pds-tabs" role="tablist" style={style}>
      {items.map((t) => (
        <button key={t.value} role="tab" aria-selected={t.value === active}
          className={`pds-tab${t.value === active ? ' pds-tab--active' : ''}`}
          onClick={() => { setInternal(t.value); onChange?.(t.value); }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
