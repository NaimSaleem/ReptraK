import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {
  getCompletedActivityCount,
  getDayPercent,
  getFocusActivity,
  getProfileContent,
  getTrackableActivities
} from '../lib/reptrak';
import { getNotificationPreview } from '../lib/notifications';
import { ActivityRow } from '../components/ActivityRow';
import { AmbientGlow } from '../components/AmbientGlow';
import { AppIcon } from '../components/AppIcon';
import { FadeInView } from '../components/FadeInView';
import { GlassButton } from '../components/GlassButton';
import { GlassSurface } from '../components/GlassSurface';
import { LiquidGlassOrb } from '../components/LiquidGlassOrb';
import { ReptraKWordmark } from '../components/BrandLogo';
import { ScreenTransitionView } from '../components/ScreenTransitionView';
import { glass } from '../theme/glass';
import { layout } from '../theme/layout';
import { THEMES } from '../theme/palette';

const REMINDER_TIMES = ['7:00 AM', '12:00 PM', '6:30 PM', '8:00 PM'];
const REMINDER_TONES = ['Coach', 'Calm', 'Push'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1a46'
  },
  scrollContent: {
    paddingHorizontal: layout.appHorizontalPadding,
    paddingVertical: layout.appVerticalPadding,
    paddingBottom: 152
  },
  header: {
    marginBottom: 16,
    gap: 10
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: glass.colors.textSoft
  },
  orbWrap: {
    alignItems: 'center',
    marginBottom: 18
  },
  card: {
    padding: 18,
    marginBottom: 16,
    gap: 10
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  sectionCopy: {
    fontSize: 13,
    lineHeight: 20,
    color: glass.colors.textSoft
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)'
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
    fontWeight: '800',
    color: glass.colors.textMain
  },
  fieldLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    fontWeight: '800',
    color: glass.colors.textSoft
  },
  inputWrap: {
    minHeight: 54,
    paddingHorizontal: 14,
    justifyContent: 'center'
  },
  input: {
    color: glass.colors.textMain,
    fontSize: 17,
    fontWeight: '700'
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  optionButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    backgroundColor: 'rgba(255,255,255,0.06)'
  },
  optionButtonActive: {
    borderColor: 'rgba(169, 237, 255, 0.5)',
    backgroundColor: 'rgba(111, 217, 255, 0.18)'
  },
  optionText: {
    fontSize: 12,
    fontWeight: '800',
    color: glass.colors.textSoft
  },
  optionTextActive: {
    color: '#13203e'
  },
  previewCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 14,
    gap: 6
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  previewBody: {
    fontSize: 13,
    lineHeight: 19,
    color: glass.colors.textSoft
  },
  signoutButton: {
    marginTop: 4
  },
  activitiesTitle: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 17,
    fontWeight: '800',
    color: glass.colors.textMain
  }
});

export default function ProfileScreen({ user, onUserChange, onResetSession, theme }) {
  const [nameInput, setNameInput] = useState(user.name || '');
  const dayPercent = getDayPercent(user);
  const profile = getProfileContent(dayPercent);
  const completedActivities = getCompletedActivityCount(user);
  const focus = getFocusActivity(user);
  const trackableTotal = getTrackableActivities(user).length;
  const themeLabel = THEMES[user.theme]?.label || THEMES.aqua.label;
  const notificationPreview = getNotificationPreview(user);
  const accountCreated = new Date(user.accountCreatedAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  useEffect(() => {
    setNameInput(user.name || '');
  }, [user.name]);

  const updateNotificationSettings = (patch) => {
    onUserChange({
      ...user,
      notificationSettings: {
        ...user.notificationSettings,
        ...patch
      }
    });
  };

  const saveName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      Alert.alert('Name needed!', 'Give your account a name so the coaching can stay personal and fun!');
      return;
    }

    onUserChange({
      ...user,
      name: trimmed
    });
  };

  const confirmReset = () => {
    Alert.alert(
      'Sign out and erase this account?!',
      'This will remove the current local session, clear your reminders, and send you back to onboarding for a brand-new start!',
      [
        { text: 'Keep this account', style: 'cancel' },
        {
          text: 'Erase and sign out',
          style: 'destructive',
          onPress: onResetSession
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.bgBase || '#1d1a46' }]}>
      <AmbientGlow theme={theme} />
      <ScreenTransitionView axis="x">
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FadeInView style={styles.header}>
          <ReptraKWordmark width={154} height={40} />
          <Text style={styles.subtitle}>Tune your session, reminders, and reset controls right here!</Text>
        </FadeInView>

        <FadeInView style={styles.orbWrap} delay={60}>
          <LiquidGlassOrb percent={dayPercent} />
        </FadeInView>

        <FadeInView delay={100}>
          <GlassSurface style={styles.card} radius={20} fillColor={glass.colors.panelStrong}>
            <Text style={styles.sectionTitle}>{profile.headline}</Text>
            <Text style={styles.sectionCopy}>{profile.summary}</Text>
          </GlassSurface>
        </FadeInView>

        <FadeInView delay={140}>
          <GlassSurface style={styles.card} radius={20} fillColor={glass.colors.panel}>
            <Text style={styles.sectionTitle}>Profile snapshot!</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Current focus</Text>
              <Text style={styles.statValue}>{focus?.name || 'None yet'}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Streak</Text>
              <Text style={styles.statValue}>{user.streak || 0} days</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Today&apos;s completion</Text>
              <Text style={styles.statValue}>{dayPercent}%</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Green activities</Text>
              <Text style={styles.statValue}>{completedActivities}/{trackableTotal}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Theme</Text>
              <Text style={styles.statValue}>{themeLabel}</Text>
            </View>
            <View style={[styles.statRow, styles.statRowLast]}>
              <Text style={styles.statLabel}>Account start</Text>
              <Text style={styles.statValue}>{accountCreated}</Text>
            </View>
          </GlassSurface>
        </FadeInView>

        <FadeInView delay={180}>
          <GlassSurface style={styles.card} radius={20} fillColor={glass.colors.panelDeep}>
            <Text style={styles.sectionTitle}>Settings that actually do something!</Text>

            <Text style={styles.fieldLabel}>DISPLAY NAME</Text>
            <GlassSurface style={styles.inputWrap} radius={16} fillColor={glass.colors.panel}>
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Enter your name..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                style={styles.input}
              />
            </GlassSurface>
            <GlassButton title="Save Name!" onPress={saveName} />

            <Text style={styles.fieldLabel}>REMINDERS</Text>
            <View style={styles.optionRow}>
              {[
                { label: 'On!', value: true },
                { label: 'Off', value: false }
              ].map((option) => {
                const active = user.notificationSettings?.enabled === option.value;
                return (
                  <TouchableOpacity
                    key={option.label}
                    style={[styles.optionButton, active && styles.optionButtonActive]}
                    onPress={() => updateNotificationSettings({ enabled: option.value })}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>{option.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.fieldLabel}>REMINDER TIME</Text>
            <View style={styles.optionRow}>
              {REMINDER_TIMES.map((time) => {
                const active = user.notificationSettings?.reminderTime === time;
                return (
                  <TouchableOpacity
                    key={time}
                    style={[styles.optionButton, active && styles.optionButtonActive]}
                    onPress={() => updateNotificationSettings({ reminderTime: time })}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>{time}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.fieldLabel}>COACH TONE</Text>
            <View style={styles.optionRow}>
              {REMINDER_TONES.map((toneOption) => {
                const active = user.notificationSettings?.tone === toneOption;
                return (
                  <TouchableOpacity
                    key={toneOption}
                    style={[styles.optionButton, active && styles.optionButtonActive]}
                    onPress={() => updateNotificationSettings({ tone: toneOption })}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>{toneOption}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.previewCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <AppIcon name="bell" size={18} color={theme?.accentStrong || '#A9EDFF'} />
                <Text style={styles.previewTitle}>{notificationPreview.title}</Text>
              </View>
              <Text style={styles.previewBody}>{notificationPreview.body}</Text>
            </View>

            <GlassButton
              title="Sign Out and Erase Local Data"
              onPress={confirmReset}
              variant="secondary"
              style={styles.signoutButton}
            />
          </GlassSurface>
        </FadeInView>

        {!!user.focusArchive?.length && (
          <FadeInView delay={220}>
            <GlassSurface style={styles.card} radius={20} fillColor={glass.colors.panel}>
              <Text style={styles.sectionTitle}>Archived focus runs!</Text>
              {user.focusArchive.slice(0, 3).map((entry, index) => (
                <View key={entry.id || entry.switchedAt} style={[styles.statRow, index === 2 && styles.statRowLast]}>
                  <Text style={styles.statLabel}>{entry.name}</Text>
                  <Text style={styles.statValue}>{entry.finalPercent}%</Text>
                </View>
              ))}
            </GlassSurface>
          </FadeInView>
        )}

        <Text style={styles.activitiesTitle}>All activities</Text>
        {user.activities.map((activity, index) => (
          <View key={activity.id} style={{ opacity: 0.76 }}>
            <ActivityRow
              activity={activity}
              onCountChange={() => {}}
              onTimeChange={() => {}}
              editable={false}
              showZone={true}
              animationDelay={260 + (index * 50)}
            />
          </View>
        ))}
        </ScrollView>
      </ScreenTransitionView>
    </SafeAreaView>
  );
}
