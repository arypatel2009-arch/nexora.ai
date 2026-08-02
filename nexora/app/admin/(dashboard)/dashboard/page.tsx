"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Workflow, Building2, FolderKanban, MessagesSquare, HelpCircle, Newspaper, Users, Inbox, Briefcase, ImageIcon, AlertCircle } from "lucide-react";
import { servicesService } from "@/lib/services/services.service";
import { industriesService } from "@/lib/services/industries.service";
import { projectsService } from "@/lib/services/projects.service";
import { testimonialsService } from "@/lib/services/testimonials.service";
import { faqsService } from "@/lib/services/faqs.service";
import { blogService } from "@/lib/services/blog.service";
import { teamService } from "@/lib/services/team.service";
import { contactService } from "@/lib/services/contact.service";
import { careersService } from "@/lib/services/careers.service";
import { mediaService } from "@/lib/services/media.service";
import { useAdminSession } from "@/lib/admin/session-context";

const tiles = [
  { key: "services", label: "Services", href: "/admin/services", icon: Workflow },
  { key: "industries", label: "Industries", href: "/admin/industries", icon: Building2 },
  { key: "projects", label: "Portfolio Projects", href: "/admin/portfolio", icon: FolderKanban },
  { key: "reviews", label: "Testimonials", href: "/admin/reviews", icon: MessagesSquare },
  { key: "faqs", label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { key: "posts", label: "Blog Posts", href: "/admin/blog", icon: Newspaper },
  { key: "team", label: "Team Members", href: "/admin/team", icon: Users },
  { key: "careers", label: "Open Roles", href: "/admin/careers", icon: Briefcase },
  { key: "media", label: "Media Assets", href: "/admin/media", icon: ImageIcon },
  { key: "requests", label: "New Leads", href: "/admin/contact-requests", icon: Inbox },
] as const;

export default function AdminDashboardPage() {
  const session = useAdminSession();
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [partialError, setPartialError] = useState(false);

  useEffect(() => {
    async function load() {
      const [
        servicesResult,
        industriesResult,
        projectsResult,
        testimonialsResult,
        faqsResult,
        postsResult,
        teamResult,
        careersResult,
        mediaResult,
        requestsResult,
      ] = await Promise.allSettled([
        servicesService.getAll(),
        industriesService.getAll(),
        projectsService.getAll(),
        testimonialsService.getAll(),
        faqsService.getAll(),
        blogService.getAll(),
        teamService.getAll(),
        careersService.getAll(),
        mediaService.getAll(),
        contactService.getAll(),
      ]);

      const countOf = (result: PromiseSettledResult<{ length: number }>) =>
        result.status === "fulfilled" ? result.value.length : 0;

      const anyFailed = [
        servicesResult,
        industriesResult,
        projectsResult,
        testimonialsResult,
        faqsResult,
        postsResult,
        teamResult,
        careersResult,
        mediaResult,
        requestsResult,
      ].some((result) => result.status === "rejected");

      setCounts({
        services: countOf(servicesResult),
        industries: countOf(industriesResult),
        projects: countOf(projectsResult),
        reviews: countOf(testimonialsResult),
        faqs: countOf(faqsResult),
        posts: countOf(postsResult),
        team: countOf(teamResult),
        careers: countOf(careersResult),
        media: countOf(mediaResult),
        requests:
          requestsResult.status === "fulfilled"
            ? requestsResult.value.filter((r) => r.status === "new").length
            : 0,
      });
      setPartialError(anyFailed);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-white">
        Welcome back{session ? `, ${session.email.split("@")[0]}` : ""}
      </h1>
      <p className="mt-1 text-sm text-muted dark:text-white/50">
        A snapshot of everything currently in your content store.
      </p>

      {partialError && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10">
          <AlertCircle size={16} className="shrink-0" />
          Some counts couldn&apos;t be loaded — refresh to try again.
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.key}
            href={tile.href}
            className="rounded-xl2 border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-premium dark:border-white/10 dark:bg-[#111827] dark:hover:border-brand-500/30"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/15">
              <tile.icon size={18} className="text-brand-500 dark:text-brand-300" aria-hidden="true" />
            </span>
            <p className="mt-4 text-2xl font-bold text-ink dark:text-white">
              {counts ? counts[tile.key] : <span className="skeleton inline-block h-7 w-8 rounded" />}
            </p>
            <p className="mt-1 text-sm text-muted dark:text-white/50">{tile.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl2 border border-dashed border-border bg-white p-6 text-sm text-muted dark:border-white/10 dark:bg-[#111827] dark:text-white/50">
        Every count above reads through the same repository layer every
        module uses — if Supabase is configured, this reflects your live
        database, shared across every device and every visitor.
      </div>
    </div>
  );
}
