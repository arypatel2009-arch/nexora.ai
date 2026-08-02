"use client";

import { useEffect, useRef, useState } from "react";
import { mediaService } from "@/lib/services/media.service";
import type { MediaAsset } from "@/lib/types";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Field, Input } from "@/components/admin/fields";
import { ImageIcon, Trash2, PlusCircle, Search, UploadCloud, Loader2, AlertCircle } from "lucide-react";

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [draft, setDraft] = useState({ url: "", fileName: "", altText: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    setLoading(true);
    setLoadError(null);
    try {
      setAssets(await mediaService.getAll());
    } catch {
      setLoadError("Couldn't load media assets. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = assets.filter((a) => a.fileName.toLowerCase().includes(query.toLowerCase()));

  async function handleAddByUrl() {
    if (!draft.url || !draft.fileName) return;
    await mediaService.record({
      fileName: draft.fileName,
      url: draft.url,
      altText: draft.altText,
      mimeType: "image/*",
      sizeBytes: 0,
    });
    setDraft({ url: "", fileName: "", altText: "" });
    setModalOpen(false);
    await refresh();
  }

  /**
   * Real upload path: sends the file to /api/upload, which uploads it to
   * the Supabase Storage "media" bucket and records the public URL in
   * media_assets. Falls back to a clear inline error (not a silent no-op)
   * if Supabase isn't configured yet — see app/api/upload/route.ts.
   */
  async function handleFileUpload(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Upload failed.");
      }
      await refresh();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-white">Media Library</h1>
          <p className="mt-1 text-sm text-muted dark:text-white/50">
            Upload a file to store it in Supabase Storage, or add an existing URL manually.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-all duration-300 hover:bg-brand-50 disabled:opacity-60 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            {uploading ? "Uploading…" : "Upload file"}
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600"
          >
            <PlusCircle size={16} /> Add by URL
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {uploadError}
        </div>
      )}

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files…" className="admin-input pl-10" />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton aspect-square rounded-xl2" />
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center rounded-xl2 border border-dashed border-border bg-white p-16 text-center dark:border-white/10 dark:bg-[#111827]">
            <AlertCircle size={22} className="text-red-500" />
            <p className="mt-3 text-sm text-muted">{loadError}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl2 border border-dashed border-border bg-white p-16 text-center dark:border-white/10 dark:bg-[#111827]">
            <ImageIcon size={22} className="text-muted" />
            <p className="mt-3 text-sm text-muted">No media assets yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {filtered.map((asset) => (
              <div key={asset.id} className="group relative overflow-hidden rounded-xl2 border border-border bg-white dark:border-white/10 dark:bg-[#111827]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset.url} alt={asset.altText} className="aspect-square w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-2 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="truncate text-xs text-white">{asset.fileName}</span>
                  <button onClick={() => setDeleteTarget(asset)} className="text-white hover:text-red-300">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add media asset by URL">
        <div className="space-y-4">
          <Field label="Image URL">
            <Input value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://…" />
          </Field>
          <Field label="File name">
            <Input value={draft.fileName} onChange={(e) => setDraft({ ...draft, fileName: e.target.value })} />
          </Field>
          <Field label="Alt text">
            <Input value={draft.altText} onChange={(e) => setDraft({ ...draft, altText: e.target.value })} />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setModalOpen(false)} className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-brand-50">
            Cancel
          </button>
          <button onClick={handleAddByUrl} className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600">
            Add
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete asset?"
        message="This can't be undone."
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await mediaService.remove(deleteTarget.id);
          setDeleteTarget(null);
          await refresh();
        }}
      />
    </div>
  );
}
