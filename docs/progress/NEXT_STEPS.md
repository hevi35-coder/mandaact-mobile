# MandaAct Mobile - 다음 작업 단계

**작성일**: 2025-11-16
**현재 Phase**: Phase 2 (UI/UX Migration)
**목표 완료일**: 2025-11-30

---

## 🎯 즉시 착수 작업

### 1. Git 정리 (5분)

**작업**:
```bash
cd /Users/jhsy/mandaact-mobile
git add .
git commit -m "chore: Update babel config and dependencies"
git push origin main
```

**이유**: 9개 로컬 커밋 푸시 필요

---

## 📋 Phase 2: UI/UX Migration (Week 4-6)

### Week 4: UI 컴포넌트 라이브러리 구축

#### 2.1 기본 컴포넌트 (2-3일)

**디렉토리 생성**:
```bash
mkdir -p src/components/ui
mkdir -p src/components/feedback
mkdir -p src/components/layout
```

**구현 순서**:

**Day 1: Form 컴포넌트**
- [ ] `src/components/ui/Button.tsx`
  ```typescript
  // Props: variant (primary|secondary|ghost), size, onPress, disabled, loading
  // NativeWind 스타일링
  ```
- [ ] `src/components/ui/Input.tsx`
  ```typescript
  // Props: value, onChangeText, placeholder, error, disabled
  // 유효성 검사 표시
  ```
- [ ] `src/components/ui/Checkbox.tsx`
  ```typescript
  // Props: checked, onPress, label
  ```

**Day 2: Layout 컴포넌트**
- [ ] `src/components/ui/Card.tsx`
  ```typescript
  // Props: children, padding, shadow
  ```
- [ ] `src/components/layout/Container.tsx`
  ```typescript
  // Props: children, padding, centered
  ```
- [ ] `src/components/layout/Spacer.tsx`
  ```typescript
  // Props: height, width
  ```

**Day 3: Feedback 컴포넌트**
- [ ] `src/components/feedback/Toast.tsx`
  ```typescript
  // 전역 toast 시스템
  // react-native-toast-message 사용 고려
  ```
- [ ] `src/components/feedback/Alert.tsx`
  ```typescript
  // Modal 기반 Alert
  ```
- [ ] `src/components/feedback/LoadingSpinner.tsx`
  ```typescript
  // ActivityIndicator wrapper
  ```

**테스트 방법**:
- 각 컴포넌트를 HomeScreen에서 테스트
- Storybook 고려 (선택사항)

---

#### 2.2 게임화 UI 컴포넌트 (2일)

**Day 4: XP/Level 컴포넌트**
- [ ] `src/components/gamification/XPProgressBar.tsx`
  ```typescript
  // Props: currentXP, nextLevelXP
  // 진행률 바 + 레벨 표시
  ```
- [ ] `src/components/gamification/LevelBadge.tsx`
  ```typescript
  // Props: level
  // 현재 레벨 배지 (원형)
  ```

**Day 5: 배지 시스템 컴포넌트**
- [ ] `src/components/gamification/BadgeCard.tsx`
  ```typescript
  // Props: badge, unlocked, progress
  // 단일 배지 카드 (잠금/해제 상태)
  ```
- [ ] `src/components/gamification/BadgeGallery.tsx`
  ```typescript
  // Props: badges
  // 배지 그리드 레이아웃
  ```
- [ ] `src/components/gamification/BadgeUnlockModal.tsx`
  ```typescript
  // Props: badge, visible, onClose
  // 배지 해제 축하 모달
  ```

---

### Week 5: 미구현 화면 (3일)

#### 2.3 Settings 화면 (1일)

**파일**: `src/screens/settings/SettingsScreen.tsx`

**구현 항목**:
- [ ] 알림 설정 섹션
  - 일일 리마인더 on/off
  - 알림 시간 선택
  - 배지/리포트 알림 on/off
- [ ] 계정 관리 섹션
  - 사용자 정보 표시
  - 비밀번호 변경 (모달)
  - 로그아웃
- [ ] 앱 정보 섹션
  - 버전 표시
  - 오픈소스 라이선스
  - 개인정보처리방침

**네비게이션 추가**:
```typescript
// src/navigation/MainTabNavigator.tsx
<Tab.Screen name="Settings" component={SettingsScreen} />
```

---

#### 2.4 Reports 화면 (1일)

**파일**: `src/screens/reports/ReportsScreen.tsx`

**구현 항목**:
- [ ] 탭 네비게이션 (주간 리포트 / 목표 진단)
- [ ] 주간 리포트 섹션
  - 리포트 생성 버튼
  - 로딩 상태
  - 마크다운 렌더링 (react-native-markdown-display)
  - 리포트 히스토리 목록
- [ ] 목표 진단 섹션
  - 만다라트 선택
  - 진단 생성 버튼
  - 결과 표시 (SMART 점수)

**필요 라이브러리**:
```bash
npm install react-native-markdown-display
```

**API 통합**:
- Edge Function 호출: `generate-weekly-report`, `generate-goal-diagnosis`
- 결과 캐싱 (TanStack Query)

---

#### 2.5 Tutorial 화면 (1일)

**파일**: `src/screens/tutorial/TutorialScreen.tsx`

**구현 항목**:
- [ ] 7단계 스텝 네비게이션
  1. 환영 메시지
  2. 만다라트 소개
  3. 만다라트 생성 방법
  4. 액션 타입 설명
  5. 체크 방법
  6. XP/배지 설명
  7. 시작하기
- [ ] 진행률 표시 (1/7, 2/7, ...)
- [ ] 이전/다음 버튼
- [ ] 샘플 데이터 생성 (선택사항)
- [ ] 완료 후 AsyncStorage에 저장 (다시 보지 않기)

**네비게이션**:
- 최초 로그인 시 자동 표시
- Settings에서 재진입 가능

---

### Week 6: 애니메이션 & UX 개선 (3일)

#### 2.6 React Native Reanimated 설치 (0.5일)

**설치**:
```bash
npm install react-native-reanimated
```

**설정**:
```javascript
// babel.config.js
plugins: [
  'react-native-reanimated/plugin',
],
```

**기본 테스트**:
- 간단한 fade-in 애니메이션 테스트

---

#### 2.7 핵심 애니메이션 구현 (2일)

**Day 1: 체크 애니메이션**
- [ ] 체크 시 Scale + Opacity 애니메이션
  ```typescript
  // TodayScreen - onCheck
  const scale = useSharedValue(1)
  const onCheck = () => {
    scale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    )
  }
  ```
- [ ] XP 획득 표시 (+10 XP 애니메이션)
  - Slide up + Fade out

**Day 2: 배지/레벨업 애니메이션**
- [ ] 배지 해제 모달 애니메이션
  - Scale in + Rotate
  - Confetti 효과 (선택사항 - react-native-confetti-cannon)
- [ ] XP 바 증가 애니메이션
  - 부드러운 width 증가 (withTiming)
- [ ] 레벨업 알림
  - 화면 전체 축하 효과

---

#### 2.8 UX 개선 (0.5일)

**로딩 상태**:
- [ ] 화면 로딩 시 Skeleton UI
- [ ] 버튼 로딩 시 Spinner
- [ ] Pull-to-refresh (FlatList)

**에러 처리**:
- [ ] 네트워크 에러 시 재시도 버튼
- [ ] Empty state (데이터 없을 때)
  - 친근한 일러스트 + 메시지

**접근성**:
- [ ] 터치 타겟 크기 확인 (최소 44x44)
- [ ] 색상 대비 검토

---

## 📋 Phase 3: 기능 마이그레이션 (Week 7-10)

### Week 7: 푸시 알림 (2일)

#### 3.1 Expo Notifications 설정 (1일)

**설치**:
```bash
npm install expo-notifications
```

**파일**: `src/services/notifications.ts`

**구현**:
- [ ] 권한 요청 함수
- [ ] Push token 등록 (Supabase에 저장)
- [ ] 알림 수신 핸들러
- [ ] 알림 클릭 핸들러

**통합**:
- [ ] Settings 화면에서 권한 요청
- [ ] 알림 시간 설정 (AsyncStorage)

---

#### 3.2 알림 스케줄링 (1일)

**Supabase Edge Function** (백엔드):
- [ ] `schedule-daily-reminders` 함수 작성
  - Cron: 매일 저녁 9시 (KST)
  - 모든 활성 사용자에게 푸시

**알림 타입**:
- [ ] 일일 리마인더 (오늘의 실천)
- [ ] 배지 해제 알림
- [ ] 주간 리포트 준비 완료
- [ ] 스트릭 위험 알림 (2일 미체크 시)

---

### Week 8-9: AI 리포트 통합 (3일)

#### 3.3 주간 리포트 생성 (1.5일)

**파일**: `src/hooks/useWeeklyReport.ts`

**구현**:
```typescript
const useWeeklyReport = () => {
  const generateReport = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke(
        'generate-weekly-report',
        { body: { user_id: userId } }
      )
      return data
    }
  })

  return { generateReport }
}
```

**통합**:
- [ ] ReportsScreen에서 생성 버튼
- [ ] 로딩 상태 표시
- [ ] 마크다운 렌더링
- [ ] 히스토리 저장 (Supabase)

---

#### 3.4 목표 진단 (1.5일)

**파일**: `src/hooks/useGoalDiagnosis.ts`

**구현**:
```typescript
const useGoalDiagnosis = () => {
  const diagnose = useMutation({
    mutationFn: async (mandalartId: string) => {
      const { data, error } = await supabase.functions.invoke(
        'generate-goal-diagnosis',
        { body: { mandalart_id: mandalartId } }
      )
      return data
    }
  })

  return { diagnose }
}
```

**통합**:
- [ ] ReportsScreen에서 만다라트 선택
- [ ] 진단 생성
- [ ] SMART 점수 시각화
- [ ] 개선 제안 표시

---

### Week 10: 성능 최적화 (2일)

#### 3.5 메모리 & 렌더링 최적화 (1일)

**최적화 대상**:
- [ ] MandalartDetailScreen (9x9 grid)
  - React.memo 적용
  - useMemo로 grid 계산 캐싱
- [ ] TodayScreen (긴 목록)
  - FlatList 가상화
  - getItemLayout 구현
- [ ] HomeScreen
  - 불필요한 re-render 방지

**도구**:
- React DevTools Profiler
- Flipper (메모리 모니터링)

---

#### 3.6 이미지 최적화 (1일)

**구현**:
- [ ] expo-image-manipulator 설치
  ```bash
  npm install expo-image-manipulator
  ```
- [ ] 업로드 전 이미지 리사이즈
  ```typescript
  const resized = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 1024 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  )
  ```
- [ ] 썸네일 생성 (만다라트 목록)

---

## 📋 Phase 4: 테스팅 & 플랫폼 설정 (Week 11-12)

### Week 11: 테스팅 (3일)

#### 4.1 Unit Tests (1일)

**설치**:
```bash
npm install -D jest @testing-library/react-native
```

**테스트 대상**:
- [ ] `src/lib/actionTypes.ts`
- [ ] `src/lib/xpMultipliers.ts`
- [ ] `src/lib/stats.ts`
- [ ] `src/lib/timezone.ts`

**목표**: 80% 커버리지

---

#### 4.2 Component Tests (1일)

**테스트 대상**:
- [ ] UI 컴포넌트 (Button, Input, Card)
- [ ] 간단한 화면 (LoginScreen)

**목표**: 주요 컴포넌트 60% 커버리지

---

#### 4.3 Integration Tests (1일)

**테스트 시나리오**:
- [ ] 로그인 → 만다라트 조회 → 체크
- [ ] 만다라트 생성 → 저장 → 조회
- [ ] XP 획득 → 레벨 계산

**Mock**: MSW (Mock Service Worker) for Supabase

---

### Week 12: 플랫폼 설정 (2일)

#### 4.4 iOS 설정 (1일)

**app.json 업데이트**:
```json
{
  "ios": {
    "bundleIdentifier": "com.mandaact.mobile",
    "buildNumber": "1",
    "infoPlist": {
      "NSCameraUsageDescription": "만다라트 이미지를 촬영하기 위해 카메라 접근이 필요합니다",
      "NSPhotoLibraryUsageDescription": "갤러리에서 만다라트 이미지를 선택하기 위해 접근이 필요합니다"
    },
    "supportsTablet": false
  }
}
```

**아이콘 & 스플래시**:
- [ ] App icon (1024x1024)
- [ ] Splash screen

---

#### 4.5 Android 설정 (1일)

**app.json 업데이트**:
```json
{
  "android": {
    "package": "com.mandaact.mobile",
    "versionCode": 1,
    "permissions": [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "NOTIFICATIONS"
    ],
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#000000"
    }
  }
}
```

**Signing**:
- [ ] Keystore 생성
- [ ] EAS credentials 설정

---

## 📋 Phase 5: 배포 (Week 13-14)

### Week 13: EAS Build & Beta (3일)

#### 5.1 EAS Build 설정 (1일)

**설치**:
```bash
npm install -g eas-cli
eas init
eas build:configure
```

**eas.json**:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

**첫 빌드**:
```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

---

#### 5.2 Beta 테스팅 (2일)

**TestFlight (iOS)**:
- [ ] App Store Connect 설정
- [ ] TestFlight 빌드 업로드
- [ ] 베타 테스터 초대 (10-20명)

**Google Play Console (Android)**:
- [ ] Internal testing track 설정
- [ ] APK 업로드
- [ ] 베타 테스터 초대

**피드백 수집**:
- [ ] 크래시 리포트
- [ ] UX 피드백
- [ ] 버그 리포트

---

### Week 14: 스토어 배포 (2일)

#### 5.3 스토어 준비 (1일)

**스크린샷**:
- [ ] iPhone (6.5", 5.5")
- [ ] Android (Phone, Tablet)

**설명 작성**:
- [ ] 한글 설명 (500자)
- [ ] 영문 설명 (선택)
- [ ] 키워드

**개인정보처리방침**:
- [ ] 웹사이트 호스팅
- [ ] URL 등록

---

#### 5.4 스토어 제출 (1일)

**App Store**:
```bash
eas submit --platform ios --latest
```

**Google Play**:
```bash
eas submit --platform android --latest
```

**검토 대기**:
- iOS: 1-3일
- Android: 1일

---

## 📊 작업 추적

### 체크리스트 요약

**Week 4**:
- [ ] UI 컴포넌트 라이브러리 (7개)
- [ ] 게임화 UI 컴포넌트 (5개)

**Week 5**:
- [ ] Settings 화면
- [ ] Reports 화면
- [ ] Tutorial 화면

**Week 6**:
- [ ] Reanimated 설치
- [ ] 애니메이션 구현 (5개)
- [ ] UX 개선

**Week 7**:
- [ ] Expo Notifications 설정
- [ ] 알림 스케줄링

**Week 8-9**:
- [ ] 주간 리포트 통합
- [ ] 목표 진단 통합

**Week 10**:
- [ ] 성능 최적화
- [ ] 이미지 최적화

**Week 11**:
- [ ] Unit tests
- [ ] Component tests
- [ ] Integration tests

**Week 12**:
- [ ] iOS 설정
- [ ] Android 설정

**Week 13**:
- [ ] EAS Build
- [ ] Beta testing

**Week 14**:
- [ ] 스토어 준비
- [ ] 제출

---

## 🎯 성공 기준

**Phase 2 완료 기준**:
- ✅ 모든 화면 구현 완료
- ✅ UI 컴포넌트 라이브러리 완성
- ✅ 애니메이션 부드럽게 작동
- ✅ TypeScript 0 errors

**Phase 3 완료 기준**:
- ✅ 푸시 알림 작동
- ✅ AI 리포트 생성 가능
- ✅ 성능 목표 달성 (Cold start < 2s)

**Phase 4 완료 기준**:
- ✅ Test coverage > 70%
- ✅ 플랫폼 설정 완료
- ✅ 베타 빌드 생성 성공

**Phase 5 완료 기준**:
- ✅ 스토어 승인
- ✅ 앱 출시
- ✅ 크래시율 < 0.5%

---

## 📝 일일 진행사항 기록

**세션 시작 시 체크**:
1. 이 문서 (`NEXT_STEPS.md`) 읽기
2. `CURRENT_STATUS.md`에서 현재 상태 확인
3. 오늘 작업할 항목 선택
4. TodoWrite 도구로 작업 추적

**세션 종료 시**:
1. 완료 항목 체크
2. Git commit + push
3. `IMPLEMENTATION_LOG.md`에 진행사항 기록
4. `CURRENT_STATUS.md` 업데이트

---

**문서 버전**: 1.0
**다음 리뷰**: Week 4 완료 시 (2025-11-23 예상)
**담당**: Development Team
