"use server";

// -----------------------------------------------------------------------
// SERVER ACTIONS — the Admin CMS's only path to the shared file store.
// -----------------------------------------------------------------------
// Client Components (every Admin CMS page) can't touch the filesystem
// directly — the browser has no `fs`. Next.js Server Actions let a
// Client Component call a plain async function that actually runs on
// the server, which is exactly what these do: read/write the same
// .data/<table>.json file that lib/data.ts reads for the public site.
//
// No API route, no separate server, no database — this is Next.js's
// own built-in mechanism for a Client Component to run server code.
// -----------------------------------------------------------------------

import { readTable, writeTable } from "./file-store";

type WithId = { id: string };

export async function getAllAction<T>(table: string, seed: T[]): Promise<T[]> {
  return readTable<T>(table, seed);
}

export async function getByIdAction<T extends WithId>(
  table: string,
  seed: T[],
  id: string
): Promise<T | null> {
  const items = await readTable<T>(table, seed);
  return items.find((item) => item.id === id) ?? null;
}

export async function createAction<T extends WithId>(
  table: string,
  seed: T[],
  item: T
): Promise<T> {
  const items = await readTable<T>(table, seed);
  const next = [item, ...items];
  await writeTable(table, next);
  return item;
}

export async function updateAction<T extends WithId>(
  table: string,
  seed: T[],
  id: string,
  patch: Partial<T>
): Promise<T | null> {
  const items = await readTable<T>(table, seed);
  let updated: T | null = null;
  const next = items.map((item) => {
    if (item.id === id) {
      updated = { ...item, ...patch };
      return updated;
    }
    return item;
  });
  await writeTable(table, next);
  return updated;
}

export async function removeAction<T extends WithId>(
  table: string,
  seed: T[],
  id: string
): Promise<void> {
  const items = await readTable<T>(table, seed);
  await writeTable(
    table,
    items.filter((item) => item.id !== id)
  );
}
