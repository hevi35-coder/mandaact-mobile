# CLAUDE.md - MandaAct Mobile

**프로젝트**: MandaAct Mobile (React Native)
**마이그레이션 대상**: MandaAct PWA → React Native
**시작일**: 2025-11-15
**현재 진행률**: 35-40%

---

## 🚀 프로젝트 개요

MandaAct PWA의 React Native 마이그레이션 프로젝트입니다. Expo SDK 52+를 기반으로 iOS/Android 네이티브 앱을 개발 중입니다.

### 핵심 목표
- ✅ PWA와 100% 기능 동등성
- ✅ 네이티브 UX 제공 (푸시 알림, 애니메이션)
- ✅ 성능 최적화 (Cold start < 2초)
- ✅ 오프라인 지원

---

## 📂 프로젝트 구조

```
mandaact-mobile/
├── src/
│   ├── components/          # UI 컴포넌트 라이브러리
│   │   ├── ui/             # 기본 컴포넌트 (Button, Input, Card)
│   │   ├── feedback/       # Toast, Alert, Loading
│   │   ├── layout/         # Container, Spacer
│   │   └── gamification/   # XP, Badge 컴포넌트
│   ├── screens/             # 화면 컴포넌트
│   │   ├── auth/           # Login, Signup
│   │   ├── home/           # Home, Today
│   │   ├── mandalart/      # List, Create, Detail
│   │   ├── stats/          # Stats (heatmap)
│   │   ├── reports/        # Weekly Report, Diagnosis
│   │   ├── settings/       # Settings
│   │   └── tutorial/       # Tutorial (7 steps)
│   ├── navigation/          # React Navigation 설정
│   ├── providers/           # Context Providers
│   ├── hooks/               # Custom React Hooks
│   ├── lib/                 # 비즈니스 로직 (Web에서 포팅)
│   ├── services/            # API 서비스 (Supabase)
│   ├── store/               # Zustand 전역 상태
│   ├── types/               # TypeScript 타입
│   └── constants/           # 앱 상수
├── assets/                  # 이미지, 폰트, 아이콘
├── docs/                    # 프로젝트 문서
│   └── progress/           # 진행상황 문서
│       ├── CURRENT_STATUS.md    # 현재 상태
│       └── NEXT_STEPS.md        # 다음 작업
├── App.tsx                  # Entry Point
├── app.json                 # Expo 설정
└── package.json             # 의존성
```

---

## 🛠️ 기술 스택

### Framework & Language
- **React Native**: 0.81.5
- **Expo**: SDK 54 (Managed Workflow)
- **TypeScript**: 5.9.2
- **Node.js**: 18+

### Navigation & State
- **React Navigation**: v7 (Stack + Bottom Tabs)
- **Zustand**: v5 (전역 상태)
- **TanStack Query**: v5 (서버 상태, 캐싱)

### UI & Styling
- **NativeWind**: v4.2 (Tailwind CSS for RN)
- **React Native Reanimated**: v3 (애니메이션) - 설치 예정

### Backend & Storage
- **Supabase**: v2.81 (PostgreSQL, Auth, Storage, Edge Functions)
- **AsyncStorage**: v2.2 (로컬 저장소)

### Features
- **Expo Image**: v3.0 (이미지 최적화)
- **Expo Image Picker**: v17.0 (카메라/갤러리)
- **Expo Notifications**: 푸시 알림 (설치 예정)
- **date-fns**: v4.1 + date-fns-tz (타임존 지원)
- **react-native-view-shot**: v4.0 (스크린샷)

---

## 🚀 개발 명령어

### 기본 명령어
```bash
# 개발 서버 시작
npm start

# iOS 시뮬레이터 실행
npm run ios

# Android 에뮬레이터 실행
npm run android

# TypeScript 타입 체크
npm run type-check

# ESLint 검사
npm run lint
npm run lint:fix

# Prettier 포맷
npm run format
```

### Git 워크플로우
```bash
# 현재 상태 확인
git status

# 변경사항 커밋
git add .
git commit -m "feat: 기능 설명"
git push origin main

# 브랜치 생성 (기능 개발 시)
git checkout -b feature/기능명
```

---

## 📊 현재 진행 상황

### ✅ 완료된 Phase

#### Phase 0: 프로젝트 초기화 (100%)
- ✅ Expo 프로젝트 생성
- ✅ TypeScript + ESLint + Prettier 설정
- ✅ NativeWind 설정
- ✅ 핵심 라이브러리 설치

#### Phase 1: 코어 인프라 PoC (90%)
- ✅ Supabase 연동 (AsyncStorage)
- ✅ 인증 플로우 (Login, Signup)
- ✅ React Navigation 설정
- ✅ Zustand + TanStack Query 통합
- ✅ 7개 화면 구현
- ✅ 비즈니스 로직 포팅 (6개 모듈)
- ✅ 핵심 기능 (만다라트 CRUD, 체크 시스템)

### 🔄 진행 중인 Phase

#### Phase 2: UI/UX Migration (40%)
- 🔄 UI 컴포넌트 라이브러리 구축
- 🔄 게임화 UI (배지, XP 바)
- 🔄 애니메이션 추가
- 🔄 UX 개선 (로딩, 에러 처리)

### 🔲 예정된 Phase

#### Phase 3: Feature Migration (20%)
- 🔲 푸시 알림 (Expo Notifications)
- 🔲 AI 리포트 (주간 리포트, 목표 진단)
- 🔲 성능 최적화

#### Phase 4: Testing (0%)
- 🔲 Unit tests (Jest)
- 🔲 Component tests (RNTL)
- 🔲 Integration tests
- 🔲 플랫폼 설정 (iOS, Android)

#### Phase 5: Deployment (0%)
- 🔲 EAS Build
- 🔲 Beta testing (TestFlight, Play Console)
- 🔲 App Store 제출
- 🔲 Google Play 제출

---

## 📝 세션 시작 전 필독

**매 세션 시작 시 반드시 확인**:

1. **진행상황 문서** 읽기
   ```bash
   # 현재 상태 확인
   cat docs/progress/CURRENT_STATUS.md

   # 다음 작업 확인
   cat docs/progress/NEXT_STEPS.md
   ```

2. **Git 상태** 확인
   ```bash
   cd /Users/jhsy/mandaact-mobile
   git status
   git log --oneline -5
   ```

3. **TypeScript** 검사
   ```bash
   npm run type-check
   ```

4. **오늘 작업** 선택
   - `NEXT_STEPS.md`에서 우선순위 확인
   - TodoWrite 도구로 작업 추적

---

## 🎯 구현 완료된 기능

### 인증 & 네비게이션
- ✅ 이메일/비밀번호 로그인
- ✅ 회원가입
- ✅ 세션 자동 복원 (AsyncStorage)
- ✅ Auth vs Main 네비게이션 분기
- ✅ Bottom Tab Navigation

### 만다라트 시스템
- ✅ 만다라트 생성 (3가지 방식)
  - Image OCR (카메라/갤러리)
  - Text Paste (클립보드 파싱)
  - Manual Input (수동 입력)
- ✅ 만다라트 목록 조회
- ✅ 9x9 그리드 시각화
- ✅ 활성화/비활성화
- ✅ 삭제

### 액션 체크 시스템
- ✅ 오늘의 액션 목록
- ✅ 타입별 필터 (전체/루틴/미션)
- ✅ 체크/언체크
- ✅ XP 획득 로직
- ✅ Optimistic Update

### 통계
- ✅ 4주 활동 히트맵
- ✅ 날짜별 체크 수 시각화
- ✅ 색상 intensity 기반 표시

### 데이터 레이어
- ✅ Custom Hooks (5개)
  - useMandalarts
  - useMandalartMutations
  - useTodayActions
  - useActionMutations
  - useUserProfile
- ✅ TanStack Query 캐싱
- ✅ Zustand 전역 상태

### 비즈니스 로직
- ✅ actionTypes.ts (타입 추천)
- ✅ xpMultipliers.ts (XP 계산, 배율)
- ✅ badgeEvaluator.ts (배지 평가)
- ✅ stats.ts (통계 계산)
- ✅ timezone.ts (KST 타임존)

---

## 🔲 미구현 기능

### 우선순위 High
- [ ] UI 컴포넌트 라이브러리
- [ ] Settings 화면
- [ ] Reports 화면
- [ ] Tutorial 화면
- [ ] 게임화 UI (배지 갤러리, XP 바)
- [ ] 푸시 알림
- [ ] 애니메이션 (Reanimated)

### 우선순위 Medium
- [ ] AI 리포트 통합
- [ ] 성능 최적화
- [ ] 오프라인 지원
- [ ] 에러 핸들링

### 우선순위 Low
- [ ] 테스트 (Unit, Component, E2E)
- [ ] 플랫폼 설정 (iOS, Android)
- [ ] 접근성
- [ ] CI/CD

---

## 🐛 알려진 이슈

**현재**: TypeScript 0 errors ✅

**잠재적 이슈**:
1. 9x9 그리드 렌더링 성능 (81 셀)
2. 이미지 OCR 시 메모리 사용량
3. 오프라인 상태 처리 미흡

---

## 📚 관련 문서

### Web 프로젝트
- `/Users/jhsy/mandaact/CLAUDE.md`
- `/Users/jhsy/mandaact/docs/project/ROADMAP.md`
- `/Users/jhsy/mandaact/docs/project/PRD_mandaact.md`

### Mobile 마이그레이션 로드맵
- `/Users/jhsy/mandaact/docs/migration/REACT_NATIVE_MIGRATION_ROADMAP.md`
- `/Users/jhsy/mandaact/docs/migration/IMPLEMENTATION_TIMELINE.md`
- `/Users/jhsy/mandaact/docs/migration/TECHNICAL_DECISIONS.md`

### Mobile 진행상황 (중요!)
- `/Users/jhsy/mandaact-mobile/docs/progress/CURRENT_STATUS.md` ⭐
- `/Users/jhsy/mandaact-mobile/docs/progress/NEXT_STEPS.md` ⭐
- `/Users/jhsy/mandaact-mobile/README.md`

---

## 🔧 환경 설정

### 필수 사항
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) 또는 Android Emulator

### 환경 변수
`.env` 파일 생성:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://gxnvovnwlqjstpcsprqr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 첫 실행
```bash
cd /Users/jhsy/mandaact-mobile
npm install --legacy-peer-deps
npm start
```

---

## ⚠️ 중요 패턴 & 규칙

### 1. 세션 시작 시
- **필수**: `docs/progress/CURRENT_STATUS.md` 읽기
- **필수**: `docs/progress/NEXT_STEPS.md`에서 작업 확인
- Git 상태 확인 (`git status`)
- TypeScript 검사 (`npm run type-check`)

### 2. 코드 작성 시
- TypeScript strict mode 준수
- NativeWind 사용 (Tailwind 문법)
- Custom hooks로 로직 분리
- TanStack Query로 서버 상태 관리
- Zustand로 전역 상태 관리

### 3. 커밋 메시지
```bash
feat: 새 기능 추가
fix: 버그 수정
refactor: 리팩토링
chore: 설정, 의존성 업데이트
docs: 문서 수정
```

### 4. 세션 종료 시
- Git commit + push
- `CURRENT_STATUS.md` 업데이트 (필요 시)
- 완료 항목 체크

---

## 📈 성공 기준

### 기술 메트릭
- ✅ TypeScript 0 errors (달성)
- 🎯 Cold start < 2초
- 🎯 Crash-free rate > 99.5%
- 🎯 Test coverage > 70%
- 🎯 App size < 50MB (iOS) / 30MB (Android)

### 기능 완성도
- ✅ 핵심 기능 (만다라트 CRUD, 체크) - 100%
- 🔄 게임화 시스템 - 30%
- 🔲 리포트 시스템 - 0%
- 🔲 푸시 알림 - 0%
- 🔲 튜토리얼 - 0%

---

## 🎯 다음 작업

**즉시 작업** (오늘):
1. Git 정리 (commit + push)
2. UI 컴포넌트 라이브러리 시작
   - Button, Input, Card 컴포넌트

**이번 주 목표** (Week 4):
- UI 컴포넌트 라이브러리 완성 (7개)
- 게임화 UI 컴포넌트 (5개)

**다음 주 목표** (Week 5):
- Settings, Reports, Tutorial 화면
- 애니메이션 추가 (Reanimated)

---

## 🔗 유용한 링크

### 공식 문서
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Supabase](https://supabase.com/docs)

### 프로젝트
- [GitHub - Web](https://github.com/hevi35-coder/mandaact)
- [GitHub - Mobile](https://github.com/hevi35-coder/mandaact-mobile)
- [Vercel - PWA](https://mandaact.vercel.app)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-16
**Next Review**: Phase 2 완료 시
