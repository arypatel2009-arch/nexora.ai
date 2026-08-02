import { getRepository } from "@/lib/repositories/get-repository";
import type { PublishStatus } from "@/lib/types";

type WithStatus = { id: string; status: PublishStatus };

/**
 * Wraps a Repository (local mock today, Supabase automatically once
 * configured — see lib/repositories/get-repository.ts) with the CRUD +
 * publish/unpublish shape every Admin CMS module needs. Each
 * lib/services/*.ts file is just this factory called once per entity —
 * that's the repository-pattern "reusable database service layer" the
 * mission asked for. Setting the Supabase env vars upgrades every one
 * of these at once, with zero changes to admin pages.
 */
export function createEntityService<T extends WithStatus>(
  table: string,
  storageKey: string,
  seed: T[]
) {
  const repo = getRepository<T>(table, storageKey, seed);

  return {
    getAll: repo.getAll,
    getById: repo.getById,
    create: repo.create,
    update: repo.update,
    remove: repo.remove,

    async setStatus(id: string, status: PublishStatus) {
      return repo.update(id, { status } as Partial<T>);
    },

    async publish(id: string) {
      return repo.update(id, { status: "published" } as Partial<T>);
    },

    async unpublish(id: string) {
      return repo.update(id, { status: "draft" } as Partial<T>);
    },
  };
}

export function generateId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
