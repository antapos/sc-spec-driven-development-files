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
Plain CSS with a modern, clean aesthetic to satisfy marketing's requirement for an attractive, browser-compatible UI.

## Tooling
- `tsc` for type-checking and compilation
- `tsx` for local development (no build step required while iterating)
