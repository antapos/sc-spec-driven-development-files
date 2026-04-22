# Validation — Phase 1: Project Scaffold

## Definition of done

Phase 1 is complete and ready to merge when all criteria below pass.

## Criteria

| # | Check | Command | Expected result |
|---|---|---|---|
| 1 | TypeScript compiles | `npm run build` | Exits 0, no errors or warnings |
| 2 | Server starts | `npm run dev` | Process starts without errors, prints listening message |
| 3 | Home page responds | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` | `200` |
| 4 | Home page content | `curl -s http://localhost:3000/ \| grep -i AgentClinic` | At least one match |

Criteria 2–4 require the dev server to be running. Stop it after validation.

## Out of scope

- No unit tests — this phase adds no logic beyond routing.
- No CSS, assets, or design — the page is a plain HTML skeleton.
- Dependency resolution is implicitly validated by `tsc` finding Hono's types.
