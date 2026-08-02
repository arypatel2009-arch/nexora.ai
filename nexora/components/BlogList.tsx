"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { searchBlogPosts, computeReadingTime } from "@/lib/services/blog.service";
import Card from "@/components/ui/Card";

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => searchBlogPosts(posts, query), [posts, query]);

  return (
    <div>
      <div className="relative mx-auto max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles…"
          className="admin-input pl-10"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="h-full">
              <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                {post.category}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{post.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                <Clock size={13} /> {computeReadingTime(post.body)} min read
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted">No articles match &ldquo;{query}&rdquo;.</p>
      )}
    </div>
  );
}
