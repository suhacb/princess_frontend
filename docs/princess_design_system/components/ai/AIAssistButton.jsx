import React from 'react';

/**
 * AI assist button — the "auto_awesome" trigger that invites Princess to draft,
 * summarise or answer in-context. Gradient-bordered pill; use beside fields,
 * section headers, or as a floating composer entry point.
 */

const STYLE_ID = 'pds-aibutton-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-aibtn{display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 16px;cursor:pointer;
    font-family:var(--font-display);font-weight:500;font-size:.8125rem;border-radius:var(--radius-pill);
    color:var(--mat-sys-primary);background:var(--mat-sys-surface-container-lowest);
    border:1px solid transparent;position:relative;background-clip:padding-box;
    transition:background var(--duration-base) var(--ease-standard);}
  .pds-aibtn::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;
    background:var(--brand-gradient-diagonal);
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;}
  .pds-aibtn:hover{background:color-mix(in srgb,var(--mat-sys-primary) 7%,var(--mat-sys-surface-container-lowest));}
  .pds-aibtn .material-icons{font-size:17px;
    background:var(--brand-gradient-diagonal);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .pds-aibtn--solid{color:#fff;background:var(--brand-gradient-diagonal);border:none;}
  .pds-aibtn--solid::before{display:none;}
  .pds-aibtn--solid .material-icons{color:#fff;background:none;-webkit-background-clip:initial;}
  .pds-aibtn--solid:hover{filter:brightness(1.06);}
  `;
  document.head.appendChild(el);
}

export function AIAssistButton({ children = 'Ask Princess', icon = 'auto_awesome', solid = false, onClick, style }) {
  ensureStyles();
  return (
    <button className={`pds-aibtn${solid ? ' pds-aibtn--solid' : ''}`} onClick={onClick} style={style}>
      <span className="material-icons" aria-hidden="true">{icon}</span>
      {children}
    </button>
  );
}
