import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ZONES } from '../lib/reptrak';

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  }
});

export function ZoneBadge({ percent }) {
  const zone = ZONES[Object.keys(ZONES).find(key => {
    if (percent >= 100) return key === 'perfect';
    if (percent > 75) return key === 'complete';
    if (percent >= 50) return key === 'mid';
    return key === 'low';
  })];

  return (
    <View style={[styles.badge, { backgroundColor: zone.lightColor }]}>
      <Text style={[styles.badgeText, { color: zone.textColor }]}>
        {percent}%
      </Text>
    </View>
  );
}

export function ZoneLabel({ percent }) {
  const zone = ZONES[Object.keys(ZONES).find(key => {
    if (percent >= 100) return key === 'perfect';
    if (percent > 75) return key === 'complete';
    if (percent >= 50) return key === 'mid';
    return key === 'low';
  })];

  return <Text style={{ fontSize: 14, color: zone.color }}>{zone.label}</Text>;
}

export function LiquidButton({ percent, onPress }) {
  const zone = ZONES[Object.keys(ZONES).find(key => {
    if (percent >= 100) return key === 'perfect';
    if (percent > 75) return key === 'complete';
    if (percent >= 50) return key === 'mid';
    return key === 'low';
  })];

  const shift = Math.min(Math.max(100 - percent, 0), 100);

  return (
    <View
      style={[
        styles.liquidButton,
        {
          borderColor: zone.color,
          borderWidth: 2
        }
      ]}
      onTouchEnd={onPress}
    >
      <View
        style={[
          styles.liquidFill,
          {
            backgroundColor: zone.lightColor,
            height: `${shift}%`
          }
        ]}
      />
      <View style={styles.liquidLabel}>
        <Text style={[styles.liquidText, { color: zone.textColor }]}>
          {percent}% Complete
        </Text>
      </View>
    </View>
  );
}

const liquidStyles = StyleSheet.create({
  liquidButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  liquidFill: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  liquidLabel: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  liquidText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  }
});

Object.assign(styles, liquidStyles);
