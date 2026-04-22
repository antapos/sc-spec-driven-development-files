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

## Group 3 — Configure tsconfig.json for JSX

4. Add JSX compiler options to `tsconfig.json`:
   - `"jsx": "react-jsx"`
   - `"jsxImportSource": "hono/jsx"`
5. Add an `exclude` array to `tsconfig.json` to omit test files from the compiled `dist/` output:
   - `"src/**/*.test.ts"`, `"src/**/*.test.tsx"`, `"node_modules"`

## Group 4 — Create UI components

5. Create `src/components/header.tsx` — exports a `Header` component.
6. Create `src/components/footer.tsx` — exports a `Footer` component.
7. Create `src/components/main.tsx` — exports a `Main` component that wraps per-page body content.

## Group 5 — Create src/app.tsx

8. Create `src/app.tsx`:
   - Import `Hono` and create an `app` instance.
   - Add a `GET /` route that composes `Header`, `Main`, and `Footer` into a full HTML page with title **AgentClinic**.
   - Export `app`.

## Group 6 — Wire up src/index.ts as server entry point

9. Replace `src/index.ts` with a file that imports `app` from `./app` and calls `serve({ fetch: app.fetch, port: 3000 })`.

## Group 7 — Write Vitest tests

10. Create `src/app.test.ts` with tests for `GET /`:
    - Status is `200`.
    - Response body contains `AgentClinic`.

## Group 8 — Verify

11. Run `npm run build` and confirm it exits 0 with no type errors.
12. Run `npm test` and confirm all tests pass.
13. Commit.
