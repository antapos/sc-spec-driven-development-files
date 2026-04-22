# Plan — Phase 1: Project Scaffold

## Group 1 — Install dependencies

1. Install runtime deps: `npm install hono @hono/node-server better-sqlite3`
2. Install dev deps: `npm install --save-dev tsx vitest`

## Group 2 — Update package.json scripts

3. Replace the existing `scripts` block with `dev`, `build`, `start`, and `test` entries:
   - `"dev": "tsx watch src/index.ts"`
   - `"build": "tsc"`
   - `"start": "node dist/index.js"`
   - `"test": "vitest run"`

## Group 3 — Create src/app.ts

4. Create `src/app.ts`:
   - Import `Hono` and create an `app` instance.
   - Add a `GET /` route returning a minimal HTML response with the page title and `<h1>` both set to **AgentClinic**.
   - Export `app`.

## Group 4 — Wire up src/index.ts as server entry point

5. Replace `src/index.ts` with a file that imports `app` from `./app` and calls `serve({ fetch: app.fetch, port: 3000 })`.

## Group 5 — Write Vitest tests

6. Create `src/app.test.ts` with tests for `GET /`:
   - Status is `200`.
   - Response body contains `AgentClinic`.

## Group 6 — Verify

7. Run `npm run build` and confirm it exits 0 with no type errors.
8. Run `npm test` and confirm all tests pass.
9. Commit.
