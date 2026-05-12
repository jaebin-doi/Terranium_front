# Phase 0 Technical PoC Implementation Plan

Status: Draft  
Scope: Technical proof of concept before MVP-A implementation  
Primary consumers: Codex, Claude, engineering reviewers

## 1. Objective

Phase 0 validates the technical risks that can block the Terranium MVP-A product experience.

The goal is not to build the complete product UI. The goal is to prove that the selected frontend, viewer, reporting, and data-ingestion approaches are feasible enough to support the MVP-A implementation plan.

## 2. Hierarchy

MVP planning is organized as:

```text
PRODUCT_MVP_SCOPE
  PHASE
    STEP
```

This document is the Phase 0 overview. Detailed execution steps live under:

```text
docs/mvp/phase-0/
```

## 3. Codex Baseline Decisions

Codex owns default implementation decisions unless the user explicitly overrides them.

Phase 0 baseline decisions:

- First representative GeoAI model: `road damage detection`.
- MVP-A viewer approach: real MapLibre/Cesium integration through focused PoC steps, not a placeholder-only viewer.
- Mock API approach: Next.js route handlers backed by seed data once `apps/web` is scaffolded.
- Reporting approach: HTML preview first, then validate server-side capture/PDF feasibility.

Rationale:

- Road damage detection is easier to demonstrate with orthomosaic-style map data and point/polygon result layers.
- MapLibre/Cesium are core technical risks, so they should be validated before MVP-A UI implementation hardens.
- Next.js route handlers keep MVP-A frontend/backend alignment close without starting the full FastAPI backend too early.
- Server-side capture avoids many cross-origin canvas limitations common in map screenshots.

## 4. Phase 0 Success Criteria

Phase 0 is considered successful when all of the following are demonstrated with sample or mock data:

- A sample orthomosaic or raster-like layer can be displayed in a 2D map surface.
- A sample 3D Tiles dataset can be displayed in a 3D viewer surface.
- A point cloud display path is validated with a small sample or documented fallback.
- 2D and 3D viewer modes can be switched without losing selected project/layer state.
- A road damage GeoAI result layer can be rendered from GeoJSON-like data.
- A selected GeoAI object can be synchronized between the map layer, result table, and property panel.
- A map/viewer capture can be inserted into a report preview or PDF generation prototype.
- A chunked upload protocol is prototyped at the API/interface level.

## 5. Phase 0 Step Index

| Step | Document | Purpose |
|---|---|---|
| STEP 00 | `phase-0/STEP_00_FOUNDATION_DECISIONS.md` | Set PoC workspace, shared data contracts, and decision baseline |
| STEP 01 | `phase-0/STEP_01_2D_RASTER_VIEWER.md` | Validate MapLibre 2D raster/orthomosaic viewer path |
| STEP 02 | `phase-0/STEP_02_GEOAI_RESULT_LAYER.md` | Validate road damage result layer, table, and selection sync |
| STEP 03 | `phase-0/STEP_03_VIEWER_STATE_SWITCHING.md` | Validate 2D/3D mode state preservation |
| STEP 04 | `phase-0/STEP_04_3D_TILES_VIEWER.md` | Validate Cesium 3D Tiles viewer path |
| STEP 05 | `phase-0/STEP_05_REPORT_CAPTURE.md` | Validate report preview and viewer capture/PDF path |
| STEP 06 | `phase-0/STEP_06_CHUNK_UPLOAD_PROTOCOL.md` | Validate chunked upload protocol and client slicing |
| STEP 07 | `phase-0/STEP_07_POINT_CLOUD_DECISION.md` | Decide point cloud display/conversion strategy |

## 6. Suggested Execution Order

1. STEP 00: Foundation Decisions
2. STEP 01: 2D Raster Viewer
3. STEP 02: GeoAI Result Layer
4. STEP 03: Viewer State Switching
5. STEP 04: 3D Tiles Viewer
6. STEP 05: Report Capture
7. STEP 06: Chunked Upload Protocol
8. STEP 07: Point Cloud Decision

This order prioritizes the MVP-A user experience while still reducing the highest technical risks before MVP-B.

## 7. Non-Goals

Do not implement the following in Phase 0:

- Full production authentication.
- Full project CRUD.
- Real customer data ingestion.
- Full COG conversion pipeline.
- Full 3D Tiles conversion pipeline.
- Full point cloud conversion pipeline.
- Real GeoAI inference server.
- Production-grade PDF templates.
- Enterprise admin console.
- Multi-tenant security enforcement.
- Deployment automation beyond local verification.

## 8. Branching

Use one feature branch per PoC step when implementation starts:

```text
feature/poc-step-00-foundation
feature/poc-step-01-2d-raster-viewer
feature/poc-step-02-geoai-result-layer
feature/poc-step-03-viewer-state-switching
feature/poc-step-04-3d-tiles-viewer
feature/poc-step-05-report-capture
feature/poc-step-06-chunk-upload
feature/poc-step-07-point-cloud-decision
```

Each branch should merge into `develop` after review.

## 9. Reporting

Detailed implementation plans are written in English.

Korean completion reports are created only after implementation or verification work is completed. The report is written by Claude under:

```text
docs/reports/
```

Required report sections:

- 작업 목적
- 작업 범위
- 구현/검증 내용
- 결과
- 계획 대비 완료 여부 체크리스트
- 남은 이슈
- 다음 작업 제안
