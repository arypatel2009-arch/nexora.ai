import type { SiteSettings } from "@/lib/types";
import { siteSettingsSeed } from "@/lib/seed/site-settings.seed";
import { getSupabaseClient } from "@/lib/supabase/client";

const KEY = "nexora_admin:site-settings";

function readLocal(): SiteSettings {
  if (typeof window === "undefined") return siteSettingsSeed;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SiteSettings) : siteSettingsSeed;
  } catch {
    return siteSettingsSeed;
  }
}

function writeLocal(settings: SiteSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // mock layer only
  }
}

export const settingsService = {
  async get(): Promise<SiteSettings> {
    const client = getSupabaseClient();
    if (client) {
      const { data } = await client.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (data) return data as SiteSettings;
    }
    return readLocal();
  },

  async update(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    const client = getSupabaseClient();
    if (client) {
      const { data } = await client
        .from("site_settings")
        .update(patch)
        .eq("id", 1)
        .select()
        .maybeSingle();
      if (data) return data as SiteSettings;
    }
    const next = { ...readLocal(), ...patch };
    writeLocal(next);
    return next;
  },
};
