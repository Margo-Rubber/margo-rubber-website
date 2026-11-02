/**
 * MIGRATION — Rubber Mats › Mat types › Vehicles: "Car floor mats" and
 * "Trunk and boot mats" removed (client, 2 Nov 2026). Mud flaps stays.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-rubber-mats-vehicles-trim.mts [--write]
 *
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

const NAMES = ["Car floor mats", "Trunk and boot mats"];
const docs = await client.fetch<{ _id: string; _rev: string; keys: string[] }[]>(
  `*[_type == "productCategory" && slug.current == "rubber-mats" && !(_id in path("versions.**"))]{
    _id, _rev, "keys": sections[_key == "section-1"][0].items[name in $names]._key
  }`,
  { names: NAMES },
);
for (const d of docs) {
  if (!d.keys?.length) {
    console.log(`${d._id}: already removed`);
    continue;
  }
  console.log(`${d._id}: remove ${d.keys.join(", ")}`);
  if (!write) continue;
  const r = await client
    .patch(d._id)
    .ifRevisionId(d._rev)
    .unset(d.keys.map((k) => `sections[_key=="section-1"].items[_key=="${k}"]`))
    .commit();
  console.log(`  rev ${r._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
