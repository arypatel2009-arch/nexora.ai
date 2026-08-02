import "server-only";
import { promises as fs } from "fs";
import path from "path";

// -----------------------------------------------------------------------
// LOCAL FILE STORE (development only, no Supabase, no external DB)
// -----------------------------------------------------------------------
// Every table becomes one JSON file under .data/ at the project root.
// This file is imported ONLY from server-side code:
//   - directly, by local-repository.ts's server branch (Server Components,
//     i.e. the public website)
//   - indirectly, by file-store.actions.ts's Server Actions (called from
//     the Admin CMS's Client Components)
// Both paths read and write the exact same file, which is what keeps
// Admin and the public site in sync locally — see local-repository.ts
// for the full explanation.
// -----------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), ".data");

function filePath(table: string) {
  return path.join(DATA_DIR, `${table}.json`);
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readTable<T>(table: string, seed: T[]): Promise<T[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(filePath(table), "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    // First read for this table — seed the file so Admin and the
    // website start from the same data instead of two different
    // in-memory defaults.
    await fs.writeFile(filePath(table), JSON.stringify(seed, null, 2), "utf-8");
    return seed;
  }
}

export async function writeTable<T>(table: string, items: T[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath(table), JSON.stringify(items, null, 2), "utf-8");
}
