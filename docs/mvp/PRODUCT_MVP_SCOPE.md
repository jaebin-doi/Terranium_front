# Terranium MVP Scope

문서 상태: Draft  
기준 문서:

- `docs/planning/terranium_planning_docs/v1.1_revised/04_Terranium_PRD_v1.1.md`
- `docs/planning/terranium_planning_docs/v1.1_revised/05_Terranium_Implementation_Plan_v1.1.md`

## 1. 목적

이 문서는 Terranium 실제 제품 구현을 시작하기 전, 첫 구현 범위를 고정하기 위한 작업 기준이다.

현재 저장소에는 랜딩 사이트와 제품 기획 문서가 준비되어 있다. 다음 단계는 Next.js/FastAPI 기반 제품 구현으로 넘어가기 전, MVP-A 고객 데모에서 반드시 보여줄 업무 흐름과 데이터 구조를 확정하는 것이다.

## 2. 단계 정의

### Phase 0: 기술 PoC

목표: 핵심 기술 리스크를 제거한다.

검증 대상:

- COG 기반 정사영상 표시
- 3D Tiles 표시
- Point Cloud 표시 가능성
- 2D/3D 전환 UX
- GeoAI 결과 GeoJSON 레이어 표시
- 지도 캡처 후 PDF 보고서 삽입
- 청크 업로드 프로토타입

결과물:

- 실제 제품 UI 전체가 아니라 기술 검증용 최소 화면
- 샘플 데이터 기반 viewer/report/upload 검증

### Phase 1: MVP-A 고객 데모

목표: 고객 미팅과 제안에서 사용할 수 있는 제품 경험을 제공한다.

MVP-A는 "실제 대용량 자동 처리 플랫폼"이 아니라, 사전 처리된 샘플 데이터와 mocked processing 상태를 사용해 Terranium의 핵심 업무 흐름을 보여주는 데모 제품이다.

우선 구현 대상:

- 로그인 화면 또는 데모 진입
- AppShell
- 대시보드
- 프로젝트 목록
- 프로젝트 상세
- 데이터셋 등록/목록
- 2D/3D 뷰어
- 레이어 패널
- 측정 도구 기본 UI
- GeoAI 결과 레이어와 결과 테이블
- 검수 상태 변경
- 보고서 샘플 생성 화면

### Phase 2: MVP-B / Pilot

목표: 실제 고객 데이터 1~2건으로 업로드, 처리, 시각화, 분석, 검수, 보고서 생성을 운영 검증한다.

MVP-B에서 추가할 대상:

- 조직/사용자/역할/프로젝트 권한
- 청크 업로드와 재개
- COG 변환
- 3D Tiles 등록
- Point Cloud 변환 1종
- 처리 작업 큐
- 분석 작업 큐
- 실제 GeoAI 모델 실행 또는 추론 서버 연동
- 감사 로그
- 관리자 기본 화면
- 단일 고객 구축형 배포

## 3. MVP-A 핵심 목표

MVP-A의 목표는 다음 질문에 답하는 것이다.

> 고객이 Terranium을 보면 "우리 시설 점검 데이터를 프로젝트 단위로 올리고, 지도/3D에서 확인하고, AI 결과를 검수한 뒤 보고서 초안까지 만들 수 있겠다"라고 이해할 수 있는가?

성공 기준:

- 하나의 데모 프로젝트에서 전체 업무 흐름을 끊김 없이 보여준다.
- 2D/3D viewer가 제품의 중심 경험으로 보인다.
- GeoAI 결과는 자동 판단이 아니라 검수 가능한 레이어와 테이블로 표현된다.
- 보고서는 승인된 결과를 기반으로 생성되는 흐름으로 보인다.
- 대용량 처리, 실제 추론, 복잡한 관리자 기능은 없어도 제품 방향이 명확하다.

## 4. MVP-A 포함 범위

### 4.1 인증/진입

포함:

- 데모 로그인 화면
- 고정 데모 사용자
- 로그인 후 AppShell 진입

제외:

- 실제 회원가입
- 비밀번호 재설정
- SSO
- MFA
- 세션 보안 고도화

### 4.2 Dashboard

포함:

- 프로젝트 수
- 데이터셋 수
- 최근 처리 작업
- 위험 알림
- 최근 보고서
- 저장소 사용량 mock

제외:

- 실시간 운영 메트릭
- 조직별 고급 통계
- 비용/과금 정보

### 4.3 Project

포함:

- 프로젝트 목록
- 프로젝트 상세
- 프로젝트 상태
- 위치/현장 정보
- 최근 데이터셋
- 최근 GeoAI 결과

제외:

- 프로젝트 생성 wizard 고도화
- 고객별 복잡 권한
- 프로젝트 공유 링크

### 4.4 Dataset

포함:

- 사전 처리된 데이터셋 등록 UI
- 데이터셋 목록
- 데이터셋 타입 표시
  - orthomosaic
  - 3d_tiles
  - point_cloud
  - geoai_result
- 처리 상태 mock

제외:

- 실제 대용량 업로드
- 청크 업로드
- 서버 처리 큐
- GDAL/PDAL 변환 실행

### 4.5 Viewer

포함:

- 2D/3D 모드 전환 UI
- 2D 지도 영역
- 3D viewer 영역
- 레이어 ON/OFF
- 레이어 투명도
- 객체 선택 시 속성 패널
- 거리/면적 측정 도구 UI
- GeoAI 결과 레이어 표시
- 결과 테이블과 지도 선택 연동

MVP-A 구현 방식:

- 첫 구현은 viewer layout과 state contract를 우선한다.
- 실제 MapLibre/Cesium 연동은 Phase 0 결과에 따라 붙인다.
- 샘플 데이터는 mock JSON 또는 정적 GeoJSON으로 시작한다.

제외:

- 고성능 tile streaming 최적화
- point cloud 대용량 렌더링 최적화
- split compare
- 시간축 변화 비교
- 체적/단면 측정

### 4.6 GeoAI Review

포함:

- 1개 대표 모델 결과 표시
- 권장 대표 모델: 도로 손상 또는 구조물 균열 중 택일
- 결과 객체 목록
- confidence
- severity
- status
  - pending
  - accepted
  - rejected
  - needs_review
- 검수 의견 입력
- 상태 변경

제외:

- 실제 모델 학습/추론
- 모델 레지스트리
- 다중 모델 비교
- 자동 법적 판단

### 4.7 Report

포함:

- 보고서 목록
- 보고서 생성 화면
- 보고서 미리보기
- 지도 캡처 placeholder
- 검수 결과 요약
- PDF export 버튼 UI

MVP-A 구현 방식:

- 첫 구현은 HTML preview 중심
- 실제 PDF 생성은 Phase 0에서 별도 검증 후 연결

제외:

- 복잡한 템플릿 편집기
- 전자결재
- 외부 제출 시스템 연동

## 5. MVP-A 제외 범위

다음은 MVP-A에서 구현하지 않는다.

- 실제 대용량 파일 처리 자동화
- 실제 GeoAI 추론 서버
- 실제 청크 업로드
- 복잡한 관리자 콘솔
- SaaS 가입/결제/과금
- 고객별 독립 테넌트 운영
- API Key 관리
- 백업/복구 UI
- TerraSim
- 재난 물리 시뮬레이션
- 실시간 드론 영상 스트리밍
- 범용 CAD/BIM 편집

## 6. 사용자 역할

### Facility Reviewer

시설 안전·환경 담당자.

주요 작업:

- 프로젝트 대시보드 확인
- 위험 객체 검토
- 지도에서 위치 확인
- 검수 상태 변경
- 보고서 초안 확인

### Drone Operator

드론 측량 운영자.

주요 작업:

- 프로젝트와 데이터셋 상태 확인
- 촬영/처리된 데이터셋 등록
- 처리 상태 확인

### GeoAI Reviewer

GeoAI 분석 결과 검수자.

주요 작업:

- 분석 결과 목록 확인
- 객체별 confidence/severity 확인
- 오탐/누락 의견 입력
- 결과 승인 또는 반려

### Admin

MVP-A에서는 완전한 관리자 콘솔을 구현하지 않는다.

표현 범위:

- 데모 사용자/조직은 mock
- 권한 관리는 화면 노출 기준만 둔다.

## 7. 핵심 워크플로우

### 7.1 고객 데모 기본 흐름

```text
로그인
→ 대시보드
→ 프로젝트 선택
→ 데이터셋 확인
→ 2D/3D 뷰어 진입
→ GeoAI 결과 레이어 ON
→ 객체 선택 및 속성 확인
→ 검수 상태 변경
→ 보고서 생성 화면
→ 보고서 미리보기
```

### 7.2 검수 흐름

```text
GeoAI 결과 객체 선택
→ 원본 위치와 속성 확인
→ severity/confidence 확인
→ 검수 의견 입력
→ accepted/rejected/needs_review 중 선택
→ 결과 테이블과 지도 레이어 상태 갱신
```

### 7.3 보고서 흐름

```text
프로젝트 선택
→ 승인된 GeoAI 결과 선택
→ 보고서 템플릿 선택
→ 지도 캡처/요약 자동 삽입
→ HTML preview 표시
→ PDF export 버튼 노출
```

## 8. 화면 목록

MVP-A 필수 화면:

- `/login`
- `/dashboard`
- `/projects`
- `/projects/[projectId]`
- `/projects/[projectId]/datasets`
- `/projects/[projectId]/viewer`
- `/projects/[projectId]/review`
- `/projects/[projectId]/reports`
- `/projects/[projectId]/reports/[reportId]`

MVP-B 이후:

- `/admin/users`
- `/admin/roles`
- `/admin/audit-logs`
- `/admin/storage`
- `/admin/models`
- `/admin/api-keys`
- `/admin/backups`

## 9. 초기 도메인 모델

### Organization

- id
- name
- type
- created_at

### User

- id
- organization_id
- name
- email
- role
- status

### Project

- id
- organization_id
- name
- site_name
- site_type
- location
- status
- started_at
- updated_at

### ProjectMember

- id
- project_id
- user_id
- role

### Dataset

- id
- project_id
- name
- type
- status
- captured_at
- created_at

### DatasetAsset

- id
- dataset_id
- asset_type
- uri
- format
- size_bytes
- metadata

### Layer

- id
- project_id
- dataset_id
- name
- type
- visible_by_default
- opacity
- style

### ProcessingJob

- id
- project_id
- dataset_id
- type
- status
- progress
- started_at
- finished_at
- error_message

### GeoAIModel

- id
- name
- version
- task_type
- status

### GeoAIResult

- id
- project_id
- dataset_id
- model_id
- name
- status
- created_at

### GeoAIObject

- id
- result_id
- geometry
- class_name
- confidence
- severity
- review_status
- properties

### ReviewComment

- id
- object_id
- user_id
- status
- comment
- created_at

### Report

- id
- project_id
- title
- status
- template_id
- created_by
- created_at

### AuditLog

- id
- organization_id
- user_id
- action
- resource_type
- resource_id
- created_at
- metadata

## 10. 프론트엔드 구현 기준

예정 스택:

- Next.js
- React
- TypeScript
- Tailwind CSS 또는 CSS Modules
- TanStack Query
- Zustand 또는 Jotai
- React Hook Form
- Zod

상태 분리:

- 서버 상태: TanStack Query
- viewer 상태: 별도 store
- UI 패널 상태: 별도 store
- form 상태: React Hook Form

viewer 상태 예시:

- mode: `2d | 3d`
- activeProjectId
- activeLayerIds
- layerOpacityById
- selectedObjectId
- measurementTool
- camera/view state

## 11. 백엔드 구현 기준

예정 스택:

- FastAPI
- Pydantic
- SQLAlchemy 또는 SQLModel
- Alembic
- PostgreSQL/PostGIS
- Redis

MVP-A 기준:

- 초기에는 mock API 또는 seed data 기반으로 구현 가능
- API contract를 먼저 맞춘다.
- 실제 processing/GeoAI worker는 MVP-B에서 구현한다.

MVP-B 기준:

- organization_id, project_id 범위 제한을 서비스 계층에서 강제한다.
- 파일 처리와 GeoAI 실행은 API server가 아니라 worker에서 수행한다.
- 감사 로그를 주요 변경 작업에 남긴다.

## 12. API 초안

MVP-A에서 필요한 최소 API:

```text
POST   /auth/demo-login
GET    /me

GET    /dashboard/summary

GET    /projects
GET    /projects/{project_id}

GET    /projects/{project_id}/datasets
GET    /projects/{project_id}/layers
GET    /projects/{project_id}/processing-jobs

GET    /projects/{project_id}/geoai-results
GET    /geoai-results/{result_id}/objects
PATCH  /geoai-objects/{object_id}/review

GET    /projects/{project_id}/reports
POST   /projects/{project_id}/reports
GET    /reports/{report_id}
```

API 상세 request/response schema는 별도 문서 `docs/api/API_CONTRACT_DRAFT.md`에서 정의한다.

## 13. 첫 구현 작업 순서

Claude에게 전달할 권장 작업 순서:

1. `apps/web`에 Next.js/TypeScript 앱 스캐폴딩
2. 공통 AppShell, Sidebar, TopBar, ProjectSwitcher 구현
3. mock seed data 작성
4. `/login`, `/dashboard`, `/projects`, `/projects/[projectId]` 라우트 구현
5. `/projects/[projectId]/viewer` 레이아웃 구현
6. viewer state store 구현
7. mock layer panel과 result table 구현
8. review status update UI 구현
9. report preview 화면 구현
10. 최소 테스트와 lint/format 설정

주의:

- 실제 MapLibre/Cesium 연동은 viewer layout/state contract가 안정된 뒤 진행한다.
- FastAPI 백엔드는 API contract 확정 후 별도 브랜치에서 시작한다.
- MVP-A에서는 mock data로 제품 흐름을 먼저 완성한다.

## 14. Codex Decision Items

다음 항목은 기본적으로 Codex가 구현 방향을 결정한다. 사용자는 필요할 경우 Codex의 결정을 수정하거나 직접 지시할 수 있다.

- 첫 대표 GeoAI 모델: 구조물 균열 탐지 vs 도로 손상 평가
- MVP-A에서 실제 MapLibre/Cesium을 바로 붙일지, placeholder viewer로 시작할지
- 디자인 시스템: shadcn/ui 사용 여부
- Tailwind CSS와 CSS Modules 중 선택
- 초기 인증 방식: demo-login only vs NextAuth/Auth.js 도입
- API mock 방식: Next.js route handler vs MSW vs 정적 JSON
- 보고서 PDF 생성 방식: client capture vs server-side Playwright/pdfkit
