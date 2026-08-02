"use client";

import { useState } from "react";
import { servicesService } from "@/lib/services/services.service";
import { generateId } from "@/lib/services/entity-service";
import { useAdminCollection } from "@/lib/admin/useAdminCollection";
import { SERVICE_ICON_OPTIONS } from "@/lib/icon-options";
import type { Service } from "@/lib/types";
import AdminDataTable, { type AdminColumn } from "@/components/admin/AdminDataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { Field, Input, Textarea, Select, ListEditor } from "@/components/admin/fields";

const emptyDraft = (): Service => ({
  id: "",
  slug: "",
  name: "",
  shortDescription: "",
  description: "",
  outcomes: [],
  icon: SERVICE_ICON_OPTIONS[0],
  availability: "live",
  status: "draft",
  order: 0,
});

export default function ServicesAdminPage() {
  const { items, loading, error, refresh, createItem, updateItem, removeItem, togglePublish } =
    useAdminCollection(servicesService);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [draft, setDraft] = useState<Service>(emptyDraft());
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
    setModalOpen(true);
  }

  function openEdit(row: Service) {
    setEditing(row);
    setDraft(row);
    setModalOpen(true);
  }

  async function handleSave() {
    if (editing) {
      await updateItem(editing.id, draft);
    } else {
      await createItem({ ...draft, id: generateId("svc") });
    }
    setModalOpen(false);
  }

  const columns: AdminColumn<Service>[] = [
    { key: "name", label: "Name", render: (row) => <span className="font-medium">{row.name}</span> },
    { key: "availability", label: "Availability", render: (row) => row.availability },
    { key: "order", label: "Order", render: (row) => row.order },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <AdminDataTable
        title="Services"
        description="The services shown on your homepage and /services page."
        rows={items}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        searchFilter={(row, q) => row.name.toLowerCase().includes(q) || row.slug.toLowerCase().includes(q)}
        onCreate={openCreate}
        createLabel="Add service"
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onTogglePublish={togglePublish}
        isPublished={(row) => row.status === "published"}
        emptyTitle="No services yet"
        emptyDescription="Add your first service to have it appear on the public site."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit service" : "Add service"}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Slug">
              <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
            </Field>
          </div>
          <Field label="Short description">
            <Input value={draft.shortDescription} onChange={(e) => setDraft({ ...draft, shortDescription: e.target.value })} />
          </Field>
          <Field label="Full description">
            <Textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </Field>
          <ListEditor label="Outcomes" values={draft.outcomes} onChange={(v) => setDraft({ ...draft, outcomes: v })} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Icon">
              <Select value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })}>
                {SERVICE_ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </Select>
            </Field>
            <Field label="Availability">
              <Select
                value={draft.availability}
                onChange={(e) => setDraft({ ...draft, availability: e.target.value as Service["availability"] })}
              >
                <option value="live">Live</option>
                <option value="coming-soon">Coming soon</option>
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
        title="Delete service?"
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
