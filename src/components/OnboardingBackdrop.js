import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const AnimatedFA = Animated.createAnimatedComponent(FontAwesome5);

const ICONS = [
  'book-reader',
  'running',
  'dumbbell',
  'brain',
  'clock',
  'calendar-check',
  'seedling',
  'bullseye',
  'chart-line'
];

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none'
  },
  item: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconShell: {
    width: 32,
    height: 32,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(168, 225, 255, 0.2)',
    backgroundColor: 'rgba(140, 190, 240, 0.06)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 999,
    left: 9,
    top: 9,
    backgroundColor: 'rgba(184, 242, 255, 0.9)',
    shadowColor: '#89e7ff',
    shadowOpacity: 0.34,
    shadowRadius: 10
  }
});

function FloatingItem({ item }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: item.duration,
        easing: Easing.linear,
        useNativeDriver: true
      })
    );
    loop.start();
    return () => loop.stop();
  }, [item.duration, t]);

  const translateY = t.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -item.travel]
  });

  const swayX = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 10, -8]
  });

  const emojiOpacity = t.interpolate({
    inputRange: [0, 0.55, 0.78, 1],
    outputRange: [0.28, 0.28, 0.08, 0]
  });

  const orbOpacity = t.interpolate({
    inputRange: [0, 0.35, 0.62, 1],
    outputRange: [0, 0, 0.58, 0]
  });

  const iconOpacity = t.interpolate({
    inputRange: [0, 0.2, 0.85, 1],
    outputRange: [0.24, 0.42, 0.2, 0]
  });

  return (
    <Animated.View
      style={[
        styles.item,
        {
          left: item.left,
          top: item.top,
          transform: [{ translateY }, { translateX: swayX }]
        }
      ]}
    >
      <View style={styles.iconShell}>
        <AnimatedFA
          name={item.icon}
          size={item.size}
          solid
          style={{ opacity: Animated.multiply(emojiOpacity, iconOpacity) }}
          color={item.color}
        />
      </View>
      <Animated.View style={[styles.orb, { opacity: orbOpacity }]} />
    </Animated.View>
  );
}

export function OnboardingBackdrop({ theme }) {
  const iconColor = theme?.accentStrong || 'rgba(191, 238, 255, 0.78)';

  const items = useMemo(() => (
    new Array(18).fill(null).map((_, idx) => ({
      icon: ICONS[idx % ICONS.length],
      left: `${6 + ((idx * 12) % 84)}%`,
      top: `${58 + ((idx * 9) % 36)}%`,
      size: 14 + (idx % 3) * 2,
      duration: 2600 + (idx % 5) * 280,
      travel: 210 + (idx % 7) * 24,
      color: iconColor
    }))
  ), [iconColor]);

  return (
    <View style={styles.layer}>
      {items.map((item, idx) => (
        <FloatingItem key={idx} item={item} />
      ))}
    </View>
  );
}
