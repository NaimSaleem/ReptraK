import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const ICONS = ['⚽', '🏀', '🎾', '🏓', '🏃', '🏋️', '🚴', '🥋', '⛳'];

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none'
  },
  item: {
    position: 'absolute'
  },
  emoji: {
    color: 'rgba(225, 247, 255, 0.34)'
  },
  orb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 999,
    left: 5,
    top: 5,
    backgroundColor: 'rgba(184, 242, 255, 0.9)',
    shadowColor: '#89e7ff',
    shadowOpacity: 0.35,
    shadowRadius: 12
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
    inputRange: [0, 0.4, 0.65, 1],
    outputRange: [0, 0, 0.48, 0]
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
      <Animated.Text style={[styles.emoji, { fontSize: item.size, opacity: emojiOpacity }]}>
        {item.icon}
      </Animated.Text>
      <Animated.View style={[styles.orb, { opacity: orbOpacity }]} />
    </Animated.View>
  );
}

export function OnboardingBackdrop() {
  const items = useMemo(() => (
    new Array(20).fill(null).map((_, idx) => ({
      icon: ICONS[idx % ICONS.length],
      left: `${4 + ((idx * 13) % 86)}%`,
      top: `${62 + ((idx * 7) % 30)}%`,
      size: 20 + (idx % 4) * 4,
      duration: 3800 + (idx % 6) * 420,
      travel: 260 + (idx % 8) * 26
    }))
  ), []);

  return (
    <View style={styles.layer}>
      {items.map((item, idx) => (
        <FloatingItem key={idx} item={item} />
      ))}
    </View>
  );
}
