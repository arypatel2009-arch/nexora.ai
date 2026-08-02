// -----------------------------------------------------------------------
// UNUSED — kept for reference only.
// -----------------------------------------------------------------------
// This browser-localStorage adapter is no longer wired up. It caused a
// real bug: Admin CMS (Client Components) wrote here, but the public
// site's Server Components run on the server, where
// `window.localStorage` doesn't exist — so the website never saw
// Admin's changes. It has been replaced by
// lib/repositories/file-store.ts, a shared JSON file both Admin and the
// website read/write (see lib/repositories/local-repository.ts for the
// full explanation). Safe to delete; left in place to avoid touching
// anything not directly part of that fix.
// -----------------------------------------------------------------------

type WithId = { id: string };

function readStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T[];
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail (quota, private mode) — fail silently, mock layer only.
  }
}

export function createCollectionAdapter<T extends WithId>(
  storageKey: string,
  seed: T[]
) {
  const key = `nexora_admin:${storageKey}`;

  function load(): T[] {
    return readStorage(key, seed);
  }

  function save(items: T[]) {
    writeStorage(key, items);
  }

  return {
    async getAll(): Promise<T[]> {
      return load();
    },

    async getById(id: string): Promise<T | null> {
      return load().find((item) => item.id === id) ?? null;
    },

    async create(item: T): Promise<T> {
      const items = load();
      const next = [item, ...items];
      save(next);
      return item;
    },

    async update(id: string, patch: Partial<T>): Promise<T | null> {
      const items = load();
      let updated: T | null = null;
      const next = items.map((item) => {
        if (item.id === id) {
          updated = { ...item, ...patch };
          return updated;
        }
        return item;
      });
      save(next);
      return updated;
    },

    async remove(id: string): Promise<void> {
      const items = load();
      save(items.filter((item) => item.id !== id));
    },

    async reset(): Promise<void> {
      save(seed);
    },
  };
}
