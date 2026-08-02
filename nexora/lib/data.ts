import { servicesService } from "@/lib/services/services.service";
import { industriesService } from "@/lib/services/industries.service";
import { projectsService } from "@/lib/services/projects.service";
import { testimonialsService } from "@/lib/services/testimonials.service";
import { pricingService } from "@/lib/services/pricing.service";
import { faqsService } from "@/lib/services/faqs.service";
import { blogService } from "@/lib/services/blog.service";
import { teamService } from "@/lib/services/team.service";
import { careersService } from "@/lib/services/careers.service";
import { settingsService } from "@/lib/services/settings.service";
import { siteSettingsSeed } from "@/lib/seed/site-settings.seed";
import type {
  Service,
  Industry,
  Project,
  Testimonial,
  PricingPlan,
  FaqItem,
  BlogPost,
  TeamMember,
  CareerListing,
  SiteSettings,
} from "./types";

// -----------------------------------------------------------------------
// PUBLIC SITE DATA LAYER
// -----------------------------------------------------------------------
// Every getter reads through the same entity service the Admin CMS uses
// (lib/services/*.ts), which in turn goes through
// lib/repositories/get-repository.ts — Supabase automatically when
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set,
// local mock storage otherwise. This is what makes "publish in Admin →
// appears on the site" true: both read and write the same table.
//
// Each getter is wrapped in try/catch so a transient Supabase error
// degrades to the existing empty state instead of crashing the page —
// it does not silently invent content, it just renders nothing extra.
// -----------------------------------------------------------------------

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;
const published = <T extends { status: string }>(items: T[]) =>
  items.filter((i) => i.status === "published");
const byPublishedDesc = <T extends { publishedAt: string | null }>(a: T, b: T) =>
  new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime();

async function safeGetAll<T>(fn: () => Promise<T[]>, label: string): Promise<T[]> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[lib/data] Failed to load ${label}:`, error);
    return [];
  }
}

export async function getServices(): Promise<Service[]> {
  const services = await safeGetAll(() => servicesService.getAll(), "services");
  return published(services).sort(byOrder);
}

export async function getIndustries(): Promise<Industry[]> {
  const industries = await safeGetAll(() => industriesService.getAll(), "industries");
  return published(industries).sort(byOrder);
}

// Real client projects only — an empty result (or a Supabase error)
// still renders the designed empty state rather than inventing one.
export async function getProjects(): Promise<Project[]> {
  const projects = await safeGetAll(() => projectsService.getAll(), "projects");
  return published(projects).sort(byPublishedDesc);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

// Real client testimonials only.
export async function getTestimonials(): Promise<Testimonial[]> {
  const testimonials = await safeGetAll(() => testimonialsService.getAll(), "testimonials");
  return published(testimonials);
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const plans = await safeGetAll(() => pricingService.getAll(), "pricing plans");
  return published(plans).sort(byOrder);
}

export async function getFaqs(): Promise<FaqItem[]> {
  const faqs = await safeGetAll(() => faqsService.getAll(), "FAQs");
  return published(faqs).sort(byOrder);
}

// Real posts only — no invented articles even on fetch failure.
export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await safeGetAll(() => blogService.getAll(), "blog posts");
  return published(posts).sort(byPublishedDesc);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const team = await safeGetAll(() => teamService.getAll(), "team members");
  return published(team).sort(byOrder);
}

export async function getCareers(): Promise<CareerListing[]> {
  const careers = await safeGetAll(() => careersService.getAll(), "careers");
  return published(careers).sort(byOrder);
}

/**
 * Live site settings (company name, tagline, contact info, CTA copy).
 * Falls back to the seed defaults on error so metadata/footer/contact
 * details never render blank.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await settingsService.get();
  } catch (error) {
    console.error("[lib/data] Failed to load site settings:", error);
    return siteSettingsSeed;
  }
}

// Static default — used only as the initial render value in Client
// Components (Navbar, Hero) before their live fetch resolves, so there's
// no flash of empty content. Server Component pages should use
// getSiteSettings() above instead of this.
export const companyInfo = siteSettingsSeed;
