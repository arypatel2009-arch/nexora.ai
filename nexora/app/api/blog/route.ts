import { getBlogPosts, getBlogPostBySlug } from "@/lib/data";
import { jsonOk, jsonError } from "@/lib/api/response";

// Thin wrapper around lib/data.ts so external consumers (a future
// mobile app, RSS generator, etc.) get exactly the same published
// content as the website — seed-backed today, Supabase-backed once
// lib/data.ts is pointed at it.
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");

  if (slug) {
    const post = await getBlogPostBySlug(slug);
    if (!post) return jsonError("Post not found.", 404);
    return jsonOk(post);
  }

  const posts = await getBlogPosts();
  return jsonOk(posts);
}
