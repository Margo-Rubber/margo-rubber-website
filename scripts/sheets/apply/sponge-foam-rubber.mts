/**
 * 19_Product_Sponge_Foam_Rubber → productCategory-sponge-foam-rubber.
 *
 *   node scripts/sheets/apply/sponge-foam-rubber.mts [--write]
 *
 * The foam template: cell-morphology panels, compound selector and table
 * (one data source), density scale, the self-adhesive tape sub-category,
 * application cards, specification guide, sectors, enquiry band.
 */

import { applyDocument, client, field, heading, lit, litHref, loadSheet, paragraph, rows, section } from "../lib.mts";
import { arrowLink, categorySchema, cellRows } from "../category.mts";

const ID = "productCategory-sponge-foam-rubber";
const sheet = loadSheet("19_Product_Sponge_Foam_Rubber");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v.replace(/\*\*/g, "")), v);

const current = (await client.fetch(`*[_id == $id][0]`, { id: ID })) as {
  sections: Record<string, unknown>[];
};
const block = <T = Record<string, unknown>,>(key: string): T => {
  const b = current.sections.find((x) => x._key === key);
  if (!b) throw new Error(`${ID}: no block ${key}`);
  return b as T;
};
const keepAccent = (key: string, text: string) => {
  const old = (block(key).heading as string) ?? "";
  E(text);
  return old.replace(/\*/g, "") === text ? old : text;
};

/**
 * The datasheet is a page (sheet 40) — the PDF the sheet links does not
 * exist yet, so the button carries the document's own title and opens it.
 * Restore "Download Datasheet ↓ /resources/sponge-foam-datasheet.pdf" once
 * the file is published.
 */
const DATASHEET = { label: "Sponge & Foam Rubber Datasheet", href: "/resources/sponge-foam-datasheet" };

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");
const cta1 = litHref(hero, "CTA 1");
const stats = rows(hero, "Stats").map((r) => ({ value: E(r[0]), label: E(r[1]) }));

/* ── 02 Cell morphology ──────────────────────────────────────────────────── */
const cell = s("02");
const oldPanels = block<{ panels: { label: string; caption: string; diagram: string }[] }>("compareSection").panels;
const panels = [rows(cell, "Card 1"), rows(cell, "Card 2")].map((r, i) => ({
  label: oldPanels[i].label,
  caption: oldPanels[i].caption,
  diagram: oldPanels[i].diagram,
  rows: r.map((row) => ({ label: E(row[0]), value: E(row[1]) })),
}));

/* ── 03 + 04 Compound selector and comparison — one data source ──────────── */
const sel = s("03");
const cmp = s("04");
const table = field(cmp, "Table", "table");
for (const r of table.rows) for (const c of r) E(c);
const compounds = table.rows.map((r) => ({ code: r[0], fullName: r[1], hardness: r[2], tempRange: r[3], applications: r[4] }));

/* ── 05 Density ──────────────────────────────────────────────────────────── */
const den = s("05");
const quoteText = lit(den, "Pull-quote").replace(/^"|"$/g, "").replace(/\n/g, " ");
const [author, org] = lit(den, "Attribution").split("\n");
const range = lit(den, "Range indicator").split("\n");
const ends = range[0].match(/^(\S+) (\S+) —+ (\S+) (\S+)$/);
const labels = range[1].match(/^(LOW · \S+ kg\/m³) · (.*?) (HIGH · \S+ kg\/m³) · (.*)$/);
if (!ends || !labels) throw new Error("density range indicator");
const bands = rows(den, "Bands").map((r) => ({ range: E(r[0]), note: E(r[1]) }));

/* ── 06 Self-adhesive foam tape ──────────────────────────────────────────── */
const tape = s("06");
const oldSub = block<{ buildUp: { label: string }; comparisons: { label: string }[]; note: { title: string } }>("subCategorySection");
const [divider, tapeEyebrow] = lit(tape, "Eyebrow").split(" · ");
const layers = lit(tape, "Cross-section build-up").split("\n").map((l) => E(l));
const cores = rows(tape, "Foam core").map((r) => ({
  name: E(r[0]),
  rows: [
    { label: "Temperature", value: E(r[1]) },
    { label: "Resistance", value: E(r[2]) },
    { label: "Used for", value: E(r[3]) },
  ],
}));
// "System | Recommended for | Properties" — properties are bare points; the
// last, written as a limitation, is the caveat.
const adhesives = rows(tape, "Adhesive").map((r) => {
  const points = r[2].split(" · ");
  return {
    name: E(r[0]),
    tag: E(r[1]),
    rows: points.map((p, i) => ({ label: E(p), caveat: i === points.length - 1 })),
  };
});

/* ── 07 Applications ─────────────────────────────────────────────────────── */
const app = s("07");
const oldApps = block<{ items: { image?: string }[] }>("applicationsSection").items;
const apps = rows(app, "Cards").map((r, i) => ({
  ...(oldApps[i]?.image ? { image: oldApps[i].image } : {}),
  tag: E(r[0]),
  name: E(r[1]),
  body: E(r[2]),
}));

/* ── 08 Specification guide ──────────────────────────────────────────────── */
const guide = s("08");
const oldParams = block<{ items: { icon?: string }[] }>("specifySection").items;
const params = rows(guide, "Parameters").map((r, i) => ({
  ...(oldParams[i]?.icon ? { icon: oldParams[i].icon } : {}),
  label: E(r[1]),
  value: E(r[2]),
  body: E(r[3]),
}));

/* ── 09 Sectors ──────────────────────────────────────────────────────────── */
const sec = s("09");
const SECTOR_ICON: Record<string, string> = {
  Automotive: "vehicle",
  "HVAC & refrigeration": "airflow",
  Construction: "building",
  "Electrical & electronics": "chip",
  "Medical & food": "shield",
  "Transport — rail and marine": "vehicle",
  Mining: "pick",
  "Water & fluid management": "droplet",
  "General industry": "wrench",
};
const sectors = rows(sec, "Cards").map((r) => {
  const icon = SECTOR_ICON[r[0]];
  if (!icon) throw new Error(`no icon for sector "${r[0]}"`);
  if (!/^\/industries\/[a-z-]+$/.test(r[3])) throw new Error(`sector href ${r[3]}`);
  // Applications, then the compound preference — the card's one line.
  return { icon, name: E(r[0]), body: `${E(r[1])} · ${E(r[2])}`, href: r[3] };
});
const sectorLink = field(sec, "Card link", "lit");
E(sectorLink.value.replace("{sector}", sectors[0].name));

/* ── 10 Enquiries ────────────────────────────────────────────────────────── */
const enq = s("10");
const h2 = heading(enq, "H2");
const [b1] = lit(enq, "Buttons").split("\n").map(arrowLink);

const patch = {
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  h1: h1.lines.map((l) => E(l)).join(" "),
  h1Accent: h1.accent[0],
  intro: E(paragraph(hero, "Subhead")),
  heroActions: [
    { label: E(cta1.label), href: cta1.href, variant: "primary" },
    { label: DATASHEET.label, href: DATASHEET.href, variant: "secondary" },
  ],
  heroStats: stats,
  heroBreadcrumb: true,

  'sections[_key=="compareSection"].eyebrow': E(lit(cell, "Eyebrow")),
  'sections[_key=="compareSection"].heading': keepAccent("compareSection", heading(cell, "H2").value),
  'sections[_key=="compareSection"].body': E(paragraph(cell, "Intro")),
  'sections[_key=="compareSection"].panels': panels,

  'sections[_key=="compoundSection"].eyebrow': E(lit(sel, "Eyebrow")),
  'sections[_key=="compoundSection"].heading': keepAccent("compoundSection", heading(sel, "H2").value),
  'sections[_key=="compoundSection"].body': E(paragraph(sel, "Intro")),
  'sections[_key=="compoundSection"].items': compounds,

  'sections[_key=="specSection"].eyebrow': E(lit(cmp, "Eyebrow")),
  'sections[_key=="specSection"].heading': keepAccent("specSection", heading(cmp, "H2").value),
  'sections[_key=="specSection"].body': undefined,
  'sections[_key=="specSection"].columns': table.columns.map((c) => E(c)),
  'sections[_key=="specSection"].rows': cellRows(table.rows),
  'sections[_key=="specSection"].controls': false,
  'sections[_key=="specSection"].footnote': E(field(cmp, "Footnote", "paragraphs").marked[0]),

  'sections[_key=="densitySection"].eyebrow': E(lit(den, "Eyebrow")),
  'sections[_key=="densitySection"].heading': keepAccent("densitySection", heading(den, "H2").value),
  'sections[_key=="densitySection"].scale': {
    min: E(ends[1]),
    unit: E(ends[2]),
    max: E(ends[3]),
    lowLabel: E(labels[1]),
    lowNote: E(labels[2]),
    highLabel: E(labels[3]),
    highNote: E(labels[4]),
  },
  'sections[_key=="densitySection"].quote': { text: E(quoteText), author: E(author), org: E(org) },
  'sections[_key=="densitySection"].bands': bands,

  'sections[_key=="subCategorySection"].dividerLabel': E(divider),
  'sections[_key=="subCategorySection"].eyebrow': E(tapeEyebrow),
  'sections[_key=="subCategorySection"].heading': keepAccent("subCategorySection", heading(tape, "H2").value),
  'sections[_key=="subCategorySection"].body': E(paragraph(tape, "Intro")),
  'sections[_key=="subCategorySection"].buildUp': { label: oldSub.buildUp.label, layers },
  'sections[_key=="subCategorySection"].comparisons': [
    { label: oldSub.comparisons[0].label, items: cores },
    { label: oldSub.comparisons[1].label, items: adhesives },
  ],
  'sections[_key=="subCategorySection"].note': { title: oldSub.note.title, body: E(paragraph(tape, "Engineering note")) },

  'sections[_key=="applicationsSection"].eyebrow': E(lit(app, "Eyebrow")),
  'sections[_key=="applicationsSection"].heading': keepAccent("applicationsSection", heading(app, "H2").value),
  'sections[_key=="applicationsSection"].body': E(paragraph(app, "Intro")),
  'sections[_key=="applicationsSection"].items': apps,

  'sections[_key=="specifySection"].eyebrow': E(lit(guide, "Eyebrow")),
  'sections[_key=="specifySection"].heading': keepAccent("specifySection", heading(guide, "H2").value),
  'sections[_key=="specifySection"].body': E(paragraph(guide, "Intro")),
  'sections[_key=="specifySection"].items': params,

  'sections[_key=="sectorsSection"].eyebrow': E(lit(sec, "Eyebrow")),
  'sections[_key=="sectorsSection"].heading': keepAccent("sectorsSection", heading(sec, "H2").value),
  'sections[_key=="sectorsSection"].body': E(paragraph(sec, "Intro")),
  'sections[_key=="sectorsSection"].items': sectors,
  'sections[_key=="sectorsSection"].cardCta': sectorLink.value,

  'sections[_key=="cta"].eyebrow': E(lit(enq, "Eyebrow")),
  'sections[_key=="cta"].heading': keepAccent("cta", h2.lines.map((l) => E(l)).join(" ")),
  'sections[_key=="cta"].body': E(paragraph(enq, "Body")),
  // No badges on this sheet's enquiry band.
  'sections[_key=="cta"].chips': [],
  'sections[_key=="cta"].primary': { label: E(b1.label), href: b1.href },
  'sections[_key=="cta"].secondary': { label: DATASHEET.label, href: DATASHEET.href },

  // Neither live question has a written answer on the sheet — OPEN-ITEMS.
  faqs: [],
  schemaTypes: ["Product", "BreadcrumbList", "HowTo"],
  schemaProduct: {
    name: "Sponge and Foam Rubber",
    description:
      "Closed-cell and open-cell cellular elastomers for thermal insulation, acoustic damping and sealing, 12 to 200 kg/m3, in EPDM, neoprene, nitrile, natural rubber and silicone. Sheet, roll, cut piece and self-adhesive foam tape.",
    material: ["EPDM", "Neoprene", "NBR", "Natural Rubber", "Silicone"],
  },
  "related.products": ["extrusion", "gaskets"],
  confirmWithMargo: [],
};

await applyDocument({ id: ID, type: "productCategory", schema: categorySchema, patch, expect });
