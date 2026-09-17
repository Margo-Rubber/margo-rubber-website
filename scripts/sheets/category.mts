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
  faqs?: unknown[];
  sections?: RawBlock[];
};

export function projectBlocks(d: RawCategory): unknown[] {
  const slug = typeof d.slug === "string" ? d.slug : (d.slug?.current ?? "");
  return (d.sections ?? []).map((b) => {
    if (b._type === "block.specTable")
      return { ...b, rows: (b.rows ?? []).map((r) => (r as { cells: string[] }).cells) };
    if (b._type === "block.partsGrid")
      return { ...b, parts: d.anchors ?? [], categoryLabel: d.navLabel, categorySlug: slug };
    if (b._type === "block.industryFaq") return { ...b, items: d.faqs ?? [] };
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

/** "Label → /href", "Label ↗ /href", "Label ↓ #id" or "Label › #id" on one line. */
export function arrowLink(line: string): { label: string; href: string } {
  const m = line.match(/^(.*?)\s*(?:→|↗|↓|›|->)\s*(\S+)$/);
  if (!m) throw new Error(`not a "Label → href" line: ${line}`);
  return { label: m[1].trim(), href: m[2] };
}

/* ── The standard category page (sheets 09–17) ─────────────────────────── */

import { applyDocument, client, field, heading, lit, litHref, loadSheet, paragraph, paragraphs, rows, section, starAccent } from "./lib.mts";
import { productBySlug } from "../../src/content/routes.ts";
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
  /**
   * A panel whose sheet contradicts itself: the table says one thing and the
   * sheet's own note asks for another. Panel name → [the table's sentence,
   * the note's]. The note is the later thought and the one that ships.
   */
  panelFix?: Record<string, [from: string, to: string]>;
  schemaProduct: { name: string; description: string; material?: string[]; components?: string[]; componentsName?: string; componentsAnchor?: string };
  related: string[];
};

const has = (sec: Section, label: string) =>
  sec.fields.some((f) => f.label.toLowerCase().startsWith(label.toLowerCase()));

/* ── Parts with a page of their own ─────────────────────────────────────
   The category sheets (10–16) list the parts as plain names — written
   before the SKU sheets (32–34) renamed several, moved six to other
   categories and folded two. Ayaz's rule (2026-09-17) settles the
   contradiction in favour of the later sheets: a card that is a part links
   to the part's page under the part's current name; a part that moved shows
   in the category it now lives in; a folded duplicate's card comes off. The
   foam gaskets card stays on the gaskets page as a cross-reference — sheet
   09: "keep it linked from the Gaskets category". */

/** The sheets' card name → the part (`category--slug`) it is; `null` = the card comes off. */
export const PART_CARDS: Record<string, string | null> = {
  "Back Light Rubber Mount (Bolero)": null, // moved to extrusion (SKU 02)
  "Bumper Stopper for Tata": "anti-vibration-mounts--cv-suspension-bump-stop",
  "Bumper Stopper": "anti-vibration-mounts--bumper-stopper",
  "Weight Rubber": "anti-vibration-mounts--ac-vibration-weight",
  "AEM Insulation Bush": "bushes--aem-insulation-bush",
  "EPDM Gaskets": "gaskets--epdm",
  "Foam Gaskets": "sponge-foam-rubber--foam-gaskets",
  "C-Pillar Garnish EPDM Hard Foam": null, // moved to sponge & foam (SKU 07)
  "3 Pin Hole Pad (Electrical Pass-Through)": "grommets--3-pin-hole-pad",
  "Rubber Grommet Internal Fits": "grommets--internal-fit",
  "Seal Filler Cap O-Rings": "o-rings--seal-filler-cap-o-rings",
  "EPDM Pad": "pads-stoppers-caps--epdm-pad",
  "Support Pad for Bolero": "pads-stoppers-caps--bolero-support-pad",
  "Big Support Pad": "pads-stoppers-caps--big-support-pad",
  "L Pad": "pads-stoppers-caps--l-pad",
  "C Pad": "pads-stoppers-caps--c-pad",
  "Oil Filler Cap": "pads-stoppers-caps--oil-filler-cap",
  "Oil Seal Filler Cap": null, // folded into the oil filler cap (SKU 29)
  "Glove Box Stopper": "pads-stoppers-caps--glove-box-stopper",
  "Rubber Plungers": null, // moved to reciprocating seals (SKU 31)
  "Rubber Insulator Head Cover": "pads-stoppers-caps--insulator-head-cover",
  "Boot Tailgate Switch": "pads-stoppers-caps--boot-tailgate-switch",
  "Rubber Flap for A/C Air Extractor": "pads-stoppers-caps--ac-flaps",
  "Rubber Radiator Shroud Flaps": "pads-stoppers-caps--radiator-shroud-flaps",
  "Scorpio Footrest Rubber Mat": "pads-stoppers-caps--side-step-pad",
};

export type PartCard = { name: string; availability?: string; href?: string };

/**
 * The sheet's cards with every part linked and named as it is today, and
 * the category's other parts (the ones its sheet did not list, or that
 * moved in) appended. Idempotent: a card already linked is left alone.
 */
export async function linkParts(categorySlug: string, items: PartCard[]): Promise<PartCard[]> {
  const parts = (await client.fetch(`*[_type == "sku"]{"slug": slug.current, category, navLabel}`)) as {
    slug: string;
    category: string;
    navLabel: string;
  }[];
  const pathOf = (slug: string) => `/products/${slug.replace("--", "/")}`;
  const out: PartCard[] = [];
  for (const it of items) {
    if (it.href) {
      out.push(it);
      continue;
    }
    if (!(it.name in PART_CARDS)) {
      out.push(it);
      continue;
    }
    const target = PART_CARDS[it.name];
    if (!target) continue;
    const part = parts.find((p) => p.slug === target);
    if (!part) throw new Error(`${categorySlug}: card "${it.name}" names a part that does not exist (${target})`);
    out.push({ ...it, name: part.navLabel, href: pathOf(part.slug) });
  }
  // A family card that now duplicates a part's current name (the o-rings grid
  // lists "Oil Filler Cap O-Rings" as a family too) gives way to the part.
  const deduped = out.filter((it, i) => it.href || !out.some((o, j) => j !== i && o.href && o.name === it.name));
  // Parts of this category the sheet did not list — appended, after the
  // sheet's own cards, with the availability the sheet uses on its cards.
  const availability = deduped.find((it) => it.availability)?.availability;
  for (const p of parts.filter((p) => p.category === categorySlug)) {
    if (deduped.some((it) => it.href === pathOf(p.slug))) continue;
    deduped.push({ name: p.navLabel, ...(availability ? { availability } : {}), href: pathOf(p.slug) });
  }
  return deduped;
}

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
    const label = productBySlug(o.id.replace(/^productCategory-/, ""))?.label;
    patch.heroLink = { label: E(cta.label), href: cta.href === "/contact" && label ? `/contact?product=${encodeURIComponent(label)}` : cta.href };
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
    // A table of Chip | Replaces (sheets 11–17) or one "A · B · C" literal (sheet 09).
    const f = spec.fields.find((x) => x.label.startsWith("Filter chips"))!;
    const labels = f.kind === "table" ? f.rows.map((r) => r[0]) : f.kind === "lit" ? f.value.split(" · ") : [];
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
    const fix = o.panelFix?.[r[0]];
    if (fix && !r[3].includes(fix[0])) throw new Error(`${o.stem}: panel "${r[0]}" no longer says "${fix[0]}"`);
    const summary = fix ? r[3].replace(fix[0], fix[1]) : r[3];
    return { code, name: E(r[0]), tempRange: E(r[1]), hardness: E(r[2]), summary: E(summary), ...(image ? { image } : {}) };
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
    const slug = o.id.replace(/^productCategory-/, "");
    patch[`${pp}.items`] = await linkParts(
      slug,
      cards.rows.map((r) =>
        numbered
          ? { name: r[1], availability: E(r[2]) }
          : { name: r[0], availability: E(`${r[1]} · ${r[2]}`) },
      ),
    );
    // The sheet's card names are expected on the page except where the
    // later SKU sheet renamed or moved the part.
    for (const r of cards.rows) {
      const name = numbered ? r[1] : r[0];
      if (!(name in PART_CARDS)) E(name);
    }
    for (const it of patch[`${pp}.items`] as PartCard[]) if (it.href) E(it.name);
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

  /* Enquiries */
  const enq = s(num.enquiries);
  const ep = 'sections[_key=="cta"]';
  if (has(enq, "Eyebrow")) patch[`${ep}.eyebrow`] = E(lit(enq, "Eyebrow"));
  patch[`${ep}.heading`] = E(heading(enq, "H2").value);
  patch[`${ep}.body`] = E(paragraph(enq, "Body"));
  const [primary, secondary] = has(enq, "Button 1")
    ? [litHref(enq, "Button 1"), litHref(enq, "Button 2")]
    : lit(enq, "CTAs").split("\n").map(arrowLink);
  // "Prefill the product field. A buyer arriving at /contact from here has
  // already told you the category. Pass it." (sheets 09 §07, 10 §06): a
  // plain /contact link from this page carries the category.
  const label = productBySlug(o.id.replace(/^productCategory-/, ""))?.label;
  const prefilled = (href: string) => (href === "/contact" && label ? `/contact?product=${encodeURIComponent(label)}` : href);
  patch[`${ep}.primary`] = { label: E(primary.label), href: prefilled(primary.href) };
  patch[`${ep}.secondary`] = { label: E(secondary.label), href: prefilled(secondary.href) };

  // Only a question the page itself shows (O-Rings §05's heading) can be
  // in the FAQPage node; the questions the notes name for the other pages
  // are not on any page — OPEN-ITEMS.
  patch.faqs = faqs;

  await applyDocument({ id: o.id, type: "productCategory", schema: categorySchema, patch, expect });
}
