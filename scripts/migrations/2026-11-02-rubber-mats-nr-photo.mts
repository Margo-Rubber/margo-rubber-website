/**
 * MIGRATION — Rubber Mats, Natural rubber (NR) material card back on its own
 * slot (client, 2 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-rubber-mats-nr-photo.mts [--write]
 *
 * A Studio draft pointed the card at "sku.oil-seals--nbr.photo" (an oil-seal
 * photograph) and was published. The client wants the material photograph on
 * every card, so it goes back to "products.rubber-mats.material.nr".
 * Published AND draft documents. Idempotent; ifRevisionId on the write.
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

const SLOT = "products.rubber-mats.material.nr";
const docs = await client.fetch<{ _id: string; _rev: string; image?: string }[]>(
  `*[_type == "productCategory" && slug.current == "rubber-mats" && !(_id in path("versions.**"))]{ _id, _rev, "image": sections[_key == "materialSection"][0].items[code == "NR"][0].image }`,
);
for (const d of docs) {
  if (!d.image || d.image === SLOT) {
    console.log(`${d._id}: ${d.image ?? "no NR card"} — no change`);
    continue;
  }
  console.log(`${d._id}: ${d.image} → ${SLOT}`);
  if (!write) continue;
  const r = await client
    .patch(d._id)
    .ifRevisionId(d._rev)
    .set({ 'sections[_key=="materialSection"].items[code=="NR"].image': SLOT })
    .commit();
  console.log(`  rev ${r._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
