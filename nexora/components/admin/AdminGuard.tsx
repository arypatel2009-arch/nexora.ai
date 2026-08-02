"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, type AdminSession } from "@/lib/admin/auth";
import { AdminSessionContext } from "@/lib/admin/session-context";
import type { ReactNode } from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const current = getSession();
    if (!current) {
      router.replace("/admin/login");
      return;
    }
    setSession(current);
    setChecked(true);
  }, [router]);

  if (!checked || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <div className="skeleton h-10 w-10 rounded-full" />
      </div>
    );
  }

  return <AdminSessionContext.Provider value={session}>{children}</AdminSessionContext.Provider>;
}
