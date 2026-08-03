import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function Card({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-xl2 border border-border bg-surface p-6 shadow-soft transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-brand-100 hover:shadow-premium",
        className
      )}
    >
      {children}
    </div>
  );
}