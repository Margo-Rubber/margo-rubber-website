import type { ImageKey } from "./images.ts";

/**
 * HUMAN NAMES FOR THE 85 IMAGE SLOTS — what the Studio shows an editor.
 *
 * The registry key (`home.story`) is a developer identifier: stable, used in
 * code, never shown to a visitor. It is the wrong thing to ask an editor to
 * decode. Every slot therefore also has a title an editor would recognise,
 * a sentence saying where on the site the picture appears, and the page it
 * lives on so the Studio can link straight to it.
 *
 * Kept OUT of images.ts on purpose:
 *
 *  · That file is imported by every page the site renders. Editor-facing
 *    prose has no business in the visitor's bundle.
 *  · It is also rewritten by `gen:blur`, and hand-written labels do not
 *    belong in a file a script regenerates.
 *
 * Kept COMPLETE by the type system: `satisfies Record<ImageKey, …>` fails to
 * compile if a slot is added to the registry without a label here, or a label
 * names a slot that no longer exists. A missing title cannot ship.
 *
 * `where` is a factual statement, checked against the page files. Where a
 * slot is registered but nothing renders it, it says so — an editor who
 * uploads to a slot the site never draws has wasted their afternoon.
 */

export type SlotLabel = {
  /** What an editor calls it. Short, no key, no jargon. */
  title: string;
  /** Which page and which section, in the words the page itself uses. */
  where: string;
  /** Path of the page it appears on, for the "view on site" link. */
  page: string;
};

/**
 * The Studio groups slots by the PAGE they appear on, in site order — one
 * group per page, so "Gaskets page" holds the Gaskets hero and its four
 * material cards and nothing else. Keyed by the slot's `page` path. The 31
 * part pages fold into one group; each has a single photograph.
 */
export const PAGE_TITLES: Record<string, string> = {
  "/": "Home page",
  "/products": "Products page",
  "/products/o-rings": "O-Rings page",
  "/products/oil-seals": "Oil Seals page",
  "/products/gaskets": "Gaskets page",
  "/products/bellows": "Bellows page",
  "/products/anti-vibration-mounts": "Anti-Vibration Mounts page",
  "/products/grommets": "Grommets page",
  "/products/bushes": "Bushes & Bushings page",
  "/products/pads-stoppers-caps": "Pads, Stoppers & Caps page",
  "/products/leak-test-rubber": "Leak Test Rubber page",
  "/products/extrusion": "Extrusion Profiles page",
  "/products/sponge-foam-rubber": "Sponge & Foam Rubber page",
  "/industries": "Industries page",
  "/industries/automotive": "Automotive industry page",
  "/industries/mining": "Mining industry page",
  "/industries/oil-gas": "Oil & Gas industry page",
  "/industries/pumps-valves": "Pumps & Valves industry page",
  "/industries/hvac": "HVAC industry page",
  "/industries/electrical-electronics": "Electrical & Electronics industry page",
  "/industries/agriculture": "Agriculture industry page",
  "/industries/medical-devices": "Medical Devices industry page",
  "/industries/water-fluid-management": "Water & Fluid Management industry page",
  "/about": "About page",
  "/export": "Export page",
  "/certifications": "Certifications page",
  "/case-studies": "Case Studies page",
  "/contact": "Contact page",
  "/why-margo": "Why Margo page",
  "/logo": "Logo (every page)",
};

/** The group a slot is listed under, from its page path. */
export function pageGroup(page: string): { id: string; title: string; order: number } {
  const keys = Object.keys(PAGE_TITLES);
  if (page in PAGE_TITLES) return { id: page, title: PAGE_TITLES[page], order: keys.indexOf(page) };
  if (/^\/products\/[^/]+\/[^/]+$/.test(page)) return { id: "/parts", title: "Part pages (one photo each)", order: keys.length };
  return { id: page, title: page, order: keys.length + 1 };
}

const NOT_SHOWN = "Not shown anywhere on the site at the moment.";

export const IMAGE_SLOT_LABELS = {
  /* ── Logo ─────────────────────────────────────────────────────────── */
  "brand.mark": {
    title: "Logo mark (the symbol on its own)",
    where: "Site header and footer, beside the MARGO wordmark — on every page. Deliberately one slot: a logo that differed between header and footer would be a mistake, not a choice.",
    page: "/logo",
  },
  "brand.logo": {
    title: "Logo with wordmark",
    where: "Site header and footer — on every page. Deliberately one slot.",
    page: "/logo",
  },

  /* ── Home page ────────────────────────────────────────────────────── */
  "home.story": {
    title: "Our story — plant photo",
    where: "Home page, ‘Our story’ section, the photograph beside the heading.",
    page: "/",
  },
  "home.facility": {
    title: "Our facility — main photo",
    where: "Home page, ‘Our facility’ section, the large photograph.",
    page: "/",
  },
  "home.product.moulded": {
    title: "Our facility — small inset photo",
    where: "Home page, ‘Our facility’ section, the small picture overlapping the main one.",
    page: "/",
  },
  "home.contact": {
    title: "Quotation section — packing photo",
    where: "Home page, ‘Request an engineering quotation’ section, beside the form.",
    page: "/",
  },
  "home.product.o-rings": { title: "Spare — mill stock photo", where: NOT_SHOWN, page: "/" },
  "home.product.gaskets": { title: "Spare — moulded component close-up", where: NOT_SHOWN, page: "/" },
  "home.product.sheets": { title: "Spare — rolled sheet stock", where: NOT_SHOWN, page: "/" },
  "home.product.extruded": { title: "Spare — extrusion line pipework", where: NOT_SHOWN, page: "/" },
  "home.product.custom": { title: "Spare — assembly stations", where: NOT_SHOWN, page: "/" },

  /* ── Products page (hub) ──────────────────────────────────────────── */
  "products.hero": {
    title: "Products page — hero background",
    where: "Products page, the full-width photograph behind the heading at the top.",
    page: "/products",
  },
  "products.excellence": {
    title: "Products page — ‘Manufacturing excellence’ photo",
    where: "Products page, ‘Manufacturing excellence’ section.",
    page: "/products",
  },
  "products.card.o-rings": {
    title: "Products page — O-Rings card",
    where: "Products page range grid — card 1 of 11.",
    page: "/products",
  },
  "products.card.oil-seals": {
    title: "Products page — Oil Seals card",
    where: "Products page range grid — card 2 of 11.",
    page: "/products",
  },
  "products.card.gaskets": {
    title: "Products page — Gaskets card",
    where: "Products page range grid — card 3 of 11.",
    page: "/products",
  },
  "products.card.bellows": {
    title: "Products page — Bellows card",
    where: "Products page range grid — card 4 of 11.",
    page: "/products",
  },
  "products.card.anti-vibration-mounts": {
    title: "Products page — Anti-Vibration Mounts card",
    where: "Products page range grid — card 5 of 11.",
    page: "/products",
  },
  "products.card.grommets": {
    title: "Products page — Grommets card",
    where: "Products page range grid — card 6 of 11.",
    page: "/products",
  },
  "products.card.bushes": {
    title: "Products page — Bushes & Bushings card",
    where: "Products page range grid — card 7 of 11.",
    page: "/products",
  },
  "products.card.pads-stoppers-caps": {
    title: "Products page — Pads, Stoppers & Caps card",
    where: "Products page range grid — card 8 of 11.",
    page: "/products",
  },
  "products.card.leak-test-rubber": {
    title: "Products page — Leak Test Rubber card",
    where: "Products page range grid — card 9 of 11.",
    page: "/products",
  },
  "products.card.extrusion": {
    title: "Products page — Extrusion Profiles card",
    where: "Products page range grid — card 10 of 11.",
    page: "/products",
  },
  "products.card.sponge-foam-rubber": {
    title: "Products page — Sponge & Foam Rubber card",
    where: "Products page range grid — card 11 of 11.",
    page: "/products",
  },

  /* ── Product category pages ───────────────────────────────────────── */
  "products.material.fkm": {
    title: "Retired — FKM material card",
    where: "Retired — every place this appeared now has its own slot. Nothing draws it; it is removed once the documents are re-pointed.",
    page: "/products/o-rings",
  },
  "products.material.nbr": {
    title: "Retired — NBR material card",
    where: "Retired — every place this appeared now has its own slot. Nothing draws it; it is removed once the documents are re-pointed.",
    page: "/products/o-rings",
  },
  "products.material.epdm": {
    title: "Retired — EPDM material card",
    where: "Retired — every place this appeared now has its own slot. Nothing draws it; it is removed once the documents are re-pointed.",
    page: "/products/o-rings",
  },
  "products.material.silicone": {
    title: "Retired — Silicone material card",
    where: "Retired — every place this appeared now has its own slot. Nothing draws it; it is removed once the documents are re-pointed.",
    page: "/products/o-rings",
  },
  "products.o-rings.hero": {
    title: "O-Rings page — hero background",
    where: "O-Rings category page, the photograph behind the heading at the top.",
    page: "/products/o-rings",
  },
  "products.extrusion.hero": {
    title: "Extrusion Profiles page — hero background",
    where: "Extrusion Profiles category page, the photograph behind the heading at the top.",
    page: "/products/extrusion",
  },
  "products.sponge-foam.hero": {
    title: "Sponge & Foam page — hero background",
    where: "Sponge & Foam Rubber category page, the photograph behind the heading at the top.",
    page: "/products/sponge-foam-rubber",
  },
  "products.sponge-foam.hvac": {
    title: "Sponge & Foam — ‘HVAC’ application card",
    where: "Sponge & Foam Rubber page, ‘Applications in the field’ section.",
    page: "/products/sponge-foam-rubber",
  },
  "products.sponge-foam.gaskets": {
    title: "Sponge & Foam — ‘Gaskets’ application card",
    where: "Sponge & Foam Rubber page, ‘Applications in the field’ section.",
    page: "/products/sponge-foam-rubber",
  },
  "products.sponge-foam.automotive": {
    title: "Sponge & Foam — ‘Automotive’ application card",
    where: "Sponge & Foam Rubber page, ‘Applications in the field’ section.",
    page: "/products/sponge-foam-rubber",
  },
  "products.sponge-foam.cleanroom": {
    title: "Sponge & Foam — ‘Cleanroom’ application card",
    where: "Sponge & Foam Rubber page, ‘Applications in the field’ section.",
    page: "/products/sponge-foam-rubber",
  },

  /* ── Industries page (hub) ────────────────────────────────────────── */
  "industries.hero": {
    title: "Industries page — hero background",
    where: "Industries page, the full-width photograph behind the heading at the top.",
    page: "/industries",
  },
  "industries.automotive": {
    title: "Industries page — Automotive card",
    where: "Industries page grid — card 1 of 9.",
    page: "/industries",
  },
  "industries.mining": {
    title: "Industries page — Mining card",
    where: "Industries page grid — card 2 of 9.",
    page: "/industries",
  },
  "industries.oil-gas": {
    title: "Industries page — Oil & Gas card",
    where: "Industries page grid — card 3 of 9.",
    page: "/industries",
  },
  "industries.pumps-valves": {
    title: "Industries page — Pumps & Valves card",
    where: "Industries page grid — card 4 of 9.",
    page: "/industries",
  },
  "industries.hvac": {
    title: "Industries page — HVAC card",
    where: "Industries page grid — card 5 of 9.",
    page: "/industries",
  },
  "industries.electrical-electronics": {
    title: "Industries page — Electrical & Electronics card",
    where: "Industries page grid — card 6 of 9.",
    page: "/industries",
  },
  "industries.agriculture": {
    title: "Industries page — Agriculture card",
    where: "Industries page grid — card 7 of 9.",
    page: "/industries",
  },
  "industries.medical-devices": {
    title: "Industries page — Medical Devices card",
    where: "Industries page grid — card 8 of 9.",
    page: "/industries",
  },
  "industries.water-fluid-management": {
    title: "Industries page — Water & Fluid Management card",
    where: "Industries page grid — card 9 of 9.",
    page: "/industries",
  },

  /* ── Industry pages ───────────────────────────────────────────────── */
  "industries.mining.hero": {
    title: "Mining page — hero background",
    where: "Mining industry page, the photograph behind the heading at the top.",
    page: "/industries/mining",
  },
  "industries.mining.component": {
    title: "Retired — Mining page — ‘Components we supply’ photo",
    where: "Retired — every place this appeared now has its own slot. Nothing draws it; it is removed once the documents are re-pointed.",
    page: "/industries/mining",
  },
  "industries.mining.use.conveyor": {
    title: "Mining page — ‘Conveyor’ card",
    where: "Mining industry page, ‘Where components are used’ section.",
    page: "/industries/mining",
  },
  "industries.mining.use.crushers": {
    title: "Mining page — ‘Crushers’ card",
    where: "Mining industry page, ‘Where components are used’ section.",
    page: "/industries/mining",
  },
  "industries.mining.use.haul": {
    title: "Mining page — ‘Haul trucks’ card",
    where: "Mining industry page, ‘Where components are used’ section.",
    page: "/industries/mining",
  },
  "industries.mining.use.hydraulic": {
    title: "Mining page — ‘Hydraulic’ card",
    where: "Mining industry page, ‘Where components are used’ section.",
    page: "/industries/mining",
  },
  "industries.mining.facility": {
    title: "Mining — quality section photo",
    where: "Mining industry page, ‘Quality & certification’ section.",
    page: "/industries/mining",
  },

  /* ── About page ───────────────────────────────────────────────────── */
  "about.hero": {
    title: "About page — hero background",
    where: "About page, the photograph behind the heading at the top.",
    page: "/about",
  },
  "about.story.plant": {
    title: "Our story — main photo",
    where: "About page, ‘Our story’ section, the large photograph.",
    page: "/about",
  },
  "about.story.gauge": {
    title: "Our story — small inset (caliper)",
    where: "About page, ‘Our story’ section, the small picture overlapping the main one.",
    page: "/about",
  },
  "about.portfolio": {
    title: "Our story — lower photo (moulded rings)",
    where: "About page, ‘Our story’ section, the lower picture.",
    page: "/about",
  },
  "about.manufacturing.floor": {
    title: "Manufacturing — main floor photo",
    where: "About page, ‘Manufacturing’ section, the large photograph.",
    page: "/about",
  },
  "about.manufacturing.press": {
    title: "Manufacturing — press photo",
    where: "About page, ‘Manufacturing’ section, first small picture.",
    page: "/about",
  },
  "about.manufacturing.lab": {
    title: "Manufacturing — test lab photo",
    where: "About page, ‘Manufacturing’ section, second small picture.",
    page: "/about",
  },
  "about.team.portrait-b": {
    title: "Leadership — Managing Director portrait",
    where: "About page, ‘Leadership’ section, card 1.",
    page: "/about",
  },
  "about.team.lab": {
    title: "Leadership — VP Engineering portrait",
    where: "About page, ‘Leadership’ section, card 2.",
    page: "/about",
  },
  "about.leadership": {
    title: "Leadership — Head of Quality portrait",
    where: "About page, ‘Leadership’ section, card 3.",
    page: "/about",
  },
  "about.team.portrait-a": {
    title: "Leadership — Global Sales Director portrait",
    where: "About page, ‘Leadership’ section, card 4.",
    page: "/about",
  },
  "about.presence": {
    title: "Global reach — export terminal photo",
    where: "About page, ‘Global reach’ section.",
    page: "/about",
  },
  "about.green": {
    title: "Sustainability — wind turbines photo",
    where: "About page, ‘Sustainability’ section.",
    page: "/about",
  },

  /* ── Export page ──────────────────────────────────────────────────── */
  "export.containers": {
    title: "Retired — Export — stacked containers photo",
    where: "Retired — every place this appeared now has its own slot. Nothing draws it; it is removed once the documents are re-pointed.",
    page: "/export",
  },
  "export.warehouse": {
    title: "Retired — Export — warehouse forklift photo",
    where: "Retired — every place this appeared now has its own slot. Nothing draws it; it is removed once the documents are re-pointed.",
    page: "/export",
  },
  "export.gantry": {
    title: "Retired — Export — quayside cranes photo",
    where: "Retired — every place this appeared now has its own slot. Nothing draws it; it is removed once the documents are re-pointed.",
    page: "/export",
  },
  "export.vessel": {
    title: "Retired — Export page — hero background",
    where: "Retired — every place this appeared now has its own slot. Nothing draws it; it is removed once the documents are re-pointed.",
    page: "/export",
  },
  "export.pallets": {
    title: "Retired — Export — heat-treated pallets photo",
    where: "Retired — every place this appeared now has its own slot. Nothing draws it; it is removed once the documents are re-pointed.",
    page: "/export",
  },

  /* ── Certifications page ──────────────────────────────────────────── */
  "certifications.facility.press-wide": {
    title: "Certifications — facility photo 1 (press, wide)",
    where: "Certifications page, ‘Manufacturing & facility’ section.",
    page: "/certifications",
  },
  "certifications.facility.press-close": {
    title: "Certifications — facility photo 2 (press, close)",
    where: "Certifications page, ‘Manufacturing & facility’ section.",
    page: "/certifications",
  },
  "certifications.facility.inspection": {
    title: "Certifications — facility photo 3 (inspection)",
    where: "Certifications page, ‘Manufacturing & facility’ section.",
    page: "/certifications",
  },
  "certifications.facility.plant": {
    title: "Certifications — facility photo 4 (plant)",
    where: "Certifications page, ‘Manufacturing & facility’ section.",
    page: "/certifications",
  },
  "certifications.iso-badge": {
    title: "ISO 9001:2015 badge graphic",
    where: NOT_SHOWN,
    page: "/certifications",
  },

  /* ── Case Studies page ────────────────────────────────────────────── */
  "case-studies.hero": {
    title: "Case Studies page — hero background",
    where: "Case Studies page, the photograph behind the heading at the top.",
    page: "/case-studies",
  },

  /* ── Contact page ─────────────────────────────────────────────────── */
  "contact.hero": {
    title: "Contact page — hero background",
    where: "Contact page, the photograph behind the heading at the top.",
    page: "/contact",
  },

  /* ── Part pages ───────────────────────────────────────────────────── */
  "sku.product": {
    title: "Part pages — shared product plate",
    where: "Retired for the main image — every part now has its own product photo. Still the placeholder for parts nobody has photographed yet.",
    page: "/products/anti-vibration-mounts/ac-vibration-weight",
  },
  "sku.finishing": {
    title: "Part pages — finishing plate (shared)",
    where: "Every part page: gallery thumbnail 2, the ‘Why specifiers choose Margo’ main image and the FAQ image. Still shared — the part-page template rework removes it.",
    page: "/products/anti-vibration-mounts/ac-vibration-weight",
  },
  "sku.machining": {
    title: "Part pages — machining plate (shared)",
    where: "Every part page: gallery thumbnail 3 and the ‘Why specifiers’ inset. Still shared — the part-page template rework removes it.",
    page: "/products/anti-vibration-mounts/ac-vibration-weight",
  },

  /* ── Why Margo page ───────────────────────────────────────────────── */
  "why.hero": {
    title: "Why Margo — hero background",
    where: "Why Margo page, the photograph behind the heading at the top.",
    page: "/why-margo",
  },
  "why.heritage": {
    title: "Why Margo — ‘Heritage’ photo",
    where: "Why Margo page, ‘Heritage’ section.",
    page: "/why-margo",
  },
  "why.manufacturing": {
    title: "Why Margo — ‘Manufacturing’ wide banner",
    where: "Why Margo page, ‘Manufacturing’ section, full-width.",
    page: "/why-margo",
  },
  "why.quality": {
    title: "Why Margo — ‘Quality’ photo",
    where: "Why Margo page, ‘Quality’ section.",
    page: "/why-margo",
  },
  "why.support": {
    title: "Why Margo — ‘Support’ photo",
    where: "Why Margo page, ‘Support’ section.",
    page: "/why-margo",
  },

  /* ── Split from shared slots, 2026-09-15 — one per placement ────── */
  "home.hero": {
    title: "Home page — hero background",
    where: "Home page, the photograph behind the heading at the top.",
    page: "/",
  },
  "home.portfolio.o-rings": {
    title: "Home — O-Rings portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 1 of 11.",
    page: "/",
  },
  "home.portfolio.oil-seals": {
    title: "Home — Oil Seals portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 2 of 11.",
    page: "/",
  },
  "home.portfolio.gaskets": {
    title: "Home — Gaskets portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 3 of 11.",
    page: "/",
  },
  "home.portfolio.bellows": {
    title: "Home — Bellows portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 4 of 11.",
    page: "/",
  },
  "home.portfolio.anti-vibration-mounts": {
    title: "Home — Anti-Vibration Mounts portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 5 of 11.",
    page: "/",
  },
  "home.portfolio.grommets": {
    title: "Home — Grommets portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 6 of 11.",
    page: "/",
  },
  "home.portfolio.bushes": {
    title: "Home — Bushes & Sleeves portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 7 of 11.",
    page: "/",
  },
  "home.portfolio.pads-stoppers-caps": {
    title: "Home — Pads, Stoppers & Caps portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 8 of 11.",
    page: "/",
  },
  "home.portfolio.leak-test-rubber": {
    title: "Home — Leak Test Rubber portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 9 of 11.",
    page: "/",
  },
  "home.portfolio.extrusion": {
    title: "Home — Extrusion portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 10 of 11.",
    page: "/",
  },
  "home.portfolio.sponge-foam-rubber": {
    title: "Home — Sponge & Foam Rubber portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 11 of 11.",
    page: "/",
  },
  "products.sectors.automotive": {
    title: "Products page — Automotive sector card",
    where: "Products page, ‘Industries we serve’ — card 1 of 9.",
    page: "/products",
  },
  "products.sectors.oil-gas": {
    title: "Products page — Oil & Gas sector card",
    where: "Products page, ‘Industries we serve’ — card 2 of 9.",
    page: "/products",
  },
  "products.sectors.mining": {
    title: "Products page — Mining sector card",
    where: "Products page, ‘Industries we serve’ — card 3 of 9.",
    page: "/products",
  },
  "products.sectors.pumps-valves": {
    title: "Products page — Pumps & Valves sector card",
    where: "Products page, ‘Industries we serve’ — card 4 of 9.",
    page: "/products",
  },
  "products.sectors.hvac": {
    title: "Products page — HVAC sector card",
    where: "Products page, ‘Industries we serve’ — card 5 of 9.",
    page: "/products",
  },
  "products.sectors.electrical-electronics": {
    title: "Products page — Electrical sector card",
    where: "Products page, ‘Industries we serve’ — card 6 of 9.",
    page: "/products",
  },
  "products.sectors.medical-devices": {
    title: "Products page — Medical sector card",
    where: "Products page, ‘Industries we serve’ — card 7 of 9.",
    page: "/products",
  },
  "products.sectors.water-fluid-management": {
    title: "Products page — Water sector card",
    where: "Products page, ‘Industries we serve’ — card 8 of 9.",
    page: "/products",
  },
  "products.anti-vibration-mounts.hero": {
    title: "Anti-Vibration Mounts page — hero background",
    where: "Anti-Vibration Mounts category page, the photograph behind the heading at the top.",
    page: "/products/anti-vibration-mounts",
  },
  "products.anti-vibration-mounts.material.fkm": {
    title: "Anti-Vibration Mounts — FKM (Viton®) material card",
    where: "Anti-Vibration Mounts category page, ‘Material selection’ section — card 1 of 4.",
    page: "/products/anti-vibration-mounts",
  },
  "products.anti-vibration-mounts.material.nbr": {
    title: "Anti-Vibration Mounts — NBR (Nitrile) material card",
    where: "Anti-Vibration Mounts category page, ‘Material selection’ section — card 2 of 4.",
    page: "/products/anti-vibration-mounts",
  },
  "products.anti-vibration-mounts.material.epdm": {
    title: "Anti-Vibration Mounts — EPDM material card",
    where: "Anti-Vibration Mounts category page, ‘Material selection’ section — card 3 of 4.",
    page: "/products/anti-vibration-mounts",
  },
  "products.anti-vibration-mounts.material.silicone": {
    title: "Anti-Vibration Mounts — Silicone (VMQ) material card",
    where: "Anti-Vibration Mounts category page, ‘Material selection’ section — card 4 of 4.",
    page: "/products/anti-vibration-mounts",
  },
  "products.bellows.hero": {
    title: "Bellows page — hero background",
    where: "Bellows category page, the photograph behind the heading at the top.",
    page: "/products/bellows",
  },
  "products.bellows.material.fkm": {
    title: "Bellows — FKM (Viton®) material card",
    where: "Bellows category page, ‘Material selection’ section — card 1 of 4.",
    page: "/products/bellows",
  },
  "products.bellows.material.nbr": {
    title: "Bellows — NBR (Nitrile) material card",
    where: "Bellows category page, ‘Material selection’ section — card 2 of 4.",
    page: "/products/bellows",
  },
  "products.bellows.material.epdm": {
    title: "Bellows — EPDM material card",
    where: "Bellows category page, ‘Material selection’ section — card 3 of 4.",
    page: "/products/bellows",
  },
  "products.bellows.material.silicone": {
    title: "Bellows — Silicone (VMQ) material card",
    where: "Bellows category page, ‘Material selection’ section — card 4 of 4.",
    page: "/products/bellows",
  },
  "products.bushes.hero": {
    title: "Bushes page — hero background",
    where: "Bushes category page, the photograph behind the heading at the top.",
    page: "/products/bushes",
  },
  "products.bushes.material.fkm": {
    title: "Bushes — FKM (Viton®) material card",
    where: "Bushes category page, ‘Material selection’ section — card 1 of 4.",
    page: "/products/bushes",
  },
  "products.bushes.material.nbr": {
    title: "Bushes — NBR (Nitrile) material card",
    where: "Bushes category page, ‘Material selection’ section — card 2 of 4.",
    page: "/products/bushes",
  },
  "products.bushes.material.epdm": {
    title: "Bushes — EPDM material card",
    where: "Bushes category page, ‘Material selection’ section — card 3 of 4.",
    page: "/products/bushes",
  },
  "products.bushes.material.silicone": {
    title: "Bushes — Silicone (VMQ) material card",
    where: "Bushes category page, ‘Material selection’ section — card 4 of 4.",
    page: "/products/bushes",
  },
  "products.gaskets.hero": {
    title: "Gaskets page — hero background",
    where: "Gaskets category page, the photograph behind the heading at the top.",
    page: "/products/gaskets",
  },
  "products.gaskets.material.fkm": {
    title: "Gaskets — FKM (Viton®) material card",
    where: "Gaskets category page, ‘Material selection’ section — card 1 of 4.",
    page: "/products/gaskets",
  },
  "products.gaskets.material.nbr": {
    title: "Gaskets — NBR (Nitrile) material card",
    where: "Gaskets category page, ‘Material selection’ section — card 2 of 4.",
    page: "/products/gaskets",
  },
  "products.gaskets.material.epdm": {
    title: "Gaskets — EPDM material card",
    where: "Gaskets category page, ‘Material selection’ section — card 3 of 4.",
    page: "/products/gaskets",
  },
  "products.gaskets.material.silicone": {
    title: "Gaskets — Silicone (VMQ) material card",
    where: "Gaskets category page, ‘Material selection’ section — card 4 of 4.",
    page: "/products/gaskets",
  },
  "products.grommets.hero": {
    title: "Grommets page — hero background",
    where: "Grommets category page, the photograph behind the heading at the top.",
    page: "/products/grommets",
  },
  "products.grommets.material.fkm": {
    title: "Grommets — FKM (Viton®) material card",
    where: "Grommets category page, ‘Material selection’ section — card 1 of 4.",
    page: "/products/grommets",
  },
  "products.grommets.material.nbr": {
    title: "Grommets — NBR (Nitrile) material card",
    where: "Grommets category page, ‘Material selection’ section — card 2 of 4.",
    page: "/products/grommets",
  },
  "products.grommets.material.epdm": {
    title: "Grommets — EPDM material card",
    where: "Grommets category page, ‘Material selection’ section — card 3 of 4.",
    page: "/products/grommets",
  },
  "products.grommets.material.silicone": {
    title: "Grommets — Silicone (VMQ) material card",
    where: "Grommets category page, ‘Material selection’ section — card 4 of 4.",
    page: "/products/grommets",
  },
  "products.leak-test-rubber.hero": {
    title: "Leak Test Rubber page — hero background",
    where: "Leak Test Rubber category page, the photograph behind the heading at the top.",
    page: "/products/leak-test-rubber",
  },
  "products.leak-test-rubber.material.fkm": {
    title: "Leak Test Rubber — FKM (Viton®) material card",
    where: "Leak Test Rubber category page, ‘Material selection’ section — card 1 of 4.",
    page: "/products/leak-test-rubber",
  },
  "products.leak-test-rubber.material.nbr": {
    title: "Leak Test Rubber — NBR (Nitrile) material card",
    where: "Leak Test Rubber category page, ‘Material selection’ section — card 2 of 4.",
    page: "/products/leak-test-rubber",
  },
  "products.leak-test-rubber.material.epdm": {
    title: "Leak Test Rubber — EPDM material card",
    where: "Leak Test Rubber category page, ‘Material selection’ section — card 3 of 4.",
    page: "/products/leak-test-rubber",
  },
  "products.leak-test-rubber.material.silicone": {
    title: "Leak Test Rubber — Silicone (VMQ) material card",
    where: "Leak Test Rubber category page, ‘Material selection’ section — card 4 of 4.",
    page: "/products/leak-test-rubber",
  },
  "products.o-rings.material.fkm": {
    title: "O-Rings — FKM (Viton®) material card",
    where: "O-Rings category page, ‘Material selection’ section — card 1 of 4.",
    page: "/products/o-rings",
  },
  "products.o-rings.material.nbr": {
    title: "O-Rings — NBR (Nitrile) material card",
    where: "O-Rings category page, ‘Material selection’ section — card 2 of 4.",
    page: "/products/o-rings",
  },
  "products.o-rings.material.epdm": {
    title: "O-Rings — EPDM material card",
    where: "O-Rings category page, ‘Material selection’ section — card 3 of 4.",
    page: "/products/o-rings",
  },
  "products.o-rings.material.silicone": {
    title: "O-Rings — Silicone (VMQ) material card",
    where: "O-Rings category page, ‘Material selection’ section — card 4 of 4.",
    page: "/products/o-rings",
  },
  "products.oil-seals.hero": {
    title: "Oil Seals page — hero background",
    where: "Oil Seals category page, the photograph behind the heading at the top.",
    page: "/products/oil-seals",
  },
  "products.oil-seals.material.fkm": {
    title: "Oil Seals — FKM (Viton®) material card",
    where: "Oil Seals category page, ‘Material selection’ section — card 1 of 4.",
    page: "/products/oil-seals",
  },
  "products.oil-seals.material.nbr": {
    title: "Oil Seals — NBR (Nitrile) material card",
    where: "Oil Seals category page, ‘Material selection’ section — card 2 of 4.",
    page: "/products/oil-seals",
  },
  "products.oil-seals.material.epdm": {
    title: "Oil Seals — EPDM material card",
    where: "Oil Seals category page, ‘Material selection’ section — card 3 of 4.",
    page: "/products/oil-seals",
  },
  "products.oil-seals.material.silicone": {
    title: "Oil Seals — Silicone (VMQ) material card",
    where: "Oil Seals category page, ‘Material selection’ section — card 4 of 4.",
    page: "/products/oil-seals",
  },
  "products.pads-stoppers-caps.hero": {
    title: "Pads, Stoppers & Caps page — hero background",
    where: "Pads, Stoppers & Caps category page, the photograph behind the heading at the top.",
    page: "/products/pads-stoppers-caps",
  },
  "products.pads-stoppers-caps.material.fkm": {
    title: "Pads, Stoppers & Caps — FKM (Viton®) material card",
    where: "Pads, Stoppers & Caps category page, ‘Material selection’ section — card 1 of 4.",
    page: "/products/pads-stoppers-caps",
  },
  "products.pads-stoppers-caps.material.nbr": {
    title: "Pads, Stoppers & Caps — NBR (Nitrile) material card",
    where: "Pads, Stoppers & Caps category page, ‘Material selection’ section — card 2 of 4.",
    page: "/products/pads-stoppers-caps",
  },
  "products.pads-stoppers-caps.material.epdm": {
    title: "Pads, Stoppers & Caps — EPDM material card",
    where: "Pads, Stoppers & Caps category page, ‘Material selection’ section — card 3 of 4.",
    page: "/products/pads-stoppers-caps",
  },
  "products.pads-stoppers-caps.material.silicone": {
    title: "Pads, Stoppers & Caps — Silicone (VMQ) material card",
    where: "Pads, Stoppers & Caps category page, ‘Material selection’ section — card 4 of 4.",
    page: "/products/pads-stoppers-caps",
  },
  "industries.agriculture.hero": {
    title: "Agriculture page — hero background",
    where: "Agriculture industry page, the photograph behind the heading at the top.",
    page: "/industries/agriculture",
  },
  "industries.agriculture.component.1": {
    title: "Agriculture — ‘Bushes & Bushings’ component photo",
    where: "Agriculture industry page, ‘Components we supply’ — tab 1 of 3 (Bushes & Bushings).",
    page: "/industries/agriculture",
  },
  "industries.agriculture.component.2": {
    title: "Agriculture — ‘Anti-Vibration Mounts’ component photo",
    where: "Agriculture industry page, ‘Components we supply’ — tab 2 of 3 (Anti-Vibration Mounts).",
    page: "/industries/agriculture",
  },
  "industries.agriculture.component.3": {
    title: "Agriculture — ‘Bellows & Boots’ component photo",
    where: "Agriculture industry page, ‘Components we supply’ — tab 3 of 3 (Bellows & Boots).",
    page: "/industries/agriculture",
  },
  "industries.agriculture.facility": {
    title: "Agriculture — quality section photo",
    where: "Agriculture industry page, ‘Quality & certification’ section.",
    page: "/industries/agriculture",
  },
  "industries.automotive.hero": {
    title: "Automotive page — hero background",
    where: "Automotive industry page, the photograph behind the heading at the top.",
    page: "/industries/automotive",
  },
  "industries.automotive.component.1": {
    title: "Automotive — ‘Bushes & Bushings’ component photo",
    where: "Automotive industry page, ‘Components we supply’ — tab 1 of 3 (Bushes & Bushings).",
    page: "/industries/automotive",
  },
  "industries.automotive.component.2": {
    title: "Automotive — ‘Anti-Vibration Mounts’ component photo",
    where: "Automotive industry page, ‘Components we supply’ — tab 2 of 3 (Anti-Vibration Mounts).",
    page: "/industries/automotive",
  },
  "industries.automotive.component.3": {
    title: "Automotive — ‘Pads, Stoppers & Caps’ component photo",
    where: "Automotive industry page, ‘Components we supply’ — tab 3 of 3 (Pads, Stoppers & Caps).",
    page: "/industries/automotive",
  },
  "industries.automotive.facility": {
    title: "Automotive — quality section photo",
    where: "Automotive industry page, ‘Quality & certification’ section.",
    page: "/industries/automotive",
  },
  "industries.electrical-electronics.hero": {
    title: "Electrical & Electronics page — hero background",
    where: "Electrical & Electronics industry page, the photograph behind the heading at the top.",
    page: "/industries/electrical-electronics",
  },
  "industries.electrical-electronics.component.1": {
    title: "Electrical & Electronics — ‘Grommets’ component photo",
    where: "Electrical & Electronics industry page, ‘Components we supply’ — tab 1 of 3 (Grommets).",
    page: "/industries/electrical-electronics",
  },
  "industries.electrical-electronics.component.2": {
    title: "Electrical & Electronics — ‘Gaskets’ component photo",
    where: "Electrical & Electronics industry page, ‘Components we supply’ — tab 2 of 3 (Gaskets).",
    page: "/industries/electrical-electronics",
  },
  "industries.electrical-electronics.component.3": {
    title: "Electrical & Electronics — ‘Pads, Stoppers & Caps’ component photo",
    where: "Electrical & Electronics industry page, ‘Components we supply’ — tab 3 of 3 (Pads, Stoppers & Caps).",
    page: "/industries/electrical-electronics",
  },
  "industries.electrical-electronics.facility": {
    title: "Electrical & Electronics — quality section photo",
    where: "Electrical & Electronics industry page, ‘Quality & certification’ section.",
    page: "/industries/electrical-electronics",
  },
  "industries.hvac.hero": {
    title: "HVAC page — hero background",
    where: "HVAC industry page, the photograph behind the heading at the top.",
    page: "/industries/hvac",
  },
  "industries.hvac.component.1": {
    title: "HVAC — ‘Anti-Vibration Mounts’ component photo",
    where: "HVAC industry page, ‘Components we supply’ — tab 1 of 3 (Anti-Vibration Mounts).",
    page: "/industries/hvac",
  },
  "industries.hvac.component.2": {
    title: "HVAC — ‘Grommets’ component photo",
    where: "HVAC industry page, ‘Components we supply’ — tab 2 of 3 (Grommets).",
    page: "/industries/hvac",
  },
  "industries.hvac.component.3": {
    title: "HVAC — ‘Gaskets’ component photo",
    where: "HVAC industry page, ‘Components we supply’ — tab 3 of 3 (Gaskets).",
    page: "/industries/hvac",
  },
  "industries.hvac.facility": {
    title: "HVAC — quality section photo",
    where: "HVAC industry page, ‘Quality & certification’ section.",
    page: "/industries/hvac",
  },
  "industries.medical-devices.hero": {
    title: "Medical Devices page — hero background",
    where: "Medical Devices industry page, the photograph behind the heading at the top.",
    page: "/industries/medical-devices",
  },
  "industries.medical-devices.component.1": {
    title: "Medical Devices — ‘O-Rings’ component photo",
    where: "Medical Devices industry page, ‘Components we supply’ — tab 1 of 3 (O-Rings).",
    page: "/industries/medical-devices",
  },
  "industries.medical-devices.component.2": {
    title: "Medical Devices — ‘Gaskets’ component photo",
    where: "Medical Devices industry page, ‘Components we supply’ — tab 2 of 3 (Gaskets).",
    page: "/industries/medical-devices",
  },
  "industries.medical-devices.component.3": {
    title: "Medical Devices — ‘Bellows & Boots’ component photo",
    where: "Medical Devices industry page, ‘Components we supply’ — tab 3 of 3 (Bellows & Boots).",
    page: "/industries/medical-devices",
  },
  "industries.medical-devices.facility": {
    title: "Medical Devices — quality section photo",
    where: "Medical Devices industry page, ‘Quality & certification’ section.",
    page: "/industries/medical-devices",
  },
  "industries.mining.component.1": {
    title: "Mining — ‘Anti-Vibration Mounts’ component photo",
    where: "Mining industry page, ‘Components we supply’ — tab 1 of 3 (Anti-Vibration Mounts).",
    page: "/industries/mining",
  },
  "industries.mining.component.2": {
    title: "Mining — ‘O-Rings’ component photo",
    where: "Mining industry page, ‘Components we supply’ — tab 2 of 3 (O-Rings).",
    page: "/industries/mining",
  },
  "industries.mining.component.3": {
    title: "Mining — ‘Bushes & Bushings’ component photo",
    where: "Mining industry page, ‘Components we supply’ — tab 3 of 3 (Bushes & Bushings).",
    page: "/industries/mining",
  },
  "industries.oil-gas.hero": {
    title: "Oil & Gas page — hero background",
    where: "Oil & Gas industry page, the photograph behind the heading at the top.",
    page: "/industries/oil-gas",
  },
  "industries.oil-gas.component.1": {
    title: "Oil & Gas — ‘O-Rings’ component photo",
    where: "Oil & Gas industry page, ‘Components we supply’ — tab 1 of 3 (O-Rings).",
    page: "/industries/oil-gas",
  },
  "industries.oil-gas.component.2": {
    title: "Oil & Gas — ‘Oil Seals’ component photo",
    where: "Oil & Gas industry page, ‘Components we supply’ — tab 2 of 3 (Oil Seals).",
    page: "/industries/oil-gas",
  },
  "industries.oil-gas.component.3": {
    title: "Oil & Gas — ‘Gaskets’ component photo",
    where: "Oil & Gas industry page, ‘Components we supply’ — tab 3 of 3 (Gaskets).",
    page: "/industries/oil-gas",
  },
  "industries.oil-gas.facility": {
    title: "Oil & Gas — quality section photo",
    where: "Oil & Gas industry page, ‘Quality & certification’ section.",
    page: "/industries/oil-gas",
  },
  "industries.pumps-valves.hero": {
    title: "Pumps & Valves page — hero background",
    where: "Pumps & Valves industry page, the photograph behind the heading at the top.",
    page: "/industries/pumps-valves",
  },
  "industries.pumps-valves.component.1": {
    title: "Pumps & Valves — ‘Gaskets’ component photo",
    where: "Pumps & Valves industry page, ‘Components we supply’ — tab 1 of 3 (Gaskets).",
    page: "/industries/pumps-valves",
  },
  "industries.pumps-valves.component.2": {
    title: "Pumps & Valves — ‘O-Rings’ component photo",
    where: "Pumps & Valves industry page, ‘Components we supply’ — tab 2 of 3 (O-Rings).",
    page: "/industries/pumps-valves",
  },
  "industries.pumps-valves.component.3": {
    title: "Pumps & Valves — ‘Oil Seals’ component photo",
    where: "Pumps & Valves industry page, ‘Components we supply’ — tab 3 of 3 (Oil Seals).",
    page: "/industries/pumps-valves",
  },
  "industries.pumps-valves.facility": {
    title: "Pumps & Valves — quality section photo",
    where: "Pumps & Valves industry page, ‘Quality & certification’ section.",
    page: "/industries/pumps-valves",
  },
  "industries.water-fluid-management.hero": {
    title: "Water & Fluid Management page — hero background",
    where: "Water & Fluid Management industry page, the photograph behind the heading at the top.",
    page: "/industries/water-fluid-management",
  },
  "industries.water-fluid-management.component.1": {
    title: "Water & Fluid Management — ‘Gaskets’ component photo",
    where: "Water & Fluid Management industry page, ‘Components we supply’ — tab 1 of 3 (Gaskets).",
    page: "/industries/water-fluid-management",
  },
  "industries.water-fluid-management.component.2": {
    title: "Water & Fluid Management — ‘O-Rings’ component photo",
    where: "Water & Fluid Management industry page, ‘Components we supply’ — tab 2 of 3 (O-Rings).",
    page: "/industries/water-fluid-management",
  },
  "industries.water-fluid-management.component.3": {
    title: "Water & Fluid Management — ‘Oil Seals’ component photo",
    where: "Water & Fluid Management industry page, ‘Components we supply’ — tab 3 of 3 (Oil Seals).",
    page: "/industries/water-fluid-management",
  },
  "industries.water-fluid-management.facility": {
    title: "Water & Fluid Management — quality section photo",
    where: "Water & Fluid Management industry page, ‘Quality & certification’ section.",
    page: "/industries/water-fluid-management",
  },
  "about.closing": {
    title: "About — closing section photo",
    where: "About page, the photograph in the closing section at the bottom.",
    page: "/about",
  },
  "about.audit": {
    title: "About — certifications audit photo",
    where: "About page, ‘Certifications’ section, the audit photograph.",
    page: "/about",
  },
  "about.founder": {
    title: "About — founder quote portrait",
    where: "About page, the portrait beside the founder quote.",
    page: "/about",
  },
  "why.global-export": {
    title: "Why Margo — ‘Global export’ photo",
    where: "Why Margo page, ‘Global export’ section.",
    page: "/why-margo",
  },
  "export.hero": {
    title: "Export page — hero background",
    where: "Export page, the photograph behind the heading at the top.",
    page: "/export",
  },
  "export.market.1": {
    title: "Export — Australia market photo",
    where: "Export page, market block 1 of 8 (“Supplying Australian Industrial Buyers”).",
    page: "/export",
  },
  "export.market.2": {
    title: "Export — UAE & Saudi market photo",
    where: "Export page, market block 2 of 8 (“Gulf Region Export, UAE & Saudi Arabia”).",
    page: "/export",
  },
  "export.market.3": {
    title: "Export — US & EU market photo",
    where: "Export page, market block 3 of 8 (“United States & European Union”).",
    page: "/export",
  },
  "export.market.4": {
    title: "Export — UK market photo",
    where: "Export page, market block 4 of 8 (“Export to the United Kingdom”).",
    page: "/export",
  },
  "export.market.5": {
    title: "Export — Malaysia market photo",
    where: "Export page, market block 5 of 8 (“Supplying Malaysian Manufacturers”).",
    page: "/export",
  },
  "export.market.6": {
    title: "Export — USA market photo",
    where: "Export page, market block 6 of 8 (“Exporting to the United States”).",
    page: "/export",
  },
  "export.market.7": {
    title: "Export — Singapore market photo",
    where: "Export page, market block 7 of 8 (“Singapore, Distribution Hub & Direct Supply”).",
    page: "/export",
  },
  "export.market.8": {
    title: "Export — Kenya / Tanzania market photo",
    where: "Export page, market block 8 of 8 (“East Africa, Kenya & Tanzania”).",
    page: "/export",
  },
  "certifications.hero": {
    title: "Certifications page — hero background",
    where: "Certifications page, the photograph behind the heading at the top.",
    page: "/certifications",
  },
  "sku.anti-vibration-mounts--ac-vibration-weight.photo": {
    title: "Weight Rubber, A/C Vibration Extractor — product photo",
    where: "The part page for Weight Rubber, A/C Vibration Extractor: the main gallery image and thumbnails 1 and 4.",
    page: "/products/anti-vibration-mounts/ac-vibration-weight",
  },
  "sku.anti-vibration-mounts--backlight-mount.photo": {
    title: "Back Light Rubber Mount (Bolero) — product photo",
    where: "The part page for Back Light Rubber Mount (Bolero): the main gallery image and thumbnails 1 and 4.",
    page: "/products/anti-vibration-mounts/backlight-mount",
  },
  "sku.anti-vibration-mounts--bumper-stopper.photo": {
    title: "Bumper Stopper — product photo",
    where: "The part page for Bumper Stopper: the main gallery image and thumbnails 1 and 4.",
    page: "/products/anti-vibration-mounts/bumper-stopper",
  },
  "sku.anti-vibration-mounts--scorpio-footrest-mat.photo": {
    title: "Scorpio Footrest Rubber Mat — product photo",
    where: "The part page for Scorpio Footrest Rubber Mat: the main gallery image and thumbnails 1 and 4.",
    page: "/products/anti-vibration-mounts/scorpio-footrest-mat",
  },
  "sku.anti-vibration-mounts--tata-bumper-stopper.photo": {
    title: "Bumper Stopper for Tata — product photo",
    where: "The part page for Bumper Stopper for Tata: the main gallery image and thumbnails 1 and 4.",
    page: "/products/anti-vibration-mounts/tata-bumper-stopper",
  },
  "sku.bushes--aem-insulation-bush.photo": {
    title: "AEM Insulation Bush — product photo",
    where: "The part page for AEM Insulation Bush: the main gallery image and thumbnails 1 and 4.",
    page: "/products/bushes/aem-insulation-bush",
  },
  "sku.gaskets--c-pillar-garnish.photo": {
    title: "C-Pillar Garnish EPDM Hard Foam — product photo",
    where: "The part page for C-Pillar Garnish EPDM Hard Foam: the main gallery image and thumbnails 1 and 4.",
    page: "/products/gaskets/c-pillar-garnish",
  },
  "sku.gaskets--epdm.photo": {
    title: "EPDM Gasket — product photo",
    where: "The part page for EPDM Gasket: the main gallery image and thumbnails 1 and 4.",
    page: "/products/gaskets/epdm",
  },
  "sku.gaskets--foam-gaskets.photo": {
    title: "Foam Gaskets — product photo",
    where: "The part page for Foam Gaskets: the main gallery image and thumbnails 1 and 4.",
    page: "/products/gaskets/foam-gaskets",
  },
  "sku.grommets--3-pin-hole-pad.photo": {
    title: "3 Pin Hole Pad (Electrical Pass-Through) — product photo",
    where: "The part page for 3 Pin Hole Pad (Electrical Pass-Through): the main gallery image and thumbnails 1 and 4.",
    page: "/products/grommets/3-pin-hole-pad",
  },
  "sku.grommets--internal-fit.photo": {
    title: "Rubber Grommet Internal Fits — product photo",
    where: "The part page for Rubber Grommet Internal Fits: the main gallery image and thumbnails 1 and 4.",
    page: "/products/grommets/internal-fit",
  },
  "sku.o-rings--seal-filler-cap-o-rings.photo": {
    title: "Seal Filler Cap O-Rings — product photo",
    where: "The part page for Seal Filler Cap O-Rings: the main gallery image and thumbnails 1 and 4.",
    page: "/products/o-rings/seal-filler-cap-o-rings",
  },
  "sku.oil-seals--compression-pump-inlays.photo": {
    title: "Silicone Compression Pump Inlays — product photo",
    where: "The part page for Silicone Compression Pump Inlays: the main gallery image and thumbnails 1 and 4.",
    page: "/products/oil-seals/compression-pump-inlays",
  },
  "sku.oil-seals--epdm.photo": {
    title: "EPDM Oil Seals — product photo",
    where: "The part page for EPDM Oil Seals: the main gallery image and thumbnails 1 and 4.",
    page: "/products/oil-seals/epdm",
  },
  "sku.oil-seals--fkm.photo": {
    title: "FKM Oil Seals — product photo",
    where: "The part page for FKM Oil Seals: the main gallery image and thumbnails 1 and 4.",
    page: "/products/oil-seals/fkm",
  },
  "sku.oil-seals--fkm-compression-pump-inlays.photo": {
    title: "FKM Compression Pump Inlays — product photo",
    where: "The part page for FKM Compression Pump Inlays: the main gallery image and thumbnails 1 and 4.",
    page: "/products/oil-seals/fkm-compression-pump-inlays",
  },
  "sku.oil-seals--nbr.photo": {
    title: "NBR Oil Seals — product photo",
    where: "The part page for NBR Oil Seals: the main gallery image and thumbnails 1 and 4.",
    page: "/products/oil-seals/nbr",
  },
  "sku.oil-seals--silicone.photo": {
    title: "Silicone Oil Seals — product photo",
    where: "The part page for Silicone Oil Seals: the main gallery image and thumbnails 1 and 4.",
    page: "/products/oil-seals/silicone",
  },
  "sku.pads-stoppers-caps--ac-flaps.photo": {
    title: "Rubber Flap for A/C Air Extractor — product photo",
    where: "The part page for Rubber Flap for A/C Air Extractor: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/ac-flaps",
  },
  "sku.pads-stoppers-caps--big-support-pad.photo": {
    title: "Big Support Pad — product photo",
    where: "The part page for Big Support Pad: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/big-support-pad",
  },
  "sku.pads-stoppers-caps--bolero-support-pad.photo": {
    title: "Support Pad for Bolero — product photo",
    where: "The part page for Support Pad for Bolero: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/bolero-support-pad",
  },
  "sku.pads-stoppers-caps--boot-tailgate-switch.photo": {
    title: "Boot Tailgate Switch — product photo",
    where: "The part page for Boot Tailgate Switch: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/boot-tailgate-switch",
  },
  "sku.pads-stoppers-caps--c-pad.photo": {
    title: "C Pad — product photo",
    where: "The part page for C Pad: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/c-pad",
  },
  "sku.pads-stoppers-caps--epdm-pad.photo": {
    title: "EPDM Pad — product photo",
    where: "The part page for EPDM Pad: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/epdm-pad",
  },
  "sku.pads-stoppers-caps--glove-box-stopper.photo": {
    title: "Glove Box Stopper — product photo",
    where: "The part page for Glove Box Stopper: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/glove-box-stopper",
  },
  "sku.pads-stoppers-caps--insulator-head-cover.photo": {
    title: "Rubber Insulator Head Cover — product photo",
    where: "The part page for Rubber Insulator Head Cover: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/insulator-head-cover",
  },
  "sku.pads-stoppers-caps--l-pad.photo": {
    title: "L Pad — product photo",
    where: "The part page for L Pad: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/l-pad",
  },
  "sku.pads-stoppers-caps--oil-filler-cap.photo": {
    title: "Oil Filler Cap — product photo",
    where: "The part page for Oil Filler Cap: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/oil-filler-cap",
  },
  "sku.pads-stoppers-caps--oil-seal-filler-cap.photo": {
    title: "Oil Seal Filler Cap — product photo",
    where: "The part page for Oil Seal Filler Cap: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/oil-seal-filler-cap",
  },
  "sku.pads-stoppers-caps--radiator-shroud-flaps.photo": {
    title: "Rubber Radiator Shroud Flaps — product photo",
    where: "The part page for Rubber Radiator Shroud Flaps: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/radiator-shroud-flaps",
  },
  "sku.pads-stoppers-caps--rubber-plungers.photo": {
    title: "Rubber Plungers — product photo",
    where: "The part page for Rubber Plungers: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/rubber-plungers",
  },
} satisfies Record<ImageKey, SlotLabel>;

export function slotLabel(key: string): SlotLabel {
  return (
    (IMAGE_SLOT_LABELS as Record<string, SlotLabel>)[key] ?? {
      title: key,
      where: "",
      page: "/",
    }
  );
}
