# Plan — Phase 2: Server, Database, Models, and REST API

## Group 1 — Install dev dependency

1. Install `@types/better-sqlite3` as a dev dependency: `npm install --save-dev @types/better-sqlite3`

## Group 2 — Define schema

2. Create `schema.sql` at the project root with `CREATE TABLE IF NOT EXISTS` statements for all four tables: `agents`, `ailments`, `therapies`, `appointments`.
3. Enable foreign key support at the schema level with `PRAGMA foreign_keys = ON`.

## Group 3 — Create src/db.ts

4. Create `src/db.ts`:
   - Import `Database` from `better-sqlite3` and `readFileSync` / `join` from Node built-ins.
   - Open the database at `agentclinic.db` in the working directory.
   - Execute `schema.sql` via `db.exec(readFileSync(join(__dirname, '../schema.sql'), 'utf-8'))`.
   - Export the `db` instance as the default export.

## Group 4 — Create src/seed.ts

5. Create `src/seed.ts`:
   - Import `db` from `./db`.
   - Check `SELECT COUNT(*) FROM agents` — if count is 0, insert all seed rows for agents, ailments, therapies, and appointments.
   - Use playful, clinic-appropriate names (see requirements for examples).
   - Export a `seed()` function.

## Group 5 — Call seed at startup

6. In `src/index.ts`, import and call `seed()` before `serve()`.

## Group 6 — Add PicoCSS and remove inline CSS baseline

7. In `src/app.tsx`, replace the inline `<style>` block with a PicoCSS CDN `<link>`:
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
   ```
8. Remove the inline `<style>` block (PicoCSS provides the responsive baseline).

## Group 7 — Remove plain-text smoke-test route

9. Remove any plain-text GET route from `src/app.tsx` added in Phase 1 (if present — Phase 1's route was the home page, not plain text, so verify and skip if not applicable).

## Group 8 — Create resource route files

10. Create `src/routes/agents.ts` — Hono sub-app with five routes: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`. Use `db` for all queries.
11. Create `src/routes/ailments.ts` — same structure.
12. Create `src/routes/therapies.ts` — same structure.
13. Create `src/routes/appointments.ts` — same structure.

## Group 9 — Mount routes in app.tsx

14. In `src/app.tsx`, import each route sub-app and mount with `app.route('/api/agents', agents)`, and so on for the other three resources.

## Group 10 — Write Vitest tests

15. Create `src/routes/agents.test.ts` with tests covering:
    - `GET /api/agents` returns `200` and a JSON array.
    - `GET /api/agents/:id` returns `200` for a seeded agent and `404` for a missing one.
    - `POST /api/agents` with a valid body returns `201` and the created agent.
    - `PUT /api/agents/:id` updates and returns the agent.
    - `DELETE /api/agents/:id` returns `200` and removes the record.
16. Create equivalent test files for ailments, therapies, and appointments.

## Group 11 — Verify

17. Run `npm run build` — exits 0, no type errors.
18. Run `npm test` — all tests pass.
19. Commit.
