import type { PublishStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function StatusBadge({ status }: { status: PublishStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "published" ? "bg-accent-teal/10 text-accent-teal" : "bg-brand-50 text-muted"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "published" ? "bg-accent-teal" : "bg-muted"
        )}
      />
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}
