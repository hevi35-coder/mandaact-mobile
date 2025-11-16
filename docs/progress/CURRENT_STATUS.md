# MandaAct Mobile - 현재 진행상황

**최종 업데이트**: 2025-11-16 (Session 5)
**프로젝트 시작**: 2025-11-15
**전체 진행률**: 80%
**현재 Phase**: Phase 3 진행 중 - AI 리포트 + 푸시 알림 통합 완료

---

## 📊 Phase별 진행 현황

| Phase | 목표 | 완료율 | 상태 | 비고 |
|-------|------|--------|------|------|
| **Phase 0** | 프로젝트 초기화 | 100% | ✅ Complete | Expo + TypeScript 설정 완료 |
| **Phase 1** | 코어 인프라 PoC | 100% | ✅ Complete | 모든 화면 완성 |
| **Phase 2** | UI/UX 마이그레이션 | 100% | ✅ Complete | **전 화면 UI 컴포넌트 적용 완료** |
| **Phase 3** | 기능 마이그레이션 | 75% | 🔄 진행 중 | **AI 리포트 + 푸시 알림 완료**, 성능 최적화 예정 |
| **Phase 4** | 테스팅 | 0% | 🔲 미시작 | - |
| **Phase 5** | 배포 | 0% | 🔲 미시작 | - |

---

## ✅ 완료된 작업

### Phase 0: 프로젝트 초기화 (100%)

**환경 설정**:
- ✅ Expo SDK 54 프로젝트 생성 (React Native 0.81.5)
- ✅ TypeScript 5.9 설정
- ✅ ESLint + Prettier 설정
- ✅ NativeWind 4.2 설정 (Tailwind CSS for RN)
- ✅ Git 저장소 초기화 (별도 레포)

**핵심 라이브러리 설치**:
- ✅ React Navigation v7 (Stack + Bottom Tabs)
- ✅ Zustand v5 (전역 상태)
- ✅ TanStack Query v5 (서버 상태)
- ✅ Supabase JS v2 (백엔드)
- ✅ AsyncStorage v2 (로컬 저장소)
- ✅ Expo Image, Image Picker, Document Picker
- ✅ date-fns + date-fns-tz (타임존 지원)
- ✅ react-native-view-shot (스크린샷)

---

### Phase 1: 코어 인프라 PoC (90%)

#### 1.1 Supabase 연동 ✅
**파일**: `src/lib/supabase.ts`, `src/services/supabase.ts`

```typescript
// AsyncStorage 통합 완료
const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
  }
})
```

**기능**:
- ✅ 세션 자동 복원
- ✅ 토큰 자동 갱신
- ✅ 네이티브 스토리지 연동

---

#### 1.2 인증 플로우 ✅
**파일**:
- `src/screens/auth/LoginScreen.tsx`
- `src/screens/auth/SignupScreen.tsx`
- `src/store/authStore.ts`

**기능**:
- ✅ 이메일/비밀번호 로그인
- ✅ 회원가입
- ✅ Zustand 상태 관리
- ✅ 자동 로그인 (세션 복원)
- ✅ 한글 에러 메시지

---

#### 1.3 네비게이션 구조 ✅
**파일**:
- `src/navigation/RootNavigator.tsx`
- `src/navigation/MainTabNavigator.tsx`

**구조**:
```
RootNavigator
├── Auth Stack (로그인 안됨)
│   ├── Login
│   └── Signup
└── Main Tabs (로그인됨)
    ├── Home (홈)
    ├── Today (오늘의 실천)
    ├── Mandalart (만다라트)
    └── Stats (통계)
```

**기능**:
- ✅ 인증 상태별 자동 라우팅
- ✅ Bottom Tab Navigation
- ✅ TypeScript 타입 안전성

---

#### 1.4 State Management ✅
**전역 상태 (Zustand)**:
- `src/store/authStore.ts` - 인증 상태

**서버 상태 (TanStack Query)**:
- `src/providers/QueryProvider.tsx` - Query Client 설정
- Custom Hooks 5개:
  - `useMandalarts.ts` - 만다라트 목록 조회
  - `useMandalartMutations.ts` - 만다라트 생성/수정/삭제
  - `useTodayActions.ts` - 오늘의 액션 조회
  - `useActionMutations.ts` - 액션 체크/언체크
  - `useUserProfile.ts` - 사용자 프로필 (XP/레벨)

**캐싱 전략**:
- ✅ gcTime: 24시간
- ✅ staleTime: 5분
- ✅ Retry: 3회 (exponential backoff)

---

#### 1.5 화면 구현 ✅
**완료된 화면 (7개)**:

1. **LoginScreen** ✅
   - 이메일/비밀번호 입력
   - 유효성 검사
   - 에러 표시

2. **SignupScreen** ✅
   - 회원가입 폼
   - 비밀번호 확인
   - Supabase 연동

3. **HomeScreen** ✅
   - 사용자 프로필 (레벨, XP)
   - 오늘의 진행률
   - Quick Actions
   - 활성 만다라트 목록

4. **TodayScreen** ✅
   - 오늘의 액션 목록
   - 타입별 필터 (전체/루틴/미션)
   - 체크/언체크 기능
   - XP 획득 표시
   - 만다라트별 그룹화

5. **MandalartListScreen** ✅
   - 만다라트 목록
   - 활성화/비활성화 토글
   - 삭제 기능
   - 상세 페이지 이동

6. **MandalartCreateScreen** ✅
   - **3가지 입력 방식**:
     - Image OCR (카메라/갤러리)
     - Text Paste (클립보드 파싱)
     - Manual Input (수동 입력)
   - AI 타입 제안
   - 미리보기 및 수정
   - Supabase Storage 업로드

7. **MandalartDetailScreen** ✅
   - 9x9 그리드 시각화
   - 핵심 목표 강조
   - 세부 목표별 색상 구분
   - 스크롤 뷰

8. **StatsScreen** ✅
   - 4주 활동 히트맵
   - 날짜별 체크 수 표시
   - 색상 intensity 기반 시각화

---

#### 1.6 비즈니스 로직 포팅 ✅
**Web 프로젝트에서 성공적으로 포팅된 모듈**:

1. **actionTypes.ts** ✅
   - 액션 타입 추천 시스템 (루틴/미션/참고)
   - `shouldShowToday()` 로직
   - 한글 키워드 패턴 매칭

2. **xpMultipliers.ts** ✅
   - XP 계산 로직
   - 배율 시스템 (주말, 복귀, 마일스톤, 완벽한 주)
   - `calculateXPWithMultipliers()` 함수
   - 레벨 계산 (하이브리드 로그 곡선)

3. **badgeEvaluator.ts** ✅
   - 배지 평가 로직
   - 21개 배지 정의
   - 진행률 계산

4. **stats.ts** ✅
   - 통계 계산 함수들
   - 완료율, 스트릭, 활동 일수
   - 만다라트 필터링

5. **timezone.ts** ✅
   - KST 타임존 유틸리티
   - 오늘 날짜 계산 (서버 시간 기준)

6. **supabase.ts** ✅
   - Supabase 클라이언트 설정
   - AsyncStorage 통합
   - 환경변수 관리

---

#### 1.7 핵심 기능 구현 ✅

**만다라트 시스템**:
- ✅ CRUD 기능 (생성, 조회, 수정, 삭제)
- ✅ 활성화/비활성화
- ✅ 9x9 그리드 시각화
- ✅ Image OCR 플로우 (Upload → Edge Function → Parse)
- ✅ Text Paste 파싱
- ✅ Manual Input with AI suggestions

**액션 체크 시스템**:
- ✅ 체크/언체크 기능
- ✅ XP 획득 로직
- ✅ Optimistic Update (즉시 UI 반영)
- ✅ 오늘의 액션 필터링 (shouldShowToday)
- ✅ 타입별 필터 (루틴/미션/참고)

**통계 시스템**:
- ✅ 4주 히트맵
- ✅ 체크 수 집계
- ✅ 날짜별 시각화

---

## 🔄 진행 중인 작업

### Phase 2: UI/UX 마이그레이션 (40%)

**완료됨**:
- ✅ 기본 화면 레이아웃
- ✅ NativeWind 스타일링
- ✅ Bottom Tab Navigation

**진행 중**:
- 🔄 UI 컴포넌트 라이브러리 구축
- 🔄 애니메이션 추가 (Reanimated)
- 🔄 UX 개선 (로딩 상태, 에러 처리)

---

## 🔲 미구현 항목

### 우선순위 High (Phase 2-3)

**1. UI 컴포넌트 라이브러리**
- [ ] Button 컴포넌트 (primary, secondary, ghost)
- [ ] Input 컴포넌트 (validation, error states)
- [ ] Card 컴포넌트
- [ ] Toast/Alert 컴포넌트
- [ ] Modal/BottomSheet 컴포넌트
- [ ] Loading Spinner/Skeleton
- [ ] Badge 컴포넌트

**2. 미구현 화면**
- [ ] Settings 화면 (알림, 계정 관리)
- [ ] Reports 화면 (주간 리포트 + 목표 진단)
- [ ] Tutorial 화면 (7단계 온보딩)
- [ ] Profile 화면 (상세 프로필, 배지 갤러리)

**3. 게임화 시스템 UI**
- [ ] 배지 해제 애니메이션
- [ ] XP 획득 애니메이션
- [ ] 레벨업 알림
- [ ] 배지 갤러리
- [ ] 진행 상황 바 (XP to next level)
- [ ] 스트릭 표시 (불꽃 아이콘)

**4. AI 통합**
- [ ] 주간 리포트 생성 (Perplexity API)
- [ ] 목표 진단 (SMART 분석)
- [ ] 리포트 마크다운 렌더링
- [ ] 리포트 히스토리

**5. 푸시 알림**
- [ ] Expo Notifications 설정
- [ ] 권한 요청 플로우
- [ ] 일일 리마인더 (오후 9시)
- [ ] 배지 해제 알림
- [ ] 주간 리포트 완성 알림
- [ ] 스트릭 위험 알림

**6. 애니메이션**
- [ ] React Native Reanimated 3 설치
- [ ] 체크 애니메이션 (scale + fade)
- [ ] 배지 해제 애니메이션 (confetti)
- [ ] XP 바 증가 애니메이션
- [ ] 화면 전환 애니메이션
- [ ] Pull-to-refresh

---

### 우선순위 Medium (Phase 3-4)

**7. 성능 최적화**
- [ ] FlatList 가상화 (긴 목록)
- [ ] 이미지 최적화 (resize before upload)
- [ ] Memo 최적화 (React.memo, useMemo)
- [ ] Code splitting
- [ ] Bundle size 분석

**8. 오프라인 지원**
- [ ] AsyncStorage persistence (TanStack Query)
- [ ] 오프라인 큐 (failed requests)
- [ ] 네트워크 상태 표시
- [ ] Sync 로직

**9. 에러 핸들링**
- [ ] 전역 에러 바운더리
- [ ] 네트워크 에러 처리
- [ ] 한글 에러 메시지
- [ ] Retry 로직 개선
- [ ] Sentry 연동 (crash reporting)

**10. 접근성**
- [ ] Screen reader 지원
- [ ] 색상 대비 개선
- [ ] 터치 타겟 크기 (44x44)
- [ ] 폰트 크기 조정

---

### 우선순위 Low (Phase 4-5)

**11. 테스팅**
- [ ] Jest 설정
- [ ] Unit tests (비즈니스 로직)
- [ ] Component tests (React Native Testing Library)
- [ ] Integration tests
- [ ] E2E tests (Detox) - 선택사항

**12. 플랫폼 설정**
- [ ] iOS 설정 (Info.plist, icons)
- [ ] Android 설정 (permissions, adaptive icon)
- [ ] App Store 스크린샷
- [ ] Play Store 스크린샷

**13. CI/CD**
- [ ] GitHub Actions 설정
- [ ] EAS Build 설정
- [ ] 자동 배포 파이프라인

---

## 📂 프로젝트 구조

```
mandaact-mobile/
├── src/
│   ├── components/          # 🔲 미구현 (컴포넌트 라이브러리)
│   ├── screens/             # ✅ 7개 화면 완료
│   │   ├── auth/           # ✅ Login, Signup
│   │   ├── home/           # ✅ Home, Today
│   │   ├── mandalart/      # ✅ List, Create, Detail
│   │   └── stats/          # ✅ Stats (heatmap)
│   ├── navigation/          # ✅ Root + Tab Navigator
│   ├── providers/           # ✅ QueryProvider
│   ├── hooks/               # ✅ 5개 custom hooks
│   ├── lib/                 # ✅ 6개 비즈니스 로직 모듈
│   ├── services/            # ✅ Supabase service
│   ├── store/               # ✅ authStore
│   ├── types/               # ✅ TypeScript 타입
│   └── constants/           # 🔲 미구현
├── assets/                  # ✅ 기본 아이콘
├── docs/                    # ✅ 진행상황 문서
├── App.tsx                  # ✅ Entry point
├── app.json                 # ✅ Expo 설정
├── package.json             # ✅ 의존성
└── tsconfig.json            # ✅ TypeScript 설정
```

---

## 🛠️ 기술 스택

| 카테고리 | 기술 | 버전 | 상태 |
|---------|------|------|------|
| **Framework** | Expo | ~54.0 | ✅ |
| **React Native** | RN | 0.81.5 | ✅ |
| **Language** | TypeScript | 5.9 | ✅ |
| **Navigation** | React Navigation | 7.x | ✅ |
| **State (Global)** | Zustand | 5.0 | ✅ |
| **State (Server)** | TanStack Query | 5.90 | ✅ |
| **Styling** | NativeWind | 4.2 | ✅ |
| **Animation** | Reanimated | - | 🔲 미설치 |
| **Backend** | Supabase | 2.81 | ✅ |
| **Storage** | AsyncStorage | 2.2 | ✅ |
| **Image** | Expo Image | 3.0 | ✅ |
| **Notifications** | Expo Notifications | - | 🔲 미설치 |
| **Testing** | Jest + Detox | - | 🔲 미설치 |

---

## 📊 코드 품질

**TypeScript**: ✅ 0 errors (type-check 통과)
**ESLint**: ⚠️ 설정됨 (lint 실행 필요)
**Prettier**: ✅ 설정됨
**Test Coverage**: 🔲 0% (테스트 없음)

---

## 🔧 환경 설정

**개발 환경**:
- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) 또는 Android Emulator

**환경 변수** (`.env`):
```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

**실행 명령어**:
```bash
npm start           # 개발 서버 시작
npm run ios         # iOS 시뮬레이터
npm run android     # Android 에뮬레이터
npm run type-check  # TypeScript 검사
npm run lint        # ESLint 검사
npm run format      # Prettier 포맷
```

---

## 🐛 알려진 이슈

**현재 이슈 없음** (TypeScript 0 errors)

**잠재적 이슈**:
1. **성능**: 9x9 그리드 (81 셀) 렌더링 최적화 필요
2. **메모리**: 이미지 OCR 시 대용량 이미지 처리
3. **네트워크**: 오프라인 상태 처리 미흡

---

## 📈 성공 기준

### 기술 메트릭 (목표)
- ✅ TypeScript 0 errors (달성)
- 🔲 Cold start < 2초
- 🔲 Crash-free rate > 99.5%
- 🔲 Test coverage > 70%
- 🔲 App size < 50MB (iOS) / < 30MB (Android)

### 기능 완성도
- ✅ 핵심 기능 (만다라트 CRUD, 체크) - 100%
- 🔄 게임화 시스템 - 30% (로직 완료, UI 미완)
- 🔲 리포트 시스템 - 0%
- 🔲 푸시 알림 - 0%
- 🔲 튜토리얼 - 0%

---

## 🚀 Git 상태

**브랜치**: `main`
**커밋**: 9 commits (로컬)
**원격**: origin/main (9 commits behind)

**미스테이징 파일**:
- `babel.config.js` (modified)
- `package-lock.json` (modified)
- `package.json` (modified)

**최근 커밋**:
```
9ec0615 fix: Add @expo/vector-icons type declarations
2165a7c fix: Resolve TypeScript errors
92a85fe fix: Add calculateXPWithMultipliers function
81e787c feat: Implement 4-week activity heatmap
6355db6 feat: Implement Mandalart 9x9 grid detail view
...
```

---

## 📝 다음 작업 우선순위

### 즉시 작업 (이번 세션)
1. **Git 정리** 🔴
   ```bash
   git add .
   git commit -m "chore: Update babel config and dependencies"
   git push origin main
   ```

2. **진행상황 문서 작성** 🔴
   - ✅ CURRENT_STATUS.md (현재 문서)
   - 🔄 NEXT_STEPS.md (다음 작업 상세)
   - 🔄 IMPLEMENTATION_LOG.md (구현 일지)

### Week 4 목표 (UI 컴포넌트 라이브러리)
3. **기본 컴포넌트 구축**
   - Button, Input, Card 컴포넌트
   - Toast/Alert 시스템
   - Loading states

4. **게임화 UI**
   - 배지 갤러리
   - XP 진행 바
   - 레벨 표시

### Week 5-6 목표 (화면 완성)
5. **Settings 화면**
   - 알림 설정
   - 계정 관리
   - 앱 정보

6. **Reports 화면**
   - 주간 리포트 요청/표시
   - 목표 진단
   - 마크다운 렌더링

7. **Tutorial 화면**
   - 7단계 온보딩
   - 샘플 데이터

---

## 📚 관련 문서

**Web 프로젝트**:
- `/Users/jhsy/mandaact/CLAUDE.md` - 웹 프로젝트 개요
- `/Users/jhsy/mandaact/docs/project/ROADMAP.md` - 웹 로드맵

**Mobile 마이그레이션**:
- `/Users/jhsy/mandaact/docs/migration/REACT_NATIVE_MIGRATION_ROADMAP.md`
- `/Users/jhsy/mandaact/docs/migration/IMPLEMENTATION_TIMELINE.md`
- `/Users/jhsy/mandaact/docs/migration/TECHNICAL_DECISIONS.md`

**Mobile 진행상황** (현재 문서):
- `/Users/jhsy/mandaact-mobile/docs/progress/CURRENT_STATUS.md`
- `/Users/jhsy/mandaact-mobile/docs/progress/NEXT_STEPS.md` (다음 작성)

---

## 🎯 결론

**현재 상황**: Phase 1 거의 완료 (90%), Phase 2 진행 중 (40%)

**강점**:
- ✅ 빠른 진행 속도 (2일만에 Phase 1 완료)
- ✅ 깔끔한 코드 품질 (TypeScript 0 errors)
- ✅ 체계적인 아키텍처 (비즈니스 로직 분리)
- ✅ 핵심 기능 작동 확인

**다음 집중 영역**:
1. UI 컴포넌트 라이브러리 구축
2. 게임화 시스템 시각화
3. 리포트 및 알림 기능 추가

**예상 완료 시점**:
- Phase 2-3: 2주 (2025-11-30)
- Phase 4-5: 2주 (2025-12-14)
- **전체 완료**: 4-5주 후 (2025-12-20 예상)

---

**문서 버전**: 1.0
**작성자**: Development Team
**다음 리뷰**: Phase 2 완료 시 (2025-11-30 예상)

---

## 🎨 Session 2 완료 항목 (2025-11-16)

### UI 컴포넌트 라이브러리 (100% 완료)

#### 기본 UI 컴포넌트
- ✅ **Button** (`src/components/ui/Button.tsx`)
  - 4 variants: primary, secondary, ghost, danger
  - 3 sizes: sm, md, lg
  - Loading state with spinner
  - Disabled state styling
  - Full-width option
  - TypeScript props validation

- ✅ **Input** (`src/components/ui/Input.tsx`)
  - Label, error, helper text support
  - Left/Right icon slots
  - Password toggle (show/hide)
  - Focus state styling
  - Disabled state
  - TypeScript validation

- ✅ **Card** (`src/components/ui/Card.tsx`)
  - 3 variants: default, bordered, elevated
  - Flexible padding (none, sm, md, lg)
  - Pressable option (onPress)
  - Custom className support

#### Feedback 컴포넌트
- ✅ **Toast** (`src/components/feedback/Toast.tsx`)
  - Context-based toast system (ToastProvider)
  - 4 types: success, error, warning, info
  - Auto-dismiss with configurable duration
  - Slide-in + Fade animations
  - Multiple toasts support
  - Custom icons per type

- ✅ **Alert** (`src/components/feedback/Alert.tsx`)
  - Modal-based alert dialog
  - 4 types: info, success, warning, error
  - Customizable buttons (default, cancel, destructive)
  - Backdrop blur effect
  - Type-based title colors

- ✅ **LoadingSpinner** (`src/components/feedback/LoadingSpinner.tsx`)
  - Simple spinner with optional text
  - Full-screen variant
  - Customizable size and color

#### Layout 컴포넌트
- ✅ **Container** (`src/components/layout/Container.tsx`)
  - Flexible padding options
  - Centered option
  - Custom className support

- ✅ **Spacer** (`src/components/layout/Spacer.tsx`)
  - Simple spacing utility
  - Custom height/width

---

### 게임화 UI 컴포넌트 (100% 완료)

#### XP & Level 컴포넌트
- ✅ **XPProgressBar** (`src/components/gamification/XPProgressBar.tsx`)
  - Animated progress bar (React Native Reanimated)
  - Spring animation on XP change
  - Level display
  - Current/Next level XP counters
  - Progress percentage
  - Customizable height

- ✅ **LevelBadge** (`src/components/gamification/LevelBadge.tsx`)
  - Circular level badge
  - 5 tier colors (Beginner→Master)
    - Level 1-4: Gray (Beginner)
    - Level 5-9: Blue (Intermediate)
    - Level 10-19: Orange (Advanced)
    - Level 20-29: Red (Expert)
    - Level 30+: Purple (Master)
  - 3 sizes: sm, md, lg
  - Shadow effect

#### Badge System 컴포넌트
- ✅ **BadgeCard** (`src/components/gamification/BadgeCard.tsx`)
  - Locked/Unlocked states
  - Type-based icons (emoji):
    - Practice: ✓
    - Streak: 🔥
    - Consistency: 📅
    - Monthly: 🏆
    - Completion: ⭐
    - Special: 💎
  - Progress bar (for locked badges)
  - NEW indicator
  - Unlock date display
  - Pressable (onPress handler)

- ✅ **BadgeGallery** (`src/components/gamification/BadgeGallery.tsx`)
  - Full badge collection display
  - 3 filter tabs: All, Unlocked, Locked
  - Stats header (X/Y badges, progress %)
  - Grid layout (2 columns)
  - Empty states
  - Scrollable

- ✅ **BadgeUnlockModal** (`src/components/gamification/BadgeUnlockModal.tsx`)
  - Celebration modal
  - Scale + Rotate animations (Reanimated)
  - Badge icon with animation
  - XP reward display
  - Backdrop blur
  - Close button

---

### 인프라 업데이트

#### React Native Reanimated 설치 ✅
- ✅ `react-native-reanimated` 패키지 설치
- ✅ Babel 플러그인 설정 (`babel.config.js`)
  - **중요**: 플러그인 배열 마지막에 추가 필수
- ✅ TypeScript 타입 지원

#### NativeWind 타입 선언 ✅
- ✅ `src/types/nativewind.d.ts` 생성
- ✅ className prop 타입 선언:
  - View, Text, Image, Pressable
  - ScrollView, TouchableOpacity, FlatList
- ✅ TypeScript 에러 해결 (0 errors)

#### Toast Provider 통합 ✅
- ✅ `App.tsx`에 ToastProvider 추가
- ✅ Provider 중첩 순서:
  ```tsx
  SafeAreaProvider
    → QueryProvider
      → ToastProvider
        → RootNavigator
  ```

#### Component Exports ✅
- ✅ `src/components/ui/index.ts` (barrel export)
- ✅ `src/components/gamification/index.ts` (barrel export)

---

## 📈 현재 컴포넌트 라이브러리 현황

### 완료된 컴포넌트 (총 12개)
**UI**: Button, Input, Card (3개)
**Feedback**: Toast, Alert, LoadingSpinner (3개)
**Layout**: Container, Spacer (2개)
**Gamification**: XPProgressBar, LevelBadge, BadgeCard, BadgeGallery, BadgeUnlockModal (5개) - **NEW**

### 사용 예시
```tsx
// Toast
import { useToast } from '@/components/ui';
const { showToast } = useToast();
showToast('success', '체크 완료!');

// Button
import { Button } from '@/components/ui';
<Button variant="primary" loading={isLoading} onPress={handlePress}>
  확인
</Button>

// XP Progress Bar
import { XPProgressBar, LevelBadge } from '@/components/gamification';
<XPProgressBar currentXP={1200} nextLevelXP={2000} level={5} />
<LevelBadge level={5} size="md" />

// Badge Gallery
import { BadgeGallery } from '@/components/gamification';
<BadgeGallery 
  badges={allBadges}
  unlockedBadges={myUnlockedBadges}
  badgeProgress={progressData}
  newlyUnlockedIds={['badge_id']}
  onBadgePress={(badge) => console.log(badge)}
/>
```

---


---

## 🎨 Session 3 완료 항목 (2025-11-16)

### Week 5: 미구현 화면 추가 (100% 완료)

#### Settings Screen ✅
**파일**: `src/screens/settings/SettingsScreen.tsx`

**구현 기능**:
- **계정 섹션**
  - 사용자 이메일 표시
  - 사용자 ID 표시 (앞 8자 + ...)
  
- **알림 섹션**
  - 일일 리마인더 설정 (매일 저녁 9시)
  - 배지 알림 설정
  - 리포트 알림 설정
  - Toggle UI (향후 Expo Notifications 연동 예정)

- **앱 정보 섹션**
  - 앱 버전 표시 (1.0.0 Beta)
  - 튜토리얼 다시 보기 버튼

- **로그아웃**
  - 확인 다이얼로그
  - Supabase 로그아웃
  - 상태 초기화

**UI 특징**:
- Card 기반 섹션 레이아웃
- 섹션 헤더 (uppercase label)
- Safe Area 적용
- 한글 UI

---

#### Reports Screen ✅
**파일**: `src/screens/reports/ReportsScreen.tsx`

**구현 기능**:
- **탭 네비게이션**
  - 주간 리포트 탭
  - 목표 진단 탭

- **주간 리포트**
  - Edge Function 호출 (`generate-weekly-report`)
  - Markdown 렌더링 (react-native-markdown-display)
  - 생성 버튼
  - 로딩 상태 (AI가 리포트를 생성하고 있습니다...)
  - 정보 카드 (리포트 설명)
  - 새 리포트 생성 버튼

- **목표 진단**
  - Edge Function 호출 예정 (`generate-goal-diagnosis`)
  - SMART 기준 분석
  - Markdown 렌더링
  - 정보 카드 (SMART 기준 설명)

**Dependencies**:
- ✅ `react-native-markdown-display` 설치
- Markdown 스타일링 커스터마이징
  - Heading 1, 2
  - Body text
  - Bullet lists

**UI 특징**:
- 탭 전환 UI
- Card 기반 레이아웃
- LoadingSpinner 통합
- ScrollView 내 Markdown 렌더링

---

#### Tutorial Screen ✅
**파일**: `src/screens/tutorial/TutorialScreen.tsx`

**구현 기능**:
- **7단계 온보딩**
  1. 환영 메시지 (👋)
  2. 만다라트 구조 설명 (🎯)
  3. 3가지 생성 방법 (📝)
  4. 액션 타입 시스템 (🎨)
  5. 오늘의 실천 체크 (✅)
  6. XP & 배지 시스템 (🏆)
  7. 시작 준비 완료 (🚀)

- **네비게이션**
  - 이전 버튼 (첫 단계 제외)
  - 다음 버튼
  - 건너뛰기 버튼 (첫 단계만)
  - 시작하기 버튼 (마지막 단계)

- **UI 요소**
  - 진행률 바 (상단)
  - 단계 표시 (X / 7)
  - 큰 이모지 아이콘 (원형 배경)
  - 제목 + 설명
  - 상세 내용 (Card 내 bullet points)
  - 하단 점 인디케이터

**네비게이션 통합**:
- RootNavigator에 모달로 추가
- `presentation: 'modal'` 설정
- goBack()으로 닫기

---

### Navigation 업데이트 ✅

#### MainTabNavigator 변경사항
**파일**: `src/navigation/MainTabNavigator.tsx`

**변경 내용**:
- 기존 4개 탭 → **6개 탭**
  1. 홈 (Home)
  2. 오늘의 실천 (Today)
  3. 만다라트 (Mandalart)
  4. 통계 (Stats)
  5. 리포트 (Reports) - **NEW**
  6. 설정 (Settings) - **NEW**

**아이콘**:
- Reports: `document-text` / `document-text-outline`
- Settings: `settings` / `settings-outline`

#### RootNavigator 변경사항
**파일**: `src/navigation/RootNavigator.tsx`

**변경 내용**:
- Tutorial 화면 모달로 추가
- `presentation: 'modal'` 옵션

**현재 구조**:
```
Auth Stack (로그인 안됨)
  - Login
  - Signup

Main Stack (로그인됨)
  - Main (TabNavigator 6개)
  - MandalartCreate (modal)
  - MandalartDetail
  - Tutorial (modal) - NEW
```

---

## 📊 현재 화면 현황

### 완료된 화면 (총 10개)
**Auth**: Login, Signup (2개)
**Main Tabs**: Home, Today, MandalartList, Stats, Reports, Settings (6개) - **+2**
**Modal**: MandalartCreate, MandalartDetail, Tutorial (3개) - **+1**

### 화면별 상태
| 화면 | 상태 | 기능 완성도 | 비고 |
|------|------|------------|------|
| Login | ✅ | 100% | 인증, 에러 처리 |
| Signup | ✅ | 100% | 회원가입, 유효성 검사 |
| Home | ✅ | 90% | 프로필, 통계, Quick Actions |
| Today | ✅ | 95% | 체크 시스템, 필터, XP |
| MandalartList | ✅ | 100% | CRUD, 활성화 토글 |
| MandalartCreate | ✅ | 100% | OCR, Text, Manual |
| MandalartDetail | ✅ | 100% | 9x9 그리드 |
| Stats | ✅ | 90% | 4주 히트맵 |
| **Reports** | ✅ | 80% | **NEW** - AI 리포트 (Edge Function 연동 필요) |
| **Settings** | ✅ | 70% | **NEW** - 알림 토글 향후 구현 |
| **Tutorial** | ✅ | 100% | **NEW** - 7단계 완성 |

---

## 📈 주요 진행 지표

### Session 2 → Session 3 변화
- **화면 수**: 7개 → 10개 (+3개)
- **Tab 수**: 4개 → 6개 (+2개)
- **Modal 화면**: 2개 → 3개 (+1개)
- **Phase 2 진행률**: 70% → **90%**
- **전체 진행률**: 50-55% → **60-65%**

### 남은 작업 (Phase 2 완료까지)
- ✅ 기존 화면에 새 UI 컴포넌트 적용 (Session 4에서 완료)
  - ✅ Home: XPProgressBar, LevelBadge 추가
  - ✅ Today: Toast 알림 추가
  - ✅ Stats: Card 컴포넌트 적용
  - ✅ Login/Signup: Button, Input 컴포넌트 적용
- [ ] Settings: Notification toggle 실제 구현 (Expo Notifications) → Phase 3로 이동
- [ ] Reports: Edge Function 실제 연동 테스트 → Phase 3로 이동

---

## 🎨 Session 4 완료 항목 (2025-11-16)

### Phase 2 완료: 전 화면 UI 컴포넌트 적용

#### HomeScreen 개선 ✅
**파일**: `src/screens/home/HomeScreen.tsx`

**변경사항**:
- ✅ XPProgressBar 추가: 현재 레벨의 XP 진행률 시각화
  - Spring 애니메이션으로 부드러운 진행률 표시
  - Current XP / Next Level XP 표시
- ✅ LevelBadge 추가: 레벨별 색상 구분 (Beginner→Master)
  - Tier 기반 색상 시스템
  - 대형 사이즈 (lg) 배지
- ✅ Card 컴포넌트 적용: 모든 통계 카드
- ✅ NativeWind 스타일링 전환
- ✅ StyleSheet 제거

#### TodayScreen 개선 ✅
**파일**: `src/screens/home/TodayScreen.tsx`

**변경사항**:
- ✅ Toast 알림 시스템 도입
  - 체크 성공: "success" 타입 Toast (+XP 표시)
  - 레벨업: 특별 메시지 포함
  - 체크 취소: "info" 타입 Toast
  - 에러: "error" 타입 Toast
- ✅ Alert.alert() 완전 제거
- ✅ Card 컴포넌트 적용
- ✅ Button 컴포넌트 적용 (Empty state)
- ✅ NativeWind 스타일링 전환

#### StatsScreen 개선 ✅
**파일**: `src/screens/stats/StatsScreen.tsx`

**변경사항**:
- ✅ 모든 통계 카드에 Card 컴포넌트 적용
  - 총 체크, 스트릭, 레벨, 획득 배지
- ✅ 주간 진행률 섹션 Card화
- ✅ 히트맵 섹션 Card화
- ✅ NativeWind 스타일링 전환
- ✅ 그리드 레이아웃 개선

#### LoginScreen 개선 ✅
**파일**: `src/screens/auth/LoginScreen.tsx`

**변경사항**:
- ✅ Input 컴포넌트 적용
  - 이메일 입력
  - 비밀번호 입력 (secureTextEntry)
- ✅ Button 컴포넌트 적용
  - 로그인 버튼 (primary, loading state)
  - 회원가입 링크 버튼 (ghost)
- ✅ Toast 알림으로 에러 표시
- ✅ NativeWind 스타일링 전환

#### SignupScreen 개선 ✅
**파일**: `src/screens/auth/SignupScreen.tsx`

**변경사항**:
- ✅ Input 컴포넌트 적용
  - 이메일, 비밀번호, 비밀번호 확인
- ✅ Button 컴포넌트 적용
  - 회원가입 버튼 (primary, loading state)
  - 로그인 링크 버튼 (ghost)
- ✅ Toast 알림으로 검증 및 결과 표시
- ✅ 성공 시 자동 로그인 화면 이동 (1.5초 delay)
- ✅ NativeWind 스타일링 전환

---

### 코드 통계

**변경된 파일**: 5개
**삭제된 코드**: 673줄 (StyleSheet 제거)
**추가된 코드**: 276줄 (NativeWind + 컴포넌트)
**순감소**: -397줄 (59% 코드 감소!)

---

### Phase 2 최종 현황

**완료율**: 100% ✅

**달성 항목**:
1. ✅ UI 컴포넌트 라이브러리 구축 (12개)
2. ✅ 게임화 UI 컴포넌트 (5개)
3. ✅ 미구현 화면 추가 (Settings, Reports, Tutorial)
4. ✅ 전 화면 UI 컴포넌트 적용
5. ✅ NativeWind 스타일링 전환
6. ✅ React Native Reanimated 통합

**미완료 (Phase 3로 이동)**:
- Expo Notifications 설정 및 알림 구현
- Edge Function 실제 연동
- 성능 최적화

---

## 📈 주요 진행 지표

### Session 3 → Session 4 변화
- **Phase 2 진행률**: 90% → **100%** ✅
- **전체 진행률**: 60-65% → **70%**
- **코드 품질**: StyleSheet 완전 제거, NativeWind 100% 적용
- **사용자 경험**: Toast 알림 시스템으로 개선
- **컴포넌트 재사용성**: 모든 화면에서 동일한 UI 컴포넌트 사용

### 다음 단계 (Phase 3)
- [ ] Expo Notifications 설정
- [ ] 푸시 알림 구현
- ✅ Edge Function 연동 (리포트 생성) - **완료**
- [ ] 성능 최적화
- [ ] 오프라인 지원

---

## 🔄 Phase 3 진행 항목 (2025-11-16 Session 4)

### AI 리포트 통합 완료 ✅

#### useWeeklyReport 훅 구현 ✅
**파일**: `src/hooks/useWeeklyReport.ts`

**구현 기능**:
- ✅ useGenerateWeeklyReport: Edge Function 호출로 주간 리포트 생성
- ✅ useWeeklyReports: 리포트 히스토리 조회 (최근 10개)
- ✅ useWeeklyReport: 단일 리포트 조회
- ✅ TanStack Query를 사용한 캐싱 및 자동 갱신
- ✅ Optimistic Update 지원

**인터페이스**:
```typescript
interface WeeklyReport {
  id: string;
  user_id: string;
  content: string;        // Markdown 형식
  week_start: string;
  week_end: string;
  created_at: string;
}
```

---

#### useGoalDiagnosis 훅 구현 ✅
**파일**: `src/hooks/useGoalDiagnosis.ts`

**구현 기능**:
- ✅ useGenerateGoalDiagnosis: Edge Function 호출로 목표 진단 생성
- ✅ useGoalDiagnoses: 진단 히스토리 조회
- ✅ useGoalDiagnosis: 특정 만다라트의 진단 조회
- ✅ SMART 점수 시스템 (Specific, Measurable, Achievable, Relevant, Time-bound)
- ✅ AI 생성 개선 제안

**인터페이스**:
```typescript
interface GoalDiagnosis {
  id: string;
  mandalart_id: string;
  user_id: string;
  smart_score: SMARTScore;
  analysis: string;         // Markdown 형식
  suggestions: string[];
  created_at: string;
}
```

---

#### ReportsScreen 업데이트 ✅
**파일**: `src/screens/reports/ReportsScreen.tsx`

**주간 리포트 기능**:
- ✅ Edge Function을 통한 AI 리포트 생성
- ✅ 리포트 히스토리 표시
- ✅ Markdown 렌더링
- ✅ 로딩 상태 및 에러 처리
- ✅ Toast 알림으로 성공/실패 피드백

**목표 진단 기능**:
- ✅ 활성 만다라트 선택 UI
- ✅ SMART 점수 시각화
  - 5가지 기준별 진행 바 (색상 코딩)
  - 총점 표시 (100점 만점)
- ✅ AI 분석 결과 Markdown 렌더링
- ✅ 개선 제안 목록 표시
- ✅ 만다라트가 없을 경우 안내 메시지

**UI 개선**:
- ✅ 만다라트 선택 카드 (선택 시 강조 표시)
- ✅ SMART 점수 진행 바 (점수에 따라 색상 변경)
  - 80점 이상: 녹색
  - 60-79점: 노란색
  - 59점 이하: 빨간색
- ✅ 개선 제안 박스 (노란색 배경)
- ✅ 정보 카드 (SMART 기준 설명)

---

### 코드 통계

**새로 추가된 파일**: 2개
- `src/hooks/useWeeklyReport.ts` (87줄)
- `src/hooks/useGoalDiagnosis.ts` (102줄)

**업데이트된 파일**: 1개
- `src/screens/reports/ReportsScreen.tsx` (+316줄, -43줄 = +273줄 순증가)

**총 코드 증가**: +462줄

---

### Phase 3 진행 현황

**완료**:
- ✅ AI 리포트 통합 (주간 리포트, 목표 진단)
- ✅ Edge Function 연동 (generate-weekly-report, generate-goal-diagnosis)
- ✅ SMART 점수 시스템
- ✅ 리포트 히스토리 관리

**완료**:
- ✅ Expo Notifications 설정
- ✅ 푸시 알림 구현
- ✅ Settings 화면 알림 토글 실제 구현

**미완료**:
- 🔲 성능 최적화
- 🔲 오프라인 지원

---

## 🔔 Session 5 완료 항목 (2025-11-16)

### Phase 3: 푸시 알림 시스템 구현 (100% 완료)

#### Expo Notifications 설정 ✅
**설치된 패키지**:
- ✅ `expo-notifications` (v0.29.14)
- ✅ `expo-device` (v7.0.4)

**설정 내용**:
- ✅ Notification handler 설정
  - shouldShowAlert, shouldPlaySound, shouldSetBadge
  - shouldShowBanner, shouldShowList (iOS 14+)
- ✅ Calendar trigger type 설정 (반복 알림)

---

#### notifications.ts 서비스 구현 ✅
**파일**: `src/services/notifications.ts` (245 lines)

**핵심 기능**:

1. **권한 관리**
   - `requestNotificationPermissions()`: 알림 권한 요청
   - Device.isDevice 체크 (물리 기기만 푸시 알림 가능)
   - 권한 상태 확인 및 요청 플로우

2. **푸시 토큰 관리**
   - `registerForPushNotifications(userId)`: Expo Push Token 발급
   - Supabase `user_push_tokens` 테이블에 저장
   - Platform 정보 포함 (iOS/Android)
   - Token 자동 업데이트 (upsert)

3. **설정 관리 (AsyncStorage)**
   - `getNotificationSettings()`: 설정 불러오기
   - `saveNotificationSettings()`: 설정 저장
   - `updateNotificationSetting()`: 개별 설정 업데이트
   - Default 설정:
     ```typescript
     {
       dailyReminder: true,
       badgeNotifications: true,
       reportNotifications: true,
       reminderTime: '21:00'  // 오후 9시
     }
     ```

4. **Daily Reminder 스케줄링**
   - `scheduleDailyReminder(time)`: 일일 알림 예약
   - Calendar Trigger 사용 (반복 알림)
   - HH:mm 형식 시간 파싱
   - 기존 알림 자동 취소 후 재등록
   - 알림 내용:
     - 제목: "🎯 오늘의 실천 체크!"
     - 내용: "오늘 목표를 달성하셨나요? 지금 확인해보세요!"

5. **알림 취소**
   - `cancelDailyReminder()`: 일일 알림 취소
   - `cancelAllNotifications()`: 모든 알림 취소

6. **Local Notification**
   - `sendLocalNotification(title, body, data)`: 즉시 알림 전송
   - 커스텀 데이터 전달 가능

7. **Event Listeners**
   - `addNotificationReceivedListener()`: 포그라운드 알림 수신
   - `addNotificationResponseReceivedListener()`: 알림 탭 이벤트

---

#### SettingsScreen 업데이트 ✅
**파일**: `src/screens/settings/SettingsScreen.tsx`

**변경사항**:
- ✅ Switch 컴포넌트 추가 (React Native)
- ✅ 알림 설정 state 관리
- ✅ useEffect로 설정 자동 로드
- ✅ 3개 토글 실제 구현:
  1. **일일 리마인더**
     - 활성화 시 권한 요청 → 푸시 토큰 등록 → 일일 알림 스케줄링
     - 비활성화 시 알림 취소
     - 설정된 시간 표시 (예: "매일 21:00에 알림 받기")
  2. **배지 알림**
     - 활성화 시 권한 요청 → 푸시 토큰 등록
     - 배지 획득 시 알림 (향후 구현 예정)
  3. **리포트 알림**
     - 활성화 시 권한 요청 → 푸시 토큰 등록
     - 주간 리포트 생성 시 알림 (향후 구현 예정)

**Toggle Handler 로직**:
```typescript
const handleToggleDailyReminder = async (value: boolean) => {
  try {
    // 켤 때만 권한 요청
    if (value && user) {
      const token = await registerForPushNotifications(user.id);
      if (!token) {
        showToast('error', '알림 권한을 허용해주세요.');
        return;
      }
    }

    // AsyncStorage에 설정 저장 (자동으로 스케줄링)
    await updateNotificationSetting('dailyReminder', value);
    setNotificationSettings(prev => ({ ...prev, dailyReminder: value }));

    // 피드백
    if (value) {
      showToast('success', `매일 ${notificationSettings.reminderTime}에 알림을 받습니다.`);
    } else {
      showToast('info', '일일 리마인더가 꺼졌습니다.');
    }
  } catch (error) {
    showToast('error', '설정 변경 중 오류가 발생했습니다.');
  }
};
```

**UI 개선**:
- ✅ Switch 색상:
  - Track color: false=#d1d5db (gray-300), true=#3b82f6 (blue-600)
  - Thumb color: false=#f3f4f6 (gray-100), true=#ffffff (white)
- ✅ Loading state (isLoadingSettings)
- ✅ Toast 피드백 (success/error/info)

---

### Supabase Database 요구사항

**테이블**: `user_push_tokens`

```sql
CREATE TABLE user_push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  push_token TEXT NOT NULL,
  platform TEXT NOT NULL,  -- 'ios' or 'android'
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, platform)  -- 사용자당 플랫폼별 1개 토큰
);

-- Index for fast lookup
CREATE INDEX idx_user_push_tokens_user_id ON user_push_tokens(user_id);
```

**Note**: 이 테이블은 아직 생성되지 않았을 수 있습니다. 첫 알림 테스트 시 Supabase 콘솔에서 생성 필요.

---

### TypeScript 타입 안전성 ✅
- ✅ NotificationSettings 인터페이스 정의
- ✅ NotificationBehavior 타입 (shouldShowBanner, shouldShowList 포함)
- ✅ CalendarTriggerInput 타입 (type 필드 필수)
- ✅ 모든 함수에 타입 명시

---

### 코드 통계

**새로 추가된 파일**: 1개
- `src/services/notifications.ts` (245줄)

**업데이트된 파일**: 3개
- `src/screens/settings/SettingsScreen.tsx` (+139줄, -42줄 = +97줄 순증가)
- `package.json` (expo-notifications, expo-device 추가)
- `package-lock.json` (의존성 해결)

**총 코드 증가**: +342줄

---

### 테스트 필요 사항

**기능 테스트**:
1. ✅ TypeScript 타입 체크 통과
2. ⚠️ 물리 기기에서 권한 요청 플로우 테스트 필요
3. ⚠️ 일일 알림 스케줄링 테스트 필요
4. ⚠️ Supabase user_push_tokens 테이블 생성 필요
5. ⚠️ 실제 푸시 알림 전송 테스트 필요

**주의사항**:
- Expo Go 앱에서는 푸시 알림이 제한적으로 작동
- Production 테스트를 위해 EAS Build 필요
- iOS: Apple Developer 계정 필요 (APNs 설정)
- Android: Firebase 설정 필요 (FCM)

---

### Phase 3 최종 현황

**완료율**: 75% ✅

**달성 항목**:
1. ✅ AI 리포트 통합 (주간 리포트, 목표 진단)
2. ✅ Edge Function 연동
3. ✅ SMART 점수 시스템
4. ✅ 푸시 알림 시스템 구축
5. ✅ Settings 화면 실제 알림 토글 구현
6. ✅ AsyncStorage 기반 설정 관리
7. ✅ 권한 요청 플로우

**미완료 (Phase 3 남은 25%)**:
- [ ] 성능 최적화 (FlatList 가상화, 이미지 최적화)
- [ ] 오프라인 지원 (AsyncStorage persistence)
- [ ] 실제 배지 알림 전송 (배지 획득 시)
- [ ] 실제 리포트 알림 전송 (주간 리포트 생성 시)

---

## 📈 주요 진행 지표

### Session 4 → Session 5 변화
- **Phase 3 진행률**: 50% → **75%**
- **전체 진행률**: 75% → **80%**
- **알림 시스템**: 0% → 100%
- **Settings 화면**: 70% → **90%** (알림 토글 실제 구현)

### 다음 단계 (Phase 3 완료)
- [ ] 성능 최적화
- [ ] 오프라인 지원
- [ ] 배지/리포트 알림 자동 전송

---

