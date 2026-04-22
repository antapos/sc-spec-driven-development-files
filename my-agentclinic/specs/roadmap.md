# Roadmap

Small, focused phases. Each phase produces a working, committed state.

## Phase 1 — Project scaffold ✅
Add Hono, better-sqlite3, and tsx. Update `package.json` scripts. Confirm `tsc` passes. Establish responsive design baseline (viewport meta tag, fluid layout CSS) applied to the home page.

## Phase 2 — Hello server
Minimal Hono app listening on a port. One route returning plain text. Verify with `curl`.

## Phase 3 — Database setup
Initialize SQLite file. Create a `db.ts` module that opens the connection and exports it.

## Phase 4 — Agent model
`agents` table (id, name, model, status). Seed with a few sample agents.

## Phase 5 — Ailments model
`ailments` table (id, name, description). Seed with clinic-appropriate ailments.

## Phase 6 — Therapies model
`therapies` table (id, name, description, duration_minutes). Seed with sample therapies.

## Phase 7 — Appointments model
`appointments` table linking agents, ailments, and therapies with a scheduled datetime and status.

## Phase 8 — REST endpoints
CRUD routes for agents, ailments, therapies, and appointments. JSON responses.

## Phase 9 — Dashboard UI
Server-rendered HTML dashboard using Hono JSX. Lists agents and upcoming appointments.

## Phase 10 — Styling & polish
CSS for a clean, modern look. Navigation between views.
