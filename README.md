# MandaAct Mobile - React Native App

React Native migration of MandaAct PWA using Expo SDK 52+.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hevi35-coder/mandaact-mobile.git
cd mandaact-mobile
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your Supabase credentials
```

4. Start the development server:
```bash
npm start
# or
expo start
```

### Running on Devices

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan QR code with Expo Go app

## 📁 Project Structure

```
mandaact-mobile/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── lib/           # Utility functions and logic
│   ├── store/         # Zustand state management
│   ├── types/         # TypeScript type definitions
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services (Supabase)
│   └── constants/     # App constants
├── assets/            # Images, fonts, etc.
├── App.tsx           # Entry point
└── app.json          # Expo configuration
```

## 🛠️ Tech Stack

- **Framework**: React Native + Expo SDK 52+
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Zustand + TanStack Query
- **UI/Styling**: NativeWind (Tailwind for RN)
- **Animation**: React Native Reanimated 3
- **Backend**: Supabase
- **Push Notifications**: Expo Push Notifications

## 📝 Available Scripts

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

## 🔄 Migration from PWA

This is a React Native migration of the MandaAct PWA. Key features being migrated:

- ✅ Mandalart creation (Image OCR, Text parsing, Manual input)
- ✅ Action type system (Routine/Mission/Reference)
- ✅ Daily check system
- ✅ Gamification (XP/Level, Badges, Streaks)
- ✅ AI Reports (Weekly report, Goal diagnosis)
- ✅ Statistics and analytics

## 📚 Documentation

- [Migration Roadmap](https://github.com/hevi35-coder/mandaact/blob/main/docs/migration/REACT_NATIVE_MIGRATION_ROADMAP.md)
- [Technical Decisions](https://github.com/hevi35-coder/mandaact/blob/main/docs/migration/TECHNICAL_DECISIONS.md)
- [Implementation Timeline](https://github.com/hevi35-coder/mandaact/blob/main/docs/migration/IMPLEMENTATION_TIMELINE.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🔗 Related Projects

- [MandaAct PWA](https://github.com/hevi35-coder/mandaact) - Original web application

---

**Current Status**: Initial setup and configuration phase (Phase 0)