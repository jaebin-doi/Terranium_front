# Terranium Documentation

This directory contains product, implementation, review, and repository-structure documents for Terranium.

## Reading Order

1. `planning/terranium_planning_docs/v1.1_revised/04_Terranium_PRD_v1.1.md`
   - Current product requirements baseline.
2. `planning/terranium_planning_docs/v1.1_revised/05_Terranium_Implementation_Plan_v1.1.md`
   - Current technical implementation baseline.
3. `mvp/PRODUCT_MVP_SCOPE.md`
   - MVP-A scope, workflows, screens, domain model, and first implementation order.
4. `mvp/PHASE_0_TECHNICAL_POC_PLAN.md`
   - Phase 0 technical PoC implementation plan.
5. `mvp/phase-0/`
   - Step-level Phase 0 implementation plans.
6. `api/API_CONTRACT_DRAFT.md`
   - MVP-A API contract draft for frontend/backend alignment.
7. `architecture/REPOSITORY_STRUCTURE.md`
   - Repository layout and ownership rules.
8. `engineering/DEVELOPMENT.md`
   - Local preview, deployment baseline, and Git branch strategy.

## Document Versions

```text
planning/terranium_planning_docs/
  v1.0_original/         # Initial PRD and implementation plan
  v1.0_review/           # Review and reevaluation notes
  v1.1_revised/          # Current revised baseline
```

## Document Folders

```text
architecture/            # Repository and system structure references
api/                     # API contracts and interface drafts
engineering/             # Development workflow and Git rules
mvp/                     # MVP scope and implementation plans
planning/                # PRD and product/implementation planning history
reports/                 # Korean progress reports for completed work
```

## Current Technical Baseline

The current implementation plan defines the future platform stack as:

- Frontend: Next.js, React, TypeScript
- Frontend state/data: TanStack Query, Zustand or Jotai
- Forms/validation: React Hook Form, Zod
- Spatial viewer: MapLibre GL JS, CesiumJS, deck.gl
- Backend API: Python FastAPI
- Database: PostgreSQL/PostGIS
- Queue/cache: Redis with Celery, Dramatiq, or RQ
- Spatial processing: GDAL, PDAL, PROJ, Rasterio, GeoPandas, rio-tiler
- GeoAI/MLOps: PyTorch, ONNX Runtime or Triton, MLflow
- Infrastructure: Docker, Docker Compose, K3s/Kubernetes, Nginx or Traefik
- Observability: Prometheus, Grafana, Loki, OpenTelemetry

## Documentation Rules

- Treat `v1.1_revised` as the current source of truth.
- Keep older versions for traceability; do not overwrite them.
- Put repository/process docs in `docs/architecture/` or `docs/engineering/`.
- Put API contracts in `docs/api/`.
- Put MVP scope and implementation plans in `docs/mvp/`.
- Put product planning docs under `docs/planning/terranium_planning_docs/`.
- Put Korean completion reports under `docs/reports/`.
- If implementation decisions diverge from the plan, document the decision before changing code structure.
