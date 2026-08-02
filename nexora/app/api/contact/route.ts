import type { NextRequest } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { getSupabaseClient } from "@/lib/supabase/client";
import { jsonOk, jsonError, supabaseNotConfigured } from "@/lib/api/response";

// The public ContactForm currently calls contactService.submit() directly
// (works today via the local mock, or Supabase automatically once
// configured). This route exists for non-browser consumers — a future
// mobile app, a partner integration, etc. — and for when Supabase is
// connected, at which point both paths write to the same table.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.");
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const client = getSupabaseClient();
  if (!client) return supabaseNotConfigured();

  const { data, error } = await client
    .from("contact_requests")
    .insert({ ...parsed.data, status: "new", notes: "" })
    .select()
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonOk(data, 201);
}
