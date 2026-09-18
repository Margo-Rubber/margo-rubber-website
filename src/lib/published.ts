import { cacheTag } from "next/cache";
import { groq } from "next-sanity";
import { client } from "../../sanity/client";
import { isIndexable } from "@/lib/build-mode";
import { getAllSlugs, getStatus } from "@/lib/content";
import type { Collection } from "@/content/schemas";
import { COLLECTIONS_FOR_PAGES } from "@/lib/page-types";
import { NO_ROUTE, PAGE_PATH, pathFor } from "@/lib/published-paths";
import { industryTag } from "@/lib/industry-source";
import { legalTag } from "@/lib/legal-source";
import { pageTag } from "@/lib/page-source";
import { productTag } from "@/lib/product-source";
import { resourceTag } from "@/lib/resource-source";
import { skuTag } from "@/lib/sku-source";

/**
 * WHAT IS PUBLISHED — the one list the sitemaps and the hub ItemLists read.
 *
 * Status lives on the Sanity document when the page has one, and on the
 * .mdx file otherwise; the old sitemap read only the files, which is how it
 * came to be an empty urlset while 76 documents sat in the CMS. A route
 * appears here when its document's status passes `isIndexable` — the same
 * gate as the robots meta and the JSON-LD, so the three can never disagree.
 */

export type PublishedRoute = {
  path: string;
  type: string;
  slug: string;
  lastModified?: Date;
};

type Row = {
  _type: string;
  slug: string;
  status: string;
  category?: string;
  _updatedAt?: string;
};

const statusQuery = groq`
  *[defined(status) && defined(slug.current)]{
    _type, "slug": slug.current, status, category, _updatedAt
  }
`;

export async function publishedRoutes(): Promise<PublishedRoute[]> {
  "use cache";
  cacheTag(
    pageTag(),
    productTag(),
    industryTag(),
    resourceTag(),
    legalTag(),
    skuTag(),
  );

  const rows = await client.fetch<Row[]>(statusQuery).catch(() => []);
  const seen = new Set<string>();
  const out: PublishedRoute[] = [];

  for (const r of rows) {
    seen.add(`${r._type}:${r.slug}`);
    if (!isIndexable(r.status)) continue;
    const path = pathFor(r);
    if (!path) continue;
    out.push({
      path,
      type: r._type,
      slug: r.slug,
      lastModified: r._updatedAt ? new Date(r._updatedAt) : undefined,
    });
  }

  // Files the CMS does not know about yet answer for themselves.
  const mdx: { collection: string; type: string }[] = [
    { collection: "products", type: "productCategory" },
    { collection: "industries", type: "industry" },
    { collection: "resources", type: "resource" },
    { collection: "legal", type: "legal" },
    { collection: "skus", type: "sku" },
  ];
  for (const { collection, type } of mdx) {
    for (const slug of getAllSlugs(collection as Collection)) {
      if (seen.has(`${type}:${slug}`)) continue;
      if (!isIndexable(getStatus(collection, slug))) continue;
      const [category, part] =
        type === "sku" ? slug.split("--") : [undefined, slug];
      const path = pathFor({ _type: type, slug: part ?? slug, category });
      if (path) out.push({ path, type, slug });
    }
  }
  for (const [slug, { type }] of Object.entries(COLLECTIONS_FOR_PAGES)) {
    if (NO_ROUTE.has(slug) || seen.has(`${type}:${slug}`)) continue;
    if (!isIndexable(getStatus("pages", slug))) continue;
    out.push({ path: PAGE_PATH[slug], type, slug });
  }

  return out.sort((a, b) => a.path.localeCompare(b.path));
}
