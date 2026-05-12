# STEP 02: GeoAI Result Layer PoC

Status: Draft  
Branch: `feature/poc-step-02-geoai-result-layer`  
Depends on: STEP 00, STEP 01

## Purpose

Validate how road damage GeoAI results appear as reviewable map objects connected to a result table and property panel.

## Data Model

Use the schema from `docs/api/API_CONTRACT_DRAFT.md`:

- `GeoAIResult`
- `GeoAIObject`
- GeoJSON-compatible geometry
- `className`
- `confidence`
- `severity`
- `reviewStatus`

## Implementation Scope

Build on the 2D viewer PoC and add:

- Road damage sample objects.
- Map layer for result objects.
- Result table.
- Object selection synchronization.
- Property panel.
- Local review status updates.

## Tasks

1. Create road damage sample data if not already created in STEP 00.
2. Render point and polygon objects on the 2D map.
3. Encode severity visually.
4. Render the same objects in a table.
5. Select an object from the map.
6. Select an object from the table.
7. Show selected object details in a property panel.
8. Allow local review status changes:
   - `pending`
   - `accepted`
   - `rejected`
   - `needs_review`
9. Keep map, table, and panel state synchronized.

## Acceptance Criteria

- Map selection and table selection stay synchronized.
- Severity is visually distinguishable.
- Review status changes update the table and property panel.
- The selected object is obvious in the map and table.
- Data shape remains compatible with the API contract draft.

## Verification

Minimum verification:

- Manual object selection from map.
- Manual object selection from table.
- Manual review status change.
- Console check.

Preferred verification:

- Component/state tests for selection and status update logic.
- Playwright flow test for select/update behavior.

## Risks

- MapLibre feature selection requires stable feature IDs.
- Polygon and point styling may need separate layers.
- Review updates must not mutate seed data in a way that makes tests order-dependent.

## Completion Report

Claude must create a Korean completion report under `docs/reports/` after implementation or verification is complete.
