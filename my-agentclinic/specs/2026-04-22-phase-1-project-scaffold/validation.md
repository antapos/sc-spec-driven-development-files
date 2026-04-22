# Validation — Phase 1: Project Scaffold

## Definition of done

Phase 1 is complete and ready to merge when all criteria below pass.

## Criteria

| # | Check | Command | Expected result |
|---|---|---|---|
| 1 | TypeScript compiles | `npm run build` | Exits 0, no errors or warnings |
| 2 | Tests pass | `npm test` | All tests pass, exit 0 |

## Out of scope

- No manual curl smoke-test required — route behaviour is covered by the Vitest suite.
- No CSS, assets, or design — the page is a plain HTML skeleton.
- Dependency resolution is implicitly validated by `tsc` finding Hono's types.
