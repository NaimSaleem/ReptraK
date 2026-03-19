import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { AmbientGlow } from './AmbientGlow';
import { FadeInView } from './FadeInView';
import { BrandLockup } from './BrandLogo';
import { OnboardingBackdrop } from './OnboardingBackdrop';
import { glass } from '../theme/glass';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1e4e',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  content: {
    alignItems: 'center',
    gap: 16
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    color: glass.colors.textSoft
  },
  foot: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 0.9,
    fontWeight: '800',
    color: 'rgba(217, 242, 255, 0.72)'
  }
});

export function LoadingScreen({ theme, message = 'Warming up your habit arena!' }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.bgBase || '#1b1e4e' }]}>
      <AmbientGlow theme={theme} mode="loading" />
      <OnboardingBackdrop theme={theme} />
      <View style={styles.content}>
        <FadeInView delay={80} distance={20}>
          <BrandLockup wordmarkWidth={184} wordmarkHeight={48} />
        </FadeInView>
        <FadeInView delay={160} distance={16}>
          <Text style={styles.subtitle}>{message}</Text>
          <Text style={styles.foot}>Never miss a beat!</Text>
        </FadeInView>
      </View>
    </SafeAreaView>
  );
}
