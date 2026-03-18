import React from 'react';
import { View, StyleSheet } from 'react-native';

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
    width: 280,
    height: 280,
    left: -80,
    top: -70,
    backgroundColor: 'rgba(140, 233, 255, 0.25)'
  },
  bottomRight: {
    width: 240,
    height: 240,
    right: -70,
    bottom: 120,
    backgroundColor: 'rgba(111, 217, 255, 0.14)'
  }
});

export function AmbientGlow() {
  return (
    <View style={styles.container}>
      <View style={[styles.orb, styles.topLeft]} />
      <View style={[styles.orb, styles.bottomRight]} />
    </View>
  );
}

