import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export function ScreenTransitionView({
  children,
  style,
  axis = 'x',
  distance = 18,
  duration = 420,
  scaleFrom = 0.986
}) {
  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(distance)).current;
  const scale = useRef(new Animated.Value(scaleFrom)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: isFocused ? 1 : 0.88,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(translate, {
        toValue: isFocused ? 0 : axis === 'x' ? -8 : -10,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(scale, {
        toValue: isFocused ? 1 : 0.992,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      })
    ]).start();
  }, [axis, duration, isFocused, opacity, scale, translate]);

  return (
    <Animated.View
      style={[
        { flex: 1, opacity },
        style,
        {
          transform: [
            axis === 'y'
              ? { translateY: translate }
              : { translateX: translate },
            { scale }
          ]
        }
      ]}
    >
      {children}
    </Animated.View>
  );
}
