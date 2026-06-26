import React from 'react';

/**
 * PRINCE2 lifecycle stepper — horizontal stage tracker matching the project
 * detail header. Pass the ordered stage labels and the active index; earlier
 * stages render completed (filled + check), later ones pending.
 */

const STYLE_ID = 'pds-stepper-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-stepper{display:flex;align-items:center;padding:16px 20px;
    background:var(--mat-sys-surface-container-low);border-radius:var(--radius-card);font-family:var(--font-display);}
  .pds-step{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:90px;}
  .pds-step__dot{width:28px;height:28px;border-radius:50%;border:2px solid var(--mat-sys-outline);
    background:var(--mat-sys-surface);display:flex;align-items:center;justify-content:center;
    transition:all var(--duration-base) var(--ease-standard);}
  .pds-step__dot .material-icons{font-size:16px;color:#fff;}
  .pds-step__label{font-size:.7rem;color:var(--mat-sys-on-surface-variant);text-align:center;white-space:nowrap;}
  .pds-step--done .pds-step__dot{background:var(--mat-sys-primary);border-color:var(--mat-sys-primary);}
  .pds-step--done .pds-step__label{color:var(--mat-sys-primary);}
  .pds-step--active .pds-step__dot{border-color:var(--mat-sys-primary);border-width:3px;
    background:color-mix(in srgb,var(--mat-sys-primary) 12%,transparent);}
  .pds-step--active .pds-step__label{color:var(--mat-sys-primary);font-weight:600;}
  .pds-connector{flex:1;height:2px;background:var(--mat-sys-outline-variant);margin-bottom:22px;}
  .pds-connector--done{background:var(--mat-sys-primary);}
  `;
  document.head.appendChild(el);
}

export function LifecycleStepper({ stages = [], activeIndex = 0, style }) {
  ensureStyles();
  return (
    <div className="pds-stepper" style={style}>
      {stages.map((label, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const cls = done ? ' pds-step--done' : active ? ' pds-step--active' : '';
        return (
          <React.Fragment key={label}>
            <div className={`pds-step${cls}`}>
              <div className="pds-step__dot">
                {done && <span className="material-icons" aria-hidden="true">check</span>}
              </div>
              <span className="pds-step__label">{label}</span>
            </div>
            {i < stages.length - 1 && (
              <div className={`pds-connector${i < activeIndex ? ' pds-connector--done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
