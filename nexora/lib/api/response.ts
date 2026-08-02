import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/** Standard response when a route needs Supabase but it isn't configured yet. */
export function supabaseNotConfigured() {
  return jsonError(
    "Supabase isn't configured yet. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, run lib/supabase/schema.sql (or supabase/migrations), then this route activates automatically.",
    501
  );
}
