# Terranium 구현 계획서

문서 버전: v1.1  
작성일: 2026-05-08  
이전 문서: 02_Terranium_Implementation_Plan.md v1.0  
참고 문서: 03_Terranium_Full_Reevaluation.md, 04_Terranium_PRD_v1.1.md  
대상: 제품 책임자, 개발 리드, 프론트엔드, 백엔드, GIS, AI, DevOps, QA

## 0. 개정 이력

v1.1 주요 변경:

- 16주 단일 MVP 계획을 PoC, MVP-A, MVP-B/Pilot로 분리
- TerraSim을 MVP 구현 범위에서 제외
- GeoAI 초기 범위를 1개 대표 모델로 축소
- SaaS보다 단일 고객 구축형 파일럿 우선 배포로 조정
- 데이터 규모별 성능 검증 기준 추가
- UploadSession, DatasetAsset, TileAsset, ProjectMember, ReportTemplate 등 누락 데이터 모델 추가
- 관리자 콘솔의 고급 기능을 Pilot 이후로 이동
- 법적 책임, 검수 승인, 감사 로그, 데이터 반출 구현 항목 강화

## 1. 구현 전략 요약

Terranium은 일반 CRUD SaaS가 아니라 대용량 공간 데이터, 3D 렌더링, 비동기 데이터 처리, GeoAI 분석, 검수 워크플로우, 보고서 생성, 엔터프라이즈 보안을 포함하는 복합 플랫폼이다.

초기 구현 원칙:

1. 기술 리스크를 먼저 검증한다.
2. 고객 데모용 제품 경험과 파일럿 운영 제품을 분리한다.
3. GeoAI는 1개 대표 모델로 시작한다.
4. TerraSim은 MVP에서 제외한다.
5. SaaS보다 단일 고객 구축형 파일럿을 먼저 완성한다.
6. 모든 자동 분석 결과는 검수와 승인 흐름을 전제로 한다.

## 2. 구현 단계

### 2.1 Phase 0: 기술 PoC

기간: 2~3주

목표:

- 개발 착수 전 핵심 기술 리스크 제거

검증 항목:

- COG 기반 정사영상 표시
- 3D Tiles 표시
- Point Cloud 표시
- MapLibre와 Cesium 전환 UX
- 지도 캡처 후 PDF 삽입
- GeoAI 결과 레이어 스키마
- 청크 업로드 프로토타입

성공 기준:

- 샘플 정사영상이 2D 지도에서 표시된다.
- 샘플 3D Tiles가 Cesium에서 표시된다.
- 1억 점 이하 point cloud 샘플 표시 가능성을 확인한다.
- 분석 결과 GeoJSON 또는 vector tile이 지도에 표시된다.
- 보고서 PDF에 지도 이미지와 결과 표가 삽입된다.

### 2.2 Phase 1: MVP-A 고객 데모

기간: 8주

목표:

- 고객 미팅과 제안에서 사용할 수 있는 데모 제품 경험 제공

구현 범위:

- 로그인과 기본 AppShell
- 대시보드
- 프로젝트 목록과 상세
- 사전 처리된 데이터셋 등록
- 2D/3D 뷰어
- 레이어 패널
- 측정 도구 기본
- 1개 GeoAI 분석 결과 표시
- 검수 UI 기본
- 보고서 PDF 샘플 생성

제외:

- 실제 대용량 처리 자동화
- 실시간 모델 추론
- 복잡한 관리자 콘솔
- TerraSim
- 백업/복구 UI
- SaaS 과금

### 2.3 Phase 2: MVP-B 파일럿

기간: 16주

목표:

- 실제 고객 데이터 1~2건으로 업로드, 처리, 시각화, 분석, 검수, 보고서 생성까지 운영 검증

구현 범위:

- 조직/사용자/역할/프로젝트 권한
- 청크 업로드와 재개
- COG 변환
- 3D Tiles 등록
- Point Cloud 변환 1종
- 처리 작업 큐
- 분석 작업 큐
- 1개 GeoAI 모델 실제 실행 또는 추론 서버 연동
- 분석 결과 검수와 승인
- 보고서 템플릿 1~2종
- 감사 로그
- 관리자 기본 화면
- 단일 고객 구축형 배포

## 3. 권장 기술 스택

### 3.1 Frontend

권장:

- Next.js
- React
- TypeScript
- Tailwind CSS 또는 CSS Modules
- TanStack Query
- Zustand 또는 Jotai
- MapLibre GL JS
- CesiumJS
- deck.gl
- shadcn/ui 또는 자체 디자인 시스템
- React Hook Form
- Zod

주의:

- 2D 지도와 3D 뷰어 상태를 무리하게 하나로 합치지 않는다.
- 뷰어 상태, 레이어 상태, 서버 상태를 분리한다.
- Cesium 리소스 생명주기와 메모리 해제를 명확히 처리한다.

### 3.2 Backend API

권장:

- Python FastAPI
- Pydantic
- SQLAlchemy 또는 SQLModel
- Alembic
- PostgreSQL
- PostGIS
- Redis
- Celery, Dramatiq 또는 RQ
- Server-Sent Events 우선, 필요 시 WebSocket

원칙:

- API 서버는 요청 처리와 권한 검증에 집중한다.
- 대용량 처리와 GeoAI 실행은 worker로 분리한다.
- organization_id와 project_id 필터를 서비스와 DB 쿼리에서 강제한다.

### 3.3 Spatial Data Processing

권장:

- GDAL
- PDAL
- PROJ
- Rasterio
- GeoPandas
- Shapely
- rio-tiler
- tippecanoe
- Cesium 3D Tiles 변환 도구
- Cloud Optimized GeoTIFF
- LAZ/COPC
- 3D Tiles

MVP 우선 표준:

- Raster: GeoTIFF 입력, COG 출력
- 3D Mesh: 3D Tiles 등록 우선
- Point Cloud: LAZ 입력, COPC 또는 3D Tiles point cloud 출력 중 PoC 후 택일
- Vector: GeoJSON/PostGIS 우선, 필요 시 vector tile

### 3.4 GeoAI / MLOps

권장:

- PyTorch
- ONNX Runtime 또는 Triton Inference Server
- MLflow
- Docker
- CUDA

MVP 원칙:

- 학습 플랫폼보다 추론과 결과 검수에 집중한다.
- 모델 레지스트리는 MVP에서 최소 메타데이터만 관리한다.
- 첫 모델은 균열 탐지 또는 도로 손상 평가 중 하나로 고정한다.
- 다른 모델은 mocked result 또는 rule-based baseline으로 데모할 수 있다.

### 3.5 Storage

권장:

- S3 호환 오브젝트 스토리지
- MinIO
- Synology NAS
- PostgreSQL/PostGIS
- Redis
- Worker 로컬 NVMe 작업 디스크

데이터 구분:

- 원본 파일: Object Storage 또는 NAS
- 처리 결과: Object Storage
- 타일 데이터: Object Storage 또는 Tile Service 스토리지
- 메타데이터: PostgreSQL/PostGIS
- 임시 처리 파일: Worker 로컬 디스크
- 캐시: Redis

### 3.6 Infrastructure

권장:

- Docker
- Docker Compose
- K3s
- Nginx 또는 Traefik
- GitHub Actions 또는 GitLab CI
- Prometheus
- Grafana
- Loki
- OpenTelemetry

배포 우선순위:

- local: Docker Compose
- dev/staging: 단일 서버 Docker Compose 또는 K3s
- pilot: 단일 고객 구축형
- enterprise: Kubernetes, 폐쇄망, 사설 레지스트리

## 4. 시스템 아키텍처

### 4.1 MVP-B 논리 구성

구성 요소:

- Web App
- API Server
- Auth/RBAC Module
- Project Service
- Dataset Service
- Layer Service
- Upload Service
- Processing Service
- GeoAI Service
- Report Service
- Admin Service
- Audit Service
- Notification Service
- Tile Service
- Object Storage
- PostgreSQL/PostGIS
- Redis Queue
- Worker
- Model Runtime

### 4.2 데이터 처리 흐름

1. 사용자가 업로드 세션을 생성한다.
2. 클라이언트가 파일을 청크로 업로드한다.
3. 서버가 청크 상태와 checksum을 기록한다.
4. 업로드 완료 요청 시 무결성을 검증한다.
5. DatasetAsset과 StorageObject를 생성한다.
6. ProcessingJob을 생성한다.
7. Worker가 좌표계, bounds, 썸네일, COG/3D Tiles/COPC 변환을 수행한다.
8. 처리 결과를 TileAsset과 Layer로 등록한다.
9. 작업 완료 이벤트와 감사 로그를 기록한다.

### 4.3 GeoAI 분석 흐름

1. 사용자가 분석 대상 레이어와 모델 버전을 선택한다.
2. API가 파라미터, 권한, 데이터 상태를 검증한다.
3. AnalysisJob을 생성한다.
4. Worker 또는 Model Runtime이 추론을 실행한다.
5. 결과 mask, vector features, summary metrics를 저장한다.
6. AnalysisResult와 결과 Layer를 생성한다.
7. 결과 상태를 draft로 둔다.
8. 검수자가 결과를 reviewed 또는 rejected로 변경한다.
9. 승인자가 approved 처리하면 보고서 생성 가능 상태가 된다.

## 5. 데이터베이스 설계 v1.1

### 5.1 핵심 테이블

organizations:

- id
- name
- deployment_type
- data_residency
- created_at

users:

- id
- organization_id
- email
- name
- status
- last_login_at
- created_at

project_members:

- id
- project_id
- user_id
- role_id
- added_by
- created_at

projects:

- id
- organization_id
- name
- description
- site_name
- srid
- boundary_geom
- security_level
- status
- created_by
- created_at

datasets:

- id
- project_id
- mission_id
- name
- dataset_type
- srid
- gsd_cm
- captured_at
- status
- active_version_id
- created_at

dataset_assets:

- id
- dataset_id
- asset_type
- storage_object_id
- original_filename
- checksum
- file_size_bytes
- metadata_json
- created_at

storage_objects:

- id
- organization_id
- bucket
- object_key
- uri
- size_bytes
- content_type
- checksum
- storage_class
- created_at

upload_sessions:

- id
- dataset_id
- filename
- file_size_bytes
- chunk_size_bytes
- status
- checksum
- expires_at
- created_by
- created_at

upload_parts:

- id
- upload_session_id
- part_number
- size_bytes
- checksum
- status
- uploaded_at

layers:

- id
- project_id
- dataset_id
- name
- layer_type
- source_type
- source_uri
- bounds_geom
- min_zoom
- max_zoom
- style_id
- visible_default
- created_at

layer_styles:

- id
- name
- style_json
- created_by
- created_at

tile_assets:

- id
- dataset_id
- layer_id
- tile_type
- storage_prefix
- tileset_json_uri
- metadata_json
- created_at

processing_jobs:

- id
- dataset_id
- job_type
- status
- progress
- input_uri
- output_uri
- error_code
- error_message
- started_at
- finished_at

job_events:

- id
- job_type
- job_id
- level
- message
- payload_json
- created_at

geoai_models:

- id
- name
- module_type
- status
- created_at

model_versions:

- id
- model_id
- version
- artifact_uri
- metrics_json
- input_schema_json
- output_schema_json
- status
- created_at

analysis_jobs:

- id
- project_id
- dataset_id
- layer_id
- model_version_id
- status
- parameters_json
- progress
- started_by
- started_at
- finished_at

analysis_results:

- id
- analysis_job_id
- layer_id
- result_type
- summary_json
- confidence_avg
- review_status
- approved_by
- approved_at

analysis_reviews:

- id
- analysis_result_id
- reviewer_id
- action
- comment
- payload_json
- created_at

report_templates:

- id
- organization_id
- name
- template_type
- version
- template_uri
- status
- created_at

reports:

- id
- project_id
- report_template_id
- title
- status
- pdf_uri
- created_by
- approved_by
- created_at
- approved_at

report_approvals:

- id
- report_id
- approver_id
- action
- comment
- created_at

audit_logs:

- id
- organization_id
- user_id
- action
- resource_type
- resource_id
- ip_address
- user_agent
- payload_json
- created_at

external_shares:

- id
- project_id
- resource_type
- resource_id
- token_hash
- expires_at
- scope_json
- created_by
- created_at

data_retention_policies:

- id
- organization_id
- project_id
- retention_days
- archive_after_days
- delete_after_days
- created_at

## 6. API 설계 v1.1

### 6.1 인증

- POST /auth/login
- POST /auth/logout
- POST /auth/refresh
- GET /auth/me

### 6.2 조직/사용자/권한

- GET /organizations/current
- GET /users
- POST /users/invite
- PATCH /users/{user_id}
- GET /roles
- POST /roles
- PATCH /roles/{role_id}/permissions

### 6.3 프로젝트

- GET /projects
- POST /projects
- GET /projects/{project_id}
- PATCH /projects/{project_id}
- DELETE /projects/{project_id}
- GET /projects/{project_id}/members
- POST /projects/{project_id}/members
- PATCH /projects/{project_id}/members/{member_id}
- DELETE /projects/{project_id}/members/{member_id}

### 6.4 데이터셋과 업로드

- GET /projects/{project_id}/datasets
- POST /projects/{project_id}/datasets
- GET /datasets/{dataset_id}
- PATCH /datasets/{dataset_id}
- POST /datasets/{dataset_id}/upload-sessions
- GET /upload-sessions/{session_id}
- PUT /upload-sessions/{session_id}/parts/{part_number}
- POST /upload-sessions/{session_id}/complete
- POST /upload-sessions/{session_id}/abort

### 6.5 레이어

- GET /projects/{project_id}/layers
- POST /projects/{project_id}/layers
- PATCH /layers/{layer_id}
- DELETE /layers/{layer_id}
- GET /layers/{layer_id}/tile-url

### 6.6 처리 작업

- POST /datasets/{dataset_id}/processing-jobs
- GET /processing-jobs/{job_id}
- GET /processing-jobs/{job_id}/events
- POST /processing-jobs/{job_id}/cancel

### 6.7 GeoAI

- GET /geoai/models
- GET /geoai/models/{model_id}/versions
- POST /analysis-jobs
- GET /analysis-jobs/{job_id}
- GET /analysis-jobs/{job_id}/events
- GET /analysis-jobs/{job_id}/results
- PATCH /analysis-results/{result_id}/review
- PATCH /analysis-results/{result_id}/approve

### 6.8 보고서

- GET /projects/{project_id}/reports
- POST /projects/{project_id}/reports
- GET /reports/{report_id}
- POST /reports/{report_id}/export
- PATCH /reports/{report_id}/approve
- GET /report-templates

### 6.9 공유와 반출

- POST /external-shares
- GET /external-shares/{share_id}
- DELETE /external-shares/{share_id}
- POST /datasets/{dataset_id}/download-request
- POST /reports/{report_id}/download-request

### 6.10 관리자

- GET /admin/audit-logs
- GET /admin/security
- PATCH /admin/security
- GET /admin/storage
- GET /admin/infrastructure
- GET /admin/backups

## 7. 프론트엔드 구현 계획

### 7.1 라우트

MVP-A:

- /login
- /dashboard
- /projects
- /projects/[projectId]
- /projects/[projectId]/viewer
- /projects/[projectId]/geoai
- /projects/[projectId]/reports

MVP-B:

- /projects/[projectId]/missions
- /projects/[projectId]/datasets
- /admin/users
- /admin/roles
- /admin/audit-logs
- /admin/security

Pilot 이후:

- /projects/[projectId]/simulation
- /admin/api-keys
- /admin/models
- /admin/infrastructure
- /admin/backups

### 7.2 주요 컴포넌트

공통:

- AppShell
- SidebarNav
- TopBar
- ProjectSelector
- DataTable
- FilterBar
- StatusBadge
- ConfirmDialog
- DetailDrawer
- FileUploadPanel
- JobProgressPanel

지도/뷰어:

- MapCanvas2D
- CesiumViewer
- ViewerModeToggle
- LayerPanel
- LayerOpacityControl
- ObjectPropertyPanel
- MeasurementToolbar
- AnalysisLegend
- ResultTable

보고서:

- ReportTemplateSelector
- ReportPreview
- ReportExportButton
- ApprovalTimeline

관리자:

- UserTable
- RolePermissionMatrix
- AuditLogTable
- SecurityPolicyForm

## 8. 백엔드 구현 계획

### 8.1 모듈

- auth
- organizations
- users
- roles
- projects
- project_members
- missions
- datasets
- uploads
- storage
- layers
- processing
- geoai
- reports
- audit
- shares
- admin
- notifications

### 8.2 인증과 권한

구현 항목:

- JWT 또는 서버 세션
- Refresh token
- Password hashing
- RBAC
- Project-level ACL
- API Key auth는 Pilot 이후
- Audit middleware

권한 체크 위치:

- API 라우터 진입 시 1차 검증
- 서비스 레이어에서 리소스 소유권 2차 검증
- 데이터베이스 쿼리에서 organization_id와 project_id 필터 강제

### 8.3 감사 로그

로그 대상:

- 로그인 성공/실패
- 사용자 초대/비활성화
- 권한 변경
- 프로젝트 생성/삭제
- 데이터 업로드/다운로드/삭제
- 처리 작업 실행
- 분석 실행
- 분석 검수와 승인
- 보고서 생성/승인/내보내기
- 외부 공유 링크 생성
- 보안 설정 변경

원칙:

- 비동기 기록
- append-only
- 주요 payload 마스킹
- CSV 내보내기
- 관리자도 임의 수정 불가

## 9. 공간 데이터 처리 파이프라인

### 9.1 정사영상

입력:

- GeoTIFF
- TIFF
- JPEG/PNG + world file

처리:

1. 좌표계 확인
2. bounds 계산
3. COG 생성
4. 썸네일 생성
5. tile endpoint 또는 source URI 생성
6. Layer 등록

MVP-B 목표:

- 5GB 데이터 안정 처리
- 20GB 데이터 파일럿 검증

### 9.2 Point Cloud

입력:

- LAS
- LAZ

처리:

1. 좌표계 확인
2. 통계 계산
3. 점 밀도 계산
4. COPC 또는 3D Tiles point cloud 변환
5. LOD 생성
6. Layer 등록

MVP-B 목표:

- 1억 점급 데이터 표시 검증

### 9.3 3D Mesh

입력:

- glTF
- OBJ
- FBX
- textured mesh

처리:

1. 모델 검증
2. 좌표 변환
3. glTF 변환
4. 3D Tiles 생성 또는 등록
5. 텍스처 최적화
6. Layer 등록

### 9.4 벡터

입력:

- SHP
- GeoJSON
- DXF
- CSV with coordinates

처리:

1. 좌표계 확인
2. geometry validation
3. PostGIS 저장
4. GeoJSON API 또는 vector tile 생성

## 10. GeoAI 구현 계획

### 10.1 초기 모델

첫 모델 후보:

- 구조물 균열 탐지
- 도로 손상 평가

선정 기준:

- 학습/검증 데이터 확보 가능성
- 고객 데모 설득력
- 법적 책임 부담
- 지도 레이어와 보고서 표현 용이성
- 현업 검수 가능성

### 10.2 모듈 인터페이스

입력:

- dataset_id
- layer_id
- area_of_interest
- parameters
- model_version
- requested_by

출력:

- raster mask
- vector features
- object table
- summary metrics
- confidence score
- thumbnails
- report fragments
- model_metadata

### 10.3 결과 검수 상태

상태:

- draft
- reviewed
- approved
- rejected

기능:

- 객체 삭제
- 객체 등급 변경
- 신뢰도 임계값 조정
- 코멘트 작성
- 승인 이력 저장
- 보고서 반영 여부 선택

### 10.4 평가 기준

모델별로 다음을 정의해야 한다.

- 입력 데이터 조건
- 최소 해상도 또는 GSD
- 지원 좌표계
- confidence threshold 기본값
- false positive 처리 방식
- false negative 검수 방식
- 보고서 표시 기준
- 결과 책임 문구

## 11. TerraSim 구현 원칙

MVP-A와 MVP-B에서는 구현하지 않는다.

Pilot 이후 접근:

- "침수 시뮬레이션"보다 "침수 취약도 분석"으로 시작한다.
- DEM/DSM 기반 단순 취약도 지표부터 검증한다.
- 강우량, 배수 조건, 대피 경로는 시나리오 비교 기능으로 후순위 구현한다.
- 보고서에는 의사결정 보조 문구와 데이터 한계를 반드시 포함한다.

## 12. 보고서 생성 구현

### 12.1 템플릿 엔진

권장:

- HTML 기반 템플릿
- PDF 렌더링
- 서버 사이드 차트 이미지 생성
- 지도 캡처 이미지 저장

MVP-A:

- 샘플 템플릿 1종
- 지도 이미지
- 결과 표
- 요약 문구
- PDF 생성

MVP-B:

- 내부 보고용 1종
- 고객 납품용 1종
- 보고서 생성 이력
- 승인 흐름
- 책임 고지 문구

### 12.2 보고서 상태

- draft
- review_requested
- approved
- exported
- archived

## 13. DevOps와 배포

### 13.1 환경

- local
- dev
- staging
- pilot
- production
- on-premise

### 13.2 CI/CD

파이프라인:

1. lint
2. type check
3. unit test
4. build
5. container image build
6. vulnerability scan
7. migration dry-run
8. deploy staging
9. smoke test
10. deploy pilot

### 13.3 모니터링

수집 지표:

- API latency
- API error rate
- DB query latency
- queue length
- worker failure rate
- tile request latency
- storage usage
- model inference latency
- upload failure rate
- report generation failure rate

알림:

- API 오류율 증가
- 작업 큐 적체
- 스토리지 임계치 초과
- worker 장애
- 백업 실패
- 로그인 실패 급증
- 대용량 업로드 반복 실패

## 14. QA 계획

### 14.1 테스트 유형

- Unit Test
- Integration Test
- E2E Test
- API Contract Test
- Spatial Data Regression Test
- Visual Regression Test
- Load Test
- Security Test

### 14.2 핵심 테스트 시나리오

- 사용자가 프로젝트를 생성한다.
- 사용자가 데이터셋을 생성하고 청크 업로드를 완료한다.
- 업로드 중단 후 재개가 가능하다.
- 정사영상이 지도에서 정상 표시된다.
- 3D Tiles가 Cesium에서 정상 표시된다.
- Point Cloud가 목표 성능 이상으로 표시된다.
- GeoAI 분석 작업이 큐에 등록되고 완료된다.
- 분석 결과 레이어가 지도에 표시된다.
- 검수자가 결과를 승인한다.
- 승인된 결과로 보고서가 PDF 생성된다.
- 권한이 없는 사용자가 프로젝트에 접근하지 못한다.
- 데이터 다운로드와 보고서 내보내기가 감사 로그에 기록된다.

## 15. 보안 체크리스트

- HTTPS 강제
- HttpOnly secure cookie 또는 안전한 token storage
- RBAC 적용
- Project-level ACL 적용
- API key hashing
- Rate limiting
- File upload validation
- Malware scanning 옵션
- Presigned URL 만료 정책
- SQL injection 방지
- XSS 방지
- CORS 제한
- 감사 로그
- 백업 암호화
- secret manager 사용
- 데이터 반출 로그
- 관리자 권한 변경 이력

## 16. 예상 개발 조직

MVP-A 최소 팀:

- Product Owner 1명
- UX/UI Designer 1명
- Frontend Engineer 1~2명
- Backend Engineer 1~2명
- GIS/Data Engineer 1명
- AI Engineer 1명

MVP-B 파일럿 팀:

- Product Owner 1명
- Project Manager 1명
- UX/UI Designer 1명
- Frontend Engineer 2명
- Backend Engineer 2명
- GIS/Data Engineer 1명
- AI Engineer 1명
- DevOps Engineer 1명
- QA Engineer 1명

## 17. 일정 계획

### 17.1 Phase 0 PoC: 2~3주

1주차:

- 샘플 데이터 확보
- COG 표시 PoC
- 3D Tiles 표시 PoC
- Point Cloud 표시 PoC

2주차:

- 지도 캡처와 PDF 생성 PoC
- GeoAI 결과 레이어 스키마 검증
- 청크 업로드 프로토타입

3주차:

- PoC 결과 정리
- 표준 포맷 결정
- MVP-A 범위 최종 확정

### 17.2 MVP-A: 8주

1-2주차:

- 정보구조/UX 설계
- AppShell
- 로그인
- 프로젝트 목록/상세

3-4주차:

- 2D 지도 뷰어
- 3D 뷰어
- 사전 처리 데이터 등록
- 레이어 패널

5-6주차:

- 측정 도구 기본
- GeoAI 결과 레이어
- 결과 테이블
- 검수 UI 기본

7-8주차:

- 보고서 PDF 샘플
- 대시보드
- 데모 데이터 정리
- 고객 데모 시나리오 작성

### 17.3 MVP-B 파일럿: 16주

1-2주차:

- 요구사항 확정
- 파일럿 고객 데이터 확인
- 레포지토리와 개발 환경 구성
- DB 스키마 1차

3-4주차:

- 조직/사용자/권한
- 프로젝트 멤버 관리
- 감사 로그 기본

5-6주차:

- 데이터셋 생성
- 청크 업로드
- 오브젝트 스토리지 연동
- 업로드 재개

7-8주차:

- 처리 작업 큐
- COG 변환
- 정사영상 레이어 등록

9-10주차:

- 3D Tiles 등록
- Point Cloud 변환 1종
- 데이터 관리 화면

11-12주차:

- GeoAI 분석 작업 연동
- 1개 모델 실행 또는 추론 서버 연동
- 결과 레이어와 결과 테이블

13-14주차:

- 검수와 승인 흐름
- 보고서 템플릿 1~2종
- PDF 내보내기

15주차:

- 성능 개선
- 보안 점검
- E2E 테스트
- 파일럿 배포 리허설

16주차:

- 파일럿 배포
- 운영 매뉴얼
- 고객 데모
- 버그 수정

## 18. 산출물

기획:

- PRD v1.1
- IA
- 사용자 플로우
- 화면 정의서
- 권한 매트릭스
- 파일럿 성공 기준

디자인:

- 디자인 시스템
- 주요 화면 Figma
- 지도/3D 뷰어 UX 설계
- 검수 UI
- 보고서 템플릿

개발:

- API 명세
- DB ERD
- 인프라 구성도
- 데이터 처리 파이프라인 문서
- GeoAI 결과 스키마
- 배포 스크립트

운영:

- 운영 매뉴얼
- 장애 대응 매뉴얼
- 백업 복구 절차
- 보안 정책
- 고객 온보딩 가이드
- 데이터 반출/폐기 정책

## 19. 오픈 이슈

- 첫 고객 도메인을 산업시설·공공시설 안전 점검으로 확정할지
- 첫 GeoAI 모델을 균열 탐지와 도로 손상 평가 중 무엇으로 할지
- Point Cloud 표준을 COPC와 3D Tiles point cloud 중 무엇으로 둘지
- 첫 파일럿 서버 사양
- 보고서 법적 책임 문구
- 고객 데이터 반출과 폐기 정책
- 폐쇄망 배포를 어느 단계부터 공식 지원할지

## 20. 핵심 기술 스택 요약

개정안 v1.1 기준 핵심 기술 스택은 다음과 같다.

- Frontend: Next.js, React, TypeScript
  - Terranium 웹앱 전체 UI 개발용이다.
- 2D 지도: MapLibre GL JS
  - 정사영상, 벡터 레이어, 분석 결과 레이어를 2D 지도에서 보여주는 역할이다.
- 3D 뷰어: CesiumJS
  - 3D Tiles, Point Cloud, 지형, 3D 디지털 트윈 표시용이다.
- Backend API: FastAPI
  - 프로젝트, 데이터셋, 분석, 보고서, 권한 같은 API 서버 핵심이다.
- Database: PostgreSQL + PostGIS
  - 일반 업무 데이터와 공간 좌표, 영역, 레이어 메타데이터 저장용이다.
- 비동기 작업: Redis + Celery/Dramatiq/RQ
  - 대용량 파일 처리, 타일 변환, GeoAI 분석처럼 오래 걸리는 작업을 큐로 처리한다.
- 공간 데이터 처리: GDAL, PDAL, PROJ
  - 정사영상, 좌표계, Point Cloud, 공간 데이터 변환의 핵심 도구다.
- 공간 데이터 포맷: COG, 3D Tiles, LAZ/COPC
  - COG는 정사영상, 3D Tiles는 3D 모델, LAZ/COPC는 Point Cloud용이다.
- GeoAI: PyTorch, ONNX Runtime 또는 Triton
  - 균열 탐지나 도로 손상 분석 같은 AI 모델 추론용이다.
- Storage/Infra: MinIO, Docker, K3s
  - 구축형 파일럿 기준으로 파일 저장, 컨테이너 실행, 소규모 배포에 적합하다.
