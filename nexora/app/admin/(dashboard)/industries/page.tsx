"use client";

import { useState } from "react";
import { industriesService } from "@/lib/services/industries.service";
import { generateId } from "@/lib/services/entity-service";
import { useAdminCollection } from "@/lib/admin/useAdminCollection";
import { INDUSTRY_ICON_OPTIONS } from "@/lib/icon-options";
import type { Industry } from "@/lib/types";
import AdminDataTable, { type AdminColumn } from "@/components/admin/AdminDataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { Field, Input, Textarea, Select } from "@/components/admin/fields";

const emptyDraft = (): Industry => ({
  id: "",
  slug: "",
  name: "",
  painPoint: "",
  solution: "",
  icon: INDUSTRY_ICON_OPTIONS[0],
  status: "draft",
  order: 0,
});

export default function IndustriesAdminPage() {
  const { items, loading, error, refresh, createItem, updateItem, removeItem, togglePublish } =
    useAdminCollection(industriesService);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [draft, setDraft] = useState<Industry>(emptyDraft());
  const [deleteTarget, setDeleteTarget] = useState<Industry | null>(null);

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
    setModalOpen(true);
  }
  function openEdit(row: Industry) {
    setEditing(row);
    setDraft(row);
    setModalOpen(true);
  }
  async function handleSave() {
    if (editing) await updateItem(editing.id, draft);
    else await createItem({ ...draft, id: generateId("ind") });
    setModalOpen(false);
  }

  const columns: AdminColumn<Industry>[] = [
    { key: "name", label: "Name", render: (row) => <span className="font-medium">{row.name}</span> },
    { key: "painPoint", label: "Pain point", render: (row) => <span className="line-clamp-1">{row.painPoint}</span> },
    { key: "order", label: "Order", render: (row) => row.order },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <AdminDataTable
        title="Industries"
        description="Industries featured on the homepage and /industries page."
        rows={items}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        searchFilter={(row, q) => row.name.toLowerCase().includes(q)}
        onCreate={openCreate}
        createLabel="Add industry"
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onTogglePublish={togglePublish}
        isPublished={(row) => row.status === "published"}
        emptyTitle="No industries yet"
        emptyDescription="Add an industry to have it appear on the public site."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit industry" : "Add industry"}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Slug">
              <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
            </Field>
          </div>
          <Field label="Pain point">
            <Textarea rows={2} value={draft.painPoint} onChange={(e) => setDraft({ ...draft, painPoint: e.target.value })} />
          </Field>
          <Field label="Solution">
            <Textarea rows={2} value={draft.solution} onChange={(e) => setDraft({ ...draft, solution: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Icon">
              <Select value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })}>
                {INDUSTRY_ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </Select>
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
        title="Delete industry?"
        message={`"${deleteTarget?.name}" will be removed from the site. This can't be undone.`}
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
