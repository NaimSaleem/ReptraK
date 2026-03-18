import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { loadUser, persistUser, syncDerivedState, isOnboarded } from './lib/reptrak';
import DashboardScreen from './screens/DashboardScreen';
import CalendarScreen from './screens/CalendarScreen';
import ProfileScreen from './screens/ProfileScreen';
import PremiumScreen from './screens/PremiumScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import { glass } from './theme/glass';
import { getThemePalette } from './theme/palette';

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeApp() {
      try {
        const loadedUser = await loadUser();
        setUser(syncDerivedState(loadedUser));
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load user:', error);
        setIsLoading(false);
      }
    }

    initializeApp();
  }, []);

  const updateUser = useCallback((nextUserOrUpdater, options = {}) => {
    const { sync = true } = options;

    setUser((previousUser) => {
      const nextUser = typeof nextUserOrUpdater === 'function'
        ? nextUserOrUpdater(previousUser)
        : nextUserOrUpdater;
      const finalUser = sync ? syncDerivedState(nextUser) : nextUser;
      persistUser(finalUser);
      return finalUser;
    });
  }, []);

  if (isLoading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a1220' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  const theme = getThemePalette(user.theme);

  if (!isOnboarded(user)) {
    return <OnboardingScreen user={user} onUserChange={updateUser} theme={theme} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: theme.accentStrong,
          tabBarInactiveTintColor: 'rgba(230, 241, 255, 0.55)',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 0.3,
            paddingBottom: 2
          },
          tabBarItemStyle: {
            paddingVertical: 6,
            marginHorizontal: 4,
            borderRadius: 999
          },
          tabBarStyle: {
            position: 'absolute',
            left: 14,
            right: 14,
            bottom: 18,
            borderRadius: 999,
            height: 78,
            paddingBottom: 10,
            paddingTop: 10,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0
          },
          tabBarActiveBackgroundColor: theme.glow,
          tabBarInactiveBackgroundColor: 'rgba(255,255,255,0.05)',
          tabBarBackground: () => (
            <View style={{ flex: 1, borderRadius: 999, overflow: 'hidden' }}>
              <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFillObject} />
              <LinearGradient
                colors={['rgba(233, 245, 255, 0.16)', 'rgba(90, 127, 201, 0.12)', 'rgba(18, 22, 52, 0.34)']}
                locations={[0, 0.42, 1]}
                style={StyleSheet.absoluteFillObject}
              />
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: 2,
                  right: 2,
                  top: 2,
                  height: '52%',
                  borderTopLeftRadius: 999,
                  borderTopRightRadius: 999,
                  backgroundColor: 'rgba(255, 255, 255, 0.12)'
                }}
              />
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: 2,
                  right: 2,
                  top: 2,
                  bottom: 2,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: glass.colors.borderInner
                }}
              />
            </View>
          ),
          headerStyle: {
            backgroundColor: `${theme.bgElevated}F0`,
            borderBottomColor: glass.colors.borderSoft,
            borderBottomWidth: 1
          },
          headerTintColor: glass.colors.textMain,
          headerTitleStyle: { color: glass.colors.textMain },
          tabBarIcon: ({ color, size, focused }) => {
            const names = {
              Home: focused ? 'home' : 'home-outline',
              Calendar: focused ? 'calendar' : 'calendar-outline',
              Profile: focused ? 'person-circle' : 'person-circle-outline',
              Premium: focused ? 'diamond' : 'diamond-outline'
            };
            return <Ionicons name={names[route.name]} size={size + 1} color={color} />;
          }
        })}
      >
        <Tab.Screen
          name="Home"
          options={{ title: 'Dashboard' }}
        >
          {() => <DashboardScreen user={user} onUserChange={updateUser} theme={theme} />}
        </Tab.Screen>
        <Tab.Screen
          name="Calendar"
          options={{ title: 'Calendar' }}
        >
          {() => <CalendarScreen user={user} onUserChange={updateUser} theme={theme} />}
        </Tab.Screen>
        <Tab.Screen
          name="Profile"
          options={{ title: 'Profile' }}
        >
          {() => <ProfileScreen user={user} theme={theme} />}
        </Tab.Screen>
        <Tab.Screen
          name="Premium"
          options={{ title: 'Premium' }}
        >
          {() => <PremiumScreen user={user} onUserChange={updateUser} theme={theme} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
