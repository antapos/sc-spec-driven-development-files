# Validation — Phase 1: Project Scaffold

## Definition of done

Phase 1 is complete and ready to merge when the single criterion below passes.

## Criterion

| Check | Command | Expected result |
|---|---|---|
| TypeScript compiles | `npm run build` | Exits 0, no errors or warnings |

## Out of scope

- Runtime smoke-test (`npm run dev` / `npm start`) is not required for merge.
- No unit tests — this phase adds no logic.
- Dependency resolution is implicitly validated by `tsc` finding Hono's types.
