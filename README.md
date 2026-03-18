# ReptraK Mobile - React Native App

A native iOS and Android habit tracking app built with React Native and Expo.

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

### Running the App

#### Using Expo Go (Fastest way to test):
```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go app on your physical device

#### Building for iOS:
```bash
npm run ios
```

This opens the iOS simulator with your app.

#### Building for Android:
```bash
npm run android
```

This opens the Android emulator with your app.

#### Web version:
```bash
npm run web
```

## Project Structure

```
mobile/
├── src/
│   ├── App.jsx                 # Main app with navigation
│   ├── screens/                # Screen components
│   │   ├── OnboardingScreen.js # Onboarding flow
│   │   ├── DashboardScreen.js  # Home/dashboard
│   │   ├── CalendarScreen.js   # Calendar view
│   │   ├── ProfileScreen.js    # Profile & stats
│   │   └── PremiumScreen.js    # Premium features
│   ├── components/             # Reusable components
│   │   ├── ActivityRow.js      # Activity input
│   │   ├── GlassButton.js      # Glass-style buttons
│   │   └── ZoneCard.js         # Zone badges
│   └── lib/
│       └── reptrak.js          # Business logic
├── index.js                    # App entry point
├── app.json                    # Expo config
└── package.json               # Dependencies
```

## Features

### Core Features (Free)
- 📱 Daily habit tracking
- 📅 Weekly and monthly calendar views
- 🔥 Streak tracking
- 📊 Progress visualization with color zones

### Premium Features
- 📈 Weekly compare-and-contrast analysis
- 📉 Advanced analytics and insights
- 🎯 Unlimited custom habits
- 💾 Cloud sync (future)

## Development Notes

### State Management
The app uses React `useState` and `useCallback` with `AsyncStorage` for persistence. The `reptrak.js` library handles all business logic and calculations.

### Styling
All components use React Native `StyleSheet` for styling. No CSS or CSS-in-JS - pure React Native styles.

### Animations
Currently, the app uses basic React Native animations. For more complex animations (like the liquid fill effect), consider upgrading to `react-native-reanimated` or `react-native-skia`.

### Navigation
The app uses React Navigation with bottom tab navigator for the main screens.

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

You'll need to set up an EAS account at https://eas.expo.dev

## Troubleshooting

### Metro bundler issues:
```bash
npm start -- --reset-cache
```

### Module not found errors:
```bash
rm -rf node_modules
npm install
```

### Clearing Expo cache:
```bash
expo start -c
```

## Next Steps

1. Add icons/splash screens in `assets/`
2. Implement production analytics
3. Set up Stripe/RevenueCat for premium payments
4. Add cloud sync for user data
5. Optimize animations with Reanimated
6. Add notifications for daily reminders

## Support

For React Native documentation, see: https://reactnative.dev
For Expo documentation, see: https://docs.expo.dev
