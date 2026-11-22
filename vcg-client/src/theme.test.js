import { afterEach, describe, expect, it, vi } from 'vitest';
import { THEME_KEY, loadTheme, nextTheme, saveTheme } from './theme';

const fakeStorage = (initial = {}) => {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
};

const withStorage = (storage) => vi.stubGlobal('window', { localStorage: storage });

afterEach(() => vi.unstubAllGlobals());

describe('theme', () => {
  it('cycles system → light → dark → system', () => {
    expect(nextTheme('system')).toBe('light');
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('system');
  });

  it('follows the device unless light or dark was saved', () => {
    withStorage(fakeStorage());
    expect(loadTheme()).toBe('system');
    withStorage(fakeStorage({ [THEME_KEY]: 'dark' }));
    expect(loadTheme()).toBe('dark');
    withStorage(fakeStorage({ [THEME_KEY]: 'purple' }));
    expect(loadTheme()).toBe('system');
  });

  it('forgets the choice when going back to system', () => {
    const storage = fakeStorage();
    withStorage(storage);
    saveTheme('light');
    expect(storage.data[THEME_KEY]).toBe('light');
    saveTheme('system');
    expect(THEME_KEY in storage.data).toBe(false);
  });

  it('copes with storage being unavailable', () => {
    const throwing = () => {
      throw new Error('blocked');
    };
    withStorage({ getItem: throwing, setItem: throwing, removeItem: throwing });
    expect(loadTheme()).toBe('system');
    expect(() => saveTheme('dark')).not.toThrow();
  });
});
