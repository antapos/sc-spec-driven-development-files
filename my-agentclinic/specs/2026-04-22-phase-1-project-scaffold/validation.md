# Validation — Phase 1: Project Scaffold

## Definition of done

Phase 1 is complete and ready to merge when all criteria below pass.

## Criteria

| # | Check | Command | Expected result |
|---|---|---|---|
| 1 | TypeScript compiles | `npm run build` | Exits 0, no errors or warnings |
| 2 | Tests pass | `npm test` | All tests pass, exit 0 |

Tests must cover:
- `GET /` returns `200`
- Response body contains `AgentClinic`
- Response body contains the viewport meta tag (`width=device-width`)

## Out of scope

- No manual curl smoke-test required — route behaviour is covered by the Vitest suite.
- Visual appearance (colours, typography, spacing) is deferred to a later phase.
- Dependency resolution is implicitly validated by `tsc` finding Hono's types.
