import React from 'react';

/** Small status pill. Color from a semantic tone; subtle tinted background. */

const STYLE_ID = 'pds-badge-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:12px;
    font-family:var(--font-display);font-size:.75rem;font-weight:600;letter-spacing:.02em;white-space:nowrap;}
  .pds-badge .material-icons{font-size:13px;}
  .pds-badge--solid{color:#fff;}
  `;
  document.head.appendChild(el);
}

const TONES = {
  primary: '#475d92', success: '#2e7d32', warning: '#f57c00',
  danger: '#ba1a1a', neutral: '#546e7a', info: '#475d92', tertiary: '#8f4d00',
};

export function Badge({ children, tone = 'neutral', solid = false, icon, style }) {
  ensureStyles();
  const c = TONES[tone] || TONES.neutral;
  const styles = solid
    ? { background: c, ...style }
    : { background: `color-mix(in srgb, ${c} 12%, transparent)`, color: c, ...style };
  return (
    <span className={`pds-badge${solid ? ' pds-badge--solid' : ''}`} style={styles}>
      {icon && <span className="material-icons" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}
