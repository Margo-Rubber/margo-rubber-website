/**
 * MIGRATION — gaskets page, client review of 2 Nov 2026.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-gaskets-cards-export-title.mts [--write]
 *
 *   · Card 11 "Foam Gaskets": the die-cut blue and yellow foam gasket photo,
 *     the asset already on the Sponge & Foam page's Foam Gaskets card.
 *   · Cards 20 "Rubber-to-Metal Bonded Gaskets" and 42 "Valve-manifold
 *     gaskets & flange seals" removed.
 *   · The export paragraph had no title: it gets "04 · EXPORT / Exporting
 *     Gaskets from India", and its bold lead-in, which said the same thing,
 *     is dropped from the paragraph.
 * Published AND draft documents. Idempotent; ifRevisionId on every write.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN;
if (!token) throw new Error("SANITY_WRITE_TOKEN is not set — run with --env-file=.env.local");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "jyg2beas",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

const DROP = ["rubber-to-metal-bonded-gaskets", "cat-md-01"];
const LEAD = "Exporting gaskets from India.";

const photo = await client.fetch<string | null>(
  `*[_id == "productCategory-sponge-foam-rubber"][0].sections[_key == "partsGrid"][0].items[_key == "foam-gaskets"][0].image.asset._ref`,
);
if (!photo) throw new Error("No Foam Gaskets photo on the sponge page");

type Span = { _key: string; _type: string; marks: string[]; text: string };
type Doc = {
  _id: string;
  _rev: string;
  grid: string;
  foam?: string;
  drop: string[];
  exp?: { eyebrow?: string; heading?: string; content: { children: Span[] }[] };
};

const docs = await client.fetch<Doc[]>(
  `*[_type == "productCategory" && slug.current == "gaskets" && !(_id in path("versions.**"))]{
    _id, _rev,
    "grid": sections[_type == "block.partsGrid"][0]._key,
    "foam": sections[_type == "block.partsGrid"][0].items[_key == "foam-gaskets"][0].image.asset._ref,
    "drop": sections[_type == "block.partsGrid"][0].items[_key in $drop]._key,
    "exp": sections[_key == "k4-export-gaskets"][0]{ eyebrow, heading, content }
  }`,
  { drop: DROP },
);

for (const d of docs) {
  const set: Record<string, unknown> = {};
  const unset: string[] = [];
  const cards = `sections[_key=="${d.grid}"].items`;

  if (d.foam !== photo) {
    set[`${cards}[_key=="foam-gaskets"].image`] = {
      _type: "image",
      alt: "Die-cut self-adhesive foam gaskets with release liner, blue and yellow",
      asset: { _type: "reference", _ref: photo },
    };
  }
  for (const k of d.drop) unset.push(`${cards}[_key=="${k}"]`);

  if (d.exp && !d.exp.heading) {
    set['sections[_key=="k4-export-gaskets"].eyebrow'] = "04 · EXPORT";
    set['sections[_key=="k4-export-gaskets"].heading'] = "Exporting Gaskets from India";
    const block = d.exp.content[0];
    const spans = block.children;
    if (spans[0]?.text === LEAD && spans[0].marks.includes("strong")) {
      const rest = spans.slice(1).map((s, i) => (i === 0 ? { ...s, text: s.text.replace(/^\s+/, "") } : s));
      set['sections[_key=="k4-export-gaskets"].content[0].children'] = rest;
    }
  }

  if (!Object.keys(set).length && !unset.length) {
    console.log(`${d._id}: no change`);
    continue;
  }
  console.log(`${d._id}: set ${Object.keys(set).length} field(s); remove ${d.drop.join(", ") || "—"}`);
  if (!write) continue;
  let p = client.patch(d._id).ifRevisionId(d._rev);
  if (Object.keys(set).length) p = p.set(set);
  if (unset.length) p = p.unset(unset);
  const r = await p.commit();
  console.log(`  rev ${r._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
