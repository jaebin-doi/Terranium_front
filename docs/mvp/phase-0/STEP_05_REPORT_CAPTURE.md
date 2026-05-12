# STEP 05: Report Capture / PDF PoC

Status: Draft  
Branch: `feature/poc-step-05-report-capture`  
Depends on: STEP 01, STEP 02

## Purpose

Validate that viewer state or capture output can be inserted into a report flow.

## Codex Direction

Use HTML report preview as the first deliverable. Validate server-side capture/PDF feasibility as the preferred export path.

Client-side canvas capture may be tested, but it should not be assumed as the production path because map tiles can create cross-origin capture limits.

## Implementation Scope

Create a minimal report preview that includes:

- Project metadata.
- GeoAI result summary.
- Review status summary.
- Map image placeholder or captured image.
- Export action placeholder.

## Tasks

1. Create a report preview PoC route.
2. Render project summary from seed data.
3. Render road damage result summary.
4. Render accepted/rejected/needs-review counts.
5. Insert static map image or captured viewer image.
6. Test or document a server-side capture approach.
7. Decide whether PDF export is MVP-A-ready or deferred.

## Acceptance Criteria

- Report preview shows project metadata, result summary, and map image area.
- The report can be generated from the same seed data used by viewer PoCs.
- A PDF/export path is selected or explicitly deferred with rationale.
- Known limitations are documented.

## Verification

Minimum verification:

- Manual report preview check.
- Manual data consistency check against seed data.
- Console check.

Preferred verification:

- Snapshot or screenshot check.
- Prototype PDF output if practical.

## Risks

- Canvas capture may fail with cross-origin map tiles.
- Server-side capture may require browser automation infrastructure.
- PDF fidelity may differ from HTML preview.

## Completion Report

Claude must create a Korean completion report under `docs/reports/` after implementation or verification is complete.
