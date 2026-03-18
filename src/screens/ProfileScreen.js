import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { getDayPercent, getProfileContent, getCompletedActivityCount } from '../lib/reptrak';
import { ActivityRow } from '../components/ActivityRow';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1220'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  header: {
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)'
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20
  },
  profileHeadline: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8
  },
  profileSummary: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20
  },
  statsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)'
  },
  statRowLast: {
    borderBottomWidth: 0
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)'
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff'
  },
  activitiesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12
  }
});

export default function ProfileScreen({ user }) {
  const dayPercent = getDayPercent(user);
  const profile = getProfileContent(dayPercent);
  const completedActivities = getCompletedActivityCount(user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{user.name}'s Profile</Text>
          <Text style={styles.subtitle}>Your habit tracking journey</Text>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.profileHeadline}>{profile.headline}</Text>
          <Text style={styles.profileSummary}>{profile.summary}</Text>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Your Stats</Text>
          <View style={[styles.statRow]}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{user.streak || 0} days</Text>
          </View>
          <View style={[styles.statRow]}>
            <Text style={styles.statLabel}>Total Reps</Text>
            <Text style={styles.statValue}>{user.count || 0}</Text>
          </View>
          <View style={[styles.statRow]}>
            <Text style={styles.statLabel}>Minutes Logged</Text>
            <Text style={styles.statValue}>{user.minutes || 0}</Text>
          </View>
          <View style={[styles.statRow]}>
            <Text style={styles.statLabel}>Activities Above 75%</Text>
            <Text style={styles.statValue}>{completedActivities}/{user.activities.length}</Text>
          </View>
          <View style={[styles.statRow, styles.statRowLast]}>
            <Text style={styles.statLabel}>Today's Completion</Text>
            <Text style={styles.statValue}>{dayPercent}%</Text>
          </View>
        </View>

        <Text style={styles.activitiesTitle}>All Activities</Text>
        {user.activities.map((activity) => (
          <View key={activity.id} style={{ opacity: 0.7 }}>
            <ActivityRow
              activity={activity}
              onCountChange={() => {}}
              onTimeChange={() => {}}
              editable={false}
              showZone={true}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
