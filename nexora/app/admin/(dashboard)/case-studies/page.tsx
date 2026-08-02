"use client";

import { useEffect, useState } from "react";
import { caseStudiesService } from "@/lib/services/case-studies.service";
import { projectsService } from "@/lib/services/projects.service";
import { generateId } from "@/lib/services/entity-service";
import { useAdminCollection } from "@/lib/admin/useAdminCollection";
import type { CaseStudy, Project } from "@/lib/types";
import AdminDataTable, { type AdminColumn } from "@/components/admin/AdminDataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { Field, Textarea, Select } from "@/components/admin/fields";

const emptyDraft = (): CaseStudy => ({ id: "", projectId: "", challenge: "", approach: "", outcome: "", status: "draft" });

export default function CaseStudiesAdminPage() {
  const { items, loading, error, refresh, createItem, updateItem, removeItem, togglePublish } =
    useAdminCollection(caseStudiesService);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectsService.getAll().then(setProjects);
  }, [items]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [draft, setDraft] = useState<CaseStudy>(emptyDraft());
  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
    setModalOpen(true);
  }
  function openEdit(row: CaseStudy) {
    setEditing(row);
    setDraft(row);
    setModalOpen(true);
  }
  async function handleSave() {
    if (editing) await updateItem(editing.id, draft);
    else await createItem({ ...draft, id: generateId("case") });
    setModalOpen(false);
  }

  const projectTitle = (id: string) => projects.find((p) => p.id === id)?.title ?? "(no project linked)";

  const columns: AdminColumn<CaseStudy>[] = [
    { key: "project", label: "Project", render: (row) => <span className="font-medium">{projectTitle(row.projectId)}</span> },
    { key: "challenge", label: "Challenge", render: (row) => <span className="line-clamp-1">{row.challenge}</span> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <AdminDataTable
        title="Case Studies"
        description="Longer-form write-ups linked to a portfolio project."
        rows={items}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={refresh}
        searchFilter={(row, q) => row.challenge.toLowerCase().includes(q)}
        onCreate={openCreate}
        createLabel="Add case study"
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onTogglePublish={togglePublish}
        isPublished={(row) => row.status === "published"}
        emptyTitle="No case studies yet"
        emptyDescription="Case studies pair with a portfolio project — add a project first, then write its story here."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit case study" : "Add case study"}>
        <div className="space-y-4">
          <Field label="Linked project">
            <Select value={draft.projectId} onChange={(e) => setDraft({ ...draft, projectId: e.target.value })}>
              <option value="">Select a project…</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </Select>
          </Field>
          <Field label="Challenge">
            <Textarea rows={3} value={draft.challenge} onChange={(e) => setDraft({ ...draft, challenge: e.target.value })} />
          </Field>
          <Field label="Approach">
            <Textarea rows={3} value={draft.approach} onChange={(e) => setDraft({ ...draft, approach: e.target.value })} />
          </Field>
          <Field label="Outcome">
            <Textarea rows={3} value={draft.outcome} onChange={(e) => setDraft({ ...draft, outcome: e.target.value })} />
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
        title="Delete case study?"
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
