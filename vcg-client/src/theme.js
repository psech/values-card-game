// The player's colour theme: follow the device ("system"), or force light or
// dark. index.html applies a saved choice before the first paint, so keep
// THEME_KEY and the attribute in sync with the inline script there.

export const THEME_KEY = 'vcg-theme';
export const THEMES = ['system', 'light', 'dark'];

const BACKGROUNDS = { light: '#f5f2ec', dark: '#121418' };

export const nextTheme = (theme) =>
  THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];

export const loadTheme = () => {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    return 'system';
  }
};

export const saveTheme = (theme) => {
  try {
    if (theme === 'system') window.localStorage.removeItem(THEME_KEY);
    else window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // The choice just won't survive a reload.
  }
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'system') delete root.dataset.theme;
  else root.dataset.theme = theme;

  // The browser bar colour: index.html has one tag per device scheme.
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    const scheme = meta.media.includes('dark') ? 'dark' : 'light';
    meta.content = BACKGROUNDS[theme === 'system' ? scheme : theme];
  });
};
