# Tech Stack

## Language
TypeScript (strict mode) throughout — server and any shared types.

## Runtime
Node.js

## Framework
**Hono** — recommended for its TypeScript-first API, minimal overhead, and excellent developer experience. Runs natively on Node.js and is well-suited for building dashboards and REST endpoints.

## Database
SQLite via `better-sqlite3` — simple, file-based, zero infrastructure. Sufficient for the clinic's data needs.

## Frontend
Server-rendered HTML using Hono's JSX support. No separate frontend framework — keeps the stack unified and deployable as a single Node.js process.

## Styling
Plain CSS. Responsive design is a baseline requirement — all pages must adapt to mobile, tablet, and desktop viewports. Every page includes the viewport meta tag and uses fluid-width containers so no layout breaks on small screens. More elaborate visual polish is added in later phases.

## Testing
**Vitest** — used for all automated tests. Co-located with source files or in a `tests/` directory. Run via `npm test`.

## Tooling
- `tsc` for type-checking and compilation
- `tsx` for local development (no build step required while iterating)
- `vitest` for test execution
