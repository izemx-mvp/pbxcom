type StorageKind = "local" | "session";

function getStore(kind: StorageKind): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readStorage<T>(key: string, fallback: T, kind: StorageKind = "local"): T {
  const store = getStore(kind);
  if (!store) return fallback;
  try {
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T, kind: StorageKind = "local"): void {
  const store = getStore(kind);
  if (!store) return;
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or privacy mode — ignore */
  }
}

export function removeStorage(key: string, kind: StorageKind = "local"): void {
  const store = getStore(kind);
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    /* ignore */
  }
}
