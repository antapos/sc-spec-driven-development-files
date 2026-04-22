# Roadmap

Each phase is intentionally small — one focused concern, shippable on its own.

## Phase 1 — Project Scaffold ✓
Set up the repo with the full tech stack wired together and a minimal home page to prove it works.
- Hono server with @hono/node-server
- TypeScript + tsx dev workflow + tsc build
- SQLite database connection via better-sqlite3
- Vitest test suite
- Hono JSX home page with header, main, footer components
- PicoCSS loaded for baseline responsive styling

## Phase 2 — Database, Models, and REST API ✓
Define the data model and expose it over HTTP so the app has a working backend.
- Schema: agents, ailments, therapies, appointments
- Seed script with sample data
- REST routes: CRUD for agents, ailments, therapies, appointments
- Integration tests for all routes

## Phase 3 — Dashboard UI
Add server-rendered listing pages so users can see the clinic's data in a browser.
- Agents list page
- Ailments list page
- Therapies list page
- Appointments list page with agent name and therapy name resolved

## Phase 4 — Appointment Booking Flow
Let a user (or agent) book an appointment through the UI.
- Booking form: select agent, ailment, therapy, date/time
- POST handler that writes to the database and redirects
- Confirmation view

## Phase 5 — Agent Detail and Status Flow
Give each agent a dedicated page and allow status transitions.
- Agent detail page showing their appointments and current status
- Status update: admitted → recovering → discharged
- Link from the agents list to each detail page

## Phase 6 — Demo Polish
Final touches to make the app presentable for course demos and conference booths.
- Error pages (404, 500) with clinic-themed copy
- Empty-state messages on list pages
- Navigation between all pages
- Rich seed data: memorable agent names, amusing ailments and therapies
