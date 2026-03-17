# ReptraK Native Setup - Complete Guide

This guide walks you through setting up and testing the native iOS and Android versions of ReptraK.

## Project Structure

```
ReptraK/mobile/
├── ios/                                    # iOS Xcode project
│   ├── reptrak.xcworkspace/               # ← Open this in Xcode
│   ├── reptrak.xcodeproj/
│   ├── reptrak/                           # Source files
│   │   ├── AppDelegate.mm                 # App entry point
│   │   ├── Main.m                         # main() function
│   │   ├── LaunchScreen.*                 # Launch screen UI
│   │   └── Info.plist                     # App configuration
│   ├── Podfile                            # CocoaPods dependencies
│   └── .gitignore
│
├── android/                                # Android Gradle project
│   ├── app/                               # App module
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml        # App permissions & config
│   │   │   ├── java/com/reptrak/app/
│   │   │   │   ├── MainActivity.java      # Activity entry point
│   │   │   │   └── MainApplication.java   # App initialization
│   │   │   └── res/                       # Resources (strings, styles)
│   │   ├── build.gradle                   # App build config
│   │   └── google-services.json           # Firebase config
│   ├── gradle/wrapper/                    # Gradle version
│   ├── build.gradle                       # Root build config
│   ├── settings.gradle                    # Project modules
│   └── gradle.properties                  # Gradle settings
│
├── src/                                    # React Native source code
│   ├── App.jsx                            # Main app component
│   ├── screens/                           # Screen components
│   └── lib/reptrak.js                     # Business logic
│
├── package.json                           # Dependencies
├── app.json                               # Expo configuration
└── babel.config.js                        # JavaScript compilation
```

## Quick Start

### 1. Install Node Dependencies

```bash
cd /Users/naimsaleem/Desktop/ReptraK/mobile
npm install
```

### 2a. **iOS Setup (Recommended for Mac)**

#### Prerequisites
- Xcode (from App Store)
- CocoaPods: `sudo gem install cocoapods`

#### Setup Steps

```bash
# Install iOS dependencies
cd ios
pod install
cd ..

# Open in Xcode
open ios/reptrak.xcworkspace
```

**In Xcode:**
1. Select "reptrak" target (top left)
2. Select iPhone simulator (iPhone 15 Pro)
3. Press Play button (Cmd+R)
4. App builds and runs in simulator

#### Key Xcode Shortcuts
- **Build:** Cmd+B
- **Run:** Cmd+R
- **Debug:** Cmd+Shift+Y (show debug area)
- **Console:** Cmd+Shift+C (show console)
- **Stop:** Cmd+.

---

### 2b. **Android Setup**

#### Prerequisites
- Android Studio
- Android SDK (API 21+)
- Android Emulator running

#### Setup Steps

```bash
# Make gradle executable
chmod +x android/gradlew

# Build and run
npm run android
```

**Or manually:**
```bash
cd android
./gradlew clean
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

#### Key Commands
- **Check devices:** `adb devices`
- **View logs:** `adb logcat`
- **Clear app data:** `adb shell pm clear com.reptrak.app`
- **Start emulator:** Open Android Studio Device Manager

---

## File Explanations

### iOS Files

**AppDelegate.mm**
- Objective-C++ file that initializes the React Native app
- Called when app starts
- Sets up the root view and navigation

**Main.m**
- Entry point: `int main()` function
- Minimal - just calls UIApplicationMain

**LaunchScreen.storyboard/xib**
- Visual loading screen while app starts
- XML-based UI definition

**Info.plist**
- App metadata (name, bundle ID, version)
- Permissions, features, requirements
- Icon and launch image references

**Podfile**
- Package manager for native iOS dependencies
- Defines React Native modules needed
- Similar to Node's package.json for iOS

### Android Files

**AndroidManifest.xml**
- App metadata and configuration
- Declares activities, permissions, features
- Sets minimum SDK version

**MainActivity.java**
- Main activity (screen) of the app
- Entry point for the application
- Handles lifecycle events

**MainApplication.java**
- Application-level initialization
- React configuration
- Global app setup

**build.gradle** (app level)
- Gradle build configuration
- Dependencies, SDK versions, signing config
- Build types (debug/release)

**strings.xml, styles.xml**
- String resources (app name, labels)
- Style definitions (colors, themes)
- Android resource management

---

## Development Workflow

### Making Changes

1. **Edit code** in `mobile/src/*/`
2. **Save file**
3. **Hot reload:**
   - iOS: Command + R in Xcode
   - Android: Press R in terminal
4. **App updates** in ~1 second

### Debugging

#### iOS
```
In Xcode:
1. Click line number to set breakpoint
2. Run app
3. Debugger pauses at breakpoint
4. Use debug panel to inspect variables
5. Step over (F6) / into (F7) / out (F8)
```

#### Android
```
In Android Studio:
1. Click line number to set breakpoint
2. Run: npm run android
3. Debugger attaches automatically
4. Same stepping/inspection as iOS
```

### Viewing Logs

#### iOS
```bash
# In Terminal while app is running
cd ios
xcodebuild -workspace reptrak.xcworkspace -scheme reptrak -configuration Debug | grep "ReptraK\|ERROR\|WARNING"

# Or in Xcode: View → Debug Area → Show Debug Area (Cmd+Shift+Y)
```

#### Android
```bash
# View all logs
adb logcat

# Filter for your app
adb logcat | grep "reptrak\|ERROR\|WARN"

# Clear logs
adb logcat -c
```

---

## Troubleshooting

### iOS

**Problem: Pods installation fails**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

**Problem: Xcode can't find header files**
```
In Xcode:
1. Product → Clean Build Folder (Cmd+Shift+K)
2. Product → Build (Cmd+B)
```

**Problem: "Could not connect to development server"**
```bash
# Metro bundler isn't running
npm start
# Then re-run the app
```

### Android

**Problem: Gradle build fails**
```bash
cd android
rm -rf .gradle build
./gradlew --stop
./gradlew clean
cd ..
npm run android
```

**Problem: App crashes, can't see error**
```bash
adb logcat | grep "ERROR\|Exception"
# Look for the stack trace
```

**Problem: Emulator won't start**
```
Android Studio → Device Manager → Create new emulator
Make sure API level is 21 or higher
```

**Problem: Port 8081 already in use**
```bash
lsof -i :8081
kill -9 <PID>
npm start
```

---

## Testing Checklist

- [ ] App opens without crashing
- [ ] Onboarding flow works (name → habit → frequency)
- [ ] Dashboard displays correctly
- [ ] Can log activities
- [ ] Calendar loads all views
- [ ] Data persists after app close/reopen
- [ ] Animations/transitions look smooth
- [ ] Buttons are responsive
- [ ] No console errors in debug logs

---

## Building for Distribution

### iOS (TestFlight/App Store)

```bash
cd mobile
# Using Expo EAS (recommended)
eas build --platform ios

# Or local build
cd ios
xcodebuild -workspace reptrak.xcworkspace \
  -scheme reptrak \
  -configuration Release \
  -archivePath build/reptrak.xcarchive \
  archive

# Then distribute via App Store Connect
```

### Android (Google Play)

```bash
cd mobile
# Using Expo EAS
eas build --platform android

# Or local build
cd android
./gradlew assembleRelease
# APK at: app/build/outputs/apk/release/app-release.apk

# For Play Store, need to sign and upload AAB
```

---

## Tips & Best Practices

1. **Use simulators/emulators** for initial testing (faster than devices)
2. **Hot reload** whenever possible (saves time)
3. **Check logs frequently** (catch issues early)
4. **Test on multiple devices** (including older models)
5. **Keep Metro bundler running** in separate terminal
6. **Commit your Podfile.lock** (iOS reproducible builds)
7. **Clear cache** when behavior seems wrong (`npm start -- --reset-cache`)

---

## Next Steps

1. ✅ Set up iOS: Open `ios/reptrak.xcworkspace` in Xcode
2. ✅ Set up Android: Run `npm run android`
3. ✅ Test both platforms with sample data
4. ✅ Make a small code change and hot reload
5. ✅ Set a breakpoint and debug
6. ✅ Explore native features (camera, contacts, etc.)

---

## References

- [React Native Docs](https://reactnative.dev)
- [iOS Development Guide](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Android Development Guide](https://developer.android.com)
- [Xcode Help](https://help.apple.com/xcode)
- [Android Studio Help](https://developer.android.com/studio/intro)

Good luck! 🚀
