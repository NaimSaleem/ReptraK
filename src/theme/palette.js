export const THEMES = {
  aqua: {
    id: 'aqua',
    label: 'Aqua RK',
    bgBase: '#25245a',
    bgElevated: '#2f2f6e',
    accent: '#66c4e8',
    accentStrong: '#89e7ff',
    glow: 'rgba(102, 196, 232, 0.26)'
  },
  mint: {
    id: 'mint',
    label: 'Mint Flow',
    bgBase: '#1f2a54',
    bgElevated: '#2a3768',
    accent: '#66e2bf',
    accentStrong: '#8bf8d9',
    glow: 'rgba(102, 226, 191, 0.24)'
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset Focus',
    bgBase: '#2e204f',
    bgElevated: '#44306b',
    accent: '#ffb08a',
    accentStrong: '#ffd0b8',
    glow: 'rgba(255, 176, 138, 0.24)'
  }
};

export function getThemePalette(themeId) {
  return THEMES[themeId] || THEMES.aqua;
}
