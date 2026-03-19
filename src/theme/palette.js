export const THEMES = {
  aqua: {
    id: 'aqua',
    label: 'RK Aqua',
    bgBase: '#2b2f67',
    bgElevated: '#3a3f82',
    accent: '#6FD9FF',
    accentStrong: '#A9EDFF',
    glow: 'rgba(111, 217, 255, 0.34)'
  },
  ruby: {
    id: 'ruby',
    label: 'Ruby Rush',
    bgBase: '#381c47',
    bgElevated: '#4f2860',
    accent: '#ff6b7a',
    accentStrong: '#ffb2ba',
    glow: 'rgba(255, 107, 122, 0.24)'
  },
  orange: {
    id: 'orange',
    label: 'Orange Pop',
    bgBase: '#3b2042',
    bgElevated: '#59305d',
    accent: '#ff9560',
    accentStrong: '#ffc6a4',
    glow: 'rgba(255, 149, 96, 0.26)'
  },
  yellow: {
    id: 'yellow',
    label: 'Sun Glow',
    bgBase: '#40351c',
    bgElevated: '#5a4b25',
    accent: '#ffd85a',
    accentStrong: '#fff1b1',
    glow: 'rgba(255, 216, 90, 0.24)'
  },
  green: {
    id: 'green',
    label: 'Green Spark',
    bgBase: '#1e3b34',
    bgElevated: '#28554d',
    accent: '#68eea2',
    accentStrong: '#b2ffd1',
    glow: 'rgba(104, 238, 162, 0.24)'
  },
  blue: {
    id: 'blue',
    label: 'Blue Pulse',
    bgBase: '#1b2b59',
    bgElevated: '#26407a',
    accent: '#6FA8FF',
    accentStrong: '#B9D4FF',
    glow: 'rgba(111, 168, 255, 0.24)'
  },
  indigo: {
    id: 'indigo',
    label: 'Indigo Wave',
    bgBase: '#262057',
    bgElevated: '#37307b',
    accent: '#8f86ff',
    accentStrong: '#c8c2ff',
    glow: 'rgba(143, 134, 255, 0.24)'
  },
  violet: {
    id: 'violet',
    label: 'Violet Beam',
    bgBase: '#331f58',
    bgElevated: '#4a2c77',
    accent: '#c07cff',
    accentStrong: '#e0c1ff',
    glow: 'rgba(192, 124, 255, 0.24)'
  }
};

export function getThemePalette(themeId) {
  return THEMES[themeId] || THEMES.aqua;
}
