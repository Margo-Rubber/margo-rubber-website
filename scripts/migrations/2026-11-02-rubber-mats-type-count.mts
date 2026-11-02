/**
 * MIGRATION — Rubber Mats hero: "11 mat types" → the real count (client, 2 Nov 2026),
 * after Car floor mats, Trunk and boot mats and Ribbed anti-slip mats left
 * the Mat types grid (8 cards).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-rubber-mats-type-count.mts [--write]
 *
 * Sets the hero figure whose label is "Mat types" to the number of cards now
 * in the three Mat types grids. Published AND draft; ifRevisionId on writes.
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

const docs = await client.fetch<{ _id: string; _rev: string; stat?: { _key: string; value: string }; n: number }[]>(
  `*[_type == "productCategory" && slug.current == "rubber-mats" && !(_id in path("versions.**"))]{
    _id, _rev,
    "stat": heroStats[label == "Mat types"][0]{ _key, value },
    "n": count(sections[_key in ["section-1","section-2","section-3"]].items[])
  }`,
);
for (const d of docs) {
  if (!d.stat) {
    console.log(`${d._id}: no "Mat types" figure`);
    continue;
  }
  const value = String(d.n);
  if (d.stat.value === value) {
    console.log(`${d._id}: already ${value}`);
    continue;
  }
  console.log(`${d._id}: Mat types ${d.stat.value} → ${value}`);
  if (!write) continue;
  const r = await client.patch(d._id).ifRevisionId(d._rev).set({ [`heroStats[_key=="${d.stat._key}"].value`]: value }).commit();
  console.log(`  rev ${r._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
