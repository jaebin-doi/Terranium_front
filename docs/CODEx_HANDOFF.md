# Codex Handoff — Terranium Front Static Admin Mockup

작성일: 2026-05-12

## 현재 역할 기준

- 현재 `terranium_front` 작업공간에서는 Codex가 메인 프론트엔드 개발자다.
- 사용자는 Claude를 쓰지 않고 Codex가 직접 구현하기를 원한다.
- 단, 사용자가 Playwright MCP를 설치한 뒤 세션을 재시작할 예정이므로, 재시작 후 Codex가 MCP 검증까지 직접 이어서 수행한다.
- git은 사용하지 않는다.
- 백엔드, DB, FastAPI, 인프라 작업은 하지 않는다.

## 현재 목표

`design/assets/images/generated/테라니움_플랫폼_목업/주요_화면/08_관리자_콘솔_시스템설정.png` 레퍼런스를 정적 사이트로 최대한 동일하게 재현한다.

현재 1차 범위:

1. 사이드바와 최상단 헤더바만 구현한다.
2. 본문은 실제 데이터 내용을 채우지 않고, 카드 레이아웃 박스만 구축한다.
3. Playwright MCP를 이용해 레퍼런스와 스크린샷을 비교하며 싱크로율을 높인다.
4. 사이드바 최상단 로고는 텍스트 포함 투명 PNG 이미지로 넣는다.
5. 모든 것은 정적 페이지와 데모 데이터로 구현한다.
6. 사이드바 아이콘은 직접 생성한 PNG 이미지를 적용한다.
7. 상단 헤더바 알림, 도움말/돋보기 계열, 설정 아이콘은 기존 SVG/브라우저 렌더 방식 사용 가능. 이미지 생성하지 않아도 된다.

## 중요 레퍼런스

기준 이미지:

```text
design/assets/images/generated/테라니움_플랫폼_목업/주요_화면/08_관리자_콘솔_시스템설정.png
```

이미지 크기:

```text
1672 x 941
```

## 현재 구현 상태

`apps/web`는 이전 Claude 산출물을 모두 삭제한 뒤 새로 만들었다.

현재 추가된 주요 파일:

```text
apps/web/package.json
apps/web/package-lock.json
apps/web/next.config.ts
apps/web/tsconfig.json
apps/web/next-env.d.ts
apps/web/app/layout.tsx
apps/web/app/globals.css
apps/web/app/page.tsx
apps/web/app/page.module.css
apps/web/public/assets/admin/logo-terranium.png
apps/web/public/assets/admin/icons/*.png
```

생성된 자산:

- `logo-terranium.png`: 투명 배경, 로고 심볼 + Terranium 텍스트 포함
- `icons/*-white.png`
- `icons/*-yellow.png`

아이콘은 PowerShell/System.Drawing으로 생성한 정적 PNG다.

## 현재 페이지 구조

URL:

```text
http://localhost:3000
```

구현 범위:

- 좌측 사이드바
- 상단 헤더바
- 헤더 아래 탭 바
- 본문 카드 레이아웃 박스만

본문 카드에는 아직 실제 텍스트/차트/테이블 데이터를 넣지 않는다.

## 설치 및 실행 명령

```powershell
cd C:\Users\admin\Desktop\terranium_front\apps\web
npm install
npm run dev
```

검증 명령:

```powershell
npm run typecheck
npm run build
```

현재 `npm install`, `npm run typecheck`, `npm run build`는 통과했다.

## 현재 로컬 서버

현재 세션에서 `npm run dev`를 백그라운드로 실행해 `http://localhost:3000`이 200 응답을 반환했다.

세션 재시작 후에는 서버가 꺼져 있을 수 있으므로 다시 실행한다.

## Playwright 관련 상태

현재 세션에서는 Playwright MCP 도구가 Codex에 노출되어 있지 않았다.

그래서 임시로 로컬 Chrome headless로 스크린샷을 생성했다:

```text
C:\Users\admin\Desktop\terranium_front\admin-current.png
```

명령:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --headless=new `
  --disable-gpu `
  --hide-scrollbars `
  --window-size=1672,941 `
  --screenshot=C:\Users\admin\Desktop\terranium_front\admin-current.png `
  http://localhost:3000
```

사용자는 이제 Playwright MCP를 설치하고 세션을 재시작할 예정이다.

재시작 후에는 MCP로 다음을 수행한다:

1. `http://localhost:3000` 열기
2. viewport `1672 x 941` 설정
3. 스크린샷 촬영
4. 기준 이미지와 비교
5. CSS/자산 수정
6. 반복

## 현재 구현에서 확인해야 할 점

세션 재시작 후 반드시 확인:

- `apps/web/app/page.module.css`의 수치가 레퍼런스와 맞는지
- 사이드바 폭이 레퍼런스의 약 211px와 맞는지
- 헤더 높이가 약 68px와 맞는지
- 탭 바 높이가 약 42px와 맞는지
- 활성 메뉴 `시스템 설정`의 노란색, 배경, 좌측 rail 위치가 맞는지
- 로고 이미지 위치/크기/텍스트가 레퍼런스와 충분히 가까운지
- 상단 우측 알림 배지 위치가 맞는지
- 본문 빈 카드 레이아웃 박스가 레퍼런스 카드 위치와 대략 맞는지

## 남은 작업

1. Playwright MCP 설치 후 실제 브라우저 스크린샷 확인
2. 레퍼런스와 현재 화면 비교
3. CSS 좌표/크기/색상/간격 보정
4. 필요 시 로고 PNG와 아이콘 PNG 재생성
5. 싱크로율이 충분히 높아질 때까지 반복
6. 완료 후 간단한 작업 보고를 사용자에게 제공

## 주의사항

- 레퍼런스 PNG 전체를 페이지 배경으로 깔거나 그대로 삽입하지 않는다.
- 본문 내용은 이번 범위에서 비워둔다.
- 새 UI 라이브러리, Tailwind, shadcn/ui는 도입하지 않는다.
- 실제 API, 인증, DB는 구현하지 않는다.
- git 명령은 사용하지 않는다.
