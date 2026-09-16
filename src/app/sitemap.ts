import type { MetadataRoute } from "next";
import { IS_VISION } from "@/lib/build-mode";
import { SITE_URL } from "@/lib/seo";
import { publishedRoutes } from "@/lib/published";

/**
 * /sitemap.xml — every published document except the product tree, which
 * has its own file at /products/sitemap/0.xml (content sheet 01: 29 URLs
 * here, the categories and parts there). Both are listed in robots.txt.
 *
 * "Published" is the document's own status, read from the CMS with the
 * checked-in file as fallback — the same gate as the robots meta and the
 * structured data, so a URL is never in the sitemap while its page says
 * noindex. Pages not yet signed off are simply absent, which is the point:
 * a sitemap of 40 thin URLs is how the old site came to have 43 indexed and
 * 3 ranking.
 */

const PRIORITY: Record<string, number> = {
  "/": 1.0,
  "/products": 0.9,
  "/industries": 0.9,
  "/export": 0.8,
  "/contact": 0.8,
  "/about": 0.7,
  "/why-margo": 0.7,
  "/certifications": 0.7,
  "/case-studies": 0.6,
  "/resources": 0.6,
};
const TYPE_PRIORITY: Record<string, number> = {
  industry: 0.7,
  resource: 0.6,
  legal: 0.3,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The vision build has nothing to offer a crawler: every page is noindex.
  if (IS_VISION) return [];

  const routes = await publishedRoutes();
  return routes
    .filter((r) => r.type !== "productCategory" && r.type !== "sku")
    .map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: r.lastModified,
      changeFrequency: "monthly" as const,
      priority: PRIORITY[r.path] ?? TYPE_PRIORITY[r.type] ?? 0.5,
    }));
}
