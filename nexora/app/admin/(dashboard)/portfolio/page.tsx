"use client";

import { useState } from "react";
import { projectsService } from "@/lib/services/projects.service";
import { generateId } from "@/lib/services/entity-service";
import { useAdminCollection } from "@/lib/admin/useAdminCollection";
import { PROJECT_CATEGORIES } from "@/lib/types";
import type { Project } from "@/lib/types";
import AdminDataTable, { type AdminColumn } from "@/components/admin/AdminDataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { Field, Input, Textarea, Select } from "@/components/admin/fields";

const emptyDraft = (): Project => ({
  id: "",
  slug: "",
  title: "",
  client: "",
  industry: "",
  category: "Automation",
  summary: "",
  body: "",
  results: [],
  coverImage: null,
  gallery: [],
  status: "draft",
  publishedAt: null,
});

function resultsToText(results: Project["results"]) {
  return results.map((r) => `${r.label}: ${r.value}`).join("\n");
}
function textToResults(text: string): Project["results"] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return { label: label.trim(), value: rest.join(":").trim() };
    });
}

export default function PortfolioAdminPage() {
  const { items, loading, error, refresh, createItem, updateItem, removeItem, togglePublish } =
    useAdminCollection(projectsService);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [draft, setDraft] = useState<Project>(emptyDraft());
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
    setModalOpen(true);
  }
  function openEdit(row: Project) {
    setEditing(row);
    setDraft(row);
    setModalOpen(true);
  }
  async function handleSave() {
    const toSave: Project = {
      ...draft,
      publishedAt: draft.status === "published" ? draft.publishedAt ?? new Date().toISOString() : draft.publishedAt,
    };
    if (editing) await updateItem(editing.id, toSave);
    else await createItem({ ...toSave, id: generateId("proj") });
    setModalOpen(false);
  }

  const columns: AdminColumn<Project>[] = [
    { key: "title", label: "Project", render: (row) => <span className="font-medium">{row.title}</span> },
    { key: "client", label: "Client", render: (row) => row.client },
    { key: "category", label: "Category", render: (row) => row.category },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <AdminDataTable
        title="Portfolio"
        description="Real client projects. Nothing here is fabricated — the public Portfolio page shows a designed empty state until you add one."
        rows={items}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        searchFilter={(row, q) => row.title.toLowerCase().includes(q) || row.client.toLowerCase().includes(q)}
        onCreate={openCreate}
        createLabel="Add project"
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onTogglePublish={togglePublish}
        isPublished={(row) => row.status === "published"}
        emptyTitle="No projects yet"
        emptyDescription="Add your first completed project — it'll replace the public empty state automatically."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit project" : "Add project"} maxWidth="max-w-2xl">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field label="Slug">
              <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
            </Field>
            <Field label="Client name">
              <Input value={draft.client} onChange={(e) => setDraft({ ...draft, client: e.target.value })} />
            </Field>
            <Field label="Industry">
              <Input value={draft.industry} onChange={(e) => setDraft({ ...draft, industry: e.target.value })} />
            </Field>
            <Field label="Category">
              <Select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Project["category"] })}>
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Cover image URL">
              <Input value={draft.coverImage ?? ""} onChange={(e) => setDraft({ ...draft, coverImage: e.target.value || null })} />
            </Field>
          </div>
          <Field label="Summary">
            <Textarea rows={2} value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
          </Field>
          <Field label="Full case study (Markdown)">
            <Textarea rows={6} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          </Field>
          <Field label="Results" hint="One per line, as 'Label: Value' — e.g. Response time: -80%">
            <Textarea rows={3} defaultValue={resultsToText(draft.results)} onBlur={(e) => setDraft({ ...draft, results: textToResults(e.target.value) })} />
          </Field>
          <Field label="Gallery image URLs" hint="One per line">
            <Textarea rows={3} defaultValue={draft.gallery.join("\n")} onBlur={(e) => setDraft({ ...draft, gallery: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setModalOpen(false)} className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-brand-50">
            Cancel
          </button>
          <button onClick={handleSave} className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600">
            Save
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete project?"
        message={`"${deleteTarget?.title}" will be removed from the portfolio. This can't be undone.`}
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await removeItem(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
