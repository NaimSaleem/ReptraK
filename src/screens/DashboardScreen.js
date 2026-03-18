import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { getDayPercent, getZoneConfig, getCoachContent, getGreeting, getCompletedActivityCount } from '../lib/reptrak';
import { ActivityRow } from '../components/ActivityRow';
import { AmbientGlow } from '../components/AmbientGlow';
import { GlassButton } from '../components/GlassButton';
import { glass } from '../theme/glass';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1a46'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: glass.colors.textMain,
    marginBottom: 8
  },
  displayName: {
    fontSize: 12,
    color: glass.colors.textSoft,
    marginBottom: 20
  },
  statGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  statCard: {
    flex: 1,
    backgroundColor: glass.colors.panel,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    ...glass.shadow.soft
  },
  statLabel: {
    fontSize: 11,
    color: glass.colors.textSoft,
    marginBottom: 4,
    fontWeight: '500'
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: glass.colors.textMain
  },
  coachSection: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    marginBottom: 20,
    ...glass.shadow.soft
  },
  coachHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: glass.colors.textMain,
    marginBottom: 4
  },
  coachKicker: {
    fontSize: 12,
    color: glass.colors.textSoft,
    marginBottom: 8,
    fontWeight: '500'
  },
  coachCopy: {
    fontSize: 13,
    color: 'rgba(237, 246, 255, 0.82)',
    lineHeight: 20
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: glass.colors.textMain,
    marginBottom: 12
  },
  quickAddButton: {
    marginBottom: 18
  }
});

export default function DashboardScreen({ user, onUserChange }) {
  const dayPercent = getDayPercent(user);
  const zone = getZoneConfig(dayPercent);
  const coach = getCoachContent(user, dayPercent);
  const completedActivities = getCompletedActivityCount(user);

  const handleActivityChange = (activityId, field, value) => {
    onUserChange({
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
    });
  };

  const handleQuickAdd = () => {
    onUserChange({
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
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AmbientGlow />
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        <GlassButton
          title={`+ Quick Add ${user.activities[0]?.name || 'Habit'}`}
          onPress={handleQuickAdd}
          style={styles.quickAddButton}
        />

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
