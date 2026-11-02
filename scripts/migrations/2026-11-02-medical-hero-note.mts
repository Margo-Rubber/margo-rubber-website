/**
 * MIGRATION — Medical Devices: the hero line "ISO 9001:2015 certified.
 * Medical-device certification is in progress." removed (client, 2 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-medical-hero-note.mts [--write]
 *
 * Unsets the industry document's heroNote. The same statement stays where
 * it answers a question (FAQ), in the quality section and in the page's
 * non-claims. Published AND draft documents; ifRevisionId on every write.
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

const docs = await client.fetch<{ _id: string; _rev: string; note?: string }[]>(
  `*[_type == "industry" && slug.current == "medical-devices" && !(_id in path("versions.**"))]{ _id, _rev, "note": heroNote }`,
);
for (const d of docs) {
  if (!d.note) {
    console.log(`${d._id}: no hero note`);
    continue;
  }
  console.log(`${d._id}: remove hero note "${d.note}"`);
  if (!write) continue;
  const r = await client.patch(d._id).ifRevisionId(d._rev).unset(["heroNote"]).commit();
  console.log(`  rev ${r._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
