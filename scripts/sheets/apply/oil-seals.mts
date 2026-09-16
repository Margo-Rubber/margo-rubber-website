/**
 * 10_Product_Oil_Seals → productCategory-oil-seals.
 *
 *   node scripts/sheets/apply/oil-seals.mts [--write]
 */

import { applyDocument, client, field, heading, links, lit, loadSheet, paragraph, rows, section } from "../lib.mts";
import { categorySchema, cellRows } from "../category.mts";

const ID = "productCategory-oil-seals";
const sheet = loadSheet("10_Product_Oil_Seals");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v), v);

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");
const stats = rows(hero, "Stats").map((r) => ({ value: E(r[0]), label: E(r[1]) }));
const HERO_ALT = "Rotary oil seals moulded by Margo Rubber Products, Nashik, India";

/* ── 02 Specification reference ──────────────────────────────────────────── */
const spec = s("02");
const table = field(spec, "Table", "table");
for (const r of table.rows) for (const c of r) E(c);
// "Link the disclaimer beneath the table" — the notes give the line verbatim.
const SPEC_FOOTNOTE = "Typical values. See our technical disclaimer.";

/* ── 03 Material selection ───────────────────────────────────────────────── */
const mat = s("03");
const CODE: Record<string, string> = {
  "AEM (Vamac®)": "AEM",
  "FKM (Viton®)": "FKM",
  "NBR (Nitrile)": "NBR",
  EPDM: "EPDM",
  "Silicone (VMQ)": "VMQ",
  "Neoprene (CR)": "CR",
  SBR: "SBR",
  "Natural Rubber (NR)": "NR",
};
const existing = (await client.fetch(
  `*[_id == $id][0].sections[_key == "materialSection"][0].items[]{code, image}`,
  { id: ID },
)) as { code: string; image?: string }[];
const panels = rows(mat, "Panels").map((r) => {
  const code = CODE[r[0]];
  if (!code) throw new Error(`no compound code for panel "${r[0]}"`);
  const image = existing.find((it) => it.code === code)?.image;
  return {
    code,
    name: E(r[0]),
    tempRange: E(r[1]),
    hardness: E(r[2]),
    summary: E(r[3]),
    ...(image ? { image } : {}),
  };
});

/* ── 04 Parts in this category ───────────────────────────────────────────── */
const parts = s("04");
const items = rows(parts, "Cards").map((r) => ({ name: E(r[1]), availability: E(r[2]) }));

/* ── 05 Commercial terms ─────────────────────────────────────────────────── */
const com = s("05");
const terms = rows(com, "Rows").map((r) => ({ label: E(r[0]), value: E(r[1]), note: E(r[2]) }));

/* ── 06 Enquiry CTA ──────────────────────────────────────────────────────── */
const enq = s("06");
const [primary, secondary] = links(enq, "CTAs");

const patch = {
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  h1: h1.lines.map((l) => E(l)).join(" "),
  h1Accent: h1.accent[0],
  intro: E(paragraph(hero, "Subhead")),
  heroStats: stats,
  "hero.alt": HERO_ALT,
  heroBreadcrumb: true,

  'sections[_key=="specSection"].heading': E(heading(spec, "H2").value),
  'sections[_key=="specSection"].body': E(paragraph(spec, "Intro")),
  'sections[_key=="specSection"].columns': table.columns.map((c) => E(c)),
  'sections[_key=="specSection"].rows': cellRows(table.rows),
  // "Delete all five chips … The free-text filter also comes out."
  'sections[_key=="specSection"].controls': false,
  'sections[_key=="specSection"].footnote': E(SPEC_FOOTNOTE),

  'sections[_key=="materialSection"].heading': E(heading(mat, "H2").value),
  // The sheet writes no intro for this section; the live one comes off.
  'sections[_key=="materialSection"].body': undefined,
  'sections[_key=="materialSection"].items': panels,

  'sections[_key=="partsGrid"].eyebrow': E(lit(parts, "Eyebrow")),
  'sections[_key=="partsGrid"].heading': E(heading(parts, "H2").value),
  'sections[_key=="partsGrid"].body': E(paragraph(parts, "Intro")),
  'sections[_key=="partsGrid"].items': items,

  'sections[_key=="commercialSection"].eyebrow': E(lit(com, "Eyebrow")),
  'sections[_key=="commercialSection"].heading': E(heading(com, "H2").value),
  'sections[_key=="commercialSection"].body': E(paragraph(com, "Intro")),
  'sections[_key=="commercialSection"].rows': terms,

  'sections[_key=="cta"].heading': E(heading(enq, "H2").value),
  'sections[_key=="cta"].body': E(paragraph(enq, "Body")),
  'sections[_key=="cta"].primary': { label: E(primary.label), href: primary.href },
  'sections[_key=="cta"].secondary': { label: E(secondary.label), href: secondary.href },

  // FAQPage "carrying the lead-time answer from the commercial section":
  // the quoting question the notes name, answered by §05's intro. The
  // lead-time question has no written answer — OPEN-ITEMS.
  faqs: [{ q: "How is a custom oil seal quoted?", a: paragraph(com, "Intro") }],
  schemaProduct: {
    name: "Rotary and Static Oil Seals",
    description:
      "Oil seals moulded to shaft diameter, housing bore and width in eight compounds, to DIN 3760 and ISO 6194 profiles.",
  },
  "related.products": ["o-rings"],
  confirmWithMargo: [],
};

await applyDocument({ id: ID, type: "productCategory", schema: categorySchema, patch, expect });
