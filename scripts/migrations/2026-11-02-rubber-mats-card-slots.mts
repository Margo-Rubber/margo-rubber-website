/**
 * MIGRATION — the Rubber Mats cards on the home and Products pages use their
 * own photo slots (client, 2 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-rubber-mats-card-slots.mts [--write]
 *
 * Both cards pointed at "products.rubber-mats.hero", so a new hero photo for
 * the Rubber Mats page changed them too. They now use the slots made for them:
 *   · Home → Our portfolio → Rubber Mats   "home.portfolio.rubber-mats"
 *   · Products → range grid → Rubber Mats  "products.card.rubber-mats"
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

const TARGETS = [
  { type: "homePage", path: 'portfolio.items[_key=="rubber-mats"].image', read: 'portfolio.items[_key=="rubber-mats"][0].image', slot: "home.portfolio.rubber-mats" },
  { type: "productsHub", path: 'range.cards[_key=="rubber-mats"].image', read: 'range.cards[_key=="rubber-mats"][0].image', slot: "products.card.rubber-mats" },
];

for (const t of TARGETS) {
  const docs = await client.fetch<{ _id: string; _rev: string; image?: string }[]>(
    `*[_type == $type && !(_id in path("versions.**"))]{ _id, _rev, "image": ${t.read} }`,
    { type: t.type },
  );
  for (const d of docs) {
    if (!d.image) {
      console.log(`${d._id}: no Rubber Mats card`);
      continue;
    }
    if (d.image === t.slot) {
      console.log(`${d._id}: already ${t.slot}`);
      continue;
    }
    console.log(`${d._id}: ${d.image} → ${t.slot}`);
    if (!write) continue;
    const r = await client.patch(d._id).ifRevisionId(d._rev).set({ [t.path]: t.slot }).commit();
    console.log(`  rev ${r._rev}`);
  }
}
if (!write) console.log("Dry run. Re-run with --write.");
