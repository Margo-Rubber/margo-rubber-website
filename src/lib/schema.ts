import type { ContentStatus } from "@/content/site";
import { getSiteSettings } from "@/lib/settings";
import type { SiteSettings } from "@/content/schemas/settings";
import { getImageOverrides } from "@/lib/image-overrides";
import { IMAGES, type ImageKey } from "@/content/images";
import {
  INDUSTRIES,
  PRODUCTS,
  productBySlug,
  type RouteEntry,
} from "@/content/routes";
import { SITE_URL } from "./seo";
import type { Industry, ProductCategory } from "@/content/schemas";

/**
 * JSON-LD @graph builders — content sheets 01–35, "Schema" sections.
 *
 * ONE ENTITY. The Organization node is emitted in full on the homepage and
 * nowhere else; every other page refers to it by @id. Repeating the block
 * per page creates forty competing entity definitions, which is what the
 * old site's structured data would have done had it emitted any.
 *
 * Only what is held goes in. No Offer, price, availability, AggregateRating
 * or Review anywhere — Margo quotes per part and has no reviews to
 * aggregate. hasCredential carries ISO 9001:2015 only: schema has no
 * vocabulary for "in progress", so an in-progress certification in
 * structured data reads as a held one. Customers are prose, never
 * Organization.customer. Every figure comes from Site settings, so the
 * graph cannot disagree with the page.
 */

type Node = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PLANT_ID = `${SITE_URL}/#plant`;
export const CATALOG_ID = `${SITE_URL}/#product-catalog`;
export const COMPOUNDS_ID = `${SITE_URL}/#compounds`;

/** The reference every page uses instead of restating the entity. */
export const organizationRef = (): Node => ({ "@id": ORG_ID });

const pageId = (path: string) =>
  `${SITE_URL}${path === "/" ? "/" : path}#webpage`;
const personId = (name: string) =>
  `${SITE_URL}/about#${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/** Slot → absolute URL, honouring a Studio override. */
async function imageUrl(slot: string): Promise<string | null> {
  const overrides = await getImageOverrides();
  if (overrides[slot]?.url) return overrides[slot].url;
  const stock = IMAGES[slot as ImageKey];
  return stock ? `${SITE_URL}${stock.src}` : null;
}

/* ── The entity — homepage only ─────────────────────────────────────────── */

/**
 * Organization + Manufacturer. Address, contact, hours and area served from
 * settings; the one held credential; founders by reference to the Person
 * nodes on /about; the plant by reference to the Place node.
 */
export async function organizationNode(): Promise<Node> {
  const { entity, certifications } = await getSiteSettings();
  const held = certifications.items.filter((c) => c.standing === "held");
  const contactPoint: Node = {
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
  };
  if (entity.areaServed.length) contactPoint.areaServed = entity.areaServed;

  const node: Node = {
    "@type": ["Organization", "Manufacturer"],
    "@id": ORG_ID,
    name: entity.legalName,
    legalName: entity.legalName,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}${IMAGES["brand.logo"].src}`,
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
    contactPoint: [contactPoint],
    location: { "@id": PLANT_ID },
    hasCredential: held.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: c.code,
      ...(c.identifier ? { identifier: c.identifier } : {}),
      ...(c.validThrough ? { validThrough: c.validThrough } : {}),
      ...(c.issuer
        ? { recognizedBy: { "@type": "Organization", name: c.issuer } }
        : {}),
    })),
  };
  if (entity.description) node.description = entity.description;
  if (entity.knowsAbout.length) node.knowsAbout = entity.knowsAbout;
  if (entity.sameAs.length) node.sameAs = entity.sameAs;
  if (entity.founders.length)
    node.founder = entity.founders.map((f) => ({ "@id": personId(f.name) }));
  return node;
}

/** The plant, as its own node, so the address is stated once and linked. */
export async function placeNode(): Promise<Node> {
  const { entity } = await getSiteSettings();
  return {
    "@type": "Place",
    "@id": PLANT_ID,
    name: `${entity.legalName} manufacturing plant`,
    address: { "@id": ORG_ID },
    geo: {
      "@type": "GeoCoordinates",
      latitude: entity.geo.lat,
      longitude: entity.geo.lng,
    },
  };
}

/** The site itself. One node, emitted once, on the homepage only. */
export async function webSiteNode(): Promise<Node> {
  const { entity } = await getSiteSettings();
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: entity.legalName,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
    // No SearchAction: there is no site search, and declaring one that does
    // not exist is a broken promise Google can act on.
  };
}

/**
 * The product lines, once, on the homepage — sheet 01 §05. The hub refers
 * to it as its mainEntity rather than emitting a second catalogue. Only
 * built pages are listed: an unbuilt line links to the contact form, and a
 * catalogue entry whose url is a form is not a product.
 */
export function offerCatalogNode(): Node {
  const live = PRODUCTS.filter((p) => p.live);
  return {
    "@type": "OfferCatalog",
    "@id": CATALOG_ID,
    name: "Rubber component product lines",
    provider: { "@id": ORG_ID },
    numberOfItems: live.length,
    itemListElement: live.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        "@id": `${SITE_URL}${p.path}#product`,
        name: p.label,
        url: `${SITE_URL}${p.path}`,
        manufacturer: { "@id": ORG_ID },
      },
      // No price, no availability — see the file comment.
    })),
  };
}

/** The eight compounds as a vocabulary tied to the entity — sheet 01 §10. */
export async function compoundTermSetNode(): Promise<Node[]> {
  const { compounds } = await getSiteSettings();
  return [
    {
      "@type": "DefinedTermSet",
      "@id": COMPOUNDS_ID,
      name: "Elastomer compounds",
    },
    ...compounds.map((c) => ({
      "@type": "DefinedTerm",
      "@id": `${COMPOUNDS_ID}-${c.code.toLowerCase()}`,
      name: c.fullName,
      termCode: c.code,
      description: c.descriptor,
      inDefinedTermSet: { "@id": COMPOUNDS_ID },
    })),
  ];
}

/** The Incoterms Margo trades under — sheet 06 §06, same pattern as the compounds. */
export function incotermsTermSetNode(
  terms: readonly { code: string; name: string; body: string }[],
): Node[] {
  if (!terms.length) return [];
  const id = `${SITE_URL}/export#incoterms`;
  return [
    { "@type": "DefinedTermSet", "@id": id, name: "Incoterms offered" },
    ...terms.map((t) => ({
      "@type": "DefinedTerm",
      "@id": `${id}-${t.code.toLowerCase()}`,
      name: t.name,
      termCode: t.code,
      description: t.body,
      inDefinedTermSet: { "@id": id },
    })),
  ];
}

/** A commercial process as an ordered list — not HowTo, which is for the reader's own instructions. */
export function processListNode(
  steps: readonly { name: string; body: string }[],
  path: string,
  name: string,
): Node | null {
  if (!steps.length) return null;
  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}${path === "/" ? "/" : path}#process`,
    name,
    itemListOrder: "ItemListOrderAscending",
    numberOfItems: steps.length,
    itemListElement: steps.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      description: s.body,
    })),
    isPartOf: { "@id": pageId(path) },
  };
}

/** The named people on /about — sheet 03. Referenced from Organization.founder. */
export async function personNodes(): Promise<Node[]> {
  const { entity } = await getSiteSettings();
  return entity.founders.map((f) => ({
    "@type": "Person",
    "@id": personId(f.name),
    name: f.name,
    jobTitle: f.role,
    worksFor: { "@id": ORG_ID },
    ...(f.knowsAbout.length ? { knowsAbout: f.knowsAbout } : {}),
  }));
}

/** The page's hero as an ImageObject, for WebPage.primaryImageOfPage. */
export async function heroImageNode(
  slot: string,
  path: string,
): Promise<Node | null> {
  const url = await imageUrl(slot);
  if (!url) return null;
  return {
    "@type": "ImageObject",
    "@id": `${SITE_URL}${path === "/" ? "/" : path}#hero-image`,
    contentUrl: url,
    url,
  };
}

/* ── Per-page nodes ─────────────────────────────────────────────────────── */

export function breadcrumbNode(
  crumbs: { name: string; path: string }[],
  path?: string,
): Node {
  const last = crumbs.length - 1;
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${path ?? crumbs[last]?.path ?? "/"}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      // The current page needs no item: the crawler is already on it.
      ...(i < last ? { item: `${SITE_URL}${c.path}` } : {}),
    })),
  };
}

/** FAQPage from the same field the page renders — never a separate copy. */
export function faqNode(
  faqs: readonly { q: string; a: string }[],
  path?: string,
): Node | null {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    ...(path ? { "@id": `${SITE_URL}${path}#faq` } : {}),
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

const FAMILY_CATEGORY: Record<NonNullable<RouteEntry["family"]>, string> = {
  Sealing: "Rubber sealing components",
  "Anti-Vibration": "Anti-vibration rubber components",
  Protection: "Protective rubber components",
  Profiles: "Extruded rubber profiles",
  Custom: "Custom rubber components",
  Cellular: "Cellular rubber products",
};

/**
 * A product line — sheet 09, one shape for all categories. `material` lists
 * all eight compounds from settings, not the few the page happens to show:
 * it is the property an assistant reads to answer "which compounds does
 * this supplier offer for O-rings?".
 */
export async function productNode(
  fm: ProductCategory,
  path: string,
): Promise<Node> {
  const { compounds } = await getSiteSettings();
  const entry = productBySlug(path.split("/").pop() ?? "");
  const related = fm.related.products
    .map((slug) => productBySlug(slug))
    .filter((p): p is RouteEntry => !!p && p.live)
    .map((p) => ({ "@id": `${SITE_URL}${p.path}#product` }));
  return {
    "@type": "Product",
    "@id": `${SITE_URL}${path}#product`,
    name: fm.h1,
    description: fm.seo.description,
    manufacturer: { "@id": ORG_ID },
    material: compounds.map((c) => c.name),
    ...(entry?.family ? { category: FAMILY_CATEGORY[entry.family] } : {}),
    ...(related.length ? { isRelatedTo: related } : {}),
    // No Offer, no price, no availability, no minimum: Margo quotes per part.
  };
}

/**
 * A sector page describes what Margo does for the sector — Service, not
 * Product, so the eleven categories are not duplicated as twenty entities.
 * areaServed is inherited from the Organization, never redeclared.
 */
export function serviceNode(fm: Industry, path: string): Node {
  return {
    "@type": "Service",
    "@id": `${SITE_URL}${path}#service`,
    name: fm.h1,
    description: fm.seo.description,
    provider: { "@id": ORG_ID },
    serviceType: "Custom rubber component manufacturing",
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
  /** The sibling parts the page lists under "You may also need" — sheet 32 §11. */
  siblingPaths: readonly string[] = [],
): Node {
  const category = productBySlug(categoryPath.split("/").pop() ?? "");
  return {
    "@type": "Product",
    "@id": `${SITE_URL}${path}#product`,
    name: fm.h1,
    description: fm.seo.description,
    ...(fm.productCode ? { sku: fm.productCode, mpn: fm.productCode } : {}),
    ...(category ? { category: category.label } : {}),
    manufacturer: { "@id": ORG_ID },
    // Siblings when the page lists them; the category otherwise. Never a
    // material list yet: today's compounds are a category default, not a
    // fact about the part (sheet 32).
    isSimilarTo: siblingPaths.length
      ? siblingPaths.map((p) => ({ "@id": `${SITE_URL}${p}#product` }))
      : { "@id": `${SITE_URL}${categoryPath}#product` },
    // No Offer and no availability: the IN STOCK badge was a contradiction
    // in prose; as machine-readable data it would have been a false claim.
  };
}

/**
 * A guide — TechArticle, because these are specification references for
 * engineers. Emitted only once the article is published (the page gate),
 * and reviewedBy only once a reviewer is named in settings.
 */
export async function articleNode(
  fm: { h1: string; seo: { description: string }; publishedAt?: string },
  path: string,
): Promise<Node> {
  const { guideReviewer } = await getSiteSettings();
  return {
    "@type": "TechArticle",
    "@id": `${SITE_URL}${path}#article`,
    headline: fm.h1,
    description: fm.seo.description,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
    ...(guideReviewer.name
      ? {
          reviewedBy: {
            "@type": "Person",
            name: guideReviewer.name,
            jobTitle: guideReviewer.role,
          },
        }
      : {}),
    // datePublished only when the guide records one — never the build date.
    ...(fm.publishedAt ? { datePublished: fm.publishedAt, dateModified: fm.publishedAt } : {}),
  };
}

/** A hub listing its children, in the order the page shows them. */
export function itemListNode(
  items: readonly { name: string; path: string }[],
  path: string,
  name?: string,
): Node | null {
  if (!items.length) return null;
  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}${path}#list`,
    ...(name ? { name } : {}),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${SITE_URL}${it.path}`,
    })),
  };
}

/** The eleven sectors, built ones only, for the industries hub. */
export function industriesListNode(): Node | null {
  return itemListNode(
    INDUSTRIES.filter((i) => i.live).map((i) => ({
      name: i.label,
      path: i.path,
    })),
    "/industries",
    "Industries served",
  );
}

/* ── The graph ──────────────────────────────────────────────────────────── */

/**
 * The general page graph.
 *
 * Every route composes from this rather than hand-assembling nodes, so the
 * @id references between nodes actually resolve. The homepage — and only
 * the homepage — carries the Organization, WebSite, Place, OfferCatalog and
 * compound vocabulary; every other page's node points at them.
 */
export async function pageGraph(opts: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  path: string;
  name: string;
  description: string;
  crumbs?: { name: string; path: string }[];
  faqs?: readonly { q: string; a: string }[];
  /** The page node's mainEntity, by reference. */
  mainEntity?: Node;
  /** Hero image slot, for primaryImageOfPage. */
  heroSlot?: string;
  /** ISO date the page was last revised (legal pages). */
  dateModified?: string;
  extra?: (Node | null)[];
  /** The homepage, and only the homepage, declares the entity nodes. */
  isHome?: boolean;
}): Promise<Record<string, unknown>> {
  const nodes: Node[] = [];
  if (opts.isHome) {
    nodes.push(
      await organizationNode(),
      await webSiteNode(),
      await placeNode(),
    );
  }

  const hero = opts.heroSlot
    ? await heroImageNode(opts.heroSlot, opts.path)
    : null;
  const page: Node = {
    "@type": opts.type ?? "WebPage",
    "@id": pageId(opts.path),
    // Next resolves the root canonical without a trailing slash; the page
    // node says the same URL, byte for byte, so the two never disagree.
    url: opts.path === "/" ? SITE_URL : `${SITE_URL}${opts.path}`,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en",
  };
  if (opts.type === "AboutPage") page.mainEntity = { "@id": ORG_ID };
  if (opts.mainEntity) page.mainEntity = opts.mainEntity;
  if (hero) page.primaryImageOfPage = { "@id": hero["@id"] };
  if (opts.dateModified) page.dateModified = opts.dateModified;
  nodes.push(page);
  if (hero) nodes.push(hero);

  if (opts.isHome)
    nodes.push(offerCatalogNode(), ...(await compoundTermSetNode()));
  if (opts.crumbs?.length) nodes.push(breadcrumbNode(opts.crumbs, opts.path));
  if (opts.faqs?.length) {
    const faq = faqNode(opts.faqs, opts.path);
    if (faq) nodes.push(faq);
  }
  for (const n of opts.extra ?? []) if (n) nodes.push(n);

  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Assembles the full @graph for a product category page — sheet 09. */
export async function productCategoryGraph(
  fm: ProductCategory,
  path: string,
  /** The page's rendered blocks — a router list becomes an ItemList (sheet 39 §02). */
  blocks: readonly { _type: string; [k: string]: unknown }[] = [],
) {
  const nodes: Node[] = [];

  if (fm.schemaTypes.includes("Product"))
    nodes.push(await productNode(fm, path));
  if (fm.schemaTypes.includes("BreadcrumbList")) {
    nodes.push(
      breadcrumbNode(
        [
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: fm.navLabel, path },
        ],
        path,
      ),
    );
  }
  if (fm.schemaTypes.includes("FAQPage")) {
    const faq = faqNode(fm.faqs, path);
    if (faq) nodes.push(faq);
  }
  for (const b of blocks) {
    if (b._type !== "block.routerList") continue;
    const rows = b.rows as { condition: string; need: string; href?: string }[];
    nodes.push({
      "@type": "ItemList",
      "@id": `${SITE_URL}${path}#router`,
      name: String(b.heading ?? ""),
      itemListOrder: "ItemListOrderAscending",
      numberOfItems: rows.length,
      itemListElement: rows.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: r.condition,
        description: r.need,
        ...(r.href ? { url: `${SITE_URL}${r.href}` } : {}),
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Assembles the full @graph for an industry page — sheet 20. */
export function industryGraph(
  fm: Industry,
  path: string,
  crumbs: { name: string; path: string }[],
) {
  const nodes: Node[] = [serviceNode(fm, path), breadcrumbNode(crumbs, path)];
  const faq = faqNode(fm.faqs, path);
  if (faq) nodes.push(faq);
  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * Placeholder pages must not emit schema — it would assert fake data.
 *
 * JSONLD_PREVIEW=1 lifts the gate on a development server only, so
 * `check:jsonld` can validate every route's graph before any document is
 * published. It has no effect in a production build.
 */
export function shouldEmitSchema(status: ContentStatus) {
  if (
    process.env.JSONLD_PREVIEW === "1" &&
    process.env.NODE_ENV !== "production"
  )
    return true;
  return status === "published";
}

export type { SiteSettings };
