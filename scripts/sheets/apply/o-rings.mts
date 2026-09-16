/**
 * 09_Product_O_Rings → productCategory-o-rings.
 *
 *   node scripts/sheets/apply/o-rings.mts [--write]
 *
 * The sheet's eight sections onto the document's blocks, by block key. The
 * footer (§08) is the sitewide component, already applied from sheet 01.
 */

import { applyDocument, client, field, heading, links, lit, loadSheet, paragraph, paragraphs, rows, section, starAccent } from "../lib.mts";
import { arrowLink, categorySchema, cellRows } from "../category.mts";

const sheet = loadSheet("09_Product_O_Rings");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v), v);

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");
const cta = arrowLink(lit(hero, "CTA"));
const stats = rows(hero, "Stats").map((r) => ({ value: E(r[0]), label: E(r[1]) }));
// alt text is specified in the section's technical notes, verbatim.
const HERO_ALT = "Precision O-rings moulded by Margo Rubber Products, Nashik, India";

/* ── 02 Specification table ──────────────────────────────────────────────── */
const spec = s("02");
const specH2 = heading(spec, "H2");
const table = field(spec, "Full table", "table");
for (const r of table.rows) for (const c of r) E(c);
const footLines = lit(spec, "Footnote").split("\n");
// The component prints the live count itself; the rest is the sheet's.
const footnote = footLines.join("\n").replace(/^Showing \d+ of \d+ · /, "");
for (const l of footLines) E(l);
// Filter chips: derived from the table's standards by the component; the
// sheet's four are checked, not stored.
for (const chip of lit(spec, "Filter chips").split(" · ")) E(chip);

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
  "PTFE-encapsulated": "PTFE",
};
const existing = (await client.fetch(
  `*[_id == "productCategory-o-rings"][0].sections[_key == "materialSection"][0].items[]{code, image}`,
)) as { code: string; image?: string }[];
const panels = rows(mat, "Panels").map((r) => {
  const code = CODE[r[0]];
  if (!code) throw new Error(`no compound code for panel "${r[0]}"`);
  const image = existing.find((it) => it.code === code)?.image;
  return {
    code,
    name: E(r[0]),
    // Ranges and hardness render from Site settings for the eight
    // compounds; the sheet's figures are checked against that render.
    tempRange: E(r[1]),
    hardness: E(r[2]),
    summary: E(r[3]),
    ...(image ? { image } : {}),
  };
});
// Trade mark attribution — the technical notes give the footnote verbatim.
const MATERIAL_FOOTNOTE =
  "Viton is a registered trade mark of The Chemours Company. Vamac is a registered trade mark of DuPont. Teflon is a registered trade mark of The Chemours Company.";

/* ── 04 Parts in this category ───────────────────────────────────────────── */
const parts = s("04");
// Card: number, name, then "O-Rings · Made to order" — the sheet's three fields.
const items = rows(parts, "Cards").map((r) => ({ name: E(r[0]), availability: E(`${r[1]} · ${r[2]}`) }));

/* ── 05 Sizing standards ─────────────────────────────────────────────────── */
const std = s("05");
const cards = rows(std, "Cards").map((r) => ({ code: E(r[0]), name: E(r[1]), body: E(r[2]) }));

/* ── 06 Commercial terms ─────────────────────────────────────────────────── */
const com = s("06");
const terms = rows(com, "Rows").map((r) => ({ label: E(r[0]), value: E(r[1]), note: E(r[2]) }));

/* ── 07 Enquiry CTA ──────────────────────────────────────────────────────── */
const enq = s("07");
const [primary, secondary] = links(enq, "CTAs");

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

  'sections[_key=="specSection"].heading': starAccent(specH2).join(" "),
  'sections[_key=="specSection"].body': E(paragraph(spec, "Intro")),
  'sections[_key=="specSection"].columns': table.columns.map((c) => E(c)),
  'sections[_key=="specSection"].rows': cellRows(table.rows),
  'sections[_key=="specSection"].footnote': footnote,

  'sections[_key=="materialSection"].heading': E(heading(mat, "H2").value),
  'sections[_key=="materialSection"].body': E(paragraph(mat, "Intro")),
  'sections[_key=="materialSection"].items': panels,
  'sections[_key=="materialSection"].footnote': E(MATERIAL_FOOTNOTE),

  'sections[_key=="partsGrid"].eyebrow': E(lit(parts, "Eyebrow")),
  'sections[_key=="partsGrid"].heading': E(heading(parts, "H2").value),
  'sections[_key=="partsGrid"].body': E(paragraph(parts, "Intro")),
  'sections[_key=="partsGrid"].items': items,

  'sections[_key=="standardsSection"].heading': E(heading(std, "H2").value),
  'sections[_key=="standardsSection"].answer': E(paragraph(std, "Answer paragraph")),
  'sections[_key=="standardsSection"].items': cards,
  'sections[_key=="standardsSection"].closing': E(paragraphs(std, "Add: closing line")[0]),

  'sections[_key=="commercialSection"].heading': E(heading(com, "H2").value),
  'sections[_key=="commercialSection"].body': E(paragraph(com, "Intro")),
  'sections[_key=="commercialSection"].rows': terms,

  'sections[_key=="cta"].heading': E(heading(enq, "H2").value),
  'sections[_key=="cta"].body': E(paragraph(enq, "Body")),
  'sections[_key=="cta"].primary': { label: E(primary.label), href: primary.href },
  'sections[_key=="cta"].secondary': { label: E(secondary.label), href: secondary.href },

  // FAQPage: the questions the sheet answers in its own words — §05's
  // heading and answer, and "How is a custom O-ring order quoted?" (named in
  // §06's notes), answered by §06's intro. The material and lead-time
  // questions the notes also name have no written answers — OPEN-ITEMS.
  faqs: [
    { q: heading(std, "H2").value, a: paragraph(std, "Answer paragraph") },
    { q: "How is a custom O-ring order quoted?", a: paragraph(com, "Intro") },
  ],
  // Page-level structured data — the Product node, verbatim.
  schemaProduct: {
    name: "Precision O-Rings",
    description: "Custom and catalogue O-rings moulded to AS568, ISO 3601, JIS B2401 and DIN 3771 in eight compounds.",
  },
  "related.products": ["oil-seals"],
  // Every figure on the page is now the sheet's; nothing is left to confirm here.
  confirmWithMargo: [],
};

await applyDocument({
  id: "productCategory-o-rings",
  type: "productCategory",
  schema: categorySchema,
  patch,
  expect,
});
