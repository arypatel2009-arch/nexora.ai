"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { settingsService } from "@/lib/services/settings.service";
import type { SiteSettings } from "@/lib/types";
import { Field, Input } from "@/components/admin/fields";
import { CheckCircle2, ShieldAlert, AlertCircle, Loader2 } from "lucide-react";
import { useAdminSession } from "@/lib/admin/session-context";

export default function SettingsAdminPage() {
  const session = useAdminSession();
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (session && session.role !== "admin") {
      router.replace("/admin/dashboard");
    }
  }, [session, router]);

  async function load() {
    setLoadError(null);
    try {
      setSettings(await settingsService.get());
    } catch {
      setLoadError("Couldn't load settings. Try refreshing.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (session && session.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-border p-16 text-center dark:border-white/10">
        <ShieldAlert size={24} className="text-muted" />
        <p className="text-sm text-muted">Settings are visible to Admin accounts only.</p>
      </div>
    );
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await settingsService.update(settings);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaveError("Couldn't save changes. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl2 border border-dashed border-border p-16 text-center dark:border-white/10">
        <AlertCircle size={22} className="text-red-500" />
        <p className="text-sm text-muted dark:text-white/50">{loadError}</p>
        <button
          onClick={load}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!settings) {
    return <div className="skeleton h-64 rounded-xl2" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-white">Settings</h1>
      <p className="mt-1 text-sm text-muted dark:text-white/50">
        Core company information used across the site (footer, contact page, SEO metadata).
      </p>

      <div className="mt-8 max-w-xl space-y-4 rounded-xl2 border border-border bg-white p-6 dark:border-white/10 dark:bg-[#111827]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company name">
            <Input value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} />
          </Field>
          <Field label="Tagline">
            <Input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
          </Field>
          <Field label="Founder">
            <Input value={settings.founder} onChange={(e) => setSettings({ ...settings, founder: e.target.value })} />
          </Field>
          <Field label="Domain">
            <Input value={settings.domain} onChange={(e) => setSettings({ ...settings, domain: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
          </Field>
          <Field label="Primary CTA text">
            <Input value={settings.primaryCta} onChange={(e) => setSettings({ ...settings, primaryCta: e.target.value })} />
          </Field>
          <Field label="Secondary CTA text">
            <Input value={settings.secondaryCta} onChange={(e) => setSettings({ ...settings, secondaryCta: e.target.value })} />
          </Field>
        </div>

        {saveError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10">
            <AlertCircle size={15} className="shrink-0" /> {saveError}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-600 disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-accent-teal">
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 max-w-xl text-xs text-muted dark:text-white/50">
        Settings are read and written through the same repository layer as
        every other module — if Supabase is configured, changes here save
        directly to the <code className="rounded bg-canvas px-1.5 py-0.5 dark:bg-white/10">site_settings</code> table
        and apply for every visitor immediately.
      </p>
    </div>
  );
}
