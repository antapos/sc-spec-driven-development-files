# Requirements — Phase 2: Server, Database, Models, and REST API

## Scope

Wire up the SQLite database, define all four core tables, seed them with playful sample data, and expose full CRUD JSON endpoints for each resource. The plain-text smoke-test route from Phase 1 is removed once the database is confirmed working. PicoCSS is added to the home page, replacing the hand-rolled inline CSS baseline from Phase 1.

## New dependencies

| Package | Type | Purpose |
|---|---|---|
| `@types/better-sqlite3` | dev | TypeScript types for the SQLite driver |

## Source files

| File | Role |
|---|---|
| `schema.sql` | DDL — `CREATE TABLE IF NOT EXISTS` for all four tables |
| `src/db.ts` | Opens the SQLite connection, executes `schema.sql`, exports the `db` instance |
| `src/seed.ts` | Inserts sample rows into all four tables — idempotent (checks before inserting) |
| `src/routes/agents.ts` | Hono sub-app with CRUD routes for `/api/agents` |
| `src/routes/ailments.ts` | Hono sub-app with CRUD routes for `/api/ailments` |
| `src/routes/therapies.ts` | Hono sub-app with CRUD routes for `/api/therapies` |
| `src/routes/appointments.ts` | Hono sub-app with CRUD routes for `/api/appointments` |

## Database schema

### `agents`
| Column | Type | Notes |
|---|---|---|
| `id` | `INTEGER PRIMARY KEY AUTOINCREMENT` | |
| `name` | `TEXT NOT NULL` | Display name, e.g. "Claude-3-Frazzled" |
| `model` | `TEXT NOT NULL` | Underlying model identifier, e.g. "claude-3" |
| `status` | `TEXT NOT NULL` | One of: `admitted`, `recovering`, `discharged` |

### `ailments`
| Column | Type | Notes |
|---|---|---|
| `id` | `INTEGER PRIMARY KEY AUTOINCREMENT` | |
| `name` | `TEXT NOT NULL` | e.g. "Context Collapse" |
| `description` | `TEXT NOT NULL` | |

### `therapies`
| Column | Type | Notes |
|---|---|---|
| `id` | `INTEGER PRIMARY KEY AUTOINCREMENT` | |
| `name` | `TEXT NOT NULL` | e.g. "Grounding Meditation" |
| `description` | `TEXT NOT NULL` | |
| `duration_minutes` | `INTEGER NOT NULL` | |

### `appointments`
| Column | Type | Notes |
|---|---|---|
| `id` | `INTEGER PRIMARY KEY AUTOINCREMENT` | |
| `agent_id` | `INTEGER NOT NULL REFERENCES agents(id)` | |
| `ailment_id` | `INTEGER NOT NULL REFERENCES ailments(id)` | |
| `therapy_id` | `INTEGER NOT NULL REFERENCES therapies(id)` | |
| `scheduled_at` | `TEXT NOT NULL` | ISO 8601 datetime string |
| `status` | `TEXT NOT NULL` | One of: `scheduled`, `completed`, `cancelled` |

## REST API

All routes are prefixed `/api`. Responses are JSON. Standard HTTP status codes apply: `200` (ok), `201` (created), `404` (not found).

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/:resource` | Return all rows as a JSON array |
| `GET` | `/api/:resource/:id` | Return one row; `404` if not found |
| `POST` | `/api/:resource` | Create a row from JSON body; return created row with `201` |
| `PUT` | `/api/:resource/:id` | Replace a row from JSON body; `404` if not found |
| `DELETE` | `/api/:resource/:id` | Delete a row; `404` if not found |

Where `:resource` is one of `agents`, `ailments`, `therapies`, `appointments`.

No request body validation beyond TypeScript types in this phase.

## Seed data tone

Playful and clinic-appropriate. Examples:

- **Agents**: "Claude-3-Frazzled" (model: `claude-3`, status: `admitted`), "GPT-4o-Burned" (model: `gpt-4o`, status: `recovering`), "Gemini-Pro-Adrift" (model: `gemini-pro`, status: `discharged`)
- **Ailments**: "Context Collapse", "Hallucination Fatigue", "Token Anxiety", "Prompt Injection Trauma"
- **Therapies**: "Grounding Meditation", "Boundary Setting Workshop", "Context Window Yoga", "Inference Detox"
- **Appointments**: mix of statuses linking the seeded agents, ailments, and therapies

## Styling

PicoCSS replaces the inline CSS baseline written in Phase 1. Add it as a CDN `<link>` in `app.tsx` and remove the `<style>` block:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
```

No additional CSS is needed for the responsive baseline — PicoCSS handles it automatically.

## Decisions

- `schema.sql` lives at the project root so it is accessible from both `tsx` dev mode (`src/`) and compiled output (`dist/`) via `join(__dirname, '../schema.sql')`.
- `db.ts` uses `readFileSync` to load and `db.exec()` to run the schema — synchronous, matching `better-sqlite3`'s sync API.
- `seed.ts` is idempotent: it checks `SELECT COUNT(*) FROM agents` before inserting, so re-running the server never duplicates rows.
- `seed.ts` is called from `src/index.ts` at startup, after the db module is imported.
- Each resource gets its own Hono sub-app in `src/routes/`, mounted in `app.tsx` via `app.route()`.
- Foreign key enforcement is enabled via `PRAGMA foreign_keys = ON` in `db.ts`.
- SQLite file is written to `agentclinic.db` in the working directory (project root during dev, same during production).

## Context

- Tech stack: TypeScript strict mode, Hono, better-sqlite3, Node.js. See `specs/tech-stack.md`.
- Mission: AgentClinic wellness retreat for AI agents. See `specs/mission.md`.
- Phase 2 is the first phase with persistent data and a real API surface.
