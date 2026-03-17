# Getting Started with ReptraK

ReptraK is now available as both a **web app** (React + Vite) and **native mobile app** (React Native + Expo). This guide will help you get set up with either or both versions.

## System Requirements

### Common Requirements
- Node.js >= 18 (check with `node --version`)
- npm >= 9 (check with `npm --version`)

### For Web App Only
- Mac, Windows, or Linux
- Modern web browser

### For Mobile App
- Mac with Xcode (for iOS)
- Windows/Mac/Linux with Android Studio (for Android)
- OR: Just iOS simulator via Expo

## Quick Start

### Web App (5 minutes)

```bash
# From root directory
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Mobile App - iOS (10 minutes)

```bash
# Install Expo CLI globally (one time)
npm install -g expo-cli

# From mobile directory
cd mobile
npm install
npm start

# When prompted, press 'i' for iOS simulator
```

The app opens in iOS simulator automatically.

### Mobile App - Android (10 minutes)

```bash
# From mobile directory
cd mobile
npm install
npm start

# When prompted, press 'a' for Android emulator
```

### Mobile App - Physical Device

Install the **Expo Go** app on your iPhone or Android device:

```bash
# Start server
cd mobile && npm start

# Scan the QR code with your phone's camera
# App opens in Expo Go
```

## Development Workflow

### Web App Development

```bash
npm run dev          # Start dev server (hot reload)
npm run lint         # Check code
npm run build        # Production build
npm run preview      # Test production build
```

### Mobile App Development

```bash
cd mobile
npm start            # Start Metro bundler
# Press:
#   'i' = iOS simulator
#   'a' = Android emulator
#   'w' = Web version
#   'c' = Clear cache
#   'r' = Reload
```

Edit any file and save - changes hot reload in seconds!

## Project Architecture

### Shared Code

Both web and mobile versions share:

- **Business Logic**: `src/lib/reptrak.js` (web) and `mobile/src/lib/reptrak.js` (mobile)
- **Data Model**: User state, activities, streaks, calendar data
- **Calculations**: Zone math, completion percentages, progress tracking

### Web-Specific

- `src/App.jsx` - Main React component
- `src/main.jsx` - Vite entry point
- `styles/*.scss` - Styled with SASS
- `index.html` - HTML shell
- DOM interactions and GSAP animations

### Mobile-Specific

- `mobile/src/App.jsx` - Navigation setup
- `mobile/src/screens/` - Screen components
- `mobile/src/components/` - Reusable UI components
- Native `StyleSheet` instead of CSS
- Bottom tab navigator (React Navigation)
- AsyncStorage instead of localStorage

## Feature Parity

### Free Features (Both Platforms)
✅ Daily habit tracking
✅ Multiple activities per day
✅ Week/month calendar views
✅ Streak tracking
✅ Color-coded progress zones
✅ Data persistence (localStorage/AsyncStorage)

### Premium Features
⏳ Weekly analytics
⏳ Advanced insights
⏳ Stripe integration
⏳ Multi-device sync

## Troubleshooting

### Web App Issues

**Port 5173 already in use?**
```bash
npm run dev -- --port 3000
```

**Module not found?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Mobile App Issues

**Simulator won't start?**
```bash
npm start -- --reset-cache
```

**iOS Pod errors?**
```bash
cd mobile/ios
rm -rf Pods Podfile.lock
pod install
cd ../../
npm run ios
```

**Metro bundler crashes?**
```bash
cd mobile
lsof -i :8081
kill -9 <PID>
npm start
```

## Building for Production

### Web App
```bash
npm run build
# Output in dist/
```

### Mobile App - iOS
```bash
cd mobile
eas build --platform ios
# Use EAS dashboard to sign and build
```

### Mobile App - Android
```bash
cd mobile
eas build --platform android
```

(Requires free EAS account at https://eas.expo.dev)

## Platform-Specific Notes

### iOS (Xcode)

You can view the native project:
```bash
open mobile/ios/reptrak.xcworkspace
```

Always use `.xcworkspace`, not `.xcodeproj`

### Android

Requires Android Studio installed with emulator running:
```bash
open -a Android\ Studio
# Start emulator from Device Manager
```

## What's Different Between Web and Mobile

| Feature | Web | Mobile |
|---------|-----|--------|
| Framework | React + Vite | React Native + Expo |
| Styling | SCSS + CSS | React Native StyleSheet |
| Routing | URL-based | React Navigation |
| Storage | localStorage | AsyncStorage |
| Animations | GSAP | React Native Animated |
| Icons | FontAwesome | Expo Vector Icons |
| Build | Vite | Expo/EAS |
| Platform | Browser | iOS/Android/Web |

## Next Steps

### For Web Development
- Edit `src/App.jsx` for UI changes
- Edit `styles/*.scss` for styling
- Add features in `src/lib/reptrak.js`

### For Mobile Development
- Edit `mobile/src/screens/` for UI changes
- Edit `mobile/src/components/` for reusable components
- Add features in `mobile/src/lib/reptrak.js`

### For Both
- Keep business logic synced between web and mobile
- Test both versions with same data
- Use web for rapid iteration, mobile for native feel

## Resources

- [React Documentation](https://react.dev)
- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [Vite Documentation](https://vitejs.dev)
- [SASS Documentation](https://sass-lang.com)

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the relevant technology docs (links above)
3. Check Expo Go app status
4. Restart the dev server

Good luck! 🚀
