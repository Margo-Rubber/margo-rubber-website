import { cacheTag } from "next/cache";
import { client } from "../../sanity/client";
import { resourceBySlugQuery, resourceSlugsQuery } from "../../sanity/queries";
import { getAllSlugs, getContent } from "@/lib/content";
import { stripNullsDeep } from "@/content/blocks";
import { resourceSchema, type Resource } from "@/content/schemas";
import { hasProse, type ProseValue } from "@/components/blocks/Prose";

/**
 * WHERE A RESOURCE GUIDE COMES FROM
 *
 * Sanity if the document exists there; the .mdx file otherwise. Fifth page
 * type, same seam.
 *
 * The difference here is the BODY. Every other type moved existing content;
 * these eight guides have none — the .mdx files carry a comment explaining
 * that the engineering copy has to come from Margo. So this seam serves two
 * shapes of body and the route renders whichever it gets:
 *
 *   from Sanity — portable text, written in Studio
 *   from .mdx   — a compiled MDX component, which is currently always empty
 *
 * Neither one being present is the normal case today, and the route already
 * has an honest "this guide is being written" state for it.
 */

export const resourceTag = (slug?: string) =>
  slug ? `resource:${slug}` : "resource";

export type ResourcePage = {
  frontmatter: Resource;
  /** Portable text, when the guide was written in the CMS. */
  prose?: ProseValue;
  /** The compiled .mdx body, for guides not yet migrated. */
  Content?: React.ComponentType;
  /** True when there is real article content from EITHER source. */
  hasBody: boolean;
  source: "sanity" | "mdx";
};

async function fromSanity(slug: string): Promise<ResourcePage | null> {
  "use cache";
  cacheTag(resourceTag(slug), resourceTag());

  const raw = await client.fetch(resourceBySlugQuery, { slug });
  if (!raw) return null;

  const clean = stripNullsDeep(raw) as Record<string, unknown>;
  // `body` is portable text, not part of the .mdx schema — held aside so the
  // frontmatter validates against exactly the same schema the files use.
  const { body, ...rest } = clean;

  const parsed = resourceSchema.safeParse(rest);
  if (!parsed.success) {
    console.error(
      `[resource] Sanity document "${slug}" failed validation:`,
      parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    );
    return null;
  }

  return {
    frontmatter: parsed.data as Resource,
    prose: body as ProseValue,
    hasBody: hasProse(body),
    source: "sanity",
  };
}

async function fromMdx(slug: string): Promise<ResourcePage | null> {
  try {
    const { frontmatter, Content, hasBody } = await getContent("resources", slug);
    return { frontmatter, Content, hasBody, source: "mdx" };
  } catch {
    return null;
  }
}

export async function getResourcePage(slug: string): Promise<ResourcePage | null> {
  const cms = await fromSanity(slug).catch(() => null);
  if (cms) return cms;
  return fromMdx(slug);
}

export async function resourceSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(resourceTag());

  const fromCms = await client.fetch<string[]>(resourceSlugsQuery).catch(() => []);
  return [...new Set([...getAllSlugs("resources"), ...fromCms])];
}

/**
 * Every guide's frontmatter, from the CMS with the file as fallback — the
 * hub's cards. The hub used to read the .mdx files directly, so a card
 * edited in the Studio never reached it.
 */
export async function listResources(): Promise<Resource[]> {
  const slugs = await resourceSlugs();
  const pages = await Promise.all(slugs.map((slug) => getResourcePage(slug)));
  return pages.filter((p): p is ResourcePage => !!p).map((p) => p.frontmatter);
}
