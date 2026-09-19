## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Commands

- `bun run check` — typecheck frontend (`astro check`); fix before pushing. It currently reports 2 errors from `prisma/seed.ts` and `src/lib/prisma.ts`: `@prisma/client` is v7 but the installed `prisma` CLI is the v8 RC Platform CLI, which no longer registers `generate`. Prisma is unused by the dashboard, so this is expected until Prisma is removed or the CLI is aligned.
- `bun run check:server` — typecheck backend (`tsc -p server/tsconfig.json`).
- `bun run dev:server` — backend de mensajería en `http://localhost:8787`.
- `bun run build` — production build.
- To test messaging end-to-end locally you need `server/` running (SQLite + SSE + webhooks).

## Roles & permissions

- `src/auth/roles.ts` — capability model (`Capability`), `DEFAULT_ROLES`, and helpers `can()`, `roleLabel()`, `resolveRoleId()`.
- `src/data/rolesStore.ts` — localStorage persistence of customized roles (`whm.roles`), with `resetRoles()` to restore defaults.
- `src/hooks/useRoles.ts` — reactive roles hook.
- UI is gated via `can(roleId, cap, roles)` in `src/components/dashboard/App.tsx` (nav items, view guards, Kitt panel, mock injection) and via `canEdit`/`canDelete` props on `CrudView`.
- Users reference roles by id in the `role` field; `LoginScreen` maps them with `resolveRoleId()`. Seeded roles (`admin`, `manager`, `picker`, `formador`, `practicas`) are merged into an existing DB without deleting custom users.
- `src/data/localStore.ts` uses `SEED_VERSION` (`whm.seed.version`) to run one-time seed merges when the seed data set changes; bump it to force a re-seed of missing rows.

## Authentication (InsForge Auth)

- `src/hooks/useAuth.ts` returns `authMode` (`insforge` | `demo`). InsForge mode activates when `PUBLIC_INSFORGE_URL` + `PUBLIC_INSFORGE_ANON_KEY` are present; otherwise the app falls back to local demo operators persisted in localStorage (`src/lib/operator.ts`).
- `src/lib/insforge.ts` — browser client singleton: `getInsForge()`, `isInsForgeConfigured()`.
- Session resolution (`resolveSession`) reads `user_metadata.name` / `user_metadata.role_id` FIRST, falling back to the `profiles` table via `auth.getProfile()` when it exists. The app works with zero Postgres setup; unknown role ids fall back to `picker` via `resolveRoleId()`.
- `register()` calls `auth.signUp()` and then `auth.setProfile({ name, role_id })`; `needsConfirmation` mirrors `requireEmailVerification`. `signInWithPassword()` writes the `sga_session` cookie that `src/middleware.ts` checks, but the middleware only verifies cookie presence, not validity.
- `LoginScreen` shows email/password with a "Sign up" toggle (name + role selector — ALL roles selectable by design, including admin; privilege-escalation risk accepted for an internal panel).
- Messaging/Kitt clients attach the JWT automatically: `src/lib/messaging.ts` and `src/lib/kit.ts` send `Authorization: Bearer`; `useMessaging` passes the token to SSE as `?token=` (EventSource can't set headers).
- `server/auth.ts` — Express middleware `requireAuth`. Enabled only when `SUPABASE_JWKS_URL` is set (validates the project JWKS via `jose`); without it all routes stay open for local dev. Protected routes are listed with `auth: true` in `ENDPOINTS` in `server/index.ts`.
- Stale references to remove on sight: `PUBLIC_SUPABASE_URL`, `src/lib/supabase.ts`, `scripts/seed-supabase.ts` and `bun run seed:supabase` no longer exist.

## Project structure

- `src/` — Dual architecture:
  - **Public Web (`.astro`)**: WordPress replacement for ESINSA. All public components MUST be written in `.astro` (zero client JS by default, high performance and SEO). Product catalog displayed as **Cards**.
  - **Protected Dashboard (`/dashboard`)**: Full warehouse management system (SGA / WMS) with table representation for inventory, orders, routes, CRM, and voice picking. React islands used strictly where stateful interactivity or browser APIs (e.g. Web Speech) are mandatory.
- `server/` — Express + Drizzle + SQLite (libSQL) messaging backend. Telegram via long-polling, WhatsApp via Cloud API webhooks, SSE hub. Typechecked separately with `server/tsconfig.json`.

## Component Guidelines: Astro vs TSX
- **Public UI**: ALWAYS use `.astro` components (`src/components/public/*.astro`, `src/layouts/*.astro`, `src/pages/*.astro`). Never create public layout or display components in `.tsx` unless client-side state is unavoidable.
- **Product Presentation**:
  - **Public Web**: Products rendered as responsive **Cards** (image/visual, specifications, standards, applications).
  - **Dashboard (SGA)**: Products rendered as **Tables** (`CrudView` with columns for SKU, name, ABC class, stock, min threshold, status, actions).
- **Dashboard Island**: Mounts under `/dashboard` route with session verification and role gating.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **astro-awesome-projects** (API base `https://5xz8euqt.ap-southeast.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->
