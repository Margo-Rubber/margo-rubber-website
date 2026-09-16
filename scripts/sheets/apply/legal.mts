/**
 * 08_Legal_Pages → legal-privacy-policy, legal-terms, legal-disclaimer.
 *
 *   node scripts/sheets/apply/legal.mts [--write]
 *
 * The sheet ships three finished documents. Each maps onto the existing
 * Sanity document by section index — the sheet's own rule: "section
 * numbering and anchor IDs are unchanged on all three pages" — so ids,
 * icons and TOC labels stay and only the words change. Every paragraph,
 * sub-heading, list item and emphasised line is the sheet's, verbatim.
 *
 * Counsel notes (`span.tok`) never ship; they go to OPEN-ITEMS.
 */

import { z } from "zod";
import { legalSchema } from "../../../src/content/schemas/index.ts";
import { applyDocument, client, loadSheet, section, field } from "../lib.mts";
import type { DocSection } from "../parse-sheets.mts";

const sheet = loadSheet("08_Legal_Pages");

/** "01 SEPTEMBER 2026" on the header → the sheet's own "01 September 2026". */
const titleCaseDate = (s: string) =>
  s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());

/**
 * applyDocument validates the raw Sanity shape; the legal route rebuilds
 * `{p}|{h}|{ul}|{note}` from `{kind,text|items}` in GROQ. Mirror that here
 * so the merged document is checked exactly as the page will read it.
 */
type RawBlock = { kind: string; text?: string; items?: string[] };
type RawSection = { id?: { current?: string }; blocks?: RawBlock[] };
const rawLegal = z.preprocess((raw) => {
  const d = raw as { title?: string; sections?: RawSection[] };
  return {
    ...d,
    h1: d.title,
    sections: (d.sections ?? []).map((s) => ({
      ...s,
      id: s.id?.current ?? s.id,
      blocks: (s.blocks ?? []).map((b) =>
        b.kind === "ul"
          ? { ul: b.items }
          : b.kind === "h"
            ? { h: b.text }
            : b.kind === "note"
              ? { note: b.text }
              : { p: b.text },
      ),
    })),
  };
}, legalSchema);

const DOCS: { num: string; section: string; id: string; title: string }[] = [
  { num: "01", section: "Privacy Policy", id: "legal-privacy-policy", title: "Privacy Policy | Margo Rubber Products" },
  { num: "02", section: "Terms of Service", id: "legal-terms", title: "Terms of Service | Margo Rubber Products" },
  { num: "03", section: "Disclaimer", id: "legal-disclaimer", title: "Disclaimer | Margo Rubber Products" },
];

for (const doc of DOCS) {
  const sec = section(sheet, doc.num);
  const f = field(sec, doc.section, "document");
  const expect: string[] = [];
  // Emphasis markers are rendering hints; the page shows the words.
  const E = (v: string) => (expect.push(v.replace(/\*\*/g, "")), v);

  const existing = (await client.fetch(
    `*[_id == $id][0].sections[]{ "id": id.current, icon, navLabel }`,
    { id: doc.id },
  )) as { id: string; icon?: string; navLabel?: string }[];
  if (existing.length !== f.sections.length)
    throw new Error(`${doc.id}: ${existing.length} sections in Sanity, ${f.sections.length} on the sheet`);

  const sections = f.sections.map((s: DocSection, i: number) => ({
    title: E(s.title),
    id: { _type: "slug", current: existing[i].id },
    icon: existing[i].icon ?? "doc",
    ...(existing[i].navLabel ? { navLabel: existing[i].navLabel } : {}),
    blocks: s.blocks.map((b) =>
      b.kind === "ul"
        ? { kind: "ul", items: b.items.map((it) => E(it)) }
        : { kind: b.kind, text: E(b.text) },
    ),
  }));

  const patch = {
    "seo.title": doc.title,
    title: doc.section,
    intro: E(f.standfirst),
    lastUpdated: E(titleCaseDate(f.lastUpdated)),
    sections,
  };

  await applyDocument({ id: doc.id, type: "legal", schema: rawLegal, patch, expect });
}
