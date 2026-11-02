/**
 * MIGRATION — client review, 2 Nov 2026.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-cert-strip-and-lining-scope.mts [--write]
 *
 *   · The certification strip (ISO 9001 certificate, IATF / ISO 14001 / 45001
 *     targets) is removed from Diaphragms, Reciprocating Seals, Bonded
 *     Components and Rubber Lining — the only pages that carried it.
 *   · Rubber Lining: the "Not included" list (scaffolding, confined-space
 *     entry, plant shutdown coordination) is removed. It was the scope
 *     section's only content, so the section goes with it.
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

const SLUGS = ["diaphragms", "seals", "bonded-components", "rubber-lining"];
const docs = await client.fetch<{ _id: string; _rev: string; slug: string; strips: string[]; service?: unknown }[]>(
  `*[_type == "productCategory" && slug.current in $slugs && !(_id in path("versions.**"))]{
    _id, _rev, "slug": slug.current,
    "strips": sections[_type == "block.certificationStrip"]._key,
    service
  }`,
  { slugs: SLUGS },
);
for (const d of docs) {
  const unset = d.strips.map((k) => `sections[_key=="${k}"]`);
  if (d.slug === "rubber-lining" && d.service) unset.push("service");
  if (!unset.length) {
    console.log(`${d._id}: no change`);
    continue;
  }
  console.log(`${d._id}: remove ${unset.join(", ")}`);
  if (!write) continue;
  const r = await client.patch(d._id).ifRevisionId(d._rev).unset(unset).commit();
  console.log(`  rev ${r._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
