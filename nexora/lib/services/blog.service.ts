import type { BlogPost } from "@/lib/types";
import { blogPostsSeed } from "@/lib/seed/blog.seed";
import { createEntityService } from "./entity-service";

export const blogService = createEntityService<BlogPost>("blog_posts", "blog-posts", blogPostsSeed);

const WORDS_PER_MINUTE = 200;

export function computeReadingTime(markdownBody: string): number {
  const words = markdownBody.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function findRelatedPosts(
  post: BlogPost,
  allPosts: BlogPost[],
  limit = 3
): BlogPost[] {
  return allPosts
    .filter((p) => p.id !== post.id && p.status === "published")
    .filter((p) => p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
    .slice(0, limit);
}

export function searchBlogPosts(posts: BlogPost[], query: string): BlogPost[] {
  const q = query.trim().toLowerCase();
  if (!q) return posts;
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
  );
}
