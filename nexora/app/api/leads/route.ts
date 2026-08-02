import type { NextRequest } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import { jsonOk, jsonError, supabaseNotConfigured } from "@/lib/api/response";

// NOTE: this route returns lead data and should be protected by an
// authenticated (admin/editor) session once real auth is wired in —
// see lib/admin/auth.ts and the README's Auth section. Today the Admin
// CMS reads leads through lib/services/contact.service.ts directly in
// the browser; this route is the server-side equivalent for future use
// (e.g. a separate ops dashboard, scheduled exports, Zapier/n8n).
export async function GET() {
  const client = getSupabaseClient();
  if (!client) return supabaseNotConfigured();

  const { data, error } = await client
    .from("contact_requests")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) return jsonError(error.message, 500);
  return jsonOk(data);
}

export async function PATCH(request: NextRequest) {
  const client = getSupabaseClient();
  if (!client) return supabaseNotConfigured();

  let body: { id?: string; status?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.");
  }

  if (!body.id) return jsonError("Missing lead id.");

  const patch: Record<string, string> = {};
  if (body.status) patch.status = body.status;
  if (body.notes !== undefined) patch.notes = body.notes;

  const { data, error } = await client
    .from("contact_requests")
    .update(patch)
    .eq("id", body.id)
    .select()
    .maybeSingle();

  if (error) return jsonError(error.message, 500);
  return jsonOk(data);
}
