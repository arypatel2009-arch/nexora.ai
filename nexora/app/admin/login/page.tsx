"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Lock, Mail, AlertCircle } from "lucide-react";
import { checkCredentials, createSession, getSession } from "@/lib/admin/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace("/admin/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 400)); // simulate network round-trip
    const user = checkCredentials(email, password);
    if (user) {
      createSession(user.email, user.role);
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect email or password.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-mesh px-4">
      <div className="w-full max-w-sm rounded-xl3 border border-border bg-white p-8 shadow-premium">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-ink">Nexora Admin</h1>
          <p className="mt-1.5 text-sm text-muted">Sign in to manage your site.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Email</span>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input pl-10"
                placeholder="admin@nexora.ai"
                autoComplete="username"
              />
            </div>
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Password</span>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input pl-10"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </label>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center">
            <Link href="/admin/forgot-password" className="text-sm font-medium text-brand-500 hover:text-brand-600">
              Forgot your password?
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Demo accounts:
          <br />
          Admin — <code className="rounded bg-canvas px-1.5 py-0.5">admin@nexora.ai</code> / <code className="rounded bg-canvas px-1.5 py-0.5">nexora-admin</code>
          <br />
          Editor — <code className="rounded bg-canvas px-1.5 py-0.5">editor@nexora.ai</code> / <code className="rounded bg-canvas px-1.5 py-0.5">nexora-editor</code>
          <br />
          Replace with Supabase Auth before going live.
        </p>
      </div>
    </div>
  );
}
