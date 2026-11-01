import { cacheTag } from "next/cache";
import { groq } from "next-sanity";
import { client } from "../../sanity/client";
import { pageTag } from "@/lib/page-source";
import { industryTag } from "@/lib/industry-source";
import { productTag } from "@/lib/product-source";

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

const industryQuery = groq`*[_type == "industry" && slug.current == $slug][0]{
  navLabel,
  "url": catalogue.file.asset->url
}`;

/**
 * ONE INDUSTRY'S CATALOGUE PDF, with the main catalogue as the fallback.
 *
 * Each industry page offers its own catalogue (uploaded on the Industry
 * document in Studio). Until one is uploaded, the page offers the main
 * catalogue from the Products page, so the button never leads nowhere.
 *
 * Used by the page (the in-browser download) and by the enquiry endpoint
 * (the link in the buyer's email). The endpoint looks the address up here
 * rather than trusting one sent by the browser, so the email can never be
 * made to carry someone else's link.
 */
export async function getIndustryCatalogueFileUrl(slug: string): Promise<string | undefined> {
  "use cache";
  cacheTag(industryTag(slug), industryTag(), pageTag("products"), pageTag());

  const doc = await client
    .fetch<{ navLabel?: string; url?: string } | null>(industryQuery, { slug })
    .catch(() => null);
  if (doc?.url) {
    const name = `Margo-Rubber-${(doc.navLabel ?? slug).replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "")}-Catalogue.pdf`;
    return `${doc.url}?dl=${encodeURIComponent(name)}`;
  }
  return getCatalogueFileUrl();
}

const productQuery = groq`*[_type == "productCategory" && slug.current == $slug][0]{
  navLabel,
  "url": catalogue.file.asset->url,
  "heading": catalogue.heading,
  "body": catalogue.body
}`;

export type ProductCatalogue = { url: string; navLabel?: string; heading?: string; body?: string };

/**
 * ONE PRODUCT LINE'S CATALOGUE PDF (Nov 2026), uploaded on the Product
 * category document in Studio. Unlike an industry page there is no fallback:
 * a category page without its own PDF shows no catalogue section.
 */
export async function getProductCatalogue(slug: string): Promise<ProductCatalogue | undefined> {
  "use cache";
  cacheTag(productTag(slug), productTag());

  const doc = await client
    .fetch<{ navLabel?: string; url?: string; heading?: string; body?: string } | null>(productQuery, { slug })
    .catch(() => null);
  if (!doc?.url) return undefined;
  const name = `Margo-Rubber-${(doc.navLabel ?? slug).replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "")}-Catalogue.pdf`;
  return {
    url: `${doc.url}?dl=${encodeURIComponent(name)}`,
    navLabel: doc.navLabel,
    heading: doc.heading ?? undefined,
    body: doc.body ?? undefined,
  };
}

/**
 * The PDF a catalogue enquiry asked for, worked out from the page it was sent
 * from: an industry page gets that industry's catalogue, a product category
 * page its own, anywhere else the main one.
 */
export async function catalogueUrlForPage(page: string): Promise<string | undefined> {
  const m = page.match(/^\/industries\/([a-z0-9-]+)\/?(?:[?#].*)?$/);
  if (m) return getIndustryCatalogueFileUrl(m[1]);
  const p = page.match(/^\/products\/([a-z0-9-]+)\/?(?:[?#].*)?$/);
  if (p) {
    const own = await getProductCatalogue(p[1]);
    if (own) return own.url;
  }
  return getCatalogueFileUrl();
}
