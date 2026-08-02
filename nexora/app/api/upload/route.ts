import type { NextRequest } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import { jsonOk, jsonError, supabaseNotConfigured } from "@/lib/api/response";

export const runtime = "nodejs";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

/**
 * Expects multipart/form-data with a single "file" field. On success,
 * uploads to the "media" Supabase Storage bucket (see
 * supabase/migrations/005_storage.sql) and records the public URL in
 * the media_assets table so it shows up in the Admin CMS's Media
 * Library module.
 */
export async function POST(request: NextRequest) {
  const client = getSupabaseClient();
  if (!client) return supabaseNotConfigured();

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return jsonError("No file provided. Send multipart/form-data with a 'file' field.");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return jsonError(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    return jsonError("File exceeds the 5MB limit.");
  }

  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const { error: uploadError } = await client.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return jsonError(uploadError.message, 500);

  const { data: publicUrlData } = client.storage.from("media").getPublicUrl(path);

  const { data, error } = await client
    .from("media_assets")
    .insert({
      fileName: file.name,
      url: publicUrlData.publicUrl,
      altText: "",
      mimeType: file.type,
      sizeBytes: file.size,
    })
    .select()
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonOk(data, 201);
}
