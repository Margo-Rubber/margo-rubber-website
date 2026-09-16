// Relative, not "@/": scripts/check-jsonld.mts imports this file under plain node.
import { COLLECTIONS_FOR_PAGES } from "./page-types.ts";

/**
 * DOCUMENT → URL. Which route a CMS document answers for, from its type,
 * slug and (for a part) its category. Pure, so the sitemap, the hub lists
 * and `check:jsonld` all use the one mapping and cannot drift.
 */

/** Sanity type → route base; the marketing pages map through page-types. */
const COLLECTION_BASE: Record<string, string> = {
  productCategory: "/products",
  industry: "/industries",
  resource: "/resources",
  legal: "/legal",
};

export const PAGE_PATH: Record<string, string> = { home: "/" };
for (const slug of Object.keys(COLLECTIONS_FOR_PAGES)) {
  if (!(slug in PAGE_PATH)) PAGE_PATH[slug] = `/${slug}`;
}
/** Documents with no public route, or that must never be listed. */
export const NO_ROUTE = new Set([
  "settings",
  "footer",
  "not-found",
  "thank-you",
]);

export function pathFor(row: {
  _type: string;
  slug: string;
  category?: string;
}): string | null {
  if (row._type === "sku") {
    // A part's slug is stored as `category--part`; the URL carries the part only.
    const part = row.slug.split("--").pop();
    return row.category && part ? `/products/${row.category}/${part}` : null;
  }
  if (row._type in COLLECTION_BASE)
    return `${COLLECTION_BASE[row._type]}/${row.slug}`;
  const page = Object.entries(COLLECTIONS_FOR_PAGES).find(
    ([, v]) => v.type === row._type,
  );
  if (!page) return null;
  const slug = page[1].type === "utilityPage" ? row.slug : page[0];
  if (NO_ROUTE.has(slug)) return null;
  return PAGE_PATH[slug] ?? null;
}
