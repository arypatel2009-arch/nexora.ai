import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import { getProjectBySlug, getProjects } from "@/lib/data";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="py-20">
      <div className="container-nexora max-w-3xl">
        <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
          <ArrowLeft size={15} /> Back to portfolio
        </Link>

        <span className="mt-6 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
          {project.category}
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tightest text-ink sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {project.client} · {project.industry}
        </p>
        <p className="mt-6 text-lg leading-relaxed text-muted">{project.summary}</p>

        {project.results.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {project.results.map((r) => (
              <div key={r.label} className="rounded-xl2 border border-border bg-white p-4 text-center">
                <p className="text-xl font-bold text-brand-500">{r.value}</p>
                <p className="mt-1 text-xs text-muted">{r.label}</p>
              </div>
            ))}
          </div>
        )}

        {project.body && (
          <div className="prose prose-sm mt-10 max-w-none whitespace-pre-line leading-relaxed text-muted">
            {project.body}
          </div>
        )}

        <div className="mt-12">
          <Button href="/contact" size="lg">Start a project like this</Button>
        </div>
      </div>
    </div>
  );
}
