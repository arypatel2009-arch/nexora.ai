"use client";

import { useState } from "react";
import { careersService } from "@/lib/services/careers.service";
import { generateId } from "@/lib/services/entity-service";
import { useAdminCollection } from "@/lib/admin/useAdminCollection";
import type { CareerListing } from "@/lib/types";
import AdminDataTable, { type AdminColumn } from "@/components/admin/AdminDataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { Field, Input, Textarea, Select, ListEditor } from "@/components/admin/fields";

const emptyDraft = (): CareerListing => ({
  id: "", slug: "", title: "", department: "", location: "", type: "full-time",
  description: "", requirements: [], status: "draft", order: 0,
});

export default function CareersAdminPage() {
  const { items, loading, error, refresh, createItem, updateItem, removeItem, togglePublish } =
    useAdminCollection(careersService);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CareerListing | null>(null);
  const [draft, setDraft] = useState<CareerListing>(emptyDraft());
  const [deleteTarget, setDeleteTarget] = useState<CareerListing | null>(null);

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
    setModalOpen(true);
  }
  function openEdit(row: CareerListing) {
    setEditing(row);
    setDraft(row);
    setModalOpen(true);
  }
  async function handleSave() {
    if (editing) await updateItem(editing.id, draft);
    else await createItem({ ...draft, id: generateId("job") });
    setModalOpen(false);
  }

  const columns: AdminColumn<CareerListing>[] = [
    { key: "title", label: "Role", render: (row) => <span className="font-medium">{row.title}</span> },
    { key: "department", label: "Department", render: (row) => row.department },
    { key: "location", label: "Location", render: (row) => row.location },
    { key: "type", label: "Type", render: (row) => row.type.replace("-", " ") },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <AdminDataTable
        title="Careers"
        description="Open roles shown on the public Careers page."
        rows={items}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        searchFilter={(row, q) => row.title.toLowerCase().includes(q) || row.department.toLowerCase().includes(q)}
        onCreate={openCreate}
        createLabel="Add role"
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onTogglePublish={togglePublish}
        isPublished={(row) => row.status === "published"}
        emptyTitle="No open roles yet"
        emptyDescription="Add a role to have it appear on the public Careers page."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit role" : "Add role"}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field label="Slug">
              <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
            </Field>
            <Field label="Department">
              <Input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} />
            </Field>
            <Field label="Location">
              <Input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
            </Field>
            <Field label="Type">
              <Select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as CareerListing["type"] })}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </Select>
            </Field>
            <Field label="Order">
              <Input type="number" value={draft.order} onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Description">
            <Textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </Field>
          <ListEditor label="Requirements" values={draft.requirements} onChange={(v) => setDraft({ ...draft, requirements: v })} />
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
        title="Delete role?"
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
