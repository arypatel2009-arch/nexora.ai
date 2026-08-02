"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { AdminThemeProvider } from "@/lib/admin/theme-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminThemeProvider>
        <div className="flex min-h-screen bg-canvas dark:bg-[#0A0F1D]">
          <AdminSidebar />
          <div className="flex flex-1 flex-col">
            <AdminTopbar />
            <main className="flex-1 overflow-y-auto p-6 sm:p-10">
              <div className="mx-auto max-w-6xl">{children}</div>
            </main>
          </div>
        </div>
      </AdminThemeProvider>
    </AdminGuard>
  );
}
