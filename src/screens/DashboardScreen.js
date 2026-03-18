import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { persistUser, syncDerivedState, getDayPercent, getZone, getZoneConfig, getCoachContent, getGreeting, getCompletedActivityCount } from '../lib/reptrak';
import { ActivityRow } from '../components/ActivityRow';
import { GlassButton } from '../components/GlassButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1220'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8
  },
  displayName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 20
  },
  statGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
    fontWeight: '500'
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff'
  },
  coachSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20
  },
  coachHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4
  },
  coachKicker: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    fontWeight: '500'
  },
  coachCopy: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12
  },
  quickAddButton: {
    backgroundColor: 'rgba(136, 239, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(136, 239, 255, 0.5)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20
  },
  quickAddText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#88efff'
  }
});

export default function DashboardScreen({ user, setUser }) {
  const dayPercent = getDayPercent(user);
  const zoneKey = getZone(dayPercent);
  const zone = getZoneConfig(dayPercent);
  const coach = getCoachContent(user, dayPercent);
  const completedActivities = getCompletedActivityCount(user);

  const handleActivityChange = (activityId, field, value) => {
    const updatedUser = {
      ...user,
      activities: user.activities.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            [field]: Math.max(Number(value) || 0, 0)
          };
        }
        return activity;
      })
    };
    const syncedUser = syncDerivedState(updatedUser);
    setUser(syncedUser);
    persistUser(syncedUser);
  };

  const handleQuickAdd = () => {
    const updatedUser = {
      ...user,
      activities: user.activities.map((activity, index) => {
        if (index === 0) {
          return {
            ...activity,
            loggedCount: activity.loggedCount + 1
          };
        }
        return activity;
      })
    };
    const syncedUser = syncDerivedState(updatedUser);
    setUser(syncedUser);
    persistUser(syncedUser);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <Text style={styles.greeting}>{getGreeting()}, {user.name}</Text>
        <Text style={styles.displayName}>{dayPercent}% of your goals complete today</Text>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{user.streak || 0}d</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{completedActivities}/{user.activities.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Today</Text>
            <Text style={styles.statValue}>{dayPercent}%</Text>
          </View>
        </View>

        <View
          style={[
            styles.coachSection,
            { backgroundColor: `${zone.color}20`, borderColor: `${zone.color}40` }
          ]}
        >
          <Text style={styles.coachHeading}>{coach.heading}</Text>
          <Text style={styles.coachKicker}>{coach.kicker}</Text>
          <Text style={styles.coachCopy}>{coach.copy}</Text>
        </View>

        <Text style={styles.activitiesTitle}>Your Habits</Text>

        <TouchableOpacity style={styles.quickAddButton} onPress={handleQuickAdd}>
          <Text style={styles.quickAddText}>+ Quick Add {user.activities[0]?.name}</Text>
        </TouchableOpacity>

        {user.activities.map((activity) => (
          <ActivityRow
            key={activity.id}
            activity={activity}
            onCountChange={(value) => handleActivityChange(activity.id, 'loggedCount', value)}
            onTimeChange={(value) => handleActivityChange(activity.id, 'timeLogged', value)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
