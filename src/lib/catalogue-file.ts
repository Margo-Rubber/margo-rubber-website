import { cacheTag } from "next/cache";
import { groq } from "next-sanity";
import { client } from "../../sanity/client";
import { pageTag } from "@/lib/page-source";

/**
 * THE CATALOGUE PDF.
 *
 * Previously re-checked every minute (cacheLife("minutes")) as a stopgap
 * before the publish webhook was live. That made /products re-render and
 * write to Vercel ISR storage once a minute while crawled, so it now follows
 * the same rule as everything else: cached until the webhook clears
 * page:products. On localhost, run `npm run revalidate products --type productsHub`.
 *
 * The asset URL comes straight from Sanity rather than being rebuilt from the
 * reference, and `?dl=` makes the CDN send it as a download under a clean name.
 */
const query = groq`*[_type == "productsHub"][0].catalogue.file.asset->url`;

export async function getCatalogueFileUrl(): Promise<string | undefined> {
  "use cache";
  cacheTag(pageTag("products"), pageTag());

  const url = await client.fetch<string | null>(query).catch(() => null);
  if (!url) return undefined;
  return `${url}?dl=${encodeURIComponent("Margo-Rubber-Catalogue.pdf")}`;
}
