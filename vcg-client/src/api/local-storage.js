const STORAGE_NAME = 'vcg';

// Storage can be unavailable (private mode, blocked site data) or hold
// something we can't parse; in either case the game should still start.
export function loadLocalStorage() {
  try {
    const saved = window.localStorage.getItem(STORAGE_NAME);
    return saved === null ? null : JSON.parse(saved);
  } catch {
    return null;
  }
}

export function saveLocalStorage(value) {
  try {
    window.localStorage.setItem(STORAGE_NAME, JSON.stringify(value));
  } catch {
    // Progress just won't survive a reload.
  }
}
