/**
 * PERMANENT REDIRECTS — the one list next.config reads.
 *
 * Every path a page used to live at, and where it lives now. A part page is
 * never deleted: "a 404 on a part page is worse than a redirect, and
 * quotations may reference this path" (SKU sheets 16 and 29). The 301 is the
 * safety net; the links the site itself carries are updated to the new path
 * so nothing on the site depends on a redirect.
 *
 * Sources:
 *   · the six parts the SKU sheets (34) move to the category they belong
 *     in, each with "New URL … 301 from …" on its sheet;
 *   · the two duplicate part pages the same sheets fold into their
 *     survivor ("Duplicate — 301 this URL");
 *   · the old site's WooCommerce product URLs, once the pre-cutover crawl
 *     names them (Build Checklist B15) — none yet.
 */
export type Redirect = { from: string; to: string; why: string };

export const REDIRECTS: readonly Redirect[] = [
  /* ── Parts moved to the right category (SKU sheets 02, 04, 05, 07, 09, 31) ── */
  {
    from: "/products/anti-vibration-mounts/backlight-mount",
    to: "/products/extrusion/rear-windscreen-glazing-rubber",
    why: "An extruded glazing channel, not a mount (SKU 02).",
  },
  {
    from: "/products/anti-vibration-mounts/scorpio-footrest-mat",
    to: "/products/pads-stoppers-caps/side-step-pad",
    why: "A side-step tread pad damps nothing and carries no load path (SKU 04).",
  },
  {
    from: "/products/anti-vibration-mounts/tata-bumper-stopper",
    to: "/products/anti-vibration-mounts/cv-suspension-bump-stop",
    why: "Named for the duty, not for another company's vehicle (SKU 05).",
  },
  {
    from: "/products/gaskets/c-pillar-garnish",
    to: "/products/sponge-foam-rubber/c-pillar-garnish-seal",
    why: "A hard-foam part; the page says so in its own title (SKU 07).",
  },
  {
    from: "/products/gaskets/foam-gaskets",
    to: "/products/sponge-foam-rubber/foam-gaskets",
    why: "Closed-cell sponge, so the sponge category (SKU 09).",
  },
  {
    from: "/products/pads-stoppers-caps/rubber-plungers",
    to: "/products/seals/plunger-seals",
    why: "A reciprocating seal, under the category built for it (SKU 31, sheet 39).",
  },

  /* ── Duplicate part pages folded into their survivor (SKU sheets 16, 29) ── */
  {
    from: "/products/oil-seals/fkm-compression-pump-inlays",
    to: "/products/oil-seals/compression-pump-inlays",
    why: "The same part with a compound in the slug; the survivor is compound-neutral (SKU 16).",
  },
  {
    from: "/products/pads-stoppers-caps/oil-seal-filler-cap",
    to: "/products/pads-stoppers-caps/oil-filler-cap",
    why: "The same cap under a name that runs two part types together (SKU 29).",
  },

  /* ── The WordPress site's URLs (Build Checklist B15, CUTOVER.md §7) ────
     From the old site's own sitemaps, crawled 2026-09-18: 28 WooCommerce
     product pages, the pages, two category archives and the theme leftovers
     the sitemap still lists. Each old part goes to the page that now sells
     it; a part with no page of its own goes to its category. Re-run the
     crawl the day DNS moves and add anything the sitemap has grown since —
     scripts/legacy-urls.mts prints what is missing. */
  ...legacy("/product/3-pin-hole-pad", "/products/grommets/3-pin-hole-pad"),
  ...legacy("/product/702", "/products/pads-stoppers-caps/epdm-pad", "WooCommerce id; the page was titled EPDM Pads."),
  ...legacy("/product/706", "/products/pads-stoppers-caps/radiator-shroud-flaps", "WooCommerce id; the page was titled Radiator Shroud Flaps."),
  ...legacy("/product/back-light-rubber-mount", "/products/extrusion/rear-windscreen-glazing-rubber"),
  ...legacy("/product/big-support-pad", "/products/pads-stoppers-caps/big-support-pad"),
  ...legacy("/product/boot-tailgate-switch", "/products/pads-stoppers-caps/boot-tailgate-switch"),
  ...legacy("/product/bumper-stopper-for-tata", "/products/anti-vibration-mounts/cv-suspension-bump-stop"),
  ...legacy("/product/bumper-stopper", "/products/anti-vibration-mounts/bumper-stopper"),
  ...legacy("/product/c-pillar-garnish-epdm-hard-foam", "/products/sponge-foam-rubber/c-pillar-garnish-seal"),
  ...legacy("/product/dipstick-o-ring", "/products/o-rings", "No part page of its own; the category sells dipstick O-rings to drawing."),
  ...legacy("/product/epdm-gaskets", "/products/gaskets/epdm"),
  ...legacy("/product/epdm-rubber-insulator-bush", "/products/bushes", "A bush with no part page of its own."),
  ...legacy("/product/fkm-viton-inlays", "/products/oil-seals/compression-pump-inlays", "Folded into the compound-neutral part (SKU 16)."),
  ...legacy("/product/foam-gasket", "/products/sponge-foam-rubber/foam-gaskets"),
  ...legacy("/product/glove-box-stopper-rubber-bumper", "/products/pads-stoppers-caps/glove-box-stopper"),
  ...legacy("/product/grommet-internal-fits", "/products/grommets/internal-fit"),
  ...legacy("/product/insulator-bush", "/products/bushes/aem-insulation-bush", "The engine insulator bush — the AEM part."),
  ...legacy("/product/oil-filler-cap", "/products/pads-stoppers-caps/oil-filler-cap"),
  ...legacy("/product/oil-seal-filler-cap", "/products/pads-stoppers-caps/oil-filler-cap", "The duplicate cap (SKU 29)."),
  ...legacy("/product/rubber-bellows", "/products/bellows"),
  ...legacy("/product/rubber-flap-top-bottom", "/products/pads-stoppers-caps/radiator-shroud-flaps", "The shroud's top and bottom flaps."),
  ...legacy("/product/rubber-pad", "/products/pads-stoppers-caps", "A battery tray pad with no part page of its own."),
  ...legacy("/product/rubber-plungers", "/products/seals/plunger-seals"),
  ...legacy("/product/scorpio-footrest-mat", "/products/pads-stoppers-caps/side-step-pad"),
  ...legacy("/product/seal-filler-cap-o-rings", "/products/o-rings/seal-filler-cap-o-rings"),
  ...legacy("/product/silicon-inlays", "/products/oil-seals/compression-pump-inlays", "The silicone compression pump inlay (SKU 13)."),
  ...legacy("/product/support-pad", "/products/pads-stoppers-caps/bolero-support-pad", "The old page sold it as the Bolero pad."),
  ...legacy("/product/weight-rubber-for-a-c-vibration-extractor", "/products/anti-vibration-mounts/ac-vibration-weight"),
  ...legacy("/product-category/margo-rubber", "/products", "The one WooCommerce category."),
  ...legacy("/product-category/uncategorized", "/products"),
  ...legacy("/about-us", "/about"),
  ...legacy("/mission-vision", "/about", "The vision lives on the About page (sheet 03 §04)."),
  ...legacy("/our-plants", "/about", "The plant is described on the About page (sheet 03 §06)."),
  ...legacy("/contact-us", "/contact"),
  ...legacy("/get-started", "/contact"),
  ...legacy("/industries", "/industries"),
  ...legacy("/products", "/products"),
  ...legacy("/blackblue", "/", "Theme demo page the old sitemap still listed."),
  ...legacy("/blackdarkblue", "/", "Theme demo page the old sitemap still listed."),
  ...legacy("/dark-home", "/", "Theme demo page the old sitemap still listed."),
  ...legacy("/home-2", "/", "Theme demo page the old sitemap still listed."),
  ...legacy("/more-dark", "/", "Theme demo page the old sitemap still listed."),
  ...legacy("/do-not-use", "/", "Theme demo page the old sitemap still listed."),
  ...legacy("/sample-page", "/", "WordPress's default page."),
  ...legacy("/2023/11/25/hello-world", "/", "WordPress's default post."),
  ...legacy("/category/uncategorized", "/", "WordPress's default post category."),
  ...[
    "dynamic-content-widget-649a67b-10afa32",
    "dynamic-content-widget-649a67b-4dc3326",
    "dynamic-content-widget-649a67b-6b50e04",
    "dynamic-content-widget-649a67b-8b7f188",
    "dynamic-content-widget-649a67b-a89b022",
    "dynamic-content-widget-649a67b-b0493e2",
    "dynamic-content-widget-popup-4d9a671",
    "dynamic-content-widget-popup-e0f9b34",
  ].flatMap((w) => legacy(`/elementskit-content/${w}`, "/", "An Elementor widget the old sitemap exposed as a page.")),
];

/**
 * One legacy URL, with and without its trailing slash — WordPress served
 * both, and the crawlers that indexed it will ask for either. A source
 * identical to its destination (/products → /products) is skipped: those
 * paths survive the move unchanged and are listed only so the crawl
 * comparison sees them as accounted for.
 */
function legacy(from: string, to: string, why = "The old WordPress site's URL for this page."): Redirect[] {
  if (from === to) return [];
  return [
    { from, to, why },
    { from: `${from}/`, to, why },
  ];
}

/** Every old-site path the map accounts for, for scripts/legacy-urls.mts. */
export const LEGACY_PATHS = new Set(
  REDIRECTS.filter((r) => !r.from.startsWith("/products/")).map((r) => r.from.replace(/\/$/, "")).concat(["/", "/industries", "/products"]),
);

/** True when a path is a redirect source — a URL that no longer has a page of its own. */
export const isRetired = (path: string) => REDIRECTS.some((r) => r.from === path);
