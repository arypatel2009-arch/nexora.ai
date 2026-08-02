"use client";

import { useState } from "react";
import { faqsService } from "@/lib/services/faqs.service";
import { generateId } from "@/lib/services/entity-service";
import { useAdminCollection } from "@/lib/admin/useAdminCollection";
import type { FaqItem } from "@/lib/types";
import AdminDataTable, { type AdminColumn } from "@/components/admin/AdminDataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { Field, Input, Textarea } from "@/components/admin/fields";

const emptyDraft = (): FaqItem => ({ id: "", question: "", answer: "", category: "General", status: "draft", order: 0 });

export default function FaqsAdminPage() {
  const { items, loading, error, refresh, createItem, updateItem, removeItem, togglePublish } =
    useAdminCollection(faqsService);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [draft, setDraft] = useState<FaqItem>(emptyDraft());
  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
    setModalOpen(true);
  }
  function openEdit(row: FaqItem) {
    setEditing(row);
    setDraft(row);
    setModalOpen(true);
  }
  async function handleSave() {
    if (editing) await updateItem(editing.id, draft);
    else await createItem({ ...draft, id: generateId("faq") });
    setModalOpen(false);
  }

  const columns: AdminColumn<FaqItem>[] = [
    { key: "question", label: "Question", render: (row) => <span className="line-clamp-1 font-medium">{row.question}</span> },
    { key: "category", label: "Category", render: (row) => row.category },
    { key: "order", label: "Order", render: (row) => row.order },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <AdminDataTable
        title="FAQs"
        description="Questions and answers shown on the homepage and /faq page."
        rows={items}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        searchFilter={(row, q) => row.question.toLowerCase().includes(q) || row.category.toLowerCase().includes(q)}
        onCreate={openCreate}
        createLabel="Add FAQ"
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onTogglePublish={togglePublish}
        isPublished={(row) => row.status === "published"}
        emptyTitle="No FAQs yet"
        emptyDescription="Add a question your customers commonly ask."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit FAQ" : "Add FAQ"}>
        <div className="space-y-4">
          <Field label="Question">
            <Input value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
          </Field>
          <Field label="Answer">
            <Textarea rows={4} value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <Input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
            </Field>
            <Field label="Order">
              <Input type="number" value={draft.order} onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })} />
            </Field>
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
        title="Delete FAQ?"
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
