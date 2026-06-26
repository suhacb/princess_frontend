import React from 'react';

/** Shimmer skeleton placeholder. Matches app/shared/skeleton. */

const STYLE_ID = 'pds-skeleton-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-skeleton{background:linear-gradient(90deg,var(--mat-sys-surface-variant) 25%,
    var(--mat-sys-surface-container-high) 50%,var(--mat-sys-surface-variant) 75%);
    background-size:200% 100%;animation:pds-shimmer 1.4s ease-in-out infinite;}
  @keyframes pds-shimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
  @media (prefers-reduced-motion:reduce){.pds-skeleton{animation:none;}}
  `;
  document.head.appendChild(el);
}

export function Skeleton({ width = '100%', height = '1rem', borderRadius = '4px', style }) {
  ensureStyles();
  return <div className="pds-skeleton" style={{ width, height, borderRadius, ...style }} />;
}
