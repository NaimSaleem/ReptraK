# Testing ReptraK on Native Platforms

## iOS Testing (Xcode)

### Prerequisites
- macOS with Xcode installed (`xcode-select --install`)
- CocoaPods (`sudo gem install cocoapods`)
- Node.js >= 18

### Setup

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Install CocoaPods:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Open in Xcode:**
   ```bash
   open ios/reptrak.xcworkspace
   ```
   
   **Important:** Always open the `.xcworkspace` file, not `.xcodeproj`

### Running on Simulator

1. In Xcode, select your target iPhone model from the top menu:
   - Click "reptrak" next to the play button
   - Select "iPhone 15" (or any simulator)

2. Press the Play button (Cmd+R) to build and run

3. The app opens in the iOS simulator

### Running on Physical Device

1. Connect your iPhone to your Mac with USB cable

2. In Xcode, select your device from the device menu

3. You may need to sign the app:
   - Go to Signing & Capabilities tab
   - Set Team to your Apple ID or development team

4. Press Play button to build and deploy

### Debugging in Xcode

- **Set Breakpoints:** Click line numbers to add breakpoints
- **View Console:** Cmd+Shift+C to open debug console
- **View Logs:** Window → Devices and Simulators → View Device Logs
- **Pause Execution:** The pause button in the debug bar

### Troubleshooting iOS

**Podfile issues:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

**Build cache issues:**
```bash
cd ios
rm -rf build DerivedData
cd ..
open ios/reptrak.xcworkspace
# Then clean build (Cmd+Shift+K) and rebuild (Cmd+B)
```

**Port 8081 (Metro bundler) conflicts:**
```bash
lsof -i :8081
kill -9 <PID>
```

---

## Android Testing

### Prerequisites
- Android Studio installed
- Android SDK (API 21+)
- Android emulator or physical device
- Node.js >= 18

### Setup

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Start Android emulator:**
   - Open Android Studio
   - Device Manager → Create or select emulator
   - Click Play button on emulator

3. **Build and run:**
   ```bash
   npm run android
   ```

### Running on Physical Device

1. **Enable USB Debugging:**
   - Settings → Developer Options → USB Debugging
   - (Developer Options may need to be unlocked by tapping Build Number 7 times)

2. **Connect device to computer via USB**

3. **Run the app:**
   ```bash
   npm run android
   ```

### Debugging in Android Studio

1. **Attach Debugger:**
   - Run → Attach to Process
   - Select your app process
   - Click Attach

2. **Set Breakpoints:** Click line numbers to add breakpoints

3. **Logcat:** View → Tool Windows → Logcat (shows all app logs)

4. **Debug Console:** View → Tool Windows → Debug

### Rebuilding the Android Project

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Troubleshooting Android

**Build fails / "Gradle sync failed":**
```bash
cd android
rm -rf .gradle build
./gradlew clean
cd ..
npm run android
```

**Emulator won't start:**
```bash
# Open Android Studio Device Manager and create a new emulator
# Make sure it has API level 21 or higher
```

**App crashes on startup:**
- Check Logcat for errors
- Ensure Metro bundler is running (you should see "http://localhost:8081" in terminal)
- Clear app data: `./gradlew uninstallDebug`

**Port issues:**
```bash
adb kill-server
adb start-server
```

---

## Running Both Simultaneously

You can test on iOS and Android at the same time:

**Terminal 1 - iOS:**
```bash
cd mobile
npm run ios
```

**Terminal 2 - Android:**
```bash
cd mobile
npm run android
```

Both will share the same Metro bundler on port 8081.

---

## Platform Comparison

| Feature | iOS | Android |
|---------|-----|---------|
| **Simulator** | Built into Xcode | Android Emulator (separate) |
| **Build Time** | 2-5 minutes | 3-8 minutes |
| **Hot Reload** | Yes | Yes |
| **Debugging** | Xcode Debugger | Android Studio + Logcat |
| **Testing Device** | iPhone / iPad | Phone / Tablet |
| **Min SDK** | iOS 13 | API 21+ |

---

## Performance Tips

- **Smaller builds:** Use specific device architecture (e.g., arm64 for most modern phones)
- **Faster Metro bundler:** Clear cache with `npm start -- --reset-cache`
- **Emulator speed:** Use hardware acceleration if available
- **Debugging:** Close debugger when not needed (uses more memory)

---

## Building for Production

### iOS (via App Store)
```bash
npm run ios:build-release
# Creates IPA file for TestFlight / App Store
```

### Android (via Play Store)
```bash
npm run android:build-release
# Creates AAB file for Google Play
```

(Requires proper signing certificates)

---

## Next Steps

1. Make a small code change to test hot reload
2. Add a log statement and watch it appear in the console
3. Set a breakpoint and step through code
4. Try the app's features (onboarding, logging activities, calendar)
5. Check data persists by closing and reopening the app
