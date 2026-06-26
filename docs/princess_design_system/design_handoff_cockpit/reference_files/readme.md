# Princess Design System

The design system for **Princess** — a modern project-management platform that implements the **PRINCE2** methodology, built by **[Sinecon](http://www.sinecon.eu)**. Princess turns the PRINCE2 framework (projects, stages, risk/issue/change/quality/lessons logs, tolerances, highlight & exception reports) into an intuitive, uncluttered product, with an **AI layer** that prepares items, answers questions, automates inputs, and proposes actions from project data.

This system captures the product's real visual language so design agents can produce on-brand screens, prototypes, slides and assets.

---

## Sources

Everything here was reverse-engineered from the materials the team provided. The reader may not have access, but they are recorded so you can go deeper:

- **Frontend codebase** — `princess_frontend/` (Angular 18+ SPA, standalone components + signals, **Angular Material 3** with the *azure-blue* theme). The source of truth for layout, navigation, tables, colors and the PRINCE2 domain components. Key files read:
  - `src/styles/_theme-vars.scss` — M3 theme map (azure primary, orange tertiary), `--princess-*` layout vars.
  - `src/app/layout/{sidebar,top-bar,shell}` — the app chrome.
  - `src/app/features/{projects,risks}` — list/detail pages, status chips, score badges, lifecycle stepper, dialogs.
  - `src/app/shared/components/{empty-state,skeleton,confirm-dialog}` — shared primitives.
- **GitHub repo** — [`suhacb/princess_frontend`](https://github.com/suhacb/princess_frontend). Explore it to build richer, more accurate designs against this product.
- **Brand** — color direction taken from Sinecon (the company that owns the code): [www.sinecon.eu](http://www.sinecon.eu). The logo/wordmark and azure swoosh gradient are the brand anchors.

---

## Brand at a glance

Princess feels **calm, precise and trustworthy** — a serious governance tool that's pleasant to use. The azure brand gradient (deep `#4561A2` → bright `#4EB9EA`) is the signature, set against cool-neutral Material 3 surfaces and a deep navy app sidebar. AI is woven in as a distinct, gradient-marked layer (`auto_awesome`) that *proposes* rather than *acts*.

---

## Content fundamentals

How Princess writes. Mirror this in any copy you produce.

- **Voice:** professional, plain, quietly confident. It's a governance tool — clarity beats personality. No marketing fluff, no exclamation marks.
- **Person:** addresses the user implicitly via imperative verbs on actions (**"Raise Risk"**, **"New project"**, **"Generate draft"**). Avoids "I". The AI refers to itself as **Princess** in the third person ("Princess can compile…", "Princess reviews your project data").
- **Casing:** **Sentence case** for everything — page titles ("Risk Log", "Project details"), labels, buttons, dialog titles ("New Project"). Section/group labels in the sidebar and card headers are **UPPERCASE with wide tracking** (e.g. `PLANNING`, `PROJECT DETAILS`).
- **Terminology:** uses PRINCE2 vocabulary precisely and consistently — *tolerances, proximity, response (avoid/reduce/transfer/accept/share/exploit), stage, exception, highlight report, materialised*. Status values are real PRINCE2 states (`Pre-Project → Initiation → Delivery → Closing → Closed`).
- **Microcopy:** helpful and specific. Empty states pair a fact with a next step — *"No risks recorded yet / Raise a risk to start tracking threats to the project."* Hints explain, never scold — *"Define acceptable deviation ranges for this project. All fields are optional."*
- **Numbers & units:** European formatting — `5 000 €` (space thousands, trailing currency), dates as `12 Mar 2025`, tolerances as `-5 / +10 days`.
- **AI copy:** states what it observed, then proposes one concrete action with the reason. *"2 open risks have no mitigation owner — assign the project manager as interim owner so they stay tracked."* Never overclaims; always reversible ("nothing changes until you accept").
- **Emoji:** none. Not used anywhere in the product.

---

## Visual foundations

- **Color.** Material 3 *azure-blue* generated palette is the substrate; primary is azure `#475D92`, surfaces are a faint-cool neutral ramp (`#FFFFFF` → `#E2E2E9`). The **Sinecon brand gradient** (`#4561A2 → #4978B3 → #4DA6D8 → #4EB9EA`) is reserved for identity moments: the logo, the 2px sidebar accent line, avatars, and AI surfaces. The app sidebar is deep navy `#0D1520`. Tertiary/accent is an M3 **orange** (coral CTA), used sparingly. Status colors are hand-picked and consistent (success `#2E7D32`, warning `#F57C00`, danger `#BA1A1A`, neutral `#546E7A`).
- **Type.** Two families, both Google Fonts: **Roboto** for body, tables and dense data; **Instrument Sans** for UI chrome — labels, nav, buttons, card/section headings, eyebrows. Page titles are large and *light* (400 weight, 1.6–1.75rem); section/card titles are uppercase 600 with `.06em` tracking; nav and group labels are tiny uppercase with `.1em` tracking.
- **Spacing & layout.** Base-4 scale. Content is centered with a `1440px` max width and `24px` padding; cards gap at `16–20px`; the sidebar is `260px` (collapses to `64px`); top bar is `64px`. Generous whitespace — the product is information-dense but never cramped.
- **Backgrounds.** Flat. No photographic backgrounds, no full-bleed imagery, no decorative gradients on content. The gradient appears only as thin accents and on the brand/AI marks. Depth comes from Material's **tonal surface containers**, not color washes.
- **Corners & cards.** Cards `12px` radius; chips/inputs `8px`; buttons and the search field are **fully-pill** (`20px+`); risk score badges and avatars are circles. Cards are **flat tonal** by default (`surface-container-low`, no border, no shadow) — borders/shadows are opt-in for tables and floating surfaces.
- **Elevation & shadow.** Restrained, per Material 3. Most surfaces use tonal color, not shadow. Real shadows appear only on the sticky top bar (`0 1px 3px rgba(0,0,0,.08)`), menus (level 2), and dialogs (level 3).
- **Borders.** `1px solid` outline-variant (`#C4C6D0`) for tables, inputs and dividers. Focused inputs go to a `2px` primary border (Material outlined-field behaviour).
- **Motion.** Subtle and functional. Standard easing `cubic-bezier(0.4,0,0.2,1)` at `200ms`; faster `120ms` for toggles. Skeleton shimmer is a `1.4s` ease-in-out loop. Transitions fade/slide; **no bounces, no springy overshoot**. Respect `prefers-reduced-motion`.
- **Hover / press.** Hover = a low-opacity tint overlay (`color-mix(... 5–8%)`) or a one-step-darker fill on filled buttons; nav items lighten their text. Press/active = a slightly stronger tint (12–14%). Focus = a 3px primary-at-30% ring. No scale-down on press.
- **Transparency & blur.** Used only as `color-mix` tints over surfaces (chips, hover states, status backgrounds at 12–15%). No glassmorphism, no backdrop blur.
- **Imagery vibe.** The product is essentially imagery-free — it's data and governance. When imagery is needed, keep it cool-toned and restrained to match the azure palette; prefer iconography and data viz over photos.

---

## Iconography

- **System:** Google **Material Icons** (the classic filled/outlined ligature font), loaded from Google Fonts — exactly as the app does (`<link href="…icon?family=Material+Icons">`). **Material Symbols Outlined** is also linked for newer glyphs. Use ligature names in a `<span class="material-icons">name</span>` (or the components' `icon="name"` props).
- **Usage:** icons are functional, not decorative — every nav item, action button and status has one. Sizes: `18px` in nav/buttons, `16px` in chips, `22px` for top-bar actions, `40–48px` (at low opacity) for empty-state illustrations. Color inherits from context (`currentColor`).
- **Representative names:** `dashboard`, `folder_open`, `warning_amber` (risks), `bug_report` (issues), `sync_alt` (changes), `fact_check` (quality), `school` (lessons), `account_tree` (WBS), `summarize` (highlight reports), `report_problem` (exceptions), `auto_awesome` (**AI** — always), `add`, `search`, `more_vert`, `chevron_right`, `check`, `settings`.
- **Emoji / unicode:** none used as icons. The only non-icon glyphs are `⌘K` in the search affordance and currency/math symbols in copy.
- **Drawn SVG:** avoided. The only bespoke SVGs are the **logo** and **favicon mark** (in `assets/`) — never hand-draw new icons; use the Material font.

---

## Index / manifest

**Root**
- `styles.css` — the single entry point consumers link. `@import` manifest only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `fonts.css`, `base.css`.
- `assets/` — `logo.svg` (Sinecon wordmark + swoosh), `favicon.svg` (swoosh mark), `favicon.ico`.
- `readme.md` (this file), `SKILL.md`.

**Components** (`components/<group>/` — React, read via `window.PrincessDesignSystem_3d336d`)
- `buttons/` — **Button** (filled/tonal/outlined/text/danger), **IconButton**.
- `forms/` — **Input**, **Select**, **Checkbox**, **Switch**.
- `display/` — **Card**, **Badge**, **Chip**, **Avatar**.
- `status/` — **StatusChip** (PRINCE2 lifecycle + log states), **ScoreBadge** (risk severity), **LifecycleStepper**.
- `feedback/` — **EmptyState**, **Skeleton**, **Tabs**.
- `ai/` — **AISuggestionCard**, **AIAssistButton** (the AI layer's signature surfaces).

**UI kits** (`ui_kits/`)
- `princess/` — interactive recreation of the Princess app: Projects, Risk Log, Project Detail, AI Suggestions, inside the real dark-sidebar + top-bar shell.

**Foundation cards** (`guidelines/`) — specimen cards for the Design System tab: brand gradient, primary, surfaces, status, score ramp, type families & scale, spacing, radii/elevation, logo.

---

*Substitution note: Roboto, Instrument Sans and Material Icons all load from Google Fonts (matching the app). No local font binaries are bundled — if you need offline/self-hosted fonts, ask and we'll vendor them in.*
