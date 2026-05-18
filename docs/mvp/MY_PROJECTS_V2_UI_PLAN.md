# Codex Work: My Projects V2 UI Implementation Plan

`10_내_프로젝트_v2.png` 레퍼런스를 기준으로 `내 프로젝트` 화면을 실제 Next.js 화면으로 구현한다. 대상 라우트는 현재 구조상 `/projects/recent`가 맞다. 기존 `/projects`는 `프로젝트 생성` 화면으로 유지한다.

## Workspace Rule

- 현재 작업공간은 Terranium 프론트엔드만 분리 개발하는 `terranium_front` 디렉터리임
- 이 작업공간에서는 git을 사용하지 않음
- Codex는 git branch, commit, push, merge를 수행하지 않음
- 백엔드, DB, 인프라 구현은 이번 작업 범위가 아님
- mock data와 정적 UI만 사용함
- 사이드바와 상단 헤더바는 기존 구현을 그대로 사용하며 절대 수정하지 않음

## Reference Docs

작업 전 확인 기준:

- `AGENTS.md`
- `docs/CODEx_HANDOFF.md`
- `docs/architecture/REPOSITORY_STRUCTURE.md`
- `docs/mvp/PROJECT_CREATE_V2_UI_PLAN.md`
- 레퍼런스 이미지:
  - `design/assets/images/generated/테라니움_플랫폼_목업/주요_화면/10_내_프로젝트_v2.png`

## Goal

이번 작업의 목표는 `10_내_프로젝트_v2.png`와 최대한 동일한 `내 프로젝트` 화면을 `/projects/recent`에 구현하는 것이다.

이번 작업은 프로젝트 생성 플로우, 실제 API 연동, DB 저장, 권한 시스템, 검색/필터의 실제 서버 동작 구현이 아니다. 정적 mock data 기반으로 레퍼런스와 동일한 화면 구조, 밀도, 색상, 간격, 상태 표현, 선택 프로젝트 패널을 만드는 데 집중한다.

## Reference Image Analysis

- 기준 해상도: `1672 x 941`
- 전체 구조:
  - 좌측 고정 사이드바
  - 상단 헤더바
  - 본문 좌측: 통계 카드, 탭/필터, 프로젝트 목록, 최근 활동
  - 본문 우측: 선택 프로젝트 상세 패널
- 화면 톤:
  - 매우 어두운 navy/black 계열 배경
  - 패널은 `#07131e` 근처의 어두운 면
  - 테두리는 청회색 계열 얇은 선
  - 강조색은 Terranium yellow
  - 위험/검토 필요는 red
  - 활성/완료는 green
  - 처리 중은 blue
- 좌측 사이드바:
  - Terranium 로고
  - 메뉴: 대시보드, 3D 디지털트윈, 2D 지도, 분석, 보고서, 프로젝트, 시스템 설정
  - `프로젝트`가 활성 상태
  - 하위 메뉴 중 `내 프로젝트`가 활성 상태
  - 하단 사용자 카드와 `메뉴 접기`
- 상단 헤더:
  - 제목: `내 프로젝트`
  - 보조 텍스트: `Project Workspace`
  - 중앙 검색창: `검색 (프로젝트명, 현장명, 지역)`
  - 우측 아이콘: 알림, 도움말, 설정, 사용자 프로필
- 상단 통계 카드 5개:
  - 전체 프로젝트 `12`
  - 활성 `8`
  - 검토 필요 `27`
  - 데이터셋 `64`
  - 저장소 `842.5GB`
- 좌측 본문:
  - 탭: 전체, 활성, 처리 중, 검토 필요, 보관
  - 검색 input
  - 필터 select: 상태, 현장 유형, 최근 업데이트
  - refresh 버튼
  - 프로젝트 목록 테이블
  - 선택 행은 yellow border/line으로 강조
  - 하단 pagination과 page size selector
  - 최근 활동 테이블
- 우측 상세 패널:
  - 헤더: `선택 프로젝트`, collapse chevron, star
  - 프로젝트명: `울산 미포 국가산단 안전점검`
  - 상태 badge: 활성
  - 항공/지도 이미지 preview + yellow polygon overlay
  - 메타 정보: 현장 유형, 위치, 좌표계, 면적, 생성일, 최근 업데이트
  - 데이터셋 현황
  - 처리 작업 현황
  - GeoAI 요약 도넛 차트
  - CTA 버튼: `3D 뷰어 열기`, `보고서 생성`

## Decisions

- 대상 라우트는 `/projects/recent`로 한다.
- 기존 `/projects` 프로젝트 생성 화면은 수정하지 않는다.
- mock API route는 만들지 않고, 페이지 내부 typed seed data로 먼저 구현한다.
- 기존 `AdminChrome`/sidebar/topbar 구조는 그대로 재사용하고, 사이드바와 상단 헤더바 관련 코드/스타일은 수정하지 않는다.
- 지도/현장 preview 이미지는 현재 보유한 `/assets/viewer/industrial-digital-twin-scene.png`를 우선 사용한다.
- 도넛 차트는 별도 chart library 없이 CSS/SVG로 구현한다.
- 아이콘은 현재 PNG admin icon 자산과 inline SVG를 혼합해 기존 방식에 맞춘다.

## Required Work

1. 라우트 구현
   - 수정 대상: `apps/web/app/(workspace)/projects/recent/page.tsx`
   - 기존 `EmptyWorkspace` placeholder 제거
   - `MyProjectsPage` 정적 화면 구현
   - typed seed data 추가:
     - summary stats
     - project rows
     - selected project detail
     - dataset status
     - processing status
     - GeoAI severity summary
     - recent activity rows

2. 공통 chrome 연결 확인
   - `AdminChrome.tsx`의 user nav에서 `/projects/recent`가 기존 방식대로 표시되는지 확인만 한다.
   - 사이드바, 상단 헤더바, `AdminChrome.tsx`는 수정하지 않는다.
   - 현재 인코딩/표시가 깨진 문자열이 실제 브라우저에서 깨져 보이더라도 이번 작업에서는 사이드바/상단 헤더바 보정을 하지 않는다.

3. 레이아웃 스타일 추가
   - 수정 대상: `apps/web/app/page.module.css`
   - 추가할 주요 class:
     - `myProjectsWorkspace`
     - `myProjectsSummaryGrid`
     - `myProjectsStatCard`
     - `myProjectsMainGrid`
     - `myProjectsListPanel`
     - `myProjectsToolbar`
     - `myProjectsTable`
     - `myProjectsRecentPanel`
     - `selectedProjectPanel`
     - `selectedProjectHero`
     - `datasetStatusGrid`
     - `processingStatusGrid`
     - `geoAiSummary`
     - `geoAiDonut`
   - 레퍼런스 기준으로 패널 간격, 높이, border, background, font size 정밀 조정

4. 프로젝트 목록 구현
   - 컬럼:
     - favorite
     - 프로젝트명
     - 현장명
     - 현장 유형
     - 상태
     - 데이터셋
     - 검토 필요
     - 최근 업데이트
     - 작업
   - 첫 번째 row 선택 상태 고정
   - 상태 badge:
     - 활성 green
     - 처리 중 blue
     - 검토 필요 red
     - 보관 gray

5. 선택 프로젝트 상세 패널 구현
   - 프로젝트명과 상태 표시
   - preview image + yellow outline overlay
   - 메타 정보 6개
   - 데이터셋 현황 5개
   - 처리 작업 현황 5개
   - GeoAI 요약 도넛 차트와 severity legend
   - 하단 버튼 2개 구현

6. 반응형 기준
   - `1672 x 941`에서 레퍼런스 최우선
   - 1440px 이상에서도 전체 구조 유지
   - 좁은 화면에서는 우측 상세 패널이 아래로 내려가거나 폭을 줄이는 방식으로 깨짐 방지
   - 모바일 최적화는 이번 작업의 핵심 목표가 아님

7. 완료 보고
   - 큰 UI 구현 작업이므로 완료 후 한국어 보고서 작성
   - 경로: `docs/reports/2026-05-18_my-projects-v2-ui_작업보고.md`
   - 포함 섹션:
     - 작업 목적
     - 작업 범위
     - 구현/검증 내용
     - 결과
     - 계획 대비 완료 여부 체크리스트
     - 남은 이슈
     - 다음 작업 제안

## Verification Required

- `npm run typecheck`
- `npm run build`
- dev server `http://localhost:43117` 확인
- 브라우저 검증:
  - `/projects/recent`
  - viewport `1672 x 941`
  - 콘솔 에러 확인
  - 레퍼런스 이미지와 스크린샷 비교
- 주요 확인 항목:
  - sidebar 폭/활성 메뉴
  - header 높이/검색창 위치
  - 통계 카드 5개 위치
  - 좌측 테이블과 우측 상세 패널 비율
  - 선택 row yellow 강조
  - GeoAI 도넛/legend 배치
  - 하단 버튼 크기와 위치

## Acceptance Criteria

- `/projects/recent`가 `10_내_프로젝트_v2.png`와 같은 화면 구조로 렌더링된다.
- 좌측 사이드바에서 `프로젝트 > 내 프로젝트`가 활성 상태로 보인다.
- 프로젝트 목록, 선택 프로젝트 상세, 최근 활동, GeoAI 요약이 모두 mock data로 표시된다.
- `npm run typecheck`와 `npm run build`가 통과한다.
- 완료 보고서가 `docs/reports/`에 생성된다.
- `/projects` 프로젝트 생성 화면은 깨지지 않는다.

## Constraints

- 실제 API, DB, 인증, 권한 로직은 구현하지 않는다.
- 새 UI 라이브러리, chart library, state library를 도입하지 않는다.
- 기존 프로젝트 생성 화면을 리팩터링하지 않는다.
- 사이드바와 상단 헤더바는 절대 수정하지 않는다.
- `apps/web/app/_components/AdminChrome.tsx`는 이번 작업에서 수정하지 않는다.
- 사이드바/상단 헤더바에 영향을 주는 기존 CSS class는 수정하지 않는다.
- 백엔드 또는 `apps/api/`는 만들지 않는다.
- 레퍼런스 PNG를 통째로 배경으로 깔아 맞추지 않는다.
- 구현은 `/projects/recent`와 해당 화면 본문에 필요한 신규 스타일 추가에 한정한다.
