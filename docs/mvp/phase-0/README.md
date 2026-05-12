# Phase 0 Step Plan

This folder contains step-level implementation plans for the Phase 0 technical PoC.

Hierarchy:

```text
PRODUCT_MVP_SCOPE.md
  PHASE_0_TECHNICAL_POC_PLAN.md
    phase-0/STEP_*.md
```

## Step Index

1. `STEP_00_FOUNDATION_DECISIONS.md`
   - Claude task: `STEP_00_CLAUDE_TASK.md`
2. `STEP_01_2D_RASTER_VIEWER.md`
3. `STEP_02_GEOAI_RESULT_LAYER.md`
4. `STEP_03_VIEWER_STATE_SWITCHING.md`
5. `STEP_04_3D_TILES_VIEWER.md`
6. `STEP_05_REPORT_CAPTURE.md`
7. `STEP_06_CHUNK_UPLOAD_PROTOCOL.md`
8. `STEP_07_POINT_CLOUD_DECISION.md`

## Rules

- Step plans are written in English.
- Each step should be implemented on its own `feature/poc-step-*` branch.
- Each completed implementation or verification step must produce a Korean completion report in `docs/reports/`.
- Completion reports are written by Claude, not Codex, unless the user explicitly instructs otherwise.
