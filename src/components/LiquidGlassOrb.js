import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { getZoneConfig } from '../lib/reptrak';
import { glass } from '../theme/glass';

const ORB_SIZE = 220;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  orb: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    ...glass.shadow.soft
  },
  gloss: {
    position: 'absolute',
    left: 26,
    top: 22,
    width: 120,
    height: 28,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.36)',
    transform: [{ rotate: '-14deg' }]
  },
  liquidFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  wave: {
    position: 'absolute',
    top: -18,
    left: -22,
    width: ORB_SIZE + 44,
    height: 38,
    borderRadius: 24
  },
  waveTwo: {
    top: -14,
    left: -30,
    opacity: 0.35
  },
  center: {
    position: 'absolute',
    left: 40,
    top: 40,
    right: 40,
    bottom: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.34)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  percent: {
    fontSize: 43,
    lineHeight: 46,
    letterSpacing: -1.2,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: glass.colors.textSoft
  }
});

export function LiquidGlassOrb({ percent, onPress }) {
  const zone = getZoneConfig(percent);
  const fillAnim = useRef(new Animated.Value(percent)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: percent,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start();
  }, [fillAnim, percent]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 1700,
        easing: Easing.linear,
        useNativeDriver: true
      })
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [waveAnim]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true })
    ]).start();
  };

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, ORB_SIZE]
  });

  const waveTranslateX = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 18]
  });

  const shakeTranslateX = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-7, 0, 7]
  });

  return (
    <Pressable
      onPress={() => {
        triggerShake();
        if (onPress) onPress();
      }}
      style={styles.wrapper}
    >
      <Animated.View style={[styles.orb, { transform: [{ translateX: shakeTranslateX }] }]}>
        <View style={styles.gloss} />

        <Animated.View
          style={[
            styles.liquidFill,
            {
              height: fillHeight,
              backgroundColor: percent >= 100 ? '#36aaff' : zone.color
            }
          ]}
        >
          <Animated.View
            style={[
              styles.wave,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                transform: [{ translateX: waveTranslateX }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.wave,
              styles.waveTwo,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                transform: [{ translateX: Animated.multiply(waveTranslateX, -1) }]
              }
            ]}
          />
        </Animated.View>

        <View style={styles.center}>
          <Text style={styles.percent}>{percent}%</Text>
          <Text style={styles.label}>TODAY SUMMARY</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

