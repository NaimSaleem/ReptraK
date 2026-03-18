import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { getActivityPercent } from '../lib/reptrak';
import { ZoneBadge } from './ZoneCard';
import { GlassSurface } from './GlassSurface';
import { glass } from '../theme/glass';

const styles = StyleSheet.create({
  activityRow: {
    borderRadius: 20,
    marginVertical: 8,
    overflow: 'hidden'
  },
  surface: {
    padding: 16
  },
  activityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14
  },
  activityInfo: {
    flex: 1,
    marginRight: 12,
    gap: 4
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  activityMeta: {
    fontSize: 12,
    color: glass.colors.textSoft,
    lineHeight: 17
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  roleTag: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8
  },
  roleHint: {
    fontSize: 11,
    color: glass.colors.textSoft
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 10
  },
  control: {
    flex: 1
  },
  controlLabel: {
    fontSize: 11,
    color: glass.colors.textSoft,
    marginBottom: 6,
    fontWeight: '700',
    letterSpacing: 0.35
  },
  controlInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: glass.colors.textMain,
    fontSize: 14,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12
  },
  actionPill: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(156, 241, 255, 0.26)',
    backgroundColor: 'rgba(156, 241, 255, 0.1)',
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionPillSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderColor: glass.colors.borderSoft
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  focusButton: {
    marginTop: 12,
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
  onIncrementCount,
  onIncrementTime,
  onSetFocus,
  showZone = false,
  editable = true,
  animationDelay = 0
}) {
  const percentValue = getActivityPercent(activity);
  const isFocus = activity.role === 'focus';
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        delay: animationDelay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 420,
        delay: animationDelay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      })
    ]).start();
  }, [animationDelay, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.activityRow,
        {
          opacity,
          transform: [{ translateY }]
        }
      ]}
    >
      <GlassSurface style={styles.surface} radius={20} fillColor={glass.colors.panelDeep}>
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
                <Text style={styles.roleHint}>support habit, logged separately from mastery</Text>
              )}
            </View>
          </View>
          <ZoneBadge percent={percentValue} />
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.control}>
            <Text style={styles.controlLabel}>Practice reps</Text>
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
            <Text style={styles.controlLabel}>Time logged</Text>
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

        {editable && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionPill}
              onPress={onIncrementCount}
            >
              <Text style={styles.actionPillText}>+1 Practice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionPill, styles.actionPillSecondary]}
              onPress={onIncrementTime}
            >
              <Text style={styles.actionPillText}>+10 min</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isFocus && onSetFocus && (
          <TouchableOpacity style={styles.focusButton} onPress={onSetFocus}>
            <Text style={styles.focusButtonText}>Set as Focus</Text>
          </TouchableOpacity>
        )}
      </GlassSurface>
    </Animated.View>
  );
}
