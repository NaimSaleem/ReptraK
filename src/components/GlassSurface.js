import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { glass } from '../theme/glass';

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    borderWidth: 1,
    ...glass.shadow.soft
  },
  blur: {
    ...StyleSheet.absoluteFillObject
  },
  highlight: {
    position: 'absolute',
    left: 1,
    right: 1,
    top: 1,
    height: '42%'
  },
  tint: {
    ...StyleSheet.absoluteFillObject
  },
  edgeSheen: {
    ...StyleSheet.absoluteFillObject
  },
  innerStroke: {
    position: 'absolute',
    left: 2,
    right: 2,
    top: 2,
    bottom: 2,
    borderWidth: 1
  }
});

export function GlassSurface({
  children,
  style,
  radius = glass.radius.xl,
  intensity = 28,
  tint = 'dark',
  borderColor = glass.colors.borderSoft,
  fillColor = glass.colors.panelDeep,
  accentColor = glass.colors.accent
}) {
  return (
    <View
      style={[
        styles.shell,
        {
          borderRadius: radius,
          borderColor,
          backgroundColor: fillColor
        },
        style
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[styles.blur, { borderRadius: radius }]}
      />
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.24)',
          'rgba(255, 255, 255, 0.12)',
          'rgba(255, 255, 255, 0.03)'
        ]}
        locations={[0, 0.36, 1]}
        style={[
          styles.highlight,
          {
            borderTopLeftRadius: radius - 1,
            borderTopRightRadius: radius - 1
          }
        ]}
      />
      <LinearGradient
        colors={[
          `${accentColor}22`,
          'rgba(63, 81, 150, 0.12)',
          'rgba(7, 10, 28, 0.26)'
        ]}
        locations={[0, 0.45, 1]}
        style={[styles.tint, { borderRadius: radius }]}
      />
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.08)',
          'rgba(255, 255, 255, 0)',
          'rgba(255, 255, 255, 0.06)'
        ]}
        locations={[0, 0.42, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.edgeSheen, { borderRadius: radius }]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.innerStroke,
          {
            borderRadius: radius - 2,
            borderColor: glass.colors.borderInner
          }
        ]}
      />
      {children}
    </View>
  );
}
