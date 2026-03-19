import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from './AppIcon';
import { glass } from '../theme/glass';

const ROUTE_ICONS = {
  Home: 'home',
  Calendar: 'calendar',
  Profile: 'profile',
  Premium: 'premium'
};

const TAB_SIZE = 58;
const DOCK_PADDING = 10;

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 0,
    alignItems: 'center'
  },
  dock: {
    width: '100%',
    maxWidth: 344,
    minHeight: 82,
    justifyContent: 'center',
    paddingHorizontal: DOCK_PADDING + 2,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(233, 245, 255, 0.13)',
    overflow: 'hidden'
  },
  dockBlur: {
    ...StyleSheet.absoluteFillObject
  },
  dockTone: {
    ...StyleSheet.absoluteFillObject
  },
  dockHighlight: {
    position: 'absolute',
    left: 1,
    right: 1,
    top: 1,
    height: '44%',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999
  },
  dockInnerStroke: {
    position: 'absolute',
    left: 2,
    right: 2,
    top: 2,
    bottom: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: glass.colors.borderInner
  },
  tabRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  tabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeOrb: {
    position: 'absolute',
    top: 10,
    width: TAB_SIZE,
    height: TAB_SIZE,
    borderRadius: 999,
    overflow: 'hidden'
  },
  activeOrbBlur: {
    ...StyleSheet.absoluteFillObject
  },
  activeOrbTone: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999
  },
  activeOrbHighlight: {
    position: 'absolute',
    left: 1,
    right: 1,
    top: 1,
    height: '48%',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999
  },
  activeOrbStroke: {
    position: 'absolute',
    left: 1.5,
    right: 1.5,
    top: 1.5,
    bottom: 1.5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)'
  },
  tabButton: {
    width: TAB_SIZE,
    height: TAB_SIZE,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  tabHalo: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: 'rgba(169, 237, 255, 0.1)'
  }
});

function TabButton({ route, isFocused, onPress, onLongPress, theme }) {
  const emphasis = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(emphasis, {
      toValue: isFocused ? 1 : 0,
      damping: 18,
      stiffness: 210,
      mass: 0.78,
      useNativeDriver: true
    }).start();
  }, [emphasis, isFocused]);

  const scale = emphasis.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06]
  });
  const translateY = emphasis.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1.5]
  });
  const haloOpacity = emphasis.interpolate({
    inputRange: [0, 1],
    outputRange: [0.05, 0.52]
  });
  const haloScale = emphasis.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1]
  });

  const iconColor = isFocused ? theme?.accentStrong || '#9BEFFF' : 'rgba(232, 242, 255, 0.66)';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        Animated.spring(pressScale, {
          toValue: 0.93,
          damping: 18,
          stiffness: 280,
          mass: 0.5,
          useNativeDriver: true
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(pressScale, {
          toValue: 1,
          damping: 16,
          stiffness: 260,
          mass: 0.5,
          useNativeDriver: true
        }).start();
      }}
      style={{ borderRadius: 999 }}
    >
      <Animated.View
        style={[
          styles.tabButton,
          {
            transform: [{ translateY }, { scale }, { scale: pressScale }]
          }
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.tabHalo,
            {
              opacity: haloOpacity,
              transform: [{ scale: haloScale }]
            }
          ]}
        />
        <AppIcon
          name={ROUTE_ICONS[route.name] || 'spark'}
          size={29}
          color={iconColor}
          filled={isFocused}
          strokeWidth={2}
        />
      </Animated.View>
    </Pressable>
  );
}

export function LiquidTabBar({ state, descriptors, navigation, theme }) {
  const insets = useSafeAreaInsets();
  const entrance = useRef(new Animated.Value(0)).current;
  const indicatorX = useRef(new Animated.Value(0)).current;
  const [dockWidth, setDockWidth] = useState(0);

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, [entrance]);

  useEffect(() => {
    if (!dockWidth) return;

    const slotWidth = (dockWidth - (DOCK_PADDING * 2)) / state.routes.length;
    const targetX = DOCK_PADDING + (slotWidth * state.index) + ((slotWidth - TAB_SIZE) / 2);

    Animated.spring(indicatorX, {
      toValue: targetX,
      damping: 18,
      stiffness: 220,
      mass: 0.82,
      useNativeDriver: true
    }).start();
  }, [dockWidth, indicatorX, state.index, state.routes.length]);

  return (
    <Animated.View
      style={[
        styles.shell,
        {
          paddingBottom: Math.max(insets.bottom, 12),
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [28, 0]
              })
            }
          ]
        }
      ]}
    >
      <View
        style={styles.dock}
        onLayout={(event) => setDockWidth(event.nativeEvent.layout.width)}
      >
        <BlurView intensity={26} tint="dark" style={styles.dockBlur} />
        <LinearGradient
          colors={['rgba(240, 248, 255, 0.1)', 'rgba(72, 104, 170, 0.1)', 'rgba(12, 16, 44, 0.18)']}
          locations={[0, 0.4, 1]}
          style={styles.dockTone}
        />
        <LinearGradient
          colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.02)']}
          style={styles.dockHighlight}
        />
        <View pointerEvents="none" style={styles.dockInnerStroke} />

        {!!dockWidth && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeOrb,
              {
                transform: [{ translateX: indicatorX }]
              }
            ]}
          >
            <BlurView intensity={24} tint="light" style={styles.activeOrbBlur} />
            <LinearGradient
              colors={[
                'rgba(244, 253, 255, 0.38)',
                `${theme?.accentStrong || '#A9EDFF'}44`,
                `${theme?.accent || '#6FD9FF'}1d`
              ]}
              locations={[0, 0.48, 1]}
              style={styles.activeOrbTone}
            />
            <LinearGradient
              colors={['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.02)']}
              style={styles.activeOrbHighlight}
            />
            <View style={styles.activeOrbStroke} />
          </Animated.View>
        )}

        <View style={styles.tabRow}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const { options } = descriptors[route.key];

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key
              });
            };

            return (
              <View key={route.key} style={styles.tabSlot}>
                <TabButton
                  route={route}
                  isFocused={isFocused}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  theme={theme}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                />
              </View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}
