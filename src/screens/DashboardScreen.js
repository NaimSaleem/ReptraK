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
import { GlassButton } from '../components/GlassButton';
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
    paddingBottom: 122
  },
  heroCard: {
    backgroundColor: glass.colors.panelStrong,
    borderRadius: glass.radius.xl,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    padding: 16,
    marginBottom: layout.sectionGap,
    overflow: 'hidden',
    ...glass.shadow.soft
  },
  heroGloss: {
    position: 'absolute',
    left: 2,
    right: 2,
    top: 2,
    height: '40%',
    borderTopLeftRadius: glass.radius.xl,
    borderTopRightRadius: glass.radius.xl,
    backgroundColor: glass.colors.glare
  },
  greeting: {
    fontSize: 33,
    lineHeight: 36,
    letterSpacing: -1,
    fontWeight: '800',
    color: glass.colors.textMain,
    marginBottom: 6
  },
  displayName: {
    fontSize: 12,
    color: glass.colors.textSoft,
    marginBottom: 20
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: layout.sectionGap
  },
  statCard: {
    flex: 1,
    backgroundColor: glass.colors.panel,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    overflow: 'hidden',
    ...glass.shadow.soft
  },
  statGloss: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    height: '50%',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.19)'
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
    marginBottom: layout.sectionGap,
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
  sectionKicker: {
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: '800',
    color: glass.colors.textSoft,
    marginBottom: 4
  },
  quickAddButton: {
    marginBottom: 14
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
        <View style={styles.heroCard}>
          <View pointerEvents="none" style={styles.heroGloss} />
          <Text style={styles.greeting}>{getGreeting()}, {user.name}</Text>
          <Text style={styles.displayName}>{dayPercent}% of your goals complete today</Text>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <View pointerEvents="none" style={styles.statGloss} />
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{user.streak || 0}d</Text>
          </View>
          <View style={styles.statCard}>
            <View pointerEvents="none" style={styles.statGloss} />
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{completedActivities}/{trackableTotal}</Text>
          </View>
          <View style={styles.statCard}>
            <View pointerEvents="none" style={styles.statGloss} />
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

        {user.activities.map((activity) => (
          <ActivityRow
            key={activity.id}
            activity={activity}
            onCountChange={(value) => handleActivityChange(activity.id, 'loggedCount', value)}
            onTimeChange={(value) => handleActivityChange(activity.id, 'timeLogged', value)}
            onSetFocus={() => handleSetFocus(activity.id)}
          />
        ))}

        {supplementary.length > 0 && (
          <Text style={{ color: glass.colors.textSoft, fontSize: 11, marginTop: 8 }}>
            Supplementary habits stay visible for support, but only your focus habit updates the mastery score.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
