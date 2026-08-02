"use client";

import { useState } from "react";
import { testimonialsService } from "@/lib/services/testimonials.service";
import { generateId } from "@/lib/services/entity-service";
import { useAdminCollection } from "@/lib/admin/useAdminCollection";
import type { Testimonial } from "@/lib/types";
import AdminDataTable, { type AdminColumn } from "@/components/admin/AdminDataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { Field, Input, Textarea, Select } from "@/components/admin/fields";

const emptyDraft = (): Testimonial => ({
  id: "", quote: "", authorName: "", authorRole: "", authorCompany: "", avatar: null, rating: 5, status: "draft",
});

export default function ReviewsAdminPage() {
  const { items, loading, error, refresh, createItem, updateItem, removeItem, togglePublish } =
    useAdminCollection(testimonialsService);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [draft, setDraft] = useState<Testimonial>(emptyDraft());
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
    setModalOpen(true);
  }
  function openEdit(row: Testimonial) {
    setEditing(row);
    setDraft(row);
    setModalOpen(true);
  }
  async function handleSave() {
    if (editing) await updateItem(editing.id, draft);
    else await createItem({ ...draft, id: generateId("rev") });
    setModalOpen(false);
  }

  const columns: AdminColumn<Testimonial>[] = [
    { key: "authorName", label: "Author", render: (row) => <span className="font-medium">{row.authorName}</span> },
    { key: "authorCompany", label: "Company", render: (row) => row.authorCompany },
    { key: "rating", label: "Rating", render: (row) => `${row.rating} / 5` },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <AdminDataTable
        title="Reviews"
        description="Only genuine client feedback belongs here — the public site shows an honest empty state until real reviews come in."
        rows={items}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        searchFilter={(row, q) => row.authorName.toLowerCase().includes(q) || row.authorCompany.toLowerCase().includes(q)}
        onCreate={openCreate}
        createLabel="Add review"
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onTogglePublish={togglePublish}
        isPublished={(row) => row.status === "published"}
        emptyTitle="No reviews yet"
        emptyDescription="Add a real client review once you receive one."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit review" : "Add review"}>
        <div className="space-y-4">
          <Field label="Quote">
            <Textarea rows={3} value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Author name">
              <Input value={draft.authorName} onChange={(e) => setDraft({ ...draft, authorName: e.target.value })} />
            </Field>
            <Field label="Role">
              <Input value={draft.authorRole} onChange={(e) => setDraft({ ...draft, authorRole: e.target.value })} />
            </Field>
            <Field label="Company">
              <Input value={draft.authorCompany} onChange={(e) => setDraft({ ...draft, authorCompany: e.target.value })} />
            </Field>
            <Field label="Rating">
              <Select value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} / 5</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Avatar URL (optional)">
            <Input value={draft.avatar ?? ""} onChange={(e) => setDraft({ ...draft, avatar: e.target.value || null })} />
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
        title="Delete review?"
        message="This can't be undone."
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
