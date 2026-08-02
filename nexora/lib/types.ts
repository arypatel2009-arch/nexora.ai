// These types mirror the future Supabase schema 1:1.
// Every content section on the site — and every Admin CMS module — reads
// through the service layer in lib/services/*.ts, which goes through
// lib/repositories/get-repository.ts. Locally (no Supabase env vars) that
// resolves to a shared JSON file store (lib/repositories/file-store.ts)
// so Admin and the public site read/write the same data; set the
// Supabase env vars and it switches to real Postgres automatically.

export type AdminRole = "admin" | "editor";

export interface AdminUser {
  email: string;
  role: AdminRole;
}

export type PublishStatus = "draft" | "published";

export interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  outcomes: string[];
  icon: string; // lucide-react icon name, resolved client-side only
  availability: "live" | "coming-soon";
  status: PublishStatus;
  order: number;
}

export interface Industry {
  id: string;
  slug: string;
  name: string;
  painPoint: string;
  solution: string;
  icon: string;
  status: PublishStatus;
  order: number;
}

export const PROJECT_CATEGORIES = [
  "Automation",
  "Chatbot",
  "Website",
  "Advertising",
  "Consulting",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface ProjectResult {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  category: ProjectCategory;
  summary: string;
  body: string; // markdown — full case study content
  results: ProjectResult[];
  coverImage: string | null;
  gallery: string[];
  status: PublishStatus;
  publishedAt: string | null;
}

export interface CaseStudy {
  id: string;
  projectId: string; // links to Project.id
  challenge: string;
  approach: string;
  outcome: string;
  status: PublishStatus;
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  avatar: string | null;
  rating: number;
  status: PublishStatus;
}

export interface PricingPlan {
  id: string;
  slug: string;
  name: string;
  price: string;
  billingNote: string;
  description: string;
  features: string[];
  highlighted: boolean;
  status: PublishStatus;
  order: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: PublishStatus;
  order: number;
}

export interface SeoFields {
  metaTitle: string;
  metaDescription: string;
}

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // markdown
  category: string;
  tags: string[];
  author: BlogAuthor;
  featuredImage: string | null;
  seo: SeoFields;
  status: PublishStatus;
  publishedAt: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string | null;
  status: PublishStatus;
  order: number;
}

export type ContactRequestStatus = "new" | "in-progress" | "resolved" | "archived";

export interface ContactRequest {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  budget: string;
  message: string;
  status: ContactRequestStatus;
  notes: string;
  createdAt: string;
}

export type CareerType = "full-time" | "part-time" | "contract" | "internship";

export interface CareerListing {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: CareerType;
  description: string;
  requirements: string[];
  status: PublishStatus;
  order: number;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  altText: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  founder: string;
  email: string;
  phone: string;
  domain: string;
  primaryCta: string;
  secondaryCta: string;
}
