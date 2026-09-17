/**
 * 31_Resources_Hub → resourcesHub-resources + the card fields on the seven
 * resource documents (title, blurb, read time, featured). Article bodies
 * are Phase 6 (the RES_ sheets).
 *
 *   node scripts/sheets/apply/resources-hub.mts [--write]
 */

import {
  resourcesHubSchema,
  resourceSchema,
} from "../../../src/content/schemas/index.ts";
import {
  applyDocument,
  field,
  loadSheet,
  section,
  lit,
  heading,
  paragraph,
  rows,
  type Section,
} from "../lib.mts";
import type { Part } from "../parse-sheets.mts";

const sheet = loadSheet("31_Resources_Hub");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v), v);

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const counter = lit(hero, "Counter strip"); // 7 Guides · 3 Categories · Updated September 2026
const updated = counter.match(/Updated (.+)$/);
if (!updated) throw new Error("counter");

/* ── 02 Search & filters ─────────────────────────────────────────────────── */
const sf = s("02");
const tabs = lit(sf, "Filter tabs")
  .split(" · ")
  .map((t) => E(t.trim())); // All Guides · Material Comparison · Sizing & Spec · Sourcing & Buyer Decision

/* ── 03–05 Categories and cards ──────────────────────────────────────────── */
const KEY: Record<string, string> = {
  "Material Comparison": "material-comparison",
  "Sizing & Spec": "sizing-spec",
  "Sourcing & Buyer Decision": "sourcing-buyer",
};
const categories: { key: string; label: string; blurb?: string }[] = [];
const cards: {
  id: string;
  h1: string;
  intro: string;
  readingMinutes: number;
  featured: boolean;
  category: string;
}[] = [];
for (const num of ["03", "04", "05"]) {
  const sec = s(num);
  const head = field(sec, "H2 · intro", "composite");
  const h = head.parts.find((p) => p.kind === "heading") as Extract<
    Part,
    { kind: "heading" }
  >;
  const p = head.parts.find((p) => p.kind === "para") as Extract<
    Part,
    { kind: "para" }
  >;
  const label = E(h.lines[0]);
  // "…specification decisions. 3 guides" — the count is derived on the page.
  categories.push({
    key: KEY[label],
    label,
    blurb: E(p.text.replace(/\s*\d+ guides?$/, "")),
  });
  for (const f of sec.fields.filter((x) => x.label.startsWith("Card"))) {
    if (f.kind !== "paragraphs") throw new Error(`${num} ${f.label}`);
    const [metaLine, title] = (f.lits?.[0] ?? "").split("\n");
    const minutes = metaLine.match(/(\d+) min read/);
    const href = (f.lits?.[1] ?? "").match(/→\s*(\/resources\/[a-z0-9-]+)/);
    if (!minutes || !href) throw new Error(`${num} ${f.label}: meta`);
    cards.push({
      id: `resource-${href[1].split("/").pop()}`,
      h1: E(title),
      intro: E(f.paragraphs[0]),
      readingMinutes: Number(minutes[1]),
      featured: false,
      category: KEY[label],
    });
    E(`${minutes[1]} min read`);
  }
}
// §02 "Featured card — START HERE": the gasket guide, restored 2026-09-03.
const featured = lit(sf, "Featured card").split("\n");
const featuredTitle = featured[2];
const feat = cards.find((c) => c.h1 === featuredTitle);
if (!feat)
  throw new Error(`featured card "${featuredTitle}" not among the cards`);
feat.featured = true;
const featuredBlurb = E(featured[3]);

/* ── 06 Closing CTA ──────────────────────────────────────────────────────── */
const cta = s("06");
const ctaH2 = heading(cta, "H2");
const buttons = rows(cta, "Buttons").map((r) => {
  const m = r[2].match(/^(.*?)\s*→\s*(\S*)$/);
  if (!m) throw new Error(`cta ${r[0]}`);
  const href = m[2] === "mailto:" ? `mailto:${m[1]}` : m[2];
  return {
    label: E(m[1]),
    href,
    variant: r[0] === "Primary" ? "primary" : "secondary",
  };
});

// Sheet 40 §10: the datasheet is an eighth item in a fourth category,
// Datasheets, not filed as a guide. The group has a label and no blurb.
categories.push({ key: "datasheets", label: "Datasheets" });

const patch = {
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  h1: E(heading(hero, "H1").value),
  h1Lines: [heading(hero, "H1").value],
  intro: E(paragraph(hero, "Subhead")),
  lastUpdated: E(updated[1]),
  searchPlaceholder: E(lit(sf, "Search field")),
  allLabel: tabs[0],
  featuredLabel: E(featured[0]),
  categories,
  "cta.headingLines": ctaH2.lines.map((l) => E(l)),
  "cta.body": E(paragraph(cta, "Body")),
  "cta.actions": buttons,
};

await applyDocument({
  id: "resourcesHub-resources",
  type: "resourcesHub",
  schema: resourcesHubSchema,
  patch,
  expect,
});
for (const c of cards) {
  await applyDocument({
    id: c.id,
    type: "resource",
    schema: resourceSchema,
    patch: {
      h1: c.h1,
      intro: c.intro,
      readingMinutes: c.readingMinutes,
      featured: c.featured,
      ...(c.featured ? { featuredBlurb } : {}),
    },
  });
}
