import React from 'react';

/**
 * Risk score badge — round badge colored by severity (probability × impact).
 * Ramp: 1–4 low (green), 5–9 medium (amber), 10–15 high (orange), 16–25 critical (red).
 * Matches features/risks/components/risk-score-badge.
 */

const STYLE_ID = 'pds-scorebadge-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-scorebadge{display:inline-flex;align-items:center;justify-content:center;
    width:32px;height:32px;border-radius:50%;font-family:var(--font-sans);
    font-size:.8rem;font-weight:700;}
  .pds-scorebadge--lg{width:40px;height:40px;font-size:.95rem;}
  `;
  document.head.appendChild(el);
}

function ramp(score) {
  if (score >= 16) return '#ba1a1a';
  if (score >= 10) return '#e65100';
  if (score >= 5) return '#f57f17';
  return '#2e7d32';
}

export function ScoreBadge({ score, size = 'md', style }) {
  ensureStyles();
  const c = ramp(score);
  return (
    <span className={`pds-scorebadge${size === 'lg' ? ' pds-scorebadge--lg' : ''}`}
      style={{ background: `color-mix(in srgb, ${c} 15%, transparent)`, color: c, ...style }}>
      {score}
    </span>
  );
}
