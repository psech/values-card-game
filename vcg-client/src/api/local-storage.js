const STORAGE_NAME = 'vcg';

const checkWindow = (cb) => typeof window !== undefined && cb();

export function loadLocalStorage(defaultValue) {
  return checkWindow(() => {
    const saved = localStorage.getItem(STORAGE_NAME);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  });
}

export function saveLocalStorage(state) {
  checkWindow(() => localStorage.setItem(STORAGE_NAME, JSON.stringify(state)));
}

export function resetLocalStorage() {
  checkWindow(() => localStorage.removeItem(STORAGE_NAME));
}
