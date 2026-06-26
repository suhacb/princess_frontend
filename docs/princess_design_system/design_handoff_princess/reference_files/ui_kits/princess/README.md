# Princess App — UI kit

High-fidelity, interactive recreation of the **Princess** PRINCE2 project-management application (Sinecon). Built by reading the real Angular frontend (`princess_frontend`) — layout, navigation, tables and domain components are lifted from the actual source, not from screenshots.

## Run it
Open `index.html`. It loads the compiled design-system bundle (`_ds_bundle.js`) plus the screen files below.

## Screens
- **Projects** (`Projects.jsx`) — searchable, filterable project table with status chips and tolerance health dots. Click a row → project detail.
- **Risk Log** (`RiskLog.jsx`) — risk table with severity score badges, status chips, status filter + score/newest sort, and an inline **AI suggestion** proposing action on unowned risks.
- **Project Detail** (`ProjectDetail.jsx`) — header with the PRINCE2 **lifecycle stepper**, router-style tabs, and overview/tolerance cards.
- **AI Suggestions** (`AISuggestions.jsx`) — the AI surface: Princess proposes actions across the project, each an actionable card with a source-context link.
- Other nav destinations render a labelled placeholder (the product map is larger than the built screens).

## Chrome
- `Sidebar.jsx` — dark navy navigation (`#0d1520`) with the brand gradient accent line, grouped nav (Overview / Project / Planning / Logs / Reports / AI).
- `TopBar.jsx` — logo, command-style search (⌘K), Ask-Princess, notifications, avatar.

## Composition
Screens compose the published primitives from `window.PrincessDesignSystem_3d336d` — `Button`, `Input`, `Select`, `StatusChip`, `ScoreBadge`, `LifecycleStepper`, `Tabs`, `Card`, `Badge`, `Avatar`, `EmptyState`, `AISuggestionCard`, `AIAssistButton`. App-specific layout (shell, tables, page headers) lives in `index.html`. Mock data is in `data.js`.

> Recreation, not production code — interactions are simulated client-side. Faithfully matches the source app's structure and Material 3 azure theme.
