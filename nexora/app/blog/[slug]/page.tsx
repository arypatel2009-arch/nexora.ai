import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import { getBlogPostBySlug, getBlogPosts, getSiteSettings } from "@/lib/data";
import { computeReadingTime, findRelatedPosts } from "@/lib/services/blog.service";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seo.metaTitle || post.title,
    description: post.seo.metaDescription || post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getBlogPosts();
  const related = findRelatedPosts(post, allPosts);
  const companyInfo = await getSiteSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@type": "Organization", name: companyInfo.companyName },
    datePublished: post.publishedAt,
  };

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-nexora max-w-2xl">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
          <ArrowLeft size={15} /> Back to blog
        </Link>

        <span className="mt-6 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
          {post.category}
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tightest text-ink sm:text-4xl">{post.title}</h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          <span>{post.author.name}{post.author.role ? ` · ${post.author.role}` : ""}</span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {computeReadingTime(post.body)} min read
          </span>
        </div>

        <div className="prose prose-sm mt-10 max-w-none whitespace-pre-line leading-relaxed text-muted">
          {post.body}
        </div>

        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-canvas px-3 py-1 text-xs font-medium text-muted">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Related articles</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`}>
                  <Card>
                    <h3 className="text-sm font-semibold text-ink">{r.title}</h3>
                    <p className="mt-2 text-xs text-muted">{r.excerpt}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
