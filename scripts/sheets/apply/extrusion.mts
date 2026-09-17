/**
 * 18_Product_Extrusion_Profiles → productCategory-extrusion.
 *
 *   node scripts/sheets/apply/extrusion.mts [--write]
 *
 * The extrusion template: profile library, compound table, process,
 * specification guide, quality panel, sectors, commercial terms, enquiry
 * panel. Icons, shapes and card anchors stay with the existing items.
 */

import { applyDocument, client, field, heading, lit, litHref, loadSheet, paragraph, rows, section } from "../lib.mts";
import { arrowLink, categorySchema, cellRows } from "../category.mts";

const ID = "productCategory-extrusion";
const sheet = loadSheet("18_Product_Extrusion_Profiles");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v.replace(/\*\*/g, "")), v);

/** Keep a heading's existing accent marking when only the words are unchanged. */
const current = (await client.fetch(`*[_id == $id][0]`, { id: ID })) as {
  sections: { _key: string; heading: string; items?: { name: string; [k: string]: unknown }[]; steps?: { icon?: string }[]; badges?: { icon?: string }[]; chips?: { icon?: string }[]; quote?: { initials: string } }[];
};
const block = (key: string) => {
  const b = current.sections.find((x) => x._key === key);
  if (!b) throw new Error(`${ID}: no block ${key}`);
  return b;
};
const keepAccent = (key: string, text: string) => {
  const old = block(key).heading ?? "";
  E(text);
  return old.replace(/\*/g, "") === text ? old : text;
};

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");
const cta1 = litHref(hero, "CTA 1");
const cta2 = arrowLink(lit(hero, "CTA 2"));
const stats = rows(hero, "Stats").map((r) => ({ value: E(r[0]), label: E(r[1]) }));

/* ── 02 Profile library ──────────────────────────────────────────────────── */
const lib = s("02");
const oldProfiles = block("profileSection").items ?? [];
const profiles = rows(lib, "Cards").map((r) => {
  const old = oldProfiles.find((it) => it.name === r[0]);
  if (!old) throw new Error(`no existing profile card "${r[0]}" to keep its drawing`);
  return {
    ...(old.id ? { id: old.id } : {}),
    ...(old.shape ? { shape: old.shape } : {}),
    ...(r[1] !== "—" ? { code: E(r[1]) } : {}),
    name: E(r[0]),
    body: E(r[2]),
  };
});
const cardCta = litHref(lib, "Card CTA");
if (!/^\/contact\?profile=/.test(cardCta.href)) throw new Error("profile card CTA href");

/* ── 03 Compound specification ───────────────────────────────────────────── */
const spec = s("03");
const table = field(spec, "Table", "table");
for (const r of table.rows) for (const c of r) E(c);

/* ── 04 Manufacturing process ────────────────────────────────────────────── */
const proc = s("04");
const oldSteps = block("processSection").steps ?? [];
const steps = rows(proc, "Stages").map((r, i) => ({
  ...(oldSteps[i]?.icon ? { icon: oldSteps[i].icon } : {}),
  name: E(r[1]),
  body: E(r[2]),
}));

/* ── 05 Specification guide ──────────────────────────────────────────────── */
const guide = s("05");
const oldParams = (block("specifySection").items ?? []) as { icon?: string }[];
const params = rows(guide, "Parameters").map((r, i) => ({
  ...(oldParams[i]?.icon ? { icon: oldParams[i].icon } : {}),
  label: E(r[1]),
  value: E(r[2]),
  body: E(r[3]),
}));
const closing = lit(guide, "Closing line").match(/^(.*?)\s*\[\s*(.*?)\s*→\s*\]\s*(\S+)$/);
if (!closing) throw new Error("specify closing line");

/* ── 06 Quality assurance ────────────────────────────────────────────────── */
const qa = s("06");
const quoteText = lit(qa, "Pull-quote").replace(/^"|"$/g, "").replace(/\n/g, " ");
const [author, org] = lit(qa, "Attribution").split("\n");
const oldBadges = block("qualitySection").badges ?? [];
const badges = rows(qa, "Badges").map((r, i) => ({ ...(oldBadges[i]?.icon ? { icon: oldBadges[i].icon } : {}), label: E(r[0]) }));
// Group | Test | Standard — the group is written once, on the first row of its group.
let group = "";
const standards = rows(qa, "Test list").map((r) => {
  if (r.length === 3) group = E(r[0]);
  const [name, code] = r.slice(-2);
  return { group, name: E(name), code: E(code) };
});
const [docTitle, ...docLines] = lit(qa, "Documentation package").split("\n");

/* ── 07 Sectors served ───────────────────────────────────────────────────── */
const sec = s("07");
// Icons: the six live cards keep theirs; the three new sectors take the
// nearest stroke in the set.
const SECTOR_ICON: Record<string, string> = {
  Automotive: "vehicle",
  Construction: "building",
  HVAC: "airflow",
  "Industrial machinery": "wrench",
  "Electrical & electronics": "chip",
  "Water & fluid management": "droplet",
  Mining: "layers",
  "Oil & gas": "droplet",
  Agriculture: "cycle",
};
const sectors = rows(sec, "Cards").map((r) => {
  const icon = SECTOR_ICON[r[0]];
  if (!icon) throw new Error(`no icon for sector "${r[0]}"`);
  return { icon, name: E(r[0]), body: E(r[1]), href: r[2] };
});
const sectorLink = field(sec, "Card link", "lit");

/* ── 08 Commercial terms ─────────────────────────────────────────────────── */
const com = s("08");
// Row | Sub-label | Value
const terms = rows(com, "Rows").map((r) => ({ label: E(r[0]), note: E(r[1]), value: E(r[2]) }));

/* ── 09 Enquiries ────────────────────────────────────────────────────────── */
const enq = s("09");
const oldChips = block("cta").chips ?? [];
const chips = rows(enq, "Badges").map((r, i) => ({ ...(oldChips[i]?.icon ? { icon: oldChips[i].icon } : {}), label: E(r[0]) }));
const b1 = litHref(enq, "Button 1");
const b2 = litHref(enq, "Button 2");

const patch = {
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  h1: h1.lines.map((l) => E(l)).join(" "),
  h1Accent: h1.accent[0],
  intro: E(paragraph(hero, "Subhead")),
  heroActions: [
    { label: E(cta1.label), href: cta1.href, variant: "primary" },
    { label: E(cta2.label), href: cta2.href, variant: "secondary" },
  ],
  heroStats: stats,
  heroBreadcrumb: true,

  'sections[_key=="profileSection"].eyebrow': E(lit(lib, "Eyebrow")),
  'sections[_key=="profileSection"].heading': keepAccent("profileSection", heading(lib, "H2").value),
  'sections[_key=="profileSection"].body': E(paragraph(lib, "Intro")),
  'sections[_key=="profileSection"].items': profiles,
  'sections[_key=="profileSection"].cardCta': E(cardCta.label),

  'sections[_key=="specSection"].eyebrow': E(lit(spec, "Eyebrow")),
  'sections[_key=="specSection"].heading': keepAccent("specSection", heading(spec, "H2").value),
  'sections[_key=="specSection"].body': E(paragraph(spec, "Intro")),
  'sections[_key=="specSection"].columns': table.columns.map((c) => E(c)),
  'sections[_key=="specSection"].rows': cellRows(table.rows),
  'sections[_key=="specSection"].controls': false,
  'sections[_key=="specSection"].footnote': E(field(spec, "Footnote", "paragraphs").marked[0]),

  'sections[_key=="processSection"].eyebrow': E(lit(proc, "Eyebrow")),
  'sections[_key=="processSection"].heading': keepAccent("processSection", heading(proc, "H2").value),
  'sections[_key=="processSection"].body': E(paragraph(proc, "Intro")),
  'sections[_key=="processSection"].steps': steps,

  'sections[_key=="specifySection"].eyebrow': E(lit(guide, "Eyebrow")),
  'sections[_key=="specifySection"].heading': keepAccent("specifySection", heading(guide, "H2").value),
  'sections[_key=="specifySection"].body': E(paragraph(guide, "Intro")),
  'sections[_key=="specifySection"].items': params,
  'sections[_key=="specifySection"].closing': E(closing[1]),
  'sections[_key=="specifySection"].closingLink': { label: E(closing[2]), href: closing[3] },

  'sections[_key=="qualitySection"].eyebrow': E(lit(qa, "Eyebrow")),
  'sections[_key=="qualitySection"].heading': keepAccent("qualitySection", heading(qa, "H2").value),
  'sections[_key=="qualitySection"].body': E(paragraph(qa, "Intro")),
  'sections[_key=="qualitySection"].quote': {
    text: E(quoteText),
    author: E(author),
    org: E(org),
    initials: block("qualitySection").quote?.initials ?? "MR",
  },
  'sections[_key=="qualitySection"].badges': badges,
  'sections[_key=="qualitySection"].standards': standards,
  'sections[_key=="qualitySection"].docPackage': { title: E(docTitle), body: docLines.map((l) => E(l)).join("\n") },

  'sections[_key=="sectorsSection"].eyebrow': E(lit(sec, "Eyebrow")),
  'sections[_key=="sectorsSection"].heading': keepAccent("sectorsSection", heading(sec, "H2").value),
  'sections[_key=="sectorsSection"].body': E(paragraph(sec, "Intro")),
  'sections[_key=="sectorsSection"].items': sectors,
  'sections[_key=="sectorsSection"].cardCta': sectorLink.value,

  // "The section ID changes from #commercial to #pricing" (§08) — this page prices per metre.
  'sections[_key=="commercialSection"].id': "pricing",
  'sections[_key=="commercialSection"].eyebrow': E(lit(com, "Eyebrow")),
  'sections[_key=="commercialSection"].heading': keepAccent("commercialSection", heading(com, "H2").value),
  'sections[_key=="commercialSection"].body': E(paragraph(com, "Intro")),
  'sections[_key=="commercialSection"].rows': terms,

  'sections[_key=="cta"].eyebrow': E(lit(enq, "Eyebrow")),
  'sections[_key=="cta"].heading': keepAccent("cta", heading(enq, "H2").value),
  'sections[_key=="cta"].body': E(paragraph(enq, "Body")),
  'sections[_key=="cta"].chips': chips,
  'sections[_key=="cta"].primary': { label: E(b1.label), href: b1.href },
  'sections[_key=="cta"].secondary': { label: E(b2.label), href: b2.href },

  // No FAQ section on the sheet, so no FAQPage node: a question that is not
  // on the page cannot be in the graph — OPEN-ITEMS.
  faqs: [],
  schemaProduct: {
    name: "Rubber Extrusion Profiles",
    description:
      "Continuous-length rubber seals, channels and structural profiles extruded to drawing in eight standard sections and cut to print, in EPDM, NBR, FKM, silicone and neoprene. Priced per metre.",
    material: ["EPDM", "NBR", "FKM", "Silicone", "Neoprene"],
    components: profiles.filter((p) => p.code).map((p) => `${p.name} (${p.code})`),
    componentsName: "Standard extrusion profile library",
    componentsAnchor: "profiles",
  },
  "related.products": ["sponge-foam-rubber", "gaskets"],
  // "This is the only block on the site that earns a HowTo node" (§05) —
  // the four-line specification guide, as on the sponge page.
  schemaTypes: ["Product", "BreadcrumbList", "HowTo"],
  confirmWithMargo: [],
};
// Every sector card's link is checked against the sheet's pattern.
for (const c of sectors) if (!/^\/industries\/[a-z-]+$/.test(c.href)) throw new Error(`sector href ${c.href}`);
E(sectorLink.value.replace("{sector}", sectors[0].name));

await applyDocument({ id: ID, type: "productCategory", schema: categorySchema, patch, expect });
