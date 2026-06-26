/* @ds-bundle: {"format":3,"namespace":"PrincessDesignSystem_3d336d","components":[{"name":"AIAssistButton","sourcePath":"components/ai/AIAssistButton.jsx"},{"name":"AISuggestionCard","sourcePath":"components/ai/AISuggestionCard.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Chip","sourcePath":"components/display/Chip.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Skeleton","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"Tabs","sourcePath":"components/feedback/Tabs.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"LifecycleStepper","sourcePath":"components/status/LifecycleStepper.jsx"},{"name":"ScoreBadge","sourcePath":"components/status/ScoreBadge.jsx"},{"name":"StatusChip","sourcePath":"components/status/StatusChip.jsx"}],"sourceHashes":{"components/ai/AIAssistButton.jsx":"8bd6023c915d","components/ai/AISuggestionCard.jsx":"ac25b64d21a1","components/buttons/Button.jsx":"5548772c5fe1","components/buttons/IconButton.jsx":"2aeb43c1c1a2","components/display/Avatar.jsx":"8899d5aa130f","components/display/Badge.jsx":"b6c47fd11d6c","components/display/Card.jsx":"0817b08943d5","components/display/Chip.jsx":"9ac1f849dc46","components/feedback/EmptyState.jsx":"f7b21fb385f0","components/feedback/Skeleton.jsx":"bb692cb7fa05","components/feedback/Tabs.jsx":"8b7d7a33b2be","components/forms/Checkbox.jsx":"25778d4c76c1","components/forms/Input.jsx":"cc145d005329","components/forms/Select.jsx":"ad5ed4c0c6fb","components/forms/Switch.jsx":"85d482878241","components/status/LifecycleStepper.jsx":"dba7a5cb7ed2","components/status/ScoreBadge.jsx":"fe448e0fc752","components/status/StatusChip.jsx":"84ccbd34b519","ui_kits/princess/AISuggestions.jsx":"e7288d406388","ui_kits/princess/ProjectDetail.jsx":"a45163fc8628","ui_kits/princess/Projects.jsx":"04071c6c594b","ui_kits/princess/RiskLog.jsx":"8f75ac03faf8","ui_kits/princess/Sidebar.jsx":"750fede9025e","ui_kits/princess/TopBar.jsx":"f594376d8378","ui_kits/princess/data.js":"f1102acae6c9"},"inlinedExternals":[],"unexposedExports":[]} */

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
