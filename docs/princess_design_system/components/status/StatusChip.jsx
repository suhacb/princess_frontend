import React from 'react';

/**
 * Status chip — uppercase pill matching the app's project & risk status chips.
 * Provide a label and a tone, or use the preset maps for known PRINCE2 states.
 */

const STYLE_ID = 'pds-statuschip-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-statuschip{display:inline-flex;align-items:center;padding:2px 10px;border-radius:var(--radius-chip);
    font-family:var(--font-display);font-size:.75rem;font-weight:600;letter-spacing:.02em;
    text-transform:uppercase;white-space:nowrap;}
  `;
  document.head.appendChild(el);
}

// PRINCE2 project lifecycle + risk log presets (color, tone)
const PRESETS = {
  // project status
  pre_project: '#546e7a', initiation: '#475d92', delivery: '#2e7d32', closing: '#8f4d00', closed: '#546e7a',
  // risk status
  open: '#475d92', mitigated: '#2e7d32', materialised: '#ba1a1a',
  // generic tones
  primary: '#475d92', success: '#2e7d32', warning: '#f57c00', danger: '#ba1a1a', neutral: '#546e7a',
};

const LABELS = {
  pre_project: 'Pre-Project', initiation: 'Initiation', delivery: 'Delivery',
  closing: 'Closing', closed: 'Closed', open: 'Open', mitigated: 'Mitigated',
  materialised: 'Materialised',
};

export function StatusChip({ status, label, tone, style }) {
  ensureStyles();
  const key = status || tone;
  const c = PRESETS[key] || PRESETS.neutral;
  const text = label || LABELS[status] || status || '';
  return (
    <span className="pds-statuschip"
      style={{ background: `color-mix(in srgb, ${c} 13%, transparent)`, color: c, ...style }}>
      {text}
    </span>
  );
}
