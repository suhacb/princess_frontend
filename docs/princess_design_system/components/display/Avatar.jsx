import React from 'react';

/**
 * User avatar. Shows initials on the Sinecon brand gradient (matching the
 * app's top-bar avatar). Sizes sm/md/lg. Pass `name` for initials, or `src`.
 */

const STYLE_ID = 'pds-avatar-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-avatar{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;
    overflow:hidden;font-family:var(--font-display);font-weight:500;color:#fff;
    background:var(--brand-gradient-diagonal);letter-spacing:.03em;flex:none;}
  .pds-avatar img{width:100%;height:100%;object-fit:cover;}
  .pds-avatar--sm{width:28px;height:28px;font-size:10px;}
  .pds-avatar--md{width:36px;height:36px;font-size:12px;}
  .pds-avatar--lg{width:48px;height:48px;font-size:16px;}
  `;
  document.head.appendChild(el);
}

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
}

export function Avatar({ name, src, size = 'md', style }) {
  ensureStyles();
  return (
    <span className={`pds-avatar pds-avatar--${size}`} style={style} title={name}>
      {src ? <img src={src} alt={name || ''} /> : initials(name)}
    </span>
  );
}
