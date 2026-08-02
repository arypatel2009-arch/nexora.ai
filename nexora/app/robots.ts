import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const companyInfo = await getSiteSettings();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${companyInfo.domain}/sitemap.xml`,
  };
}
