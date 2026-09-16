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
