# Mobile Development Setup

This guide helps you test the React Native app in Xcode for iOS development.

## Prerequisites

- macOS with Xcode installed
- Node.js >= 18
- CocoaPods installed (`sudo gem install cocoapods`)

## Setup Steps

### 1. Install Expo CLI
```bash
npm install -g expo-cli
```

### 2. Install Mobile Dependencies
```bash
cd mobile
npm install
```

### 3. Configure Xcode

The React Native app can be run in Xcode using two methods:

#### Method A: Expo Go (Recommended for Testing)
This is the fastest way to test:

```bash
npm start
# Then press 'i' to launch iOS simulator
```

The Expo Go app will open in the iOS simulator, and you can test your app immediately.

#### Method B: Native iOS Build
For building a native iOS app:

```bash
# First, install pods
cd ios
pod install
cd ..

# Then build
npm run ios
```

This creates a native Xcode project and opens it in your simulator.

### 4. Open Project in Xcode (Optional)

If you want to open the project directly in Xcode:

```bash
open ios/reptrak.xcworkspace
```

**Note:** Always use `reptrak.xcworkspace`, not `reptrak.xcodeproj`

## Viewing in Simulator

When running `npm start` or `npm run ios`:

1. The iOS simulator opens automatically
2. Your app loads
3. Use simulator controls to test different devices:
   - Device → iPhone 15 Pro (or any model)
   - Device → iPad (to test tablets)

## Hot Reload

Changes to your code will automatically reload in the simulator. Simply edit a file and save - the app updates in seconds.

## Debugging

### Using Xcode Debugger
1. Set breakpoints in Xcode (if using native Xcode project)
2. Run the app with `npm run ios`
3. Breakpoints will be hit during execution

### Using React Native Debugger
1. Install: https://github.com/jhen0409/react-native-debugger
2. Open the app in simulator
3. Press `Cmd + D` in simulator to open developer menu
4. Select "Open Debugger"

### Console Logs
In the Metro bundler terminal (where you ran `npm start`), you'll see all console.log output.

## Testing on Physical Device

### Using Expo Go:
1. Install Expo Go from App Store on your iPhone
2. Run `npm start` on your computer
3. Scan the QR code with your iPhone camera
4. Your app opens in Expo Go

### Using TestFlight (for native builds):
```bash
eas build --platform ios
# Follow prompts to build
# Use TestFlight to distribute to testers
```

## Troubleshooting

### App Won't Start
```bash
npm start -- --reset-cache
```

### Pod Install Errors
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Metro Bundler Port Conflict
```bash
# Kill process on port 8081
lsof -i :8081
kill -9 <PID>

npm start
```

### Simulator Issues
1. Reset simulator: `xcrun simctl erase all`
2. Restart Xcode
3. Try a different simulator device

## Development Workflow

1. Start the Metro bundler: `npm start`
2. Press `i` for iOS simulator
3. Make code changes (you're editing TypeScript/React)
4. Save - app hot reloads in simulator
5. Test UI, interactions, state
6. Repeat steps 3-5

## Building for Production

See `mobile/README.md` for production build instructions using EAS.

## Resources

- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [Xcode Documentation](https://developer.apple.com/xcode/)
- [iOS Development Guide](https://developer.apple.com/design/human-interface-guidelines/ios)
