import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

function IconPaths({ name, color, strokeWidth, filled }) {
  const commonProps = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none'
  };

  switch (name) {
    case 'home':
      return (
        <>
          <Path {...commonProps} d="M4 11.5L12 4.5L20 11.5" />
          <Path {...commonProps} d="M6.75 10.75V19H17.25V10.75" />
        </>
      );
    case 'calendar':
      return (
        <>
          <Rect {...commonProps} x="4" y="6" width="16" height="14" rx="3" />
          <Path {...commonProps} d="M4 10.5H20" />
          <Path {...commonProps} d="M8 4V8" />
          <Path {...commonProps} d="M16 4V8" />
          <Circle cx="9" cy="14.5" r="1" fill={filled ? color : 'none'} stroke={filled ? 'none' : color} />
          <Circle cx="12.5" cy="14.5" r="1" fill={filled ? color : 'none'} stroke={filled ? 'none' : color} />
          <Circle cx="16" cy="14.5" r="1" fill={filled ? color : 'none'} stroke={filled ? 'none' : color} />
        </>
      );
    case 'profile':
      return (
        <>
          <Circle {...commonProps} cx="12" cy="8.25" r="3.25" />
          <Path {...commonProps} d="M5 19C6.4 15.9 8.8 14.5 12 14.5C15.2 14.5 17.6 15.9 19 19" />
        </>
      );
    case 'premium':
      return (
        <>
          <Path {...commonProps} d="M12 4L18.5 8.75L12 20L5.5 8.75L12 4Z" />
          <Path {...commonProps} d="M8.2 9.2H15.8" />
        </>
      );
    case 'book':
      return (
        <>
          <Path {...commonProps} d="M5.5 6.5C5.5 5.4 6.4 4.5 7.5 4.5H18.5V18.75H8.25C6.73 18.75 5.5 17.52 5.5 16V6.5Z" />
          <Path {...commonProps} d="M8.5 7.75H15.75" />
          <Path {...commonProps} d="M8.5 11H15.75" />
          <Path {...commonProps} d="M8.5 14.25H13.75" />
        </>
      );
    case 'motion':
      return (
        <>
          <Circle {...commonProps} cx="15.5" cy="5.5" r="1.75" />
          <Path {...commonProps} d="M11.5 9L15 11L18.75 10" />
          <Path {...commonProps} d="M12 9.75L9 14.5L6 16" />
          <Path {...commonProps} d="M14.25 11.5L12.75 17.5" />
          <Path {...commonProps} d="M14.5 12L18.5 16" />
        </>
      );
    case 'dumbbell':
      return (
        <>
          <Path {...commonProps} d="M4.5 9V15" />
          <Path {...commonProps} d="M7 8V16" />
          <Path {...commonProps} d="M17 8V16" />
          <Path {...commonProps} d="M19.5 9V15" />
          <Path {...commonProps} d="M7 12H17" />
        </>
      );
    case 'brain':
      return (
        <>
          <Path {...commonProps} d="M9.2 7.2C9.2 5.7 10.35 4.5 11.85 4.5C12.9 4.5 13.85 5.08 14.35 5.98C14.8 5.55 15.45 5.3 16.15 5.3C17.58 5.3 18.75 6.47 18.75 7.9C18.75 8.3 18.66 8.67 18.48 9.01C19.33 9.46 19.9 10.35 19.9 11.38C19.9 12.47 19.26 13.43 18.32 13.84C18.38 14.08 18.42 14.33 18.42 14.6C18.42 16.42 16.94 17.9 15.12 17.9C14.82 17.9 14.53 17.86 14.26 17.79C13.72 18.85 12.63 19.55 11.38 19.55C9.59 19.55 8.14 18.1 8.14 16.31C8.14 16.07 8.17 15.84 8.21 15.61C7.05 15.2 6.22 14.09 6.22 12.79C6.22 11.83 6.68 10.98 7.39 10.44C7.13 10.01 6.98 9.5 6.98 8.95C6.98 7.38 8.26 6.1 9.83 6.1C10.08 6.1 10.32 6.13 10.54 6.2" />
          <Path {...commonProps} d="M12.1 8.3V15.8" />
          <Path {...commonProps} d="M9.75 10.35C10.65 10.35 11.4 9.6 11.4 8.7" />
          <Path {...commonProps} d="M14.4 9.3C15.3 9.3 16.05 10.05 16.05 10.95" />
          <Path {...commonProps} d="M14.25 14.85C15.06 14.85 15.72 14.19 15.72 13.38" />
        </>
      );
    case 'clock':
      return (
        <>
          <Circle {...commonProps} cx="12" cy="12" r="7.5" />
          <Path {...commonProps} d="M12 8V12.2L15 14.2" />
        </>
      );
    case 'calendar-check':
      return (
        <>
          <Rect {...commonProps} x="4" y="6" width="16" height="14" rx="3" />
          <Path {...commonProps} d="M4 10.5H20" />
          <Path {...commonProps} d="M8 4V8" />
          <Path {...commonProps} d="M16 4V8" />
          <Path {...commonProps} d="M8.5 15L10.75 17.1L15.5 12.5" />
        </>
      );
    case 'seedling':
      return (
        <>
          <Path {...commonProps} d="M12 19V11.5" />
          <Path {...commonProps} d="M12 13.25C9.2 13.25 7 10.95 7 8.1V7.25C9.8 7.25 12 9.55 12 12.4" />
          <Path {...commonProps} d="M12 12.2C12 9.15 14.35 6.8 17.4 6.8H18.25C18.25 9.85 15.9 12.2 12.85 12.2" />
        </>
      );
    case 'target':
      return (
        <>
          <Circle {...commonProps} cx="12" cy="12" r="7.5" />
          <Circle {...commonProps} cx="12" cy="12" r="4.2" />
          <Circle cx="12" cy="12" r="1.5" fill={filled ? color : 'none'} stroke={filled ? 'none' : color} />
        </>
      );
    case 'chart':
      return (
        <>
          <Path {...commonProps} d="M5 18.5H19" />
          <Path {...commonProps} d="M6.5 15.5L10 12L12.75 14.25L17.5 9.5" />
          <Path {...commonProps} d="M15.6 9.5H17.5V11.45" />
        </>
      );
    case 'bell':
      return (
        <>
          <Path {...commonProps} d="M7.25 16.5H16.75L15.9 15C15.55 14.37 15.35 13.66 15.35 12.94V10.85C15.35 8.93 13.92 7.3 12 7.05C10.08 7.3 8.65 8.93 8.65 10.85V12.94C8.65 13.66 8.45 14.37 8.1 15L7.25 16.5Z" />
          <Path {...commonProps} d="M10.15 17.5C10.45 18.56 11.17 19.1 12 19.1C12.83 19.1 13.55 18.56 13.85 17.5" />
        </>
      );
    case 'logout':
      return (
        <>
          <Path {...commonProps} d="M10 5H7.25C6.28 5 5.5 5.78 5.5 6.75V17.25C5.5 18.22 6.28 19 7.25 19H10" />
          <Path {...commonProps} d="M13 8.5L18 12L13 15.5" />
          <Path {...commonProps} d="M10.75 12H18" />
        </>
      );
    case 'chevron-left':
      return <Path {...commonProps} d="M14.75 6.5L9.25 12L14.75 17.5" />;
    case 'chevron-right':
      return <Path {...commonProps} d="M9.25 6.5L14.75 12L9.25 17.5" />;
    case 'spark':
      return (
        <Path {...commonProps} d="M12 4.5L13.6 9L18 10.6L13.6 12.2L12 16.7L10.4 12.2L6 10.6L10.4 9L12 4.5Z" />
      );
    default:
      return <Circle {...commonProps} cx="12" cy="12" r="7.5" />;
  }
}

export function AppIcon({
  name,
  size = 24,
  color = '#6FD9FF',
  strokeWidth = 1.8,
  filled = false,
  style
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={style}
    >
      <IconPaths name={name} color={color} strokeWidth={strokeWidth} filled={filled} />
    </Svg>
  );
}
