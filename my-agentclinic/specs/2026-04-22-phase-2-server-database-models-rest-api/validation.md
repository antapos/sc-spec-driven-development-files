# Validation — Phase 2: Server, Database, Models, and REST API

## Definition of done

Phase 2 is complete and ready to merge when all criteria below pass.

## Criteria

| # | Check | Command | Expected result |
|---|---|---|---|
| 1 | TypeScript compiles | `npm run build` | Exits 0, no errors or warnings |
| 2 | Tests pass | `npm test` | All tests pass, exit 0 |

## Test coverage required

Tests must exercise the following for each of the four resources (`agents`, `ailments`, `therapies`, `appointments`):

| Behaviour | Assertion |
|---|---|
| List all | `GET /api/:resource` → `200`, body is a JSON array |
| Get one (found) | `GET /api/:resource/:id` → `200`, body is a JSON object with correct `id` |
| Get one (missing) | `GET /api/:resource/99999` → `404` |
| Create | `POST /api/:resource` with valid body → `201`, body contains the new record |
| Update | `PUT /api/:resource/:id` with changed fields → `200`, body reflects changes |
| Delete | `DELETE /api/:resource/:id` → `200`; subsequent `GET` returns `404` |

## Out of scope

- No UI or browser testing — API only in this phase.
- No authentication or authorisation.
- No request body validation beyond TypeScript types.
- `agentclinic.db` must not be committed — confirm it is covered by `.gitignore`.
