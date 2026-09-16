/**
 * ROUTE REGISTRY — the one list of categories, industries and company pages.
 *
 * The footer, the header menus, the contact-form dropdowns, the breadcrumbs,
 * the sitemap and every canonical read from here. A second hand-typed copy of
 * these URLs is how the old footer ended up with four industry links pointing
 * at one page, two categories missing, and "Extrusion Profiles" linking at a
 * path that does not exist.
 *
 * Counts are the client's decisions of 2026-09-16: fifteen product categories
 * in three groups, eleven industries. All fifteen and all eleven are built
 * (the last six from sheets 36–39 and 41–42). An entry marked `live: false`
 * would have a content sheet but no page yet; until such a page ships, its
 * footer and menu entries point at /contact with the product or industry
 * pre-filled — the Build Instructions' rule: no link may resolve to a 404;
 * "if a destination is not built yet, point at /contact in the interim."
 * Flip `live` when the page deploys and every surface follows.
 *
 * Labels are display names and the only place they are typed. Three of them
 * deliberately differ from their slugs, and each is a live trap if retyped:
 * Extrusion Profiles → /products/extrusion (not -profiles), Bushes & Bushings
 * → /products/bushes, Transport — Rail & Marine → /industries/transport.
 */

export type RouteEntry = {
  slug: string;
  label: string;
  /** The real page, once it exists. */
  path: string;
  live: boolean;
  /** Products only: the filter family on /products. */
  family?: "Sealing" | "Anti-Vibration" | "Protection" | "Profiles" | "Custom" | "Cellular";
};

export type RouteGroup = { label: string; items: RouteEntry[] };

const cat = (slug: string, label: string, family: RouteEntry["family"], live = true): RouteEntry => ({
  slug,
  label,
  path: `/products/${slug}`,
  live,
  family,
});
const ind = (slug: string, label: string, live = true): RouteEntry => ({
  slug,
  label,
  path: `/industries/${slug}`,
  live,
});

/** Fifteen categories in the three groups the footer and the hub grid use. */
export const PRODUCT_GROUPS: readonly RouteGroup[] = [
  {
    label: "Sealing",
    items: [
      cat("o-rings", "O-Rings", "Sealing"),
      cat("oil-seals", "Oil Seals", "Sealing"),
      cat("gaskets", "Gaskets", "Sealing"),
      cat("diaphragms", "Diaphragms", "Sealing"),
      // "Reciprocating" is part of the label so it is not read as a parent of
      // O-Rings and Oil Seals — content sheet 39 §02.
      cat("seals", "Reciprocating Seals", "Sealing"),
      cat("leak-test-rubber", "Leak Test Rubber", "Custom"),
    ],
  },
  {
    label: "Mounting & protection",
    items: [
      cat("anti-vibration-mounts", "Anti-Vibration Mounts", "Anti-Vibration"),
      cat("bushes", "Bushes & Bushings", "Anti-Vibration"),
      cat("bonded-components", "Bonded Components", "Anti-Vibration"),
      cat("bellows", "Bellows", "Protection"),
      cat("grommets", "Grommets", "Protection"),
      cat("pads-stoppers-caps", "Pads, Stoppers & Caps", "Custom"),
    ],
  },
  {
    label: "Sheet & profile",
    items: [
      cat("extrusion", "Extrusion Profiles", "Profiles"),
      cat("sponge-foam-rubber", "Sponge & Foam Rubber", "Cellular"),
      cat("rubber-lining", "Rubber Lining & Skirting", "Cellular"),
    ],
  },
];

export const PRODUCTS: readonly RouteEntry[] = PRODUCT_GROUPS.flatMap((g) => g.items);

/** Eleven industries, in the footer's order — Automotive leads, matching real volume. */
export const INDUSTRIES: readonly RouteEntry[] = [
  ind("automotive", "Automotive"),
  ind("mining", "Mining"),
  ind("oil-gas", "Oil & Gas"),
  ind("pumps-valves", "Pumps & Valves"),
  ind("hvac", "HVAC"),
  ind("electrical-electronics", "Electrical & Electronics"),
  ind("agriculture", "Agriculture"),
  ind("medical-devices", "Medical Devices"),
  ind("water-fluid-management", "Water & Fluid Management"),
  ind("construction", "Construction"),
  ind("transport", "Transport — Rail & Marine"),
];

/** The footer's Company column — six entries; Why Choose Us is out. */
export const COMPANY_LINKS: readonly { label: string; href: string }[] = [
  { label: "About Us", href: "/about" },
  { label: "Certifications", href: "/certifications" },
  { label: "Export Markets", href: "/export" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Resources", href: "/resources" },
  { label: "Contact Us", href: "/contact" },
];

/**
 * Where a link to this entry should go today.
 *
 * A built page links to itself. An unbuilt one links to the contact form with
 * the product or industry pre-filled, so the click still converts — the
 * interim the Build Instructions ask for, and better than a dead entry.
 */
export function hrefFor(e: RouteEntry): string {
  if (e.live) return e.path;
  const key = e.path.startsWith("/products/") ? "product" : "industry";
  return `/contact?${key}=${encodeURIComponent(e.label)}`;
}

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const industryBySlug = (slug: string) => INDUSTRIES.find((i) => i.slug === slug);

/** Display name for a slug — never let a raw slug reach a sentence. */
export function displayName(slug: string): string {
  return productBySlug(slug)?.label ?? industryBySlug(slug)?.label ?? slug;
}
