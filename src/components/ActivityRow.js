import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
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
    overflow: 'hidden',
    ...glass.shadow.soft
  },
  rowGloss: {
    position: 'absolute',
    left: 1,
    right: 1,
    top: 1,
    height: '42%',
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
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
    color: glass.colors.textSoft,
    marginBottom: 6
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  roleTag: {
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4
  },
  roleHint: {
    fontSize: 10,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 12,
    color: glass.colors.textMain,
    fontSize: 14,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft
  },
  focusButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(156, 241, 255, 0.5)',
    backgroundColor: 'rgba(156, 241, 255, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  focusButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d7f9ff'
  }
});

export function ActivityRow({
  activity,
  onCountChange,
  onTimeChange,
  onSetFocus,
  showZone = false,
  editable = true
}) {
  const percentValue = getActivityPercent(activity);
  const isFocus = activity.role === 'focus';

  return (
    <View style={styles.activityRow}>
      <View pointerEvents="none" style={styles.rowGloss} />
      <View style={styles.activityTop}>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{activity.name}</Text>
          <Text style={styles.activityMeta}>
            {activity.loggedCount}/{activity.targetCount} reps
            {activity.timeGoal ? ` · ${activity.timeLogged}/${activity.timeGoal} min` : ' · time optional'}
            {showZone ? ' · view zone' : ''}
          </Text>
          <View style={styles.roleRow}>
            <View
              style={[
                styles.roleTag,
                isFocus
                  ? { borderColor: 'rgba(102, 196, 232, 0.64)', backgroundColor: 'rgba(102, 196, 232, 0.22)' }
                  : { borderColor: glass.colors.borderSoft, backgroundColor: 'rgba(255,255,255,0.09)' }
              ]}
            >
              <Text style={styles.roleTagText}>{isFocus ? 'FOCUS' : 'SUPPLEMENTARY'}</Text>
            </View>
            {!isFocus && (
              <Text style={styles.roleHint}>does not affect daily mastery score</Text>
            )}
          </View>
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

      {!isFocus && onSetFocus && (
        <TouchableOpacity style={styles.focusButton} onPress={onSetFocus}>
          <Text style={styles.focusButtonText}>Set as Focus</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
