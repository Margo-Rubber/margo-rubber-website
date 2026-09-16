/**
 * 35_Resource_Articles/RES_01 … RES_07 → the seven resource documents.
 *
 *   node scripts/sheets/apply/articles.mts [RES_02] [--write]
 *
 * Each sheet is the article, written: a standfirst, the answer up front,
 * the sections in order (heading, paragraphs, tables, the "five mistakes"
 * list), the FAQ, the closing offer and the related links. The body goes
 * into Sanity as Portable Text — the same blocks the Studio's own editor
 * makes — so what the sheet wrote and what an editor later changes are one
 * thing. Bold runs in the prose are kept as `strong` marks.
 */

import { z } from "zod";
import { resourceSchema } from "../../../src/content/schemas/index.ts";
import { stripNullsDeep } from "../../../src/content/blocks.ts";
import { INDUSTRIES, PRODUCTS } from "../../../src/content/routes.ts";
import { applyDocument, loadSheet } from "../lib.mts";
import type { Field } from "../lib.mts";
import type { Part } from "../parse-sheets.mts";

const resourceDocSchema = z.preprocess((raw) => stripNullsDeep(raw), resourceSchema.passthrough());

const ARTICLES: Record<string, string> = {
  "RES_01_silicone-vs-epdm-high-temperature-seals": "silicone-vs-epdm-high-temperature-seals",
  "RES_02_fkm-vs-nbr-oil-seal-guide": "fkm-vs-nbr-oil-seal-guide",
  "RES_03_gasket-material-selection-guide": "gasket-material-selection-guide",
  "RES_04_o-ring-size-chart": "o-ring-size-chart",
  "RES_05_rubber-to-metal-bonded-parts-guide": "rubber-to-metal-bonded-parts-guide",
  "RES_06_how-to-evaluate-a-rubber-manufacturer": "how-to-evaluate-a-rubber-manufacturer",
  "RES_07_india-vs-china-rubber-sourcing": "india-vs-china-rubber-sourcing",
};

/* ── Portable Text ──────────────────────────────────────────────────────── */

let keyN = 0;
const key = (p: string) => `${p}${(keyN++).toString(36)}`;

/** One paragraph → one block; `**…**` runs become strong spans; the glyph the sheet uses for emphasis of its own is not copy. */
function block(text: string, style: "normal" | "h2" | "h3" | "h4" = "normal", list?: "number" | "bullet") {
  const clean = text.replace(/🛑\s*/g, "");
  const parts = clean.split(/\*\*([^*]+)\*\*/g);
  const children = parts
    .map((part, i) => ({ _type: "span", _key: key("s"), text: part, marks: i % 2 ? ["strong"] : [] }))
    .filter((c) => c.text);
  return {
    _type: "block",
    _key: key("b"),
    style,
    markDefs: [],
    children,
    ...(list ? { listItem: list, level: 1 } : {}),
  };
}

function table(caption: string | undefined, columns: string[], rows: string[][]) {
  return {
    _type: "guideTable",
    _key: key("t"),
    ...(caption ? { caption } : {}),
    columns,
    rows: rows.map((r) => r.map((c) => c.replace(/\|/g, "／")).join(" | ")),
  };
}

const callout = (body: string) => ({ _type: "callout", _key: key("c"), body: body.replace(/🛑\s*/g, "") });

/* ── Sheet → body ───────────────────────────────────────────────────────── */

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const stems = Object.keys(ARTICLES).filter((s) => !args.length || args.some((a) => s.startsWith(a)));

const bySlug = (label: string) => {
  const name = label.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();
  const p = PRODUCTS.find((x) => x.label.toLowerCase().replace(/&/g, "and") === name);
  if (p) return { products: p.slug };
  const i = INDUSTRIES.find((x) => x.label.toLowerCase().replace(/&/g, "and") === name);
  if (i) return { industries: i.slug };
  return null;
};

for (const stem of stems) {
  const sheet = loadSheet(stem);
  const slug = ARTICLES[stem];
  const expect: string[] = [];
  const E = (v: string) => (expect.push(v.replace(/\*\*/g, "").replace(/🛑\s*/g, "")), v);
  keyN = 0;

  const body: unknown[] = [];
  const faqs: { q: string; a: string }[] = [];
  let h1 = "";
  let standfirst = "";
  let closing: { body: string; cta: { label: string; href: string } } | undefined;
  const related = { products: [] as string[], industries: [] as string[], resources: [] as string[] };

  const para = (f: Extract<Field, { kind: "paragraphs" }>) => f.marked.forEach((p) => body.push(block(E(p))));
  const parts = (ps: Part[]) => {
    for (const p of ps) {
      if (p.kind === "heading") body.push(block(E(p.lines.join(" ")), "h3"));
      else if (p.kind === "para") body.push(block(E(p.text)));
      else if (p.kind === "table") {
        for (const r of p.rows) for (const c of r) E(c);
        body.push(table(undefined, p.columns.map((c) => E(c)), p.rows));
      } else if (p.kind === "lit") E(p.value);
    }
  };

  for (const sec of sheet.sections) {
    if (/^Footer/.test(sec.title)) continue;
    const isFaq = /^FAQ/.test(sec.title);
    const isClosing = /^Closing CTA/.test(sec.title);
    for (const f of sec.fields) {
      // Page-level fields.
      if (f.label === "H1" && f.kind === "lit") { h1 = E(f.value); continue; }
      if (f.label === "Standfirst" && f.kind === "paragraphs") { standfirst = E(f.paragraphs[0]); continue; }
      if (/^Holding note|^Breadcrumb/.test(f.label)) continue;
      if (/^Related strip/.test(f.label) && f.kind === "table") {
        for (const r of f.rows) {
          const hit = bySlug(r[r.length - 1]);
          if (hit?.products) related.products.push(hit.products);
          else if (hit?.industries) related.industries.push(hit.industries);
          else console.warn(`  ${stem}: related strip "${r[r.length - 1]}" is not a category or industry`);
        }
        continue;
      }
      if (isFaq) {
        if (f.kind === "paragraphs" && f.lits?.[0]) faqs.push({ q: E(f.lits[0]), a: E(f.paragraphs[0]) });
        continue;
      }
      if (isClosing) {
        if (f.label === "Closing block" && f.kind === "paragraphs") {
          const cta = (f.lits?.[0] ?? "").match(/^\[\s*(.*?)\s*→\s*(\S+?)\s*\]$/);
          closing = { body: E(f.marked[0]), cta: cta ? { label: E(cta[1]), href: cta[2] } : { label: "Ask our engineers", href: "/contact" } };
        } else if (f.label === "Related" && f.kind === "table") {
          // Slot | Destination | Anchor text — categories, industries, guides.
          for (const r of f.rows) {
            const m = r[1].match(/^\/(products|industries|resources)\/([a-z0-9-]+)$/);
            if (!m) continue;
            const list = related[m[1] as keyof typeof related];
            if (!list.includes(m[2])) list.push(m[2]);
          }
        }
        // "The full chart" (RES_04) is a note to Margo, not copy.
        continue;
      }

      // Article sections.
      if (f.kind === "heading") body.push(block(E(f.value), "h2"));
      else if (f.kind === "composite") {
        if (/Answer block|The answer block/.test(f.label)) {
          const h = f.parts.find((p) => p.kind === "heading");
          const p = f.parts.find((p) => p.kind === "para");
          if (h?.kind === "heading") body.push(block(E(h.lines.join(" ")), "h2"));
          if (p?.kind === "para") body.push(callout(E(p.text)));
        } else parts(f.parts);
      } else if (f.kind === "paragraphs") para(f);
      else if (f.kind === "table") {
        if (/^List <ol>/.test(f.label)) {
          // Each numbered item is an <h3> with its paragraph.
          for (const r of f.rows) {
            body.push(block(E(r[1]), "h3"));
            if (r[2]) body.push(block(E(r[2])));
          }
        } else {
          for (const r of f.rows) for (const c of r) E(c);
          body.push(table(undefined, f.columns.map((c) => E(c)), f.rows));
        }
      } else if (f.kind === "lit") E(f.value);
    }
  }

  if (!h1 || !standfirst || !closing) throw new Error(`${stem}: missing ${!h1 ? "H1" : !standfirst ? "standfirst" : "closing"}`);

  await applyDocument({
    id: `resource-${slug}`,
    type: "resource",
    schema: resourceDocSchema,
    patch: {
      "seo.title": sheet.head.title,
      "seo.description": sheet.head.description,
      h1,
      // The hub card's blurb (sheet 31) stays on `intro`; the article opens with its standfirst.
      standfirst,
      body,
      faqs,
      closing,
      related,
      confirmWithMargo: [],
    },
    expect,
  });
}
