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
];

/** True when a path is a redirect source — a URL that no longer has a page of its own. */
export const isRetired = (path: string) => REDIRECTS.some((r) => r.from === path);
