import React from 'react';

/**
 * AI suggestion card — the surface Princess uses to propose actions, pre-fill
 * items, or surface insights from project data. Azure-tinted with the brand
 * "auto_awesome" mark, an explanatory body, and accept/dismiss actions.
 */

const STYLE_ID = 'pds-aisuggestion-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-ai{font-family:var(--font-sans);border-radius:var(--radius-card);padding:16px 18px;
    background:color-mix(in srgb,var(--mat-sys-primary) 6%,var(--mat-sys-surface-container-lowest));
    border:1px solid color-mix(in srgb,var(--mat-sys-primary) 22%,transparent);position:relative;overflow:hidden;}
  .pds-ai::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--brand-gradient);}
  .pds-ai__head{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
  .pds-ai__spark{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;
    background:var(--brand-gradient-diagonal);color:#fff;flex:none;}
  .pds-ai__spark .material-icons{font-size:15px;}
  .pds-ai__label{font-family:var(--font-display);font-size:.6875rem;font-weight:600;letter-spacing:.1em;
    text-transform:uppercase;color:var(--mat-sys-primary);}
  .pds-ai__title{margin:0;font-family:var(--font-display);font-size:.95rem;font-weight:600;color:var(--mat-sys-on-surface);}
  .pds-ai__body{margin:4px 0 0;font-size:.875rem;line-height:1.5;color:var(--mat-sys-on-surface-variant);}
  .pds-ai__actions{display:flex;gap:8px;margin-top:14px;}
  .pds-ai__btn{height:34px;padding:0 16px;border-radius:var(--radius-pill);cursor:pointer;
    font-family:var(--font-display);font-weight:500;font-size:.8125rem;border:1px solid transparent;
    display:inline-flex;align-items:center;gap:6px;transition:background var(--duration-base) var(--ease-standard);}
  .pds-ai__btn .material-icons{font-size:16px;}
  .pds-ai__btn--accept{background:var(--mat-sys-primary);color:var(--mat-sys-on-primary);}
  .pds-ai__btn--accept:hover{background:color-mix(in srgb,var(--mat-sys-primary) 90%,#000);}
  .pds-ai__btn--dismiss{background:transparent;color:var(--mat-sys-on-surface-variant);}
  .pds-ai__btn--dismiss:hover{background:color-mix(in srgb,var(--mat-sys-on-surface) 7%,transparent);}
  `;
  document.head.appendChild(el);
}

export function AISuggestionCard({
  title,
  children,
  label = 'AI Suggestion',
  acceptLabel = 'Apply',
  dismissLabel = 'Dismiss',
  onAccept,
  onDismiss,
  style,
}) {
  ensureStyles();
  return (
    <div className="pds-ai" style={style}>
      <div className="pds-ai__head">
        <span className="pds-ai__spark"><span className="material-icons" aria-hidden="true">auto_awesome</span></span>
        <span className="pds-ai__label">{label}</span>
      </div>
      {title && <h4 className="pds-ai__title">{title}</h4>}
      {children && <p className="pds-ai__body">{children}</p>}
      {(onAccept || onDismiss) && (
        <div className="pds-ai__actions">
          {onAccept && <button className="pds-ai__btn pds-ai__btn--accept" onClick={onAccept}>
            <span className="material-icons" aria-hidden="true">check</span>{acceptLabel}</button>}
          {onDismiss && <button className="pds-ai__btn pds-ai__btn--dismiss" onClick={onDismiss}>{dismissLabel}</button>}
        </div>
      )}
    </div>
  );
}
