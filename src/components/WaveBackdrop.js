import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden'
  },
  baseTint: {
    ...StyleSheet.absoluteFillObject
  },
  wave: {
    position: 'absolute',
    overflow: 'hidden'
  },
  fill: {
    ...StyleSheet.absoluteFillObject
  },
  line: {
    position: 'absolute',
    left: -80,
    right: -80,
    height: 2,
    borderRadius: 999
  }
});

function WaveBand({ config }) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: config.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [config.duration, drift]);

  const translateX = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [config.startX, config.endX]
  });
  const translateY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.floatY]
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wave,
        {
          width: config.width,
          height: config.height,
          top: config.top,
          left: config.left,
          opacity: config.opacity,
          borderRadius: config.height / 2,
          transform: [
            { translateX },
            { translateY },
            { rotate: `${config.rotate}deg` }
          ]
        }
      ]}
    >
      <LinearGradient
        colors={config.colors}
        start={{ x: 0, y: 0.1 }}
        end={{ x: 1, y: 0.95 }}
        style={styles.fill}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.line, { top: 22 }]}
      />
    </Animated.View>
  );
}

export function WaveBackdrop({ theme }) {
  const accent = theme?.accent || '#6FD9FF';
  const accentStrong = theme?.accentStrong || '#9BEFFF';

  const waves = [
    {
      width: 448,
      height: 170,
      top: -8,
      left: -104,
      rotate: -11,
      startX: -16,
      endX: 18,
      floatY: 14,
      duration: 6200,
      opacity: 0.48,
      colors: ['rgba(255,255,255,0.12)', `${accentStrong}40`, 'rgba(92, 124, 205, 0.12)']
    },
    {
      width: 536,
      height: 192,
      top: '39%',
      left: -148,
      rotate: 8,
      startX: 12,
      endX: -22,
      floatY: -12,
      duration: 7600,
      opacity: 0.34,
      colors: [`${accent}30`, 'rgba(96, 131, 220, 0.18)', 'rgba(255,255,255,0.05)']
    },
    {
      width: 410,
      height: 154,
      top: '66%',
      left: 72,
      rotate: -15,
      startX: -10,
      endX: 16,
      floatY: 12,
      duration: 6900,
      opacity: 0.28,
      colors: ['rgba(255,255,255,0.08)', `${accentStrong}30`, 'rgba(69, 90, 170, 0.1)']
    },
    {
      width: 316,
      height: 128,
      top: '18%',
      left: '52%',
      rotate: -6,
      startX: 4,
      endX: -12,
      floatY: 8,
      duration: 5800,
      opacity: 0.23,
      colors: ['rgba(255,255,255,0.08)', `${accent}26`, 'rgba(255,255,255,0.02)']
    }
  ];

  return (
    <View style={styles.layer} pointerEvents="none">
      <LinearGradient
        colors={[
          'rgba(123, 164, 242, 0.18)',
          'rgba(97, 121, 214, 0.1)',
          'rgba(255,255,255,0.02)'
        ]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.baseTint}
      />
      {waves.map((wave, index) => (
        <WaveBand key={index} config={wave} />
      ))}
    </View>
  );
}
