# Tech Stack

## Runtime & Language

- **Node.js** — server runtime
- **TypeScript** — language across the entire codebase (server + templates)

## Server Framework

- **Hono** — lightweight, TypeScript-first web framework
- **@hono/node-server** — Node.js adapter for Hono

## Rendering

- **Hono JSX** — server-side JSX rendering; no client-side framework
- All HTML is rendered on the server and delivered as full pages

## Database

- **SQLite** via **better-sqlite3** — embedded, file-based relational database; no separate database server required

## Styling

- **PicoCSS** — classless CSS framework loaded from CDN; semantic HTML is styled automatically with no utility classes needed

## Testing

- **Vitest** — unit and integration test runner; tests live alongside source files

## Developer Experience

- **tsx** — TypeScript execution for development (`tsx watch`) without a build step
- **tsc** — TypeScript compiler for production builds
