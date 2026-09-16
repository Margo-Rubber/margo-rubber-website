import type { ContentStatus } from "@/content/site";
import { getSiteSettings } from "@/lib/settings";
import { SITE_URL } from "./seo";
import type { ProductCategory } from "@/content/schemas";

/**
 * JSON-LD @graph builders.
 *
 * Only fields we can actually stand behind are emitted. Blocked values in
 * site.ts are `null` and are omitted rather than guessed — a schema field with
 * an invented value is worse than a missing one for AI entity resolution.
 *
 * NEVER emit aggregateRating/review. That is the Asian Sealing / ARPL pattern
 * the research explicitly bans.
 */

type Node = Record<string, unknown>;

/**
 * The entity, from site settings — name, address, contact, founding date and
 * the ONE credential held. Nothing that is not held goes in any property,
 * and no Offer: Margo quotes per part, and a fabricated price or minimum is
 * a Merchant-listing violation the content sheets rule out.
 */
export async function organizationNode(): Promise<Node> {
  const { entity, certifications } = await getSiteSettings();
  const held = certifications.items.filter((c) => c.standing === "held");
  const node: Node = {
    "@type": ["Organization", "Manufacturer"],
    "@id": `${SITE_URL}/#organization`,
    name: entity.legalName,
    legalName: entity.legalName,
    url: SITE_URL,
    foundingDate: String(entity.foundingYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: entity.address.street,
      addressLocality: entity.address.locality,
      addressRegion: entity.address.region,
      postalCode: entity.address.postalCode,
      addressCountry: entity.address.country,
    },
    email: entity.email,
    telephone: entity.phone,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: entity.phone,
        email: entity.email,
        availableLanguage: ["en"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: entity.hoursSchema.days,
          opens: entity.hoursSchema.opens,
          closes: entity.hoursSchema.closes,
        },
      },
    ],
    location: {
      "@type": "Place",
      "@id": `${SITE_URL}/#plant`,
      name: `${entity.legalName} manufacturing plant`,
      geo: { "@type": "GeoCoordinates", latitude: entity.geo.lat, longitude: entity.geo.lng },
    },
    hasCredential: held.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: c.code,
      ...(c.identifier ? { identifier: c.identifier } : {}),
      ...(c.validThrough ? { validThrough: c.validThrough } : {}),
      ...(c.issuer ? { recognizedBy: { "@type": "Organization", name: c.issuer } } : {}),
    })),
  };
  if (entity.sameAs.length) node.sameAs = entity.sameAs;
  return node;
}

export function breadcrumbNode(
  crumbs: { name: string; path: string }[],
): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

export function faqNode(faqs: { q: string; a: string }[]): Node | null {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function productNode(fm: ProductCategory, path: string): Node {
  const materials = fm.materialSection?.items.map((m) => m.name) ?? [];

  return {
    "@type": "Product",
    "@id": `${SITE_URL}${path}#product`,
    name: fm.h1,
    description: fm.seo.description,
    ...(materials.length ? { material: materials } : {}),
    manufacturer: { "@id": `${SITE_URL}/#organization` },
    // No Offer, no price, no availability, no minimum: Margo quotes per part.
  };
}

/** The site itself. One node, emitted once, on the homepage only. */
export async function webSiteNode(): Promise<Node> {
  const { entity } = await getSiteSettings();
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: entity.legalName,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
    // No SearchAction: there is no site search, and declaring one that does
    // not exist is a broken promise Google can act on.
  };
}

/**
 * A single named part. Narrower than the category Product above — a SKU is a
 * specific item, so it gets `isSimilarTo` back to its category rather than
 * duplicating the category's claims.
 */
export function skuNode(
  fm: { h1: string; seo: { description: string }; productCode?: string },
  path: string,
  categoryPath: string,
): Node {
  return {
    "@type": "Product",
    "@id": `${SITE_URL}${path}#product`,
    name: fm.h1,
    description: fm.seo.description,
    ...(fm.productCode ? { sku: fm.productCode, mpn: fm.productCode } : {}),
    manufacturer: { "@id": `${SITE_URL}/#organization` },
    isSimilarTo: { "@id": `${SITE_URL}${categoryPath}#product` },
    // No Offer and no availability: the IN STOCK badge was a contradiction
    // in prose; as machine-readable data it would have been a false claim.
  };
}

/** A guide or article. Author is the organisation — these are not bylined. */
export function articleNode(
  fm: { h1: string; seo: { description: string } },
  path: string,
): Node {
  return {
    "@type": "TechArticle",
    "@id": `${SITE_URL}${path}#article`,
    headline: fm.h1,
    description: fm.seo.description,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
    // No datePublished: nothing in the content records one, and a date that
    // is really "when the build ran" is worse than none.
  };
}

/** A hub listing its children, in the order the page shows them. */
export function itemListNode(
  items: { name: string; path: string }[],
  path: string,
): Node | null {
  if (!items.length) return null;
  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}${path}#list`,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${SITE_URL}${it.path}`,
    })),
  };
}

/**
 * The general page graph.
 *
 * Every route composes from this rather than hand-assembling nodes, so the
 * Organization node is identical everywhere and the @id references between
 * nodes actually resolve. `type` picks the page-level node; everything else
 * is opt-in.
 */
export async function pageGraph(opts: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  path: string;
  name: string;
  description: string;
  crumbs?: { name: string; path: string }[];
  faqs?: { q: string; a: string }[];
  extra?: (Node | null)[];
  /** The homepage, and only the homepage, declares the WebSite node. */
  isHome?: boolean;
}): Promise<Record<string, unknown>> {
  const nodes: Node[] = [await organizationNode()];
  if (opts.isHome) nodes.push(await webSiteNode());

  nodes.push({
    "@type": opts.type ?? "WebPage",
    "@id": `${SITE_URL}${opts.path}#page`,
    url: `${SITE_URL}${opts.path}`,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  });

  if (opts.crumbs?.length) nodes.push(breadcrumbNode(opts.crumbs));
  if (opts.faqs?.length) {
    const faq = faqNode(opts.faqs);
    if (faq) nodes.push(faq);
  }
  for (const n of opts.extra ?? []) if (n) nodes.push(n);

  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Assembles the full @graph for a product category page. */
export async function productCategoryGraph(fm: ProductCategory, path: string) {
  const nodes: Node[] = [await organizationNode()];

  if (fm.schemaTypes.includes("BreadcrumbList")) {
    nodes.push(
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: fm.navLabel, path },
      ]),
    );
  }
  if (fm.schemaTypes.includes("Product")) nodes.push(productNode(fm, path));
  if (fm.schemaTypes.includes("FAQPage")) {
    const faq = faqNode(fm.faqs);
    if (faq) nodes.push(faq);
  }

  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Placeholder pages must not emit schema — it would assert fake data. */
export function shouldEmitSchema(status: ContentStatus) {
  return status === "published";
}
