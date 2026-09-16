/**
 * 11_Product_Gaskets → productCategory-gaskets.
 *
 *   node scripts/sheets/apply/gaskets.mts [--write]
 */

import { applyDocument, client, field, heading, lit, litHref, loadSheet, paragraph, rows, section } from "../lib.mts";
import { arrowLink, categorySchema, cellRows } from "../category.mts";

const ID = "productCategory-gaskets";
const sheet = loadSheet("11_Product_Gaskets");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v), v);

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");
const cta = arrowLink(lit(hero, "Hero CTA"));
const stats = rows(hero, "Stats").map((r) => ({ value: E(r[0]), label: E(r[1]) }));
// "If one is added, alt describes the part" — the notes give the line.
const HERO_ALT = "Moulded EPDM flange gaskets at Margo Rubber Products, Nashik";

/* ── 02 Specification reference ──────────────────────────────────────────── */
const spec = s("02");
const table = field(spec, "Table", "table");
for (const r of table.rows) for (const c of r) E(c);
const chips = rows(spec, "Filter chips").map((r) => E(r[0]));

/* ── 03 Material selection ───────────────────────────────────────────────── */
const mat = s("03");
const CODE: Record<string, string> = {
  EPDM: "EPDM",
  "NBR (Nitrile)": "NBR",
  "FKM (Viton®)": "FKM",
  "Silicone (VMQ)": "VMQ",
  "AEM (Vamac®)": "AEM",
  "Neoprene (CR)": "CR",
  SBR: "SBR",
  "Natural rubber (NR)": "NR",
  // Not a compound in Site settings: the panel keeps its own figures.
  "EPDM sponge / hard foam": "EPDM-SPONGE",
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

/* ── 04 Parts in this category ───────────────────────────────────────────── */
const parts = s("04");
const items = rows(parts, "Cards").map((r) => ({ name: E(r[0]), availability: E(`${r[1]} · ${r[2]}`) }));

/* ── 05 Commercial terms ─────────────────────────────────────────────────── */
const com = s("05");
const terms = rows(com, "Rows").map((r) => ({ label: E(r[0]), value: E(r[1]), note: E(r[2]) }));

/* ── 06 Enquiries ────────────────────────────────────────────────────────── */
const enq = s("06");
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
  'sections[_key=="specSection"].footnote': E(paragraph(spec, "Footnote")),

  'sections[_key=="materialSection"].eyebrow': E(lit(mat, "Eyebrow")),
  'sections[_key=="materialSection"].heading': E(heading(mat, "H2").value),
  'sections[_key=="materialSection"].body': E(paragraph(mat, "Intro")),
  'sections[_key=="materialSection"].items': panels,

  'sections[_key=="partsGrid"].eyebrow': E(lit(parts, "Eyebrow")),
  'sections[_key=="partsGrid"].heading': E(heading(parts, "H2").value),
  'sections[_key=="partsGrid"].body': E(paragraph(parts, "Intro")),
  'sections[_key=="partsGrid"].items': items,

  'sections[_key=="commercialSection"].eyebrow': E(lit(com, "Eyebrow")),
  'sections[_key=="commercialSection"].heading': E(heading(com, "H2").value),
  'sections[_key=="commercialSection"].body': E(paragraph(com, "Intro")),
  'sections[_key=="commercialSection"].rows': terms,

  'sections[_key=="cta"].eyebrow': E(lit(enq, "Eyebrow")),
  'sections[_key=="cta"].heading': E(heading(enq, "H2").value),
  'sections[_key=="cta"].body': E(paragraph(enq, "Body")),
  'sections[_key=="cta"].primary': { label: E(primary.label), href: primary.href },
  'sections[_key=="cta"].secondary': { label: E(secondary.label), href: secondary.href },

  // FAQPage: the quoting question the notes name, answered by §05's intro.
  // The other three named questions have no written answers — OPEN-ITEMS.
  faqs: [{ q: "How is a rubber gasket order quoted?", a: paragraph(com, "Intro") }],
  schemaProduct: {
    name: "Custom Rubber Gaskets",
    description:
      "Moulded and die-cut rubber gaskets to ASME B16.21, EN 1514-1 and JIS B2404 in eight compounds plus EPDM sponge.",
    material: ["FKM", "NBR", "EPDM", "Silicone", "AEM", "Neoprene", "SBR", "Natural Rubber", "EPDM Sponge"],
  },
  "related.products": ["o-rings", "oil-seals"],
  confirmWithMargo: [],
};

await applyDocument({ id: ID, type: "productCategory", schema: categorySchema, patch, expect });
