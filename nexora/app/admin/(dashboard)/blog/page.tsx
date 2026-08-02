"use client";

import { useState } from "react";
import { blogService, computeReadingTime } from "@/lib/services/blog.service";
import { generateId } from "@/lib/services/entity-service";
import { useAdminCollection } from "@/lib/admin/useAdminCollection";
import type { BlogPost } from "@/lib/types";
import AdminDataTable, { type AdminColumn } from "@/components/admin/AdminDataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { Field, Input, Textarea, ListEditor } from "@/components/admin/fields";

const emptyDraft = (): BlogPost => ({
  id: "", slug: "", title: "", excerpt: "", body: "", category: "", tags: [],
  author: { name: "", role: "", avatar: null },
  featuredImage: null,
  seo: { metaTitle: "", metaDescription: "" },
  status: "draft",
  publishedAt: null,
});

export default function BlogAdminPage() {
  const { items, loading, error, refresh, createItem, updateItem, removeItem, togglePublish } =
    useAdminCollection(blogService);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [draft, setDraft] = useState<BlogPost>(emptyDraft());
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
    setModalOpen(true);
  }
  function openEdit(row: BlogPost) {
    setEditing(row);
    setDraft(row);
    setModalOpen(true);
  }
  async function handleSave() {
    const toSave: BlogPost = {
      ...draft,
      publishedAt: draft.status === "published" ? draft.publishedAt ?? new Date().toISOString() : draft.publishedAt,
    };
    if (editing) await updateItem(editing.id, toSave);
    else await createItem({ ...toSave, id: generateId("post") });
    setModalOpen(false);
  }

  const columns: AdminColumn<BlogPost>[] = [
    { key: "title", label: "Title", render: (row) => <span className="font-medium">{row.title}</span> },
    { key: "category", label: "Category", render: (row) => row.category },
    { key: "readingTime", label: "Read time", render: (row) => `${computeReadingTime(row.body)} min` },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <AdminDataTable
        title="Blog Posts"
        description="Full architecture is wired up — categories, tags, author, SEO, reading time, related posts."
        rows={items}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        searchFilter={(row, q) => row.title.toLowerCase().includes(q) || row.category.toLowerCase().includes(q)}
        onCreate={openCreate}
        createLabel="Add post"
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onTogglePublish={togglePublish}
        isPublished={(row) => row.status === "published"}
        emptyTitle="No posts yet"
        emptyDescription="Write your first article — no invented posts are shown until then."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit post" : "Add post"} maxWidth="max-w-2xl">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field label="Slug">
              <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
            </Field>
          </div>
          <Field label="Excerpt">
            <Textarea rows={2} value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
          </Field>
          <Field label="Body (Markdown)" hint={`~${computeReadingTime(draft.body)} min read`}>
            <Textarea rows={8} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <Input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
            </Field>
            <Field label="Featured image URL">
              <Input value={draft.featuredImage ?? ""} onChange={(e) => setDraft({ ...draft, featuredImage: e.target.value || null })} />
            </Field>
          </div>
          <ListEditor label="Tags" values={draft.tags} onChange={(v) => setDraft({ ...draft, tags: v })} />

          <div className="rounded-xl2 border border-border p-4">
            <h3 className="text-sm font-semibold text-ink">Author</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input value={draft.author.name} onChange={(e) => setDraft({ ...draft, author: { ...draft.author, name: e.target.value } })} />
              </Field>
              <Field label="Role">
                <Input value={draft.author.role} onChange={(e) => setDraft({ ...draft, author: { ...draft.author, role: e.target.value } })} />
              </Field>
            </div>
          </div>

          <div className="rounded-xl2 border border-border p-4">
            <h3 className="text-sm font-semibold text-ink">SEO</h3>
            <div className="mt-3 space-y-4">
              <Field label="Meta title">
                <Input value={draft.seo.metaTitle} onChange={(e) => setDraft({ ...draft, seo: { ...draft.seo, metaTitle: e.target.value } })} />
              </Field>
              <Field label="Meta description">
                <Textarea rows={2} value={draft.seo.metaDescription} onChange={(e) => setDraft({ ...draft, seo: { ...draft.seo, metaDescription: e.target.value } })} />
              </Field>
            </div>
          </div>
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
        title="Delete post?"
        message={`"${deleteTarget?.title}" will be removed. This can't be undone.`}
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
