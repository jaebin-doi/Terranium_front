# Repository Structure

This repository is organized as a lightweight monorepo. The current production artifact is a static landing site, while the product planning documents define a future stack based on Next.js, React, TypeScript, FastAPI, PostgreSQL/PostGIS, spatial processing tooling, and Docker-based infrastructure.

## Current Layout

```text
apps/
  landing/               # Current production static site
  web/                   # Reserved for the future Next.js product app
  api/                   # Reserved for the future FastAPI backend

packages/
  ui/                    # Shared UI components/design system
  shared/                # Shared schemas, types, API contracts
  config/                # Shared project config

infra/
  docker/                # Docker/Compose setup
  k8s/                   # K3s/Kubernetes manifests
  observability/         # Metrics, logs, traces config

data/
  samples/               # Small sample datasets only

prototypes/              # Exploratory pages and prototypes
design/                  # Design inputs, references, generated assets, drafts
docs/                    # Product and engineering documentation
scripts/                 # Local utility scripts
```

Recommended documentation categories:

```text
docs/architecture/       # Repository and system structure references
docs/api/                # API contracts and interface drafts
docs/engineering/        # Development workflow and Git rules
docs/mvp/                # MVP scope and implementation plans
docs/planning/           # PRD and implementation planning history
docs/reports/            # Korean progress reports for completed work
```

## Technology Mapping

- `apps/landing`: plain HTML/CSS/JS static site.
- `apps/web`: planned Next.js, React, TypeScript frontend.
- `apps/api`: planned Python FastAPI backend.
- `packages/ui`: planned shared UI components, aligned with shadcn/ui or a custom design system.
- `packages/shared`: planned Zod/Pydantic-aligned schemas, API contracts, constants, and shared domain definitions.
- `infra/docker`: planned Docker Compose setup for local and pilot deployments.
- `infra/k8s`: planned K3s/Kubernetes manifests for later environments.
- `infra/observability`: planned Prometheus, Grafana, Loki, and OpenTelemetry configuration.

## Rules

- Production static site files live in `apps/landing`.
- Experimental or alternate pages live in `prototypes`, not in the production app.
- Source/reference/generated design assets live in `design`, not mixed into app folders unless the app directly references them.
- Detailed implementation plans should be written in English under `docs/mvp/`.
- Completed implementation or verification work must create a Korean progress report under `docs/reports/`; this report is written by Claude after completion.
- Large or sensitive real customer datasets must not be committed. Keep only small sanitized samples under `data/samples`.
- Do not scaffold framework files into `apps/web` or `apps/api` until implementation starts.
