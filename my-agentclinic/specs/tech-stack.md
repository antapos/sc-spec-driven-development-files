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
**PicoCSS** — minimal semantic CSS framework. Provides responsive design, a sensible CSS reset, typography, and basic UI components (forms, buttons, cards) out of the box with no class names required on semantic HTML. Loaded via CDN `<link>` in every page `<head>`.

Responsive design is a baseline requirement — all pages must include the viewport meta tag and render correctly across mobile, tablet, and desktop viewports. PicoCSS satisfies the fluid-layout and box-model requirements automatically.

## Testing
**Vitest** — used for all automated tests. Co-located with source files or in a `tests/` directory. Run via `npm test`.

## Tooling
- `tsc` for type-checking and compilation
- `tsx` for local development (no build step required while iterating)
- `vitest` for test execution
