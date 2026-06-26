# Handoff: Princess "Cockpit" UI architecture → Angular frontend

## Overview
This package describes a **redesign of the Princess app's UI architecture** — codenamed **Cockpit** — and how to implement it in the existing **`princess_frontend` Angular app** (Angular 18+, standalone components + signals, Angular Material 3 azure-blue, component-scoped SCSS).

Princess is a PRINCE2 project-management platform (Sinecon). The redesign is **project-first, role-aware, document-linked, and AI-native**. It does not change the brand or the component library — it changes the *shell, navigation model, role behaviour, and where AI lives*.

> **Read this with the design-system handoff.** Component-level values (colors, type, spacing, every primitive) are fully tabulated in **`../design_handoff_princess/README.md`**. This document covers only the *architecture* layered on top of those components. Use both.

## About the design files
The files in `reference_files/` are **design references authored in HTML + React (JSX)** — runnable prototypes that demonstrate the intended structure, states, and behaviour. **They are not production code to copy.** The task is to **recreate the architecture in the Angular app** using its established patterns: Angular Material 3, the app's `_theme-vars.scss` token map, signals for state, a router for navigation, and component-scoped SCSS (per `princess_frontend/CLAUDE.md`).

### How to pick up the design system
The design system is the root of *this* project (the project that contains this handoff folder):
- **Tokens** — `tokens/*.css` (color, typography, spacing, elevation, fonts). The `--mat-sys-*` values come from Angular Material's generated azure-blue theme; the `--brand-*`, `--status-*`, and `--score-*` values are hand-picked Sinecon additions to add to `_theme-vars.scss`.
- **Components** — `components/<group>/<Name>.jsx` + `<Name>.d.ts` (props contract). 18 primitives: `Button`, `IconButton`, `Input`, `Select`, `Checkbox`, `Switch`, `Card`, `Badge`, `Chip`, `Avatar`, `StatusChip`, `ScoreBadge`, `LifecycleStepper`, `EmptyState`, `Skeleton`, `Tabs`, `AISuggestionCard`, `AIAssistButton`.
- **Visual language** — `readme.md` at the project root documents voice, color, type, spacing, iconography.
- **Compiled bundle** — `_ds_bundle.js` exposes every component on `window.PrincessDesignSystem_3d336d`; the prototype consumes it directly.

In the Angular app, these already exist as Material components + standalone components — **reuse them**, don't rebuild. The Cockpit work is mostly *layout, routing, role-gating, and the AI dock*, not new primitives.

## Fidelity
**Low-fidelity for novel surfaces, high-fidelity for reused ones.** The shell, role logic, and AI dock are *new architectural patterns* — treat the prototype as the spec for **structure, behaviour, and information hierarchy**, and apply the existing Princess design system for exact styling. Every reused primitive (tables, chips, score badges, cards, AI cards) is already hi-fi in the design system; match those pixel-for-pixel.

---

## Core principles (the "why")

1. **Project context is the root of the app.** Every API call requires a project ID. So a project is chosen first; everything else is viewed *through* the active project. The only cross-project surface is the Portfolio.
2. **Role re-prioritises, it doesn't just hide.** Project Manager, PMO, and Team Manager get materially different homes, navigation, and permissions over the *same* project data.
3. **Relationships are first-class.** Risk → Issue → Change → Document chains are shown and navigable from list rows and item detail.
4. **Documents link to any item.** Every log item can carry one or more linked documents, shown inline with provenance.
5. **AI proposes, never acts.** Four AI surfaces (Insight, PRINCE2 Guidance, Chat, Proposals) are unified in one persistent dock; every action is accept / edit / dismiss and reversible.

---

## Navigation model

```
┌──────────── Top bar (64px) ───────────────────────────────────────────────┐
│ logo · [Project switcher ▾] · [⌘K search] · Viewing-as role · Ask Princess │
├────────────┬──────────────────────────────────────────┬───────────────────┤
│ Sidebar    │ Content (router outlet)                   │ AI dock (optional) │
│ 260px navy │ max-width 1180, padded 26/30              │ 344px, toggleable  │
│            │                                           │                    │
│ Project    │                                           │                    │
│ picker     │                                           │                    │
│ ──────     │                                           │                    │
│ Overview   │                                           │                    │
│ Logs       │                                           │                    │
│ Reports    │                                           │                    │
│ Documents  │                                           │                    │
│ ──────     │                                           │                    │
│ All proj.  │                                           │                    │
│ Settings   │                                           │                    │
└────────────┴──────────────────────────────────────────┴───────────────────┘
```

- **Two ways into project context:** the **top-bar switcher** (jump projects without losing your place) and the **project picker pinned at the top of the sidebar** (opens the same switcher panel). Both set the active project ID.
- **Portfolio** is the only route *without* a project context. When no project is selected, the sidebar shows an account-level rail (All projects / My projects / Templates / Archive / People & roles); selecting a project routes to its Project Home.
- **⌘K command palette** spans items, documents, relationships, and AI questions — all scoped to the active project.
- **Route guard:** if a role has no access to a route (e.g. a Team Manager opening Reports), redirect to Project Home. Implement as an Angular route guard keyed on the active role.

### Routes (suggested)
| Route | Screen | Roles |
|---|---|---|
| `/projects` | Portfolio (all projects) | all |
| `/p/:id/home` | Project Home (role-aware) | all |
| `/p/:id/plan` | Plan & stages | pm, pmo |
| `/p/:id/risks` | Risk Log | all |
| `/p/:id/risks/:riskId` | Item detail (relationships + docs) | all |
| `/p/:id/issues` `/changes` `/quality` `/lessons` | Logs | pm, pmo (Team Manager: risks + issues only) |
| `/p/:id/reports/highlight` `/exceptions` | Reports | pm, pmo |
| `/p/:id/documents` | Document library | all |
| `/p/:id/settings` | Project configurator | pm, pmo (spec TBD — not yet designed) |

---

## Roles

Three roles in this pass. Role is a global app state (a signal) that re-renders the shell and screens; in production it derives from the user's assignment on the active project.

| Role | Home focus | Navigation | Permissions |
|---|---|---|---|
| **Project Manager (pm)** | Delivery KPIs (stage tolerance, open risks, my actions, reports due), risks needing attention, AI "for you today" | Full | Read/write all logs, raise & triage, produce reports |
| **Project Support / PMO (pmo)** | Governance health, overdue reports, stage gates, assurance checklist | Full minus delivery-edit | Read-mostly; assurance flags; gate control; sees reports |
| **Team Manager (tm)** | Their single work package + checklist + raise-to-PM actions | Home, Risk Log, Issue Log, Documents only | Raise risks/issues up to the PM; no reports, no other teams, no cross-project |

Role is selected in the prototype via the top-bar "Viewing as" segmented control (a design affordance for review; in production it is the user's actual role).

---

## Screens

### 1. Portfolio (Portfolio.jsx)
**Purpose:** the only cross-project view; choose a project to enter its workspace.
**Layout:** page header (title + count + Filters + New project), an AI portfolio-level suggestion card, then a bordered table card.
**Table columns:** health dot (ok/warn/danger) · Project (name + "Exec · reference") · Stage (`StatusChip`) · Open risks · Tolerance (Within / Near limit / Exception chip) · Updated · chevron.
**Behaviour:** clicking a row sets the active project and routes to Project Home. An over-tolerance project (Exception) is flagged in the row and called out by the AI card.

### 2. Project Home — role-aware (`Home.jsx`)
**Purpose:** the landing inside a project; the dashboard differs entirely by role.
- **PM:** 4 KPI tiles (Stage tolerance +8d, Open risks 8, My actions 5, Reports due 1) → 2-column: "Risks needing you" mini-table (score badge + title + ref/owner, click → item detail) and a stack of AI "for you today" + Stage tolerance bars.
- **PMO:** 4 governance KPI tiles → Assurance checklist card (check/error rows) + AI assurance suggestion.
- **TM:** "My work package" card (name, due, tolerance chip) → 2-column: My checklist + Raise-to-PM actions (Raise issue / Raise risk).

### 3. Risk Log (`RiskScreens.jsx` → RiskLog)
**Purpose:** a project-scoped log; the canonical list pattern for all logs.
**Layout:** page header (title + count + Ask Princess + Raise risk) → inline `AISuggestionCard` (unowned-risk proposal) → filter row (Status `Select` + score/newest segmented control) → bordered table card.
**Columns:** `ScoreBadge` · Risk (title + "ref · P×I · response") · Owner (or "Unowned" in warning color) · Status (`StatusChip`) · **Relationships** (link chips: →issue, →change, →stage, + doc count) · chevron.
**Behaviour:** row click → item detail. The relationship chips and document count are the key new affordance — they make the data model legible from the list.

### 4. Item detail — relationships & documents (`RiskScreens.jsx` → ItemDetail)
**Purpose:** the hub view of a single item; the heart of the relationship model.
**Layout:** back link → header (eyebrow "Risk · R-016", title, score badge + status) → 2-column (1.4fr / 1fr):
- **Left:** "Description & response" card (body + Response/Proximity/Category/Owner meta row) and "Related items" card with a **relationship map** (Risk → Issue → Change nodes, focused node highlighted; "Also linked" chips for Stage / Lesson).
- **Right:** "Linked documents" card (tertiary-tinted; doc rows with icon/name/added-date + "Link document") and an `AISuggestionCard` with **PRINCE2 guidance** ("Score 16 should trigger an exception assessment").

### 5. Plan & stages (`Stages.jsx`)
**Purpose:** the PRINCE2 lifecycle; where tolerances live and exceptions are born.
**Layout:** `LifecycleStepper` card → 2-column (Stage tolerances with progress bars / Work packages tied to Team Managers) → Stage timeline (simple gantt) → AI forecast suggestion.
**Key idea:** breaching a tolerance band triggers an Exception, linked straight to the originating risk (connects to screen 4).

### 6. AI dock (`AIDock.jsx`)
**Purpose:** all four AI surfaces in one persistent, context-aware right rail. Toggled by "Ask Princess"; collapsed by default.
**Tabs:** **Insight** (quick, per-context — what this means / why it matters) · **Guidance** (PRINCE2 "what to do" with numbered steps) · **Chat** (free Q&A with suggestion chips) · **Proposals** (actionable drafts with Generate/Apply + Dismiss).
**Header:** "Princess" + a context line ("R-016 · Tender delay…" or the current screen). **Footer:** an always-present ask input.
**Rule:** every proposal is reversible; applying shows a toast ("Applied — you can undo from the activity log"). Nothing writes silently.

### 7. Command palette (`Overlays.jsx` → Palette)
**Purpose:** ⌘K primary mover. Grouped results: Items, Documents, Follow relationship, Ask Princess, Actions — all scoped to the active project.

### 8. Project switcher (`Overlays.jsx` → Switcher)
Anchored panel listing projects with health dot, stage, tolerance chip; sets active project. Footer: All projects / New project.

---

## Interactions & behaviour
- **Set project context:** switcher or sidebar picker → set active project id (signal) → route to `/p/:id/home`.
- **Switch role:** "Viewing as" control → set role signal → shell + screen re-render; route guard redirects if the current route is now disallowed.
- **Open AI dock:** Ask Princess toggles a 344px right column; content is keyed to the current route/item (context-aware).
- **Open item:** any score-badge/title row → item detail route.
- **⌘K / Ctrl+K:** open palette; Esc closes palette and switcher.
- **Motion:** Material standard easing `cubic-bezier(0.4,0,0.2,1)` at 200ms; toggles 120ms; respect `prefers-reduced-motion`. No bounces.

## State management (signals)
- `activeProjectId` — drives all data fetching (the project ID every endpoint needs).
- `role` — `'pm' | 'pmo' | 'tm'`; gates nav, home variant, permissions.
- `aiDockOpen` + `aiDockTab` + `aiDockContext` ({ route, item }).
- `paletteOpen`, `switcherOpen`.
- Per-screen: filters/sort (Risk Log), selected item (detail).

## Design tokens
Use the design system as the single source of truth — see `tokens/*.css` in the project root and the full table in `../design_handoff_princess/README.md`. Architecture-specific layout values used by the prototype:
- Sidebar `260px` (navy `#0d1520`, 2px brand-gradient top rule); top bar `64px`; AI dock `344px`; content max-width `1180px`, padding `26px 30px`.
- Health dots: ok `#2e7d32`, warn `#f57c00`, danger `#ba1a1a`.
- AI surfaces use `--brand-gradient-diagonal` marks and `--brand-azure-*` accents; AI cards have a 3px left border in `--brand-azure-2`.

## Assets
- `assets/logo.svg` — Sinecon wordmark + swoosh (already in the project).
- Icons: Google **Material Icons** ligature font (loaded from Google Fonts; the Angular app already does this). No bespoke SVG icons.

## Files in this bundle
- `reference_files/cockpit.html` — the hi-fi Cockpit prototype as a **single self-contained file** (React, the compiled component bundle, all screens, and the app shell are inlined; opens offline). This is the runnable design reference for the architecture below.
- `reference_files/UI Architecture Storyboard.html` — the low-fi storyboard exploring two architectures (Direction A "Cockpit" was chosen; Direction B "Context Canvas" is included for rationale and as a source of power-user patterns to layer in later).
- `reference_files/tokens/` — the design-system token CSS (color, type, spacing, elevation, fonts).
- `reference_files/readme.md` — the design-system visual-language documentation.

> The editable source of the prototype lives in the design-system project at `explorations/cockpit/` (`data.js` = mock data; `Shell.jsx`, `AIDock.jsx`, `Portfolio.jsx`, `Home.jsx`, `RiskScreens.jsx`, `Stages.jsx`, `Overlays.jsx` = screens; `index.html` = shell CSS + app composition). `cockpit.html` here is the compiled, self-contained mirror.

## Not yet designed
- **Project configurator** (`/p/:id/settings`) — per-project settings beyond tolerances. The spec is not yet defined; this is the next design task. Build the route as a placeholder.
- Issue/Change/Quality/Lessons logs reuse the Risk Log pattern; only Risk Log is built out in the prototype.
- Reports (Highlight/Exception) screens are stubbed.
