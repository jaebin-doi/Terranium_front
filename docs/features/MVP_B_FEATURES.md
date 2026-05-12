# MVP-B / Pilot Feature Specification

Status: planning reference draft  
Audience: product/UI design, Codex, Claude  
Purpose: MVP-B 또는 Pilot에서 추가될 운영 기능을 UI/기능 기준으로 정리한다.

MVP-B는 MVP-A 데모 흐름을 실제 고객 파일, 저장소, 처리 파이프라인, 권한, 운영 로그와 연결하는 단계다. MVP-A에서 “보여준 흐름”을 MVP-B에서 “실제 운영 가능한 흐름”으로 확장한다.

## 1. MVP-B 전체 목표

MVP-B 사용자는 다음을 실제 데이터로 수행할 수 있어야 한다.

```text
조직/프로젝트 권한으로 로그인
→ 실제 프로젝트 생성/관리
→ 대용량 데이터 업로드
→ COG / 3D Tiles / point cloud 변환
→ 처리 작업 상태 추적
→ GeoAI 분석 작업 실행 또는 결과 등록
→ 검수/보고서 생성
→ 운영 로그와 감사 기록 확인
```

## 2. Organization / Users / Permissions

### 목적

고객 조직, 사용자, 역할, 프로젝트 접근 범위를 관리한다.

### 화면 구성

- Organization settings
- User list
- Invite user
- Role assignment
- Project access matrix
- Session/audit overview

### 역할 예시

- organization_admin
- project_manager
- facility_reviewer
- viewer_only

### 사용자 액션

- 사용자 초대
- 역할 변경
- 프로젝트 접근 부여/회수
- 사용자 비활성화

### MVP-B 필요성

MVP-A는 회사별 공유 계정을 허용하지만, MVP-B에서는 실제 고객 운영을 위해 사용자 단위 권한이 필요하다.

## 3. Production Auth / Session

### 목적

데모 auth를 실제 운영 auth로 대체한다.

### 기능

- email/password 또는 SSO 중 택일
- secure session cookie
- refresh/expiry policy
- logout
- optional MFA
- active session visibility

### concurrent login 정책

- 초기 고객 운영에서는 같은 회사 계정의 동시 접속을 허용할 수 있다.
- 사용자 단위 계정이 도입되면 조직 정책에 따라 session limit을 선택한다.
- single-session enforcement는 기본값이 아니다.

### UI 상태

- logged out
- logged in
- session expired
- permission denied
- account disabled

## 4. Project Management

### 목적

실제 프로젝트를 생성하고 데이터/분석/보고서 단위로 관리한다.

### 화면 구성

- Project list
- Project create/edit
- Project detail
- Project members
- Project data inventory
- Project activity timeline

### 사용자 액션

- 프로젝트 생성
- 이름/위치/현장 타입 수정
- 프로젝트 멤버 관리
- 프로젝트 archive
- 프로젝트 삭제 요청

### MVP-B 추가점

- seed data가 아니라 DB 기반
- 고객별 프로젝트 다수
- 상태 전이 관리

## 5. Data Upload / Object Storage

### 목적

실제 대용량 파일을 안정적으로 업로드하고 저장한다.

### 기능

- upload session persistence
- object storage adapter
  - S3 multipart
  - GCS resumable
  - Azure block blob
  - self-host minio
- resumable upload
- checksum/etag
- retry/backoff
- abort/cancel
- upload expiration

### 화면 구성

- Upload list
- Upload detail
- Part/progress state
- Failed upload recovery
- Storage object link/status

### 상태

- created
- uploading
- paused
- completed
- cancelled
- failed
- expired

### MVP-A와 차이

MVP-A는 body를 저장하지 않는 mock protocol이다. MVP-B는 session metadata와 object bytes를 실제 저장소에 남긴다.

## 6. Processing Jobs

### 목적

업로드 후 변환/분석 작업의 진행 상태를 추적한다.

### 작업 종류

- COG conversion
- 3D Tiles conversion
- point cloud tiling
- thumbnail generation
- metadata extraction
- GeoAI inference
- report export

### 화면 구성

- Processing job list
- Job detail
- Progress timeline
- Logs/errors
- Retry action
- Cancel action

### 상태

- queued
- running
- succeeded
- failed
- cancelled
- retrying

## 7. COG / Orthomosaic Pipeline

### 목적

정사영상 파일을 web viewer에서 스트리밍 가능한 COG/tile 형태로 처리한다.

### 기능

- GeoTIFF/orthomosaic upload
- COG conversion
- bounds extraction
- overview generation
- tile/range serving
- metadata persistence

### UI

- dataset processing status
- map preview
- bounds/CRS metadata
- conversion log

## 8. 3D Tiles Pipeline

### 목적

3D mesh/model 데이터를 Cesium viewer에서 사용할 수 있도록 처리한다.

### 기능

- 3D Tiles archive 등록
- tileset.json validation
- static hosting
- bounding volume metadata
- LOD health check
- sample preview

### UI

- 3D tiles dataset detail
- tileset validation result
- viewer preview
- load/error status

## 9. Point Cloud Pipeline

### 목적

point cloud 데이터를 production viewer 또는 변환 파이프라인에 연결한다.

### MVP-B 결정 후보

#### Path A — 3D Tiles `.pnts` + Cesium

- `.las/.laz`를 `.pnts` tileset으로 변환
- 기존 Cesium viewer를 계속 사용
- rendered-point fidelity가 충분한 고객에게 적합

#### Path B — COPC/LAZ + separate renderer

- `.copc.laz`를 HTTP Range로 제공
- deck.gl/loaders.gl 또는 Potree류 renderer 사용
- raw per-point inspection이 필요할 때 선택

### UI

- point cloud dataset detail
- point count / density / CRS metadata
- preview availability
- conversion status
- viewer path indicator

## 10. GeoAI Inference / Analysis Jobs

### 목적

seed 결과가 아니라 실제 분석 작업을 실행하거나 외부 분석 결과를 등록한다.

### 기능

- model selection
- input dataset selection
- inference job start
- job status tracking
- result registration
- confidence/severity configuration

### UI

- Analysis job list
- Start analysis modal
- Job detail
- Result viewer
- Model metadata panel

### 제외 또는 후순위

- model training UI
- model marketplace
- multi-model ensemble

## 11. Review Workflow

### 목적

GeoAI 결과 검수를 여러 사용자가 지속적으로 수행할 수 있게 한다.

### 기능

- persisted review status
- reviewer assignment
- review notes
- status history
- filter by reviewer/status/severity
- conflict handling

### UI

- review queue
- object detail
- review action buttons
- comments/notes
- history timeline

### 상태

- pending
- needs_review
- accepted
- rejected
- resolved

## 12. Reports / Export

### 목적

검수 결과를 PDF/HTML 보고서로 생성하고 보관한다.

### 기능

- server-side headless capture
- report template versioning
- stored report records
- PDF export
- report regeneration
- report share/download

### UI

- report list
- report create flow
- report preview
- export progress
- download link

### MVP-B 추가점

- persistence
- generated file storage
- template version control
- access control

## 13. Audit Log

### 목적

운영 중 중요한 사용자/시스템 이벤트를 추적한다.

### 이벤트 예시

- login/logout
- upload started/completed/failed
- processing job state change
- review status changed
- report exported
- permission changed
- project archived/deleted

### UI

- audit log table
- filters
- event detail drawer
- export audit log

## 14. Admin / Operations

### 목적

운영자가 고객 환경과 처리 상태를 관리한다.

### 기능

- organization overview
- project health
- worker/job queue status
- storage usage
- failed jobs
- user activity

### UI

- admin dashboard
- queue monitor
- failed job detail
- storage usage panel

## 15. Deployment / Tenant Separation

### 목적

고객별 배포와 데이터 분리를 운영 가능하게 만든다.

### 기능

- single customer deployment
- environment configuration
- storage namespace separation
- secret management
- backup/restore policy

### UI 영향

- organization selector 또는 fixed organization banner
- environment label
- admin-only operational panels

## 16. MVP-B 화면 목록

| Route | Screen | Purpose |
|---|---|---|
| `/login` | Production login | real auth |
| `/dashboard` | Operational dashboard | real summaries |
| `/projects` | Project list | DB-backed |
| `/projects/new` | Project creation | project setup |
| `/projects/[id]` | Project detail | viewer + datasets + GeoAI |
| `/projects/[id]/datasets` | Dataset inventory | real uploaded data |
| `/projects/[id]/uploads` | Upload sessions | resumable upload |
| `/projects/[id]/jobs` | Processing jobs | worker progress |
| `/projects/[id]/geoai-results` | Analysis results | review workflow |
| `/projects/[id]/reports` | Reports | persisted report records |
| `/admin` | Admin dashboard | operations |
| `/admin/audit-log` | Audit log | event tracking |

## 17. MVP-B Priority

1. production auth / user model
2. project CRUD
3. storage adapter
4. upload persistence
5. processing job model
6. COG conversion
7. 3D Tiles registration/conversion
8. persisted GeoAI review
9. report export persistence
10. point cloud path decision implementation
11. audit log
12. admin operations

## 18. UI Design Guidance

- MVP-B는 운영 도구 성격이 강하므로 정보 밀도와 상태 추적이 중요하다.
- processing, upload, conversion은 timeline과 status badge가 핵심이다.
- destructive action은 confirmation이 필요하다.
- admin 화면은 고객 데모용 화면과 시각적으로 구분한다.
- error/retry 상태를 첫 설계부터 포함한다.
- customer-facing 화면과 operator-facing 화면을 섞지 않는다.
