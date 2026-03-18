import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import {
  addActivity,
  canAddActivity,
  getDayPercent,
  getZoneConfig,
  getCoachContent,
  getGreeting,
  getCompletedActivityCount,
  getFocusActivity,
  getTrackableActivities,
  getSupplementaryActivities,
  switchFocusActivity
} from '../lib/reptrak';
import { ActivityRow } from '../components/ActivityRow';
import { AmbientGlow } from '../components/AmbientGlow';
import { FadeInView } from '../components/FadeInView';
import { GlassButton } from '../components/GlassButton';
import { GlassSurface } from '../components/GlassSurface';
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
  heroCard: {
    padding: 18,
    marginBottom: layout.sectionGap,
    gap: 6
  },
  greeting: {
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.9,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  displayName: {
    fontSize: 14,
    lineHeight: 20,
    color: glass.colors.textSoft
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: layout.sectionGap
  },
  statCard: {
    flex: 1,
    padding: 12,
    minHeight: 94,
    justifyContent: 'space-between'
  },
  statLabel: {
    fontSize: 11,
    color: glass.colors.textSoft,
    marginBottom: 4,
    fontWeight: '700',
    letterSpacing: 0.4
  },
  statValue: {
    fontSize: 19,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  coachSection: {
    padding: 18,
    marginBottom: layout.sectionGap,
    gap: 4
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
    marginBottom: 4,
    fontWeight: '700',
    letterSpacing: 0.4
  },
  coachCopy: {
    fontSize: 14,
    color: 'rgba(237, 246, 255, 0.82)',
    lineHeight: 21
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: glass.colors.textMain,
    marginBottom: 6
  },
  sectionKicker: {
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: '800',
    color: glass.colors.textSoft,
    marginBottom: 4
  },
  quickAddButton: {
    marginBottom: 14
  },
  helperText: {
    color: glass.colors.textSoft,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8
  }
});

export default function DashboardScreen({ user, onUserChange, theme }) {
  const dayPercent = getDayPercent(user);
  const zone = getZoneConfig(dayPercent);
  const coach = getCoachContent(user, dayPercent);
  const completedActivities = getCompletedActivityCount(user);
  const focus = getFocusActivity(user);
  const supplementary = getSupplementaryActivities(user);
  const trackableTotal = getTrackableActivities(user).length;

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

  const incrementActivity = (activityId, field, step) => {
    onUserChange({
      ...user,
      activities: user.activities.map((activity) => (
        activity.id === activityId
          ? { ...activity, [field]: Math.max((Number(activity[field]) || 0) + step, 0) }
          : activity
      ))
    });
  };

  const handleQuickAdd = () => {
    if (!focus) return;
    onUserChange({
      ...user,
      activities: user.activities.map((activity) => {
        if (activity.id === focus.id) {
          return {
            ...activity,
            loggedCount: activity.loggedCount + 1
          };
        }
        return activity;
      })
    });
  };

  const handleAddHabit = () => {
    if (!canAddActivity(user)) {
      Alert.alert('Habit limit reached', 'You can track up to 3 habits. Switch focus to master a different one.');
      return;
    }

    const next = addActivity(user, `Supplementary ${user.activities.length + 1}`);
    onUserChange(next);
  };

  const handleSetFocus = (activityId) => {
    const next = switchFocusActivity(user, activityId);
    onUserChange(next);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.bgBase || '#1d1a46' }]}>
      <AmbientGlow theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeInView>
          <GlassSurface style={styles.heroCard} radius={glass.radius.xl} fillColor={glass.colors.panelStrong}>
            <Text style={styles.greeting}>{getGreeting()}, {user.name}</Text>
            <Text style={styles.displayName}>
              {dayPercent}% complete today. {focus?.name || 'Your focus habit'} drives the mastery score, while supplementary habits stay active below so you can still practice them.
            </Text>
          </GlassSurface>
        </FadeInView>

        <View style={styles.statGrid}>
          <FadeInView delay={60} style={{ flex: 1 }}>
            <GlassSurface style={styles.statCard} radius={18} fillColor={glass.colors.panel}>
              <Text style={styles.statLabel}>Streak</Text>
              <Text style={styles.statValue}>{user.streak || 0}d</Text>
            </GlassSurface>
          </FadeInView>
          <FadeInView delay={120} style={{ flex: 1 }}>
            <GlassSurface style={styles.statCard} radius={18} fillColor={glass.colors.panel}>
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statValue}>{completedActivities}/{trackableTotal}</Text>
            </GlassSurface>
          </FadeInView>
          <FadeInView delay={180} style={{ flex: 1 }}>
            <GlassSurface style={styles.statCard} radius={18} fillColor={glass.colors.panel}>
              <Text style={styles.statLabel}>Today</Text>
              <Text style={styles.statValue}>{dayPercent}%</Text>
            </GlassSurface>
          </FadeInView>
        </View>

        <FadeInView delay={220}>
          <GlassSurface
            style={styles.coachSection}
            radius={22}
            fillColor={`${zone.color}16`}
            accentColor={zone.color}
            borderColor={`${zone.color}4d`}
          >
            <Text style={styles.coachHeading}>{coach.heading}</Text>
            <Text style={styles.coachKicker}>{coach.kicker}</Text>
            <Text style={styles.coachCopy}>{coach.copy}</Text>
          </GlassSurface>
        </FadeInView>

        <Text style={styles.sectionKicker}>ACTIVITIES</Text>
        <Text style={styles.activitiesTitle}>Master one habit at a time</Text>

        <GlassButton
          title={`+ Quick Add ${focus?.name || 'Focus Habit'}`}
          onPress={handleQuickAdd}
          style={styles.quickAddButton}
        />
        <GlassButton
          title={canAddActivity(user) ? '+ Add Supplementary Habit' : '3 Habit Limit Reached'}
          onPress={handleAddHabit}
          variant="secondary"
          style={styles.quickAddButton}
        />

        {user.activities.map((activity, index) => (
          <ActivityRow
            key={activity.id}
            activity={activity}
            onCountChange={(value) => handleActivityChange(activity.id, 'loggedCount', value)}
            onTimeChange={(value) => handleActivityChange(activity.id, 'timeLogged', value)}
            onIncrementCount={() => incrementActivity(activity.id, 'loggedCount', 1)}
            onIncrementTime={() => incrementActivity(activity.id, 'timeLogged', 10)}
            onSetFocus={() => handleSetFocus(activity.id)}
            animationDelay={280 + (index * 60)}
          />
        ))}

        {supplementary.length > 0 && (
          <Text style={styles.helperText}>
            Supplementary habits stay visible for support, but only your focus habit updates the mastery score.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
