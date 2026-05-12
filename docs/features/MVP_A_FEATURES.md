# MVP-A Feature Specification

Status: UI reference draft  
Audience: product/UI design, Codex, Claude  
Purpose: MVP-A에서 보여줄 기능, 화면, 상태, 제외 범위를 UI 기준으로 정리한다.

MVP-A는 실제 운영 제품이 아니라 고객 데모가 가능한 제품 경험이다. 핵심은 “프로젝트를 열고, 지도/3D에서 데이터를 보고, GeoAI 결과를 검토하고, 보고서 초안을 만드는 흐름”을 끊기지 않게 보여주는 것이다.

## 1. MVP-A 전체 목표

MVP-A 사용자는 다음 흐름을 이해할 수 있어야 한다.

```text
로그인
→ 대시보드
→ 프로젝트 목록
→ 프로젝트 상세
→ 2D/3D viewer
→ 레이어/GeoAI 결과 확인
→ 검수 상태 변경
→ 보고서 미리보기
→ 업로드/처리 상태 개념 확인
```

MVP-A는 다음을 하지 않는다.

- 실제 고객 파일의 대용량 처리
- 실제 GeoAI 추론
- 실제 DB 기반 권한 관리
- 실제 운영 보안
- 완전한 PDF 저장/배포 시스템
- point cloud production rendering

## 2. Navigation / AppShell

### 목적

모든 MVP-A 제품 화면이 공통으로 사용하는 기본 레이아웃이다.

### 화면 구성

- Top header
  - Terranium 브랜드
  - 현재 사용자 표시
  - 데모 인증 상태 표시
- Left navigation
  - Dashboard
  - Projects
  - Reports
  - Uploads
  - PoC Lab
- Context bar
  - 현재 조직
  - 현재 프로젝트
  - read-only/demo 상태
- Main content slot
  - 각 제품 화면이 들어가는 영역

### 사용자 액션

- Dashboard로 이동
- Projects로 이동
- Reports로 이동
- Uploads로 이동
- PoC Lab으로 이동

### 상태

- active nav item
- future/disabled nav item
- logged-in demo user
- no-auth/demo-only notice

### MVP-A 제외

- 사용자 설정 메뉴
- 조직 전환
- 다중 프로젝트 권한 전환
- 알림 센터
- 관리자 메뉴

## 3. Demo Auth

### 목적

제품 화면들이 “현재 로그인 사용자”라는 공통 기준을 갖게 한다.

### 정책

- 고객사별 공유 계정 1개를 발급하는 초기 운영을 가정한다.
- 같은 회사 계정으로 여러 직원이 동시에 접속할 수 있다.
- concurrent login allowed가 기본 정책이다.
- logout은 현재 브라우저의 cookie만 제거한다.
- 다른 브라우저나 다른 직원의 세션을 revoke하지 않는다.

### 화면 구성

- 로그인 진입 화면 또는 demo login trigger
- AppShell 사용자 표시
- Dashboard의 auth contract 상태

### API

- `POST /api/demo/auth/demo-login`
- `GET /api/demo/me`
- `POST /api/demo/auth/logout`

### 상태

- unauthenticated
- authenticated as demo user
- logout completed
- invalid demo credential

### MVP-A 제외

- 비밀번호 재설정
- SSO
- MFA
- RBAC
- device/session management
- single-session enforcement
- active session list

## 4. Dashboard

### 목적

제품 진입 후 현재 프로젝트와 MVP-A readiness를 빠르게 보여준다.

### 화면 구성

- Active project summary
  - project name
  - site name/type
  - location
  - status
  - last updated
- Data overview
  - dataset count
  - layer count
  - GeoAI object count
  - first model name/version
  - open review count
- MVP-A readiness board
  - Phase 0 complete
  - AppShell skeleton
  - demo auth
  - project list/detail
  - review PATCH
  - report capture
  - upload adapter
  - point cloud deferred
- Quick links
  - PoC Lab
  - 3D viewer
  - report preview
  - chunk upload PoC
  - point cloud decision

### 사용자 액션

- 프로젝트 목록으로 이동
- 현재 프로젝트 상세로 이동
- PoC reference 화면으로 이동
- 보고서/업로드 관련 future 화면의 위치를 인지

### MVP-A 제외

- 실시간 운영 지표
- billing/cost metrics
- 조직 단위 통계
- 고급 알림 시스템

## 5. Projects

### 목적

고객 데모용 프로젝트 목록을 보여주고, 프로젝트 상세로 진입하게 한다.

### 화면 구성

- Project list table
  - project name
  - site name
  - status
  - dataset count
  - open review count
  - updated at
- Filter/search placeholder
  - status filter
  - text search
- Empty/loading/error 상태

### 사용자 액션

- 프로젝트 상세 열기
- 프로젝트 상태별 필터
- 프로젝트 이름 검색

### 데이터 기준

- seed project를 우선 사용한다.
- MVP-A 초반에는 mock route handler 기반으로 충분하다.

### MVP-A 제외

- 프로젝트 생성 wizard
- 프로젝트 삭제
- 프로젝트 공유 링크
- 고객별 복잡 권한
- bulk operations

## 6. Project Detail

### 목적

MVP-A의 중심 화면이다. viewer, dataset, GeoAI review, report entry가 이 화면에서 연결된다.

### 화면 구성

- Project header
  - name
  - site
  - status
  - location
  - updated at
- Viewer area
  - 2D/3D mode switch
  - layer controls
  - opacity controls
  - selected object readout
- Right/side panel
  - dataset summary
  - GeoAI result summary
  - selected object properties
  - report action
- Bottom/table area
  - GeoAI object list
  - review status

### 사용자 액션

- 2D/3D 전환
- layer on/off
- opacity 조정
- GeoAI object 선택
- review status 변경
- report preview로 이동
- upload 화면으로 이동

### MVP-A 제외

- multi-project compare
- split compare
- timeline compare
- advanced measurement
- 3D GeoAI entity rendering은 선택사항 또는 후속

## 7. Dataset / Upload

### 목적

데이터셋 등록과 업로드 흐름의 개념을 보여준다.

### 화면 구성

- Dataset list
  - name
  - type
  - status
  - size
  - updated at
- Add dataset action
- Upload panel
  - file metadata
  - chunk plan
  - progress
  - completion placeholder
- Processing status placeholder

### 사용자 액션

- file 선택
- upload 시작
- upload cancel
- dataset placeholder 확인
- processing job placeholder 확인

### API / 기술 기준

- STEP 06 upload session protocol 기준
- byte range는 `[byteStart, byteEnd)` half-open
- MVP-A에서는 storage persistence 없이 mock 가능

### MVP-A 제외

- 실제 object storage
- S3/GCS/Azure adapter
- virus scan
- COG conversion
- 3D Tiles conversion
- point cloud tiling
- resumable production upload

## 8. Viewer

### 목적

2D/3D에서 프로젝트 데이터를 확인하는 핵심 경험이다.

### 화면 구성

- Mode switch
  - 2D MapLibre
  - 3D Cesium
- Main canvas area
- Layer panel
  - raster/orthomosaic
  - 3D tiles
  - GeoAI result
- Object selection panel
- Basic controls
  - reset view
  - opacity
  - visibility

### 사용자 액션

- 2D/3D 전환
- 카메라 이동
- 레이어 토글
- opacity 변경
- GeoAI object 선택

### 상태

- selectedObjectId
- layer visibility
- layer opacity
- viewer mode
- camera state

### MVP-A 제외

- 대용량 point cloud 최적화
- time slider
- split compare
- terrain analysis
- advanced measurement
- production tile server

## 9. GeoAI Review

### 목적

AI 결과를 사람이 검수할 수 있는 테이블/지도/상세 패널 흐름을 보여준다.

### 화면 구성

- GeoAI result layer on viewer
- Object table
  - object id
  - class
  - severity
  - confidence
  - review status
- Property panel
  - geometry type
  - measurements
  - notes
  - selected object metadata
- Review controls
  - pending
  - needs_review
  - accepted
  - rejected

### 사용자 액션

- 지도에서 object 선택
- table row 선택
- review status 변경
- note 입력 placeholder

### MVP-A 제외

- 실제 AI inference
- model registry
- multi-model compare
- legal/automatic judgement
- advanced reviewer assignment

## 10. Reports

### 목적

검수 결과를 보고서 초안으로 만드는 흐름을 보여준다.

### 화면 구성

- Report list placeholder
- Report preview
  - title
  - project summary
  - generated at
  - severity distribution
  - review status distribution
  - findings table
  - static mini-map or captured viewer slot
- Export action
  - Print / Save as PDF
  - server-side capture placeholder

### 사용자 액션

- report preview 열기
- print/save as PDF 실행
- future export action 확인

### MVP-A 구현 방향

- HTML preview를 우선한다.
- server-side headless browser capture를 MVP-A 선호 경로로 둔다.
- 실제 PDF persistence는 후속이다.

### MVP-A 제외

- template editor
- electronic approval
- customer submission workflow
- stored report versioning

## 11. Point Cloud

### 목적

MVP-A에서는 true point cloud rendering을 구현하지 않는다는 결정을 UI에서 혼동 없이 반영한다.

### 정책

- 기본: defer
- 고객 데모에서 꼭 필요하면 existing Cesium viewer의 sample URL을 `.pnts`로 교체하는 escape hatch
- production point cloud는 MVP-B 결정 사항

### UI 표현

- Project detail이나 readiness 영역에서 “Point cloud deferred”로 표시
- 지원 예정 또는 MVP-B 항목으로 분리

### MVP-A 제외

- COPC/LAZ browser renderer
- Potree/deck.gl integration
- point cloud conversion worker
- point cloud measurement

## 12. MVP-A 화면 목록

| Route | Screen | Status |
|---|---|---|
| `/` | Redirect to dashboard | included |
| `/dashboard` | AppShell dashboard | included |
| `/login` or demo login entry | Demo auth entry | planned |
| `/projects` | Project list | planned |
| `/projects/[id]` | Project detail + viewer | planned |
| `/reports` | Report list placeholder | planned |
| `/reports/[id]` | Report preview or detail | optional in MVP-A |
| `/uploads` | Upload status/list placeholder | optional in MVP-A |
| `/poc` | Phase 0 lab reference | retained |

## 13. MVP-A Priority

1. AppShell
2. Demo auth
3. Project list
4. Project detail with viewer embed
5. GeoAI review on project detail
6. Report preview/capture path
7. Upload integration
8. lint/test/API contract hardening

## 14. UI Design Guidance

- 제품형 운영 도구처럼 보여야 한다.
- hero/marketing page를 만들지 않는다.
- 정보는 dense but readable하게 배치한다.
- cards는 반복 항목, 요약 패널, 독립 섹션에만 사용한다.
- nested card 구조를 피한다.
- 지도/뷰어가 주 화면일 때는 viewer 영역을 충분히 크게 잡는다.
- 모바일에서는 nav와 content가 겹치지 않아야 한다.
- future 기능은 클릭 가능한 링크처럼 보이게 하지 않는다.
