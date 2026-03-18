import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { glass } from '../theme/glass';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...glass.shadow.soft
  },
  primaryButton: {
    backgroundColor: 'rgba(100, 172, 227, 0.18)',
    borderWidth: 1,
    borderColor: glass.colors.border
  },
  secondaryButton: {
    backgroundColor: 'rgba(164, 180, 228, 0.08)',
    borderWidth: 1,
    borderColor: glass.colors.borderSoft
  },
  blur: {
    ...StyleSheet.absoluteFillObject
  },
  tone: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999
  },
  topGlow: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    height: '52%',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999
  },
  innerStroke: {
    position: 'absolute',
    left: 2,
    right: 2,
    top: 2,
    bottom: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: glass.colors.borderInner
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.15,
    color: glass.colors.textMain
  },
  primaryText: {
    color: '#13203e'
  }
});

export function GlassButton({ title, onPress, variant = 'primary', style }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const buttonStyle = variant === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const textStyle = variant === 'primary' ? styles.primaryText : null;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 360,
        useNativeDriver: true
      })
    ]).start();
  }, [opacity, translateY]);

  const animateTo = (value) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      friction: 7,
      tension: 220
    }).start();
  };

  return (
    <Pressable
      style={[styles.wrapper, style]}
      onPressIn={() => animateTo(0.97)}
      onPressOut={() => animateTo(1)}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.button,
          buttonStyle,
          {
            opacity,
            transform: [{ translateY }, { scale }]
          }
        ]}
      >
        <BlurView intensity={22} tint="light" style={styles.blur} />
        <LinearGradient
          pointerEvents="none"
          colors={
            variant === 'primary'
              ? ['rgba(244, 253, 255, 0.56)', 'rgba(180, 228, 255, 0.18)', 'rgba(75, 132, 196, 0.22)']
              : ['rgba(255, 255, 255, 0.16)', 'rgba(176, 191, 231, 0.08)', 'rgba(42, 54, 98, 0.16)']
          }
          locations={[0, 0.45, 1]}
          style={styles.tone}
        />
        <LinearGradient
          pointerEvents="none"
          colors={
            variant === 'primary'
              ? [glass.colors.buttonPrimaryTop, 'rgba(255, 255, 255, 0.08)']
              : [glass.colors.buttonSecondaryTop, 'rgba(255, 255, 255, 0.02)']
          }
          locations={[0, 1]}
          style={styles.topGlow}
        />
        <View pointerEvents="none" style={styles.innerStroke} />
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}
