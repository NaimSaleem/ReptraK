import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { AppIcon } from './AppIcon';

const ICONS = [
  'book',
  'motion',
  'dumbbell',
  'brain',
  'clock',
  'calendar-check',
  'seedling',
  'target',
  'chart'
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
    justifyContent: 'center',
    opacity: 0.9
  },
  iconWrap: {
    shadowColor: '#6FD9FF',
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 }
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

  const iconOpacity = t.interpolate({
    inputRange: [0, 0.2, 0.85, 1],
    outputRange: [0.14, 0.42, 0.2, 0]
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
      <Animated.View style={[styles.iconWrap, { opacity: Animated.multiply(emojiOpacity, iconOpacity) }]}>
        <AppIcon
          name={item.icon}
          size={item.size}
          color={item.color}
          strokeWidth={1.9}
        />
      </Animated.View>
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
      size: 20 + (idx % 3) * 2,
      duration: 1850 + (idx % 5) * 170,
      travel: 170 + (idx % 7) * 18,
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
