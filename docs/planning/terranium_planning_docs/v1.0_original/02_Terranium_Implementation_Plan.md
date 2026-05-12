# Terranium 구현 계획서

문서 버전: v1.0  
작성일: 2026-05-08  
대상: 제품 책임자, 개발 리드, 프론트엔드, 백엔드, GIS, AI, DevOps, QA

## 1. 구현 전략 요약

Terranium은 일반적인 CRUD SaaS가 아니라 대용량 공간 데이터, 3D 렌더링, 비동기 데이터 처리, AI 분석, 보고서 생성, 엔터프라이즈 보안을 모두 포함하는 복합 플랫폼이다.

따라서 초기부터 모든 기능을 완성하려고 하기보다 다음 순서로 구현한다.

1. 인증, 조직, 프로젝트, 데이터셋의 기본 제품 골격 구축
2. 정사영상, 3D Tiles, Point Cloud를 볼 수 있는 뷰어 구축
3. 데이터 업로드와 처리 작업 큐 구축
4. GeoAI 분석 작업 실행과 결과 레이어 표시
5. 보고서 생성과 관리자 콘솔 구현
6. 인프라, 보안, 감사 로그, 백업을 엔터프라이즈 수준으로 확장

## 2. 권장 기술 스택

### 2.1 Frontend

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

역할:

- Next.js: 웹앱 프레임워크
- React/TypeScript: UI 개발 안정성
- CesiumJS: 3D 지구, 3D Tiles, 지형, 대규모 공간 데이터 뷰어
- MapLibre GL JS: 2D 지도, 벡터 타일, 정사영상 레이어
- deck.gl: 대량 포인트, 히트맵, 분석 오버레이
- TanStack Query: 서버 상태, 캐싱, 재시도
- Zustand/Jotai: 뷰어 상태, 레이어 상태, UI 상태

### 2.2 Backend API

권장:

- Python FastAPI
- Pydantic
- SQLAlchemy 또는 SQLModel
- Alembic
- PostgreSQL
- PostGIS
- Redis
- Celery, Dramatiq 또는 RQ
- WebSocket 또는 Server-Sent Events

역할:

- FastAPI: API 서버와 내부 서비스
- PostgreSQL/PostGIS: 업무 데이터와 공간 메타데이터 저장
- Redis: 캐시, 작업 큐 브로커, 세션 보조
- Celery/Dramatiq/RQ: 비동기 처리 작업
- WebSocket/SSE: 작업 상태, 알림, 미션 처리 상태 갱신

### 2.3 Spatial Data Processing

권장:

- GDAL
- PDAL
- PROJ
- Rasterio
- GeoPandas
- Shapely
- rio-tiler
- tippecanoe
- PotreeConverter 또는 Entwine
- Cesium 3D Tiles 변환 도구
- Cloud Optimized GeoTIFF
- COPC 또는 LAZ
- 3D Tiles

역할:

- GDAL/PROJ: 좌표계 변환, 래스터 처리
- PDAL: Point Cloud 처리
- Rasterio/GeoPandas/Shapely: Python 기반 공간 처리
- rio-tiler: COG 타일 제공
- Potree/COPC/3D Tiles: 대용량 포인트클라우드와 3D 스트리밍

### 2.4 GeoAI / MLOps

권장:

- PyTorch
- ONNX Runtime
- TorchServe 또는 Triton Inference Server
- MLflow
- DVC 또는 LakeFS
- NVIDIA CUDA
- Docker

모델 후보:

- YOLO 계열: 객체 탐지, 균열/도로 손상/불법 건축물
- U-Net 계열: 세그멘테이션, 침수 위험, 토지 피복
- Transformer 기반 segmentation 모델: 고해상도 항공영상 분석
- 시계열/그래프 기반 모델: 변화 탐지, 위험 예측

역할:

- PyTorch: 모델 학습
- ONNX Runtime/Triton: 추론 서버
- MLflow: 모델 버전과 실험 관리
- DVC/LakeFS: 학습 데이터 버전 관리
- CUDA: DGX H100 등 GPU 가속

### 2.5 Storage

권장:

- S3 호환 오브젝트 스토리지
- MinIO
- Synology NAS
- PostgreSQL
- Redis
- 로컬 고속 NVMe 작업 디스크

데이터 구분:

- 원본 파일: Object Storage 또는 NAS
- 처리 결과: Object Storage
- 타일 데이터: Object Storage 또는 Tile Server 스토리지
- 메타데이터: PostgreSQL/PostGIS
- 임시 처리 파일: Worker 로컬 디스크
- 캐시: Redis

### 2.6 Infrastructure

권장:

- Docker
- Docker Compose
- Kubernetes 또는 K3s
- Nginx 또는 Traefik
- GitHub Actions 또는 GitLab CI
- Terraform 또는 Ansible
- Prometheus
- Grafana
- Loki
- OpenTelemetry

배포 유형:

- 개발 환경: Docker Compose
- 파일럿 환경: 단일 서버 또는 소규모 K3s
- 엔터프라이즈 환경: Kubernetes, 분리된 데이터/AI/웹 노드
- 폐쇄망 환경: 사설 패키지 저장소와 오프라인 이미지 레지스트리

## 3. 시스템 아키텍처

### 3.1 논리 아키텍처

구성 요소:

- Web App
- API Gateway
- Auth Service
- Project Service
- Dataset Service
- Layer Service
- Processing Service
- GeoAI Service
- Simulation Service
- Report Service
- Admin Service
- Notification Service
- Tile Service
- Object Storage
- PostgreSQL/PostGIS
- Redis Queue
- Worker Cluster
- Model Serving Cluster

### 3.2 기본 요청 흐름

사용자가 프로젝트에 접속한다.

1. Web App이 API 서버에서 프로젝트 메타데이터를 조회한다.
2. 레이어 목록을 조회한다.
3. 정사영상/3D Tiles/Point Cloud 타일 URL을 요청한다.
4. MapLibre/Cesium이 타일 서버 또는 오브젝트 스토리지에서 데이터를 스트리밍한다.
5. 분석 결과 레이어는 API에서 벡터/래스터/타일 형태로 받아 표시한다.

### 3.3 데이터 처리 흐름

사용자가 데이터를 업로드한다.

1. 업로드 세션 생성
2. 청크 업로드
3. 무결성 검증
4. 원본 파일 등록
5. 처리 작업 생성
6. Worker가 좌표계, 메타데이터, 썸네일, 타일 변환 수행
7. 처리 결과 파일 저장
8. Layer 생성
9. 작업 완료 알림

### 3.4 GeoAI 분석 흐름

사용자가 분석을 실행한다.

1. 분석 모듈과 입력 레이어 선택
2. 파라미터 검증
3. AnalysisJob 생성
4. Worker 또는 Model Server 호출
5. 결과 마스크/벡터/객체 테이블 생성
6. 결과 레이어 생성
7. 신뢰도와 통계 계산
8. 사용자 검수 상태로 전환
9. 보고서 생성 가능 상태로 전환

## 4. 저장 포맷과 데이터 표준

### 4.1 래스터

권장 포맷:

- GeoTIFF
- Cloud Optimized GeoTIFF
- PNG/JPEG 타일

메타데이터:

- 좌표계
- 해상도
- GSD
- 촬영일
- 센서
- 처리 소프트웨어
- 원본 파일 연결

### 4.2 Point Cloud

권장 포맷:

- LAS
- LAZ
- COPC
- 3D Tiles Point Cloud

메타데이터:

- 점 개수
- 밀도
- 좌표계
- 고도 기준
- 분류 코드
- 처리 버전

### 4.3 3D Mesh

권장 포맷:

- glTF
- 3D Tiles

메타데이터:

- 타일셋 경로
- 원본 모델 경로
- LOD 정보
- 텍스처 정보
- 좌표계

### 4.4 벡터

권장 포맷:

- GeoJSON
- FlatGeobuf
- Vector Tiles
- PostGIS Geometry

사용처:

- 프로젝트 경계
- 촬영 구역
- GCP/CP
- 분석 결과 객체
- 위험 구역
- 대피 경로

## 5. 데이터베이스 설계 초안

### 5.1 핵심 테이블

organizations:

- id
- name
- plan
- data_residency
- created_at

users:

- id
- organization_id
- email
- name
- status
- last_login_at

roles:

- id
- organization_id
- name
- description

permissions:

- id
- code
- name

role_permissions:

- role_id
- permission_id

projects:

- id
- organization_id
- name
- description
- site_name
- srid
- boundary_geom
- status
- created_by
- created_at

missions:

- id
- project_id
- name
- sensor_type
- target_gsd_cm
- altitude_m
- overlap_front
- overlap_side
- status
- flight_boundary_geom

datasets:

- id
- project_id
- mission_id
- name
- type
- srid
- gsd_cm
- captured_at
- status
- storage_prefix

layers:

- id
- project_id
- dataset_id
- name
- layer_type
- tile_url
- bounds_geom
- min_zoom
- max_zoom
- style_json
- visible_default

processing_jobs:

- id
- dataset_id
- job_type
- status
- progress
- input_uri
- output_uri
- error_message
- started_at
- finished_at

geoai_models:

- id
- name
- module_type
- version
- status
- metrics_json
- endpoint_url

analysis_jobs:

- id
- project_id
- dataset_id
- model_id
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

reports:

- id
- project_id
- title
- template_type
- status
- pdf_uri
- created_by
- approved_by

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

## 6. API 설계 초안

### 6.1 인증

- POST /auth/login
- POST /auth/logout
- POST /auth/refresh
- GET /auth/me

### 6.2 조직/사용자

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

### 6.4 미션

- GET /projects/{project_id}/missions
- POST /projects/{project_id}/missions
- GET /missions/{mission_id}
- PATCH /missions/{mission_id}

### 6.5 데이터셋

- GET /projects/{project_id}/datasets
- POST /projects/{project_id}/datasets
- POST /datasets/{dataset_id}/upload-session
- POST /datasets/{dataset_id}/complete-upload
- GET /datasets/{dataset_id}
- PATCH /datasets/{dataset_id}

### 6.6 레이어

- GET /projects/{project_id}/layers
- POST /projects/{project_id}/layers
- PATCH /layers/{layer_id}
- DELETE /layers/{layer_id}

### 6.7 처리 작업

- POST /datasets/{dataset_id}/processing-jobs
- GET /processing-jobs/{job_id}
- GET /processing-jobs/{job_id}/events
- POST /processing-jobs/{job_id}/cancel

### 6.8 GeoAI

- GET /geoai/models
- POST /analysis-jobs
- GET /analysis-jobs/{job_id}
- GET /analysis-jobs/{job_id}/results
- PATCH /analysis-results/{result_id}/review

### 6.9 보고서

- GET /projects/{project_id}/reports
- POST /projects/{project_id}/reports
- GET /reports/{report_id}
- POST /reports/{report_id}/export
- PATCH /reports/{report_id}/approve

### 6.10 관리자

- GET /admin/api-keys
- POST /admin/api-keys
- POST /admin/api-keys/{key_id}/rotate
- GET /admin/audit-logs
- GET /admin/infrastructure
- GET /admin/backups
- POST /admin/backups/{backup_id}/restore-test

## 7. 프론트엔드 구현 계획

### 7.1 앱 구조

권장 라우트:

- /login
- /dashboard
- /projects
- /projects/[projectId]
- /projects/[projectId]/viewer
- /projects/[projectId]/missions
- /projects/[projectId]/datasets
- /projects/[projectId]/geoai
- /projects/[projectId]/simulation
- /projects/[projectId]/reports
- /admin/users
- /admin/roles
- /admin/api-keys
- /admin/models
- /admin/infrastructure
- /admin/audit-logs
- /admin/security
- /admin/backups

### 7.2 주요 UI 컴포넌트

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
- LayerPanel
- ObjectPropertyPanel
- MeasurementToolbar
- TimelineScrubber
- AnalysisLegend
- SplitCompareView

관리자:

- UserTable
- RolePermissionMatrix
- ApiKeyTable
- ModelRegistryTable
- InfrastructureHealthGrid
- AuditLogTable
- SecurityPolicyForm
- BackupTimeline

### 7.3 상태 관리

서버 상태:

- TanStack Query 사용
- 프로젝트, 데이터셋, 레이어, 분석 작업은 query key 규칙을 명확히 정의
- 작업 상태는 polling 또는 SSE로 갱신

클라이언트 상태:

- 현재 프로젝트
- 지도 카메라 위치
- 선택 레이어
- 표시 레이어 순서
- 측정 도구 상태
- 선택 객체
- UI 패널 열림/닫힘

## 8. 백엔드 구현 계획

### 8.1 서비스 레이어

권장 모듈:

- auth
- organizations
- users
- projects
- missions
- datasets
- layers
- processing
- geoai
- simulation
- reports
- admin
- audit
- notifications

### 8.2 인증과 권한

구현 항목:

- JWT 또는 서버 세션
- Refresh token
- Password hashing
- RBAC
- Project-level ACL
- API Key auth
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
- 데이터 업로드/삭제
- 분석 실행
- 보고서 내보내기
- API 키 생성/회전
- 백업 복구 실행

구현 원칙:

- 비동기 기록
- append-only
- 주요 payload 마스킹
- CSV 내보내기 지원

## 9. 공간 데이터 처리 파이프라인

### 9.1 정사영상 처리

입력:

- GeoTIFF
- TIFF
- JPEG/PNG + world file

처리:

1. 좌표계 확인
2. bounds 계산
3. COG 생성
4. 타일 인덱스 생성
5. 썸네일 생성
6. 레이어 등록

출력:

- COG
- tile endpoint
- thumbnail
- metadata

### 9.2 Point Cloud 처리

입력:

- LAS
- LAZ

처리:

1. 좌표계 확인
2. 통계 계산
3. 점 밀도 계산
4. COPC 또는 3D Tiles 변환
5. LOD 생성
6. 레이어 등록

출력:

- COPC/3D Tiles
- bounds
- point count
- density stats

### 9.3 3D Mesh 처리

입력:

- OBJ
- FBX
- glTF
- textured mesh

처리:

1. 모델 검증
2. 좌표 변환
3. glTF 변환
4. 3D Tiles 생성
5. 텍스처 최적화
6. 레이어 등록

### 9.4 벡터 처리

입력:

- SHP
- GeoJSON
- DXF
- CSV with coordinates

처리:

1. 좌표계 확인
2. geometry validation
3. PostGIS 저장
4. vector tile 생성 또는 API 제공

## 10. GeoAI 구현 계획

### 10.1 모듈 인터페이스 표준화

모든 GeoAI 모듈은 동일한 인터페이스를 따른다.

입력:

- dataset_id
- layer_id
- area_of_interest
- parameters
- model_version

출력:

- raster mask
- vector features
- summary metrics
- confidence score
- thumbnails
- report fragments

### 10.2 초기 모델 우선순위

1순위:

- 침수 위험 예측
- 지반침하 탐지
- 구조물 균열 분석

2순위:

- 도로 손상 평가
- 불법 건축물 탐지
- 농지 경계 분석

3순위:

- 산림 분석
- 탄소 산출량 측정
- 해안 침식 모니터링
- 도시 열섬 분석

### 10.3 모델 레지스트리

관리 항목:

- 모델명
- 모듈 타입
- 버전
- 학습 데이터셋
- 평가 지표
- 배포 상태
- 엔드포인트
- 롤백 버전

### 10.4 분석 결과 검수

상태:

- draft
- auto_detected
- reviewed
- approved
- rejected

검수 기능:

- 객체 삭제
- 객체 등급 변경
- 신뢰도 임계값 조정
- 코멘트 작성
- 승인 이력 저장

## 11. TerraSim 구현 계획

초기 구현은 범용 물리 시뮬레이터보다 업무 의사결정형 시나리오 도구로 접근한다.

### 11.1 침수 시뮬레이션 MVP

입력:

- DEM/DSM
- 강우량
- 배수 조건
- 관심 구역
- 시설물 위치

출력:

- 위험도 래스터
- 예상 수위
- 피해 면적
- 취약 시설 목록
- 대피 경로 후보

주의:

- 초기 버전은 의사결정 보조용으로 명시한다.
- 법적/재난 책임 문구를 보고서에 포함한다.

## 12. 보고서 생성 구현

### 12.1 템플릿 엔진

권장:

- HTML 기반 템플릿
- PDF 렌더링
- 서버 사이드 차트 이미지 생성
- 지도 캡처 이미지 저장

보고서 구성:

- 표지
- 프로젝트 개요
- 데이터셋 요약
- 분석 방법
- 위험도 지도
- 결과 표
- 검증 지표
- 결론
- 부록

### 12.2 승인 흐름

상태:

- draft
- review_requested
- approved
- exported
- archived

필수 이력:

- 작성자
- 검토자
- 승인자
- PDF 생성 시각
- 공유 링크 생성 시각

## 13. 관리자 콘솔 구현 상세

### 13.1 사용자 관리

기능:

- 사용자 목록
- 초대
- 비활성화
- 역할 변경
- 조직 변경
- 마지막 로그인 확인

### 13.2 권한 매트릭스

기능:

- 역할별 권한 체크
- 모듈별 보기/생성/수정/삭제/내보내기/승인 권한
- 변경 이력 저장
- 권한 템플릿 적용

### 13.3 API 키 관리

기능:

- API 키 생성
- 키 prefix 표시
- secret은 최초 1회만 표시
- scope 설정
- rate limit 설정
- 키 회전
- 사용량 차트

### 13.4 모델 관리

기능:

- 모델 목록
- 버전 목록
- 배포 상태
- 성능 지표
- 엔드포인트 상태
- 롤백
- 새 버전 배포

### 13.5 인프라 상태

기능:

- 서버 상태
- GPU 사용률
- CPU/Memory
- 스토리지
- 작업 큐
- API 상태
- Tile Server 상태
- 모델 서버 상태

### 13.6 감사 로그

기능:

- 이벤트 검색
- 사용자 필터
- 프로젝트 필터
- 심각도 필터
- CSV 내보내기
- 상세 이벤트 drawer

### 13.7 보안 설정

기능:

- MFA
- SSO
- IP allowlist
- 세션 정책
- 암호화 상태
- 데이터 주권 표시
- 외부 클라우드 의존 여부

### 13.8 백업 복구

기능:

- 백업 상태
- 복구 지점
- 복구 테스트
- 보관 정책
- 암호화 백업
- 스토리지 사용량

## 14. DevOps와 배포

### 14.1 환경

환경 구분:

- local
- dev
- staging
- production
- on-premise

### 14.2 CI/CD

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
10. deploy production

### 14.3 모니터링

수집 지표:

- API latency
- API error rate
- DB query latency
- queue length
- worker failure rate
- tile request latency
- storage usage
- GPU utilization
- model inference latency

로그:

- API access log
- application log
- worker log
- model serving log
- audit log

알림:

- API 오류율 증가
- 작업 큐 적체
- 스토리지 임계치 초과
- GPU 서버 장애
- 백업 실패
- 로그인 실패 급증

## 15. QA 계획

### 15.1 테스트 유형

- Unit Test
- Integration Test
- E2E Test
- API Contract Test
- Spatial Data Regression Test
- Visual Regression Test
- Load Test
- Security Test

### 15.2 핵심 테스트 시나리오

- 사용자가 프로젝트를 생성하고 데이터셋을 업로드한다.
- 정사영상이 지도에서 정상 표시된다.
- 3D Tiles가 Cesium에서 정상 표시된다.
- Point Cloud가 일정 성능 이상으로 로딩된다.
- GeoAI 분석 작업이 큐에 등록되고 완료된다.
- 분석 결과 레이어가 지도에 표시된다.
- 보고서가 PDF로 생성된다.
- 권한이 없는 사용자가 프로젝트에 접근하지 못한다.
- 감사 로그가 생성된다.
- 백업 복구 테스트가 성공한다.

## 16. 보안 체크리스트

- HTTPS 강제
- HttpOnly secure cookie 또는 안전한 token storage
- RBAC 적용
- Project-level ACL 적용
- API key hashing
- Rate limiting
- File upload validation
- Malware scanning 옵션
- SQL injection 방지
- XSS 방지
- CORS 제한
- 감사 로그
- 백업 암호화
- secret manager 사용

## 17. 예상 개발 조직

최소 MVP 팀:

- Product Owner 1명
- Project Manager 1명
- UX/UI Designer 1명
- Frontend Engineer 2명
- Backend Engineer 2명
- GIS/Data Engineer 1명
- AI Engineer 1명
- DevOps Engineer 1명
- QA Engineer 1명

확장 팀:

- 3D/GIS Specialist
- MLOps Engineer
- Security Engineer
- Technical Writer
- Customer Success Engineer

## 18. 일정 계획

### 18.1 MVP 16주 계획

1-2주차:

- 요구사항 확정
- 정보구조/UX 설계
- 기술 검증
- 저장 포맷 결정
- 레포지토리와 개발 환경 구성

3-4주차:

- 인증/조직/사용자
- 프로젝트 CRUD
- 기본 AppShell
- DB 스키마 1차

5-6주차:

- 데이터셋 업로드
- 오브젝트 스토리지 연동
- 처리 작업 큐
- 정사영상 처리 MVP

7-8주차:

- 2D 지도 뷰어
- 3D 뷰어
- 레이어 패널
- 측정 도구 MVP

9-10주차:

- Point Cloud/3D Tiles 처리
- 데이터 관리 화면
- 미션/QC 화면

11-12주차:

- GeoAI 분석 작업 연동
- 분석 결과 레이어
- 결과 테이블
- 검수 상태

13-14주차:

- 보고서 생성
- 관리자 콘솔
- 감사 로그
- API 키 기본 관리

15주차:

- 성능 개선
- 보안 점검
- E2E 테스트
- 데모 데이터 정리

16주차:

- 파일럿 배포
- 운영 매뉴얼
- 고객 데모
- 버그 수정

### 18.2 Pilot 12주 추가 계획

- 실제 고객 데이터 적용
- 좌표계/포맷 예외 처리 강화
- GeoAI 정확도 개선
- 보고서 템플릿 고도화
- 인프라 모니터링 강화
- 백업/복구 리허설
- 권한 모델 세분화

## 19. 산출물

기획:

- PRD
- IA
- 사용자 플로우
- 화면 정의서
- 권한 매트릭스

디자인:

- 디자인 시스템
- 주요 화면 Figma
- 지도/3D 뷰어 UX 설계
- 관리자 콘솔 화면

개발:

- API 명세
- DB ERD
- 인프라 구성도
- 데이터 처리 파이프라인 문서
- 모델 레지스트리 규격
- 배포 스크립트

운영:

- 운영 매뉴얼
- 장애 대응 매뉴얼
- 백업 복구 절차
- 보안 정책
- 고객 온보딩 가이드

## 20. 오픈 이슈

- 초기 고객 도메인을 어느 분야로 고정할지 결정 필요
- 초기 GeoAI 모듈 범위 확정 필요
- SaaS와 온프레미스 중 우선 배포 모델 결정 필요
- 3D Tiles 변환 파이프라인의 표준 도구 결정 필요
- 보고서 템플릿 법적 문구 검토 필요
- 고객 데이터 반출과 폐기 정책 확정 필요

