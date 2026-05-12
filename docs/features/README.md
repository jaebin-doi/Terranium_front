# MVP Feature Specs

이 폴더는 UI 설계자가 MVP 단계별 기능 범위를 빠르게 확인하기 위한 기능 상세 문서 모음이다.

## 문서 목록

- `MVP_A_FEATURES.md` — MVP-A 데모 제품 기능 상세. 현재 UI 작업의 1차 기준.
- `MVP_B_FEATURES.md` — MVP-B / Pilot 기능 상세. 실제 고객 데이터, 저장소, 처리 파이프라인, 운영 기능 기준.

## 읽는 순서

1. MVP-A 화면을 그리고 있다면 `MVP_A_FEATURES.md`를 먼저 본다.
2. MVP-A에서 제외된 기능이 왜 빠졌는지 확인하려면 `MVP_B_FEATURES.md`의 대응 항목을 본다.
3. 기술 검증 결과와 남은 리스크는 `../PHASE_0_COMPLETION_SUMMARY.md`와 `../MVP_A_READINESS_CHECKLIST.md`를 함께 본다.

## 작성 기준

- MVP-A는 고객 데모에서 제품 흐름을 보여주는 범위다.
- MVP-B는 실제 파일 처리, 저장소, 권한, 감사 로그 등 운영 검증 범위다.
- UI 문구, 화면 구획, 상태값은 이 문서의 표현을 우선 참고한다.
- 세부 API 계약은 `../../api/API_CONTRACT_DRAFT.md`를 따른다.
