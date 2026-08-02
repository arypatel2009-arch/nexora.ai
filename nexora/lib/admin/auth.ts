import type { AdminRole } from "@/lib/types";

// -----------------------------------------------------------------------
// MOCK ADMIN AUTH
// -----------------------------------------------------------------------
// Client-side session check ONLY — stops casual navigation into /admin,
// but is NOT secure (credentials and session are visible in the
// browser). Before going live, replace this file with Supabase Auth
// (supabase.auth.signInWithPassword + supabase.auth.resetPasswordForEmail)
// and gate /admin server-side (middleware.ts checking the Supabase
// session cookie, and admin_roles for role checks — see
// supabase/migrations/004_admin_roles.sql).
// -----------------------------------------------------------------------

const SESSION_KEY = "nexora_admin_session";

interface MockUser {
  email: string;
  password: string;
  role: AdminRole;
}

// Two seeded accounts demonstrating the Admin/Editor role split.
// Configurable via env for the primary admin account; still a mock.
const MOCK_USERS: MockUser[] = [
  {
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@nexora.ai",
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "nexora-admin",
    role: "admin",
  },
  {
    email: "editor@nexora.ai",
    password: "nexora-editor",
    role: "editor",
  },
];

export interface AdminSession {
  email: string;
  role: AdminRole;
  signedInAt: string;
}

export function checkCredentials(email: string, password: string): MockUser | null {
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  return user ?? null;
}

export function createSession(email: string, role: AdminRole) {
  if (typeof window === "undefined") return;
  const session: AdminSession = { email, role, signedInAt: new Date().toISOString() };
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Permission gate used by admin pages/components. Editors can create
 * and edit content but not delete it or touch Settings — Admins can do
 * everything. Adjust freely; this is intentionally simple until real
 * Supabase-backed roles (admin_roles table) take over.
 */
export function can(action: "delete" | "manage-settings" | "manage-roles", role: AdminRole | undefined): boolean {
  if (!role) return false;
  if (role === "admin") return true;
  return false; // editors: none of these
}

/**
 * Mock "forgot password" flow — in production this becomes
 * `supabase.auth.resetPasswordForEmail(email)`, which sends a real
 * email with a reset link. Here it just simulates the round-trip so
 * the UI/UX is fully built and ready to wire up.
 */
export async function requestPasswordReset(email: string): Promise<{ sent: boolean }> {
  await new Promise((r) => setTimeout(r, 500));
  return { sent: MOCK_USERS.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()) };
}
