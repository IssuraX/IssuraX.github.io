# 신동혁 Web Publisher Portfolio
웹 퍼블리셔 경력 4년 5개월을 기준으로 정리한 개인 포트폴리오 사이트입니다.  
에이전시, 자체 서비스, 운영/유지보수, 리뉴얼 프로젝트 경험을 프로젝트 단위로 보여주는 것을 목표로 합니다.

**Live Site**  
https://IssuraX.github.io

## 목적
이 포트폴리오는 단순히 화면 결과물을 나열하는 사이트가 아니라,
실무에서 어떤 문제를 맡았고 어떻게 해결했는지를 보여주기 위한 사이트입니다.
각 프로젝트는 다음 기준으로 정리합니다.
- 프로젝트 배경
- 담당 역할과 기여도
- 문제 상황
- 해결 방식
- 결과와 성과

## 주요 구성
- `index.html` : 메인 소개, 프로젝트 목록, 작업 이력, 스킬, 연락처
- `projects/` : 프로젝트 상세 페이지
- `css/style.css` : 메인 페이지 스타일
- `css/projects.css` : 프로젝트 상세 페이지 스타일
- `js/main.js` : 메인 인터랙션, 히어로 캔버스, Swiper, 메뉴 제어
- `js/projects.js` : 상세 페이지 공통 인터랙션
- `assets/` : 이미지, 이력서 PDF, favicon 등 정적 리소스

## 현재 디자인 방향
- 컬러: 화이트 + 라이트블루 기반의 밝은 포트폴리오 톤
- 폰트: Pretendard 단일 폰트 사용
- 폰트 위계: 별도 영문/디스플레이 폰트 없이 굵기 차이로만 구분

## 반영된 업데이트

### 2026.06
- 기존 블랙 + 형광 노랑 컬러 조합을 화이트 + 라이트블루 계열로 변경
- `Bebas Neue`, `Noto Sans KR`, `JetBrains Mono` 등 기존 Google Fonts 의존 제거
- Pretendard 단일 폰트 체계로 통일
- `--mono`, `--sans`, `--display` CSS 변수는 유지하되 모두 Pretendard를 바라보도록 정리
- 큰 제목, 라벨, 숫자 강조는 폰트 종류가 아닌 `font-weight`로 처리
- 메인 페이지에 `skip-nav`, `main#main-content`, nav `aria-label` 추가
- 상세 페이지에 `skip-nav`, `main#project-content`, nav `aria-label` 추가
- 모바일 메뉴 닫힘 시 `aria-expanded`, `aria-hidden` 값이 함께 갱신되도록 보강
- 히어로 캔버스 파티클 색상을 라이트블루 계열로 조정
- 한글 인코딩 깨짐 문제 복구 및 재검증

### 2026.02
- 메인 레이아웃 및 프로젝트 상세 페이지 구성
- 반응형 레이아웃 정리
- 프로젝트 카드, 작업 이력, 스킬 영역 추가
- Swiper 기반 작업 이력 슬라이더 구성

### 2026.01
- 초기 포트폴리오 구조 구성
- GitHub Pages 배포 기반 설정

## 기술 스택
- HTML5
- CSS3
- JavaScript
- Swiper
- Git / GitHub Pages

## 작업 및 배포
- 로컬 작업: VS Code + Live Server 기준
- 버전 관리: Git
- 배포: GitHub Pages

## 연락처
- Email: bysaru@gmail.com
- GitHub: https://github.com/IssuraX
