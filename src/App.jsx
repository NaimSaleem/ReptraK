import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  clearStoredUser,
  createDefaultUser,
  isOnboarded,
  loadUser,
  persistUser,
  syncDerivedState
} from './lib/reptrak';
import { clearNotifications, syncNotificationsForUser } from './lib/notifications';
import DashboardScreen from './screens/DashboardScreen';
import CalendarScreen from './screens/CalendarScreen';
import ProfileScreen from './screens/ProfileScreen';
import PremiumScreen from './screens/PremiumScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import { LiquidTabBar } from './components/LiquidTabBar';
import { LoadingScreen } from './components/LoadingScreen';
import { getThemePalette } from './theme/palette';

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeApp() {
      try {
        const [loadedUser] = await Promise.all([
          loadUser(),
          new Promise((resolve) => setTimeout(resolve, 900))
        ]);

        if (!mounted) return;
        setUser(syncDerivedState(loadedUser));
      } catch (error) {
        console.error('Failed to load user:', error);
        if (!mounted) return;
        setUser(syncDerivedState(createDefaultUser()));
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeApp();

    return () => {
      mounted = false;
    };
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

  const resetSession = useCallback(async () => {
    await clearNotifications();
    await clearStoredUser();
    setUser(syncDerivedState(createDefaultUser(new Date())));
  }, []);

  const theme = useMemo(
    () => getThemePalette(user?.theme || 'aqua'),
    [user?.theme]
  );
  const navigationTheme = useMemo(() => ({
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme?.accent || '#6FD9FF',
      background: 'transparent',
      card: 'transparent',
      border: 'transparent',
      text: '#ffffff'
    }
  }), [theme]);

  useEffect(() => {
    if (!user) return;

    if (!isOnboarded(user)) {
      clearNotifications();
      return;
    }

    syncNotificationsForUser(user).catch((error) => {
      console.error('Failed to sync notifications:', error);
    });
  }, [
    user?.name,
    user?.habit,
    user?.notificationSettings?.enabled,
    user?.notificationSettings?.reminderTime,
    user?.notificationSettings?.tone
  ]);

  if (isLoading || !user) {
    return <LoadingScreen theme={theme} />;
  }

  if (!isOnboarded(user)) {
    return <OnboardingScreen user={user} onUserChange={updateUser} theme={theme} />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        detachInactiveScreens={false}
        lazy={false}
        tabBar={(props) => <LiquidTabBar {...props} theme={theme} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          animation: 'fade',
          sceneStyle: {
            backgroundColor: 'transparent'
          }
        }}
      >
        <Tab.Screen name="Home">
          {() => <DashboardScreen user={user} onUserChange={updateUser} theme={theme} />}
        </Tab.Screen>
        <Tab.Screen name="Calendar">
          {() => <CalendarScreen user={user} onUserChange={updateUser} theme={theme} />}
        </Tab.Screen>
        <Tab.Screen name="Profile">
          {() => (
            <ProfileScreen
              user={user}
              onUserChange={updateUser}
              onResetSession={resetSession}
              theme={theme}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Premium">
          {() => <PremiumScreen user={user} onUserChange={updateUser} theme={theme} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
