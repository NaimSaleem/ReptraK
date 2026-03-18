import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { loadUser, syncDerivedState } from './lib/reptrak';
import DashboardScreen from './screens/DashboardScreen';
import CalendarScreen from './screens/CalendarScreen';
import ProfileScreen from './screens/ProfileScreen';
import PremiumScreen from './screens/PremiumScreen';
import OnboardingScreen from './screens/OnboardingScreen';

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

  if (isLoading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a1220' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  const isOnboarded = Boolean(user.name && user.habit && user.frequency);

  if (!isOnboarded) {
    return <OnboardingScreen user={user} setUser={setUser} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Calendar') iconName = 'calendar-today';
            else if (route.name === 'Profile') iconName = 'person';
            else if (route.name === 'Premium') iconName = 'star';

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#88efff',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
          tabBarStyle: {
            backgroundColor: 'rgba(10, 18, 32, 0.95)',
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
            borderTopWidth: 1
          },
          headerStyle: {
            backgroundColor: 'rgba(10, 18, 32, 0.95)',
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
            borderBottomWidth: 1
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: { color: '#ffffff' }
        })}
      >
        <Tab.Screen
          name="Home"
          options={{ title: 'Dashboard' }}
        >
          {() => <DashboardScreen user={user} setUser={setUser} />}
        </Tab.Screen>
        <Tab.Screen
          name="Calendar"
          options={{ title: 'Calendar' }}
        >
          {() => <CalendarScreen user={user} setUser={setUser} />}
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
          {() => <PremiumScreen user={user} setUser={setUser} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
