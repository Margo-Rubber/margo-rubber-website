import { cacheLife, cacheTag } from "next/cache";
import { groq } from "next-sanity";
import { client } from "../../sanity/client";
import { pageTag } from "@/lib/page-source";

/**
 * THE CATALOGUE PDF, LOOKED UP ON ITS OWN SHORT CLOCK.
 *
 * The rest of the Products page is cached until the publish webhook clears
 * it. That is right for copy, but it meant an uploaded catalogue did not
 * appear until a webhook fired — and none fires on localhost, or before the
 * webhook is registered against the live domain. Editors upload a file and
 * expect the button to work, so this one value is re-checked every minute
 * whatever the webhook does. Still tagged, so a webhook clears it at once.
 *
 * The asset URL comes straight from Sanity rather than being rebuilt from the
 * reference, and `?dl=` makes the CDN send it as a download under a clean name.
 */
const query = groq`*[_type == "productsHub"][0].catalogue.file.asset->url`;

export async function getCatalogueFileUrl(): Promise<string | undefined> {
  "use cache";
  cacheLife("minutes");
  cacheTag(pageTag("products"), pageTag());

  const url = await client.fetch<string | null>(query).catch(() => null);
  if (!url) return undefined;
  return `${url}?dl=${encodeURIComponent("Margo-Rubber-Catalogue.pdf")}`;
}
