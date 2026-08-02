"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Workflow,
  Building2,
  FolderKanban,
  BookOpen,
  MessagesSquare,
  HelpCircle,
  Newspaper,
  Users,
  Inbox,
  Briefcase,
  ImageIcon,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearSession } from "@/lib/admin/auth";
import { useAdminSession } from "@/lib/admin/session-context";

const nav = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, adminOnly: false },
  { href: "/admin/services", label: "Services", icon: Workflow, adminOnly: false },
  { href: "/admin/industries", label: "Industries", icon: Building2, adminOnly: false },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderKanban, adminOnly: false },
  { href: "/admin/case-studies", label: "Case Studies", icon: BookOpen, adminOnly: false },
  { href: "/admin/reviews", label: "Testimonials", icon: MessagesSquare, adminOnly: false },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, adminOnly: false },
  { href: "/admin/blog", label: "Blog Posts", icon: Newspaper, adminOnly: false },
  { href: "/admin/team", label: "Team Members", icon: Users, adminOnly: false },
  { href: "/admin/careers", label: "Careers", icon: Briefcase, adminOnly: false },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon, adminOnly: false },
  { href: "/admin/contact-requests", label: "Leads", icon: Inbox, adminOnly: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, adminOnly: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAdminSession();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-white dark:border-white/10 dark:bg-[#0E1424]">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-6 dark:border-white/10">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
          <Sparkles size={16} aria-hidden="true" />
        </span>
        <span className="font-display text-base font-bold tracking-tightest dark:text-white">
          Nexora <span className="font-normal text-muted dark:text-white/40">Admin</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {nav
          .filter((item) => !item.adminOnly || session?.role === "admin")
          .map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"
                    : "text-muted hover:bg-canvas hover:text-ink dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
                )}
              >
                <item.icon size={17} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="border-t border-border p-3 dark:border-white/10">
        <button
          onClick={() => {
            clearSession();
            router.push("/admin/login");
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-red-50 hover:text-red-600 dark:text-white/50 dark:hover:bg-red-500/10"
        >
          <LogOut size={17} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
