# Saurabh Rathore — Portfolio + Admin CMS

A full-stack personal portfolio with a password-protected Admin CMS panel. Express serves all pages server-side with data injected from Replit DB.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the full site (port 8080, served at `/`)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Server: Express 5 (api-server artifact, port 8080, path `/`)
- DB: Replit DB (`@replit/database` v3) — wraps responses in `{ ok, value }`, unwrap in `lib/db.ts`
- Session: `express-session` with `SESSION_SECRET` env var
- Build: esbuild (ESM bundle via `build.mjs`)

## Where things live

- `artifacts/api-server/src/app.ts` — Express app setup, route mounting
- `artifacts/api-server/src/lib/db.ts` — Replit DB typed wrapper (unwraps `{ ok, value }` responses)
- `artifacts/api-server/src/lib/seed.ts` — seeds Aeron + Finovo on first run
- `artifacts/api-server/src/views/portfolio.ts` — homepage + case study HTML templates
- `artifacts/api-server/src/views/admin.ts` — full admin CMS HTML templates
- `artifacts/api-server/src/routes/portfolio.ts` — `GET /`, `GET /project/:slug`
- `artifacts/api-server/src/routes/admin.ts` — `GET/POST /admin/*`
- `artifacts/api-server/src/routes/apiProjects.ts` — `POST/PUT/DELETE /api/projects`, services, profile, settings
- `artifacts/portfolio/` — legacy Vite static site (now at `/portfolio-vite`, not used in production)

## Routes

| Route | Description |
|---|---|
| `GET /` | Portfolio homepage (dynamic, DB-injected) |
| `GET /project/:slug` | Case study page (dynamic) |
| `GET /admin/login` | Login page |
| `POST /admin/login` | Authenticate (rate-limited: 5 attempts / 5 min lockout) |
| `GET /admin/dashboard` | CMS overview stats |
| `GET /admin/projects` | Manage projects (drag-to-reorder, toggle visibility) |
| `GET /admin/projects/new` | Create new project |
| `GET /admin/projects/:id/edit` | Edit project |
| `GET /admin/services` | Edit service cards |
| `GET /admin/profile` | Edit about/bio/skills/contact |
| `GET /admin/settings` | Site meta + password change |
| `GET /admin/logout` | End session |
| `POST /api/projects` | Create project |
| `PUT /api/projects/:id` | Update project |
| `DELETE /api/projects/:id` | Delete project |
| `POST /api/projects/reorder` | Reorder projects |
| `PUT /api/services` | Save services |
| `PUT /api/profile` | Save profile |
| `PUT /api/settings` | Save settings |

## DB Schema (Replit DB keys)

- `"projects"` → `Project[]` array
- `"services"` → `Service[]` array
- `"profile"` → `Profile` object
- `"settings"` → `SiteSettings` object

## Environment Variables

- `SESSION_SECRET` — session signing secret (set via Replit Secrets) ✅
- `ADMIN_PASSWORD` — admin panel password (default: `admin123`, change via Settings page or Replit Secrets)

## Architecture Decisions

- `@replit/database` v3 returns `{ ok: true, value: T }` — must unwrap in `db.ts` `get()` function
- Admin HTML is server-side rendered template strings (no client framework) for simplicity
- Rate limiting is in-memory (Map) — resets on server restart, acceptable for single-server deployment
- Images stored as URLs (not base64 in DB) — max file size warning shown on upload

## Gotchas

- `@replit/database` v3 `get()` returns `{ ok: boolean, value: T }` — see `lib/db.ts` `get()` unwrap logic
- Run `pnpm --filter @workspace/api-server run dev` (not `pnpm dev` at root)
- The portfolio Vite artifact now lives at `/portfolio-vite` (not used — kept for dev reference)
- Session `secure: true` is only set in `NODE_ENV=production`

## User Preferences

_Populate as you build — explicit user instructions worth remembering across sessions._
