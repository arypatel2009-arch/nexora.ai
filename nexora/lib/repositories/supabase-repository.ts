import type { SupabaseClient } from "@supabase/supabase-js";
import type { Repository } from "./types";

/**
 * Generic Supabase-backed repository. Works against any table whose
 * columns are a superset of T (snake_case columns should be mapped to
 * camelCase T fields by the caller if needed — for tables that already
 * match 1:1 this "just works"). Once NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY are set, get-repository.ts returns this
 * instead of the local mock — no service or admin page changes needed.
 */
export function createSupabaseRepository<T extends { id: string }>(
  client: SupabaseClient,
  table: string
): Repository<T> {
  return {
    async getAll() {
      const { data, error } = await client.from(table).select("*");
      if (error) throw error;
      return (data ?? []) as T[];
    },

    async getById(id) {
      const { data, error } = await client.from(table).select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return (data as T) ?? null;
    },

    async create(item) {
      const { data, error } = await client.from(table).insert(item).select().single();
      if (error) throw error;
      return data as T;
    },

    async update(id, patch) {
      const { data, error } = await client.from(table).update(patch).eq("id", id).select().maybeSingle();
      if (error) throw error;
      return (data as T) ?? null;
    },

    async remove(id) {
      const { error } = await client.from(table).delete().eq("id", id);
      if (error) throw error;
    },
  };
}
