import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FloatingGlyphs } from './FloatingGlyphs';
import { WaveBackdrop } from './WaveBackdrop';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none'
  }
});

export function AmbientGlow({ theme, mode = 'default' }) {
  return (
    <View style={styles.container}>
      <WaveBackdrop theme={theme} mode={mode} />
      <FloatingGlyphs color={theme?.accentStrong} glow={theme?.glow} />
    </View>
  );
}
