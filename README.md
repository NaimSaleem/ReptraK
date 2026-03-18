# ReptraK

ReptraK is an Expo + React Native habit tracker with native iOS and Android projects in this root workspace.

## Requirements

- Node.js 20.19.4 or newer
- Xcode for iOS builds
- Android Studio for Android builds

## Quick Start

```bash
npm install
npm run start
```

## Native Commands

```bash
# iOS native run
npm run ios

# Android native run
npm run android

# Clear Metro cache
npm run reset
```

## Project Layout

```text
.
├── src/
│   ├── App.jsx
│   ├── lib/reptrak.js
│   ├── screens/
│   └── components/
├── index.js
├── app.json
├── ios/
└── android/
```

## Notes

- User data persistence is centralized in `src/App.jsx` through one update flow backed by `AsyncStorage`.
- Domain logic and derived metrics live in `src/lib/reptrak.js`.
