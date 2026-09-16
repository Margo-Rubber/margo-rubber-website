/**
 * Shared pieces for the eleven category apply scripts (sheets 09–19).
 *
 * A productCategory document keeps its sections as typed blocks in one
 * `sections[]` array; the route validates the frontmatter with
 * productCategorySchema and each block with its own schema after the GROQ
 * projection has reshaped spec-table rows (`rows[].cells` → `rows[]`) and
 * joined the parts grid to the document's anchors. `categorySchema` does the
 * same to the raw document so applyDocument checks it as the page will.
 */

import { z } from "zod";
import { productCategorySchema } from "../../src/content/schemas/index.ts";
import { parseBlock, stripNullsDeep } from "../../src/content/blocks.ts";

type RawBlock = Record<string, unknown> & { _type?: string; rows?: unknown[] };
type RawCategory = {
  slug?: { current?: string } | string;
  navLabel?: string;
  anchors?: unknown[];
  sections?: RawBlock[];
};

function projectBlocks(d: RawCategory): unknown[] {
  const slug = typeof d.slug === "string" ? d.slug : (d.slug?.current ?? "");
  return (d.sections ?? []).map((b) => {
    if (b._type === "block.specTable")
      return { ...b, rows: (b.rows ?? []).map((r) => (r as { cells: string[] }).cells) };
    if (b._type === "block.partsGrid")
      return { ...b, parts: d.anchors ?? [], categoryLabel: d.navLabel, categorySlug: slug };
    return b;
  });
}

export const categorySchema = z.preprocess(
  (raw) => {
    const d = raw as RawCategory;
    return { ...d, sections: projectBlocks(stripNullsDeep(d)) };
  },
  productCategorySchema.passthrough().superRefine((doc, ctx) => {
    const sections = (doc as { sections?: unknown[] }).sections ?? [];
    sections.forEach((b, i) => {
      const r = parseBlock(b, i);
      if (!r.ok) ctx.addIssue({ code: "custom", path: ["sections", i], message: r.error });
    });
  }),
);

/** `sections[_key=="specSection"].rows` in the Sanity shape. */
export const cellRows = (rows: string[][]) => rows.map((cells) => ({ cells }));

/** "Label → /href" or "Label ↗ /href" on one line. */
export function arrowLink(line: string): { label: string; href: string } {
  const m = line.match(/^(.*?)\s*(?:→|↗|->)\s*(\S+)$/);
  if (!m) throw new Error(`not a "Label → href" line: ${line}`);
  return { label: m[1].trim(), href: m[2] };
}

/* ── The standard category page (sheets 09–17) ─────────────────────────── */

import { applyDocument, client, field, heading, lit, litHref, loadSheet, paragraph, paragraphs, rows, section, starAccent } from "./lib.mts";
import type { Section } from "./lib.mts";

/** Compound panel name → Site settings code. Shared across the sheets. */
export const COMPOUND_CODE: Record<string, string> = {
  "AEM (Vamac®)": "AEM",
  "FKM (Viton®)": "FKM",
  "NBR (Nitrile)": "NBR",
  EPDM: "EPDM",
  "Silicone (VMQ)": "VMQ",
  "Neoprene (CR)": "CR",
  SBR: "SBR",
  "Natural Rubber (NR)": "NR",
  "Natural rubber (NR)": "NR",
};

export type StandardCategory = {
  stem: string;
  id: string;
  /** Hero image alt text, where the sheet's notes give one. */
  heroAlt?: string;
  /** Section numbers, where a sheet departs from 01 hero / 02 spec / 03 material / 04 parts / 05 commercial / 06 enquiries. */
  sections?: Partial<Record<"hero" | "spec" | "material" | "parts" | "standards" | "commercial" | "enquiries", string>>;
  /** Extra panel names not in COMPOUND_CODE (a panel with its own figures). */
  codes?: Record<string, string>;
  /** Chip label → rule, for chips that filter by something other than a standard's name. */
  chipRules?: Record<string, string>;
  /** Spec table: filter and search on. Default true unless the sheet removes them. */
  controls?: boolean;
  /** Footnote line for a table whose sheet gives it only in the notes. */
  specFootnote?: string;
  /** Trade-mark attribution under the material panels, where the notes give it. */
  materialFootnote?: string;
  /** FAQPage entries: the quoting question the notes name, answered by the commercial intro. */
  faq?: { q: string; from: "commercial" }[];
  schemaProduct: { name: string; description: string; material?: string[] };
  related: string[];
};

const has = (sec: Section, label: string) =>
  sec.fields.some((f) => f.label.toLowerCase().startsWith(label.toLowerCase()));

export async function applyStandardCategory(o: StandardCategory): Promise<void> {
  const sheet = loadSheet(o.stem);
  const num = { hero: "01", spec: "02", material: "03", parts: "04", commercial: "05", enquiries: "06", ...o.sections };
  const s = (n: string) => section(sheet, n);
  const expect: string[] = [];
  const E = (v: string) => (expect.push(v.replace(/\*\*/g, "")), v);
  const patch: Record<string, unknown> = {
    "seo.title": sheet.head.title,
    "seo.description": sheet.head.description,
    heroBreadcrumb: true,
    schemaProduct: o.schemaProduct,
    "related.products": o.related,
    confirmWithMargo: [],
  };
  const faqs: { q: string; a: string }[] = [];

  /* Hero */
  const hero = s(num.hero);
  const h1 = heading(hero, "H1");
  patch.h1 = h1.lines.map((l) => E(l)).join(" ");
  patch.h1Accent = h1.accent[0];
  patch.intro = E(paragraph(hero, "Subhead"));
  patch.heroStats = rows(hero, "Stats").map((r) => ({ value: E(r[0]), label: E(r[1]) }));
  if (has(hero, "Hero CTA") || has(hero, "CTA")) {
    const cta = arrowLink(lit(hero, has(hero, "Hero CTA") ? "Hero CTA" : "CTA"));
    patch.heroLink = { label: E(cta.label), href: cta.href };
  }
  if (o.heroAlt) patch["hero.alt"] = o.heroAlt;

  /* Specification table */
  const spec = s(num.spec);
  const table = field(spec, has(spec, "Full table") ? "Full table" : "Table", "table");
  for (const r of table.rows) for (const c of r) E(c);
  const specH2 = heading(spec, "H2");
  const sp = 'sections[_key=="specSection"]';
  if (has(spec, "Eyebrow")) patch[`${sp}.eyebrow`] = E(lit(spec, "Eyebrow"));
  for (const l of specH2.lines) E(l);
  patch[`${sp}.heading`] = specH2.accent.length ? starAccent(specH2).join(" ") : specH2.value;
  patch[`${sp}.body`] = E(paragraph(spec, "Intro"));
  patch[`${sp}.columns`] = table.columns.map((c) => E(c));
  patch[`${sp}.rows`] = cellRows(table.rows);
  patch[`${sp}.controls`] = o.controls ?? true;
  if (has(spec, "Filter chips")) {
    const f = field(spec, "Filter chips", spec.fields.find((x) => x.label.startsWith("Filter chips"))!.kind as "table");
    const labels = f.kind === "table" ? f.rows.map((r) => r[0]) : (f as { value: string }).value.split(" · ");
    patch[`${sp}.chips`] = labels.map((l) => {
      E(l);
      const rule = o.chipRules?.[l];
      return rule ? `${l} :: ${rule}` : l;
    });
  }
  if (has(spec, "Search field")) patch[`${sp}.searchPlaceholder`] = E(lit(spec, "Search field"));
  if (has(spec, "Footnote")) {
    const f = spec.fields.find((x) => x.label === "Footnote")!;
    const text = f.kind === "paragraphs" ? f.marked[0] : f.kind === "lit" ? f.value : "";
    for (const l of text.split("\n")) E(l);
    patch[`${sp}.footnote`] = text;
  } else if (o.specFootnote) patch[`${sp}.footnote`] = E(o.specFootnote);

  /* Material panels */
  const mat = s(num.material);
  const mp = 'sections[_key=="materialSection"]';
  const CODE = { ...COMPOUND_CODE, ...o.codes };
  const existing = (await client.fetch(
    `*[_id == $id][0].sections[_key == "materialSection"][0].items[]{code, image}`,
    { id: o.id },
  )) as { code: string; image?: string }[];
  if (has(mat, "Eyebrow")) patch[`${mp}.eyebrow`] = E(lit(mat, "Eyebrow"));
  patch[`${mp}.heading`] = E(heading(mat, "H2").value);
  // A sheet that writes no intro means the live one comes off.
  patch[`${mp}.body`] = has(mat, "Intro") ? E(paragraph(mat, "Intro")) : undefined;
  patch[`${mp}.items`] = rows(mat, "Panels").map((r) => {
    const code = CODE[r[0]];
    if (!code) throw new Error(`${o.stem}: no compound code for panel "${r[0]}"`);
    const image = existing.find((it) => it.code === code)?.image;
    return { code, name: E(r[0]), tempRange: E(r[1]), hardness: E(r[2]), summary: E(r[3]), ...(image ? { image } : {}) };
  });
  if (o.materialFootnote) patch[`${mp}.footnote`] = E(o.materialFootnote);

  /* Parts in this category — not every page has one */
  if (num.parts) {
    const parts = s(num.parts);
    const pp = 'sections[_key=="partsGrid"]';
    patch[`${pp}.eyebrow`] = E(lit(parts, "Eyebrow"));
    patch[`${pp}.heading`] = E(heading(parts, "H2").value);
    patch[`${pp}.body`] = E(paragraph(parts, "Intro"));
    const cards = field(parts, "Cards", "table");
    // "Part name | Category | Availability" or "# | Part name | Second line".
    const numbered = /^#/.test(cards.columns[0]);
    patch[`${pp}.items`] = cards.rows.map((r) =>
      numbered
        ? { name: E(r[1]), availability: E(r[2]) }
        : { name: E(r[0]), availability: E(`${r[1]} · ${r[2]}`) },
    );
  }

  /* Sizing standards (O-Rings only) */
  if (num.standards) {
    const std = s(num.standards);
    const stp = 'sections[_key=="standardsSection"]';
    patch[`${stp}.heading`] = E(heading(std, "H2").value);
    patch[`${stp}.answer`] = E(paragraph(std, "Answer paragraph"));
    patch[`${stp}.items`] = rows(std, "Cards").map((r) => ({ code: E(r[0]), name: E(r[1]), body: E(r[2]) }));
    patch[`${stp}.closing`] = E(paragraphs(std, "Add: closing line")[0]);
    faqs.push({ q: heading(std, "H2").value, a: paragraph(std, "Answer paragraph") });
  }

  /* Commercial terms */
  const com = s(num.commercial);
  const cp = 'sections[_key=="commercialSection"]';
  if (has(com, "Eyebrow")) patch[`${cp}.eyebrow`] = E(lit(com, "Eyebrow"));
  patch[`${cp}.heading`] = E(heading(com, "H2").value);
  patch[`${cp}.body`] = E(paragraph(com, "Intro"));
  patch[`${cp}.rows`] = rows(com, "Rows").map((r) => ({ label: E(r[0]), value: E(r[1]), note: E(r[2]) }));
  for (const f of o.faq ?? []) faqs.push({ q: f.q, a: paragraph(com, "Intro") });

  /* Enquiries */
  const enq = s(num.enquiries);
  const ep = 'sections[_key=="cta"]';
  if (has(enq, "Eyebrow")) patch[`${ep}.eyebrow`] = E(lit(enq, "Eyebrow"));
  patch[`${ep}.heading`] = E(heading(enq, "H2").value);
  patch[`${ep}.body`] = E(paragraph(enq, "Body"));
  const [primary, secondary] = has(enq, "Button 1")
    ? [litHref(enq, "Button 1"), litHref(enq, "Button 2")]
    : lit(enq, "CTAs").split("\n").map(arrowLink);
  patch[`${ep}.primary`] = { label: E(primary.label), href: primary.href };
  patch[`${ep}.secondary`] = { label: E(secondary.label), href: secondary.href };

  patch.faqs = faqs;

  await applyDocument({ id: o.id, type: "productCategory", schema: categorySchema, patch, expect });
}
