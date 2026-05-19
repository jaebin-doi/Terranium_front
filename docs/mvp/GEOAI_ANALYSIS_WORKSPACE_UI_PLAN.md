# Codex Work: GeoAI Analysis Workspace UI Implementation Plan

`04_공간인공지능_분석_작업공간.png` 레퍼런스를 기준으로 `GeoAI 분석` 화면을 실제 Next.js 정적 UI로 구현한다. 대상 라우트는 현재 구조상 `/analytics/geoai`다.

## Workspace Rule

- 현재 작업공간은 Terranium 프론트엔드만 분리 개발하는 `terranium_front` 디렉터리임
- 구현 대상은 `apps/web` 프론트엔드에 한정함
- 백엔드, DB, 실제 GeoAI 추론 서버, 지도 타일 서버, 인프라 구현은 이번 작업 범위가 아님
- mock data와 정적 UI를 사용함
- 레퍼런스 PNG 전체를 배경으로 깔거나 그대로 삽입하지 않음
- 실제 MapLibre/Cesium 연동은 이번 화면 정밀 재현 범위가 아니며, 지도/분석 레이어는 정적 UI와 CSS overlay로 표현함
- 사이드바/상단바를 전역으로 깨뜨리지 않도록 `/analytics/geoai` 화면에 필요한 최소 변경만 적용함
- 작업 완료 후 `npm run typecheck`와 브라우저 렌더링 확인을 수행함

## Reference Docs

작업 전 확인 기준:

- `AGENTS.md`
- `docs/CODEx_HANDOFF.md`
- `docs/architecture/REPOSITORY_STRUCTURE.md`
- `docs/mvp/PRODUCT_MVP_SCOPE.md`
- `docs/mvp/MY_PROJECTS_V2_UI_PLAN.md`
- `docs/mvp/PROJECT_CREATE_V2_UI_PLAN.md`
- 레퍼런스 이미지:
  - `design/assets/images/generated/테라니움_플랫폼_목업/주요_화면/04_공간인공지능_분석_작업공간.png`

## Goal

이번 작업의 목표는 `04_공간인공지능_분석_작업공간.png`와 최대한 동일한 `GeoAI 분석` 화면을 `/analytics/geoai`에 구현하는 것이다.

이번 작업은 실제 침수 예측 모델 실행, 지도 타일 로딩, 공간 분석 계산, 서버 저장, 보고서 PDF 생성, 실제 공유 기능 구현이 아니다. 정적 mock data 기반으로 화면 구조, 밀도, 색상, 패널 구성, 지도형 분석 결과 표현, 테이블 상태를 레퍼런스와 가깝게 재현하는 데 집중한다.

## Current Code Baseline

현재 `/analytics/geoai`는 빈 작업영역을 렌더링한다.

```tsx
// apps/web/app/(workspace)/analytics/geoai/page.tsx
import { EmptyWorkspace } from '../../../_components/AdminChrome';

export default function GeoAiAnalyticsPage() {
  return <EmptyWorkspace label="GeoAI 분석" />;
}
```

따라서 1차 구현 진입점은 `GeoAiAnalyticsPage`이며, `EmptyWorkspace`를 `GeoAiAnalysisWorkspace` 형태의 전용 화면 컴포넌트로 교체한다.

현재 `AdminChrome`은 `/analytics/geoai`에서 기본 topbar를 렌더링한다. 레퍼런스는 일반 제목형 topbar가 아니라 프로젝트/데이터셋/기준일 selector가 있는 작업형 topbar이므로, 정확한 재현을 위해 다음 중 하나를 선택한다.

- 권장: `AdminChrome`에 `topbarVariant: 'geoai'`를 추가하고 `/analytics/geoai`에서만 사용한다.
- 대안: 기존 topbar는 유지하고 content 내부에서 별도 selector row를 만든다.

레퍼런스와 최대한 동일하게 만들려면 권장안을 따른다. 단, 기존 `/projects`, `/digital-twin/3d`, `/projects/shared` 화면의 topbar 동작은 변경하지 않는다.

## Reference Image Analysis

- 기준 해상도: `1672 x 941`
- 좌측 sidebar 폭: 약 `196px`
- 상단 topbar 높이: 약 `60px`
- content 시작점: x 약 `197px`, y 약 `60px`
- 전체 톤:
  - 배경: 거의 black에 가까운 dark navy
  - 패널: `#07131e` 근처 dark surface
  - 테두리: 청회색 1px line
  - 주 강조색: Terranium yellow
  - 위험도 색상: high red, medium yellow, low blue
  - 성공/완료: green

## Screen Structure

### 1. Global Shell

레퍼런스의 고정 영역:

- 좌측 사이드바
  - Terranium 로고
  - 주요 메뉴: 대시보드, 데이터 관리, 지도 뷰어, `GeoAI 분석`, 3D 디지털트윈, 모니터링, 보고서, API 관리, 설정
  - `GeoAI 분석`이 노란색 활성 상태
  - 하단 API 호출량 카드
- 상단 작업 바
  - 프로젝트 selector: `서울시 강남구 역삼동 일대`
  - 데이터셋 selector: `DRONE_20240528_Orthomosaic`
  - 기준일 selector: `2024-05-28`
  - 우측 action: 비교 보기, 공유, 알림, 사용자 프로필

현재 앱의 공통 sidebar와 차이가 있으므로 1차 구현에서는 전역 sidebar 메뉴 구조를 대규모로 바꾸지 않는다. `/analytics/geoai`에서 active item과 topbar만 레퍼런스에 맞게 조정하는 것을 우선한다.

### 2. Content Grid

content 전체는 세로 3분할 구조다.

```text
GeoAI workspace
├─ main row
│  ├─ left model panel
│  ├─ center map analysis canvas
│  └─ right result panel
└─ bottom analysis queue
```

권장 CSS 구조:

```css
.geoAiWorkspace {
  height: 100%;
  display: grid;
  grid-template-rows: minmax(0, 1fr) 110px;
}

.geoAiMainGrid {
  display: grid;
  grid-template-columns: 245px minmax(0, 1fr) 507px;
}
```

정확한 폭은 Playwright `1672 x 941` 기준으로 보정한다.

### 3. Left Model Panel

상단:

- 제목: `GeoAI 분석`
- subtitle: `AI 모델을 활용한 공간 데이터 분석`

모델 선택 카드:

- `침수 위험 예측` active
- `지반침하 탐지`
- `구조물 균열 분석`
- `불법 건축물 탐지`
- `도로 손상 평가`

각 모델 카드:

- 좌측 icon
- 모델명
- active 카드만 yellow border
- dark surface background

설정 영역:

- 모델 버전 select: `모델 v2.3`
- 신뢰도 임계값 slider: `70%`
- 분석 범위 segmented control:
  - `전체 영역` active
  - `사용자 지정`
- CTA button: `분석 실행`

주의:

- 실제 slider 동작은 mock 상태로 충분함
- 모델 선택은 `useState`로 active 카드만 변경 가능하게 만들 수 있음
- 분석 실행은 실제 API 호출 없이 버튼 hover/active 상태만 구현

### 4. Center Map Analysis Canvas

중앙 영역은 실제 지도 엔진이 아니라 정적 분석 canvas로 구현한다.

구성:

- 상단 map toolbar
  - `2D`, `3D` segmented tabs
  - cursor, polygon, hammer/tool, pin, layer, crop, download icon buttons
- 지도 배경
  - 기존 `apps/web/public/assets/viewer/industrial-digital-twin-scene.png` 또는 추가 가능한 정적 항공 이미지 사용
  - 레퍼런스처럼 도시 항공사진 느낌이 필요함
- 분석 overlay
  - blue polygon-like analysis range
  - red/yellow heatmap blob
  - orange point markers
  - 단, 실제 공간 geometry 계산은 하지 않음
- 우측 vertical zoom toolbar
  - north indicator
  - zoom in/out
  - reset
  - fullscreen
- 좌하단 legend
  - 위험도 범례: 높음, 중간, 낮음, 분석 범위
- 하단 map status bar
  - scale: `0 100 200 m`
  - CRS: `EPSG:5179`
  - coordinate readout: `X`, `Y`, `Z`

구현 방식:

- `div` 기반 CSS overlay 우선
- point marker는 반복 mock data로 렌더링
- heatmap은 CSS radial-gradient/blur overlay를 사용
- polygon은 SVG나 CSS `clip-path`로 구현 가능하나, 레퍼런스와 과하게 다르면 단순 반투명 레이어로 시작

금지:

- 레퍼런스 PNG를 통째로 지도 배경으로 사용하지 않음
- 실제 지도/타일 라이브러리를 이번 단계에서 새로 도입하지 않음

### 5. Right Result Panel

우측 패널은 3개 블록으로 나뉜다.

#### 5.1 Model Info

- 제목: `모델 정보`
- icon + 모델명: `침수 위험 예측`
- badge: `모델 v2.3`
- description: `AI 기반 침수 발생 가능성 및 위험도 예측`
- confidence card:
  - label: `신뢰도`
  - value: `92%`
  - horizontal yellow gauge
  - text: `높음`

#### 5.2 Result Layers

- 제목: `결과 레이어`
- 각 행:
  - visibility icon
  - checkbox
  - label
  - opacity slider
  - percent

Rows:

- `침수 위험도 (Heatmap)` 70%
- `침수 위험 지역 (Polygon)` 100%
- `고위험 포인트 (Point)` 100%

#### 5.3 Result Objects

Tabs:

- `탐지 객체` active
- `분석 요약`

Filter chips:

- `전체 1,248`
- `높음 356`
- `중간 542`
- `낮음 350`
- filter button

Table columns:

- `ID`
- `위험도`
- `위치`
- `면적(m²)`
- `신뢰도`
- `상태`

Rows:

- `FLD-2024-0001` 높음, 역삼동 736-15, 2,850.4, 95%, 미확인
- `FLD-2024-0002` 높음, 역삼동 737-22, 1,924.7, 93%, 미확인
- `FLD-2024-0003` 높음, 역삼동 721-8, 3,210.1, 94%, 미확인
- `FLD-2024-0004` 중간, 역삼동 734-11, 4,112.3, 87%, 검토중
- `FLD-2024-0005` 중간, 역삼동 738-16, 2,331.6, 86%, 검토중

Footer:

- pagination: `1 2 3 4 5 ... 125`
- result export select/button: `결과 내보내기`
- primary button: `보고서 생성`

### 6. Bottom Analysis Queue

하단 분석 큐:

- title: `분석 큐`
- right action: `전체 보기`
- row 1:
  - thumbnail
  - `침수 위험 예측`
  - dataset `DRONE_20240528_Orthomosaic`
  - scope `전체 영역`
  - model `모델 v2.3`
  - status `진행 중`
  - progress 65%
  - ETA `예상 완료 00:01:32`
- row 2:
  - `지반침하 탐지`
  - dataset `DRONE_20240527_Orthomosaic`
  - model `모델 v2.2`
  - status `완료`
  - progress 100%
  - elapsed `00:03:21`
  - download icon

## Data Model Draft

정적 mock data는 페이지 파일 안에서 시작하고, 화면이 커지면 `apps/web/app/(workspace)/analytics/geoai/data.ts`로 분리한다.

```ts
type GeoAiModel = {
  id: string;
  name: string;
  icon: 'flood' | 'subsidence' | 'crack' | 'illegalBuilding' | 'roadDamage';
  active?: boolean;
};

type ResultLayer = {
  id: string;
  label: string;
  visible: boolean;
  checked: boolean;
  opacity: number;
};

type DetectionObject = {
  id: string;
  severity: '높음' | '중간' | '낮음';
  location: string;
  area: string;
  confidence: string;
  status: '미확인' | '검토중' | '승인' | '반려';
};

type AnalysisQueueItem = {
  id: string;
  modelName: string;
  datasetName: string;
  scope: string;
  modelVersion: string;
  status: '진행 중' | '완료';
  progress: number;
  timeText: string;
};
```

## Component Plan

권장 파일 구조:

```text
apps/web/app/(workspace)/analytics/geoai/page.tsx
  - route entry
  - local mock data
  - high-level layout composition

apps/web/app/(workspace)/analytics/geoai/GeoAiAnalysisWorkspace.tsx
  - optional split if page.tsx becomes too large

apps/web/app/(workspace)/analytics/geoai/GeoAiMapCanvas.tsx
  - optional split for center map canvas

apps/web/app/page.module.css
  - existing CSS Modules file에 geoAi* class 추가
```

현재 프로젝트는 여러 화면이 `page.module.css`를 공유하고 있으므로, 새 class prefix는 반드시 `geoAi`로 통일한다.

예:

- `geoAiWorkspace`
- `geoAiMainGrid`
- `geoAiModelPanel`
- `geoAiModelCard`
- `geoAiMapPanel`
- `geoAiMapToolbar`
- `geoAiResultPanel`
- `geoAiQueuePanel`

## Implementation Steps

### Step 1. Route Replacement

대상:

- `apps/web/app/(workspace)/analytics/geoai/page.tsx`

작업:

- `EmptyWorkspace` 제거
- `GeoAiAnalysisWorkspace` 정적 화면 렌더
- mock data 배열 추가
- 화면 최상위 wrapper와 main grid 생성

검증:

- `/analytics/geoai` 200 응답
- 기존 sidebar/topbar가 깨지지 않음

### Step 2. Left Model Panel

작업:

- 제목/설명 영역
- 모델 선택 카드 5개
- 모델 버전 select
- 신뢰도 slider
- 분석 범위 segmented control
- 분석 실행 버튼

검증:

- 레퍼런스 좌측 패널의 세로 밀도와 카드 간격 확인
- active 모델 카드 yellow border 확인

### Step 3. Center Map Canvas

작업:

- 중앙 지도 컨테이너
- 상단 toolbar
- 이미지 배경
- heatmap, point marker, analysis bounds overlay
- zoom toolbar
- legend
- 하단 coordinate bar

검증:

- `1672 x 941` viewport에서 중앙 지도가 가장 큰 시각적 중심이 되는지 확인
- overlay가 실제 지도처럼 보이되 텍스트/패널을 침범하지 않는지 확인

### Step 4. Right Result Panel

작업:

- 모델 정보 카드
- 신뢰도 92% 게이지
- 결과 레이어 3개
- 탐지 객체/분석 요약 tabs
- severity chips
- 탐지 객체 테이블
- pagination
- 결과 내보내기/보고서 생성 버튼

검증:

- 오른쪽 패널 높이가 main row 안에 맞는지 확인
- 테이블 행 높이, 숫자 색상, status 색상 확인

### Step 5. Bottom Analysis Queue

작업:

- 분석 큐 panel
- 2개 queue row
- progress bar
- 완료/진행 중 상태 색상
- row thumbnail
- 전체 보기 action

검증:

- 하단 큐가 화면 하단에 고정된 느낌으로 배치되는지 확인
- main row와 하단 큐 사이 간격이 레퍼런스와 유사한지 확인

### Step 6. Optional GeoAI Topbar Variant

레퍼런스 정확도를 높이려면 `AdminChrome`에 `geoai` topbar variant를 추가한다.

작업:

- `AdminChrome.tsx`
  - `topbarVariant` union에 `'geoai'` 추가
  - `GeoAiTopbar` 컴포넌트 추가
  - `/analytics/geoai` pathname에서 `topbarVariant: 'geoai'` 반환
- 기존 `viewer3d` topbar와 default topbar에 영향 없게 분기

주의:

- 전역 nav 구조를 대규모 변경하지 않음
- 기존 화면의 제목/상단바 regression 확인

## CSS and Visual Rules

- 기존 화면들과 같이 CSS Modules 사용
- Tailwind, shadcn/ui 등 새 UI 프레임워크 도입 금지
- icon은 inline SVG 또는 기존 아이콘 스타일을 재사용
- 버튼, select, slider는 레퍼런스처럼 각진 dark UI로 구현
- 패널 border radius는 0~3px 수준으로 유지
- 카드형 둥근 UI 남용 금지
- 텍스트는 `white-space: nowrap`, `text-overflow: ellipsis`를 필요한 곳에 사용
- 테이블 컬럼은 `table-layout: fixed` 또는 CSS grid로 고정해 레이아웃 흔들림 방지
- 1280px 이하에서는 우측 결과 패널이 아래로 내려가거나 내부 스크롤되도록 responsive fallback 추가

## Verification Required

Codex가 직접 확인해야 할 검증:

```powershell
cd C:\Users\admin\Desktop\terranium_front\apps\web
npm run typecheck
npm run build
```

브라우저 검증:

- dev server: `http://localhost:43117`
- route: `http://localhost:43117/analytics/geoai`
- viewport:
  - `1672 x 941` 기준 레퍼런스 비교
  - `1280 x 900` overflow/scroll 확인
- Playwright 확인 항목:
  - 콘솔 error 없음
  - 좌측 모델 패널이 잘리지 않음
  - 중앙 지도 overlay가 패널과 겹치지 않음
  - 우측 결과 패널 테이블이 가로로 넘치지 않음
  - 하단 분석 큐가 화면 하단에서 정상 표시됨

## Acceptance Criteria

- `/analytics/geoai`에서 `GeoAI 분석` 화면이 실제로 렌더링된다.
- 레퍼런스 이미지의 주요 구조가 모두 존재한다.
  - 좌측 모델 선택/설정 패널
  - 중앙 지도 분석 canvas
  - 우측 모델 정보/레이어/탐지 객체 패널
  - 하단 분석 큐
- 정적 mock data가 화면에 반영된다.
- 실제 backend/API/GeoAI inference 없이도 고객 데모용 화면으로 보인다.
- `npm run typecheck`가 통과한다.
- `npm run build`가 통과한다.
- 기존 `/projects`, `/projects/recent`, `/projects/shared`, `/digital-twin/3d` 화면의 공통 chrome이 깨지지 않는다.

## Out of Scope

- 실제 GeoAI 분석 실행
- 실제 침수 예측 모델 연동
- 실제 지도 타일/MapLibre/Cesium 연동
- 실제 공간 좌표 계산
- 실제 레이어 opacity 조작과 map rendering 동기화
- 보고서 PDF 생성
- 결과 내보내기 파일 생성
- 공유/알림/비교 보기 실제 기능
- 백엔드 API, DB, worker, queue 구현

## Implementation Risk

- 레퍼런스는 현재 공통 sidebar/topbar와 메뉴 구조가 다르다. 완전 재현을 하려면 `AdminChrome` variant 추가가 필요하다.
- 중앙 지도 이미지는 현재 보유 asset과 레퍼런스의 항공사진 질감이 다를 수 있다. 필요한 경우 별도 정적 이미지 자산 추가가 필요하다.
- heatmap/polygon overlay는 CSS만으로 구현하면 실제 GIS 결과와 다르게 보일 수 있다. 데모 UI 수준에서는 허용하되, Phase 0 실제 viewer PoC와는 별도다.
- 한 파일에 모든 컴포넌트를 넣으면 `page.tsx`가 커질 수 있다. 구현 중 300~400 lines를 넘으면 하위 컴포넌트로 분리한다.

## Next Work Recommendation

구현은 한 번에 끝내지 말고 다음 순서로 진행한다.

1. `/analytics/geoai` content grid와 좌측 모델 패널
2. 중앙 map canvas 정적 UI
3. 우측 result panel
4. 하단 analysis queue
5. 필요 시 GeoAI 전용 topbar variant
6. Playwright 스크린샷 비교 후 간격/폭/색상 보정
