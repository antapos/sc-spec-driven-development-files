# Roadmap

Small, focused phases. Each phase produces a working, committed state.

## Phase 1 — Project scaffold ✅
Add Hono, better-sqlite3, and tsx. Update `package.json` scripts. Confirm `tsc` passes. Establish responsive design baseline (viewport meta tag, fluid layout CSS) applied to the home page.

## Phase 2 — Server, database, and core models
Minimal Hono route returning plain text. Initialize SQLite file and create a `db.ts` module. Create `agents` table (id, name, model, status) and `ailments` table (id, name, description); seed both with sample data.

## Phase 3 — Therapies model
`therapies` table (id, name, description, duration_minutes). Seed with sample therapies.

## Phase 4 — Appointments model
`appointments` table linking agents, ailments, and therapies with a scheduled datetime and status.

## Phase 5 — REST endpoints
CRUD routes for agents, ailments, therapies, and appointments. JSON responses.

## Phase 6 — Dashboard UI
Server-rendered HTML dashboard using Hono JSX. Lists agents and upcoming appointments.

## Phase 7 — Styling & polish
CSS for a clean, modern look. Navigation between views.
