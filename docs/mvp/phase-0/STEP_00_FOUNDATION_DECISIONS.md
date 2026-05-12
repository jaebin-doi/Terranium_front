# STEP 00: Foundation Decisions

Status: Draft  
Branch: `feature/poc-step-00-foundation`  
Depends on: None

## Purpose

Establish the technical baseline required before isolated PoC implementation begins.

This step prevents each PoC track from inventing its own data shape, route conventions, mock strategy, or viewer state model.

## Codex Decisions

- First GeoAI model: road damage detection.
- MVP-A mock API: Next.js route handlers backed by typed seed data.
- First viewer path: real MapLibre for 2D and real Cesium for 3D through focused PoCs.
- Report path: HTML report preview first, server-side capture/PDF feasibility second.
- Initial data format for GeoAI objects: GeoJSON-compatible geometry embedded in API response objects.

## Implementation Scope

Create the minimum foundation needed for later PoC steps:

- Decide route namespace for PoC pages.
- Define shared seed data shape.
- Define shared viewer state contract.
- Define naming conventions for PoC components.
- Define screenshot/manual verification expectations.

## Expected Files

Exact paths may change once `apps/web` is scaffolded, but the initial target should be:

```text
apps/web/
  app/poc/
  src/lib/demo-data/
  src/lib/viewer/
  src/types/
```

No full product UI is required in this step.

## Tasks

1. Confirm `apps/web` scaffold status.
2. If `apps/web` does not exist as an app, create only the minimum scaffold needed for PoC work.
3. Define `Project`, `Dataset`, `Layer`, `GeoAIResult`, and `GeoAIObject` TypeScript types.
4. Create road damage sample objects with point and polygon geometry examples.
5. Define viewer state keys:
   - `mode`
   - `activeProjectId`
   - `activeLayerIds`
   - `layerOpacityById`
   - `selectedObjectId`
   - `cameraState`
6. Document how PoC pages should be reached locally.
7. Add a lightweight smoke test or verification command if practical.

## Acceptance Criteria

- Later PoC steps can import the same sample project and GeoAI objects.
- Viewer state keys are documented and typed.
- The road damage sample data matches `docs/api/API_CONTRACT_DRAFT.md`.
- There is a clear local run command.
- No production app workflow is implied beyond PoC scope.

## Out of Scope

- Full app shell.
- Real authentication.
- FastAPI backend.
- Database schema.
- Production layout.

## Completion Report

Claude must create a Korean completion report under `docs/reports/` after implementation or verification is complete.
