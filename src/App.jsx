import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import { loadUser, persistUser, syncDerivedState, isOnboarded } from './lib/reptrak';
import DashboardScreen from './screens/DashboardScreen';
import CalendarScreen from './screens/CalendarScreen';
import ProfileScreen from './screens/ProfileScreen';
import PremiumScreen from './screens/PremiumScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import { glass } from './theme/glass';

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

  if (!isOnboarded(user)) {
    return <OnboardingScreen user={user} onUserChange={updateUser} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: glass.colors.accentStrong,
          tabBarInactiveTintColor: 'rgba(230, 241, 255, 0.55)',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            paddingBottom: 4
          },
          tabBarItemStyle: {
            paddingVertical: 6
          },
          tabBarStyle: {
            backgroundColor: 'rgba(35, 33, 77, 0.92)',
            borderTopColor: glass.colors.borderSoft,
            borderTopWidth: 1
          },
          headerStyle: {
            backgroundColor: 'rgba(35, 33, 77, 0.94)',
            borderBottomColor: glass.colors.borderSoft,
            borderBottomWidth: 1
          },
          headerTintColor: glass.colors.textMain,
          headerTitleStyle: { color: glass.colors.textMain }
        }}
      >
        <Tab.Screen
          name="Home"
          options={{ title: 'Dashboard' }}
        >
          {() => <DashboardScreen user={user} onUserChange={updateUser} />}
        </Tab.Screen>
        <Tab.Screen
          name="Calendar"
          options={{ title: 'Calendar' }}
        >
          {() => <CalendarScreen user={user} onUserChange={updateUser} />}
        </Tab.Screen>
        <Tab.Screen
          name="Profile"
          options={{ title: 'Profile' }}
        >
          {() => <ProfileScreen user={user} />}
        </Tab.Screen>
        <Tab.Screen
          name="Premium"
          options={{ title: 'Premium' }}
        >
          {() => <PremiumScreen user={user} onUserChange={updateUser} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
