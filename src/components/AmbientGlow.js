import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FloatingGlyphs } from './FloatingGlyphs';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none'
  },
  orb: {
    position: 'absolute',
    borderRadius: 999
  },
  topLeft: {
    width: 320,
    height: 320,
    left: -100,
    top: -84,
    backgroundColor: 'rgba(160, 235, 255, 0.24)'
  },
  topCenter: {
    width: 220,
    height: 220,
    left: '32%',
    top: -95,
    backgroundColor: 'rgba(140, 164, 255, 0.16)'
  },
  bottomRight: {
    width: 260,
    height: 260,
    right: -84,
    bottom: 100,
    backgroundColor: 'rgba(111, 217, 255, 0.12)'
  },
  bottomLeft: {
    width: 240,
    height: 240,
    left: -100,
    bottom: -40,
    backgroundColor: 'rgba(26, 58, 133, 0.22)'
  }
});

export function AmbientGlow({ theme }) {
  const topLeftColor = theme?.glow || 'rgba(160, 235, 255, 0.24)';
  const topCenterColor = theme?.id === 'sunset' ? 'rgba(255, 185, 156, 0.17)' : 'rgba(140, 164, 255, 0.16)';
  const bottomRightColor = theme?.id === 'mint' ? 'rgba(116, 255, 205, 0.12)' : 'rgba(111, 217, 255, 0.12)';
  const bottomLeftColor = 'rgba(26, 58, 133, 0.22)';

  return (
    <View style={styles.container}>
      <View style={[styles.orb, styles.topLeft, { backgroundColor: topLeftColor }]} />
      <View style={[styles.orb, styles.topCenter, { backgroundColor: topCenterColor }]} />
      <View style={[styles.orb, styles.bottomRight, { backgroundColor: bottomRightColor }]} />
      <View style={[styles.orb, styles.bottomLeft, { backgroundColor: bottomLeftColor }]} />
      <FloatingGlyphs color={theme?.accentStrong} glow={theme?.glow} />
    </View>
  );
}
