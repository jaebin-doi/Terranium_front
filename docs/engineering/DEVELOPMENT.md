# Development Guide

이 문서는 Terranium 저장소의 로컬 실행, 배포 기준, Git 브랜치 운영 규칙을 정리한다.

## 현재 실행 대상

현재 프로덕션 대상은 정적 랜딩 사이트다.

```text
apps/landing/
```

로컬 실행:

```powershell
npx http-server apps/landing -p 8770 -c-1
```

또는:

```powershell
npx serve apps/landing
```

## 배포 기준

- 현재 정적 호스팅 루트는 `apps/landing/`이다.
- `main`은 실제 상용화/프로덕션 배포 시점에만 사용한다.
- 일반 개발 결과물은 `develop`에 통합한다.

## 브랜치 전략

```text
main
  실제 상용화/프로덕션 배포 브랜치

develop
  통합 개발 브랜치

feature/*
  개별 기능 작업 브랜치
```

운영 규칙:

- 기본 작업 기준 브랜치는 `develop`이다.
- 개별 기능은 `feature/<short-name>` 브랜치에서 작업한다.
- 기능 완료 후 `develop`에 머지한다.
- 사용자의 명시적 지시 없이 `main`에 직접 커밋하거나 머지하지 않는다.
- `main` 반영은 상용화 배포 준비가 끝난 뒤 별도 승인 하에 진행한다.

## 커밋 전 확인

```powershell
git status --short --ignored
```

무시되어야 하는 로컬 산출물:

- `.playwright-mcp/`
- `render_check.png`
- 로그, 캐시, 임시 파일
- `.env` 계열 환경 변수 파일

## 현재 구현 전제

- `apps/landing`은 plain HTML/CSS/JS다.
- `apps/web`과 `apps/api`는 향후 구현을 위한 예약 폴더다.
- 아직 Next.js/FastAPI 보일러플레이트를 생성하지 않는다.
- 저장소 구조 기준은 `docs/architecture/REPOSITORY_STRUCTURE.md`를 따른다.
