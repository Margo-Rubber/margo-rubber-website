import { revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { legalTag } from "@/lib/legal-source";
import { productTag } from "@/lib/product-source";
import { industryTag } from "@/lib/industry-source";
import { skuTag } from "@/lib/sku-source";
import { resourceTag } from "@/lib/resource-source";
import { pageTag } from "@/lib/page-source";
import { imageOverrideTag } from "@/lib/image-overrides";

/**
 * POST /api/revalidate
 *
 * Sanity calls this the moment anything is published. It invalidates the
 * cache entry for the affected document and nothing else, so one edit
 * rebuilds one page rather than the whole site.
 *
 * SIGNATURE, NOT A SECRET IN THE URL. Sanity signs the body with a shared
 * secret and sends the signature in a header; we verify it against the raw
 * body. A token in a query string ends up in logs, referrer headers and
 * browser history — a signature does not, and it also proves the body was
 * not altered in transit.
 *
 * Unconfigured fails closed: with no secret set there is no way to tell a
 * real webhook from anyone who found the URL, and an open invalidation
 * endpoint is a free way to make a site rebuild every page on demand.
 */

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return json({ ok: false, message: "Revalidation is not configured." }, 503);
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) return json({ ok: false, message: "Unsigned." }, 401);

  // Read once, as text: the signature is over the exact bytes sent, so the
  // body cannot be parsed first and re-serialised.
  const body = await request.text();
  if (!(await isValidSignature(body, signature, secret))) {
    return json({ ok: false, message: "Bad signature." }, 401);
  }

  let payload: { _type?: string; slug?: { current?: string } | string };
  try {
    payload = JSON.parse(body);
  } catch {
    return json({ ok: false, message: "Expected a JSON body." }, 400);
  }

  const slug =
    typeof payload.slug === "string" ? payload.slug : payload.slug?.current;

  /**
   * Document type → the tag factory for that collection.
   *
   * A table rather than a chain of ifs, because this grows to seventeen
   * entries as the migration proceeds and every one of them does exactly the
   * same two things.
   */
  const TAGS: Record<string, (slug?: string) => string> = {
    legal: legalTag,
    productCategory: productTag,
    industry: industryTag,
    sku: skuTag,
    resource: resourceTag,
    // The one-off marketing pages all share one tag family, keyed by slug.
    resourcesHub: pageTag,
    industriesHub: pageTag,
    contactPage: pageTag,
    utilityPage: pageTag,
    certificationsPage: pageTag,
    caseStudiesPage: pageTag,
    exportPage: pageTag,
    productsHub: pageTag,
    homePage: pageTag,
    whyMargoPage: pageTag,
    aboutPage: pageTag,
    siteFooter: pageTag,
    // Site settings feed the footer, every CTA and the compound tables, so a
    // publish here invalidates every collection at once — see below.
    siteSettings: pageTag,
    // Every page draws images, so a new photograph clears the whole map.
    imageOverride: imageOverrideTag,
  };

  const tagFor = payload._type ? TAGS[payload._type] : undefined;

  const tags: string[] = [];
  if (payload._type === "siteSettings") {
    // The settings are read by the footer, every CTA, the structured data
    // and the compound tables — there is no page they do not touch. One
    // publish here rebuilds every collection rather than guessing which.
    tags.push(pageTag(), productTag(), industryTag(), skuTag(), resourceTag(), legalTag());
  } else if (tagFor) {
    // The collection tag covers generateStaticParams and any list of these
    // pages; the per-slug tag covers the page itself.
    tags.push(tagFor());
    if (slug) tags.push(tagFor(slug));
  }

  if (!tags.length) {
    // A document type this route does not know about yet. Not an error —
    // more types arrive as the migration proceeds.
    return json({ ok: true, revalidated: [], type: payload._type ?? null }, 200);
  }

  for (const tag of tags) revalidateTag(tag, "max");

  return json({ ok: true, revalidated: tags }, 200);
}
