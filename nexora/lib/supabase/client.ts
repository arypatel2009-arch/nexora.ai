import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// -----------------------------------------------------------------------
// SUPABASE CLIENT (not yet active)
// -----------------------------------------------------------------------
// 1. `npm install @supabase/supabase-js`
// 2. Add to `.env.local`:
//      NEXT_PUBLIC_SUPABASE_URL=...
//      NEXT_PUBLIC_SUPABASE_ANON_KEY=...
// 3. Run the schema in lib/supabase/schema.sql (or supabase/migrations)
//    against your project.
// 4. That's it — lib/repositories/get-repository.ts already switches
//    every service from the local file store to Supabase automatically
//    once these env vars are set. No other file needs to change.
// -----------------------------------------------------------------------

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Not configured yet — callers should fall back to the mock adapter.
    return null;
  }

  if (!client) {
    client = createClient(url, anonKey);
  }
  return client;
}
