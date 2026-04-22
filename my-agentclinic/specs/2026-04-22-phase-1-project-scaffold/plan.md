# Plan — Phase 1: Project Scaffold

## Group 1 — Install dependencies

1. Install runtime deps: `npm install hono better-sqlite3`
2. Install dev dep: `npm install --save-dev tsx`

## Group 2 — Update package.json scripts

3. Replace the existing `scripts` block with `dev`, `build`, and `start` entries:
   - `"dev": "tsx watch src/index.ts"`
   - `"build": "tsc"`
   - `"start": "node dist/index.js"`

## Group 3 — Ensure src/index.ts is valid TypeScript

4. Confirm (or update) `src/index.ts` so it is a minimal valid TypeScript file that compiles cleanly under strict mode. A stub export or a single `console.log` is sufficient.

## Group 4 — Verify

5. Run `npm run build` and confirm it exits 0 with no type errors.
6. Commit: `feat: phase 1 — project scaffold (hono, better-sqlite3, tsx)`
