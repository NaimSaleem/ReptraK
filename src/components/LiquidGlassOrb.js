import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
    borderColor: 'rgba(255, 255, 255, 0.26)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    ...glass.shadow.soft
  },
  blur: {
    ...StyleSheet.absoluteFillObject
  },
  orbTone: {
    ...StyleSheet.absoluteFillObject
  },
  softHighlight: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: 18,
    height: 84,
    borderRadius: 999
  },
  rim: {
    position: 'absolute',
    left: 2,
    right: 2,
    top: 2,
    bottom: 2,
    borderRadius: ORB_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)'
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
    left: 34,
    top: 34,
    right: 34,
    bottom: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  percent: {
    fontSize: 43,
    lineHeight: 46,
    letterSpacing: -1.2,
    fontWeight: '800',
    color: glass.colors.textMain,
    textShadowColor: 'rgba(4, 9, 23, 0.45)',
    textShadowRadius: 12
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
        <BlurView intensity={34} tint="dark" style={styles.blur} />
        <LinearGradient
          colors={['rgba(240, 249, 255, 0.18)', 'rgba(111, 170, 255, 0.08)', 'rgba(13, 18, 47, 0.2)']}
          locations={[0, 0.46, 1]}
          style={styles.orbTone}
        />
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.24)', 'rgba(255, 255, 255, 0.04)']}
          locations={[0, 1]}
          style={styles.softHighlight}
        />
        <View style={styles.rim} />

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
          <BlurView intensity={20} tint="light" style={styles.blur} />
          <Text style={styles.percent}>{percent}%</Text>
          <Text style={styles.label}>TODAY SUMMARY</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
