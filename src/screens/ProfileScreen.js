import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { getDayPercent, getFocusActivity, getProfileContent, getCompletedActivityCount, getTrackableActivities } from '../lib/reptrak';
import { ActivityRow } from '../components/ActivityRow';
import { AmbientGlow } from '../components/AmbientGlow';
import { FadeInView } from '../components/FadeInView';
import { GlassSurface } from '../components/GlassSurface';
import { LiquidGlassOrb } from '../components/LiquidGlassOrb';
import { glass } from '../theme/glass';
import { layout } from '../theme/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1a46'
  },
  scrollContent: {
    paddingHorizontal: layout.appHorizontalPadding,
    paddingVertical: layout.appVerticalPadding,
    paddingBottom: 136
  },
  header: {
    marginBottom: 18
  },
  title: {
    fontSize: 33,
    lineHeight: 36,
    letterSpacing: -1,
    fontWeight: '800',
    color: glass.colors.textMain,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: glass.colors.textSoft
  },
  orbWrap: {
    alignItems: 'center',
    marginBottom: 16
  },
  profileCard: {
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden'
  },
  profileHeadline: {
    fontSize: 16,
    fontWeight: '700',
    color: glass.colors.textMain,
    marginBottom: 8
  },
  profileSummary: {
    fontSize: 13,
    color: 'rgba(237, 246, 255, 0.82)',
    lineHeight: 20
  },
  statsSection: {
    padding: 18,
    marginBottom: 20,
    overflow: 'hidden'
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: glass.colors.textMain,
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
    color: glass.colors.textSoft
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: glass.colors.textMain
  },
  activitiesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: glass.colors.textMain,
    marginBottom: 12
  }
});

export default function ProfileScreen({ user, theme }) {
  const dayPercent = getDayPercent(user);
  const profile = getProfileContent(dayPercent);
  const completedActivities = getCompletedActivityCount(user);
  const focus = getFocusActivity(user);
  const trackableTotal = getTrackableActivities(user).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.bgBase || '#1d1a46' }]}>
      <AmbientGlow theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeInView style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>{user.name}'s habit tracking journey</Text>
        </FadeInView>

        <FadeInView style={styles.orbWrap} delay={60}>
          <LiquidGlassOrb percent={dayPercent} />
        </FadeInView>

        <FadeInView delay={120}>
          <GlassSurface style={styles.profileCard} radius={20} fillColor={glass.colors.panelStrong}>
            <Text style={styles.profileHeadline}>{profile.headline}</Text>
            <Text style={styles.profileSummary}>{profile.summary}</Text>
          </GlassSurface>
        </FadeInView>

        <FadeInView delay={180}>
          <GlassSurface style={styles.statsSection} radius={20} fillColor={glass.colors.panel}>
            <Text style={styles.statsTitle}>Your Stats</Text>
            <View style={[styles.statRow]}>
              <Text style={styles.statLabel}>Current Focus</Text>
              <Text style={styles.statValue}>{focus?.name || 'None'}</Text>
            </View>
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
              <Text style={styles.statValue}>{completedActivities}/{trackableTotal}</Text>
            </View>
            <View style={[styles.statRow, styles.statRowLast]}>
              <Text style={styles.statLabel}>Today's Completion</Text>
              <Text style={styles.statValue}>{dayPercent}%</Text>
            </View>
          </GlassSurface>
        </FadeInView>

        {!!user.focusArchive?.length && (
          <FadeInView delay={240}>
            <GlassSurface style={styles.statsSection} radius={20} fillColor={glass.colors.panel}>
              <Text style={styles.statsTitle}>Archived Focus Sessions</Text>
              {user.focusArchive.slice(0, 3).map((entry) => (
                <View key={entry.switchedAt} style={[styles.statRow]}>
                  <Text style={styles.statLabel}>{entry.name}</Text>
                  <Text style={styles.statValue}>{entry.finalPercent}%</Text>
                </View>
              ))}
            </GlassSurface>
          </FadeInView>
        )}

        <Text style={styles.activitiesTitle}>All Activities</Text>
        {user.activities.map((activity, index) => (
          <View key={activity.id} style={{ opacity: 0.7 }}>
            <ActivityRow
              activity={activity}
              onCountChange={() => {}}
              onTimeChange={() => {}}
              editable={false}
              showZone={true}
              animationDelay={280 + (index * 60)}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
