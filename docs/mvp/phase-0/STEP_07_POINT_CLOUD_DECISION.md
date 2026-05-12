# STEP 07: Point Cloud Display Path Decision

Status: Draft  
Branch: `feature/poc-step-07-point-cloud-decision`  
Depends on: STEP 04

## Purpose

Determine the MVP path for point cloud visualization.

This step may produce a runnable rendering PoC or a documented technical decision if rendering is not practical within Phase 0.

## Candidate Options

- COPC/LAZ pipeline with a compatible web renderer.
- 3D Tiles point cloud output.
- Deferred point cloud support with static 3D Tiles substitute for MVP-A.

## Codex Direction

Prefer a documented decision over forcing a fragile point cloud renderer into MVP-A.

MVP-A can defer true point cloud rendering if:

- 3D Tiles mesh/raster experience is sufficient for customer demo.
- Conversion or hosting complexity is too high.
- Browser performance is not predictable.

## Tasks

1. Identify one small sample point cloud dataset or public sample.
2. Evaluate COPC/LAZ browser rendering feasibility.
3. Evaluate 3D Tiles point cloud feasibility.
4. Compare conversion workflow complexity.
5. Compare static hosting requirements.
6. Compare browser performance and memory risks.
7. Decide MVP-A path:
   - real point cloud rendering,
   - 3D Tiles point cloud substitute,
   - defer to MVP-B.
8. Document the decision with rationale.

## Acceptance Criteria

- A decision record exists for the point cloud path.
- If rendering succeeds, setup notes and visual verification are recorded.
- If deferred, the fallback is documented with clear rationale.
- The decision does not block MVP-A viewer implementation.

## Verification

Minimum verification:

- Documented comparison of candidate paths.
- One practical recommendation for MVP-A.
- One practical recommendation for MVP-B.

Preferred verification:

- Small sample rendering screenshot if feasible.
- Conversion command notes if feasible.

## Risks

- Browser performance may be unacceptable for large point clouds.
- Conversion tooling may be more important than UI integration.
- Large point cloud sample data should not be committed without explicit approval.

## Completion Report

Claude must create a Korean completion report under `docs/reports/` after implementation or verification is complete.
