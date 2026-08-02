import type { MetadataRoute } from "next";
import { getSiteSettings, getProjects, getBlogPosts } from "@/lib/data";

const routes = [
  "",
  "/services",
  "/industries",
  "/portfolio",
  "/testimonials",
  "/pricing",
  "/about",
  "/faq",
  "/blog",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const companyInfo = await getSiteSettings();
  const base = `https://${companyInfo.domain}`;
  const [projects, posts] = await Promise.all([getProjects(), getBlogPosts()]);

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/portfolio/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries, ...postEntries];
}
