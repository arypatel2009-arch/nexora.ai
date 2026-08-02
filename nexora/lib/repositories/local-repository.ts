import type { Repository } from "./types";
import { getAllAction, getByIdAction, createAction, updateAction, removeAction } from "./file-store.actions";

/**
 * Local file-backed repository — used automatically whenever Supabase
 * env vars aren't set (see get-repository.ts). No Supabase, no
 * database, no separate API server: everything lives in one JSON file
 * per table under .data/ at the project root.
 *
 * THE ORIGINAL BUG: this used to be backed by browser localStorage.
 * Admin CMS pages are Client Components, so their writes landed in the
 * browser's localStorage. The public website's Server Components fetch
 * data on the server (Node), where `window.localStorage` doesn't
 * exist, so they always fell back to static seed data and never saw
 * what Admin had written — two different data sources, silently.
 *
 * THE FIX: every caller — server or browser — goes through the exact
 * same Server Actions in file-store.actions.ts, which read/write
 * .data/<table>.json. A "use server" function is safe to call from
 * anywhere: from a Server Component it's just a direct async call (no
 * network hop, since there's no client/server boundary to cross); from
 * a Client Component, Next.js performs the RPC to the server for you.
 * Either way, both paths touch the one physical file, so a publish in
 * Admin is visible on the very next request.
 *
 * A PREVIOUS VERSION of this file branched on `typeof window` and, on
 * the server, dynamically `import()`-ed file-store.ts (the raw
 * fs-based module) directly, on the theory that a dynamic import
 * wouldn't ship in the client bundle. That's wrong: Next.js's
 * `server-only` guard flags a module by whether it's *reachable* in
 * the import graph, not by whether the import is static or dynamic or
 * behind a runtime check — so that dynamic import still poisoned every
 * Client Component that (transitively, through the shared service
 * layer) imported this file, breaking `next build`. Routing
 * everything through the Server Action layer instead means
 * file-store.ts is never referenced here at all, so there's nothing
 * for the guard to flag.
 */
export function createLocalRepository<T extends { id: string }>(
  storageKey: string,
  seed: T[]
): Repository<T> {
  return {
    getAll: () => getAllAction<T>(storageKey, seed),
    getById: (id) => getByIdAction<T>(storageKey, seed, id),
    create: (item) => createAction<T>(storageKey, seed, item),
    update: (id, patch) => updateAction<T>(storageKey, seed, id, patch),
    remove: (id) => removeAction<T>(storageKey, seed, id),
  };
}
