import { createHash } from "node:crypto";
import { cacheTag } from "next/cache";
import { getSkuPage, skuSlugs, skuTag } from "@/lib/sku-source";
import { isIndexable } from "@/lib/build-mode";

/**
 * "MORE PARTS IN THE SAME COMPOUND" — internal links keyed on compound (D8 / T18).
 *
 * The audit (P1 crawl, 15 Oct 2026) found the median part page reached by 4
 * internal links and three parts by 1. Each part page now links to SIX other
 * parts that share at least one of its compounds, anchored on the part's own
 * name (its primary keyword).
 *
 * Which six is decided for the whole catalogue at once, not page by page:
 * each page, in turn, takes the matching part that has the FEWEST links so
 * far. Picking by overlap alone sent most links to the same popular parts
 * and left some with none; balanced this way every part receives 5–7 links
 * from this block (checked on the 29 parts, 21 Oct 2026). Deterministic, so
 * the lists only change when the catalogue does.
 */

export const COMPOUND_LINKS_PER_PAGE = 6;

export type CompoundLink = { href: string; label: string; shared: string[] };

type Part = { file: string; href: string; label: string; compounds: Set<string>; names: Map<string, string> };

const tie = (a: string, b: string) => createHash("md5").update(`${a}|${b}`).digest("hex");

export async function compoundLinks(): Promise<Record<string, CompoundLink[]>> {
  "use cache";
  cacheTag(skuTag());

  const parts: Part[] = [];
  for (const file of (await skuSlugs()).sort()) {
    const fm = (await getSkuPage(file))?.frontmatter;
    if (!fm || !isIndexable(fm.status)) continue;
    const i = file.indexOf("--");
    parts.push({
      file,
      href: `/products/${file.slice(0, i)}/${file.slice(i + 2)}`,
      label: fm.h1,
      compounds: new Set(fm.compounds.map((c) => c.toLowerCase())),
      names: new Map(fm.compounds.map((c) => [c.toLowerCase(), c])),
    });
  }

  const received = new Map(parts.map((p) => [p.file, 0]));
  const picks = new Map<string, Part[]>(parts.map((p) => [p.file, []]));
  const shared = (a: Part, b: Part) => [...a.compounds].filter((c) => b.compounds.has(c));

  for (let round = 0; round < COMPOUND_LINKS_PER_PAGE; round++) {
    for (const p of parts) {
      const mine = picks.get(p.file)!;
      const best = parts
        .filter((c) => c !== p && !mine.includes(c) && shared(p, c).length > 0)
        .sort(
          (a, b) =>
            received.get(a.file)! - received.get(b.file)! ||
            shared(p, b).length - shared(p, a).length ||
            tie(p.file, a.file).localeCompare(tie(p.file, b.file)),
        )[0];
      if (!best) continue;
      mine.push(best);
      received.set(best.file, received.get(best.file)! + 1);
    }
  }

  const out: Record<string, CompoundLink[]> = {};
  for (const p of parts) {
    out[p.file] = picks.get(p.file)!.map((c) => ({
      href: c.href,
      label: c.label,
      shared: shared(p, c).map((k) => p.names.get(k) ?? k),
    }));
  }
  return out;
}
