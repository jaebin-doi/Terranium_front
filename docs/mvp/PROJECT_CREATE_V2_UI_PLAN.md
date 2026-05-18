# Project Create V2 UI Implementation Plan

작성일: 2026-05-18  
대상 레퍼런스: `design/assets/images/generated/테라니움_플랫폼_목업/주요_화면/09_프로젝트_생성_v2.png`  
대상 라우트: `apps/web/app/(workspace)/projects/page.tsx` (`/projects`)

## Workspace Rule

- 현재 작업공간은 Terranium 프론트엔드만 분리 개발하는 `terranium_front` 디렉터리다.
- 이 작업공간에서는 git을 사용하지 않는다.
- Codex는 git branch, commit, push, merge를 수행하지 않는다.
- 백엔드, DB, 인프라 구현은 이번 작업 범위가 아니다.
- 이번 문서는 구현 계획서이며, 이 단계에서는 UI 코드를 구현하지 않는다.

## Goal

`09_프로젝트_생성_v2.png` 레퍼런스를 기준으로, 사용자가 사이드바의 `작업 관리 > 프로젝트 > 프로젝트 생성`을 클릭했을 때 content 영역에 동일한 정적 프로젝트 생성 UI가 표시되도록 구현한다.

이번 작업은 실제 저장, API 연동, 폼 검증 로직, 지도 엔진 연동, 업로드 처리 구현이 아니다. 우선 레퍼런스 화면을 최대한 동일하게 재현하는 정적 UI를 작은 단계로 나누어 만든다.

## Non-Negotiable Constraints

- 사이드바와 상단 헤더바는 절대 수정하지 않는다.
- `AdminChrome`, `AdminSidebar`, `AdminTopbar`, 공통 nav 구조는 수정하지 않는다.
- `/projects` content 영역 내부에서만 UI를 교체한다.
- 기존 전체 앱의 어두운 admin 스타일, 폰트, 색상 톤, border 질감을 유지한다.
- 필요한 아이콘이나 이미지는 기존 자산을 먼저 확인하고, 없을 때만 추가 생성한다.
- 한 번에 전체 UI를 완성하지 않는다. 아래 구현 순서대로 하나씩 진행하고, 각 단계마다 렌더링을 확인한다.

## Current Code Baseline

현재 `/projects`는 다음 파일에서 빈 작업영역을 렌더링한다.

```tsx
// apps/web/app/(workspace)/projects/page.tsx
import { EmptyWorkspace } from '../../_components/AdminChrome';

export default function ProjectsPage() {
  return <EmptyWorkspace label="전체 프로젝트" />;
}
```

즉, 구현 시 기본 진입점은 `ProjectsPage`이고, `EmptyWorkspace`를 새 content 전용 컴포넌트로 교체하면 된다.

현재 `AdminChrome`의 user nav 안에는 프로젝트 하위 메뉴가 이미 `/projects`, `/projects/recent`, `/projects/shared`로 연결되어 있다. 사이드바는 금지 구역이므로 라벨이나 active 처리 문제가 발견되면 별도 확인 후 진행한다.

## Reference Screen Summary

레퍼런스 화면은 전체 1672 x 941 기준의 admin workspace 화면이다.

고정 영역:

- 좌측 사이드바: 기존 Terranium user workspace 사이드바
- 상단 헤더바: 제목 `프로젝트 생성`, subtitle `Project Workspace`, 검색창, 알림/도움말/설정/사용자 영역

구현 대상 content 영역:

- 상단 단계 진행 표시줄
- 좌측 대형 입력 폼 영역
- 우측 프로젝트 미리보기 패널
- 하단 action bar

## Content Layout Anatomy

content 영역은 헤더 아래 전체 높이를 사용한다.

1. `ProjectCreateWorkspace`
   - content 최상위 wrapper
   - 전체 배경은 기존 shell과 같은 매우 어두운 navy/black 계열
   - 내부 padding은 레퍼런스 기준 좌우 약 14px, 상단 약 14px로 시작
   - 하단 버튼 영역 때문에 본문은 `min-height: 0` + 내부 스크롤 가능 구조로 둔다

2. `ProjectCreateStepper`
   - 화면 상단의 5단계 진행 바
   - 단계:
     - `1 기본 정보`
     - `2 위치/좌표`
     - `3 데이터 구성`
     - `4 팀/권한`
     - `5 검토 및 생성`
   - 1단계만 노란색 active 상태
   - 각 step은 원형 번호 + 라벨 + 얇은 separator line 구성
   - active line은 노란색, inactive line은 `#263847` 계열

3. `ProjectCreateBody`
   - 2-column layout
   - 좌측 form column: 약 68%
   - 우측 preview column: 약 32%
   - gap은 약 12px
   - desktop 기준 최소 폭을 보장하여 레퍼런스와 같은 dense admin 화면을 유지한다

4. `ProjectCreateFormColumn`
   - `기본 정보`
   - `위치 및 좌표계`
   - `초기 데이터 구성`
   - `GeoAI 모델`
   - 각 section은 얇은 border가 있는 rectangular panel
   - border radius는 기존 admin 패턴에 맞춰 2~4px 이하로 제한

5. `ProjectPreviewPanel`
   - 우측 고정 패널
   - 상단 제목 `프로젝트 미리보기`
   - 산업단지 aerial preview 이미지
   - 예상 데이터셋/저장 용량/검토 항목 summary
   - 팀 구성
   - 처리 계획
   - 주의 사항 callout

6. `ProjectCreateActionBar`
   - content 최하단 fixed-height action bar
   - 좌측은 빈 영역
   - 우측 버튼 3개:
     - `임시 저장`
     - `취소`
     - `프로젝트 생성`
   - primary button은 노란색 배경

## Visual Details To Match

### Background and Panels

- 전체 content background: `#02070d`, `#03101c`, `#06131f` 계열의 어두운 배경
- panel background: `rgba(5, 15, 23, 0.94)` 또는 기존 `.panel` 톤 재사용
- panel border: `#263847`, `#2c4050`, `#344656` 계열
- section header 높이: 약 40px
- section 내부 padding: 14~18px

### Typography

- 기존 `var(--font-sans)` 사용
- 큰 section title: 16~18px, 500~600 weight
- field label: 13~14px
- input text: 13~14px
- required marker는 red/orange `*`
- letter spacing은 기존 admin 스타일을 따르되, 새 스타일에서는 과도한 negative spacing을 추가하지 않는다

### Form Controls

정적 UI이지만 실제 form control처럼 보여야 한다.

- input
  - 높이 32~34px
  - dark fill
  - 1px border
  - padding 좌우 10~12px
- textarea
  - 높이 약 67px
  - 우측 하단 `52 / 500`
- select
  - 우측 chevron icon 필요
- segmented/status select
  - `활성` 앞에 초록 dot
- coordinate pair
  - X/Y 값을 한 줄 안에 분리 표시
  - copy icon 필요
- map select button
  - pin icon 필요

### Map Preview Area

좌측 `위치 및 좌표계` 안의 지도:

- 어두운 aerial 이미지 또는 생성 이미지 사용
- 노란 polygon outline
- 중앙 crosshair marker
- 우측 zoom control `+`, `-`, target icon
- 하단 면적 badge `면적 82,652.16㎡`
- 하단 우측 `다각형 편집` 버튼

이미지 자산 우선순위:

1. 이미 존재하는 `apps/web/public/assets/viewer/industrial-digital-twin-scene.png` 재사용 가능 여부 확인
2. 레퍼런스와 유사한 산업단지 aerial preview가 필요하면 새 bitmap 자산 생성
3. 지도 polygon과 controls는 CSS/SVG overlay로 구현

### Dataset Cards

`초기 데이터 구성` 섹션:

- 6개 카드
  - 정사영상 `(Orthomosaic)`
  - Point Cloud `(LiDAR)`
  - 3D Mesh `(Textured)`
  - DSM / DEM `(지형모델)`
  - GeoAI 결과 `(탐지/분석)`
  - 보고서 템플릿 `(기본)`
- 각 카드는 체크박스가 좌상단에 있고 active 상태는 노란색
- 각 카드에는 line icon 또는 PNG icon 필요
- 기존 아이콘이 없으면 inline SVG 또는 `public/assets/project-create/icons/*`로 추가

### GeoAI Model Section

- 모델 선택 select: `Road Damage Detection v2.3`
- 보조 설명: `도로 파손, 균열, 포트홀 등 이상 탐지에 최적화된 모델`
- 신뢰도 임계값:
  - number input `0.60`
  - range slider `0.10` ~ `0.95`
  - 노란색 active track
- 검토 워크플로우:
  - `PENDING`, `ACCEPTED`, `REJECTED`, `NEEDS_REVIEW`
  - 각 status pill은 색상 구분
  - 하단 한글 라벨: `대기`, `승인`, `반려`, `재검토`

### Preview Panel

우측 패널:

- title: `프로젝트 미리보기`
- preview image:
  - aerial industrial site
  - yellow polygon overlay
  - expand icon in top-right
  - center crosshair marker
- stats:
  - `예상 데이터셋` / `5 개`
  - `예상 저장 용량` / `128.4 GB`
  - `예상 검토 항목` / `2,340 건`
- team:
  - title `팀 구성 (3)`
  - edit button `편집`
  - 3 rows:
    - DOI Admin (나), `admin@doicorp.com`, badge `소유자`
    - 박서연, `seoyeon.park@doicorp.com`, badge `관리자`
    - 이준호, `junho.lee@doicorp.com`, badge `분석가`
  - avatar circles and remove `x`
- processing plan:
  - 5 numbered rows, right side status `대기`
- warning callout:
  - yellow warning icon
  - title `주의 사항`
  - copy: `선택한 영역의 면적이 50만㎡ 이상입니다. 처리 시간 및 저장 용량을 확인해주세요.`

### Bottom Action Bar

- height approximately 73px
- top border
- background: very dark, slightly separated from body
- buttons:
  - secondary outline: `임시 저장`
  - secondary outline: `취소`
  - primary yellow: `프로젝트 생성`
- primary width is wider than secondary buttons

## Proposed File Changes

계획 단계에서는 아직 변경하지 않는다. 실제 구현 단계에서 필요한 예상 파일은 다음과 같다.

1. `apps/web/app/(workspace)/projects/page.tsx`
   - `EmptyWorkspace` 대신 `ProjectCreatePageContent` 렌더링
   - 페이지 자체는 서버 컴포넌트로 유지 가능

2. `apps/web/app/(workspace)/projects/ProjectCreatePageContent.tsx`
   - content 전용 정적 UI 컴포넌트
   - 사이드바/헤더와 완전히 분리
   - 필요 시 작은 내부 배열 데이터만 포함

3. `apps/web/app/page.module.css`
   - content 영역 전용 class 추가
   - 기존 `.stage`, `.sidebar`, `.topbar`, `.shell`, nav 관련 class는 수정하지 않는다
   - 새 class prefix는 `projectCreate...`로 통일

4. Optional assets
   - `apps/web/public/assets/project-create/preview-industrial-site.png`
   - `apps/web/public/assets/project-create/icons/*.png`
   - 단, 가능하면 CSS/SVG inline icon으로 먼저 처리

## Implementation Sequence

각 단계는 독립적으로 확인 가능한 작은 단위로 진행한다.

### Step 1. Route Content Scaffold

- `/projects` 페이지에서 `EmptyWorkspace`를 새 content wrapper로 교체한다.
- 아직 세부 폼은 만들지 않고, stepper / left column placeholder / right panel placeholder / bottom bar placeholder만 배치한다.
- 사이드바와 상단 헤더 렌더링이 변하지 않는지 확인한다.

검증:

- `http://localhost:43117/projects`
- sidebar, topbar 크기와 위치가 기존과 동일한지 확인
- content 영역만 바뀌었는지 확인

### Step 2. Stepper and Main Grid

- 5-step progress bar 구현
- left/right 2-column grid 구현
- bottom action bar 영역 높이 확보
- scroll/overflow 구조 확정

검증:

- 1672 x 941 viewport에서 레퍼런스와 전체 구조 비율 비교
- 1366px 폭에서도 content가 깨지지 않는지 확인

### Step 3. Basic Info Section

- `기본 정보` panel 구현
- 프로젝트명, 현장명, 현장 유형, 프로젝트 상태, 설명 textarea 구현
- select chevron, active dot 구현

검증:

- input 높이, panel border, label 위치, textarea 비율 확인

### Step 4. Location and Coordinate Section

- 주소 input, 지도에서 선택 button
- 좌표계 select, 중심 좌표 X/Y group, 행정구역 select
- 우측 mini map preview 영역 구현
- polygon/crosshair/zoom controls/area badge/edit button overlay 구현

검증:

- 레퍼런스와 map 비율, overlay 위치 비교
- 필요한 경우 preview 이미지 자산 생성

### Step 5. Initial Dataset Section

- 6개 dataset cards 구현
- checkbox active state, icon, title/subtitle 구성
- 카드 간격과 높이 정렬

검증:

- 레퍼런스처럼 한 줄에 6개가 들어가는지 확인
- icon 크기와 노란 check가 과하지 않은지 확인

### Step 6. GeoAI Model Section

- model select
- model 설명
- threshold number input + range slider
- workflow status pill group 구현

검증:

- slider yellow active track과 status pill 색상 확인
- panel 하단 정렬이 레퍼런스와 유사한지 확인

### Step 7. Preview Panel

- 우측 preview image area 구현
- stats 3개 구현
- team 구성 목록 구현
- 처리 계획 목록 구현
- warning callout 구현

검증:

- 우측 패널이 content 높이에 맞춰 레퍼런스처럼 채워지는지 확인
- 팀 목록/처리 계획/warning이 하단에서 겹치지 않는지 확인

### Step 8. Bottom Action Bar

- bottom action bar와 3개 버튼 구현
- 버튼 hover/focus는 기존 admin 스타일 범위 내에서 최소 구현

검증:

- `프로젝트 생성` primary button 색상/폭/위치 확인
- 하단 bar가 content scroll과 충돌하지 않는지 확인

### Step 9. Pixel Pass

- Playwright screenshot 기준으로 레퍼런스와 비교
- 1672 x 941 viewport 우선 보정
- 이후 1440 x 900, 1366 x 768, mobile/tablet 최소 깨짐 확인

검증:

- `npm run typecheck`
- `npm run build`
- 브라우저 렌더링 확인
- console error 확인

## Asset Plan

필수 가능성이 높은 자산:

- 산업단지 aerial preview 이미지
- dataset card icons
- warning icon
- expand icon
- pin/copy/chevron icons

우선순위:

1. 이미 있는 `apps/web/public/assets/admin/icons` 및 viewer 자산 재사용
2. 단순 UI 아이콘은 inline SVG로 구현
3. 레퍼런스 같은 aerial image가 없으면 bitmap 생성 후 `apps/web/public/assets/project-create/`에 저장

주의:

- 레퍼런스 PNG 전체를 content 배경으로 깔거나 잘라서 쓰지 않는다.
- UI 요소는 실제 HTML/CSS로 구현한다.
- 지도/미리보기 이미지는 배경 자산으로만 사용하고, polygon/control/text는 별도 DOM/CSS로 올린다.

## Acceptance Criteria

- `/projects`에서 프로젝트 생성 정적 UI가 content 영역에 표시된다.
- 사이드바와 상단 헤더바는 수정되지 않는다.
- `작업 관리 > 프로젝트 > 프로젝트 생성` 클릭 흐름은 기존 nav 구조를 유지한다.
- 1672 x 941 기준으로 레퍼런스 화면과 주요 레이아웃, 색상, 간격, 정렬이 높은 수준으로 일치한다.
- 필요한 이미지/아이콘은 앱 자산 경로에 정리되어 있다.
- `npm run typecheck`와 `npm run build`가 통과한다.
- UI 구현 완료 후에는 한국어 작업 보고서를 `docs/reports/YYYY-MM-DD_project-create-v2-ui_작업보고.md` 형식으로 작성한다.

## Open Questions

- 상단 헤더 title/subtitle은 현재 route metadata에서 `프로젝트 생성 / Project Workspace`로 표시되어야 한다. 헤더 수정 금지 조건 때문에 현재 값이 다르게 표시되면, content 구현 전에 사용자 확인이 필요하다.
- 사이드바의 `프로젝트 생성` active 상태가 현재 `/projects`에서 정확히 표시되는지 브라우저로 확인해야 한다. active 처리가 다르면 사이드바 수정 없이 해결 가능한지 먼저 판단한다.
- 레퍼런스의 산업단지 aerial 이미지를 새로 생성할지, 기존 viewer 자산을 임시 사용하고 후속 단계에서 교체할지 결정이 필요하다.
