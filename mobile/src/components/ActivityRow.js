import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { getActivityPercent } from '../lib/reptrak';
import { ZoneBadge } from './ZoneCard';

const styles = StyleSheet.create({
  activityRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
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
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4
  },
  activityMeta: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)'
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
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
    fontWeight: '500'
  },
  controlInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 10,
    color: '#ffffff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  }
});

export function ActivityRow({ activity, onCountChange, onTimeChange, showZone = false }) {
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
            placeholder="0"
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
          />
        </View>
      </View>
    </View>
  );
}
