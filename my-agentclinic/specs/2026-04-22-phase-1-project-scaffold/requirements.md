# Requirements — Phase 1: Project Scaffold

## Scope

Install the three runtime dependencies (Hono, better-sqlite3, tsx) and wire up the standard npm scripts so the project has a working dev/build/start lifecycle. No application logic is added in this phase.

## Dependencies to install

| Package | Type | Purpose |
|---|---|---|
| `hono` | runtime | Web framework |
| `better-sqlite3` | runtime | SQLite driver |
| `tsx` | dev | Zero-build local development |

## Package.json scripts

```json
"dev":   "tsx watch src/index.ts",
"build": "tsc",
"start": "node dist/index.js"
```

## Entry point

`src/index.ts` — must be a real Hono application (not a stub) that passes `tsc` strict-mode checks.

## Home page

| Property | Value |
|---|---|
| Route | `GET /` |
| Response | `200 OK`, `Content-Type: text/html` |
| Required content | HTML page with title and `<h1>` both set to **AgentClinic** |
| Server | `@hono/node-server`, port **3000** |

The page content is intentionally minimal — no CSS, no assets. Purpose is to confirm the server starts and serves a real response.

## Decisions

- Entry point lives at `src/index.ts` (not project root `index.ts`).
- No `src/db.ts` or database initialisation in this phase.
- No `@types/better-sqlite3` required by scope (can be added in Phase 3 if tsc complains).
- `@hono/node-server` is the only way to call `serve()` in Node.js; it is a separate package (not bundled with `hono`).

## Context

- Tech stack: TypeScript strict mode, Node.js, Hono, SQLite via better-sqlite3. See `specs/tech-stack.md`.
- Mission: AgentClinic wellness retreat for AI agents. See `specs/mission.md`.
- Phase 1 ends with a running server that renders a visible page — the first thing a user would see.
