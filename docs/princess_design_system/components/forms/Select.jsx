import React, { useState, useRef, useEffect } from 'react';

/** Material 3 outlined select. Click to open a tonal menu of options. */

const STYLE_ID = 'pds-select-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-select{font-family:var(--font-sans);position:relative;display:inline-flex;flex-direction:column;min-width:160px;}
  .pds-select__box{display:flex;align-items:center;gap:8px;height:48px;padding:0 12px 0 14px;
    border:1px solid var(--mat-sys-outline-variant);border-radius:var(--radius-sm);
    background:var(--mat-sys-surface-container-lowest);cursor:pointer;
    transition:border-color var(--duration-base) var(--ease-standard);}
  .pds-select__box:hover{border-color:var(--mat-sys-on-surface-variant);}
  .pds-select--open .pds-select__box{border-color:var(--mat-sys-primary);border-width:2px;padding:0 11px 0 13px;}
  .pds-select__value{flex:1;font-size:.9375rem;color:var(--mat-sys-on-surface);}
  .pds-select__value--ph{color:var(--mat-sys-outline);}
  .pds-select__label{position:absolute;top:0;left:12px;padding:0 4px;font-size:.75rem;
    background:var(--mat-sys-surface-container-lowest);color:var(--mat-sys-on-surface-variant);}
  .pds-select--open .pds-select__label{color:var(--mat-sys-primary);}
  .pds-select__arrow{color:var(--mat-sys-on-surface-variant);font-size:22px;transition:transform var(--duration-base) var(--ease-standard);}
  .pds-select--open .pds-select__arrow{transform:rotate(180deg);}
  .pds-select__menu{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:20;
    background:var(--mat-sys-surface-container-lowest);border-radius:var(--radius-chip);
    box-shadow:var(--elevation-2);padding:6px;max-height:280px;overflow:auto;}
  .pds-select__opt{display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:6px;
    font-size:.875rem;color:var(--mat-sys-on-surface);cursor:pointer;}
  .pds-select__opt:hover{background:color-mix(in srgb,var(--mat-sys-on-surface) 6%,transparent);}
  .pds-select__opt--sel{background:color-mix(in srgb,var(--mat-sys-primary) 12%,transparent);color:var(--mat-sys-primary);font-weight:500;}
  .pds-select__opt .material-icons{font-size:18px;margin-left:auto;}
  `;
  document.head.appendChild(el);
}

export function Select({ label, value, options = [], placeholder = 'Select…', onChange, style }) {
  ensureStyles();
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(value);
  const ref = useRef(null);
  const val = value !== undefined ? value : internal;
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const selected = opts.find((o) => o.value === val);

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className={`pds-select${open ? ' pds-select--open' : ''}`} style={style}>
      <div className="pds-select__box" onClick={() => setOpen((o) => !o)}>
        <span className={`pds-select__value${selected ? '' : ' pds-select__value--ph'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="material-icons pds-select__arrow" aria-hidden="true">expand_more</span>
        {label && <span className="pds-select__label">{label}</span>}
      </div>
      {open && (
        <div className="pds-select__menu" role="listbox">
          {opts.map((o) => (
            <div
              key={o.value}
              role="option"
              aria-selected={o.value === val}
              className={`pds-select__opt${o.value === val ? ' pds-select__opt--sel' : ''}`}
              onClick={() => { setInternal(o.value); onChange?.(o.value); setOpen(false); }}
            >
              {o.label}
              {o.value === val && <span className="material-icons" aria-hidden="true">check</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
