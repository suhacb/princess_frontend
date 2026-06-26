---
name: princess-design
description: Use this skill to generate well-branded interfaces and assets for Princess — Sinecon's PRINCE2 project-management platform — either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- **Brand:** azure gradient (`#4561A2 → #4EB9EA`), cool-neutral Material 3 surfaces, deep navy app sidebar (`#0D1520`). Calm, precise, governance-grade. No emoji.
- **Type:** Roboto (body/data) + Instrument Sans (UI chrome/headings); Material Icons for iconography. All from Google Fonts.
- **Domain:** PRINCE2 — projects, stages, tolerances, and risk/issue/change/quality/lessons logs. Use the vocabulary precisely (README → Content fundamentals).
- **AI layer:** always marked with the brand gradient + `auto_awesome`; it *proposes*, never silently acts.
- **Tokens:** link `styles.css` for all CSS custom properties (`--mat-sys-*`, `--brand-*`, status colors, spacing, radii, elevation).
- **Components:** React, exposed on `window.PrincessDesignSystem_<hash>` once `_ds_bundle.js` is loaded (run `check_design_system` for the exact namespace). See `components/*/` and their `.prompt.md` files.
- **UI kit:** `ui_kits/princess/` is a working reference for the full app shell and real screens.
