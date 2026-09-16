import type { MetadataRoute } from "next";
import { IS_VISION } from "@/lib/build-mode";
import { SITE_URL } from "@/lib/seo";
import { getPublishedSlugs } from "@/lib/content";

/**
 * /sitemap.xml
 *
 * Lists only pages whose content is marked `published`. That is the same
 * switch that controls `noindex` in buildMetadata and structured data in
 * shouldEmitSchema, so the three can never disagree: a page is either
 * indexable, in the sitemap and emitting schema, or it is none of the three.
 *
 * TODAY THIS IS EMPTY, and that is correct. All 76 content files are
 * `placeholder` pending Margo's copy. Submitting a sitemap full of pages that
 * each carry `noindex` is a contradiction Google reports as an error; an
 * empty sitemap is merely a site with nothing ready yet. Each page joins on
 * the day its content is signed off, with no code change.
 *
 * NO `lastModified`. It would have to come from `new Date()` or the
 * filesystem, and under `cacheComponents` a non-deterministic value fails the
 * prerender. A date that lies about when a page changed is also worse than no
 * date at all — Google treats a sitemap whose timestamps always say "now" as
 * untrustworthy and starts ignoring them.
 */

/** Static routes, with the priority they carry relative to each other. */
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1.0 },
  { path: "/products", priority: 0.9 },
  { path: "/industries", priority: 0.9 },
  { path: "/export", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/why-margo", priority: 0.7 },
  { path: "/certifications", priority: 0.7 },
  { path: "/case-studies", priority: 0.6 },
  { path: "/resources", priority: 0.6 },
  { path: "/contact", priority: 0.8 },
];

/**
 * Pages that must never appear even once published: a thank-you page has no
 * search intent behind it, and ranking for it would mean someone arriving at
 * a confirmation for a form they never submitted.
 */
const EXCLUDED = new Set(["/thank-you"]);

export default function sitemap(): MetadataRoute.Sitemap {
  // The vision build has nothing to offer a crawler: every page is noindex.
  if (IS_VISION) return [];
  const entries: MetadataRoute.Sitemap = [];

  // Static routes are gated on the matching page file in content/pages.
  const publishedPages = new Set(getPublishedSlugs("pages"));
  const pageSlugFor = (path: string) => (path === "/" ? "home" : path.slice(1));

  for (const { path, priority } of STATIC_ROUTES) {
    if (EXCLUDED.has(path)) continue;
    if (!publishedPages.has(pageSlugFor(path))) continue;
    entries.push({
      url: `${SITE_URL}${path}`,
      changeFrequency: "monthly",
      priority,
    });
  }

  // Collections. Each is filtered by its own content's status, so a single
  // signed-off product page can go live without waiting for the other ten.
  const collections: { collection: string; base: string; priority: number }[] = [
    { collection: "products", base: "/products", priority: 0.8 },
    { collection: "industries", base: "/industries", priority: 0.7 },
    { collection: "resources", base: "/resources", priority: 0.6 },
    { collection: "legal", base: "/legal", priority: 0.3 },
  ];

  for (const { collection, base, priority } of collections) {
    for (const slug of getPublishedSlugs(collection)) {
      entries.push({
        url: `${SITE_URL}${base}/${slug}`,
        changeFrequency: "monthly",
        priority,
      });
    }
  }

  // SKUs live under their category, so their URL needs both halves. The slug
  // encodes it as `category--part`.
  for (const slug of getPublishedSlugs("skus")) {
    const [category, part] = slug.split("--");
    if (!category || !part) continue;
    entries.push({
      url: `${SITE_URL}/products/${category}/${part}`,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
