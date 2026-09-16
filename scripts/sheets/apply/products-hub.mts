/**
 * 02_Products → productsHub-products.
 *
 *   node scripts/sheets/apply/products-hub.mts [--write]
 */

import { productsHubSchema } from "../../../src/content/schemas/index.ts";
import {
  applyDocument,
  field,
  loadSheet,
  section,
  lit,
  litHref,
  heading,
  paragraph,
  rows,
  list,
  starAccent,
} from "../lib.mts";

const sheet = loadSheet("02_Products");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v), v);
/** A two-line H2 as one Section heading with the sheet's accent marked inline. */
const h2 = (sec: ReturnType<typeof s>, label = "H2") => {
  const h = heading(sec, label);
  h.lines.forEach((l) => expect.push(l));
  return starAccent(h).join(" ");
};

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");
const HERO_ICON: Record<string, string> = {
  "Product Lines": "chart",
  "Compounds Mixed In-House": "award",
  "Catalogue SKUs": "globe",
  "Certified Quality": "shield",
};
const heroStats = rows(hero, "Stat cards").map((r) => ({
  value: E(r[0]),
  label: E(r[1]),
  icon: HERO_ICON[r[1]] ?? "chart",
}));
const secondary = lit(hero, "CTA secondary").match(/^(.*?)\s*↓\s*(#\S+)$/);
if (!secondary) throw new Error("hero secondary");

/* ── 02 Range ────────────────────────────────────────────────────────────── */
const range = s("02");
const cardRows = rows(range, "Cards");
const SLUG: Record<string, string> = {
  "O-Rings": "o-rings",
  "Oil Seals": "oil-seals",
  Gaskets: "gaskets",
  Bellows: "bellows",
  Grommets: "grommets",
  "Bushes & Bushings": "bushes",
  "Anti-Vibration Mounts": "anti-vibration-mounts",
  "Pads, Stoppers & Caps": "pads-stoppers-caps",
  "Leak Test Rubber": "leak-test-rubber",
  "Extrusion Profiles": "extrusion",
  "Sponge & Foam Rubber": "sponge-foam-rubber",
};
const cards = cardRows.map((r, i) => {
  const slug = SLUG[r[0]];
  if (!slug) throw new Error(`card slug for ${r[0]}`);
  return {
    slug,
    title: E(r[0]),
    tag: r[1],
    unit: E(r[2]),
    kicker: E(r[3]),
    chips: r[4].split(" · ").map((c) => E(c.trim())),
    image: `products.card.${slug}`,
    // The comp's two wide tiles, and the labelled break before the two
    // continuous-form lines (Build Instructions §09 grouping is Phase 7).
    span: i === 0 || i === 7 ? "wide" : "normal",
    ...(slug === "extrusion"
      ? { groupLabel: "Continuous Profile & Cellular" }
      : {}),
  };
});
const rangeCta = litHref(range, "Closing link");

/* ── 03 Capacity ─────────────────────────────────────────────────────────── */
const cap = s("03");
const badge = lit(cap, "Capacity badge").split("\n");
const capStats = rows(cap, "Stat cards").map((r) => ({
  value: E(r[0]),
  label: E(r[1]),
  sub: E(r[2]),
}));

/* ── 04 Process ──────────────────────────────────────────────────────────── */
const proc = s("04");
const steps = rows(proc, "Steps").map((r) => ({
  n: r[0],
  title: E(r[1]),
  body: E(r[2]),
}));
const ticks = rows(proc, "Capability ticks").map((r) => E(r[0]));
const closing = lit(proc, "Closing block").split("\n");
// "Need a capability assessment?" / body lines / "[ Talk to an Engineer → ] /contact"
const closingHeading = E(closing[0]);
const closingBody = E(closing.slice(1, -1).join(" "));
const closingCta = closing[closing.length - 1].match(
  /^\[\s*(.*?)\s*→\s*\]\s*(\/\S*)$/,
);
if (!closingCta) throw new Error("process closing cta");

/* ── 05 Compounds ────────────────────────────────────────────────────────── */
const comp = s("05");
const DOT: Record<string, string> = {
  AEM: "#2BBCC4",
  FKM: "#FF9800",
  "Silicone (VMQ)": "#9B8FE8",
  EPDM: "#4CAF50",
  NBR: "#2BBCC4",
  "Neoprene (CR)": "#FFC107",
  SBR: "#B8BFC7",
  "Natural Rubber": "#E8B44A",
};
const compounds = rows(comp, "Tab panel").map((r) => ({
  code: E(r[0]),
  name: E(r[1]),
  summary: E(r[2]),
  dot: DOT[r[0]],
  temp: r[3],
  hardness: E(r[4]),
  bestFor: E(r[5]),
  tags: r[6].split(" · ").map((t) => E(t.trim())),
  applications: r[7]
    .split(" · ")
    .map((a) => E(a.replace(/^\d\d\s+/, "").trim())),
}));

/* ── 06 Sectors ──────────────────────────────────────────────────────────── */
const sect = s("06");
const SECTOR: Record<string, { href: string; image?: string }> = {
  Automotive: {
    href: "/industries/automotive",
    image: "products.sectors.automotive",
  },
  Mining: { href: "/industries/mining", image: "products.sectors.mining" },
  "Oil & Gas": {
    href: "/industries/oil-gas",
    image: "products.sectors.oil-gas",
  },
  "Pumps & Valves": {
    href: "/industries/pumps-valves",
    image: "products.sectors.pumps-valves",
  },
  HVAC: { href: "/industries/hvac", image: "products.sectors.hvac" },
  Electrical: {
    href: "/industries/electrical-electronics",
    image: "products.sectors.electrical-electronics",
  },
  Medical: {
    href: "/industries/medical-devices",
    image: "products.sectors.medical-devices",
  },
  Water: {
    href: "/industries/water-fluid-management",
    image: "products.sectors.water-fluid-management",
  },
  Agriculture: { href: "/industries/agriculture" },
};
const sectors = rows(sect, "Tab panel").map((r) => {
  const meta = SECTOR[r[0]];
  if (!meta) throw new Error(`sector ${r[0]}`);
  // Victor Reinz held pending confirmation — OPEN-ITEMS #3. Four sectors
  // have no named account: the sheet says publish the buyer type, never
  // invent — the cell reads "Buyer type — target sector, no named account
  // yet", and the buyer type is what goes on the page (OPEN-ITEMS #9).
  const clients = (r[3] ?? "")
    .split(" — ")[0]
    .split(" · ")
    .filter(Boolean)
    .map((c) => E(c))
    .join(" · ");
  return { name: E(r[0]), body: E(r[1]), products: E(r[2]), clients, ...meta };
});

/* ── 07 Certifications ───────────────────────────────────────────────────── */
const cert = s("07");
rows(cert, "Cards").forEach((r) => {
  E(r[1]);
  E(r[2]);
});
const certLink = litHref(cert, "Closing link");

/* ── 08 Testing ──────────────────────────────────────────────────────────── */
const test = s("08");
const groups = [
  {
    title: "In-house",
    rows: rows(test, "Group A").map((r) => ({
      test: E(r[0]),
      standard: E(r[1]),
    })),
  },
  {
    title: "Partner laboratory",
    rows: rows(test, "Group B").map((r) => ({
      test: E(r[0]),
      standard: E(r[1]),
    })),
  },
];

/* ── 09 Catalogue ────────────────────────────────────────────────────────── */
const cat = s("09");
const gate = lit(cat, "Gate").split("\n");
const gateSubmit = gate[1].match(/^\[\s*↓?\s*(.*?)\s*\]$/);
if (!gateSubmit) throw new Error("catalogue gate submit");

/* ── 10 FAQ ──────────────────────────────────────────────────────────────── */
const faq = s("10");
const faqs = rows(faq, "Q&A").map((r) => ({ q: E(r[0]), a: E(r[1]) }));

/* ── 11 Quote ────────────────────────────────────────────────────────────── */
const quote = s("11");
const direct = lit(quote, "Direct contact").split("\n");
// PHONE +91 96655 79276 Mon–Sat, 9am–6pm IST · EMAIL info@… Reply within one business day · ADDRESS …
const phone = direct[0].match(/^PHONE\s+(\+91 \d{5} \d{5})\s+(.*)$/);
const email = direct[1].match(/^EMAIL\s+(\S+)\s+(.*)$/);
if (!phone || !email) throw new Error("direct contact");
// "ADDRESS Margo Rubber Products" then the street lines — the whole block is the value.
const address = [direct[2].replace(/^ADDRESS\s+/, ""), ...direct.slice(3)]
  .map((l) => l.replace(/,$/, ""))
  .join(", ");

const patch = {
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  badge: E(lit(hero, "Eyebrow")),
  h1: h1.lines.join(" "),
  h1Lines: h1.lines.map((l) => E(l)),
  h1AccentLines: [1],
  intro: E(paragraph(hero, "Subhead")),
  actions: [
    { label: E(lit(hero, "CTA primary")), href: "#range", variant: "primary" },
    { label: E(secondary[1]), href: secondary[2], variant: "secondary" },
  ],
  heroStats,
  // The sheet has no marquee; the old one named Aerospace and Pharmaceutical.
  marquee: [],

  "range.eyebrow": E(lit(range, "Eyebrow")),
  "range.heading": h2(range),
  "range.body": E(paragraph(range, "Intro")),
  "range.filters": lit(range, "Filter chips")
    .split(" · ")
    .map((f) => E(f.trim())),
  "range.cards": cards,
  "range.cta": { label: E(rangeCta.label), href: rangeCta.href },

  "excellence.eyebrow": E(lit(cap, "Eyebrow")),
  "excellence.heading": h2(cap),
  "excellence.body": E(paragraph(cap, "Intro")),
  "excellence.imageBadge": { label: E(badge[0]), value: E(badge[1]) },
  "excellence.stats": capStats,

  "process.heading": h2(proc),
  "process.steps": steps,
  "process.capabilities.items": ticks,
  "process.capabilities.cta": {
    heading: closingHeading,
    body: closingBody,
    label: E(closingCta[1]),
    href: closingCta[2],
  },

  "compounds.eyebrow": E(lit(comp, "Eyebrow")),
  "compounds.heading": h2(comp),
  "compounds.body": E(paragraph(comp, "Intro")),
  "compounds.items": compounds,
  "compounds.cta": (() => {
    const l = litHref(comp, "Closing link");
    return { label: E(l.label), href: l.href };
  })(),

  "sectors.eyebrow": E(lit(sect, "Eyebrow")),
  "sectors.heading": h2(sect),
  "sectors.body": E(paragraph(sect, "Intro")),
  "sectors.items": sectors,

  "certifications.eyebrow": E(lit(cert, "Eyebrow")),
  "certifications.heading": h2(cert),
  "certifications.body": E(paragraph(cert, "Intro")),
  "certifications.cta": { label: E(certLink.label), href: certLink.href },

  "validation.eyebrow": E(lit(test, "Eyebrow")),
  "validation.heading": h2(test),
  "validation.body": E(paragraph(test, "Intro")),
  "validation.groups": groups,
  // Label from the sheet; the button stays hidden until a file exists.
  "validation.cta": {
    label:
      field(test, "CTA", "paragraphs").lits?.[0]?.replace(/\s*↓$/, "") ?? "",
    href: "/contact",
  },

  "catalogue.heading": E(heading(cat, "H2").value),
  "catalogue.body": E(paragraph(cat, "Body")),
  "catalogue.bullets": list(cat, "Bullets").map((b) => E(b)),
  "catalogue.submitLabel": E(gateSubmit[1]),
  "catalogue.footnote": E(gate[2]),

  "faqSection.eyebrow": E(lit(faq, "Eyebrow")),
  "faqSection.heading": h2(faq),
  faqs,

  "quote.eyebrow": E(lit(quote, "Eyebrow")),
  "quote.heading": E(heading(quote, "H2").value),
  "quote.body": E(paragraph(quote, "Intro")),
  "quote.contacts": [
    { icon: "phone", label: "PHONE", value: E(phone[1]), note: E(phone[2]) },
    { icon: "email", label: "EMAIL", value: E(email[1]), note: E(email[2]) },
    { icon: "address", label: "ADDRESS", value: E(address) },
  ],
  "quote.promises": list(quote, "Quote promise").map((p) => E(p)),
};

await applyDocument({
  id: "productsHub-products",
  type: "productsHub",
  schema: productsHubSchema,
  patch,
  expect,
});
