# Princess Design System

Canonical visual language and UI-architecture reference for the Princess frontend.
This is the **approved** design — originally delivered as a hi-fi handoff bundle
(`docs/princess_design_system/`, added in commit `3e279eb`, later trimmed from the repo
once the Cockpit shell shipped — recovered from git history and reconciled with the
current codebase below). Where the current implementation has drifted from the
approved spec, that's called out explicitly rather than silently overwritten — treat
those as either "needs reconciling" or "spec superseded by a later decision," not as
license to freelance further.

Verified against `src/styles/_theme-vars.scss`, `src/styles/_overlays.scss`,
`src/app/layout/**`, `src/app/features/cockpit/**`, and
`src/app/shared/components/` as of 2026-07-06.

## Brand

- Feel: **calm, precise, trustworthy** — a governance tool, not a marketing product.
- Brand gradient (signature): `#4561A2 → #4978B3 → #4DA6D8 → #4EB9EA` (`--brand-gradient`,
  `--brand-gradient-diagonal`). Used for: logo/wordmark, sidebar top rule, avatars, AI
  surfaces (AI card left bar, AI button border/fill).
- Sidebar background: deep navy `--brand-sidebar` (`#0D1520`).
- AI icon: always `auto_awesome`, gradient fill/border. AI cards carry a 3px left
  accent bar in `--brand-azure-2`.

## Copy rules

- **Voice:** professional, plain. No exclamation marks, no marketing fluff.
- **Person:** imperative on actions ("Raise Risk", "New project"). The AI assistant
  refers to itself as **Princess**, third person.
- **Casing:** sentence case everywhere (titles, labels, buttons, dialogs). Section/group
  labels: UPPERCASE with wide letter-spacing (0.06em+).
- **Terminology:** exact PRINCE2 vocabulary — *tolerances, proximity, response, stage,
  exception, highlight report, materialised*.
- **Numbers:** European — `5 000 €` (space thousands, trailing currency), dates as
  `12 Mar 2025`, tolerances as `-5 / +10 days`.
- **Empty states:** pair a fact with a next step (see `EmptyStateComponent` below).
- **Emoji:** none, ever.

## Theme setup

Defined in `src/styles/_theme-vars.scss`, applied via `src/styles.scss` with Angular
Material 3's `mat.theme()`:

- Primary palette: `mat.$azure-palette` (Sinecon brand)
- Tertiary palette: `mat.$orange-palette`
- Typography: Roboto, density `0`
- Dark theme applied automatically via `@media (prefers-color-scheme: dark)` — same
  palettes, `theme-type: dark`

Custom tokens layer on top via `apply-surface-overrides()` — never use generic Material
colors; always reference these or the generated `--mat-sys-*` tokens.

### Color tokens

| Token | Value | Use |
|---|---|---|
| `--brand-azure-1..4` | `#4561A2` → `#4EB9EA` | Gradient stops only |
| `--brand-sidebar` | `#0D1520` | Sidebar background |
| `--brand-sidebar-active` | `#4EB9EA` | Active sidebar item |
| `--brand-ink` | `#1D252D` | High-contrast text on brand surfaces |
| `--status-success` / `-strong` | `#2E7D32` / `#1B5E20` | Positive/done states |
| `--status-warning` / `-strong` | `#F57C00` / `#E65100` | Caution states |
| `--status-caution` / `-text` | `#F9A825` / `#F57F17` | Softer warning variant |
| `--status-danger` | `#BA1A1A` | Error/destructive |
| `--status-neutral` | `#546E7A` | Muted/inactive |
| `--status-info` | `#475D92` | Informational |

**Health dots** (Portfolio table, project switcher): ok `#2E7D32`, warn `#F57C00`,
danger `#BA1A1A` — same values as success/warning/danger above, used as a solid 8px dot
rather than a tinted chip.

**Risk score severity ramp** (probability × impact, 1–25) — drives `ScoreBadge`/
`RiskScoreBadgeComponent`:

| Severity | Score range | Color |
|---|---|---|
| Low | 1–4 | `#2E7D32` |
| Medium | 5–9 | `#F57F17` |
| High | 10–15 | `#E65100` |
| Critical | 16–25 | `#BA1A1A` |

Status chips, badges, and score badges render text in the full-strength color over a
`color-mix(in srgb, <color> 12–15%, transparent)` tint background — match the exact mix
percentage documented per component below; don't invent a new one per feature.

### Material 3 system tokens (azure-blue, light) — reference, not to hardcode

These are **generated** by Angular Material's theme — never hardcode them, always
reference `--mat-sys-*`. Listed here so a value can be sanity-checked without opening
devtools:

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--mat-sys-primary` | `#475d92` | | `--mat-sys-on-primary` | `#ffffff` |
| `--mat-sys-primary-container` | `#d8e2ff` | | `--mat-sys-on-primary-container` | `#2e4578` |
| `--mat-sys-secondary` | `#575e71` | | `--mat-sys-on-secondary` | `#ffffff` |
| `--mat-sys-secondary-container` | `#dbe2f9` | | `--mat-sys-on-secondary-container` | `#3f4759` |
| `--mat-sys-tertiary` | `#8f4d00` | | `--mat-sys-on-tertiary` | `#ffffff` |
| `--mat-sys-error` | `#ba1a1a` | | `--mat-sys-error-container` | `#ffdad6` |
| `--mat-sys-background` / `-surface` | `#faf9ff` | | `--mat-sys-on-background` / `-on-surface` | `#1a1b21` |
| `--mat-sys-surface-variant` | `#e1e2ec` | | `--mat-sys-on-surface-variant` | `#44464f` |
| `--mat-sys-surface-container-lowest` | `#ffffff` | | `--mat-sys-surface-container-low` | `#f4f3fa` |
| `--mat-sys-surface-container` | `#eeedf4` | | `--mat-sys-surface-container-high` | `#e8e7ef` |
| `--mat-sys-outline` | `#757680` | | `--mat-sys-outline-variant` | `#c4c6d0` |

These regenerate for dark mode automatically — never assume the light values above
apply under `prefers-color-scheme: dark`.

### Typography

Fonts (Google Fonts): **Roboto** (300/400/500/700) for body, tables, dense data,
Material defaults; **Instrument Sans** (400/500/600/700) for UI chrome, labels,
headings, nav, eyebrows; **Roboto Mono** (400/500) for mono. **Material Icons** +
**Material Symbols Outlined** for iconography, referenced by ligature name (`add`,
`search`, `notifications_none`, `more_vert`, `auto_awesome`, `expand_more`, `check`,
`close`, `folder_open`, `inbox`, …).

| Token | Family stack |
|---|---|
| `--font-sans` | `'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif` |
| `--font-display` | `'Instrument Sans', 'Roboto', system-ui, sans-serif` |
| `--font-mono` | `'Roboto Mono', ui-monospace, 'SF Mono', Menlo, monospace` |

| Role | Size | Line-height | Weight | Font | Transform |
|---|---|---|---|---|---|
| Display (hero numerals, marketing only) | 2.75rem | 1.12 | 400 | display | — |
| Headline (page title) | 1.75rem | 1.2 | 400 | display | sentence case |
| Title LG | 1.5rem | 1.25 | 400 | display | — |
| Title (section/card heading) | 1.25rem | 1.3 | 600 | display | UPPERCASE, 0.06em tracking |
| Title SM | 1rem | 1.4 | 600 | display | — |
| Body (default) | 0.875rem | 1.5 | 400 | sans | normal |
| Body SM | 0.8125rem | 1.5 | 400 | sans | normal |
| Label (buttons, chips, nav) | 0.8125rem | 1 | 500 | display | sentence case |
| Label SM | 0.75rem | 1 | 500 | display | — |
| Overline | 0.6875rem | — | 500 | display | UPPERCASE, 0.1em tracking |
| Nav group labels | 9px | — | 500 | display | UPPERCASE, 0.1em tracking |

**Critical:** `var(--font-display)` must be set explicitly on all UI chrome — body
inherits Roboto and does not cascade Instrument Sans.

### Spacing & layout

- Base-4 spacing scale: `0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64px`
- `--princess-sidebar-width`: 260px (`--princess-sidebar-collapsed-width`: 64px)
- `--princess-topbar-height`: 64px
- AI dock: 344px
- Card gaps: 16–20px

**Content width — token vs. reality:** `--princess-content-max-width` is defined as
`1440px` in `_theme-vars.scss`, but `shell.component.scss` hardcodes
`.shell__content-inner { max-width: 1280px; padding: 28px 32px 64px; }` directly rather
than referencing the token or `--content-padding` (`24px`). The **1280px / 28px 32px
64px** values are what's actually live in every page today. Treat the token as
aspirational/stale until someone wires the shell to use it — don't cite `1440px` or
`24px` as the real content width/padding in new work; use `1280px` / `28px 32px 64px`.

### Radius

| Token | Value | Used for |
|---|---|---|
| `--radius-sm` | 4px | Inputs, selects |
| `--radius-chip` (`--princess-border-radius-chip`) | 8px | Chips, status chips, menus |
| `--radius-card` (`--princess-border-radius-card`) | 12px | Cards, form sections, dialogs |
| `--radius-pill` | 20px | Buttons, AI buttons, search field |
| `--radius-full` | 9999px | Avatars, score badges, dots |

**Rule:** form sections and detail-page section cards use `--radius-card` (12px), not a
hardcoded 8px.

### Elevation

Material 3 is restrained — most surfaces use **tonal containers, not shadows**.

| Token | Value | Used for |
|---|---|---|
| `--elevation-0` | none | Flat tonal cards — the default |
| `--elevation-1` | `0 1px 3px rgba(0,0,0,.08)` | Sticky top bar, elevated tables |
| `--elevation-2` | `0 2px 6px rgba(0,0,0,.10), 0 1px 2px rgba(0,0,0,.06)` | Menus, popovers, dropdowns |
| `--elevation-3` | `0 8px 24px rgba(0,0,0,.16), 0 2px 6px rgba(0,0,0,.08)` | Dialogs |
| `--elevation-4` | `0 12px 32px rgba(0,0,0,.20)` | Transient (drag, toast) |
| `--focus-ring` | `0 0 0 3px color-mix(in srgb, var(--mat-sys-primary) 30%, transparent)` | `:focus-visible` on all interactive controls |

### Motion

| Token | Value |
|---|---|
| `--duration-fast` (`--princess-transition-speed` uses base, not fast) | 120ms — toggles |
| `--duration-base` / `--princess-transition-speed` | 200ms — standard |
| `--duration-slow` | 320ms |
| `--ease-standard` / `--princess-transition-easing` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--ease-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` |

Skeleton shimmer: `linear-gradient(90deg, surface-variant 25%, surface-container-high
50%, surface-variant 75%)`, `background-size: 200%`, 1.4s ease-in-out infinite
(200%→-200%). Checkbox check: 120ms scale 0→1. Everything else: 200ms standard easing.
Always respect `prefers-reduced-motion: reduce` (shimmer and other loops off).

## Overlay panels

Material overlays (dialog/menu/snackbar) are never styled via `::ng-deep`. Instead they
get a `panelClass` wired to a class in `src/styles/_overlays.scss`:

```html
<!-- MatDialog -->
panelClass="princess-dialog"
<!-- MatMenu -->
panelClass="princess-menu"
<!-- MatSnackBar -->
panelClass="princess-snackbar"
```

- `.princess-dialog` — `border-radius: var(--princess-border-radius-card)`, zero-padding
  surface (component owns its own padding)
- `.princess-menu` — `border-radius: var(--princess-border-radius-card)`, `min-width: 200px`
- `.princess-snackbar` — 8px container shape, `margin-bottom: 24px`
- Select/menu panels generally (from the approved primitive spec, not yet a named
  overlay class): bg `surface-container-lowest`, radius 8px, `--elevation-2`,
  `padding: 6px`, `max-height: 280px`. Options: `padding: 9px 12px`, radius 6px,
  0.875rem; hover bg `on-surface 6%`; selected bg `primary 12%`, color primary, weight
  500, trailing `check` icon.

## Component primitive specs

18 primitives from the approved handoff. **Map** = the Angular Material building block
to wrap/theme — never rebuild a primitive Material already provides. Where there's no
Material equivalent (AI components, StatusChip, ScoreBadge, LifecycleStepper), it's a
standalone component in `src/app/shared/components/` (or feature-level, noted).

### Buttons

**Button** — `mat-button` family (`mat-flat-button` filled, `mat-button` tonal/text,
`mat-stroked-button` outlined).
- Shape: pill, `border-radius: 20px`. Font: Instrument Sans 500, letter-spacing `.01em`.
  Gap 8px icon/label. Icons: Material Icons, 18px.
- Sizes: `sm` 32px tall / `0 14px` padding / 0.8125rem · `md` 40px / `0 22px` / 0.875rem
  · `lg` 48px / `0 28px` / 0.9375rem. Text variant uses 14px side padding.
- **filled**: bg `--mat-sys-primary`, text on-primary. Hover → `color-mix(primary 90%,
  #000)` + elevation-1. Active → mix 82%.
- **tonal**: bg `--mat-sys-secondary-container`, text on-secondary-container. Hover →
  mix 88% #000.
- **outlined**: transparent, text primary, border outline-variant. Hover → bg `primary
  8%` tint, border → primary.
- **text**: transparent, text primary. Hover → `primary 8%` tint.
- **danger**: bg `--mat-sys-error`, text on-error. Hover → mix 90% #000 + elevation-1.
- **disabled**: opacity .38, no shadow, `cursor: not-allowed`.
- **focus-visible**: focus ring token.

**IconButton** — `mat-icon-button`.
- Round, transparent, color `on-surface-variant`. Sizes: `sm` 32px (icon 18px) · `md`
  40px (icon 22px).
- Hover → bg `on-surface 8%`, color on-surface. Active → bg `on-surface 14%`. `active`
  prop → color primary. Disabled opacity .38.
- Optional badge: top-right, min 16px tall, `padding 0 4px`, radius 8px, bg
  `--mat-sys-error`, white Instrument Sans 600 10px.

### AI (no Material equivalent — standalone)

**AIAssistButton** (`app-ai-assist-button`, "Ask Princess") — gradient pill.
- Default: 36px tall, `0 16px`, Instrument Sans 500 0.8125rem, gap 7px, radius 20px,
  text primary, bg `surface-container-lowest`, **1px gradient border**
  (`--brand-gradient-diagonal` via mask trick). Icon `auto_awesome` 17px, gradient
  text-clip. Hover → bg `primary 7%` over lowest.
- `solid` input: white text, fill `--brand-gradient-diagonal`, no border, white icon.
  Hover → `brightness(1.06)`.

**AISuggestionCard** (`app-ai-suggestion-card`) — azure-tinted insight card.
- Radius 12px, padding `16px 18px`. bg `color-mix(primary 6%, surface-container-lowest)`,
  border `1px color-mix(primary 22%, transparent)`. **3px left accent bar** =
  `--brand-gradient`.
- Header: 24px rounded-6px spark tile filled `--brand-gradient-diagonal`, white
  `auto_awesome` 15px icon + uppercase `eyebrow` input (Instrument Sans 600 0.6875rem,
  letter-spacing .1em, color primary; default text "AI Suggestion").
- Title: Instrument Sans 600 0.95rem, on-surface. Body: Roboto 0.875rem/1.5,
  on-surface-variant.
- Actions (gap 8px, margin-top 14px): `accepted` output = filled primary pill 34px with
  `check` icon (default label input `acceptLabel` = "Apply"); `dismissed` output = text
  pill on-surface-variant (default `dismissLabel` = "Dismiss").

### Display

**Card** — `mat-card`.
- Radius 12px, padding `20px 24px`, Roboto, color on-surface.
- **tonal** (default): bg `surface-container-low`, no shadow. **outlined**: bg lowest +
  `1px outline-variant`. **elevated**: bg lowest + elevation-1.
- Optional title: uppercase Instrument Sans 600 0.875rem, letter-spacing .06em, color
  on-surface-variant, margin-bottom 14px.

**Badge** (`app-badge`) — small status pill.
- `padding 3px 10px`, radius 12px, Instrument Sans 600 0.75rem, letter-spacing .02em,
  gap 5px, icon 13px.
- Tones (`tone` input, default `primary`; text color, tint bg = `color-mix(<color> 12%,
  transparent)`): primary `#475d92` · success `#2e7d32` · warning `#f57c00` · danger
  `#ba1a1a` · neutral `#546e7a` · info `#475d92` · tertiary `#8f4d00`.
- `solid` input → white text on full-strength color.

**Chip** (`app-chip`) — `mat-chip` / `mat-chip-option`.
- 32px tall, `padding 0 12px`, radius 8px, `1px outline-variant` border, bg lowest,
  Instrument Sans 500 0.8125rem, color on-surface-variant, gap 6px, icon 16px.
- Hover → bg `on-surface 5%`. `selected` input → bg `primary 12%`, transparent border,
  color primary. `removable` input → trailing `close` icon, round hover bg `on-surface
  12%`, emits `removed` output.

**Avatar** (`app-avatar`) — circular.
- `--brand-gradient-diagonal` bg, white Instrument Sans 500, letter-spacing .03em.
  Initials = first letters of first two words of `name`. `src` input renders a cover
  image instead.
- Sizes (`size` input, default `md`): `sm` 28px/10px font · `md` 36px/12px · `lg`
  48px/16px.

### Forms

**Input** — `mat-form-field appearance="outline"` + `matInput`.
- Box 48px tall, `padding 0 14px`, radius 4px, `1px outline-variant`, bg lowest. Hover
  border → on-surface-variant. **Focused** → border primary, 2px (padding compensates
  to `0 13px`). **error** → border `--mat-sys-error`. **disabled** → opacity .5, bg
  surface-container.
- Floating label: Roboto 0.9375rem on-surface-variant; floated state moves to top,
  0.75rem, color primary (error → error color). Prefix icon 20px shifts label right to
  38px.
- Sub-text row: 0.75rem, margin `4px 14px 0` — hint (on-surface-variant) or error
  (error color) replaces it.

**Select** — `mat-form-field` + `mat-select`.
- Box matches Input (48px, radius 4px, outline border, focus → 2px primary). Trailing
  `expand_more` 22px arrow rotates 180° when open.
- Menu: see the panel spec under Overlay panels above. Style via `panelClass`, never
  global `::ng-deep`.

**Checkbox** — `mat-checkbox`.
- 18px box, radius 3px, `2px outline-variant` border. Checked → bg + border primary,
  white `check` icon (16px) scales 0→1 over 120ms. Label Roboto 0.9375rem, gap 10px.
  Disabled opacity .38.

**Switch** — `mat-slide-toggle`.
- Track 44×24px, radius 12px, bg surface-container-highest, `2px outline` border.
  Thumb 12px circle, color outline, left 4px. On → track + border primary, thumb 16px
  white (on-primary), left 22px. Label Roboto 0.9375rem, gap 10px. Disabled opacity .38.

### Feedback

**Tabs** — `mat-tab-group` (underline style).
- Row with 1px bottom border outline-variant, Instrument Sans. Tab: `padding 10px
  16px`, 0.875rem 500, color on-surface-variant, 2px transparent bottom border
  (margin-bottom -1px). Hover → on-surface. Active → color primary + 2px primary
  underline.

**EmptyState** (`app-empty-state`) — see full usage under the shared catalog below.
Centered column, `padding 64px 24px`, gap 8px. Icon 48px on-surface-variant opacity .4
(default `inbox`). Title Instrument Sans 600 18px on-surface. Message Roboto 14px
on-surface-variant, max-width 360px. Optional outlined action button: 40px pill,
primary text, outline-variant border, hover `primary 8%` tint.

**Skeleton** (`app-skeleton`) — see shared catalog below.

### Status (domain-specific — standalone)

**StatusChip** (`app-status-chip`) — uppercase PRINCE2 status pill.
- `padding 2px 10px`, radius 8px, Instrument Sans 600 0.75rem, letter-spacing .02em,
  uppercase. Text = full color, bg = `color-mix(<color> 13%, transparent)`.
- Presets (status → label, color): `pre_project`→"Pre-Project" `#546e7a` ·
  `initiation`→"Initiation" `#475d92` · `delivery`→"Delivery" `#2e7d32` ·
  `closing`→"Closing" `#8f4d00` · `closed`→"Closed" `#546e7a` · `open`→"Open" `#475d92`
  · `mitigated`→"Mitigated" `#2e7d32` · `materialised`→"Materialised" `#ba1a1a`.
  Generic tones (via `tone` input): primary/success/warning/danger/neutral as in Badge.

**ScoreBadge** (feature-level: `RiskScoreBadgeComponent`, `app-risk-score-badge`) —
round risk-score badge.
- 32px circle (`lg` 40px), Roboto 700 0.8rem (`lg` 0.95rem). Text = ramp color, bg =
  `color-mix(<ramp> 15%, transparent)`. Ramp per severity table above.

**LifecycleStepper** (`app-lifecycle-stepper`) — horizontal PRINCE2 stage tracker.
- Row in a tonal container: `padding 16px 20px`, bg surface-container-low, radius 12px,
  Instrument Sans. Each step ≥90px wide: 28px dot (`2px outline` border, bg surface) +
  0.7rem label on-surface-variant.
  - **done** (index < `activeIndex`): dot filled primary with white `check` 16px; label
    primary.
  - **active** (index = `activeIndex`): dot 3px primary border, bg `primary 12%`; label
    primary 600.
  - **pending**: default.
- Connectors between steps: `flex: 1` 2px line outline-variant, margin-bottom 22px;
  turns primary before the active index.
- Used on Project Home (steps = Pre-Project/Initiation/Delivery/Closing/Closed,
  `activeIndex` from `project.status`) and on Plan & Stages.

## Shared component catalog (`src/app/shared/components/`)

The 18-primitive spec above is the visual contract; this table is the concrete Angular
API as implemented.

| Component | Selector | Inputs | Outputs | Notes |
|---|---|---|---|---|
| `StatusChipComponent` | `app-status-chip` | `status`, `tone`, `label` | — | uppercase, display font |
| `BadgeComponent` | `app-badge` | `tone` (default `primary`), `solid` (default `false`) | — | tone colors, solid variant |
| `AvatarComponent` | `app-avatar` | `name`, `src`, `size` (default `md`) | — | gradient initials, circular |
| `ChipComponent` | `app-chip` | `selected`, `removable` | `removed` | 8px radius, removable variant |
| `EmptyStateComponent` | `app-empty-state` | `icon` (default `inbox`), `title`, `message`, `hint`, `actionLabel` | `actionClick` | see usage below |
| `SkeletonComponent` | `app-skeleton` | `width`, `height`, `borderRadius` | — | 1.4s shimmer placeholder |
| `LifecycleStepperComponent` | `app-lifecycle-stepper` | `steps`, `activeIndex` (default `0`) | — | dots + connectors |
| `AIAssistButtonComponent` | `app-ai-assist-button` | `solid` (default `false`) | — | gradient border; solid variant |
| `AISuggestionCardComponent` | `app-ai-suggestion-card` | `eyebrow`, `acceptLabel`, `dismissLabel` | `accepted`, `dismissed` | gradient left bar, uppercase eyebrow |
| `ConfirmDialogComponent` | `app-confirm-dialog` | — | — | rendered as dialog content only; import `MatDialogModule` here, nowhere else |
| `LoadingBarComponent` | `app-loading-bar` | — | — | thin top-of-page progress indicator, wired via HTTP interceptor |
| `PageScrollComponent` | `app-page-scroll` | — | — | scroll-position wrapper; every routed page's template is wrapped in `<app-page-scroll>` |

Feature-level (not shared):
- `RiskScoreBadgeComponent` — `app-risk-score-badge` — `src/app/features/risks/components/`
- `DocumentStatusChipComponent` — `app-document-status-chip` — `src/app/features/documents/components/`

> `LinkChipComponent` (`app-link-chip`) existed in an earlier iteration — the approved
> design uses it for relationship chips in list rows (see "Known gaps" below) — but was
> removed as unused (commit `f6d3b32`). Don't reintroduce it without checking whether
> the relationship-chip need is being (re)implemented; if so, this is the natural home.

### EmptyState usage

```html
<!-- Two-part pattern: fact (title) + next step (hint) -->
<app-empty-state
  icon="warning_amber"
  title="No risks recorded yet"
  hint="Raise a risk to start tracking threats to the project."
/>

<!-- With message (secondary) and action button -->
<app-empty-state
  icon="layers"
  title="No stages yet"
  message="Break this project into stages to track delivery progress."
  actionLabel="Add first stage"
  (actionClick)="openCreateDialog()"
/>
```

`hint` renders below `message` in a lighter, smaller style. `title` is the headline
(h3) — never use `message` as the headline.

### Skeleton usage

```html
@for (i of [1,2,3,4]; track i) {
  <app-skeleton height="52px" borderRadius="4px" />
}
```

Wrap in a `<div>` with `display: flex; flex-direction: column; gap: 8px; padding: 12px 16px`.

## App shell architecture

Codenamed **Cockpit** at handoff (issue #66, merged 2026-06-26). Core principles that
drove the shell design — keep these when extending it, don't relitigate them per
feature:

1. **Project context is the root of the app.** Every API call needs a project ID, so a
   project is chosen first; everything else is viewed *through* the active project.
   The only cross-project surface is the Portfolio (`/projects`).
2. **Role re-prioritises, it doesn't just hide.** Different roles get materially
   different homes and navigation over the *same* project data (see Roles below).
3. **Relationships are first-class** — Risk → Issue → Change → Document chains should
   be navigable from list rows and item detail (see "Known gaps," this is only
   partially built).
4. **Documents link to any item**, shown inline with provenance.
5. **AI proposes, never acts.** Every AI dock/card action is accept / edit / dismiss
   and reversible; nothing writes silently.

### Shell wireframe (as implemented — `layout/shell`, `layout/sidebar`, `layout/top-bar`, `layout/ai-dock`)

```
┌──────────────────────────── Top bar — 64px ──────────────────────────────────────┐
│ [≡] logo   [Project switcher ▾]         [⌘K search pill]      [Ask Princess] [🔔] [avatar] │
├──────────────┬──────────────────────────────────────────────────┬────────────────┤
│ Sidebar      │ Content (router outlet, scrollable)               │ AI dock         │
│ 260px navy   │ max-width 1280px, centered, padding 28px 32px 64px│ 344px, toggle   │
│ (collapsed   │                                                   │ Insight │Guide  │
│  64px)       │  page-title row + actions                        │ Chat │ Proposals│
│              │  body content (cards / tables / forms)           │ (context-aware) │
│              │                                                   │                 │
└──────────────┴──────────────────────────────────────────────────┴────────────────┘
```

- **Top bar** (`layout/top-bar`, sticky, `z-index: 100`, height `--princess-topbar-height`
  = 64px, bg `--mat-sys-surface`, bottom border outline-variant, `--elevation-1`):
  - **Start zone** — width matches the sidebar (260px, shrinks with it when collapsed):
    menu toggle icon button, logo (max-width 100px image).
  - **Switcher** — pill button, `padding 4px 8px 4px 10px`, radius pill, `1px
    outline-variant` border, max-width 160px, name truncates with ellipsis + chevron.
    Opens the project switcher panel (see below).
  - **Center zone** — flex-grow, centered: the search pill. `height 36px`, `min-width
    280px`, `max-width 460px`, radius 20px, `1px outline-variant` border, bg
    `surface-container`, Instrument Sans 13px, `search` 16px icon, ⌘K kbd hint. Hover →
    border primary, bg `surface-container-high`.
  - **End zone**: `AIAssistButtonComponent` ("Ask Princess"), notification icon button
    (badge), `AvatarComponent`.
- **Sidebar** (`layout/sidebar`, 260px / 64px collapsed, bg `#0d1520`, 2px
  `--brand-gradient` top rule):
  - Scroll area: `padding 8px 0`, thin 4px scrollbar `rgba(255,255,255,.1)`.
  - Project picker pinned at top: `padding 6px 8px 4px`; button row `padding 8px 10px`,
    radius 8px, `1px rgba(255,255,255,.1)` border, bg `rgba(255,255,255,.05)`. Opens
    the same project switcher panel as the top-bar pill.
  - Group label: Instrument Sans 500 9px, letter-spacing .1em, uppercase,
    `rgba(255,255,255,.3)`, `padding 10px 16px 4px`.
  - Nav item: 36px tall, `margin 1px 8px`, `padding 0 12px`, radius 8px, gap 10px, color
    `rgba(255,255,255,.72)`, icon 18px. Hover → bg `rgba(255,255,255,.05)`, color
    `.92`. **Active** → bg `rgba(78,185,234,.12)`, color `--brand-sidebar-active`
    (`#4eb9ea`).
  - Current nav groups (`layout/sidebar/sidebar.component.ts`): **Overview** (Home) ·
    **Planning** (Plan & stages, Stages — pm/pmo only) · **Team** (Members, Daily Log)
    · **Logs** (Requirements, Acceptance Criteria, Risk Log, Issue Log, Change Log
    pm/pmo, Quality pm/pmo, Lessons pm/pmo) · **Reports** (Highlight, Exceptions —
    pm/pmo only) · **Documents** (Documents, Review Queue, Templates).
- **Content**: scroll area; page centered, `max-width: 1280px`, `padding: 28px 32px
  64px` (see the token-vs-reality note above), column gap 18px. Page head pattern:
  title row (Roboto 1.6–1.75rem/400) + optional count pill (Instrument Sans 0.8125rem,
  `on-surface 8%` bg, radius 12px) + actions row. Optional lede: Roboto 0.9375rem
  on-surface-variant, max-width 680px. Segmented control pattern (e.g. risk sort): 1px
  outline-variant pill row, radius 20px; active segment bg `primary 12%`, color
  primary.
- **AI dock** (`layout/ai-dock`, 344px, toggleable, collapsed by default): four tabs —
  **Insight** (quick per-context read), **Guidance** (PRINCE2 "what to do," numbered
  steps), **Chat** (free Q&A), **Proposals** (actionable drafts, Generate/Apply +
  Dismiss) — `TABS` constant in `ai-dock.component.ts`, exactly matching the approved
  spec. Header shows "Princess" + a context line; footer has an always-present ask
  input. Toggled via the top-bar "Ask Princess" button.

### Overlays

- **Command palette** (`layout/command-palette`) — ⌘K / Ctrl+K. Grouped results:
  items, documents, follow-relationship, Ask Princess, actions — all scoped to the
  active project. Esc closes.
- **Project switcher** (`layout/project-switcher`) — anchored panel, project rows with
  health dot, stage `StatusChip`, tolerance chip. Footer: All projects / New project.
  Opened from either the top-bar switcher pill or the sidebar project picker.

## Routes

Current, as implemented (`app.routes.ts` + `features/cockpit/cockpit.routes.ts`) —
supersedes the handoff's shorter route stub list:

| Route | Screen | Notes |
|---|---|---|
| `/projects` | Portfolio | outside project context |
| `/p/:id/home` | Project Home (role-aware) | default redirect for `/p/:id` |
| `/p/:id/plan` | Plan & stages | |
| `/p/:id/stages`, `/stages/:stageId`, `/stages/:stageId/boundaries/:boundaryId` | Stage detail | |
| `/p/:id/members` | Members | |
| `/p/:id/daily-log` | Daily Log | |
| `/p/:id/requirements`, `/requirements/:requirementId` | Requirements | |
| `/p/:id/acceptance-criteria` | Acceptance Criteria | |
| `/p/:id/risks`, `/risks/:riskId` | Risk Log | |
| `/p/:id/issues`, `/issues/:issueId` | Issue Log | |
| `/p/:id/changes`, `/changes/:changeId` | Change Log | |
| `/p/:id/quality`, `/quality/:entryId` | Quality Register | |
| `/p/:id/lessons`, `/lessons/:lessonId` | Lessons Log | |
| `/p/:id/documents`, `/documents/:docId` | Document Library | |
| `/p/:id/documents/review-queue` | Classification Review Queue | |
| `/p/:id/documents/templates` | Document Templates | |
| `/p/:id/reports/highlight` | Highlight Reports | **placeholder** — "coming soon" |
| `/p/:id/reports/exceptions` | Exception Reports | **placeholder** — "coming soon" |
| `/p/:id/settings` | Project Settings | **placeholder** — "not yet designed" |
| `/editor/:projectId/documents/:docId` | Document editor | outside the shell, own route |

All `/p/:id/*` routes sit behind `projectContextGuard`.

## Roles — two models that need reconciling

There are currently **two separate role concepts** in the codebase; know which one
gates what before building role-aware UI:

1. **`ProjectRole`** (`features/members/contracts/member.contracts.ts`) — the real,
   backend-driven permission model: `executive, senior_user, senior_supplier,
   project_manager, project_assurance, project_support, change_authority,
   team_manager, team_member, observer`, grouped into `board / management / assurance
   / change / team / observer`. This is what the backend's policies actually check
   (`qa:read`, `qa:manage`, `meetings:read`, `meetings:manage`, `projects:read`, etc. —
   see `[[project_code_patterns]]` memory for confirmed permission facts).
2. **`AppRole`** (`core/services/shell.store.ts`) — a leftover from the original
   design-review prototype's "Viewing as" affordance: `'pm' | 'pmo' | 'tm'`. This is
   what actually gates the **sidebar nav groups today** (`roles?: AppRole[]` on
   `NavGroup`/`NavItem` in `sidebar.component.ts`) and what `isPm()` / `isPmo()` drive
   on Project Home.

**These are not reconciled.** Nav visibility and Project Home layout are keyed to the
simplified 3-role `AppRole`, while actual API authorization is keyed to the 10-role
`ProjectRole`. A `project_assurance` member, for example, sees whatever nav the
`AppRole` signal happens to be set to, not necessarily nav that matches their real
`qa:read`/`meetings:read` permissions. Don't assume nav-hidden implies
API-inaccessible, or vice versa, when building new gated UI — check both, and flag it
if you're the one who ends up deciding how they map.

Per the approved design's original 3-role simplification (for reference, since
`AppRole` still uses these names):

| `AppRole` | Home focus | Nav | Permissions intent |
|---|---|---|---|
| `pm` (Project Manager) | Delivery KPIs, risks needing attention, AI "for you today" | Full | Read/write all logs, raise & triage, produce reports |
| `pmo` (PMO / Project Support) | Governance health, overdue reports, stage gates, assurance checklist | Full minus delivery-edit | Read-mostly, assurance flags, gate control |
| `tm` (Team Manager) | Their work package + checklist + raise-to-PM actions | Home, Risk Log, Issue Log, Documents only | Raise risks/issues up to PM; no reports, no cross-project |

## Known gaps vs. the approved design

Concrete drift between the hi-fi spec and what's shipped — treat these as open items,
not as evidence the spec changed:

- **Relationship chips are missing from list rows.** The approved Risk Log row spec
  includes a **Relationships** column (chips: → issue, → change, → stage, + doc count)
  — the "key new affordance" that makes the data model legible from the list. The
  current `risk-list.component.html` table has columns Score · Title · Category ·
  Proximity · Response · Status · Owner — no relationship chips, no chevron. The
  `LinkChipComponent` that would render these was built, then removed as unused
  (commit `f6d3b32`) before this was wired up.
- **No inline `AISuggestionCard` on list screens.** The approved Risk Log has an inline
  suggestion card above the filter row (e.g. proposing action on unowned risks); not
  present in the current list page.
- **Project Home KPI tiles are stubbed.** `project-home.component.html` renders the
  correct tile structure (Stage tolerance, Open risks, My actions, Reports due for PM;
  Governance health, Overdue reports, Stage gates for PMO) but most values are literal
  `—` placeholders, not wired to real data yet.
- **Item detail relationship map is not yet built.** The approved Risk item-detail
  screen has a 2-column layout with a "Related items" card containing a visual
  relationship map (Risk → Issue → Change nodes) and a "Linked documents" card — not
  yet present in `risk-detail`.
- **Reports and Settings are unbuilt placeholders**, as noted in the routes table —
  this matches the handoff's own "not yet designed" / "stubbed" callouts for these
  screens, so it's not drift, just not-yet-done.
- **Roles model split**, as detailed above.

## Entity icons (Material Symbols, informal convention)

No dedicated icon-mapping service exists yet — these are the icons used consistently
across sidebar nav, command palette, and feature components. Keep new entity icons
consistent with this table.

| Entity | Icon |
|---|---|
| Risk | `warning_amber` |
| Issue | `bug_report` |
| Change | `sync_alt` |
| Quality | `fact_check` |
| Lesson | `school` |
| WBS | `account_tree` |
| Highlight report | `summarize` |
| Exception report | `report_problem` |
| AI | `auto_awesome` |
| Document | `description` / `attach_file` |
| Stage | `layers` |

## Related conventions

- Every routed page component's `:host` sets `padding: 24px` to match the shared shell
  container. Every routed page template is wrapped in `<app-page-scroll>`.
- BEM CSS naming: `.feature__element--modifier`.
- `MatDialogModule` must only be imported into a component that is itself rendered as
  dialog content (e.g. `ConfirmDialogComponent`) — importing it into a component that
  merely calls `inject(MatDialog)` silently shadows TestBed's `MatDialog` mock in specs.
