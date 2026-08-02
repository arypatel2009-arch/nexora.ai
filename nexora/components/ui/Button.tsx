import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
}

export default function Button({
  href,
  onClick,
  variant = "primary",
  size = "md",
  children,
  className,
  type = "button",
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-400 ease-premium will-change-transform",
    size === "lg" ? "px-7 py-3.5 text-base" : "px-5 py-2.5 text-sm",
    variant === "primary" &&
      "bg-brand-500 text-white shadow-glow hover:bg-brand-600 hover:shadow-premium-hover hover:-translate-y-0.5 active:translate-y-0",
    variant === "secondary" &&
      "bg-white text-ink border border-border hover:border-brand-300 hover:bg-brand-50 hover:-translate-y-0.5",
    variant === "ghost" && "text-ink hover:bg-brand-50",
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
