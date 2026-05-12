# STEP 01: 2D Raster Viewer PoC

Status: Draft  
Branch: `feature/poc-step-01-2d-raster-viewer`  
Depends on: STEP 00

## Purpose

Validate the MapLibre-based path for displaying an orthomosaic-style raster layer in a 2D map experience.

## Candidate Stack

- Next.js
- React
- TypeScript
- MapLibre GL JS
- Static sample raster tiles or a documented raster substitute

## Implementation Scope

Build a minimal PoC page that renders a 2D viewer with:

- MapLibre initialization.
- Neutral map style or blank base.
- One raster-like layer.
- Layer visibility toggle.
- Layer opacity control.
- Lifecycle cleanup on unmount.

## Tasks

1. Create a PoC route for the 2D viewer.
2. Initialize MapLibre in a client-only component.
3. Load a neutral base style.
4. Add a raster-like layer using static tiles or a placeholder source.
5. Add controls for visibility and opacity.
6. Add basic error handling for map load failures.
7. Verify cleanup on route unmount/remount.
8. Document whether the layer is true COG, tile placeholder, or static raster substitute.

## Acceptance Criteria

- The 2D viewer renders non-empty map content.
- A raster-like layer can be toggled on and off.
- Opacity changes without remounting the map.
- No console errors appear during initial load, toggle, opacity change, or route leave.
- Map instance cleanup prevents duplicate canvases after remount.

## Verification

Minimum verification:

- Manual browser check.
- Console check.
- Screenshot or visual confirmation.

Preferred verification:

- Playwright page-load smoke test.
- Canvas non-empty pixel check if practical.

## Risks

- Direct browser COG rendering may not be feasible.
- External base maps may fail in closed-network deployments.
- MapLibre assets/CSS must be loaded correctly in the chosen framework setup.

## Completion Report

Claude must create a Korean completion report under `docs/reports/` after implementation or verification is complete.
