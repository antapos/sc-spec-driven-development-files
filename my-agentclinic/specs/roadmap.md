# Roadmap

Small, focused phases. Each phase produces a working, committed state.

## Phase 1 — Project scaffold ✅
Add Hono, better-sqlite3, and tsx. Update `package.json` scripts. Confirm `tsc` passes. Establish responsive design baseline (viewport meta tag, fluid layout CSS) applied to the home page.

## Phase 2 — Server, database, models, and REST API
Minimal Hono route returning plain text. Initialize SQLite file and create a `db.ts` module. Create `agents` (id, name, model, status), `ailments` (id, name, description), `therapies` (id, name, description, duration_minutes), and `appointments` (id, agent_id, ailment_id, therapy_id, scheduled_at, status) tables; seed all with sample data. CRUD routes for all four resources returning JSON.

## Phase 3 — Dashboard UI
Server-rendered HTML dashboard using Hono JSX. Lists agents and upcoming appointments.

## Phase 4 — Styling & polish
CSS for a clean, modern look. Navigation between views.
