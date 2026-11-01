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
  "products.card.seals": {
    title: "Products page — Reciprocating Seals card",
    where: "Products page range grid. Stand-in: the Reciprocating Seals page's hero photograph until the card's own is uploaded.",
    page: "/products",
  },
  "products.card.rubber-lining": {
    title: "Products page — Rubber Lining & Skirting card",
    where: "Products page range grid. Stand-in: the Rubber Lining & Skirting page's hero photograph until the card's own is uploaded.",
    page: "/products",
  },
  "products.card.rubber-mats": {
    title: "Products page — Rubber Mats card",
    where: "Products page range grid. Stand-in: the Rubber Mats page's hero photograph until the card's own is uploaded.",
    page: "/products",
  },
  "products.card.diaphragms": {
    title: "Products page — Diaphragms card",
    where: "Products page range grid. Stand-in: the Diaphragms page's hero photograph until the card's own is uploaded.",
    page: "/products",
  },
  "products.card.bonded-components": {
    title: "Products page — Bonded Components card",
    where: "Products page range grid. Stand-in: the Bonded Components page's hero photograph until the card's own is uploaded.",
    page: "/products",
  },

  /* ── Product category pages ───────────────────────────────────────── */
  "products.o-rings.hero": {
    title: "O-Rings page — hero background",
    where: "O-Rings category page, the photograph behind the heading at the top.",
    page: "/products/o-rings",
  },
  "products.o-rings.hero-wide": {
    title: "O-Rings page — wide hero photo (desktop)",
    where: "O-Rings category page on desktop: the wide photograph filling the hero behind and beside the heading. Use a landscape shot (about 2.4:1) with the product on the right.",
    page: "/products/o-rings",
  },
  "products.extrusion.hero-wide": {
    title: "Extrusion Profiles page — wide hero photo (desktop)",
    where: "Extrusion Profiles category page on desktop: the wide photograph filling the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/extrusion",
  },
  "products.extrusion.hero": {
    title: "Extrusion Profiles page — hero background",
    where: "Extrusion Profiles category page, the photograph behind the heading at the top.",
    page: "/products/extrusion",
  },
  "industries.construction.hero": {
    title: "Construction page — hero background",
    where: "Construction page, the photograph behind the heading at the top. Stand-in: another page's photograph until this page's own is uploaded — the content sheet asks for “EPDM glazing gaskets and expansion joint seals extruded at Margo Rubber Products, Nashik”.",
    page: "/industries/construction",
  },
  "products.sponge-foam.hero-wide": {
    title: "Sponge & Foam page — wide hero photo (desktop)",
    where: "Sponge & Foam Rubber category page on desktop: the wide photograph filling the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/sponge-foam-rubber",
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
  "industries.transport": {
    title: "Industries page — Transport — Rail & Marine card",
    where: "Industries page grid. Stand-in: the Transport — Rail & Marine page's hero photograph until the card's own is uploaded.",
    page: "/industries",
  },
  "industries.construction": {
    title: "Industries page — Construction card",
    where: "Industries page grid. Stand-in: the Construction page's hero photograph until the card's own is uploaded.",
    page: "/industries",
  },

  /* ── Industry pages ───────────────────────────────────────────────── */
  "industries.mining.hero": {
    title: "Mining page — hero background",
    where: "Mining industry page, the photograph behind the heading at the top.",
    page: "/industries/mining",
  },
  "products.rubber-lining.hero-wide": {
    title: "Rubber Lining & Skirting page — wide hero photo (desktop)",
    where: "Rubber Lining & Skirting page on desktop: the wide photograph filling the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/rubber-lining",
  },
  "products.rubber-lining.hero": {
    title: "Rubber Lining & Skirting page — hero background",
    where: "Rubber Lining & Skirting page, the photograph behind the heading at the top. Stand-in: another page's photograph until this page's own is uploaded — the content sheet asks for “Natural rubber chute lining and conveyor skirting cut at Margo Rubber Products, Nashik”.",
    page: "/products/rubber-lining",
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
  "contact.map": {
    title: "Contact page — map still",
    where: "Contact page, the map picture beside the address. It links to Google Maps; upload a screenshot of the plant's location.",
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
    where: "Not shown on the site at the moment: the home page hero plays a video instead, with the video's own first frame as its still. Uploading here changes nothing visible.",
    page: "/",
  },
  "home.portfolio.o-rings": {
    title: "Home — O-Rings portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 1 of 12.",
    page: "/",
  },
  "home.portfolio.oil-seals": {
    title: "Home — Oil Seals portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 2 of 12.",
    page: "/",
  },
  "home.portfolio.gaskets": {
    title: "Home — Gaskets portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 3 of 12.",
    page: "/",
  },
  "home.portfolio.bellows": {
    title: "Home — Bellows portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 4 of 12.",
    page: "/",
  },
  "home.portfolio.anti-vibration-mounts": {
    title: "Home — Anti-Vibration Mounts portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 5 of 12.",
    page: "/",
  },
  "home.portfolio.grommets": {
    title: "Home — Grommets portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 6 of 12.",
    page: "/",
  },
  "home.portfolio.bushes": {
    title: "Home — Bushes & Sleeves portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 7 of 12.",
    page: "/",
  },
  "home.portfolio.pads-stoppers-caps": {
    title: "Home — Pads, Stoppers & Caps portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 8 of 12.",
    page: "/",
  },
  "home.portfolio.leak-test-rubber": {
    title: "Home — Leak Test Rubber portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 9 of 12.",
    page: "/",
  },
  "home.portfolio.extrusion": {
    title: "Home — Extrusion portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 10 of 12.",
    page: "/",
  },
  "home.portfolio.sponge-foam-rubber": {
    title: "Home — Sponge & Foam Rubber portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 11 of 12.",
    page: "/",
  },
  "home.portfolio.rubber-mats": {
    title: "Home — Rubber Mats portfolio card",
    where: "Home page, ‘Our portfolio’ grid — card 12 of 12.",
    page: "/",
  },
  "products.sectors.automotive": {
    title: "Products page — Automotive sector card",
    where: "Products page, ‘Industries we serve’ — card 1 of 11.",
    page: "/products",
  },
  "products.sectors.oil-gas": {
    title: "Products page — Oil & Gas sector card",
    where: "Products page, ‘Industries we serve’ — card 2 of 11.",
    page: "/products",
  },
  "products.sectors.mining": {
    title: "Products page — Mining sector card",
    where: "Products page, ‘Industries we serve’ — card 3 of 11.",
    page: "/products",
  },
  "products.sectors.pumps-valves": {
    title: "Products page — Pumps & Valves sector card",
    where: "Products page, ‘Industries we serve’ — card 4 of 11.",
    page: "/products",
  },
  "products.sectors.hvac": {
    title: "Products page — HVAC sector card",
    where: "Products page, ‘Industries we serve’ — card 5 of 11.",
    page: "/products",
  },
  "products.sectors.electrical-electronics": {
    title: "Products page — Electrical sector card",
    where: "Products page, ‘Industries we serve’ — card 6 of 11.",
    page: "/products",
  },
  "products.sectors.medical-devices": {
    title: "Products page — Medical sector card",
    where: "Products page, ‘Industries we serve’ — card 7 of 11.",
    page: "/products",
  },
  "products.sectors.water-fluid-management": {
    title: "Products page — Water sector card",
    where: "Products page, ‘Industries we serve’ — card 8 of 11.",
    page: "/products",
  },
  "products.sectors.ev-energy-storage-renewables": {
    title: "Products page — EV & Renewables sector card",
    where: "Products page, ‘Industries we serve’ — card 10 of 11. Stand-in: the EV industry page's hero photograph.",
    page: "/products",
  },
  "products.sectors.food-beverage-pharma": {
    title: "Products page — Food & Beverage sector card",
    where: "Products page, ‘Industries we serve’ — card 11 of 11. Stand-in: the Food, Beverage & Pharma industry page's hero photograph.",
    page: "/products",
  },
  "products.anti-vibration-mounts.hero-wide": {
    title: "Anti-Vibration Mounts page — wide hero photo (desktop)",
    where: "Anti-Vibration Mounts category page on desktop: the wide photograph filling the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/anti-vibration-mounts",
  },
  "products.anti-vibration-mounts.hero": {
    title: "Anti-Vibration Mounts page — hero background",
    where: "Anti-Vibration Mounts category page, the photograph behind the heading at the top.",
    page: "/products/anti-vibration-mounts",
  },
  "products.bonded-components.hero-wide": {
    title: "Bonded Components page — wide hero photo (desktop)",
    where: "Bonded Components page on desktop: the wide photograph in the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/bonded-components",
  },
  "products.bonded-components.hero": {
    title: "Bonded Components page — hero background",
    where: "Bonded Components page, the photograph behind the heading at the top. Stand-in: another page's photograph until this page's own is uploaded — the content sheet asks for “Rubber-to-metal bonded mounts and bushes moulded at Margo Rubber Products, Nashik”.",
    page: "/products/bonded-components",
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
  "products.anti-vibration-mounts.material.aem": {
    title: "Anti-Vibration Mounts — AEM (Vamac®) material card",
    where: "Anti-Vibration Mounts category page, ‘Material selection’ section — card 6 of 8. Stand-in: shows the Silicone (VMQ) card's photograph until its own is uploaded.",
    page: "/products/anti-vibration-mounts",
  },
  "products.anti-vibration-mounts.material.sbr": {
    title: "Anti-Vibration Mounts — SBR material card",
    where: "Anti-Vibration Mounts category page, ‘Material selection’ section — card 4 of 8. Stand-in: shows the FKM (Viton®) card's photograph until its own is uploaded.",
    page: "/products/anti-vibration-mounts",
  },
  "products.anti-vibration-mounts.material.cr": {
    title: "Anti-Vibration Mounts — Neoprene (CR) material card",
    where: "Anti-Vibration Mounts category page, ‘Material selection’ section — card 2 of 8. Stand-in: shows the EPDM card's photograph until its own is uploaded.",
    page: "/products/anti-vibration-mounts",
  },
  "products.anti-vibration-mounts.material.nr": {
    title: "Anti-Vibration Mounts — Natural rubber (NR) material card",
    where: "Anti-Vibration Mounts category page, ‘Material selection’ section — card 1 of 8. Stand-in: shows the NBR (Nitrile) card's photograph until its own is uploaded.",
    page: "/products/anti-vibration-mounts",
  },
  "products.bellows.hero-wide": {
    title: "Bellows page — wide hero photo (desktop)",
    where: "Bellows category page on desktop: the wide photograph filling the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/bellows",
  },
  "products.bellows.hero": {
    title: "Bellows page — hero background",
    where: "Bellows category page, the photograph behind the heading at the top.",
    page: "/products/bellows",
  },
  "products.diaphragms.hero-wide": {
    title: "Diaphragms page — wide hero photo (desktop)",
    where: "Diaphragms page on desktop: the wide photograph in the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/diaphragms",
  },
  "products.diaphragms.hero": {
    title: "Diaphragms page — hero background",
    where: "Diaphragms page, the photograph behind the heading at the top. Stand-in: another page's photograph until this page's own is uploaded — the content sheet asks for “Fabric-reinforced rubber diaphragms moulded at Margo Rubber Products, Nashik”.",
    page: "/products/diaphragms",
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
  "products.bellows.material.sbr": {
    title: "Bellows — SBR material card",
    where: "Bellows category page, ‘Material selection’ section — card 7 of 8. Stand-in: shows the Silicone (VMQ) card's photograph until its own is uploaded.",
    page: "/products/bellows",
  },
  "products.bellows.material.aem": {
    title: "Bellows — AEM (Vamac®) material card",
    where: "Bellows category page, ‘Material selection’ section — card 5 of 8. Stand-in: shows the FKM (Viton®) card's photograph until its own is uploaded.",
    page: "/products/bellows",
  },
  "products.bellows.material.cr": {
    title: "Bellows — Neoprene (CR) material card",
    where: "Bellows category page, ‘Material selection’ section — card 2 of 8. Stand-in: shows the EPDM card's photograph until its own is uploaded.",
    page: "/products/bellows",
  },
  "products.bellows.material.nr": {
    title: "Bellows — Natural rubber (NR) material card",
    where: "Bellows category page, ‘Material selection’ section — card 1 of 8. Stand-in: shows the NBR (Nitrile) card's photograph until its own is uploaded.",
    page: "/products/bellows",
  },
  "products.bushes.hero-wide": {
    title: "Bushes page — wide hero photo (desktop)",
    where: "Bushes category page on desktop: the wide photograph filling the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/bushes",
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
  "products.bushes.material.sbr": {
    title: "Bushes — SBR material card",
    where: "Bushes category page, ‘Material selection’ section — card 6 of 8. Stand-in: shows the Silicone (VMQ) card's photograph until its own is uploaded.",
    page: "/products/bushes",
  },
  "products.bushes.material.cr": {
    title: "Bushes — Neoprene (CR) material card",
    where: "Bushes category page, ‘Material selection’ section — card 4 of 8. Stand-in: shows the FKM (Viton®) card's photograph until its own is uploaded.",
    page: "/products/bushes",
  },
  "products.bushes.material.aem": {
    title: "Bushes — AEM (Vamac®) material card",
    where: "Bushes category page, ‘Material selection’ section — card 2 of 8. Stand-in: shows the EPDM card's photograph until its own is uploaded.",
    page: "/products/bushes",
  },
  "products.bushes.material.nr": {
    title: "Bushes — Natural rubber (NR) material card",
    where: "Bushes category page, ‘Material selection’ section — card 1 of 8. Stand-in: shows the NBR (Nitrile) card's photograph until its own is uploaded.",
    page: "/products/bushes",
  },
  "products.gaskets.hero-wide": {
    title: "Gaskets page — wide hero photo (desktop)",
    where: "Gaskets category page on desktop: the wide photograph filling the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/gaskets",
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
  "products.gaskets.material.epdm-sponge": {
    title: "Gaskets — EPDM sponge material card",
    where: "Gaskets category page, ‘Material selection’ section — card 9 of 9. Stand-in: shows the EPDM card's photograph until its own is uploaded.",
    page: "/products/gaskets",
  },
  "products.gaskets.material.nr": {
    title: "Gaskets — Natural rubber (NR) material card",
    where: "Gaskets category page, ‘Material selection’ section — card 8 of 9. Stand-in: shows the Silicone (VMQ) card's photograph until its own is uploaded.",
    page: "/products/gaskets",
  },
  "products.gaskets.material.sbr": {
    title: "Gaskets — SBR material card",
    where: "Gaskets category page, ‘Material selection’ section — card 7 of 9. Stand-in: shows the FKM (Viton®) card's photograph until its own is uploaded.",
    page: "/products/gaskets",
  },
  "products.gaskets.material.cr": {
    title: "Gaskets — Neoprene (CR) material card",
    where: "Gaskets category page, ‘Material selection’ section — card 6 of 9. Stand-in: shows the NBR (Nitrile) card's photograph until its own is uploaded.",
    page: "/products/gaskets",
  },
  "products.gaskets.material.aem": {
    title: "Gaskets — AEM (Vamac®) material card",
    where: "Gaskets category page, ‘Material selection’ section — card 5 of 9. Stand-in: shows the EPDM card's photograph until its own is uploaded.",
    page: "/products/gaskets",
  },
  "products.grommets.hero-wide": {
    title: "Grommets page — wide hero photo (desktop)",
    where: "Grommets category page on desktop: the wide photograph filling the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/grommets",
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
  "products.grommets.material.nr": {
    title: "Grommets — Natural rubber (NR) material card",
    where: "Grommets category page, ‘Material selection’ section — card 8 of 8. Stand-in: shows the FKM (Viton®) card's photograph until its own is uploaded.",
    page: "/products/grommets",
  },
  "products.grommets.material.sbr": {
    title: "Grommets — SBR material card",
    where: "Grommets category page, ‘Material selection’ section — card 7 of 8. Stand-in: shows the Silicone (VMQ) card's photograph until its own is uploaded.",
    page: "/products/grommets",
  },
  "products.grommets.material.aem": {
    title: "Grommets — AEM (Vamac®) material card",
    where: "Grommets category page, ‘Material selection’ section — card 5 of 8. Stand-in: shows the NBR (Nitrile) card's photograph until its own is uploaded.",
    page: "/products/grommets",
  },
  "products.grommets.material.cr": {
    title: "Grommets — Neoprene (CR) material card",
    where: "Grommets category page, ‘Material selection’ section — card 3 of 8. Stand-in: shows the EPDM card's photograph until its own is uploaded.",
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
  "products.leak-test-rubber.hero-wide": {
    title: "Leak Test Rubber page — wide hero photo (desktop)",
    where: "Leak Test Rubber category page on desktop: the wide photograph filling the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/leak-test-rubber",
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
  "products.leak-test-rubber.material.aem": {
    title: "Leak Test Rubber — AEM (Vamac®) material card",
    where: "Leak Test Rubber category page, ‘Material selection’ section — card 7 of 8. Stand-in: shows the FKM (Viton®) card's photograph until its own is uploaded.",
    page: "/products/leak-test-rubber",
  },
  "products.leak-test-rubber.material.sbr": {
    title: "Leak Test Rubber — SBR material card",
    where: "Leak Test Rubber category page, ‘Material selection’ section — card 6 of 8. Stand-in: shows the Silicone (VMQ) card's photograph until its own is uploaded.",
    page: "/products/leak-test-rubber",
  },
  "products.leak-test-rubber.material.nr": {
    title: "Leak Test Rubber — Natural rubber (NR) material card",
    where: "Leak Test Rubber category page, ‘Material selection’ section — card 4 of 8. Stand-in: shows the NBR (Nitrile) card's photograph until its own is uploaded.",
    page: "/products/leak-test-rubber",
  },
  "products.leak-test-rubber.material.cr": {
    title: "Leak Test Rubber — Neoprene (CR) material card",
    where: "Leak Test Rubber category page, ‘Material selection’ section — card 3 of 8. Stand-in: shows the EPDM card's photograph until its own is uploaded.",
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
  "products.o-rings.material.ptfe": {
    title: "O-Rings — PTFE-encapsulated material card",
    where: "O-Rings category page, ‘Material selection’ section — card 9 of 9. Stand-in: shows the FKM (Viton®) card's photograph until its own is uploaded.",
    page: "/products/o-rings",
  },
  "products.o-rings.material.nr": {
    title: "O-Rings — Natural rubber (NR) material card",
    where: "O-Rings category page, ‘Material selection’ section — card 8 of 9. Stand-in: shows the Silicone (VMQ) card's photograph until its own is uploaded.",
    page: "/products/o-rings",
  },
  "products.o-rings.material.sbr": {
    title: "O-Rings — SBR material card",
    where: "O-Rings category page, ‘Material selection’ section — card 7 of 9. Stand-in: shows the EPDM card's photograph until its own is uploaded.",
    page: "/products/o-rings",
  },
  "products.o-rings.material.cr": {
    title: "O-Rings — Neoprene (CR) material card",
    where: "O-Rings category page, ‘Material selection’ section — card 6 of 9. Stand-in: shows the NBR (Nitrile) card's photograph until its own is uploaded.",
    page: "/products/o-rings",
  },
  "products.o-rings.material.aem": {
    title: "O-Rings — AEM (Vamac®) material card",
    where: "O-Rings category page, ‘Material selection’ section — card 1 of 9. Stand-in: shows the FKM (Viton®) card's photograph until its own is uploaded.",
    page: "/products/o-rings",
  },
  "products.oil-seals.hero-wide": {
    title: "Oil Seals page — wide hero photo (desktop)",
    where: "Oil Seals category page on desktop: the wide photograph filling the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/oil-seals",
  },
  "products.oil-seals.hero": {
    title: "Oil Seals page — hero background",
    where: "Oil Seals category page, the photograph behind the heading at the top.",
    page: "/products/oil-seals",
  },
  "products.seals.hero-wide": {
    title: "Reciprocating Seals page — wide hero photo (desktop)",
    where: "Reciprocating Seals page on desktop: the wide photograph filling the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/seals",
  },
  "products.seals.hero": {
    title: "Reciprocating Seals page — hero background",
    where: "Reciprocating Seals page, the photograph behind the heading at the top. Stand-in: another page's photograph until this page's own is uploaded — the content sheet asks for “Moulded rubber plunger cups and rod seals produced at Margo Rubber Products, Nashik”.",
    page: "/products/seals",
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
  "products.oil-seals.material.nr": {
    title: "Oil Seals — Natural rubber (NR) material card",
    where: "Oil Seals category page, ‘Material selection’ section — card 8 of 8. Stand-in: shows the Silicone (VMQ) card's photograph until its own is uploaded.",
    page: "/products/oil-seals",
  },
  "products.oil-seals.material.sbr": {
    title: "Oil Seals — SBR material card",
    where: "Oil Seals category page, ‘Material selection’ section — card 7 of 8. Stand-in: shows the EPDM card's photograph until its own is uploaded.",
    page: "/products/oil-seals",
  },
  "products.oil-seals.material.cr": {
    title: "Oil Seals — Neoprene (CR) material card",
    where: "Oil Seals category page, ‘Material selection’ section — card 6 of 8. Stand-in: shows the NBR (Nitrile) card's photograph until its own is uploaded.",
    page: "/products/oil-seals",
  },
  "products.oil-seals.material.aem": {
    title: "Oil Seals — AEM (Vamac®) material card",
    where: "Oil Seals category page, ‘Material selection’ section — card 1 of 8. Stand-in: shows the FKM (Viton®) card's photograph until its own is uploaded.",
    page: "/products/oil-seals",
  },
  "products.pads-stoppers-caps.hero-wide": {
    title: "Pads, Stoppers & Caps page — wide hero photo (desktop)",
    where: "Pads, Stoppers & Caps category page on desktop: the wide photograph filling the hero beside the heading. Use a landscape shot with the product on the right.",
    page: "/products/pads-stoppers-caps",
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
  "products.pads-stoppers-caps.material.aem": {
    title: "Pads, Stoppers & Caps — AEM (Vamac®) material card",
    where: "Pads, Stoppers & Caps category page, ‘Material selection’ section — card 6 of 8. Stand-in: shows the FKM (Viton®) card's photograph until its own is uploaded.",
    page: "/products/pads-stoppers-caps",
  },
  "products.pads-stoppers-caps.material.sbr": {
    title: "Pads, Stoppers & Caps — SBR material card",
    where: "Pads, Stoppers & Caps category page, ‘Material selection’ section — card 5 of 8. Stand-in: shows the Silicone (VMQ) card's photograph until its own is uploaded.",
    page: "/products/pads-stoppers-caps",
  },
  "products.pads-stoppers-caps.material.cr": {
    title: "Pads, Stoppers & Caps — Neoprene (CR) material card",
    where: "Pads, Stoppers & Caps category page, ‘Material selection’ section — card 4 of 8. Stand-in: shows the NBR (Nitrile) card's photograph until its own is uploaded.",
    page: "/products/pads-stoppers-caps",
  },
  "products.pads-stoppers-caps.material.nr": {
    title: "Pads, Stoppers & Caps — Natural rubber (NR) material card",
    where: "Pads, Stoppers & Caps category page, ‘Material selection’ section — card 3 of 8. Stand-in: shows the EPDM card's photograph until its own is uploaded.",
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
  "industries.transport.hero": {
    title: "Transport — Rail & Marine page — hero background",
    where: "Transport — Rail & Marine page, the photograph behind the heading at the top. Stand-in: another page's photograph until this page's own is uploaded — the content sheet asks for “Extruded EPDM window and hatch seals produced at Margo Rubber Products, Nashik”.",
    page: "/industries/transport",
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
    title: "A/C Extractor Damper Weight — product photo",
    where: "The part page for A/C Extractor Damper Weight: the main gallery image and thumbnails 1 and 4.",
    page: "/products/anti-vibration-mounts/ac-vibration-weight",
  },
  "sku.extrusion--rear-windscreen-glazing-rubber.photo": {
    title: "Rear Windscreen Glazing Rubber — product photo",
    where: "The part page for Rear Windscreen Glazing Rubber: the main gallery image and thumbnails 1 and 4.",
    page: "/products/extrusion/rear-windscreen-glazing-rubber",
  },
  "sku.anti-vibration-mounts--bumper-stopper.photo": {
    title: "Bumper Stopper — product photo",
    where: "The part page for Bumper Stopper: the main gallery image and thumbnails 1 and 4.",
    page: "/products/anti-vibration-mounts/bumper-stopper",
  },
  "sku.pads-stoppers-caps--side-step-pad.photo": {
    title: "Anti-Slip Side Step Pad — product photo",
    where: "The part page for Anti-Slip Side Step Pad: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/side-step-pad",
  },
  "sku.anti-vibration-mounts--cv-suspension-bump-stop.photo": {
    title: "Commercial Vehicle Suspension Bump Stop — product photo",
    where: "The part page for Commercial Vehicle Suspension Bump Stop: the main gallery image and thumbnails 1 and 4.",
    page: "/products/anti-vibration-mounts/cv-suspension-bump-stop",
  },
  "sku.bushes--aem-insulation-bush.photo": {
    title: "AEM Insulation Bush — product photo",
    where: "The part page for AEM Insulation Bush: the main gallery image and thumbnails 1 and 4.",
    page: "/products/bushes/aem-insulation-bush",
  },
  "sku.sponge-foam-rubber--c-pillar-garnish-seal.photo": {
    title: "C-Pillar Garnish Seal — product photo",
    where: "The part page for C-Pillar Garnish Seal: the main gallery image and thumbnails 1 and 4.",
    page: "/products/sponge-foam-rubber/c-pillar-garnish-seal",
  },
  "sku.gaskets--epdm.photo": {
    title: "EPDM Gaskets — product photo",
    where: "The part page for EPDM Gaskets: the main gallery image and thumbnails 1 and 4.",
    page: "/products/gaskets/epdm",
  },
  "sku.sponge-foam-rubber--foam-gaskets.photo": {
    title: "Foam Gaskets — product photo",
    where: "The part page for Foam Gaskets: the main gallery image and thumbnails 1 and 4.",
    page: "/products/sponge-foam-rubber/foam-gaskets",
  },
  "sku.grommets--3-pin-hole-pad.photo": {
    title: "3 Pin Hole Pad — product photo",
    where: "The part page for 3 Pin Hole Pad: the main gallery image and thumbnails 1 and 4.",
    page: "/products/grommets/3-pin-hole-pad",
  },
  "sku.grommets--internal-fit.photo": {
    title: "Internal Fit Grommets — product photo",
    where: "The part page for Internal Fit Grommets: the main gallery image and thumbnails 1 and 4.",
    page: "/products/grommets/internal-fit",
  },
  "sku.o-rings--seal-filler-cap-o-rings.photo": {
    title: "Oil Filler Cap O-Rings — product photo",
    where: "The part page for Oil Filler Cap O-Rings: the main gallery image and thumbnails 1 and 4.",
    page: "/products/o-rings/seal-filler-cap-o-rings",
  },
  "sku.oil-seals--compression-pump-inlays.photo": {
    title: "Compression Pump Inlays — product photo",
    where: "The part page for Compression Pump Inlays: the main gallery image and thumbnails 1 and 4.",
    page: "/products/oil-seals/compression-pump-inlays",
  },
  "sku.oil-seals--epdm.photo": {
    title: "EPDM Rotary Shaft Seals — product photo",
    where: "The part page for EPDM Rotary Shaft Seals: the main gallery image and thumbnails 1 and 4.",
    page: "/products/oil-seals/epdm",
  },
  "sku.oil-seals--fkm.photo": {
    title: "FKM Rotary Shaft Seals — product photo",
    where: "The part page for FKM Rotary Shaft Seals: the main gallery image and thumbnails 1 and 4.",
    page: "/products/oil-seals/fkm",
  },
  "sku.oil-seals--nbr.photo": {
    title: "NBR Rotary Shaft Seals — product photo",
    where: "The part page for NBR Rotary Shaft Seals: the main gallery image and thumbnails 1 and 4.",
    page: "/products/oil-seals/nbr",
  },
  "sku.oil-seals--silicone.photo": {
    title: "Silicone Rotary Shaft Seals — product photo",
    where: "The part page for Silicone Rotary Shaft Seals: the main gallery image and thumbnails 1 and 4.",
    page: "/products/oil-seals/silicone",
  },
  "sku.pads-stoppers-caps--ac-flaps.photo": {
    title: "Air Extractor Flap — product photo",
    where: "The part page for Air Extractor Flap: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/ac-flaps",
  },
  "sku.pads-stoppers-caps--big-support-pad.photo": {
    title: "Rubber Support Pads — product photo",
    where: "The part page for Rubber Support Pads: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/big-support-pad",
  },
  "sku.pads-stoppers-caps--bolero-support-pad.photo": {
    title: "Body Mount Pad — product photo",
    where: "The part page for Body Mount Pad: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/bolero-support-pad",
  },
  "sku.pads-stoppers-caps--boot-tailgate-switch.photo": {
    title: "Tailgate Switch Boot — product photo",
    where: "The part page for Tailgate Switch Boot: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/boot-tailgate-switch",
  },
  "sku.pads-stoppers-caps--c-pad.photo": {
    title: "Slotted Packing Pad — product photo",
    where: "The part page for Slotted Packing Pad: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/c-pad",
  },
  "sku.pads-stoppers-caps--epdm-pad.photo": {
    title: "Flat Packing Pad — product photo",
    where: "The part page for Flat Packing Pad: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/epdm-pad",
  },
  "sku.pads-stoppers-caps--glove-box-stopper.photo": {
    title: "Glove Box Stopper — product photo",
    where: "The part page for Glove Box Stopper: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/glove-box-stopper",
  },
  "sku.pads-stoppers-caps--insulator-head-cover.photo": {
    title: "Cylinder Head Cover Insulator — product photo",
    where: "The part page for Cylinder Head Cover Insulator: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/insulator-head-cover",
  },
  "sku.pads-stoppers-caps--l-pad.photo": {
    title: "Angle Packing Pad — product photo",
    where: "The part page for Angle Packing Pad: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/l-pad",
  },
  "sku.pads-stoppers-caps--oil-filler-cap.photo": {
    title: "Rubber Oil Filler Cap — product photo",
    where: "The part page for Rubber Oil Filler Cap: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/oil-filler-cap",
  },
  "sku.pads-stoppers-caps--radiator-shroud-flaps.photo": {
    title: "Radiator Shroud Flaps — product photo",
    where: "The part page for Radiator Shroud Flaps: the main gallery image and thumbnails 1 and 4.",
    page: "/products/pads-stoppers-caps/radiator-shroud-flaps",
  },
  "sku.seals--plunger-seals.photo": {
    title: "Plunger Seals & Plunger Cups — product photo",
    where: "The part page for Plunger Seals & Plunger Cups: the main gallery image and thumbnails 1 and 4.",
    page: "/products/seals/plunger-seals",
  },
  "sku.gaskets--flat-rubber-washers.photo": {
    title: "Flat Rubber Washers — product photo",
    where: "The part page for Flat Rubber Washers: the main gallery image and thumbnails 1 and 4.",
    page: "/products/gaskets/flat-rubber-washers",
  },
  "sku.bellows--convoluted-bellows.photo": {
    title: "Convoluted Moulded Bellows — product photo",
    where: "The part page for Convoluted Moulded Bellows: the main gallery image and thumbnails 1 and 4.",
    page: "/products/bellows/convoluted-bellows",
  },
  "sku.bellows--dust-covers-boots.photo": {
    title: "Dust Covers & Protective Boots — product photo",
    where: "The part page for Dust Covers & Protective Boots: the main gallery image and thumbnails 1 and 4.",
    page: "/products/bellows/dust-covers-boots",
  },
  "sku.extrusion--edge-trim.photo": {
    title: "Edge Trim (All-Rubber) — product photo",
    where: "The part page for Edge Trim (All-Rubber): the main gallery image and thumbnails 1 and 4.",
    page: "/products/extrusion/edge-trim",
  },
  "sku.gaskets--sanitary-tri-clamp-gaskets.photo": {
    title: "Sanitary Tri-Clamp (Ferrule) Gaskets — product photo",
    where: "The part page for Sanitary Tri-Clamp (Ferrule) Gaskets: the main gallery image and thumbnails 1 and 4.",
    page: "/products/gaskets/sanitary-tri-clamp-gaskets",
  },
  "sku.gaskets--ev-battery-pack-gaskets.photo": {
    title: "EV Battery-Pack & BESS Enclosure Gaskets — product photo",
    where: "The part page for EV Battery-Pack & BESS Enclosure Gaskets: the main gallery image and thumbnails 1 and 4.",
    page: "/products/gaskets/ev-battery-pack-gaskets",
  },
  "sku.anti-vibration-mounts--exhaust-hangers-isolators.photo": {
    title: "Exhaust Hangers & Isolators — product photo",
    where: "The part page for Exhaust Hangers & Isolators: the main gallery image and thumbnails 1 and 4.",
    page: "/products/anti-vibration-mounts/exhaust-hangers-isolators",
  },
  "sku.gaskets--rocker-cover-sump-gaskets.photo": {
    title: "Rocker-Cover, Sump & Intake-Manifold Gaskets — product photo",
    where: "The part page for Rocker-Cover, Sump & Intake-Manifold Gaskets: the main gallery image and thumbnails 1 and 4.",
    page: "/products/gaskets/rocker-cover-sump-gaskets",
  },
  "industries.food-beverage-pharma.hero": {
    title: "Food, Beverage & Pharma — hero background",
    where: "Food, Beverage & Pharma industry page, the photograph behind the heading at the top.",
    page: "/industries/food-beverage-pharma",
  },
  "industries.ev-energy-storage-renewables.hero": {
    title: "EV, Energy Storage & Renewables — hero background",
    where: "EV, Energy Storage & Renewables industry page, the photograph behind the heading at the top.",
    page: "/industries/ev-energy-storage-renewables",
  },
  "products.rubber-mats.hero": {
    title: "Rubber Mats — hero photograph",
    where: "Rubber Mats product page, the photograph in the hero.",
    page: "/products/rubber-mats",
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
