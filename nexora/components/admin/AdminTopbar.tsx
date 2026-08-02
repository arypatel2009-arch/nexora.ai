"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Moon, Sun, LogOut, User } from "lucide-react";
import { useAdminSession } from "@/lib/admin/session-context";
import { useAdminTheme } from "@/lib/admin/theme-context";
import { clearSession } from "@/lib/admin/auth";
import { contactService } from "@/lib/services/contact.service";
import { cn } from "@/lib/utils";

export default function AdminTopbar() {
  const session = useAdminSession();
  const { theme, toggle } = useAdminTheme();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [newLeadCount, setNewLeadCount] = useState(0);

  useEffect(() => {
    contactService.getAll().then((leads) => {
      setNewLeadCount(leads.filter((l) => l.status === "new").length);
    });
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6 dark:border-white/10 dark:bg-[#0E1424]">
      <div className="relative w-full max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          placeholder="Search everything…"
          className="admin-input pl-10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-brand-50 dark:text-white/60 dark:hover:bg-white/10"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-muted transition-colors hover:bg-brand-50 dark:text-white/60 dark:hover:bg-white/10"
          >
            <Bell size={18} />
            {newLeadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {newLeadCount > 9 ? "9+" : newLeadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl2 border border-border bg-white p-2 shadow-premium dark:border-white/10 dark:bg-[#151B2E]">
              {newLeadCount > 0 ? (
                <button
                  onClick={() => {
                    setNotifOpen(false);
                    router.push("/admin/contact-requests");
                  }}
                  className="flex w-full items-start gap-2 rounded-lg p-3 text-left text-sm hover:bg-brand-50 dark:hover:bg-white/5"
                >
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <span className="text-ink dark:text-white/90">
                    {newLeadCount} new lead{newLeadCount === 1 ? "" : "s"} waiting for a response
                  </span>
                </button>
              ) : (
                <p className="p-3 text-sm text-muted dark:text-white/50">You&apos;re all caught up.</p>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-3 transition-colors hover:bg-brand-50 dark:hover:bg-white/10"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
              {session?.email.charAt(0).toUpperCase() ?? <User size={14} />}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium text-ink dark:text-white/90">{session?.email}</span>
              <span className="block text-xs capitalize text-muted dark:text-white/50">{session?.role}</span>
            </span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl2 border border-border bg-white p-1.5 shadow-premium dark:border-white/10 dark:bg-[#151B2E]">
              <button
                onClick={() => {
                  clearSession();
                  router.push("/admin/login");
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                )}
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
