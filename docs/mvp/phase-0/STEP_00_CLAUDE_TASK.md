# Claude Task: STEP 00 Foundation Decisions

Task status: Ready for implementation  
Target branch: `feature/poc-step-00-foundation`  
Source plan: `docs/mvp/phase-0/STEP_00_FOUNDATION_DECISIONS.md`  
Reporter: Claude writes the Korean completion report after implementation

## 1. Goal

Create the minimum `apps/web` PoC foundation required for the Phase 0 technical PoC steps.

This task is not a full product implementation. It should only establish a typed, runnable, and documented foundation that later PoC steps can reuse.

## 2. Required Outcome

After this task, later PoC steps must be able to import:

- shared demo project data,
- shared road damage GeoAI sample objects,
- shared API-compatible TypeScript types,
- shared viewer state contract,
- a basic PoC route namespace,
- a clear local run command.

## 3. Codex Decisions To Follow

Claude must follow these decisions unless Codex or the user updates them:

- First GeoAI model: `road damage detection`.
- Mock API strategy: Next.js route handlers backed by typed seed data.
- Viewer strategy: real MapLibre/Cesium PoCs in later steps, no placeholder-only MVP-A viewer strategy.
- Report strategy: HTML preview first, server-side capture/PDF feasibility later.
- GeoAI object geometry: GeoJSON-compatible geometry embedded in API response objects.

## 4. Branch Rule

Implement this task on:

```text
feature/poc-step-00-foundation
```

Do not commit directly to `develop`.

## 5. Expected Implementation

### 5.1 Scaffold `apps/web`

If `apps/web` is still only a placeholder folder, create a minimal Next.js + TypeScript app.

Preferred baseline:

- Next.js App Router
- React
- TypeScript
- npm package scripts
- minimal CSS
- no full design system yet

Do not add a full product shell, authentication system, database, or FastAPI backend.

Expected minimum files may include:

```text
apps/web/package.json
apps/web/next.config.*
apps/web/tsconfig.json
apps/web/app/layout.tsx
apps/web/app/page.tsx
apps/web/app/poc/page.tsx
apps/web/app/globals.css
```

Adjust exact filenames to the chosen Next.js version and project conventions.

### 5.2 Define Shared Types

Create API-compatible TypeScript types for Phase 0 and MVP-A mock data.

Expected location:

```text
apps/web/src/types/
```

Required types:

- `Project`
- `Dataset`
- `DatasetAsset`
- `Layer`
- `ProcessingJob`
- `GeoAIModel`
- `GeoAIResult`
- `GeoAIObject`
- `ReviewStatus`
- `Severity`
- `Report`

Align field names with:

```text
docs/api/API_CONTRACT_DRAFT.md
```

Use camelCase in frontend TypeScript where the API draft already uses camelCase.

### 5.3 Create Demo Seed Data

Create typed seed data that later PoC steps can import.

Expected location:

```text
apps/web/src/lib/demo-data/
```

Required seed data:

- one organization-like reference if useful,
- one demo user,
- one demo project,
- orthomosaic dataset,
- 3D tiles dataset placeholder,
- road damage GeoAI result,
- road damage GeoAI objects.

Road damage objects must include:

- at least two `Point` geometries,
- at least one `Polygon` geometry,
- multiple severity values,
- multiple review statuses,
- confidence values,
- stable IDs.

### 5.4 Define Viewer State Contract

Create a typed viewer state contract.

Expected location:

```text
apps/web/src/lib/viewer/
```

Required state keys:

- `mode`: `2d | 3d`
- `activeProjectId`
- `activeLayerIds`
- `layerOpacityById`
- `selectedObjectId`
- `cameraState`
- `measurementTool`

This step does not need a full Zustand/Jotai implementation unless it is trivial. A typed contract plus small utility/default state is enough.

### 5.5 Add Minimal PoC Route

Create a simple PoC landing route:

```text
/poc
```

The page should show:

- task label: `Phase 0 PoC Foundation`,
- demo project name,
- count of datasets,
- count of GeoAI objects,
- list of planned PoC steps or links if available.

This page is only a smoke-test surface.

### 5.6 Add Mock API Route Handler Skeletons

Add minimal Next.js route handlers only if the scaffold supports them cleanly.

Preferred initial routes:

```text
GET /api/demo/projects
GET /api/demo/projects/[projectId]
GET /api/demo/projects/[projectId]/datasets
GET /api/demo/projects/[projectId]/layers
GET /api/demo/projects/[projectId]/geoai-results
GET /api/demo/geoai-results/[resultId]/objects
```

If route handlers would add too much setup friction, document why and defer them. Do not block the task on perfect mock API coverage.

## 6. Out of Scope

Do not implement:

- real authentication,
- real backend,
- database connection,
- MapLibre viewer,
- Cesium viewer,
- upload UI,
- report preview,
- complete AppShell,
- shadcn/ui,
- Tailwind unless selected as part of scaffold and kept minimal.

## 7. Verification Requirements

Claude must verify:

1. Dependencies install successfully.
2. The local dev server starts.
3. `/poc` renders without runtime errors.
4. TypeScript passes if a typecheck script is added.
5. Seed data imports compile.
6. Mock route handlers work if implemented.

Minimum commands should be documented in `apps/web/README.md`.

## 8. Required Documentation Updates

Claude must update:

```text
apps/web/README.md
```

The README must include:

- current scaffold status,
- local install command,
- local dev command,
- PoC route URL,
- what is intentionally not implemented yet.

## 9. Required Korean Completion Report

After implementation and verification, Claude must create:

```text
docs/reports/YYYY-MM-DD_phase0-step00-foundation_작업보고.md
```

The report must be written in Korean and include:

- 작업 목적
- 작업 범위
- 구현/검증 내용
- 결과
- 계획 대비 완료 여부 체크리스트
- 남은 이슈
- 다음 작업 제안

Codex should review the report after Claude completes the implementation.

## 10. Acceptance Criteria

This task is complete when:

- `apps/web` has a minimal runnable Next.js/TypeScript PoC scaffold.
- `/poc` renders demo project/seed-data summary.
- Shared TypeScript types exist and align with the API contract draft.
- Demo seed data exists for road damage detection.
- Viewer state contract exists.
- `apps/web/README.md` explains how to run and verify the PoC foundation.
- Claude has created the Korean completion report in `docs/reports/`.

## 11. Notes For Claude

- Keep the implementation intentionally small.
- Prefer boring, explicit TypeScript over abstractions.
- Do not introduce UI libraries unless necessary.
- Do not start STEP 01 in this branch.
- If the existing repository structure conflicts with this task, stop and ask Codex before making large structural changes.
