<p align="center">
  <img src="./Diary/src/pages/main/addon/img/logo.png" width="120" alt="EmotionLog 로고" />
</p>

<h1 align="center">EmotionLog 📘</h1>

_감정을 기록하고, 시각화하고, 스스로를 이해하기 위한 감정 일기 웹 플랫폼_

<p align="center">
  <img src="https://[supabase-url]/storage/v1/object/public/[bucket]/logo.png" width="120" alt="EmotionLog 로고" />
</p>

---

## 🧩 프로젝트 소개

EmotionLog는 하루에 하나의 감정을 기록하고, 해당 데이터를 기반으로 감정 흐름과 통계를 제공하는 감정일기 플랫폼입니다.

이 프로젝트는 단순한 CRUD 기능이 아닌, '감정'이라는 추상적인 데이터를 시각화하고 사용자 경험을 감성적으로 구성해보자는 목적에서 출발했습니다.

'기획 → 구조 설계 → 상태 관리 → UI 흐름 → 통계 분석 → 배포'까지 전 과정을 실제 서비스처럼 구축하는 데 중점을 두었습니다.

**사용자 흐름의 예시**

- 사용자가 로그인하면, 이전 감정 데이터를 기반으로 오늘의 감정을 입력하도록 유도합니다.
- 작성된 감정은 자동으로 태그 분류 + 날짜 연동되어 캘린더와 통계에 반영됩니다.
- 사용자는 감정 흐름을 전체적인 컬러 테마에서 볼 수 있고, 대시보드에서 시각화해보고, 원하는 감정을 필터링하거나 분석할 수 있습니다.

| 항목          | 내용                                                 |
| ------------- | ---------------------------------------------------- |
| 📌 프로젝트명 | EmotionLog                                           |
| 🗓️ 개발 기간  | 2025.02 ~ 진행 중 (기능 추가 및 개선 계속 진행)      |
| 🛠️ 주요 기술  | React, TypeScript, Supabase, Redux Toolkit, Recharts |
| ✨ 주요 기능  | 감정 일기, 통계 대시보드, 감정별 테마, 캘린더 필터   |

- ✍️ 감정 일기 작성, 파일 첨부 기능
- 📊 감정 통계 대시보드 (도넛 차트, 막대 그래프, 워드 클라우드 등)
- 📅 작성 캘린더 필터, 통계 기간 필터, 감정 태그 필터, 페이지네이션
- 📌 로그인 기반 개인 감정 히스토리 저장
- 💬 감성적인 UI/UX (디자인에 따라 변화하는 테마, 컬러 시스템 적용)

---

## 🚀 사용 기술 스택

**Frontend**
React, TypeScript, SCSS, Redux Toolkit, classnames

**UI Library**
UI (Material UI v6), React Calendar

**Chart**
Recharts, d3, d3-cloud

**상태 관리**
Redux Toolkit

**Auth & DB**
Supabase (인증, 실시간 데이터베이스, Edge Function)

**Routing**
React Router DOM v7

**날짜 처리**
date-fns

**Lint & Quality**
ESLint, Prettier

**Dev Tools**
Supabase CLI, Docker (환경 세팅용), json-server (mock용)

---

## ⚙️ 담당 역할

EmotionLog는 혼자 진행한 개인 사이드 프로젝트로, 아래의 모든 역할을 직접 수행했습니다.

| 역할 구분            | 상세 설명                                               |
| -------------------- | ------------------------------------------------------- |
| 🔹 기획 및 설계      | 감정 일기 플랫폼 기획, 기능 정의, 전체 UX 흐름 설계     |
| 🔹 프론트엔드 개발   | React + TypeScript 기반 SPA 구현, 기능별 모듈화 구성    |
| 🔹 상태 관리         | Redux Toolkit 활용하여 감정/회원/필터 상태 전역 관리    |
| 🔹 스타일링          | SCSS로 감성 테마 UI 구축, 반응형 레이아웃 구성          |
| 🔹 데이터베이스 설계 | Supabase DB 구조 설계, 감정 기록 저장 및 조회 쿼리 구성 |
| 🔹 인증 및 보안      | Supabase 인증/이메일 확인/비밀번호 재설정 구현          |
| 🔹 차트 분석 시각화  | Recharts, d3 활용한 감정 통계 차트 개발 및 사용자 분석  |
| 🔹 서버 사이드 작업  | Edge Function으로 회원 탈퇴 후 개인정보 삭제 예약 처리  |

---

## 📁 프로젝트 폴더 구조

```bash
📦src
┣ 📂auth                          // 회원가입, 로그인, 탈퇴 관련 모듈
┃ ┣ 📂leave
┃ ┣ 📂login
┃ ┗ 📂signup
┣ 📂pages                         // 실제 화면 페이지 구성
┃ ┣ 📂dashboard                   // 감정 통계 대시보드
┃ ┃ ┗ 📂chart/addon               // 차트 컴포넌트 & 서브 필터들
┃ ┣ 📂emotionBoard                // 감정 일기 게시판
┃ ┃ ┗ 📂addon                     // 캘린더 필터, 감정 태그 필터, 페이지네이션 등
┃ ┗ 📂main                        // 메인 페이지
┃ ┃ ┗ 📂addon                     // 메인 카드 구성 및 헤더(navigation)
┃ ┃ ┃ ┗📂img                      // 로고, 메인 카드의 이미지들
┣ 📂routes                        // 전체 라우팅 설정
┣ 📂store                         // Redux 슬라이스 (auth, 감정, 필터, 페이지네이션 등)
┣ 📂styles                        // SCSS 전역 스타일 관리
┣ 📂types                         // 타입 선언 파일 (예: d3-cloud 타입 등)
┣ 📂utils                         // API 호출 등 유틸 함수
┃ ┣ supabaseApi.ts                // Supabase 관련 API 로직
┃ ┗ supabaseClient.ts             // Supabase 인스턴스 설정
📦supabase
┗ 📂functions/delete-old-users   // Edge Function: 탈퇴 회원 데이터 삭제 처리
┗ index.ts                        // 6개월 후 자동 삭제 로직 구현

📜 .env, package.json, tsconfig.json 등
```

---

## 🚧 프로젝트 로드맵

### 🧑‍💻 회원 정보 관리

- [o] 회원가입 / 로그인 / 로그아웃 / 회원탈퇴
- [o] 회원가입 시 이메일 확인
- [o] 비밀번호 재설정 기능 (비밀번호 찾기)
- [] 회원 탈퇴 후 6개월간 데이터 보관 후 자동 삭제
  (Supabase Edge Function을 이용한 예약 삭제 처리)

---

### 🏠 메인 페이지 구성

- 메인 화면에서 주요 기능을 카드 형태로 안내하며 클릭 시 해당 페이지로 이동합니다.

  (로그인 상태에 따라 진입 제한이 있으며, 로그인하지 않은 사용자는 경고창 후 로그인 페이지로 이동됩니다.)

---

### 📓 감정 일기 기능

- [o] 감정 일기 작성 / 수정 / 삭제
- [o] 사진 첨부 기능
- [o] 하루 1회만 작성 가능
- [o] 내 계정으로만 본인 글 열람 가능 (프라이빗 다이어리)
- [o] 날짜 필터 (기록한 날짜에 감정 색깔 표시, 캘린더 선택 → 해당 날짜 일기만 표시)
- [o] 감정 태그 필터링
- [o] 페이지네이션 + Redux 상태 유지 (이전 페이지 기억)

---

### 📊 감정 통계 차트

- [o] 기간 필터 (일주일, 한 달, 3개월, 6개월)
- [o] 도넛 차트: 전체 감정 비율과 해당 감정 기록 개수
- [o] 막대 그래프: 가장 많이 / 적게 기록한 감정 비교 차트
- [o] 요일별 감정 트렌드 분석
- [o] 키워드 클라우드: 감정 메모 기반 핵심 단어 추출
- [o] 감정 패턴 분석 후 "최근 7일간 스트레스가 많았어요. 휴식이 필요할 수도 있어요!" 같은 메시지 출력

---

### 🎨 감정 테마 연동 UI

- [] 감정에 따라 자동 테마 색상 변경
  (예: 기쁨 입력 시 밝은 테마, 슬픔 입력 시 어두운 테마)
- [] 사용자 지정 테마 선택 가능 (기본 테마 설정)

---

### 🐳 환경 구성 및 서버 기능

- [o] Docker & WSL 설치 및 환경 구성 완료

  - 로컬 리눅스 개발 환경 구축을 위해 Docker + WSL2 설정 완료
  - **(현재 서비스는 Docker 기반으로 구동하진 않지만, 전체 설치 및 연동 경험 보유)**

- [o] Supabase CLI 설치 및 프로젝트 초기화

  - CLI 명령어를 활용한 로컬 DB, 인증, Storage 테스트 경험
  - `supabase start`, `supabase link`, `.env` 구성, local dev + 배포 연동 완료

- [] Supabase Edge Function 직접 배포 및 테스트
  - 회원 탈퇴 시 `deleted_at` 기록
  - **6개월 후 개인정보 삭제 로직 구현** (Edge Function으로 예약 자동 삭제 처리)

---

### 🍒 이후 개발 예정 작업들

- [] 회원가입 시 insert 정책 변경, email 중복 확인 기능
- [] 힐링 기능(ex: 포춘쿠키, 감정 챗봇)
