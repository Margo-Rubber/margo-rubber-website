/**
 * THE COMPOUNDS A PART IS MADE IN — one answer for every consumer (the
 * Product schema's `material`, D7, and the same-compound links, D8).
 *
 * A part's compounds live in one of four places, depending on how its page
 * was built (checked against the live site, 22 Oct 2026):
 *
 *  1. Its URL, when the part IS a compound variant: /oil-seals/nbr,
 *     /gaskets/epdm, epdm-pad, aem-insulation-bush → that one compound.
 *  2. `compounds` — the older code list. Filled in the .mdx seeds, EMPTY on
 *     every Sanity part document, which is why reading only this field
 *     produced no links in production.
 *  3. `compoundRanking` — all eight ranked with a label per row
 *     ("Recommended", "RECOMMENDED — sheltered", "Suitable", "Available",
 *     "Not recommended").
 *  4. `compoundRouter` — a table whose first column is the tier ("Supplied as
 *     standard", "Recommended", "Alternative", …) and second the compound
 *     ("Natural rubber", "EPDM closed-cell", …).
 *
 * From 3 and 4 a part "is made in" every compound whose tier is NOT
 * "Available" / "Not recommended" / similar. Names are matched loosely
 * ("EPDM closed-cell" → EPDM, "Silicone sponge" → VMQ, "Natural rubber" → NR).
 */

export type CompoundRef = { code: string; name: string };

type PartFields = {
  compounds?: readonly string[];
  compoundRanking?: readonly { code: string; rank: number; rankLabel?: string }[];
  compoundRouter?: { columns: readonly string[]; rows: readonly (readonly string[])[] };
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Tiers that do NOT mean "we make this part in it". */
const NOT_MADE_IN = /\b(not|available|avoid|unsuitable|never|no)\b/i;

function finder(all: readonly CompoundRef[]) {
  return (label: string): CompoundRef | undefined => {
    const whole = norm(label);
    const first = norm(label.trim().split(/[\s,/(]+/)[0] ?? "");
    const aliases: Record<string, string> = { silicone: "vmq", natural: "naturalrubber", cr: "neoprene" };
    for (const key of [whole, first, aliases[first] ?? ""]) {
      if (!key) continue;
      const hit = all.find((c) => norm(c.code) === key || norm(c.name) === key);
      if (hit) return hit;
    }
    return undefined;
  };
}

/**
 * @param path the part's URL, "/products/oil-seals/nbr"
 * @param all  the eight compounds from site settings
 * @returns the part's compounds, in no particular order; [] when unknown
 */
export function partCompounds(fm: PartFields, path: string, all: readonly CompoundRef[]): CompoundRef[] {
  const find = finder(all);
  const uniq = (xs: (CompoundRef | undefined)[]) => [...new Map(xs.filter((x): x is CompoundRef => !!x).map((c) => [c.code, c])).values()];

  // 1. A compound-variant part: the URL names it.
  const lead = find((path.split("/").pop() ?? "").split("-")[0]);
  if (lead) return [lead];

  // 2. The older code list.
  const listed = uniq((fm.compounds ?? []).map(find));
  if (listed.length) return listed;

  // 3. The ranking, by its labels; unlabelled → the top three ranks.
  const ranking = fm.compoundRanking ?? [];
  if (ranking.length) {
    const labelled = ranking.some((r) => r.rankLabel?.trim());
    const kept = labelled
      ? ranking.filter((r) => r.rankLabel?.trim() && !NOT_MADE_IN.test(r.rankLabel))
      : [...ranking].sort((a, b) => a.rank - b.rank).slice(0, 3);
    const out = uniq(kept.map((r) => find(r.code)));
    if (out.length) return out;
  }

  // 4. The router table: tier in the first column, compound in the column
  //    headed "Compound" (the second, by default).
  const router = fm.compoundRouter;
  if (router?.rows.length) {
    const col = Math.max(1, router.columns.findIndex((c) => /compound|material/i.test(c)));
    const out = uniq(
      router.rows.filter((r) => r[0]?.trim() && !NOT_MADE_IN.test(r[0])).map((r) => (r[col] ? find(r[col]) : undefined)),
    );
    if (out.length) return out;
  }

  return [];
}
