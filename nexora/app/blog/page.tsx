import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import BlogList from "@/components/BlogList";
import { getBlogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on AI automation for growing businesses — from the Nexora team.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="py-20">
      <div className="container-nexora">
        <SectionHeading
          eyebrow="Blog"
          title="Ideas on AI and business growth"
          center
        />
        <div className="mt-14">
          {posts.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="Our first articles are on the way."
              description="Practical, no-jargon posts on AI automation for small businesses — coming soon."
            />
          ) : (
            <BlogList posts={posts} />
          )}
        </div>
      </div>
    </div>
  );
}
