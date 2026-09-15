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
 * The page groups the Studio lists slots under, in site order.
 * The key is the first segment of the registry key.
 */
export const PAGE_GROUPS: Record<string, string> = {
  home: "Home page",
  products: "Products page & product categories",
  industries: "Industries page & industry pages",
  about: "About page",
  export: "Export page",
  certifications: "Certifications page",
  "case-studies": "Case Studies page",
  contact: "Contact page",
  sku: "Part pages (all 31)",
  why: "Why Margo page",
  brand: "Logo",
};

const NOT_SHOWN = "Not shown anywhere on the site at the moment.";

export const IMAGE_SLOT_LABELS = {
  /* ── Logo ─────────────────────────────────────────────────────────── */
  "brand.mark": {
    title: "Logo mark (the symbol on its own)",
    where: "Site header and footer, beside the MARGO wordmark — on every page.",
    page: "/",
  },
  "brand.logo": {
    title: "Logo with wordmark",
    where: "Site header and footer — on every page.",
    page: "/",
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
    title: "O-Rings card",
    where: "Products page range grid and the home page portfolio grid — card 1 of 11.",
    page: "/products",
  },
  "products.card.oil-seals": {
    title: "Oil Seals card",
    where: "Products page range grid and the home page portfolio grid — card 2 of 11.",
    page: "/products",
  },
  "products.card.gaskets": {
    title: "Gaskets card",
    where: "Products page range grid and the home page portfolio grid — card 3 of 11.",
    page: "/products",
  },
  "products.card.bellows": {
    title: "Bellows card",
    where: "Products page range grid and the home page portfolio grid — card 4 of 11.",
    page: "/products",
  },
  "products.card.anti-vibration-mounts": {
    title: "Anti-Vibration Mounts card",
    where: "Products page range grid and the home page portfolio grid — card 5 of 11.",
    page: "/products",
  },
  "products.card.grommets": {
    title: "Grommets card",
    where: "Products page range grid and the home page portfolio grid — card 6 of 11.",
    page: "/products",
  },
  "products.card.bushes": {
    title: "Bushes & Bushings card",
    where: "Products page range grid and the home page portfolio grid — card 7 of 11.",
    page: "/products",
  },
  "products.card.pads-stoppers-caps": {
    title: "Pads, Stoppers & Caps card",
    where: "Products page range grid and the home page portfolio grid — card 8 of 11.",
    page: "/products",
  },
  "products.card.leak-test-rubber": {
    title: "Leak Test Rubber card",
    where: "Products page range grid and the home page portfolio grid — card 9 of 11.",
    page: "/products",
  },
  "products.card.extrusion": {
    title: "Extrusion Profiles card",
    where: "Products page range grid and the home page portfolio grid — card 10 of 11.",
    page: "/products",
  },
  "products.card.sponge-foam-rubber": {
    title: "Sponge & Foam Rubber card",
    where: "Products page range grid and the home page portfolio grid — card 11 of 11.",
    page: "/products",
  },

  /* ── Product category pages ───────────────────────────────────────── */
  "products.material.fkm": {
    title: "FKM material card",
    where: "‘Material selection’ section on nine product category pages (O-Rings, Oil Seals, Gaskets and the rest).",
    page: "/products/o-rings",
  },
  "products.material.nbr": {
    title: "NBR material card",
    where: "‘Material selection’ section on nine product category pages.",
    page: "/products/o-rings",
  },
  "products.material.epdm": {
    title: "EPDM material card",
    where: "‘Material selection’ section on nine product category pages.",
    page: "/products/o-rings",
  },
  "products.material.silicone": {
    title: "Silicone material card",
    where: "‘Material selection’ section on nine product category pages.",
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
    title: "Automotive card",
    where: "Industries page grid — card 1 of 9.",
    page: "/industries",
  },
  "industries.mining": {
    title: "Mining card",
    where: "Industries page grid — card 2 of 9.",
    page: "/industries",
  },
  "industries.oil-gas": {
    title: "Oil & Gas card",
    where: "Industries page grid — card 3 of 9.",
    page: "/industries",
  },
  "industries.pumps-valves": {
    title: "Pumps & Valves card",
    where: "Industries page grid — card 4 of 9.",
    page: "/industries",
  },
  "industries.hvac": {
    title: "HVAC card",
    where: "Industries page grid — card 5 of 9.",
    page: "/industries",
  },
  "industries.electrical-electronics": {
    title: "Electrical & Electronics card",
    where: "Industries page grid — card 6 of 9.",
    page: "/industries",
  },
  "industries.agriculture": {
    title: "Agriculture card",
    where: "Industries page grid — card 7 of 9.",
    page: "/industries",
  },
  "industries.medical-devices": {
    title: "Medical Devices card",
    where: "Industries page grid — card 8 of 9.",
    page: "/industries",
  },
  "industries.water-fluid-management": {
    title: "Water & Fluid Management card",
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
    title: "Mining page — ‘Components we supply’ photo",
    where: "Mining industry page, ‘Components we supply’ section (used in three of the tabs).",
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
    title: "Quality & certification — Nashik line photo",
    where: "‘Quality & certification’ section on all nine industry pages.",
    page: "/industries/mining",
  },

  /* ── About page ───────────────────────────────────────────────────── */
  "about.hero": {
    title: "About page — hero background",
    where: "About page, the photograph behind the heading at the top (also used again in the closing section).",
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
    where: "About page, ‘Manufacturing’ section, the large photograph (also the audit photo in ‘Certifications’).",
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
    where: "About page, ‘Leadership’ section, card 1 (also the photo beside the founder quote).",
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
    title: "Export — stacked containers photo",
    where: "Export page.",
    page: "/export",
  },
  "export.warehouse": {
    title: "Export — warehouse forklift photo",
    where: "Export page.",
    page: "/export",
  },
  "export.gantry": {
    title: "Export — quayside cranes photo",
    where: "Export page.",
    page: "/export",
  },
  "export.vessel": {
    title: "Export — container vessel photo",
    where: "Export page.",
    page: "/export",
  },
  "export.pallets": {
    title: "Export — heat-treated pallets photo",
    where: "Export page.",
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
    title: "Part pages — main product photo",
    where: "Every part page (all 31): the main gallery image and two of the four thumbnails.",
    page: "/products/anti-vibration-mounts/ac-vibration-weight",
  },
  "sku.finishing": {
    title: "Part pages — finishing photo",
    where: "Every part page (all 31): a gallery thumbnail, the ‘Why specifiers choose Margo’ main image, and the FAQ image.",
    page: "/products/anti-vibration-mounts/ac-vibration-weight",
  },
  "sku.machining": {
    title: "Part pages — machining photo",
    where: "Every part page (all 31): a gallery thumbnail and the small ‘Why specifiers’ inset.",
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
