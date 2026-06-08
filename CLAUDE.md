# Princess Frontend — Claude Guidelines

## Project Overview
Angular SPA for PRINCE2 project management. Connects to a Laravel REST API backend at `http://localhost:10105/api`. Auth via a custom Keycloak wrapper (`auth_backend` / `auth_frontend`) — do NOT use `keycloak-js` or `angular-auth-oidc-client` directly.

## Core Architecture
- **Framework:** Angular 18+ with standalone components and signals (no NgModules)
- **UI System:** Highly customized Angular Material 3 (M3)
- **State:** Angular Signals for all reactive state; NGRX Signals Store for cross-component auth state
- **Style Format:** Component-scoped SCSS. Avoid global styles.

## Style & Customization Rules
- NEVER use generic Material colors. Use our explicit design system tokens.
- All primary overrides must reference our theme map variables found in `src/styles/_theme-vars.scss`.
- NEVER use `::ng-deep` globally. If a Material overlay panel (like a `mat-dialog` or `mat-menu`) requires custom styling, use the component's `panelClass` property and style it cleanly inside `src/styles/overlays.scss`.
- Use Angular Signals for all UI/UX responsive layouts and view state transitions.

## Verification Workflow
- Before declaring a UI component complete, run the integrated Playwright tool to visually render the layout. Check for clipping or overlay alignment bugs.

## Auth Integration
- Login flow: redirect to `http://localhost:9020/login?appName=princess&appUrl=http://localhost:10100`
- Tokens returned via `/callback` query params and stored in `localStorage`
- Every HTTP request must include: `Authorization: Bearer {token}`, `X-Refresh-Token`, `X-Application-Name: princess`, `X-Client-Url: http://localhost:10100`
- Token validation on every route change via `AuthGuard` → `GET /api/auth/validate-access-token`
- Mirror `AuthStore`, `AuthGuard`, and `appHeadersInterceptor` patterns from `../auth_frontend`

## Docker
- Docker Compose config: `../../docker-compose/princess_frontend/docker-compose.yml`
- Start dev server: `cd ../../docker-compose/princess_frontend && docker compose up`
- Run npm commands (install, build, test): use the `npm` service — e.g. `docker compose run --rm npm install`
- Source code is mounted at the container's app dir; changes reflect immediately in the dev server

## Environment
- Frontend dev server: `http://localhost:10100` (Docker, Angular dev server on internal :4200)
- Backend API: `http://localhost:10105/api`
- Auth backend: `http://localhost:9025` (auth_backend)
- Auth frontend: `http://localhost:9020` (auth_frontend)
