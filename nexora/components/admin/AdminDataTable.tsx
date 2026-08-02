"use client";

import { useMemo, useState } from "react";
import { Search, Pencil, Trash2, Eye, EyeOff, PlusCircle, AlertCircle } from "lucide-react";
import { useAdminSession } from "@/lib/admin/session-context";
import { can } from "@/lib/admin/auth";

export interface AdminColumn<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface AdminDataTableProps<T extends { id: string }> {
  title: string;
  description?: string;
  rows: T[];
  columns: AdminColumn<T>[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  onCreate?: () => void;
  createLabel?: string;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onTogglePublish?: (row: T) => void;
  isPublished?: (row: T) => boolean;
  emptyTitle: string;
  emptyDescription: string;
  pageSize?: number;
}

export default function AdminDataTable<T extends { id: string }>({
  title,
  description,
  rows,
  columns,
  loading,
  error,
  onRetry,
  searchPlaceholder = "Search…",
  searchFilter,
  onCreate,
  createLabel = "Add new",
  onEdit,
  onDelete,
  onTogglePublish,
  isPublished,
  emptyTitle,
  emptyDescription,
  pageSize = 8,
}: AdminDataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const session = useAdminSession();
  const canDelete = can("delete", session?.role);

  const filtered = useMemo(() => {
    if (!query.trim() || !searchFilter) return rows;
    return rows.filter((row) => searchFilter(row, query.trim().toLowerCase()));
  }, [rows, query, searchFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-white">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted dark:text-white/50">{description}</p>}
        </div>
        {onCreate && (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600"
          >
            <PlusCircle size={16} /> {createLabel}
          </button>
        )}
      </div>

      {searchFilter && (
        <div className="relative mt-6 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="admin-input pl-10"
          />
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl2 border border-border bg-white dark:border-white/10 dark:bg-[#111827]">
        {error ? (
          <div className="flex flex-col items-center gap-3 px-8 py-16 text-center">
            <AlertCircle size={22} className="text-red-500" />
            <p className="text-sm text-muted dark:text-white/50">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
              >
                Try again
              </button>
            )}
          </div>
        ) : loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <h3 className="text-base font-semibold text-ink dark:text-white">{emptyTitle}</h3>
            <p className="mt-2 max-w-sm text-sm text-muted dark:text-white/50">{emptyDescription}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-canvas/60 text-xs uppercase tracking-wide text-muted dark:border-white/10 dark:bg-white/5 dark:text-white/40">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className={`px-5 py-3 font-semibold ${col.className ?? ""}`}>
                      {col.label}
                    </th>
                  ))}
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 hover:bg-canvas/40 dark:border-white/10 dark:hover:bg-white/5">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-5 py-3.5 align-middle text-ink dark:text-white/80 ${col.className ?? ""}`}>
                        {col.render(row)}
                      </td>
                    ))}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onTogglePublish && isPublished && (
                          <button
                            onClick={() => onTogglePublish(row)}
                            title={isPublished(row) ? "Unpublish" : "Publish"}
                            className="rounded-lg p-2 text-muted transition-colors hover:bg-brand-50 hover:text-brand-600"
                          >
                            {isPublished(row) ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(row)}
                          title="Edit"
                          className="rounded-lg p-2 text-muted transition-colors hover:bg-brand-50 hover:text-brand-600"
                        >
                          <Pencil size={16} />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            title="Delete"
                            className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filtered.length > pageSize && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            Page {currentPage} of {totalPages} · {filtered.length} total
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
