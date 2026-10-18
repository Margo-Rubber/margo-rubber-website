import type { MetadataRoute } from "next";
import { IS_VISION } from "@/lib/build-mode";
import { SITE_URL } from "@/lib/seo";
import { publishedRoutes } from "@/lib/published";
import { getSkuPage } from "@/lib/sku-source";
import { getCategoryPage } from "@/lib/product-source";
import { imageUrl } from "@/lib/schema";

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

  const routes = (await publishedRoutes()).filter(
    (r) => r.type === "productCategory" || r.type === "sku",
  );
  // T23: each entry lists its main photo (<image:image>), so Google Images
  // ties the photograph to the page. A part's own photo, a category's hero.
  return Promise.all(
    routes.map(async (r) => {
      let slot: string | undefined;
      if (r.type === "sku") slot = (await getSkuPage(r.slug))?.frontmatter.gallery.main;
      else slot = (await getCategoryPage(r.slug))?.frontmatter.hero?.image;
      const img = slot ? await imageUrl(slot) : null;
      return {
        url: `${SITE_URL}${r.path}`,
        lastModified: r.lastModified,
        changeFrequency: "monthly" as const,
        priority: r.type === "productCategory" ? 0.8 : 0.5,
        ...(img ? { images: [img.replace(/&/g, "&amp;")] } : {}),
      };
    }),
  );
}
