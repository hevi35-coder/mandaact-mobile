# iOS Simulator 환경 설정 가이드

React Native Expo 프로젝트를 iOS Simulator에서 실행하기 위한 설정 가이드입니다.

## 목차
1. [필수 요구사항](#필수-요구사항)
2. [Xcode 설치](#xcode-설치)
3. [개발 환경 설정](#개발-환경-설정)
4. [문제 해결](#문제-해결)
5. [유용한 팁](#유용한-팁)

---

## 필수 요구사항

### 시스템 요구사항
- macOS (iOS Simulator는 Mac에서만 사용 가능)
- 최소 15GB 여유 공간 (Xcode 설치용)
- 안정적인 인터넷 연결

### 소프트웨어
- Node.js (설치 확인: `node --version`)
- npm 또는 yarn
- Expo CLI

---

## Xcode 설치

### 1. App Store에서 Xcode 다운로드

```bash
# 터미널에서 App Store의 Xcode 페이지 열기
open "macappstore://itunes.apple.com/app/id497799835"
```

또는 App Store 앱에서 직접 "Xcode"를 검색하여 설치합니다.

**참고:** Xcode는 약 8-15GB 크기로, 다운로드 및 설치에 20-60분 소요될 수 있습니다.

### 2. Xcode 초기 설정

설치 완료 후:

1. **Xcode 실행**
   - Applications 폴더에서 Xcode.app 실행

2. **라이선스 동의**
   - 처음 실행 시 나타나는 라이선스 약관에 동의

3. **추가 구성요소 설치**
   - Xcode가 요청하는 추가 구성요소 설치 진행

### 3. Command Line Tools 설정

터미널에서 다음 명령어 실행:

```bash
# Xcode 개발자 도구 경로 설정
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

# 설정 확인
xcode-select -p
```

**출력 예상 결과:**
```
/Applications/Xcode.app/Contents/Developer
```

---

## 개발 환경 설정

### 프로젝트 의존성 설치

```bash
cd /path/to/mandaact-mobile
npm install
```

### Babel 설정 확인

`babel.config.js` 파일이 다음과 같이 설정되어 있는지 확인:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/lib': './src/lib',
            '@/store': './src/store',
            '@/types': './src/types',
            '@/hooks': './src/hooks',
            '@/services': './src/services',
            '@/constants': './src/constants',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

---

## iOS Simulator 실행

### 방법 1: Expo CLI로 자동 실행

```bash
npx expo start --ios
```

이 명령어는 자동으로:
- Metro bundler 시작
- iOS Simulator 실행
- 앱 빌드 및 설치

### 방법 2: 수동 실행

```bash
# 1. Metro bundler 시작
npx expo start

# 2. 터미널에서 'i' 키 입력하여 iOS simulator 실행
```

### 캐시 클리어 후 실행

문제가 발생할 경우:

```bash
npx expo start --clear --ios
```

---

## 문제 해결

### 1. "xcrun simctl help exited with non-zero code: 72" 오류

**원인:** Xcode Command Line Tools가 올바르게 설정되지 않음

**해결방법:**
```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
xcode-select --install  # 필요시 재설치
```

### 2. Babel 설정 오류 (".plugins is not a valid Plugin property")

**원인:** Metro bundler 캐시 문제

**해결방법:**
```bash
# 모든 캐시 삭제
rm -rf .expo node_modules/.cache
watchman watch-del-all  # watchman이 설치된 경우

# Metro 임시 파일 삭제
rm -rf $TMPDIR/metro-*

# 서버 재시작
npx expo start --clear --ios
```

### 3. 의존성 관련 오류

**해결방법:**
```bash
# node_modules 완전 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 클리어 후 재시작
npx expo start --clear --ios
```

### 4. Simulator 느림 또는 멈춤

**해결방법:**
```bash
# Simulator 완전 종료
killall Simulator

# 또는 Simulator 앱 → Device → Erase All Content and Settings
```

---

## 유용한 팁

### 개발 단축키 (Simulator에서)

- **⌘R** - 앱 리로드
- **⌘D** - 개발자 메뉴 열기
- **⌘M** - 성능 모니터 토글

### Metro Bundler 단축키 (터미널에서)

- **r** - 앱 리로드
- **shift + r** - 캐시 클리어 후 리로드
- **d** - 개발자 메뉴 열기
- **i** - iOS simulator 실행
- **j** - Chrome DevTools 열기

### Simulator 설정 최적화

1. **디바이스 선택**
   - Simulator → File → Open Simulator → iPhone 15 Pro (권장)

2. **성능 향상**
   - Simulator → I/O → Keyboard → Connect Hardware Keyboard (체크)
   - Debug → Graphics Quality Override → Low Quality (개발 시)

### 빠른 테스트 워크플로우

```bash
# 개발 중 빠른 리로드
# 터미널에서 'r' 입력 또는 Simulator에서 ⌘R

# 문제 발생 시
# 터미널에서 'shift + r' 입력 (캐시 클리어 후 리로드)
```

---

## 실제 디바이스 vs Simulator

### Simulator 장점
- ✅ 빠른 반복 개발
- ✅ 네트워크 연결 불필요
- ✅ 다양한 디바이스 테스트 용이
- ✅ 스크린샷/녹화 간편

### Simulator 제한사항
- ❌ 카메라, Face ID, 일부 센서 미지원
- ❌ 실제 성능과 차이 있음
- ❌ 푸시 알림 제한적

### 권장 워크플로우
1. **개발/디버깅**: iOS Simulator 사용
2. **최종 테스트**: 실제 디바이스 사용

---

## 추가 리소스

- [Expo iOS Simulator 공식 문서](https://docs.expo.dev/workflow/ios-simulator/)
- [Xcode 공식 문서](https://developer.apple.com/xcode/)
- [React Native 환경 설정](https://reactnative.dev/docs/environment-setup)

---

## 변경 이력

- **2025-11-16**: 초기 문서 작성
  - Xcode 설치 가이드
  - iOS Simulator 실행 방법
  - 주요 문제 해결 방법 추가
