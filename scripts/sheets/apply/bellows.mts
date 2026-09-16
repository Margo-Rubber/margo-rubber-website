/**
 * 12_Product_Bellows → productCategory-bellows.
 *
 *   node scripts/sheets/apply/bellows.mts [--write]
 *
 * No parts section on this page; the sheet renumbers the two that follow.
 */

import { applyDocument, client, field, heading, lit, litHref, loadSheet, paragraph, rows, section } from "../lib.mts";
import { arrowLink, categorySchema, cellRows } from "../category.mts";

const ID = "productCategory-bellows";
const sheet = loadSheet("12_Product_Bellows");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v.replace(/\*\*/g, "")), v);

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");
const cta = arrowLink(lit(hero, "Hero CTA"));
const stats = rows(hero, "Stats").map((r) => ({ value: E(r[0]), label: E(r[1]) }));
const HERO_ALT = "Convoluted rubber bellows moulded at Margo Rubber Products, Nashik";

/* ── 02 Specification reference ──────────────────────────────────────────── */
const spec = s("02");
const table = field(spec, "Table", "table");
for (const r of table.rows) for (const c of r) E(c);
// The chips filter by service, not by a standard's name; each carries the
// rule that selects its rows from the table's own cells.
const CHIP_RULE: Record<string, string> = {
  "Fatigue-critical": "^(Very high|High)$",
  "Oil contact": String.raw`^(?!.*not for (petroleum )?oil)(?!.*no oil contact).*\b(oil|hydraulic fluid)s?\b`,
  "Water & steam": String.raw`\b(water|steam|coolant)\b`,
  "High temperature": String.raw`\+(1[7-9]\d|2\d\d) °C`,
};
const chips = rows(spec, "Filter chips").map((r) => {
  E(r[0]);
  const rule = CHIP_RULE[r[0]];
  return rule ? `${r[0]} :: ${rule}` : r[0];
});
// Footnote with its two bold runs kept.
const footnote = field(spec, "Footnote", "paragraphs").marked[0];

/* ── 03 Material selection ───────────────────────────────────────────────── */
const mat = s("03");
const CODE: Record<string, string> = {
  "Natural rubber (NR)": "NR",
  "Neoprene (CR)": "CR",
  "NBR (Nitrile)": "NBR",
  EPDM: "EPDM",
  "AEM (Vamac®)": "AEM",
  "FKM (Viton®)": "FKM",
  SBR: "SBR",
  "Silicone (VMQ)": "VMQ",
};
const existing = (await client.fetch(
  `*[_id == $id][0].sections[_key == "materialSection"][0].items[]{code, image}`,
  { id: ID },
)) as { code: string; image?: string }[];
const panels = rows(mat, "Panels").map((r) => {
  const code = CODE[r[0]];
  if (!code) throw new Error(`no compound code for panel "${r[0]}"`);
  const image = existing.find((it) => it.code === code)?.image;
  return { code, name: E(r[0]), tempRange: E(r[1]), hardness: E(r[2]), summary: E(r[3]), ...(image ? { image } : {}) };
});

/* ── 04 Commercial terms ─────────────────────────────────────────────────── */
const com = s("04");
const terms = rows(com, "Rows").map((r) => ({ label: E(r[0]), value: E(r[1]), note: E(r[2]) }));

/* ── 05 Enquiries ────────────────────────────────────────────────────────── */
const enq = s("05");
const primary = litHref(enq, "Button 1");
const secondary = litHref(enq, "Button 2");

const patch = {
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  h1: h1.lines.map((l) => E(l)).join(" "),
  h1Accent: h1.accent[0],
  intro: E(paragraph(hero, "Subhead")),
  heroLink: { label: E(cta.label), href: cta.href },
  heroStats: stats,
  "hero.alt": HERO_ALT,
  heroBreadcrumb: true,

  'sections[_key=="specSection"].eyebrow': E(lit(spec, "Eyebrow")),
  'sections[_key=="specSection"].heading': E(heading(spec, "H2").value),
  'sections[_key=="specSection"].body': E(paragraph(spec, "Intro")),
  'sections[_key=="specSection"].columns': table.columns.map((c) => E(c)),
  'sections[_key=="specSection"].rows': cellRows(table.rows),
  'sections[_key=="specSection"].controls': true,
  'sections[_key=="specSection"].chips': chips,
  'sections[_key=="specSection"].searchPlaceholder': E(lit(spec, "Search field")),
  'sections[_key=="specSection"].footnote': E(footnote),

  'sections[_key=="materialSection"].eyebrow': E(lit(mat, "Eyebrow")),
  'sections[_key=="materialSection"].heading': E(heading(mat, "H2").value),
  'sections[_key=="materialSection"].body': E(paragraph(mat, "Intro")),
  'sections[_key=="materialSection"].items': panels,

  'sections[_key=="commercialSection"].eyebrow': E(lit(com, "Eyebrow")),
  'sections[_key=="commercialSection"].heading': E(heading(com, "H2").value),
  'sections[_key=="commercialSection"].body': E(paragraph(com, "Intro")),
  'sections[_key=="commercialSection"].rows': terms,

  'sections[_key=="cta"].eyebrow': E(lit(enq, "Eyebrow")),
  'sections[_key=="cta"].heading': E(heading(enq, "H2").value),
  'sections[_key=="cta"].body': E(paragraph(enq, "Body")),
  'sections[_key=="cta"].primary': { label: E(primary.label), href: primary.href },
  'sections[_key=="cta"].secondary': { label: E(secondary.label), href: secondary.href },

  faqs: [{ q: "How is a rubber bellows order quoted?", a: paragraph(com, "Intro") }],
  schemaProduct: {
    name: "Rubber Bellows and Protective Boots",
    description:
      "Convoluted bellows and protective boots moulded to customer drawing in eight compounds, specified by stroke, convolution count and service temperature.",
    material: ["Natural Rubber", "Neoprene", "NBR", "EPDM", "AEM", "FKM", "SBR", "Silicone"],
  },
  "related.products": ["oil-seals", "grommets"],
  confirmWithMargo: [],
};

await applyDocument({ id: ID, type: "productCategory", schema: categorySchema, patch, expect });
