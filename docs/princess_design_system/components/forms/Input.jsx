import React, { useState, useId } from 'react';

/** Material 3 outlined text field. Floating label, optional prefix icon, error + hint. */

const STYLE_ID = 'pds-input-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-field{font-family:var(--font-sans);display:flex;flex-direction:column;}
  .pds-field__box{position:relative;display:flex;align-items:center;gap:8px;
    height:48px;padding:0 14px;border:1px solid var(--mat-sys-outline-variant);
    border-radius:var(--radius-sm);background:var(--mat-sys-surface-container-lowest);
    transition:border-color var(--duration-base) var(--ease-standard);}
  .pds-field__box:hover{border-color:var(--mat-sys-on-surface-variant);}
  .pds-field--focused .pds-field__box{border-color:var(--mat-sys-primary);border-width:2px;padding:0 13px;}
  .pds-field--error .pds-field__box{border-color:var(--mat-sys-error);}
  .pds-field--disabled .pds-field__box{opacity:.5;background:var(--mat-sys-surface-container);}
  .pds-field__icon{color:var(--mat-sys-on-surface-variant);font-size:20px;flex:none;}
  .pds-field__input{flex:1;border:none;outline:none;background:transparent;
    font-family:var(--font-sans);font-size:.9375rem;color:var(--mat-sys-on-surface);min-width:0;}
  .pds-field__input::placeholder{color:var(--mat-sys-outline);}
  .pds-field__label{position:absolute;left:12px;top:50%;transform:translateY(-50%);
    padding:0 4px;background:var(--mat-sys-surface-container-lowest);
    color:var(--mat-sys-on-surface-variant);font-size:.9375rem;pointer-events:none;
    transition:all var(--duration-base) var(--ease-standard);}
  .pds-field--has-icon .pds-field__label{left:38px;}
  .pds-field--float .pds-field__label{top:0;font-size:.75rem;color:var(--mat-sys-primary);left:12px;}
  .pds-field--error.pds-field--float .pds-field__label{color:var(--mat-sys-error);}
  .pds-field__sub{font-size:.75rem;margin:4px 14px 0;min-height:1em;
    color:var(--mat-sys-on-surface-variant);}
  .pds-field--error .pds-field__sub{color:var(--mat-sys-error);}
  `;
  document.head.appendChild(el);
}

export function Input({
  label,
  value,
  defaultValue,
  placeholder,
  icon,
  type = 'text',
  error,
  hint,
  disabled = false,
  onChange,
  style,
  ...rest
}) {
  ensureStyles();
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [internal, setInternal] = useState(defaultValue ?? '');
  const val = value !== undefined ? value : internal;
  const float = focused || (val != null && String(val).length > 0) || !!placeholder;

  return (
    <div
      className={`pds-field${focused ? ' pds-field--focused' : ''}${error ? ' pds-field--error' : ''}` +
        `${disabled ? ' pds-field--disabled' : ''}${icon ? ' pds-field--has-icon' : ''}${float ? ' pds-field--float' : ''}`}
      style={style}
    >
      <div className="pds-field__box">
        {icon && <span className="material-icons pds-field__icon" aria-hidden="true">{icon}</span>}
        <input
          id={id}
          className="pds-field__input"
          type={type}
          value={val}
          placeholder={float ? placeholder : ''}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => { setInternal(e.target.value); onChange?.(e.target.value); }}
          {...rest}
        />
        {label && <label htmlFor={id} className="pds-field__label">{label}</label>}
      </div>
      {(error || hint) && <span className="pds-field__sub">{error || hint}</span>}
    </div>
  );
}
