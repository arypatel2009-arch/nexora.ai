"use client";

import { useEffect, useMemo, useState } from "react";
import { contactService, filterLeads } from "@/lib/services/contact.service";
import type { ContactRequest, ContactRequestStatus } from "@/lib/types";
import AdminDataTable, { type AdminColumn } from "@/components/admin/AdminDataTable";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Select, Textarea } from "@/components/admin/fields";
import { cn } from "@/lib/utils";

const statusStyles: Record<ContactRequestStatus, string> = {
  new: "bg-brand-50 text-brand-600",
  "in-progress": "bg-amber-50 text-amber-600",
  resolved: "bg-accent-teal/10 text-accent-teal",
  archived: "bg-canvas text-muted",
};

export default function LeadsAdminPage() {
  const [items, setItems] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<ContactRequest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContactRequestStatus | "all">("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [notesDraft, setNotesDraft] = useState("");

  const [loadError, setLoadError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setLoadError(null);
    try {
      setItems(await contactService.getAll());
    } catch {
      setLoadError("Couldn't load leads. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const serviceOptions = useMemo(
    () => ["all", ...Array.from(new Set(items.map((i) => i.service)))],
    [items]
  );

  const filtered = useMemo(
    () => filterLeads(items, { status: statusFilter, service: serviceFilter }),
    [items, statusFilter, serviceFilter]
  );

  const columns: AdminColumn<ContactRequest>[] = [
    { key: "name", label: "Name", render: (row) => <span className="font-medium">{row.name}</span> },
    { key: "company", label: "Company", render: (row) => row.company || "—" },
    { key: "email", label: "Email", render: (row) => row.email },
    { key: "service", label: "Interested in", render: (row) => row.service },
    { key: "budget", label: "Budget", render: (row) => row.budget || "—" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize", statusStyles[row.status])}>
          {row.status.replace("-", " ")}
        </span>
      ),
    },
    { key: "createdAt", label: "Received", render: (row) => new Date(row.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-3">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ContactRequestStatus | "all")} className="w-auto">
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="in-progress">In progress</option>
          <option value="resolved">Resolved</option>
          <option value="archived">Archived</option>
        </Select>
        <Select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="w-auto">
          {serviceOptions.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All services" : s}</option>
          ))}
        </Select>
      </div>

      <AdminDataTable
        title="Leads"
        description="Submissions from the public Contact form, managed CRM-style."
        rows={filtered}
        columns={columns}
        loading={loading}
        error={loadError}
        onRetry={refresh}
        searchFilter={(row, q) => row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q) || row.company.toLowerCase().includes(q)}
        onEdit={(row) => {
          setViewing(row);
          setNotesDraft(row.notes);
        }}
        onDelete={setDeleteTarget}
        emptyTitle="No leads yet"
        emptyDescription="Submissions from the public Contact form will show up here."
      />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Lead details">
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <Detail label="Name" value={viewing.name} />
              <Detail label="Company" value={viewing.company || "—"} />
              <Detail label="Email" value={viewing.email} />
              <Detail label="Phone" value={viewing.phone || "—"} />
              <Detail label="Country" value={viewing.country} />
              <Detail label="Budget" value={viewing.budget || "—"} />
              <Detail label="Service" value={viewing.service} />
              <Detail label="Received" value={new Date(viewing.createdAt).toLocaleString()} />
            </div>
            <div>
              <p className="mb-1.5 font-medium text-ink">Message</p>
              <p className="rounded-xl border border-border bg-canvas p-3 text-muted">{viewing.message}</p>
            </div>
            <label className="block">
              <span className="mb-1.5 block font-medium text-ink">Status</span>
              <Select
                value={viewing.status}
                onChange={async (e) => {
                  await contactService.setStatus(viewing.id, e.target.value as ContactRequestStatus);
                  const updated = await contactService.getAll();
                  setItems(updated);
                  setViewing(updated.find((l) => l.id === viewing.id) ?? null);
                }}
              >
                <option value="new">New</option>
                <option value="in-progress">In progress</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </Select>
            </label>
            <label className="block">
              <span className="mb-1.5 block font-medium text-ink">Internal notes</span>
              <Textarea rows={3} value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} placeholder="Follow-up notes, call summary, next steps…" />
            </label>
            <div className="flex justify-end">
              <button
                onClick={async () => {
                  await contactService.setNotes(viewing.id, notesDraft);
                  await refresh();
                  setViewing(null);
                }}
                className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Save notes
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this lead?"
        message="This can't be undone."
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await contactService.remove(deleteTarget.id);
          setDeleteTarget(null);
          await refresh();
        }}
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-ink">{value}</p>
    </div>
  );
}
