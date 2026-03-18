import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
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
    backgroundColor: 'rgba(197, 250, 255, 0.32)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)'
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  gloss: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    height: '52%',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.32)'
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: glass.colors.textMain
  },
  primaryText: {
    color: '#13203e'
  }
});

export function GlassButton({ title, onPress, variant = 'primary', style }) {
  const scale = useRef(new Animated.Value(1)).current;
  const buttonStyle = variant === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const textStyle = variant === 'primary' ? styles.primaryText : null;

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
          { transform: [{ scale }] }
        ]}
      >
        <View pointerEvents="none" style={styles.gloss} />
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}
