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

`src/index.ts` — already exists as a stub. Must be valid TypeScript that passes `tsc` strict-mode checks.

## Decisions

- Entry point lives at `src/index.ts` (not project root `index.ts`).
- No `src/db.ts` or database initialisation in this phase.
- No `@types/better-sqlite3` required by scope (can be added in Phase 3 if tsc complains).

## Context

- Tech stack: TypeScript strict mode, Node.js, Hono, SQLite via better-sqlite3. See `specs/tech-stack.md`.
- Mission: AgentClinic wellness retreat for AI agents. See `specs/mission.md`.
- This phase is purely infrastructure — nothing visible to users.
