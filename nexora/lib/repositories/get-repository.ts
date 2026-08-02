import type { Repository } from "./types";
import { createLocalRepository } from "./local-repository";
import { createSupabaseRepository } from "./supabase-repository";
import { getSupabaseClient } from "@/lib/supabase/client";

/**
 * The single switch point for the entire data layer. Every entity
 * service calls this once. If Supabase env vars are present, every
 * service is automatically backed by real Postgres tables — otherwise
 * everything falls back to the local mock store. No other file needs
 * to change when you connect Supabase.
 */
export function getRepository<T extends { id: string }>(
  table: string,
  storageKey: string,
  seed: T[]
): Repository<T> {
  const client = getSupabaseClient();
  if (client) {
    return createSupabaseRepository<T>(client, table);
  }
  return createLocalRepository<T>(storageKey, seed);
}
