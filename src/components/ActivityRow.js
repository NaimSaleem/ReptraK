import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { getActivityPercent } from '../lib/reptrak';
import { ZoneBadge } from './ZoneCard';
import { glass } from '../theme/glass';

const styles = StyleSheet.create({
  activityRow: {
    backgroundColor: glass.colors.panel,
    borderRadius: 20,
    padding: 18,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    ...glass.shadow.soft
  },
  activityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  activityInfo: {
    flex: 1,
    marginRight: 12
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: glass.colors.textMain,
    marginBottom: 4
  },
  activityMeta: {
    fontSize: 12,
    color: glass.colors.textSoft
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 12
  },
  control: {
    flex: 1
  },
  controlLabel: {
    fontSize: 11,
    color: glass.colors.textSoft,
    marginBottom: 4,
    fontWeight: '500'
  },
  controlInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 12,
    color: glass.colors.textMain,
    fontSize: 14,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft
  }
});

export function ActivityRow({
  activity,
  onCountChange,
  onTimeChange,
  showZone = false,
  editable = true
}) {
  const percentValue = getActivityPercent(activity);

  return (
    <View style={styles.activityRow}>
      <View style={styles.activityTop}>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{activity.name}</Text>
          <Text style={styles.activityMeta}>
            {activity.loggedCount}/{activity.targetCount} reps
            {activity.timeGoal ? ` · ${activity.timeLogged}/${activity.timeGoal} min` : ' · time optional'}
            {showZone ? ' · view zone' : ''}
          </Text>
        </View>
        <ZoneBadge percent={percentValue} />
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.control}>
          <Text style={styles.controlLabel}>Count</Text>
          <TextInput
            style={styles.controlInput}
            keyboardType="numeric"
            value={String(activity.loggedCount)}
            onChangeText={onCountChange}
            editable={editable}
            selectTextOnFocus={editable}
            placeholder="0"
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
          />
        </View>
        <View style={styles.control}>
          <Text style={styles.controlLabel}>Time (min)</Text>
          <TextInput
            style={styles.controlInput}
            keyboardType="numeric"
            value={String(activity.timeLogged)}
            onChangeText={onTimeChange}
            editable={editable}
            selectTextOnFocus={editable}
            placeholder="0"
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
          />
        </View>
      </View>
    </View>
  );
}
