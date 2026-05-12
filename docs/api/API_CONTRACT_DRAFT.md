# Terranium API Contract Draft

문서 상태: Draft  
기준 범위: `docs/mvp/PRODUCT_MVP_SCOPE.md`의 MVP-A

## 1. 목적

이 문서는 MVP-A 프론트엔드 구현과 향후 FastAPI 백엔드 구현 사이의 최소 API 계약을 정의한다.

MVP-A에서는 mock API 또는 seed data로 시작할 수 있다. 단, 프론트엔드는 이 문서의 response shape를 기준으로 구현해 이후 FastAPI 전환 비용을 줄인다.

## 2. 공통 규칙

### 2.1 ID

- 모든 ID는 문자열 UUID 형식을 기본으로 한다.
- mock data에서는 읽기 쉬운 문자열 ID를 사용할 수 있으나 field name은 유지한다.

### 2.2 시간

- 모든 시간은 ISO 8601 문자열을 사용한다.
- 예: `2026-05-11T09:00:00+09:00`

### 2.3 상태값

Project status:

- `active`
- `paused`
- `archived`

Dataset status:

- `registered`
- `processing`
- `ready`
- `failed`

Processing job status:

- `queued`
- `running`
- `succeeded`
- `failed`
- `cancelled`

Review status:

- `pending`
- `accepted`
- `rejected`
- `needs_review`

Report status:

- `draft`
- `ready`
- `exported`

Severity:

- `low`
- `medium`
- `high`
- `critical`

### 2.4 Error Shape

```json
{
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project not found",
    "details": {}
  }
}
```

## 3. Auth

### POST /auth/demo-login

MVP-A 전용 데모 로그인.

Request:

```json
{
  "email": "demo@doi-kr.com"
}
```

Response:

```json
{
  "accessToken": "demo-token",
  "user": {
    "id": "user-demo-reviewer",
    "organizationId": "org-doi",
    "name": "Demo Reviewer",
    "email": "demo@doi-kr.com",
    "role": "facility_reviewer",
    "status": "active"
  }
}
```

### GET /me

Response:

```json
{
  "id": "user-demo-reviewer",
  "organizationId": "org-doi",
  "name": "Demo Reviewer",
  "email": "demo@doi-kr.com",
  "role": "facility_reviewer",
  "status": "active"
}
```

## 4. Dashboard

### GET /dashboard/summary

Response:

```json
{
  "projectCount": 4,
  "datasetCount": 18,
  "openReviewCount": 27,
  "criticalIssueCount": 3,
  "storageUsedGb": 842.5,
  "recentJobs": [
    {
      "id": "job-001",
      "projectId": "project-pyeongtaek-plant",
      "type": "geoai_analysis",
      "status": "succeeded",
      "progress": 100,
      "updatedAt": "2026-05-11T09:00:00+09:00"
    }
  ],
  "recentReports": [
    {
      "id": "report-001",
      "projectId": "project-pyeongtaek-plant",
      "title": "Pyeongtaek Plant Safety Inspection Draft",
      "status": "ready",
      "createdAt": "2026-05-11T09:00:00+09:00"
    }
  ]
}
```

## 5. Projects

### GET /projects

Response:

```json
{
  "items": [
    {
      "id": "project-pyeongtaek-plant",
      "organizationId": "org-doi",
      "name": "Pyeongtaek Plant Safety Inspection",
      "siteName": "Pyeongtaek Industrial Facility",
      "siteType": "industrial_facility",
      "location": {
        "center": [127.112, 37.014],
        "address": "Pyeongtaek, Gyeonggi-do"
      },
      "status": "active",
      "datasetCount": 5,
      "openReviewCount": 12,
      "updatedAt": "2026-05-11T09:00:00+09:00"
    }
  ]
}
```

### GET /projects/{project_id}

Response:

```json
{
  "id": "project-pyeongtaek-plant",
  "organizationId": "org-doi",
  "name": "Pyeongtaek Plant Safety Inspection",
  "siteName": "Pyeongtaek Industrial Facility",
  "siteType": "industrial_facility",
  "location": {
    "center": [127.112, 37.014],
    "address": "Pyeongtaek, Gyeonggi-do"
  },
  "status": "active",
  "startedAt": "2026-05-01T09:00:00+09:00",
  "updatedAt": "2026-05-11T09:00:00+09:00"
}
```

## 6. Datasets

### GET /projects/{project_id}/datasets

Response:

```json
{
  "items": [
    {
      "id": "dataset-ortho-001",
      "projectId": "project-pyeongtaek-plant",
      "name": "Orthomosaic May 2026",
      "type": "orthomosaic",
      "status": "ready",
      "capturedAt": "2026-05-03T10:00:00+09:00",
      "createdAt": "2026-05-03T18:00:00+09:00",
      "assets": [
        {
          "id": "asset-cog-001",
          "assetType": "cog",
          "uri": "/demo/tiles/orthomosaic/cog.json",
          "format": "COG",
          "sizeBytes": 1200000000,
          "metadata": {
            "gsdCm": 4.2
          }
        }
      ]
    }
  ]
}
```

## 7. Layers

### GET /projects/{project_id}/layers

Response:

```json
{
  "items": [
    {
      "id": "layer-ortho-001",
      "projectId": "project-pyeongtaek-plant",
      "datasetId": "dataset-ortho-001",
      "name": "Orthomosaic",
      "type": "raster",
      "visibleByDefault": true,
      "opacity": 1,
      "style": {}
    },
    {
      "id": "layer-damage-001",
      "projectId": "project-pyeongtaek-plant",
      "datasetId": "dataset-geoai-001",
      "name": "Road Damage Detection",
      "type": "geoai_result",
      "visibleByDefault": true,
      "opacity": 0.85,
      "style": {
        "severityProperty": "severity"
      }
    }
  ]
}
```

## 8. Processing Jobs

### GET /projects/{project_id}/processing-jobs

Response:

```json
{
  "items": [
    {
      "id": "job-001",
      "projectId": "project-pyeongtaek-plant",
      "datasetId": "dataset-ortho-001",
      "type": "cog_conversion",
      "status": "succeeded",
      "progress": 100,
      "startedAt": "2026-05-03T11:00:00+09:00",
      "finishedAt": "2026-05-03T12:20:00+09:00",
      "errorMessage": null
    }
  ]
}
```

## 9. GeoAI Results

### GET /projects/{project_id}/geoai-results

Response:

```json
{
  "items": [
    {
      "id": "result-road-damage-001",
      "projectId": "project-pyeongtaek-plant",
      "datasetId": "dataset-geoai-001",
      "model": {
        "id": "model-road-damage",
        "name": "Road Damage Detection",
        "version": "demo-0.1",
        "taskType": "object_detection"
      },
      "name": "Road Damage Detection - May 2026",
      "status": "ready",
      "objectCount": 32,
      "openReviewCount": 12,
      "createdAt": "2026-05-04T09:00:00+09:00"
    }
  ]
}
```

### GET /geoai-results/{result_id}/objects

Response:

```json
{
  "items": [
    {
      "id": "object-001",
      "resultId": "result-road-damage-001",
      "geometry": {
        "type": "Point",
        "coordinates": [127.1124, 37.0142]
      },
      "className": "pothole",
      "confidence": 0.92,
      "severity": "high",
      "reviewStatus": "pending",
      "properties": {
        "areaSqm": 0.8,
        "imageRef": "frame-00123"
      }
    }
  ]
}
```

### PATCH /geoai-objects/{object_id}/review

Request:

```json
{
  "reviewStatus": "accepted",
  "comment": "Confirmed from orthomosaic and field photo."
}
```

Response:

```json
{
  "id": "object-001",
  "reviewStatus": "accepted",
  "latestComment": {
    "id": "comment-001",
    "objectId": "object-001",
    "userId": "user-demo-reviewer",
    "status": "accepted",
    "comment": "Confirmed from orthomosaic and field photo.",
    "createdAt": "2026-05-11T09:00:00+09:00"
  }
}
```

## 10. Reports

### GET /projects/{project_id}/reports

Response:

```json
{
  "items": [
    {
      "id": "report-001",
      "projectId": "project-pyeongtaek-plant",
      "title": "Pyeongtaek Plant Safety Inspection Draft",
      "status": "ready",
      "templateId": "template-safety-basic",
      "createdBy": "user-demo-reviewer",
      "createdAt": "2026-05-11T09:00:00+09:00"
    }
  ]
}
```

### POST /projects/{project_id}/reports

Request:

```json
{
  "title": "Pyeongtaek Plant Safety Inspection Draft",
  "templateId": "template-safety-basic",
  "geoaiResultIds": ["result-road-damage-001"]
}
```

Response:

```json
{
  "id": "report-001",
  "projectId": "project-pyeongtaek-plant",
  "title": "Pyeongtaek Plant Safety Inspection Draft",
  "status": "ready",
  "templateId": "template-safety-basic",
  "createdBy": "user-demo-reviewer",
  "createdAt": "2026-05-11T09:00:00+09:00"
}
```

### GET /reports/{report_id}

Response:

```json
{
  "id": "report-001",
  "projectId": "project-pyeongtaek-plant",
  "title": "Pyeongtaek Plant Safety Inspection Draft",
  "status": "ready",
  "sections": [
    {
      "id": "section-summary",
      "title": "Inspection Summary",
      "type": "summary",
      "content": {
        "criticalCount": 3,
        "highCount": 8,
        "acceptedCount": 14,
        "needsReviewCount": 5
      }
    },
    {
      "id": "section-map",
      "title": "Damage Map",
      "type": "map_capture",
      "content": {
        "imageUri": "/demo/reports/report-001-map.png"
      }
    }
  ],
  "createdAt": "2026-05-11T09:00:00+09:00"
}
```

## 11. Open Questions

- 첫 대표 GeoAI 모델을 도로 손상으로 고정할지, 구조물 균열로 고정할지 결정 필요.
- `geometry`를 MVP-A에서 GeoJSON Geometry로 유지할지, Feature wrapper까지 포함할지 결정 필요.
- report export를 API에서 즉시 처리할지 async job으로 처리할지 결정 필요.
- MVP-A mock API를 Next.js route handler로 구현할지, 별도 FastAPI skeleton으로 구현할지 결정 필요.
