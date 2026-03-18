import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { glass } from '../theme/glass';

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none'
  },
  glyph: {
    position: 'absolute',
    fontWeight: '700',
    color: glass.colors.accentStrong,
    opacity: 0.2,
    textShadowColor: 'rgba(111, 217, 255, 0.55)',
    textShadowRadius: 10
  }
});

const GLYPHS = ['✦', '◈', '●', '◉', '◇', '✶'];

export function FloatingGlyphs({ color = glass.colors.accentStrong, glow = 'rgba(111, 217, 255, 0.55)' }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 4800,
        easing: Easing.linear,
        useNativeDriver: true
      })
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const items = useMemo(
    () => [
      { x: '8%', y: '84%', size: 12, delay: 0, drift: -32, glyph: GLYPHS[0] },
      { x: '24%', y: '76%', size: 10, delay: 0.14, drift: -48, glyph: GLYPHS[1] },
      { x: '48%', y: '88%', size: 9, delay: 0.26, drift: -28, glyph: GLYPHS[2] },
      { x: '63%', y: '79%', size: 11, delay: 0.38, drift: -44, glyph: GLYPHS[3] },
      { x: '79%', y: '70%', size: 13, delay: 0.52, drift: -52, glyph: GLYPHS[4] },
      { x: '86%', y: '88%', size: 9, delay: 0.7, drift: -30, glyph: GLYPHS[5] }
    ],
    []
  );

  return (
    <View style={styles.layer}>
      {items.map((item, index) => {
        const phase = Animated.modulo(Animated.add(anim, item.delay), 1);
        const translateY = phase.interpolate({
          inputRange: [0, 1],
          outputRange: [0, item.drift]
        });
        const translateX = phase.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 4, -3]
        });
        const opacity = phase.interpolate({
          inputRange: [0, 0.2, 0.7, 1],
          outputRange: [0, 0.23, 0.18, 0]
        });

        return (
          <Animated.Text
            key={index}
            style={[
              styles.glyph,
              {
                left: item.x,
                top: item.y,
                fontSize: item.size,
                color,
                textShadowColor: glow,
                opacity,
                transform: [{ translateY }, { translateX }]
              }
            ]}
          >
            {item.glyph}
          </Animated.Text>
        );
      })}
    </View>
  );
}
