# Requirements — Phase 1: Project Scaffold

## Scope

Install runtime dependencies (Hono, better-sqlite3) and dev tooling (tsx, vitest), wire up the standard npm scripts, and deliver a home page with a passing test suite.

## Dependencies to install

| Package | Type | Purpose |
|---|---|---|
| `hono` | runtime | Web framework |
| `better-sqlite3` | runtime | SQLite driver |
| `@hono/node-server` | runtime | Node.js HTTP adapter for Hono |
| `tsx` | dev | Zero-build local development |
| `vitest` | dev | Test runner |

## Package.json scripts

```json
"dev":   "tsx watch src/index.ts",
"build": "tsc",
"start": "node dist/index.js",
"test":  "vitest run"
```

## Source files

| File | Role |
|---|---|
| `src/app.tsx` | Defines and exports the Hono `app` instance — importable by tests |
| `src/index.ts` | Server entry point — imports `app` and calls `serve()` on port 3000 |
| `src/app.test.ts` | Vitest tests for all routes defined in `app.tsx` |
| `src/components/header.tsx` | `Header` JSX component — site header rendered on every page |
| `src/components/footer.tsx` | `Footer` JSX component — site footer rendered on every page |
| `src/components/main.tsx` | `Main` JSX component — wraps the per-page body content |

The split between `app.ts` and `index.ts` is required so tests can import the app without starting a real HTTP server. Components are `.tsx` files using Hono's JSX support and composed inside route handlers.

## Home page

| Property | Value |
|---|---|
| Route | `GET /` |
| Response | `200 OK`, `Content-Type: text/html` |
| Required content | HTML page with title and `<h1>` both set to **AgentClinic** |
| Server | `@hono/node-server`, port **3000** |

The page content is intentionally minimal — no CSS, no assets. Purpose is to confirm the server starts and serves a real response.

## Decisions

- App logic lives in `src/app.ts`, not `src/index.ts`, so tests can import the app without side effects.
- UI is split into three component files (`header.tsx`, `footer.tsx`, `main.tsx`) so each structural region can evolve independently across phases.
- Components use Hono's built-in JSX support (`hono/jsx`); `tsconfig.json` must set `"jsx": "react-jsx"` and `"jsxImportSource": "hono/jsx"`. Test files are excluded from `tsc` compilation (they are not emitted to `dist/`) — Vitest transpiles them independently.
- No `src/db.ts` or database initialisation in this phase.
- No `@types/better-sqlite3` required by scope (can be added in Phase 3 if tsc complains).
- `@hono/node-server` is the only way to call `serve()` in Node.js; it is a separate package (not bundled with `hono`).
- Tests use `app.request()` — Hono's built-in test helper — so no real HTTP server or port binding is needed in tests.

## Context

- Tech stack: TypeScript strict mode, Node.js, Hono, SQLite via better-sqlite3. See `specs/tech-stack.md`.
- Mission: AgentClinic wellness retreat for AI agents. See `specs/mission.md`.
- Phase 1 ends with a running server that renders a visible page — the first thing a user would see.
