/* @ds-bundle: {"format":3,"namespace":"PrincessDesignSystem_3d336d","components":[{"name":"AIAssistButton","sourcePath":"components/ai/AIAssistButton.jsx"},{"name":"AISuggestionCard","sourcePath":"components/ai/AISuggestionCard.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Chip","sourcePath":"components/display/Chip.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Skeleton","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"Tabs","sourcePath":"components/feedback/Tabs.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"LifecycleStepper","sourcePath":"components/status/LifecycleStepper.jsx"},{"name":"ScoreBadge","sourcePath":"components/status/ScoreBadge.jsx"},{"name":"StatusChip","sourcePath":"components/status/StatusChip.jsx"}],"sourceHashes":{"components/ai/AIAssistButton.jsx":"8bd6023c915d","components/ai/AISuggestionCard.jsx":"ac25b64d21a1","components/buttons/Button.jsx":"5548772c5fe1","components/buttons/IconButton.jsx":"2aeb43c1c1a2","components/display/Avatar.jsx":"8899d5aa130f","components/display/Badge.jsx":"b6c47fd11d6c","components/display/Card.jsx":"0817b08943d5","components/display/Chip.jsx":"9ac1f849dc46","components/feedback/EmptyState.jsx":"f7b21fb385f0","components/feedback/Skeleton.jsx":"bb692cb7fa05","components/feedback/Tabs.jsx":"8b7d7a33b2be","components/forms/Checkbox.jsx":"25778d4c76c1","components/forms/Input.jsx":"cc145d005329","components/forms/Select.jsx":"ad5ed4c0c6fb","components/forms/Switch.jsx":"85d482878241","components/status/LifecycleStepper.jsx":"dba7a5cb7ed2","components/status/ScoreBadge.jsx":"fe448e0fc752","components/status/StatusChip.jsx":"84ccbd34b519","design_handoff_princess/reference_files/ui_kits/princess/data.js":"f1102acae6c9","explorations/cockpit/AIDock.jsx":"1f4ea64fd386","explorations/cockpit/Home.jsx":"5321f2687644","explorations/cockpit/Overlays.jsx":"bfefe5be865a","explorations/cockpit/Portfolio.jsx":"46fb0cc59e61","explorations/cockpit/RiskScreens.jsx":"53b554258aea","explorations/cockpit/Shell.jsx":"15a43f19d492","explorations/cockpit/Stages.jsx":"aba171c6d4da","explorations/cockpit/data.js":"95c85bba59a3","ui_kits/princess/AISuggestions.jsx":"e7288d406388","ui_kits/princess/ProjectDetail.jsx":"a45163fc8628","ui_kits/princess/Projects.jsx":"04071c6c594b","ui_kits/princess/RiskLog.jsx":"8f75ac03faf8","ui_kits/princess/Sidebar.jsx":"750fede9025e","ui_kits/princess/TopBar.jsx":"f594376d8378","ui_kits/princess/data.js":"f1102acae6c9"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PrincessDesignSystem_3d336d = window.PrincessDesignSystem_3d336d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/ai/AIAssistButton.jsx
try { (() => {
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
function AIAssistButton({
  children = 'Ask Princess',
  icon = 'auto_awesome',
  solid = false,
  onClick,
  style
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("button", {
    className: `pds-aibtn${solid ? ' pds-aibtn--solid' : ''}`,
    onClick: onClick,
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    "aria-hidden": "true"
  }, icon), children);
}
Object.assign(__ds_scope, { AIAssistButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/AIAssistButton.jsx", error: String((e && e.message) || e) }); }

// components/ai/AISuggestionCard.jsx
try { (() => {
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
function AISuggestionCard({
  title,
  children,
  label = 'AI Suggestion',
  acceptLabel = 'Apply',
  dismissLabel = 'Dismiss',
  onAccept,
  onDismiss,
  style
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", {
    className: "pds-ai",
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "pds-ai__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pds-ai__spark"
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    "aria-hidden": "true"
  }, "auto_awesome")), /*#__PURE__*/React.createElement("span", {
    className: "pds-ai__label"
  }, label)), title && /*#__PURE__*/React.createElement("h4", {
    className: "pds-ai__title"
  }, title), children && /*#__PURE__*/React.createElement("p", {
    className: "pds-ai__body"
  }, children), (onAccept || onDismiss) && /*#__PURE__*/React.createElement("div", {
    className: "pds-ai__actions"
  }, onAccept && /*#__PURE__*/React.createElement("button", {
    className: "pds-ai__btn pds-ai__btn--accept",
    onClick: onAccept
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    "aria-hidden": "true"
  }, "check"), acceptLabel), onDismiss && /*#__PURE__*/React.createElement("button", {
    className: "pds-ai__btn pds-ai__btn--dismiss",
    onClick: onDismiss
  }, dismissLabel)));
}
Object.assign(__ds_scope, { AISuggestionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/AISuggestionCard.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Princess button — Material 3 styling on the Sinecon azure theme.
 * Variants mirror the app's mat-flat / mat-stroked / mat-button / tonal usage.
 */

const STYLE_ID = 'pds-button-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;
    font-family:var(--font-display);font-weight:500;letter-spacing:.01em;
    border:1px solid transparent;border-radius:var(--radius-pill);cursor:pointer;
    white-space:nowrap;text-decoration:none;user-select:none;
    transition:background var(--duration-base) var(--ease-standard),
      box-shadow var(--duration-base) var(--ease-standard),
      border-color var(--duration-base) var(--ease-standard),
      color var(--duration-base) var(--ease-standard);}
  .pds-btn--sm{height:32px;padding:0 14px;font-size:.8125rem;}
  .pds-btn--md{height:40px;padding:0 22px;font-size:.875rem;}
  .pds-btn--lg{height:48px;padding:0 28px;font-size:.9375rem;}
  .pds-btn .material-icons{font-size:18px;width:18px;height:18px;}
  .pds-btn:disabled{cursor:not-allowed;opacity:.38;box-shadow:none;}
  /* filled */
  .pds-btn--filled{background:var(--mat-sys-primary);color:var(--mat-sys-on-primary);}
  .pds-btn--filled:not(:disabled):hover{background:color-mix(in srgb,var(--mat-sys-primary) 90%,#000);box-shadow:var(--elevation-1);}
  .pds-btn--filled:not(:disabled):active{background:color-mix(in srgb,var(--mat-sys-primary) 82%,#000);}
  /* tonal */
  .pds-btn--tonal{background:var(--mat-sys-secondary-container);color:var(--mat-sys-on-secondary-container);}
  .pds-btn--tonal:not(:disabled):hover{background:color-mix(in srgb,var(--mat-sys-secondary-container) 88%,#000);}
  /* outlined */
  .pds-btn--outlined{background:transparent;color:var(--mat-sys-primary);border-color:var(--mat-sys-outline-variant);}
  .pds-btn--outlined:not(:disabled):hover{background:color-mix(in srgb,var(--mat-sys-primary) 8%,transparent);border-color:var(--mat-sys-primary);}
  /* text */
  .pds-btn--text{background:transparent;color:var(--mat-sys-primary);padding-left:14px;padding-right:14px;}
  .pds-btn--text:not(:disabled):hover{background:color-mix(in srgb,var(--mat-sys-primary) 8%,transparent);}
  /* danger */
  .pds-btn--danger{background:var(--mat-sys-error);color:var(--mat-sys-on-error);}
  .pds-btn--danger:not(:disabled):hover{background:color-mix(in srgb,var(--mat-sys-error) 90%,#000);box-shadow:var(--elevation-1);}
  .pds-btn:focus-visible{outline:none;box-shadow:var(--focus-ring);}
  `;
  document.head.appendChild(el);
}
function Button({
  children,
  variant = 'filled',
  size = 'md',
  icon,
  trailingIcon,
  disabled = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    className: `pds-btn pds-btn--${variant} pds-btn--${size}`,
    style: style
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    "aria-hidden": "true"
  }, icon), children, trailingIcon && /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    "aria-hidden": "true"
  }, trailingIcon));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Princess icon button — round, icon-only target. Used in the top bar
 * (notifications, menu toggle) and table rows (more_vert). Material Icons.
 */

const STYLE_ID = 'pds-iconbutton-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-iconbtn{display:inline-flex;align-items:center;justify-content:center;
    border:none;background:transparent;border-radius:50%;cursor:pointer;
    color:var(--mat-sys-on-surface-variant);position:relative;
    transition:background var(--duration-base) var(--ease-standard),color var(--duration-base) var(--ease-standard);}
  .pds-iconbtn--sm{width:32px;height:32px;}
  .pds-iconbtn--sm .material-icons{font-size:18px;}
  .pds-iconbtn--md{width:40px;height:40px;}
  .pds-iconbtn--md .material-icons{font-size:22px;}
  .pds-iconbtn:not(:disabled):hover{background:color-mix(in srgb,var(--mat-sys-on-surface) 8%,transparent);color:var(--mat-sys-on-surface);}
  .pds-iconbtn:not(:disabled):active{background:color-mix(in srgb,var(--mat-sys-on-surface) 14%,transparent);}
  .pds-iconbtn--active{color:var(--mat-sys-primary);}
  .pds-iconbtn:disabled{opacity:.38;cursor:not-allowed;}
  .pds-iconbtn:focus-visible{outline:none;box-shadow:var(--focus-ring);}
  .pds-iconbtn__badge{position:absolute;top:5px;right:5px;min-width:16px;height:16px;
    padding:0 4px;border-radius:8px;background:var(--mat-sys-error);color:#fff;
    font-family:var(--font-display);font-size:10px;font-weight:600;line-height:16px;
    display:flex;align-items:center;justify-content:center;}
  `;
  document.head.appendChild(el);
}
function IconButton({
  icon,
  size = 'md',
  active = false,
  badge,
  disabled = false,
  ariaLabel,
  onClick,
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    disabled: disabled,
    onClick: onClick,
    className: `pds-iconbtn pds-iconbtn--${size}${active ? ' pds-iconbtn--active' : ''}`,
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    "aria-hidden": "true"
  }, icon), badge != null && /*#__PURE__*/React.createElement("span", {
    className: "pds-iconbtn__badge"
  }, badge));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
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
function Avatar({
  name,
  src,
  size = 'md',
  style
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("span", {
    className: `pds-avatar pds-avatar--${size}`,
    style: style,
    title: name
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name || ''
  }) : initials(name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
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
  primary: '#475d92',
  success: '#2e7d32',
  warning: '#f57c00',
  danger: '#ba1a1a',
  neutral: '#546e7a',
  info: '#475d92',
  tertiary: '#8f4d00'
};
function Badge({
  children,
  tone = 'neutral',
  solid = false,
  icon,
  style
}) {
  ensureStyles();
  const c = TONES[tone] || TONES.neutral;
  const styles = solid ? {
    background: c,
    ...style
  } : {
    background: `color-mix(in srgb, ${c} 12%, transparent)`,
    color: c,
    ...style
  };
  return /*#__PURE__*/React.createElement("span", {
    className: `pds-badge${solid ? ' pds-badge--solid' : ''}`,
    style: styles
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    "aria-hidden": "true"
  }, icon), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Surface card. Default = flat tonal (surface-container-low, no shadow) as used
 * across the app's overview/info cards. variant="outlined" adds a border;
 * variant="elevated" floats with shadow (menus/dialogs aesthetic).
 */

const STYLE_ID = 'pds-card-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-card{border-radius:var(--radius-card);padding:20px 24px;font-family:var(--font-sans);
    color:var(--mat-sys-on-surface);}
  .pds-card--tonal{background:var(--mat-sys-surface-container-low);}
  .pds-card--outlined{background:var(--mat-sys-surface-container-lowest);border:1px solid var(--mat-sys-outline-variant);}
  .pds-card--elevated{background:var(--mat-sys-surface-container-lowest);box-shadow:var(--elevation-1);}
  .pds-card__title{margin:0 0 14px;font-family:var(--font-display);font-size:.875rem;font-weight:600;
    text-transform:uppercase;letter-spacing:.06em;color:var(--mat-sys-on-surface-variant);}
  `;
  document.head.appendChild(el);
}
function Card({
  children,
  title,
  variant = 'tonal',
  style,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("section", _extends({
    className: `pds-card pds-card--${variant}`,
    style: style
  }, rest), title && /*#__PURE__*/React.createElement("h3", {
    className: "pds-card__title"
  }, title), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Chip.jsx
try { (() => {
/** Filter / input chip. Optional leading icon and removable trailing ×. */

const STYLE_ID = 'pds-chip-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-chip{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;
    border-radius:var(--radius-chip);border:1px solid var(--mat-sys-outline-variant);
    background:var(--mat-sys-surface-container-lowest);font-family:var(--font-display);
    font-size:.8125rem;font-weight:500;color:var(--mat-sys-on-surface-variant);cursor:pointer;
    transition:background var(--duration-base) var(--ease-standard),border-color var(--duration-base) var(--ease-standard),color var(--duration-base) var(--ease-standard);}
  .pds-chip:hover{background:color-mix(in srgb,var(--mat-sys-on-surface) 5%,transparent);}
  .pds-chip--selected{background:color-mix(in srgb,var(--mat-sys-primary) 12%,transparent);
    border-color:transparent;color:var(--mat-sys-primary);}
  .pds-chip .material-icons{font-size:16px;}
  .pds-chip__remove{margin-right:-4px;border-radius:50%;display:flex;}
  .pds-chip__remove:hover{background:color-mix(in srgb,var(--mat-sys-on-surface) 12%,transparent);}
  `;
  document.head.appendChild(el);
}
function Chip({
  children,
  icon,
  selected = false,
  onRemove,
  onClick,
  style
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("span", {
    className: `pds-chip${selected ? ' pds-chip--selected' : ''}`,
    style: style,
    onClick: onClick
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    "aria-hidden": "true"
  }, icon), children, onRemove && /*#__PURE__*/React.createElement("span", {
    className: "material-icons pds-chip__remove",
    "aria-hidden": "true",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    }
  }, "close"));
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Chip.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
/** Empty state — centered icon + title + message + optional action. Matches app/shared. */

const STYLE_ID = 'pds-empty-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:64px 24px;text-align:center;gap:8px;font-family:var(--font-sans);}
  .pds-empty__icon{font-size:48px;color:var(--mat-sys-on-surface-variant);opacity:.4;margin-bottom:8px;}
  .pds-empty__title{margin:0;font-family:var(--font-display);font-size:18px;font-weight:600;color:var(--mat-sys-on-surface);}
  .pds-empty__msg{margin:0 0 16px;font-size:14px;color:var(--mat-sys-on-surface-variant);max-width:360px;line-height:1.5;}
  .pds-empty__action{height:40px;padding:0 22px;border-radius:var(--radius-pill);cursor:pointer;
    font-family:var(--font-display);font-weight:500;font-size:.875rem;
    background:transparent;color:var(--mat-sys-primary);border:1px solid var(--mat-sys-outline-variant);}
  .pds-empty__action:hover{background:color-mix(in srgb,var(--mat-sys-primary) 8%,transparent);border-color:var(--mat-sys-primary);}
  `;
  document.head.appendChild(el);
}
function EmptyState({
  icon = 'inbox',
  title = 'Nothing here',
  message,
  actionLabel,
  onAction,
  style
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", {
    className: "pds-empty",
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-icons pds-empty__icon",
    "aria-hidden": "true"
  }, icon), /*#__PURE__*/React.createElement("h3", {
    className: "pds-empty__title"
  }, title), message && /*#__PURE__*/React.createElement("p", {
    className: "pds-empty__msg"
  }, message), actionLabel && /*#__PURE__*/React.createElement("button", {
    className: "pds-empty__action",
    onClick: onAction
  }, actionLabel));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Skeleton.jsx
try { (() => {
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
function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  style
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", {
    className: "pds-skeleton",
    style: {
      width,
      height,
      borderRadius,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Skeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tabs.jsx
try { (() => {
const {
  useState
} = React;
/** Underline tabs — matches the project-detail tab nav. Controlled or uncontrolled. */
const STYLE_ID = 'pds-tabs-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-tabs{display:flex;gap:4px;border-bottom:1px solid var(--mat-sys-outline-variant);font-family:var(--font-display);}
  .pds-tab{appearance:none;border:none;background:transparent;cursor:pointer;
    padding:10px 16px;font-size:.875rem;font-weight:500;color:var(--mat-sys-on-surface-variant);
    border-bottom:2px solid transparent;margin-bottom:-1px;
    transition:color var(--duration-base) var(--ease-standard),border-color var(--duration-base) var(--ease-standard);}
  .pds-tab:hover{color:var(--mat-sys-on-surface);}
  .pds-tab--active{color:var(--mat-sys-primary);border-bottom-color:var(--mat-sys-primary);}
  `;
  document.head.appendChild(el);
}
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style
}) {
  ensureStyles();
  const items = tabs.map(t => typeof t === 'string' ? {
    value: t,
    label: t
  } : t);
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const active = value !== undefined ? value : internal;
  return /*#__PURE__*/React.createElement("div", {
    className: "pds-tabs",
    role: "tablist",
    style: style
  }, items.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.value,
    role: "tab",
    "aria-selected": t.value === active,
    className: `pds-tab${t.value === active ? ' pds-tab--active' : ''}`,
    onClick: () => {
      setInternal(t.value);
      onChange?.(t.value);
    }
  }, t.label)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
const {
  useState
} = React;
/** Material 3 checkbox with label. Controlled or uncontrolled. */
const STYLE_ID = 'pds-checkbox-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-check{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-sans);
    font-size:.9375rem;color:var(--mat-sys-on-surface);cursor:pointer;user-select:none;}
  .pds-check__box{width:18px;height:18px;border-radius:3px;border:2px solid var(--mat-sys-on-surface-variant);
    display:flex;align-items:center;justify-content:center;flex:none;
    transition:background var(--duration-fast) var(--ease-standard),border-color var(--duration-fast) var(--ease-standard);}
  .pds-check__box .material-icons{font-size:16px;color:var(--mat-sys-on-primary);transform:scale(0);transition:transform var(--duration-fast) var(--ease-standard);}
  .pds-check--on .pds-check__box{background:var(--mat-sys-primary);border-color:var(--mat-sys-primary);}
  .pds-check--on .pds-check__box .material-icons{transform:scale(1);}
  .pds-check--disabled{opacity:.38;cursor:not-allowed;}
  `;
  document.head.appendChild(el);
}
function Checkbox({
  label,
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  style
}) {
  ensureStyles();
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked !== undefined ? checked : internal;
  return /*#__PURE__*/React.createElement("label", {
    className: `pds-check${on ? ' pds-check--on' : ''}${disabled ? ' pds-check--disabled' : ''}`,
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "pds-check__box"
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    "aria-hidden": "true"
  }, "check")), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: on,
    disabled: disabled,
    hidden: true,
    onChange: e => {
      setInternal(e.target.checked);
      onChange?.(e.target.checked);
    }
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useId
} = React;
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
function Input({
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
  const float = focused || val != null && String(val).length > 0 || !!placeholder;
  return /*#__PURE__*/React.createElement("div", {
    className: `pds-field${focused ? ' pds-field--focused' : ''}${error ? ' pds-field--error' : ''}` + `${disabled ? ' pds-field--disabled' : ''}${icon ? ' pds-field--has-icon' : ''}${float ? ' pds-field--float' : ''}`,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "pds-field__box"
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "material-icons pds-field__icon",
    "aria-hidden": "true"
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    className: "pds-field__input",
    type: type,
    value: val,
    placeholder: float ? placeholder : '',
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: e => {
      setInternal(e.target.value);
      onChange?.(e.target.value);
    }
  }, rest)), label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    className: "pds-field__label"
  }, label)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    className: "pds-field__sub"
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const {
  useState,
  useRef,
  useEffect
} = React;
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
function Select({
  label,
  value,
  options = [],
  placeholder = 'Select…',
  onChange,
  style
}) {
  ensureStyles();
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(value);
  const ref = useRef(null);
  const val = value !== undefined ? value : internal;
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  const selected = opts.find(o => o.value === val);
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: `pds-select${open ? ' pds-select--open' : ''}`,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "pds-select__box",
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("span", {
    className: `pds-select__value${selected ? '' : ' pds-select__value--ph'}`
  }, selected ? selected.label : placeholder), /*#__PURE__*/React.createElement("span", {
    className: "material-icons pds-select__arrow",
    "aria-hidden": "true"
  }, "expand_more"), label && /*#__PURE__*/React.createElement("span", {
    className: "pds-select__label"
  }, label)), open && /*#__PURE__*/React.createElement("div", {
    className: "pds-select__menu",
    role: "listbox"
  }, opts.map(o => /*#__PURE__*/React.createElement("div", {
    key: o.value,
    role: "option",
    "aria-selected": o.value === val,
    className: `pds-select__opt${o.value === val ? ' pds-select__opt--sel' : ''}`,
    onClick: () => {
      setInternal(o.value);
      onChange?.(o.value);
      setOpen(false);
    }
  }, o.label, o.value === val && /*#__PURE__*/React.createElement("span", {
    className: "material-icons",
    "aria-hidden": "true"
  }, "check")))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
const {
  useState
} = React;
/** Material 3 switch toggle with optional label. */
const STYLE_ID = 'pds-switch-styles';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .pds-switch{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-sans);
    font-size:.9375rem;color:var(--mat-sys-on-surface);cursor:pointer;user-select:none;}
  .pds-switch__track{width:44px;height:24px;border-radius:12px;flex:none;position:relative;
    background:var(--mat-sys-surface-container-highest);border:2px solid var(--mat-sys-outline);
    transition:background var(--duration-base) var(--ease-standard),border-color var(--duration-base) var(--ease-standard);}
  .pds-switch__thumb{position:absolute;top:50%;left:4px;transform:translateY(-50%);
    width:12px;height:12px;border-radius:50%;background:var(--mat-sys-outline);
    transition:all var(--duration-base) var(--ease-standard);}
  .pds-switch--on .pds-switch__track{background:var(--mat-sys-primary);border-color:var(--mat-sys-primary);}
  .pds-switch--on .pds-switch__thumb{left:22px;width:16px;height:16px;background:var(--mat-sys-on-primary);}
  .pds-switch--disabled{opacity:.38;cursor:not-allowed;}
  `;
  document.head.appendChild(el);
}
function Switch({
  label,
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  style
}) {
  ensureStyles();
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked !== undefined ? checked : internal;
  return /*#__PURE__*/React.createElement("label", {
    className: `pds-switch${on ? ' pds-switch--on' : ''}${disabled ? ' pds-switch--disabled' : ''}`,
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "pds-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pds-switch__thumb"
  })), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: on,
    disabled: disabled,
    hidden: true,
    onChange: e => {
      setInternal(e.target.checked);
      onChange?.(e.target.checked);
    }
  }), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/status/LifecycleStepper.jsx
try { (() => {
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
function LifecycleStepper({
  stages = [],
  activeIndex = 0,
  style
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", {
    className: "pds-stepper",
    style: style
  }, stages.map((label, i) => {
    const done = i < activeIndex;
    const active = i === activeIndex;
    const cls = done ? ' pds-step--done' : active ? ' pds-step--active' : '';
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: label
    }, /*#__PURE__*/React.createElement("div", {
      className: `pds-step${cls}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "pds-step__dot"
    }, done && /*#__PURE__*/React.createElement("span", {
      className: "material-icons",
      "aria-hidden": "true"
    }, "check")), /*#__PURE__*/React.createElement("span", {
      className: "pds-step__label"
    }, label)), i < stages.length - 1 && /*#__PURE__*/React.createElement("div", {
      className: `pds-connector${i < activeIndex ? ' pds-connector--done' : ''}`
    }));
  }));
}
Object.assign(__ds_scope, { LifecycleStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/LifecycleStepper.jsx", error: String((e && e.message) || e) }); }

// components/status/ScoreBadge.jsx
try { (() => {
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
function ScoreBadge({
  score,
  size = 'md',
  style
}) {
  ensureStyles();
  const c = ramp(score);
  return /*#__PURE__*/React.createElement("span", {
    className: `pds-scorebadge${size === 'lg' ? ' pds-scorebadge--lg' : ''}`,
    style: {
      background: `color-mix(in srgb, ${c} 15%, transparent)`,
      color: c,
      ...style
    }
  }, score);
}
Object.assign(__ds_scope, { ScoreBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/ScoreBadge.jsx", error: String((e && e.message) || e) }); }

// components/status/StatusChip.jsx
try { (() => {
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
  pre_project: '#546e7a',
  initiation: '#475d92',
  delivery: '#2e7d32',
  closing: '#8f4d00',
  closed: '#546e7a',
  // risk status
  open: '#475d92',
  mitigated: '#2e7d32',
  materialised: '#ba1a1a',
  // generic tones
  primary: '#475d92',
  success: '#2e7d32',
  warning: '#f57c00',
  danger: '#ba1a1a',
  neutral: '#546e7a'
};
const LABELS = {
  pre_project: 'Pre-Project',
  initiation: 'Initiation',
  delivery: 'Delivery',
  closing: 'Closing',
  closed: 'Closed',
  open: 'Open',
  mitigated: 'Mitigated',
  materialised: 'Materialised'
};
function StatusChip({
  status,
  label,
  tone,
  style
}) {
  ensureStyles();
  const key = status || tone;
  const c = PRESETS[key] || PRESETS.neutral;
  const text = label || LABELS[status] || status || '';
  return /*#__PURE__*/React.createElement("span", {
    className: "pds-statuschip",
    style: {
      background: `color-mix(in srgb, ${c} 13%, transparent)`,
      color: c,
      ...style
    }
  }, text);
}
Object.assign(__ds_scope, { StatusChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/StatusChip.jsx", error: String((e && e.message) || e) }); }

// design_handoff_princess/reference_files/ui_kits/princess/data.js
try { (() => {
// Mock data for the Princess UI kit — PRINCE2 project management.
window.PRINCESS_DATA = {
  user: {
    name: 'Ana',
    familyName: 'Novak',
    email: 'ana.novak@sinecon.eu',
    initials: 'AN'
  },
  nav: [{
    label: 'Overview',
    items: [{
      label: 'Dashboard',
      icon: 'dashboard',
      key: 'dashboard'
    }, {
      label: 'PRINCE2 Guide',
      icon: 'menu_book',
      key: 'guide'
    }]
  }, {
    label: 'Project',
    items: [{
      label: 'Projects',
      icon: 'folder_open',
      key: 'projects'
    }]
  }, {
    label: 'Planning',
    items: [{
      label: 'Work Breakdown',
      icon: 'account_tree',
      key: 'wbs'
    }, {
      label: 'Timeline',
      icon: 'calendar_view_week',
      key: 'timeline'
    }, {
      label: 'Tasks',
      icon: 'check_circle_outline',
      key: 'tasks'
    }]
  }, {
    label: 'Logs',
    items: [{
      label: 'Daily Log',
      icon: 'edit_note',
      key: 'daily-log'
    }, {
      label: 'Issue Log',
      icon: 'bug_report',
      key: 'issues'
    }, {
      label: 'Risk Log',
      icon: 'warning_amber',
      key: 'risks'
    }, {
      label: 'Change Log',
      icon: 'sync_alt',
      key: 'changes'
    }, {
      label: 'Quality Register',
      icon: 'fact_check',
      key: 'quality'
    }, {
      label: 'Lessons Log',
      icon: 'school',
      key: 'lessons'
    }]
  }, {
    label: 'Reports',
    items: [{
      label: 'Highlight Reports',
      icon: 'summarize',
      key: 'highlight'
    }, {
      label: 'Exception Reports',
      icon: 'report_problem',
      key: 'exceptions'
    }]
  }, {
    label: 'AI',
    items: [{
      label: 'Suggestions',
      icon: 'auto_awesome',
      key: 'ai'
    }]
  }],
  projects: [{
    id: 1,
    name: 'Office Relocation',
    reference: 'PROJ-001',
    status: 'delivery',
    stage: 'Stage 2 — Fit-out',
    created: '12 Mar 2025',
    tolerances: 'full'
  }, {
    id: 2,
    name: 'ERP Migration',
    reference: 'PROJ-002',
    status: 'initiation',
    stage: 'Initiation',
    created: '03 Apr 2025',
    tolerances: 'partial'
  }, {
    id: 3,
    name: 'Customer Portal Rebuild',
    reference: 'PROJ-003',
    status: 'delivery',
    stage: 'Stage 3 — Build',
    created: '21 Jan 2025',
    tolerances: 'full'
  }, {
    id: 4,
    name: 'ISO 27001 Certification',
    reference: 'PROJ-004',
    status: 'closing',
    stage: 'Closing',
    created: '08 Nov 2024',
    tolerances: 'partial'
  }, {
    id: 5,
    name: 'Warehouse Automation',
    reference: 'PROJ-005',
    status: 'pre_project',
    stage: '—',
    created: '02 Jun 2025',
    tolerances: 'none'
  }, {
    id: 6,
    name: 'Brand Refresh 2024',
    reference: 'PROJ-006',
    status: 'closed',
    stage: 'Closed',
    created: '14 Feb 2024',
    tolerances: 'full'
  }],
  risks: [{
    id: 1,
    score: 20,
    title: 'Key supplier may miss fit-out deadline',
    category: 'Schedule',
    proximity: 'Imminent',
    response: 'Reduce',
    status: 'open',
    owner: 'A. Novak'
  }, {
    id: 2,
    score: 12,
    title: 'Asbestos discovered in ceiling void',
    category: 'Health & Safety',
    proximity: 'Near',
    response: 'Transfer',
    status: 'open',
    owner: 'M. Horvat'
  }, {
    id: 3,
    score: 9,
    title: 'Network cabling spec not finalised',
    category: 'Technical',
    proximity: 'Near',
    response: 'Reduce',
    status: 'mitigated',
    owner: 'J. Kovač'
  }, {
    id: 4,
    score: 6,
    title: 'Furniture lead time exceeds plan',
    category: 'Procurement',
    proximity: 'Distant',
    response: 'Accept',
    status: 'open',
    owner: 'A. Novak'
  }, {
    id: 5,
    score: 16,
    title: 'Budget overrun on M&E works',
    category: 'Cost',
    proximity: 'Imminent',
    response: 'Avoid',
    status: 'materialised',
    owner: 'T. Zajc'
  }, {
    id: 6,
    score: 4,
    title: 'Staff resistance to open-plan layout',
    category: 'People',
    proximity: 'Distant',
    response: 'Reduce',
    status: 'mitigated',
    owner: 'S. Petek'
  }, {
    id: 7,
    score: 3,
    title: 'Parking permits delayed by council',
    category: 'External',
    proximity: 'Distant',
    response: 'Accept',
    status: 'closed',
    owner: 'M. Horvat'
  }],
  suggestions: [{
    id: 1,
    icon: 'group_off',
    title: '2 open risks have no mitigation owner',
    body: 'Risks R-004 and R-006 are unassigned. Assign the project manager as interim owner so they stay tracked at the next checkpoint.',
    accept: 'Assign owner',
    context: 'Risk Log'
  }, {
    id: 2,
    icon: 'summarize',
    title: 'Draft this week\u2019s Highlight Report',
    body: 'Princess can compile progress, the 7 active risks and 3 open issues into a Highlight Report for the Project Board, ready for your review.',
    accept: 'Generate draft',
    context: 'Reports'
  }, {
    id: 3,
    icon: 'trending_up',
    title: 'Budget tolerance is 82% consumed',
    body: 'At the current burn rate, the M&E work package will breach its cost tolerance in ~9 days. Consider raising an Exception Report.',
    accept: 'Raise exception',
    context: 'Stage 2'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_princess/reference_files/ui_kits/princess/data.js", error: String((e && e.message) || e) }); }

// explorations/cockpit/AIDock.jsx
try { (() => {
// Princess AI dock — persistent right rail unifying four AI surfaces:
// Insight (quick, per-context), Guidance (PRINCE2 "what to do"), Chat, Proposals.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const {
    useState
  } = React;
  const TABS = [{
    key: 'insight',
    label: 'Insight',
    icon: 'lightbulb'
  }, {
    key: 'guidance',
    label: 'Guidance',
    icon: 'menu_book'
  }, {
    key: 'chat',
    label: 'Chat',
    icon: 'forum'
  }, {
    key: 'proposals',
    label: 'Proposals',
    icon: 'task_alt'
  }];
  function contextLabel(ctx) {
    if (ctx.item) return ctx.item.ref + ' · ' + ctx.item.title;
    return {
      home: 'Project Home',
      risks: 'Risk Log',
      stages: 'Plan & stages',
      portfolio: 'All projects',
      docs: 'Documents'
    }[ctx.route] || 'This project';
  }
  function AICard({
    eyebrow,
    children,
    actions
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-aicard"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-aicard__head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-aicard__mark"
    }), /*#__PURE__*/React.createElement("span", {
      className: "ck-aicard__eyebrow"
    }, eyebrow)), /*#__PURE__*/React.createElement("div", {
      className: "ck-aicard__body"
    }, children), actions && /*#__PURE__*/React.createElement("div", {
      className: "ck-aicard__actions"
    }, actions));
  }
  function Insight({
    ctx
  }) {
    if (ctx.item) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AICard, {
        eyebrow: "Quick insight"
      }, ctx.item.ref, " is your highest-scoring open item and is blocking Stage 3 sign-off."), /*#__PURE__*/React.createElement(AICard, {
        eyebrow: "Why it matters"
      }, "Two linked documents disagree on steel lead time \u2014 6 vs 9 weeks. Resolve before the gate."));
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AICard, {
      eyebrow: "For you today"
    }, "Stage 3 time tolerance is 80% consumed. One critical risk (R-016) and one unowned risk (R-011) need attention."), /*#__PURE__*/React.createElement(AICard, {
      eyebrow: "Trend"
    }, "Three of your eight open risks now trace back to the same steel supplier."));
  }
  function Guidance({
    ctx
  }) {
    return /*#__PURE__*/React.createElement(AICard, {
      eyebrow: "PRINCE2 guidance"
    }, "A Critical risk that threatens stage tolerance calls for an exception assessment.", /*#__PURE__*/React.createElement("ol", {
      className: "ck-steps"
    }, /*#__PURE__*/React.createElement("li", null, "Assess the deviation against Stage 3 time tolerance."), /*#__PURE__*/React.createElement("li", null, "Notify the Project Board if a breach is forecast."), /*#__PURE__*/React.createElement("li", null, "Produce an Exception Report for their decision.")));
  }
  function Chat() {
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-chat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-bubble ck-bubble--me"
    }, "What's our exposure if steelwork slips two weeks?"), /*#__PURE__*/React.createElement("div", {
      className: "ck-bubble ck-bubble--ai"
    }, "A two-week slip pushes Stage 3 to +10 days \u2014 exactly your time-tolerance limit \u2014 and delays the cabling work package. Want me to draft the Exception Report?"), /*#__PURE__*/React.createElement("div", {
      className: "ck-chat__suggest"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ck-suggchip"
    }, "Draft the exception report"), /*#__PURE__*/React.createElement("button", {
      className: "ck-suggchip"
    }, "Show the affected work packages")));
  }
  function Proposals({
    onApply
  }) {
    const {
      Button
    } = DS;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AICard, {
      eyebrow: "Proposal",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "filled",
        size: "sm",
        icon: "auto_awesome",
        onClick: onApply
      }, "Generate"), /*#__PURE__*/React.createElement(Button, {
        variant: "text",
        size: "sm",
        onClick: onApply
      }, "Dismiss"))
    }, "Draft an Exception Report citing R-016 and the linked issue I-042."), /*#__PURE__*/React.createElement(AICard, {
      eyebrow: "Proposal",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "filled",
        size: "sm",
        icon: "check",
        onClick: onApply
      }, "Apply"), /*#__PURE__*/React.createElement(Button, {
        variant: "text",
        size: "sm",
        onClick: onApply
      }, "Dismiss"))
    }, "Assign the project manager as interim owner of R-011 so it stays tracked."));
  }
  function AIDock({
    ctx,
    onClose
  }) {
    const [tab, setTab] = useState('insight');
    const [toast, setToast] = useState(false);
    const apply = () => {
      setToast(true);
      setTimeout(() => setToast(false), 2200);
    };
    return /*#__PURE__*/React.createElement("aside", {
      className: "ck-dock"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-dock__head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-dock__title"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-dock__mark"
    }), "Princess"), /*#__PURE__*/React.createElement("button", {
      className: "ck-dock__close material-icons",
      onClick: onClose
    }, "close")), /*#__PURE__*/React.createElement("div", {
      className: "ck-dock__ctx"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "my_location"), contextLabel(ctx)), /*#__PURE__*/React.createElement("div", {
      className: "ck-dock__tabs"
    }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
      key: t.key,
      className: 'ck-dock__tab' + (tab === t.key ? ' is-active' : ''),
      onClick: () => setTab(t.key)
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, t.icon), t.label))), /*#__PURE__*/React.createElement("div", {
      className: "ck-dock__scroll"
    }, tab === 'insight' && /*#__PURE__*/React.createElement(Insight, {
      ctx: ctx
    }), tab === 'guidance' && /*#__PURE__*/React.createElement(Guidance, {
      ctx: ctx
    }), tab === 'chat' && /*#__PURE__*/React.createElement(Chat, null), tab === 'proposals' && /*#__PURE__*/React.createElement(Proposals, {
      onApply: apply
    })), toast && /*#__PURE__*/React.createElement("div", {
      className: "ck-dock__toast"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "check_circle"), "Applied \u2014 you can undo from the activity log"), /*#__PURE__*/React.createElement("div", {
      className: "ck-dock__ask"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-dock__mark"
    }), /*#__PURE__*/React.createElement("input", {
      className: "ck-dock__input",
      placeholder: "Ask about this project\u2026"
    }), /*#__PURE__*/React.createElement("button", {
      className: "ck-dock__send material-icons"
    }, "arrow_upward")));
  }
  Object.assign(window, {
    CkAIDock: AIDock
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/cockpit/AIDock.jsx", error: String((e && e.message) || e) }); }

// explorations/cockpit/Home.jsx
try { (() => {
// Project Home — role-aware. PM sees delivery & tolerances; PMO sees governance
// & gates; Team Manager sees only their work package. Same project, three homes.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  function Kpi({
    k
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-kpi"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-kpi__label"
    }, k.label), /*#__PURE__*/React.createElement("div", {
      className: "ck-kpi__row"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'ck-kpi__value ck-kpi__value--' + k.tone
    }, k.value), /*#__PURE__*/React.createElement("span", {
      className: "ck-kpi__sub"
    }, k.sub)));
  }
  function Home({
    role,
    project,
    onOpenItem,
    onNavigate,
    onAsk
  }) {
    const {
      Card,
      Button,
      AISuggestionCard,
      StatusChip
    } = DS;
    const H = window.COCKPIT.home;
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-pagehead"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-pagehead__title"
    }, /*#__PURE__*/React.createElement("h1", null, project.name), /*#__PURE__*/React.createElement(StatusChip, {
      status: project.status,
      label: project.stage
    })), /*#__PURE__*/React.createElement("div", {
      className: "ck-pagehead__actions"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-rolehint"
    }, window.COCKPIT.roles[role].focus))), role === 'pm' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "ck-kpis"
    }, H.pm.kpis.map((k, i) => /*#__PURE__*/React.createElement(Kpi, {
      k: k,
      key: i
    }))), /*#__PURE__*/React.createElement("div", {
      className: "ck-cols ck-cols--2to1"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Risks needing you",
      variant: "outlined"
    }, /*#__PURE__*/React.createElement("table", {
      className: "ck-table ck-table--flush"
    }, /*#__PURE__*/React.createElement("tbody", null, window.COCKPIT.risks.filter(r => r.status === 'open').slice(0, 3).map(r => /*#__PURE__*/React.createElement("tr", {
      key: r.id,
      onClick: () => onOpenItem(r)
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        width: 44
      }
    }, /*#__PURE__*/React.createElement(DS.ScoreBadge, {
      score: r.score
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "ck-cell-strong"
    }, r.title), /*#__PURE__*/React.createElement("div", {
      className: "ck-cell-sub"
    }, /*#__PURE__*/React.createElement("code", {
      className: "ck-ref"
    }, r.ref), " \xB7 ", r.owner || 'Unowned')), /*#__PURE__*/React.createElement("td", {
      className: "ck-cell-action"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "chevron_right")))))), /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      trailingIcon: "arrow_forward",
      onClick: () => onNavigate('risks'),
      style: {
        marginTop: 8
      }
    }, "Open Risk Log")), /*#__PURE__*/React.createElement("div", {
      className: "ck-stack"
    }, /*#__PURE__*/React.createElement(AISuggestionCard, {
      title: "Princess \xB7 for you today",
      label: "AI",
      acceptLabel: "Review",
      onAccept: onAsk,
      dismissLabel: "Open dock",
      onDismiss: onAsk
    }, "R-016 is blocking Stage 3 and steel lead-time docs disagree. Draft an exception, or assign the unowned risk R-011."), /*#__PURE__*/React.createElement(Card, {
      title: "Stage tolerance",
      variant: "outlined"
    }, project.tolerances.slice(0, 2).map((t, i) => /*#__PURE__*/React.createElement(Tol, {
      t: t,
      key: i
    })))))), role === 'pmo' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "ck-kpis"
    }, H.pmo.kpis.map((k, i) => /*#__PURE__*/React.createElement(Kpi, {
      k: k,
      key: i
    }))), /*#__PURE__*/React.createElement("div", {
      className: "ck-cols ck-cols--2to1"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Assurance checklist \xB7 this stage",
      variant: "outlined"
    }, /*#__PURE__*/React.createElement("ul", {
      className: "ck-check"
    }, H.pmo.checklist.map((c, i) => /*#__PURE__*/React.createElement("li", {
      key: i,
      className: c.ok ? 'is-ok' : 'is-warn'
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, c.ok ? 'check_circle' : 'error'), c.label)))), /*#__PURE__*/React.createElement(AISuggestionCard, {
      title: "Lessons log empty for this stage",
      label: "AI \xB7 assurance",
      acceptLabel: "Open log",
      onAccept: () => onNavigate('home'),
      onDismiss: onAsk
    }, "PRINCE2 expects lessons captured before the stage gate. Princess can pre-fill three from recent issues."))), role === 'tm' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
      title: "My work package",
      variant: "outlined"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-wphead"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "ck-cell-strong",
      style: {
        fontSize: '1.05rem'
      }
    }, H.tm.wp.name), /*#__PURE__*/React.createElement("div", {
      className: "ck-cell-sub"
    }, "Due ", H.tm.wp.due)), /*#__PURE__*/React.createElement("span", {
      className: "ck-tol ck-tol--warn"
    }, H.tm.wp.tol))), /*#__PURE__*/React.createElement("div", {
      className: "ck-cols ck-cols--1to1"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "My checklist",
      variant: "outlined"
    }, /*#__PURE__*/React.createElement("ul", {
      className: "ck-check"
    }, H.tm.checklist.map((c, i) => /*#__PURE__*/React.createElement("li", {
      key: i,
      className: c.ok ? 'is-ok' : 'is-todo'
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, c.ok ? 'check_circle' : 'radio_button_unchecked'), c.label)))), /*#__PURE__*/React.createElement(Card, {
      title: "Raise to the PM",
      variant: "outlined"
    }, /*#__PURE__*/React.createElement("p", {
      className: "ck-cardnote"
    }, "Team Managers raise risks and issues; the PM triages and owns the response."), /*#__PURE__*/React.createElement("div", {
      className: "ck-btnrow"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      icon: "bug_report"
    }, "Raise issue"), /*#__PURE__*/React.createElement(Button, {
      variant: "outlined",
      icon: "warning_amber"
    }, "Raise risk"))))));
  }
  function Tol({
    t
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-tolrow"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-tolrow__top"
    }, /*#__PURE__*/React.createElement("span", null, t.dim, " \xB7 ", t.range), /*#__PURE__*/React.createElement("span", {
      className: 'ck-tolrow__used ck-tolrow__used--' + t.state
    }, t.used)), /*#__PURE__*/React.createElement("div", {
      className: "ck-tolbar"
    }, /*#__PURE__*/React.createElement("i", {
      className: 'ck-tolbar--' + t.state,
      style: {
        width: t.pct + '%'
      }
    })));
  }
  Object.assign(window, {
    CkHome: Home,
    CkTol: Tol
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/cockpit/Home.jsx", error: String((e && e.message) || e) }); }

// explorations/cockpit/Overlays.jsx
try { (() => {
// Overlays — project switcher (set context without leaving the page) and the
// ⌘K command palette (jump to any item, document, relationship, or AI action).
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  function Switcher({
    onClose,
    onPick,
    onPortfolio
  }) {
    const rows = window.COCKPIT.portfolio;
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-overlay ck-overlay--switch",
      onClick: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-switchpanel",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-switchpanel__head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-eyebrow"
    }, "Switch project")), /*#__PURE__*/React.createElement("div", {
      className: "ck-switchpanel__list"
    }, rows.map(p => /*#__PURE__*/React.createElement("button", {
      key: p.id,
      className: 'ck-switchrow' + (p.active ? ' is-active' : ''),
      onClick: () => onPick(p)
    }, /*#__PURE__*/React.createElement("span", {
      className: 'ck-health ck-health--' + p.health
    }), /*#__PURE__*/React.createElement("span", {
      className: "ck-switchrow__main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-cell-strong"
    }, p.name), /*#__PURE__*/React.createElement("span", {
      className: "ck-cell-sub"
    }, p.stage)), /*#__PURE__*/React.createElement("span", {
      className: 'ck-tol ck-tol--' + {
        'Within': 'ok',
        'Near limit': 'warn',
        'Exception': 'danger',
        '—': 'none'
      }[p.tol]
    }, p.tol)))), /*#__PURE__*/React.createElement("div", {
      className: "ck-switchpanel__foot"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ck-textbtn",
      onClick: onPortfolio
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "apps"), "All projects"), /*#__PURE__*/React.createElement("button", {
      className: "ck-textbtn"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "add"), "New project"))));
  }
  function Palette({
    onClose,
    onOpenItem,
    onNavigate,
    onAsk
  }) {
    const risks = window.COCKPIT.risks;
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-overlay ck-overlay--palette",
      onClick: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-palette",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-palette__q"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "search"), /*#__PURE__*/React.createElement("span", {
      className: "ck-palette__typed"
    }, "steel"), /*#__PURE__*/React.createElement("span", {
      className: "ck-palette__caret"
    }), /*#__PURE__*/React.createElement("kbd", {
      className: "ck-search__kbd"
    }, "esc")), /*#__PURE__*/React.createElement("div", {
      className: "ck-palette__scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-palette__group"
    }, "Items"), /*#__PURE__*/React.createElement("button", {
      className: "ck-prow is-active",
      onClick: () => onOpenItem(risks[0])
    }, /*#__PURE__*/React.createElement(DS.ScoreBadge, {
      score: 16,
      size: "md"
    }), /*#__PURE__*/React.createElement("span", null, "Tender delay on steelwork"), /*#__PURE__*/React.createElement("span", {
      className: "ck-prow__meta"
    }, "Risk \xB7 R-016")), /*#__PURE__*/React.createElement("button", {
      className: "ck-prow",
      onClick: () => onNavigate('changes')
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-link ck-link--change"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "sync_alt")), /*#__PURE__*/React.createElement("span", null, "Steelwork scope change"), /*#__PURE__*/React.createElement("span", {
      className: "ck-prow__meta"
    }, "Change \xB7 C-009")), /*#__PURE__*/React.createElement("div", {
      className: "ck-palette__group"
    }, "Documents"), /*#__PURE__*/React.createElement("button", {
      className: "ck-prow",
      onClick: () => onNavigate('docs')
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-link ck-link--doc"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "description")), /*#__PURE__*/React.createElement("span", null, "Steel tender \u2014 RFQ.pdf"), /*#__PURE__*/React.createElement("span", {
      className: "ck-prow__meta"
    }, "Document")), /*#__PURE__*/React.createElement("div", {
      className: "ck-palette__group"
    }, "Follow relationship"), /*#__PURE__*/React.createElement("button", {
      className: "ck-prow",
      onClick: () => onNavigate('risks')
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-link ck-link--stage"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "account_tree")), /*#__PURE__*/React.createElement("span", null, "Risks linked to Stage 3"), /*#__PURE__*/React.createElement("span", {
      className: "ck-prow__meta"
    }, "3 items")), /*#__PURE__*/React.createElement("div", {
      className: "ck-palette__group"
    }, "Ask Princess"), /*#__PURE__*/React.createElement("button", {
      className: "ck-prow ck-prow--ai",
      onClick: onAsk
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-aicard__mark"
    }), /*#__PURE__*/React.createElement("span", null, "\u201CWhat's blocking the steelwork stream?\u201D"), /*#__PURE__*/React.createElement("span", {
      className: "ck-prow__meta"
    }, "AI")))));
  }
  Object.assign(window, {
    CkSwitcher: Switcher,
    CkPalette: Palette
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/cockpit/Overlays.jsx", error: String((e && e.message) || e) }); }

// explorations/cockpit/Portfolio.jsx
try { (() => {
// Portfolio — the only cross-project view. Picking a row sets project context.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const {
    useState
  } = React;
  function Portfolio({
    onOpenProject
  }) {
    const {
      Button,
      StatusChip,
      AISuggestionCard
    } = DS;
    const rows = window.COCKPIT.portfolio;
    const [showAI, setShowAI] = useState(true);
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-pagehead"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-pagehead__title"
    }, /*#__PURE__*/React.createElement("h1", null, "All projects"), /*#__PURE__*/React.createElement("span", {
      className: "ck-count"
    }, rows.length)), /*#__PURE__*/React.createElement("div", {
      className: "ck-pagehead__actions"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outlined",
      icon: "tune"
    }, "Filters"), /*#__PURE__*/React.createElement(Button, {
      variant: "filled",
      icon: "add"
    }, "New project"))), /*#__PURE__*/React.createElement("p", {
      className: "ck-lede"
    }, "Choose a project to enter its workspace. Health, stage and tolerance are shown up front so the choice is informed."), showAI && /*#__PURE__*/React.createElement(AISuggestionCard, {
      title: "Ringroad Phase 2 has breached cost tolerance",
      label: "AI \xB7 across the portfolio",
      acceptLabel: "Open project",
      onAccept: () => {
        setShowAI(false);
      },
      onDismiss: () => setShowAI(false)
    }, "An Exception Report is due to the Project Board. This is the only project currently outside its tolerance bands."), /*#__PURE__*/React.createElement("div", {
      className: "ck-tablecard"
    }, /*#__PURE__*/React.createElement("table", {
      className: "ck-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null), /*#__PURE__*/React.createElement("th", null, "Project"), /*#__PURE__*/React.createElement("th", null, "Stage"), /*#__PURE__*/React.createElement("th", null, "Open risks"), /*#__PURE__*/React.createElement("th", null, "Tolerance"), /*#__PURE__*/React.createElement("th", null, "Updated"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(p => /*#__PURE__*/React.createElement("tr", {
      key: p.id,
      onClick: () => onOpenProject(p)
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        width: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: 'ck-health ck-health--' + p.health
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "ck-cell-strong"
    }, p.name), /*#__PURE__*/React.createElement("div", {
      className: "ck-cell-sub"
    }, "Exec: ", p.exec, " \xB7 ", /*#__PURE__*/React.createElement("code", {
      className: "ck-ref"
    }, p.reference))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusChip, {
      status: p.status,
      label: p.stage
    })), /*#__PURE__*/React.createElement("td", {
      className: "ck-muted"
    }, p.openRisks), /*#__PURE__*/React.createElement("td", null, tolChip(p.tol)), /*#__PURE__*/React.createElement("td", {
      className: "ck-muted"
    }, p.updated), /*#__PURE__*/React.createElement("td", {
      className: "ck-cell-action"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "chevron_right"))))))));
  }
  function tolChip(tol) {
    const map = {
      'Within': 'ok',
      'Near limit': 'warn',
      'Exception': 'danger',
      '—': 'none'
    };
    const tone = map[tol] || 'none';
    if (tone === 'none') return /*#__PURE__*/React.createElement("span", {
      className: "ck-muted"
    }, "\u2014");
    return /*#__PURE__*/React.createElement("span", {
      className: 'ck-tol ck-tol--' + tone
    }, tone === 'danger' && /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "warning_amber"), tol);
  }
  Object.assign(window, {
    CkPortfolio: Portfolio
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/cockpit/Portfolio.jsx", error: String((e && e.message) || e) }); }

// explorations/cockpit/RiskScreens.jsx
try { (() => {
// Risk Log + Item detail. Lists are already project-scoped; rows show their
// relationships and document count; opening a risk reveals the relationship hub.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const {
    useState
  } = React;
  const LINK_ICON = {
    issue: 'bug_report',
    change: 'sync_alt',
    stage: 'account_tree',
    risk: 'warning_amber'
  };
  function LinkChips({
    links,
    docs
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-links"
    }, links.map((l, i) => /*#__PURE__*/React.createElement("span", {
      className: 'ck-link ck-link--' + l.t,
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, LINK_ICON[l.t]), l.ref)), docs > 0 && /*#__PURE__*/React.createElement("span", {
      className: "ck-link ck-link--doc"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "description"), docs));
  }
  function RiskLog({
    onOpenItem
  }) {
    const {
      Button,
      Select,
      ScoreBadge,
      StatusChip,
      AISuggestionCard,
      AIAssistButton
    } = DS;
    const all = window.COCKPIT.risks;
    const [status, setStatus] = useState('All');
    const [sort, setSort] = useState('score');
    const [showAI, setShowAI] = useState(true);
    let rows = all.filter(r => status === 'All' || cap(r.status) === status);
    rows = [...rows].sort((a, b) => sort === 'score' ? b.score - a.score : a.id < b.id ? 1 : -1);
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-pagehead"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-pagehead__title"
    }, /*#__PURE__*/React.createElement("h1", null, "Risk Log"), /*#__PURE__*/React.createElement("span", {
      className: "ck-count"
    }, rows.length)), /*#__PURE__*/React.createElement("div", {
      className: "ck-pagehead__actions"
    }, /*#__PURE__*/React.createElement(AIAssistButton, {
      icon: "auto_awesome"
    }, "Ask Princess"), /*#__PURE__*/React.createElement(Button, {
      variant: "filled",
      icon: "add"
    }, "Raise risk"))), showAI && /*#__PURE__*/React.createElement(AISuggestionCard, {
      title: "R-011 has no mitigation owner",
      acceptLabel: "Assign me as interim",
      onAccept: () => setShowAI(false),
      onDismiss: () => setShowAI(false)
    }, "\u201CPermit dependency slip\u201D is open but unassigned. Assign the project manager as interim owner so it stays tracked to the next checkpoint."), /*#__PURE__*/React.createElement("div", {
      className: "ck-filters"
    }, /*#__PURE__*/React.createElement(Select, {
      label: "Status",
      value: status,
      onChange: setStatus,
      options: ['All', 'Open', 'Mitigated', 'Materialised', 'Closed'],
      style: {
        width: 160
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "ck-segment"
    }, /*#__PURE__*/React.createElement("button", {
      className: sort === 'score' ? 'is-active' : '',
      onClick: () => setSort('score')
    }, "By score"), /*#__PURE__*/React.createElement("button", {
      className: sort === 'newest' ? 'is-active' : '',
      onClick: () => setSort('newest')
    }, "Newest"))), /*#__PURE__*/React.createElement("div", {
      className: "ck-tablecard"
    }, /*#__PURE__*/React.createElement("table", {
      className: "ck-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Score"), /*#__PURE__*/React.createElement("th", null, "Risk"), /*#__PURE__*/React.createElement("th", null, "Owner"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Relationships"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
      key: r.id,
      onClick: () => onOpenItem(r)
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(ScoreBadge, {
      score: r.score
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "ck-cell-strong"
    }, r.title), /*#__PURE__*/React.createElement("div", {
      className: "ck-cell-sub"
    }, /*#__PURE__*/React.createElement("code", {
      className: "ck-ref"
    }, r.ref), " \xB7 P\xD7I = ", r.score, " \xB7 ", r.response)), /*#__PURE__*/React.createElement("td", {
      className: "ck-muted"
    }, r.owner || /*#__PURE__*/React.createElement("span", {
      className: "ck-unowned"
    }, "Unowned")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusChip, {
      status: r.status
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(LinkChips, {
      links: r.links,
      docs: r.docs
    })), /*#__PURE__*/React.createElement("td", {
      className: "ck-cell-action"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "chevron_right"))))))));
  }
  function RelNode({
    kind,
    refId,
    focus
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: 'ck-relnode' + (focus ? ' is-focus' : '') + (kind === 'doc' ? ' is-doc' : '')
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-relnode__kind"
    }, kind), /*#__PURE__*/React.createElement("div", {
      className: "ck-relnode__ref"
    }, refId));
  }
  function ItemDetail({
    item,
    onBack,
    onAsk
  }) {
    const {
      ScoreBadge,
      StatusChip,
      Card,
      Button,
      AISuggestionCard
    } = DS;
    const r = item;
    const docs = window.COCKPIT.documents.filter(d => d.on === r.ref);
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-page"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ck-back",
      onClick: onBack
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "arrow_back"), "Risk Log"), /*#__PURE__*/React.createElement("div", {
      className: "ck-detailhead"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-detailhead__row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-detailhead__title"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-eyebrow"
    }, "Risk \xB7 ", r.ref), /*#__PURE__*/React.createElement("h1", null, r.title)), /*#__PURE__*/React.createElement("div", {
      className: "ck-detailhead__meta"
    }, /*#__PURE__*/React.createElement(ScoreBadge, {
      score: r.score,
      size: "lg"
    }), /*#__PURE__*/React.createElement(StatusChip, {
      status: r.status
    })))), /*#__PURE__*/React.createElement("div", {
      className: "ck-cols ck-cols--3to2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-stack"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Description & response",
      variant: "outlined"
    }, /*#__PURE__*/React.createElement("p", {
      className: "ck-cardnote"
    }, "Steel tender returned later than the baseline programme allows, threatening Stage 3 delivery. Mitigation underway with a second supplier; awaiting revised lead times."), /*#__PURE__*/React.createElement("div", {
      className: "ck-metarow"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-meta"
    }, /*#__PURE__*/React.createElement("b", null, "Response"), " ", r.response), /*#__PURE__*/React.createElement("span", {
      className: "ck-meta"
    }, /*#__PURE__*/React.createElement("b", null, "Proximity"), " ", r.proximity), /*#__PURE__*/React.createElement("span", {
      className: "ck-meta"
    }, /*#__PURE__*/React.createElement("b", null, "Category"), " ", r.category), /*#__PURE__*/React.createElement("span", {
      className: "ck-meta"
    }, /*#__PURE__*/React.createElement("b", null, "Owner"), " ", r.owner || 'Unowned'))), /*#__PURE__*/React.createElement(Card, {
      title: "Related items",
      variant: "outlined"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-relmap"
    }, /*#__PURE__*/React.createElement(RelNode, {
      kind: "Risk",
      refId: r.ref,
      focus: true
    }), /*#__PURE__*/React.createElement("span", {
      className: "material-icons ck-relarrow"
    }, "east"), /*#__PURE__*/React.createElement(RelNode, {
      kind: "Issue",
      refId: "I-042"
    }), /*#__PURE__*/React.createElement("span", {
      className: "material-icons ck-relarrow"
    }, "east"), /*#__PURE__*/React.createElement(RelNode, {
      kind: "Change",
      refId: "C-009"
    })), /*#__PURE__*/React.createElement("div", {
      className: "ck-relfoot"
    }, "Also linked: ", /*#__PURE__*/React.createElement("span", {
      className: "ck-link ck-link--stage"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "account_tree"), "Stage 3"), " ", /*#__PURE__*/React.createElement("span", {
      className: "ck-link ck-link--risk"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "school"), "Lesson L-7")))), /*#__PURE__*/React.createElement("div", {
      className: "ck-stack"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Linked documents",
      variant: "outlined",
      style: {
        background: 'color-mix(in srgb, #8f4d00 5%, var(--mat-sys-surface-container-lowest))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-docs"
    }, docs.length ? docs.map((d, i) => /*#__PURE__*/React.createElement("div", {
      className: "ck-doc",
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: 'ck-doc__ic ck-doc__ic--' + d.kind
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "description")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "ck-cell-strong"
    }, d.name), /*#__PURE__*/React.createElement("div", {
      className: "ck-cell-sub"
    }, "added ", d.added)))) : /*#__PURE__*/React.createElement("p", {
      className: "ck-cardnote"
    }, "No documents linked yet.")), /*#__PURE__*/React.createElement(Button, {
      variant: "outlined",
      icon: "attach_file",
      size: "sm",
      style: {
        marginTop: 10
      }
    }, "Link document")), /*#__PURE__*/React.createElement(AISuggestionCard, {
      title: "Score 16 should trigger an exception assessment",
      label: "AI \xB7 PRINCE2 guidance",
      acceptLabel: "Generate exception report",
      onAccept: onAsk,
      onDismiss: onAsk
    }, "A Critical risk affecting stage tolerance warrants an Exception Report to the Project Board, citing R-016 and the linked issue I-042."))));
  }
  function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  Object.assign(window, {
    CkRiskLog: RiskLog,
    CkItemDetail: ItemDetail
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/cockpit/RiskScreens.jsx", error: String((e && e.message) || e) }); }

// explorations/cockpit/Shell.jsx
try { (() => {
// Cockpit shell — scoped sidebar (project picker pinned on top) + top bar
// (project switcher, role switcher, command search, Ask Princess).
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const NAV = [{
    label: 'Overview',
    items: [{
      key: 'home',
      label: 'Project Home',
      icon: 'dashboard'
    }, {
      key: 'stages',
      label: 'Plan & stages',
      icon: 'account_tree',
      roles: ['pm', 'pmo']
    }]
  }, {
    label: 'Logs',
    items: [{
      key: 'risks',
      label: 'Risk Log',
      icon: 'warning_amber'
    }, {
      key: 'issues',
      label: 'Issue Log',
      icon: 'bug_report'
    }, {
      key: 'changes',
      label: 'Change Log',
      icon: 'sync_alt',
      roles: ['pm', 'pmo']
    }, {
      key: 'quality',
      label: 'Quality Register',
      icon: 'fact_check',
      roles: ['pm', 'pmo']
    }, {
      key: 'lessons',
      label: 'Lessons Log',
      icon: 'school',
      roles: ['pm', 'pmo']
    }]
  }, {
    label: 'Reports',
    roles: ['pm', 'pmo'],
    items: [{
      key: 'highlight',
      label: 'Highlight Reports',
      icon: 'summarize'
    }, {
      key: 'exceptions',
      label: 'Exception Reports',
      icon: 'report_problem'
    }]
  }, {
    label: 'Documents',
    items: [{
      key: 'docs',
      label: 'Library',
      icon: 'folder_open'
    }]
  }];
  function visible(roles, role) {
    return !roles || roles.indexOf(role) !== -1;
  }
  function Sidebar({
    active,
    role,
    project,
    onNavigate,
    onOpenSwitcher
  }) {
    return /*#__PURE__*/React.createElement("nav", {
      className: "ck-sidebar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-sidebar__brand"
    }), /*#__PURE__*/React.createElement("button", {
      className: "ck-picker",
      onClick: onOpenSwitcher
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-picker__mark"
    }), /*#__PURE__*/React.createElement("span", {
      className: "ck-picker__text"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-picker__name"
    }, project.name), /*#__PURE__*/React.createElement("span", {
      className: "ck-picker__sub"
    }, project.stage)), /*#__PURE__*/React.createElement("span", {
      className: "material-icons ck-picker__chev"
    }, "unfold_more")), /*#__PURE__*/React.createElement("div", {
      className: "ck-sidebar__scroll"
    }, NAV.filter(g => visible(g.roles, role)).map(group => {
      const items = group.items.filter(it => visible(it.roles, role));
      if (!items.length) return null;
      return /*#__PURE__*/React.createElement("div", {
        className: "ck-group",
        key: group.label
      }, /*#__PURE__*/React.createElement("span", {
        className: "ck-group__label"
      }, group.label), items.map(it => /*#__PURE__*/React.createElement("a", {
        key: it.key,
        className: 'ck-item' + (active === it.key ? ' ck-item--active' : ''),
        onClick: () => onNavigate(it.key)
      }, /*#__PURE__*/React.createElement("span", {
        className: "material-icons ck-item__icon"
      }, it.icon), /*#__PURE__*/React.createElement("span", {
        className: "ck-item__label"
      }, it.label))));
    })), /*#__PURE__*/React.createElement("div", {
      className: "ck-sidebar__footer"
    }, /*#__PURE__*/React.createElement("a", {
      className: "ck-item",
      onClick: onOpenSwitcher
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons ck-item__icon"
    }, "apps"), /*#__PURE__*/React.createElement("span", {
      className: "ck-item__label"
    }, "All projects")), /*#__PURE__*/React.createElement("a", {
      className: "ck-item"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons ck-item__icon"
    }, "settings"), /*#__PURE__*/React.createElement("span", {
      className: "ck-item__label"
    }, "Project settings"))));
  }
  function TopBar({
    project,
    role,
    roles,
    onOpenSwitcher,
    onRole,
    onSearch,
    onAsk,
    aiOpen
  }) {
    const {
      IconButton,
      Avatar
    } = DS;
    const u = window.COCKPIT.user;
    return /*#__PURE__*/React.createElement("header", {
      className: "ck-topbar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-topbar__start"
    }, /*#__PURE__*/React.createElement("a", {
      className: "ck-topbar__logo"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logo.svg",
      alt: "Princess",
      height: "22"
    })), /*#__PURE__*/React.createElement("button", {
      className: "ck-switch",
      onClick: onOpenSwitcher
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-switch__mark"
    }), /*#__PURE__*/React.createElement("span", {
      className: "ck-switch__name"
    }, project.name), /*#__PURE__*/React.createElement("span", {
      className: "material-icons ck-switch__chev"
    }, "expand_more"))), /*#__PURE__*/React.createElement("div", {
      className: "ck-topbar__center"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ck-search",
      onClick: onSearch
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons ck-search__icon"
    }, "search"), /*#__PURE__*/React.createElement("span", {
      className: "ck-search__label"
    }, "Search ", project.name, "\u2026"), /*#__PURE__*/React.createElement("kbd", {
      className: "ck-search__kbd"
    }, "\u2318K"))), /*#__PURE__*/React.createElement("div", {
      className: "ck-topbar__end"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-rolepick"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-rolepick__eyebrow"
    }, "Viewing as"), /*#__PURE__*/React.createElement("div", {
      className: "ck-rolepick__seg"
    }, Object.values(roles).map(r => /*#__PURE__*/React.createElement("button", {
      key: r.key,
      className: 'ck-rolepick__btn' + (role === r.key ? ' is-active' : ''),
      onClick: () => onRole(r.key),
      title: r.focus
    }, r.short)))), /*#__PURE__*/React.createElement("button", {
      className: 'ck-ask' + (aiOpen ? ' is-open' : ''),
      onClick: onAsk
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "auto_awesome"), /*#__PURE__*/React.createElement("span", null, "Ask Princess")), /*#__PURE__*/React.createElement(IconButton, {
      icon: "notifications_none",
      badge: "3",
      ariaLabel: "Notifications"
    }), /*#__PURE__*/React.createElement(Avatar, {
      name: u.name
    })));
  }
  Object.assign(window, {
    CkSidebar: Sidebar,
    CkTopBar: TopBar
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/cockpit/Shell.jsx", error: String((e && e.message) || e) }); }

// explorations/cockpit/Stages.jsx
try { (() => {
// Plan & stages — the PRINCE2 lifecycle: stepper, stage tolerances (where
// exceptions are born), work packages tied to Team Managers, stage timeline.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  function Stages({
    project,
    onAsk
  }) {
    const {
      LifecycleStepper,
      Card,
      Button,
      AISuggestionCard
    } = DS;
    const wpTone = {
      ok: 'ok',
      warn: 'warn',
      todo: 'none'
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-pagehead"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-pagehead__title"
    }, /*#__PURE__*/React.createElement("h1", null, "Plan & stages")), /*#__PURE__*/React.createElement("div", {
      className: "ck-pagehead__actions"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outlined",
      icon: "edit"
    }, "Edit stage plan"))), /*#__PURE__*/React.createElement(Card, {
      variant: "outlined",
      style: {
        paddingTop: 22,
        paddingBottom: 22
      }
    }, /*#__PURE__*/React.createElement(LifecycleStepper, {
      stages: project.stages,
      activeIndex: project.stageIndex
    })), /*#__PURE__*/React.createElement("div", {
      className: "ck-cols ck-cols--1to1"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Stage 3 tolerances",
      variant: "outlined"
    }, project.tolerances.map((t, i) => /*#__PURE__*/React.createElement(window.CkTol, {
      t: t,
      key: i
    })), /*#__PURE__*/React.createElement("p", {
      className: "ck-cardnote",
      style: {
        marginTop: 12
      }
    }, "Breach a band and Princess raises an ", /*#__PURE__*/React.createElement("b", null, "Exception"), " to the Project Board \u2014 linked straight to the originating risk.")), /*#__PURE__*/React.createElement(Card, {
      title: "Work packages",
      variant: "outlined"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-wplist"
    }, project.workPackages.map((w, i) => /*#__PURE__*/React.createElement("div", {
      className: "ck-wp",
      key: i
    }, /*#__PURE__*/React.createElement(DS.Avatar, {
      name: w.tm === '—' ? 'Unassigned' : w.tm,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      className: "ck-wp__main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-cell-strong"
    }, w.name), /*#__PURE__*/React.createElement("div", {
      className: "ck-cell-sub"
    }, w.tm === '—' ? 'Unassigned' : 'Team Manager · ' + w.tm)), /*#__PURE__*/React.createElement("span", {
      className: 'ck-tol ck-tol--' + wpTone[w.status]
    }, w.note)))))), /*#__PURE__*/React.createElement(Card, {
      title: "Stage timeline",
      variant: "outlined"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ck-gantt"
    }, /*#__PURE__*/React.createElement(GRow, {
      label: "Resurfacing",
      left: 6,
      right: 48,
      on: true
    }), /*#__PURE__*/React.createElement(GRow, {
      label: "Cabling",
      left: 30,
      right: 22
    }), /*#__PURE__*/React.createElement(GRow, {
      label: "Inspection",
      left: 64,
      right: 6
    }))), /*#__PURE__*/React.createElement(AISuggestionCard, {
      title: "Time tolerance is 80% consumed",
      label: "AI \xB7 forecast",
      acceptLabel: "Model the slip",
      onAccept: onAsk,
      onDismiss: onAsk
    }, "At the current rate, Stage 3 will reach +10 days (the limit) in about nine days. Princess can model a two-week steel slip against the plan."));
  }
  function GRow({
    label,
    left,
    right,
    on
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ck-grow"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ck-grow__label"
    }, label), /*#__PURE__*/React.createElement("div", {
      className: "ck-gtrack"
    }, /*#__PURE__*/React.createElement("span", {
      className: 'ck-gbar' + (on ? ' is-on' : ''),
      style: {
        left: left + '%',
        right: right + '%'
      }
    })));
  }
  Object.assign(window, {
    CkStages: Stages
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/cockpit/Stages.jsx", error: String((e && e.message) || e) }); }

// explorations/cockpit/data.js
try { (() => {
// Cockpit hi-fi prototype — rich PRINCE2 mock data.
// One active project in deep context, plus a portfolio to switch among.
window.COCKPIT = {
  user: {
    name: 'Ana Novak',
    initials: 'AN',
    email: 'ana.novak@sinecon.eu'
  },
  roles: {
    pm: {
      key: 'pm',
      label: 'Project Manager',
      short: 'PM',
      focus: 'Day-to-day delivery, logs & reports'
    },
    pmo: {
      key: 'pmo',
      label: 'Project Support / PMO',
      short: 'PMO',
      focus: 'Assurance, governance & gate control'
    },
    tm: {
      key: 'tm',
      label: 'Team Manager',
      short: 'TM',
      focus: 'My work package only'
    }
  },
  // ── Portfolio (the only cross-project view) ───────────────────────────────
  portfolio: [{
    id: 'p1',
    name: 'Harbour Bridge Renewal',
    reference: 'PRJ-014',
    exec: 'A. Mensah',
    status: 'delivery',
    stage: 'Delivery · Stage 3',
    risks: 8,
    openRisks: 8,
    health: 'ok',
    tol: 'Within',
    updated: '2h ago',
    active: true
  }, {
    id: 'p2',
    name: 'Civic Data Platform',
    reference: 'PRJ-021',
    exec: 'R. Okafor',
    status: 'initiation',
    stage: 'Initiation',
    risks: 14,
    openRisks: 11,
    health: 'warn',
    tol: 'Near limit',
    updated: '1d ago'
  }, {
    id: 'p3',
    name: 'Ringroad Phase 2',
    reference: 'PRJ-009',
    exec: 'A. Mensah',
    status: 'delivery',
    stage: 'Delivery · Stage 2',
    risks: 11,
    openRisks: 9,
    health: 'danger',
    tol: 'Exception',
    updated: '4h ago'
  }, {
    id: 'p4',
    name: 'Coastal Defence Upgrade',
    reference: 'PRJ-007',
    exec: 'L. Bianchi',
    status: 'closing',
    stage: 'Closing',
    risks: 3,
    openRisks: 1,
    health: 'ok',
    tol: 'Within',
    updated: '3d ago'
  }, {
    id: 'p5',
    name: 'Depot Electrification',
    reference: 'PRJ-025',
    exec: 'R. Okafor',
    status: 'pre_project',
    stage: 'Pre-project',
    risks: 0,
    openRisks: 0,
    health: 'ok',
    tol: '—',
    updated: '6d ago'
  }],
  // ── Active project deep context ───────────────────────────────────────────
  project: {
    id: 'p1',
    name: 'Harbour Bridge Renewal',
    reference: 'PRJ-014',
    exec: 'A. Mensah',
    pm: 'A. Novak',
    status: 'delivery',
    stage: 'Delivery · Stage 3',
    stageIndex: 2,
    stages: ['Pre-Project', 'Initiation', 'Delivery', 'Closing', 'Closed'],
    tolerances: [{
      dim: 'Time',
      range: '-5 / +10 days',
      used: '+8 days',
      pct: 80,
      state: 'warn'
    }, {
      dim: 'Cost',
      range: '± 50 000 €',
      used: '+18 000 €',
      pct: 36,
      state: 'ok'
    }, {
      dim: 'Scope',
      range: 'No change to core deliverables',
      used: 'Stable',
      pct: 12,
      state: 'ok'
    }, {
      dim: 'Quality',
      range: 'Meets EN 1090',
      used: 'On spec',
      pct: 20,
      state: 'ok'
    }],
    workPackages: [{
      name: 'Deck resurfacing',
      tm: 'J. Park',
      status: 'warn',
      note: '-2 days',
      pct: 62
    }, {
      name: 'Cabling pull-through',
      tm: 'S. Idris',
      status: 'ok',
      note: 'On track',
      pct: 38
    }, {
      name: 'Inspection sign-off',
      tm: '—',
      status: 'todo',
      note: 'To plan',
      pct: 0
    }]
  },
  // ── Logs (this project) ───────────────────────────────────────────────────
  risks: [{
    id: 'r1',
    ref: 'R-016',
    score: 16,
    title: 'Tender delay on steelwork',
    category: 'Procurement',
    proximity: 'This stage',
    response: 'Reduce',
    status: 'open',
    owner: 'A. Novak',
    docs: 2,
    links: [{
      t: 'issue',
      ref: 'I-042'
    }, {
      t: 'change',
      ref: 'C-009'
    }, {
      t: 'stage',
      ref: 'Stage 3'
    }]
  }, {
    id: 'r2',
    ref: 'R-011',
    score: 9,
    title: 'Permit dependency slip',
    category: 'External',
    proximity: 'Next stage',
    response: 'Reduce',
    status: 'open',
    owner: null,
    docs: 1,
    links: [{
      t: 'stage',
      ref: 'Stage 3'
    }]
  }, {
    id: 'r3',
    ref: 'R-008',
    score: 12,
    title: 'Marine weather window narrows',
    category: 'Schedule',
    proximity: 'This stage',
    response: 'Transfer',
    status: 'open',
    owner: 'S. Idris',
    docs: 0,
    links: [{
      t: 'issue',
      ref: 'I-039'
    }]
  }, {
    id: 'r4',
    ref: 'R-004',
    score: 4,
    title: 'Public access detour complaints',
    category: 'Stakeholder',
    proximity: 'Distant',
    response: 'Accept',
    status: 'mitigated',
    owner: 'J. Park',
    docs: 3,
    links: []
  }, {
    id: 'r5',
    ref: 'R-002',
    score: 6,
    title: 'Specialist coating lead time',
    category: 'Procurement',
    proximity: 'Next stage',
    response: 'Reduce',
    status: 'open',
    owner: 'A. Novak',
    docs: 1,
    links: [{
      t: 'change',
      ref: 'C-006'
    }]
  }, {
    id: 'r6',
    ref: 'R-001',
    score: 20,
    title: 'Load-bearing survey inconclusive',
    category: 'Technical',
    proximity: 'Imminent',
    response: 'Avoid',
    status: 'materialised',
    owner: 'T. Zajc',
    docs: 4,
    links: [{
      t: 'issue',
      ref: 'I-031'
    }, {
      t: 'change',
      ref: 'C-003'
    }]
  }],
  documents: [{
    name: 'Steel tender — RFQ.pdf',
    kind: 'pdf',
    added: '12 Mar 2026',
    on: 'R-016'
  }, {
    name: 'Supplier risk memo.docx',
    kind: 'doc',
    added: '04 Apr 2026',
    on: 'R-016'
  }, {
    name: 'Stage 3 plan — baseline.xlsx',
    kind: 'xls',
    added: '02 Feb 2026',
    on: 'Stage 3'
  }, {
    name: 'Load survey report.pdf',
    kind: 'pdf',
    added: '18 Jan 2026',
    on: 'R-001'
  }],
  // ── Role-tuned home content ───────────────────────────────────────────────
  home: {
    pm: {
      kpis: [{
        label: 'Stage tolerance',
        value: '+8d',
        sub: '8 of +10 days used',
        tone: 'warn'
      }, {
        label: 'Open risks',
        value: '8',
        sub: '1 critical · 1 unowned',
        tone: 'danger'
      }, {
        label: 'My actions',
        value: '5',
        sub: 'due this week',
        tone: 'ok'
      }, {
        label: 'Reports due',
        value: '1',
        sub: 'highlight · Fri',
        tone: 'neutral'
      }]
    },
    pmo: {
      kpis: [{
        label: 'Governance health',
        value: '92',
        sub: 'controls in place',
        tone: 'ok'
      }, {
        label: 'Overdue reports',
        value: '2',
        sub: 'highlight reports late',
        tone: 'warn'
      }, {
        label: 'Stage gates',
        value: '1',
        sub: 'approval pending',
        tone: 'neutral'
      }, {
        label: 'Assurance flags',
        value: '3',
        sub: 'this stage',
        tone: 'warn'
      }],
      checklist: [{
        ok: true,
        label: 'PID baselined'
      }, {
        ok: true,
        label: 'Risk budget set'
      }, {
        ok: false,
        label: 'Lessons not logged'
      }, {
        ok: true,
        label: 'Stage 3 plan approved'
      }]
    },
    tm: {
      wp: {
        name: 'Deck resurfacing',
        due: '12 Jul 2026',
        tol: '-2 days tolerance'
      },
      checklist: [{
        ok: true,
        label: 'Method statement approved'
      }, {
        ok: true,
        label: 'Surface prep complete'
      }, {
        ok: false,
        label: 'First coat inspection'
      }, {
        ok: false,
        label: 'Final sign-off'
      }]
    }
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/cockpit/data.js", error: String((e && e.message) || e) }); }

// ui_kits/princess/AISuggestions.jsx
try { (() => {
// AI Suggestions screen — Princess proposes actions across the project,
// each as an actionable suggestion card with a source context.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const {
    useState
  } = React;
  function AISuggestions() {
    const {
      AISuggestionCard,
      AIAssistButton,
      Badge
    } = DS;
    const [items, setItems] = useState(window.PRINCESS_DATA.suggestions);
    const dismiss = id => setItems(xs => xs.filter(x => x.id !== id));
    return /*#__PURE__*/React.createElement("div", {
      className: "pk-page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk-pagehead"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk-pagehead__title"
    }, /*#__PURE__*/React.createElement("h1", null, "AI Suggestions"), /*#__PURE__*/React.createElement(Badge, {
      tone: "primary"
    }, items.length, " active")), /*#__PURE__*/React.createElement(AIAssistButton, {
      solid: true,
      icon: "auto_awesome"
    }, "Ask Princess anything")), /*#__PURE__*/React.createElement("p", {
      className: "pk-lede"
    }, "Princess reviews your project data continuously and proposes actions. Apply, refine, or dismiss \u2014 nothing changes until you accept."), /*#__PURE__*/React.createElement("div", {
      className: "pk-ai-list"
    }, items.map(s => /*#__PURE__*/React.createElement("div", {
      key: s.id,
      className: "pk-ai-item"
    }, /*#__PURE__*/React.createElement(AISuggestionCard, {
      title: s.title,
      acceptLabel: s.accept,
      onAccept: () => dismiss(s.id),
      onDismiss: () => dismiss(s.id)
    }, s.body), /*#__PURE__*/React.createElement("span", {
      className: "pk-ai-context"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "link"), s.context))), items.length === 0 && /*#__PURE__*/React.createElement("div", {
      className: "pk-ai-empty"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "auto_awesome"), /*#__PURE__*/React.createElement("p", null, "You're all caught up. Princess will surface new suggestions as your project evolves."))));
  }
  Object.assign(window, {
    AISuggestions
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/princess/AISuggestions.jsx", error: String((e && e.message) || e) }); }

// ui_kits/princess/ProjectDetail.jsx
try { (() => {
// Project detail screen — header with lifecycle stepper, tabs, overview cards.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const {
    useState
  } = React;
  function ProjectDetail({
    project,
    onBack
  }) {
    const {
      StatusChip,
      LifecycleStepper,
      Tabs,
      Card,
      Button
    } = DS;
    const p = project || window.PRINCESS_DATA.projects[0];
    const [tab, setTab] = useState('Overview');
    const stageIndex = {
      pre_project: 0,
      initiation: 1,
      delivery: 2,
      closing: 3,
      closed: 4
    }[p.status] ?? 0;
    return /*#__PURE__*/React.createElement("div", {
      className: "pk-page"
    }, /*#__PURE__*/React.createElement("button", {
      className: "pk-back",
      onClick: onBack
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "arrow_back"), "Projects"), /*#__PURE__*/React.createElement("div", {
      className: "pk-detailhead"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk-detailhead__row"
    }, /*#__PURE__*/React.createElement("h1", null, p.name), /*#__PURE__*/React.createElement("code", {
      className: "pk-ref"
    }, p.reference), /*#__PURE__*/React.createElement(StatusChip, {
      status: p.status
    })), /*#__PURE__*/React.createElement("p", {
      className: "pk-detailhead__stage"
    }, "Current stage: ", /*#__PURE__*/React.createElement("strong", null, p.stage))), /*#__PURE__*/React.createElement(LifecycleStepper, {
      stages: ['Pre-Project', 'Initiation', 'Delivery', 'Closing', 'Closed'],
      activeIndex: stageIndex
    }), /*#__PURE__*/React.createElement(Tabs, {
      tabs: ['Overview', 'Risks', 'Issues', 'Quality', 'Documents'],
      value: tab,
      onChange: setTab,
      style: {
        marginTop: 20
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "pk-overview"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Project details"
    }, /*#__PURE__*/React.createElement("dl", {
      className: "pk-dl"
    }, /*#__PURE__*/React.createElement("dt", null, "Name"), /*#__PURE__*/React.createElement("dd", null, p.name), /*#__PURE__*/React.createElement("dt", null, "Reference"), /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement("code", {
      className: "pk-ref"
    }, p.reference)), /*#__PURE__*/React.createElement("dt", null, "Created by"), /*#__PURE__*/React.createElement("dd", null, "A. Novak"), /*#__PURE__*/React.createElement("dt", null, "Created"), /*#__PURE__*/React.createElement("dd", null, p.created), /*#__PURE__*/React.createElement("dt", null, "Current stage"), /*#__PURE__*/React.createElement("dd", null, p.stage))), /*#__PURE__*/React.createElement(Card, {
      title: "Tolerances"
    }, /*#__PURE__*/React.createElement("dl", {
      className: "pk-dl"
    }, /*#__PURE__*/React.createElement("dt", null, "Time"), /*#__PURE__*/React.createElement("dd", null, "-5 / +10 days"), /*#__PURE__*/React.createElement("dt", null, "Cost"), /*#__PURE__*/React.createElement("dd", null, "-1 000 / +5 000 \u20AC"), /*#__PURE__*/React.createElement("dt", null, "Scope"), /*#__PURE__*/React.createElement("dd", null, "No change to core deliverables"), /*#__PURE__*/React.createElement("dt", null, "Quality"), /*#__PURE__*/React.createElement("dd", null, "Meets ISO 9001"), /*#__PURE__*/React.createElement("dt", null, "Risk"), /*#__PURE__*/React.createElement("dd", null, "No threats above Medium")))));
  }
  Object.assign(window, {
    ProjectDetail
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/princess/ProjectDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/princess/Projects.jsx
try { (() => {
// Projects list screen — search, status filter, table of PRINCE2 projects.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const {
    useState
  } = React;
  function Projects({
    onOpenProject
  }) {
    const {
      Button,
      Input,
      Select,
      StatusChip,
      EmptyState
    } = DS;
    const all = window.PRINCESS_DATA.projects;
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('All statuses');
    const rows = all.filter(p => (status === 'All statuses' || statusLabel(p.status) === status) && (p.name.toLowerCase().includes(q.toLowerCase()) || p.reference.toLowerCase().includes(q.toLowerCase())));
    return /*#__PURE__*/React.createElement("div", {
      className: "pk-page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk-pagehead"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk-pagehead__title"
    }, /*#__PURE__*/React.createElement("h1", null, "Projects"), /*#__PURE__*/React.createElement("span", {
      className: "pk-count"
    }, rows.length)), /*#__PURE__*/React.createElement(Button, {
      variant: "filled",
      icon: "add"
    }, "New project")), /*#__PURE__*/React.createElement("div", {
      className: "pk-filters"
    }, /*#__PURE__*/React.createElement(Input, {
      icon: "search",
      placeholder: "Name or reference",
      value: q,
      onChange: setQ,
      style: {
        flex: 1,
        maxWidth: 360
      }
    }), /*#__PURE__*/React.createElement(Select, {
      value: status,
      onChange: setStatus,
      options: ['All statuses', 'Pre-Project', 'Initiation', 'Delivery', 'Closing', 'Closed'],
      style: {
        width: 200
      }
    })), rows.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "pk-tablecard"
    }, /*#__PURE__*/React.createElement(EmptyState, {
      icon: "folder_open",
      title: "No projects found",
      message: "Try adjusting your filters."
    })) : /*#__PURE__*/React.createElement("div", {
      className: "pk-tablecard"
    }, /*#__PURE__*/React.createElement("table", {
      className: "pk-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Reference"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Current stage"), /*#__PURE__*/React.createElement("th", null, "Tolerances"), /*#__PURE__*/React.createElement("th", null, "Created"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(p => /*#__PURE__*/React.createElement("tr", {
      key: p.id,
      onClick: () => onOpenProject(p)
    }, /*#__PURE__*/React.createElement("td", {
      className: "pk-cell-link"
    }, p.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
      className: "pk-ref"
    }, p.reference)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusChip, {
      status: p.status
    })), /*#__PURE__*/React.createElement("td", {
      className: "pk-muted"
    }, p.stage), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: 'pk-dot pk-dot--' + p.tolerances,
      title: p.tolerances
    })), /*#__PURE__*/React.createElement("td", {
      className: "pk-muted"
    }, p.created), /*#__PURE__*/React.createElement("td", {
      className: "pk-cell-action"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons"
    }, "chevron_right"))))))));
  }
  function statusLabel(s) {
    return {
      pre_project: 'Pre-Project',
      initiation: 'Initiation',
      delivery: 'Delivery',
      closing: 'Closing',
      closed: 'Closed'
    }[s];
  }
  Object.assign(window, {
    Projects
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/princess/Projects.jsx", error: String((e && e.message) || e) }); }

// ui_kits/princess/RiskLog.jsx
try { (() => {
// Risk Log screen — filter + sort, risk table with score badges & status chips,
// plus an inline AI suggestion proposing action on unowned risks.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  const {
    useState
  } = React;
  function RiskLog() {
    const {
      Button,
      Select,
      ScoreBadge,
      StatusChip,
      AISuggestionCard,
      AIAssistButton
    } = DS;
    const all = window.PRINCESS_DATA.risks;
    const [status, setStatus] = useState('All');
    const [sort, setSort] = useState('score');
    const [showAI, setShowAI] = useState(true);
    let rows = all.filter(r => status === 'All' || statusLabel(r.status) === status);
    rows = [...rows].sort((a, b) => sort === 'score' ? b.score - a.score : a.id - b.id);
    return /*#__PURE__*/React.createElement("div", {
      className: "pk-page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk-pagehead"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk-pagehead__title"
    }, /*#__PURE__*/React.createElement("h1", null, "Risk Log"), /*#__PURE__*/React.createElement("span", {
      className: "pk-count"
    }, rows.length)), /*#__PURE__*/React.createElement("div", {
      className: "pk-pagehead__actions"
    }, /*#__PURE__*/React.createElement(AIAssistButton, {
      icon: "auto_awesome"
    }, "Ask Princess"), /*#__PURE__*/React.createElement(Button, {
      variant: "filled",
      icon: "add"
    }, "Raise Risk"))), showAI && /*#__PURE__*/React.createElement(AISuggestionCard, {
      title: "2 open risks have no mitigation owner",
      acceptLabel: "Assign owner",
      onAccept: () => setShowAI(false),
      onDismiss: () => setShowAI(false),
      style: {
        marginBottom: 4
      }
    }, "Risks R-004 and R-006 are unassigned. Assign the project manager as interim owner so they stay tracked at the next checkpoint."), /*#__PURE__*/React.createElement("div", {
      className: "pk-filters"
    }, /*#__PURE__*/React.createElement(Select, {
      label: "Status",
      value: status,
      onChange: setStatus,
      options: ['All', 'Open', 'Mitigated', 'Closed', 'Materialised'],
      style: {
        width: 160
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "pk-segment"
    }, /*#__PURE__*/React.createElement("button", {
      className: sort === 'score' ? 'is-active' : '',
      onClick: () => setSort('score')
    }, "By Score"), /*#__PURE__*/React.createElement("button", {
      className: sort === 'newest' ? 'is-active' : '',
      onClick: () => setSort('newest')
    }, "Newest"))), /*#__PURE__*/React.createElement("div", {
      className: "pk-tablecard"
    }, /*#__PURE__*/React.createElement("table", {
      className: "pk-table pk-table--risk"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Score"), /*#__PURE__*/React.createElement("th", null, "Title"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Proximity"), /*#__PURE__*/React.createElement("th", null, "Response"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Owner"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
      key: r.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(ScoreBadge, {
      score: r.score
    })), /*#__PURE__*/React.createElement("td", {
      className: "pk-cell-strong"
    }, r.title), /*#__PURE__*/React.createElement("td", {
      className: "pk-muted"
    }, r.category), /*#__PURE__*/React.createElement("td", {
      className: "pk-muted"
    }, r.proximity), /*#__PURE__*/React.createElement("td", {
      className: "pk-muted"
    }, r.response), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusChip, {
      status: r.status
    })), /*#__PURE__*/React.createElement("td", {
      className: "pk-muted"
    }, r.owner)))))));
  }
  function statusLabel(s) {
    return {
      open: 'Open',
      mitigated: 'Mitigated',
      closed: 'Closed',
      materialised: 'Materialised'
    }[s];
  }
  Object.assign(window, {
    RiskLog
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/princess/RiskLog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/princess/Sidebar.jsx
try { (() => {
// Princess app sidebar — dark navy navigation with brand gradient accent line.
(function () {
  function Sidebar({
    active,
    onNavigate
  }) {
    const groups = window.PRINCESS_DATA.nav;
    return /*#__PURE__*/React.createElement("nav", {
      className: "pk-sidebar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk-sidebar__brand"
    }), /*#__PURE__*/React.createElement("div", {
      className: "pk-sidebar__scroll"
    }, groups.map(group => /*#__PURE__*/React.createElement("div", {
      className: "pk-group",
      key: group.label
    }, /*#__PURE__*/React.createElement("span", {
      className: "pk-group__label"
    }, group.label), group.items.map(item => /*#__PURE__*/React.createElement("a", {
      key: item.key,
      className: 'pk-item' + (active === item.key ? ' pk-item--active' : ''),
      onClick: () => onNavigate(item.key)
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons pk-item__icon"
    }, item.icon), /*#__PURE__*/React.createElement("span", {
      className: "pk-item__label"
    }, item.label)))))), /*#__PURE__*/React.createElement("div", {
      className: "pk-sidebar__footer"
    }, /*#__PURE__*/React.createElement("a", {
      className: "pk-item"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons pk-item__icon"
    }, "settings"), /*#__PURE__*/React.createElement("span", {
      className: "pk-item__label"
    }, "Settings"))));
  }
  Object.assign(window, {
    Sidebar
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/princess/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/princess/TopBar.jsx
try { (() => {
// Princess app top bar — logo, command search, notifications, avatar menu.
(function () {
  const DS = window.PrincessDesignSystem_3d336d;
  function TopBar() {
    const {
      IconButton,
      Avatar
    } = DS;
    const u = window.PRINCESS_DATA.user;
    return /*#__PURE__*/React.createElement("header", {
      className: "pk-topbar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pk-topbar__start"
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: "menu",
      ariaLabel: "Toggle navigation"
    }), /*#__PURE__*/React.createElement("a", {
      className: "pk-topbar__logo"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logo.svg",
      alt: "Princess",
      height: "24"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "pk-topbar__center"
    }, /*#__PURE__*/React.createElement("button", {
      className: "pk-search"
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-icons pk-search__icon"
    }, "search"), /*#__PURE__*/React.createElement("span", {
      className: "pk-search__label"
    }, "Search projects, risks, documents\u2026"), /*#__PURE__*/React.createElement("kbd", {
      className: "pk-search__kbd"
    }, "\u2318K"))), /*#__PURE__*/React.createElement("div", {
      className: "pk-topbar__end"
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: "auto_awesome",
      ariaLabel: "Ask Princess"
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "notifications_none",
      badge: "3",
      ariaLabel: "Notifications"
    }), /*#__PURE__*/React.createElement(Avatar, {
      name: u.name + ' ' + u.familyName
    })));
  }
  Object.assign(window, {
    TopBar
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/princess/TopBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/princess/data.js
try { (() => {
// Mock data for the Princess UI kit — PRINCE2 project management.
window.PRINCESS_DATA = {
  user: {
    name: 'Ana',
    familyName: 'Novak',
    email: 'ana.novak@sinecon.eu',
    initials: 'AN'
  },
  nav: [{
    label: 'Overview',
    items: [{
      label: 'Dashboard',
      icon: 'dashboard',
      key: 'dashboard'
    }, {
      label: 'PRINCE2 Guide',
      icon: 'menu_book',
      key: 'guide'
    }]
  }, {
    label: 'Project',
    items: [{
      label: 'Projects',
      icon: 'folder_open',
      key: 'projects'
    }]
  }, {
    label: 'Planning',
    items: [{
      label: 'Work Breakdown',
      icon: 'account_tree',
      key: 'wbs'
    }, {
      label: 'Timeline',
      icon: 'calendar_view_week',
      key: 'timeline'
    }, {
      label: 'Tasks',
      icon: 'check_circle_outline',
      key: 'tasks'
    }]
  }, {
    label: 'Logs',
    items: [{
      label: 'Daily Log',
      icon: 'edit_note',
      key: 'daily-log'
    }, {
      label: 'Issue Log',
      icon: 'bug_report',
      key: 'issues'
    }, {
      label: 'Risk Log',
      icon: 'warning_amber',
      key: 'risks'
    }, {
      label: 'Change Log',
      icon: 'sync_alt',
      key: 'changes'
    }, {
      label: 'Quality Register',
      icon: 'fact_check',
      key: 'quality'
    }, {
      label: 'Lessons Log',
      icon: 'school',
      key: 'lessons'
    }]
  }, {
    label: 'Reports',
    items: [{
      label: 'Highlight Reports',
      icon: 'summarize',
      key: 'highlight'
    }, {
      label: 'Exception Reports',
      icon: 'report_problem',
      key: 'exceptions'
    }]
  }, {
    label: 'AI',
    items: [{
      label: 'Suggestions',
      icon: 'auto_awesome',
      key: 'ai'
    }]
  }],
  projects: [{
    id: 1,
    name: 'Office Relocation',
    reference: 'PROJ-001',
    status: 'delivery',
    stage: 'Stage 2 — Fit-out',
    created: '12 Mar 2025',
    tolerances: 'full'
  }, {
    id: 2,
    name: 'ERP Migration',
    reference: 'PROJ-002',
    status: 'initiation',
    stage: 'Initiation',
    created: '03 Apr 2025',
    tolerances: 'partial'
  }, {
    id: 3,
    name: 'Customer Portal Rebuild',
    reference: 'PROJ-003',
    status: 'delivery',
    stage: 'Stage 3 — Build',
    created: '21 Jan 2025',
    tolerances: 'full'
  }, {
    id: 4,
    name: 'ISO 27001 Certification',
    reference: 'PROJ-004',
    status: 'closing',
    stage: 'Closing',
    created: '08 Nov 2024',
    tolerances: 'partial'
  }, {
    id: 5,
    name: 'Warehouse Automation',
    reference: 'PROJ-005',
    status: 'pre_project',
    stage: '—',
    created: '02 Jun 2025',
    tolerances: 'none'
  }, {
    id: 6,
    name: 'Brand Refresh 2024',
    reference: 'PROJ-006',
    status: 'closed',
    stage: 'Closed',
    created: '14 Feb 2024',
    tolerances: 'full'
  }],
  risks: [{
    id: 1,
    score: 20,
    title: 'Key supplier may miss fit-out deadline',
    category: 'Schedule',
    proximity: 'Imminent',
    response: 'Reduce',
    status: 'open',
    owner: 'A. Novak'
  }, {
    id: 2,
    score: 12,
    title: 'Asbestos discovered in ceiling void',
    category: 'Health & Safety',
    proximity: 'Near',
    response: 'Transfer',
    status: 'open',
    owner: 'M. Horvat'
  }, {
    id: 3,
    score: 9,
    title: 'Network cabling spec not finalised',
    category: 'Technical',
    proximity: 'Near',
    response: 'Reduce',
    status: 'mitigated',
    owner: 'J. Kovač'
  }, {
    id: 4,
    score: 6,
    title: 'Furniture lead time exceeds plan',
    category: 'Procurement',
    proximity: 'Distant',
    response: 'Accept',
    status: 'open',
    owner: 'A. Novak'
  }, {
    id: 5,
    score: 16,
    title: 'Budget overrun on M&E works',
    category: 'Cost',
    proximity: 'Imminent',
    response: 'Avoid',
    status: 'materialised',
    owner: 'T. Zajc'
  }, {
    id: 6,
    score: 4,
    title: 'Staff resistance to open-plan layout',
    category: 'People',
    proximity: 'Distant',
    response: 'Reduce',
    status: 'mitigated',
    owner: 'S. Petek'
  }, {
    id: 7,
    score: 3,
    title: 'Parking permits delayed by council',
    category: 'External',
    proximity: 'Distant',
    response: 'Accept',
    status: 'closed',
    owner: 'M. Horvat'
  }],
  suggestions: [{
    id: 1,
    icon: 'group_off',
    title: '2 open risks have no mitigation owner',
    body: 'Risks R-004 and R-006 are unassigned. Assign the project manager as interim owner so they stay tracked at the next checkpoint.',
    accept: 'Assign owner',
    context: 'Risk Log'
  }, {
    id: 2,
    icon: 'summarize',
    title: 'Draft this week\u2019s Highlight Report',
    body: 'Princess can compile progress, the 7 active risks and 3 open issues into a Highlight Report for the Project Board, ready for your review.',
    accept: 'Generate draft',
    context: 'Reports'
  }, {
    id: 3,
    icon: 'trending_up',
    title: 'Budget tolerance is 82% consumed',
    body: 'At the current burn rate, the M&E work package will breach its cost tolerance in ~9 days. Consider raising an Exception Report.',
    accept: 'Raise exception',
    context: 'Stage 2'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/princess/data.js", error: String((e && e.message) || e) }); }

__ds_ns.AIAssistButton = __ds_scope.AIAssistButton;

__ds_ns.AISuggestionCard = __ds_scope.AISuggestionCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.LifecycleStepper = __ds_scope.LifecycleStepper;

__ds_ns.ScoreBadge = __ds_scope.ScoreBadge;

__ds_ns.StatusChip = __ds_scope.StatusChip;

})();
