# STEP 03: Viewer State Switching PoC

Status: Draft  
Branch: `feature/poc-step-03-viewer-state-switching`  
Depends on: STEP 00, STEP 01, STEP 02

## Purpose

Validate the product interaction model for switching between 2D and 3D modes without losing selected project, layer, or object state.

## Required State

- `mode`: `2d | 3d`
- `activeProjectId`
- `activeLayerIds`
- `layerOpacityById`
- `selectedObjectId`
- `cameraState`

## Implementation Scope

Create a minimal mode-switching shell that can host the 2D viewer and a temporary 3D placeholder until STEP 04 is complete.

This step is about state continuity, not 3D rendering quality.

## Tasks

1. Define or refine the viewer state store.
2. Add a segmented `2D / 3D` mode control.
3. Preserve active layer IDs across mode switches.
4. Preserve layer opacity values across mode switches.
5. Preserve selected GeoAI object across mode switches.
6. Define `cameraState` shape for 2D and 3D.
7. Document which camera properties can be translated between 2D and 3D.
8. Ensure mode switching does not create duplicate map/canvas instances.

## Acceptance Criteria

- Mode switching does not reset active layers.
- Mode switching does not reset layer opacity.
- Mode switching does not clear selected object state.
- Returning to 2D restores the previous selected object and visible layers.
- The state contract is documented for MVP-A implementation.

## Verification

Minimum verification:

- Manual 2D to 3D to 2D switch.
- Manual layer toggle before and after switching.
- Manual selected object persistence check.
- Console check.

Preferred verification:

- Store unit tests for mode switching.
- Playwright flow test for state persistence.

## Risks

- 2D and 3D camera models may not translate perfectly.
- If viewer components own too much state locally, switching will reset context.
- Cleanup must be handled carefully after STEP 04 adds Cesium.

## Completion Report

Claude must create a Korean completion report under `docs/reports/` after implementation or verification is complete.
