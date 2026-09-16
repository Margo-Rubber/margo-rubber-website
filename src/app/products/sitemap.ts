import type { MetadataRoute } from "next";
import { IS_VISION } from "@/lib/build-mode";
import { SITE_URL } from "@/lib/seo";
import { publishedRoutes } from "@/lib/published";

/**
 * /products/sitemap/0.xml — the product tree: published categories and the
 * parts beneath them. Split from the main sitemap (content sheet 01) so the
 * catalogue can grow past the 31 parts without crowding the page list, and
 * so Search Console reports the two halves separately.
 */
export async function generateSitemaps() {
  return [{ id: 0 }];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (IS_VISION) return [];

  const routes = await publishedRoutes();
  return routes
    .filter((r) => r.type === "productCategory" || r.type === "sku")
    .map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: r.lastModified,
      changeFrequency: "monthly" as const,
      priority: r.type === "productCategory" ? 0.8 : 0.5,
    }));
}
