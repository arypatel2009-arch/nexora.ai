"use client";

import { createContext, useContext } from "react";
import type { AdminSession } from "@/lib/admin/auth";

export const AdminSessionContext = createContext<AdminSession | null>(null);

export function useAdminSession() {
  return useContext(AdminSessionContext);
}
