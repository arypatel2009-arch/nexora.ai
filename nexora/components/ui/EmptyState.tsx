import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

export default function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-xl3 border border-dashed border-border bg-brand-50/40 px-8 py-16 text-center transition-shadow duration-500 hover:shadow-soft">
      <span className="flex h-12 w-12 animate-floaty items-center justify-center rounded-full bg-white shadow-premium">
        <Icon size={22} className="text-brand-500" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}
