"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { requestPasswordReset } from "@/lib/admin/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await requestPasswordReset(email);
    setLoading(false);
    // Always show success regardless of whether the email matched — this
    // avoids leaking which emails have admin accounts, same as a real
    // Supabase Auth reset flow would.
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-mesh px-4">
      <div className="w-full max-w-sm rounded-xl3 border border-border bg-white p-8 shadow-premium">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-ink">Reset your password</h1>
          <p className="mt-1.5 text-sm text-muted">
            {sent
              ? "Check your inbox for a reset link."
              : "Enter your admin email and we'll send a reset link."}
          </p>
        </div>

        {sent ? (
          <div className="mt-8 flex flex-col items-center rounded-xl2 border border-brand-100 bg-brand-50 p-6 text-center">
            <CheckCircle2 size={22} className="text-accent-teal" />
            <p className="mt-3 text-sm text-muted">
              If <span className="font-medium text-ink">{email}</span> has an
              admin account, a reset link is on its way.
            </p>
          </div>
        ) : (
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
                />
              </div>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center">
          <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
