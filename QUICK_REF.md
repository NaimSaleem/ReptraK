# ReptraK React Native - Quick Reference

## 🚀 Start Development (Pick One)

### iOS Simulator (Easiest)
```bash
cd mobile && npm install && npm start
# Press 'i'
```

### Xcode
```bash
cd mobile && npm install && npm run ios
# Opens Xcode + simulator automatically
```

### Your iPhone
```bash
cd mobile && npm install && npm start
# Scan QR code with camera → opens in Expo Go
```

### Android
```bash
cd mobile && npm install && npm start
# Press 'a'
```

## 📁 Key Files to Edit

### Screens (What Users See)
- `mobile/src/screens/DashboardScreen.js` - Home screen
- `mobile/src/screens/OnboardingScreen.js` - Onboarding flow
- `mobile/src/screens/CalendarScreen.js` - Calendar views
- `mobile/src/screens/ProfileScreen.js` - User stats
- `mobile/src/screens/PremiumScreen.js` - Premium features

### Components (Reusable UI)
- `mobile/src/components/ActivityRow.js` - Activity input box
- `mobile/src/components/GlassButton.js` - Buttons
- `mobile/src/components/ZoneCard.js` - Progress badges

### Business Logic (All Platform-Shared)
- `mobile/src/lib/reptrak.js` - User math, zones, streaks, etc.

### App Setup
- `mobile/src/App.jsx` - Navigation setup
- `mobile/app.json` - Expo configuration
- `mobile/package.json` - Dependencies

## 🎨 Common Tasks

### Add a New Screen
1. Create `mobile/src/screens/MyScreen.js`
2. Add to navigation in `mobile/src/App.jsx`:
```jsx
<Tab.Screen name="MyScreen" options={{ title: 'My Screen' }}>
  {() => <MyScreen user={user} setUser={setUser} />}
</Tab.Screen>
```

### Change Colors
Edit `mobile/src/lib/reptrak.js`:
```js
export const ZONES = {
  low: {
    color: '#ff6530',      // Change this
    lightColor: '#ff9f6d', // And this
    // ...
  }
}
```

### Add Button
```jsx
import { GlassButton } from '../components/GlassButton';

<GlassButton 
  title="Press Me" 
  onPress={() => console.log('Pressed!')}
/>
```

### Display Text
```jsx
<Text style={{ fontSize: 16, color: '#ffffff' }}>
  Hello World
</Text>
```

### Get User Data
```jsx
<Text>{user.name}</Text>
<Text>{user.activities[0].name}</Text>
<Text>{user.streak} day streak</Text>
```

### Update User Data
```jsx
const updatedUser = {
  ...user,
  name: 'New Name'
};
const syncedUser = syncDerivedState(updatedUser);
setUser(syncedUser);
persistUser(syncedUser);
```

### Save Data
```jsx
import { persistUser, syncDerivedState } from '../lib/reptrak';

// Update user
const syncedUser = syncDerivedState(updatedUser);
setUser(syncedUser);
// Save to storage
persistUser(syncedUser);
```

## 🔍 Debug Tips

### View Console Logs
Look at the terminal where you ran `npm start`

### Reload App
Press `R` in terminal (or `Cmd+R` when simulator is focused)

### Hot Reload
Just save a file - app updates in ~1 second

### Open Dev Menu
- Simulator: Press `Cmd+D`
- Physical Device: Shake phone

### Clear Everything
```bash
cd mobile
npm start -- --reset-cache
```

## 📦 Styling Quick Ref

### Create Styles
```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0a1220'
  },
  text: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600'
  }
});

// Use:
<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
</View>
```

### Common Properties
```js
{
  // Layout
  flex: 1,                          // Take available space
  flexDirection: 'row',             // Horizontal layout
  justifyContent: 'space-between',  // Distribute horizontally
  alignItems: 'center',             // Align vertically
  
  // Spacing
  padding: 16,                      // Inside spacing
  margin: 8,                        // Outside spacing
  gap: 10,                          // Space between children
  
  // Sizing
  width: 200,
  height: 200,
  minWidth: 100,
  
  // Colors & Borders
  backgroundColor: '#0a1220',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#ffffff'
}
```

## 🎯 Common Patterns

### Safe Area (Notches/Home Indicator)
```jsx
import { SafeAreaView } from 'react-native';

<SafeAreaView style={styles.container}>
  {/* Content */}
</SafeAreaView>
```

### Scrollable Content
```jsx
import { ScrollView } from 'react-native';

<ScrollView style={styles.container}>
  <Text>This can be long and scroll</Text>
</ScrollView>
```

### List of Items
```jsx
{user.activities.map((activity) => (
  <ActivityRow 
    key={activity.id}
    activity={activity}
    onCountChange={(val) => handleChange(activity.id, val)}
  />
))}
```

### Button with Action
```jsx
import { TouchableOpacity } from 'react-native';

<TouchableOpacity onPress={() => handlePress()}>
  <Text style={styles.buttonText}>Click Me</Text>
</TouchableOpacity>
```

### Text Input
```jsx
import { TextInput } from 'react-native';

<TextInput
  style={styles.input}
  placeholder="Type here..."
  placeholderTextColor="rgba(255,255,255,0.3)"
  value={input}
  onChangeText={setInput}
  keyboardType="numeric"
/>
```

## 📊 Data Flow

1. **Load App** → `loadUser()` from AsyncStorage
2. **Display** → `sync DerivedState(user)` to calculate zones/streaks
3. **User Changes** → `setUser()` updates React state
4. **Save** → `persistUser()` writes to AsyncStorage
5. **Reload** → Data is there!

## ⚠️ Remember

- All styles are React Native `StyleSheet`, not CSS
- No HTML elements - use `View`, `Text`, `ScrollView`, etc.
- Colors must be hex or rgba strings
- Async/await for storage (not sync)
- Always call `syncDerivedState()` after user changes
- Always call `persistUser()` after updates

## 🆘 Emergency Commands

```bash
# Nuclear reset
cd mobile
rm -rf node_modules package-lock.json
npm install
npm start -- --reset-cache

# Kill hung process
lsof -i :8081
kill -9 <PID>

# Clear simulator
xcrun simctl erase all
```

## 📚 Documentation

- Full setup: See `MOBILE_SETUP.md`
- Getting started: See `GETTING_STARTED.md`
- Mobile README: See `mobile/README.md`

**Have fun coding! 🚀**
