# STEP 04: 3D Tiles Viewer PoC

Status: Draft  
Branch: `feature/poc-step-04-3d-tiles-viewer`  
Depends on: STEP 00, STEP 03

## Purpose

Validate the Cesium-based path for displaying 3D Tiles in a 3D digital twin experience.

## Candidate Stack

- Next.js
- React
- TypeScript
- CesiumJS
- Static sample 3D Tiles or documented external sample

## Implementation Scope

Build a minimal 3D viewer surface that can later plug into the shared viewer mode-switching shell.

## Tasks

1. Create a client-only Cesium viewer component.
2. Configure Cesium static assets for the framework setup.
3. Load a sample 3D Tileset.
4. Add camera framing/reset behavior.
5. Add viewer resource cleanup on unmount.
6. Integrate with shared viewer mode state.
7. Document asset hosting requirements.
8. Document whether sample data is local or external.

## Acceptance Criteria

- The 3D viewer canvas renders non-empty content.
- A sample 3D Tileset loads from a local/static path or documented external sample.
- The camera can frame the dataset.
- Route unmount releases viewer resources.
- Switching away from 3D does not leak duplicate Cesium viewers.
- No blocking Cesium runtime errors remain.

## Verification

Minimum verification:

- Manual 3D load check.
- Manual camera reset check.
- Console check.
- Route unmount/remount check.

Preferred verification:

- Playwright screenshot check.
- Canvas non-empty pixel check.

## Risks

- Cesium static asset handling may require custom build configuration.
- 3D Tiles sample data may be too large for Git.
- Browser memory usage may rise if cleanup is incomplete.

## Completion Report

Claude must create a Korean completion report under `docs/reports/` after implementation or verification is complete.
