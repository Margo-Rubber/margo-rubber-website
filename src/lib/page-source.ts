import { cacheTag } from "next/cache";
import { groq } from "next-sanity";
import type { z } from "zod";
import { client } from "../../sanity/client";
import { getPage } from "@/lib/content";
import { stripNullsDeep } from "@/content/blocks";
import { COLLECTIONS_FOR_PAGES } from "@/lib/page-types";

/**
 * WHERE A ONE-OFF PAGE COMES FROM
 *
 * The marketing pages — home, about, the hubs, contact, the utility pages and
 * the footer — are each their own shape, and each exists exactly once. That
 * makes them the simplest seam on the site and the most tedious page type to
 * model: twelve schemas, no leverage.
 *
 * One function serves all of them, because the differences between these pages
 * live entirely in their schemas and not at all in how they are loaded. The
 * route passes the same Zod schema it always did; this tries Sanity first and
 * falls back to the .mdx file, exactly as the other four seams do.
 *
 * The projection is generic — `{..., "slug": slug.current}` — because there is
 * nothing to reshape. These pages have no block lists, no joined-in
 * collections and no arrays-inside-arrays. Whatever the document holds is what
 * the template wants.
 */

export const pageTag = (slug?: string) => (slug ? `page:${slug}` : "page");

/**
 * Which Sanity type answers for which slug — DERIVED, not repeated.
 *
 * The same map already exists in page-types.ts, where the migration writer and
 * `check:cms` read it. A second copy here would be one more thing to remember
 * when a page is migrated, and the failure it produces is silent: the page
 * simply keeps serving from its file while everything reports success.
 */
const TYPE_FOR: Record<string, string> = Object.fromEntries(
  Object.entries(COLLECTIONS_FOR_PAGES).map(([slug, e]) => [slug, e.type]),
);

/**
 * The one exception to "nothing to reshape": a FILE field arrives as a bare
 * `{ asset: { _ref } }`, so the certificate PDF is dereferenced here to its
 * CDN url and file metadata. A missing upload, or a reference to an asset
 * that no longer exists, projects to null — stripped before validation, so
 * the page falls back to the certificate card instead of breaking.
 */
const query = groq`
  *[_type == $type && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    _type == "aboutPage" => {
      "clients": clients{
        ...,
        "logos": logos[]{
          client,
          alt,
          "asset": asset->{ url, "w": metadata.dimensions.width, "h": metadata.dimensions.height }
        }
      }
    },
    _type == "certificationsPage" => {
      "certificate": certificate{
        ...,
        "document": document{
          title,
          orientation,
          "asset": asset->{ url, originalFilename, size, mimeType, extension }
        }
      }
    }
  }
`;

/**
 * ONLY SERIALISABLE ARGUMENTS CROSS THIS BOUNDARY.
 *
 * `"use cache"` means Next has to serialise this function's arguments to build
 * the cache key, so a Zod schema cannot be one of them — it becomes what the
 * production build calls "a temporary client reference", and dotting into it
 * throws. The schema is therefore looked up HERE, from the slug, rather than
 * handed in.
 *
 * Worth knowing because dev never complained: the failure appears only in a
 * production build, which is the last place anyone looks.
 */
async function fromSanity(
  slug: string,
  type: string,
): Promise<unknown | null> {
  "use cache";
  cacheTag(pageTag(slug), pageTag());

  const raw = await client.fetch(query, { type, slug });
  if (!raw) return null;

  const schema = COLLECTIONS_FOR_PAGES[slug]?.schema;
  if (!schema) return null;

  const parsed = schema.safeParse(stripNullsDeep(raw));
  if (!parsed.success) {
    // A fallback renders identically, so this log is the only runtime signal.
    // `npm run check:cms` is what actually asserts the source.
    console.error(
      `[page] Sanity document "${slug}" failed validation:`,
      parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    );
    return null;
  }
  return parsed.data;
}

/**
 * Drop-in replacement for `getPage`.
 *
 * Same signature deliberately: swapping a route over is one changed import,
 * which is what keeps thirteen separate page migrations from becoming thirteen
 * separate opportunities to break a live page.
 */
export async function getSitePage<S extends z.ZodTypeAny>(
  slug: string,
  schema: S,
): Promise<z.infer<S>> {
  const type = TYPE_FOR[slug];

  if (type) {
    const cms = await fromSanity(slug, type).catch(() => null);
    if (cms) return cms as z.infer<S>;
  }

  return getPage(slug, schema);
}
