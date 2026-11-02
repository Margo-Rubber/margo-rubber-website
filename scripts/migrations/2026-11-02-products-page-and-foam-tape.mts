/**
 * MIGRATION — client review, 2 Nov 2026 (evening).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-products-page-and-foam-tape.mts [--write] [--agriculture]
 *
 * Products page (productsHub):
 *   · "Five Million Components" photo: the INSTALLED CAPACITY badge over the
 *     photo is removed (excellence.imageBadge).
 *   · Industries we serve: EV & Renewables and Food & Beverage use their own
 *     card slots (products.sectors.*) rather than borrowing the industry
 *     page heroes, so each can be replaced in Studio on its own.
 *   · --agriculture: the Agriculture card gets its new slot
 *     "products.sectors.agriculture". RUN ONLY AFTER the commit adding that
 *     slot is deployed — an unknown image key throws on the live page.
 * Anti-vibration mounts: the "Strut Mounts" card (no photo) is removed.
 * Sponge & foam, self-adhesive foam tape: the cross-section build-up is
 *   removed; the heading and paragraph now sit beside the photo.
 *
 * Published AND draft documents. Idempotent; ifRevisionId on every write.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
const agriculture = process.argv.includes("--agriculture");
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

type Doc = { _id: string; _rev: string; [k: string]: unknown };
const notVersion = '!(_id in path("versions.**"))';

async function run(label: string, doc: Doc, set: Record<string, unknown>, unset: string[]) {
  if (!Object.keys(set).length && !unset.length) {
    console.log(`  ${label}: no change`);
    return;
  }
  console.log(`  ${label}: set ${Object.keys(set).join(", ") || "—"}; unset ${unset.join(", ") || "—"}`);
  if (!write) return;
  let p = client.patch(doc._id).ifRevisionId(doc._rev);
  if (Object.keys(set).length) p = p.set(set);
  if (unset.length) p = p.unset(unset);
  const r = await p.commit();
  console.log(`    rev ${r._rev}`);
}

/* Products page */
const SECTOR_SLOTS: Record<string, string> = {
  "ev-energy-storage-renewables": "products.sectors.ev-energy-storage-renewables",
  "food-beverage-pharma": "products.sectors.food-beverage-pharma",
  ...(agriculture ? { agriculture: "products.sectors.agriculture" } : {}),
};
const hubs = await client.fetch<(Doc & { badge?: unknown; sectors?: { _key: string; image?: string }[] })[]>(
  `*[_type == "productsHub" && ${notVersion}]{ _id, _rev, "badge": excellence.imageBadge, "sectors": sectors.items[]{ _key, image } }`,
);
console.log(`Products page${write ? "" : " — DRY RUN"}`);
for (const h of hubs) {
  const set: Record<string, unknown> = {};
  const unset: string[] = [];
  if (h.badge) unset.push("excellence.imageBadge");
  for (const s of h.sectors ?? []) {
    const slot = SECTOR_SLOTS[s._key];
    if (slot && s.image !== slot) set[`sectors.items[_key=="${s._key}"].image`] = slot;
  }
  await run(h._id, h, set, unset);
}

/* Anti-vibration mounts */
const avm = await client.fetch<(Doc & { has: boolean; grid?: string })[]>(
  `*[_type == "productCategory" && slug.current == "anti-vibration-mounts" && ${notVersion}]{ _id, _rev, "grid": sections[_type == "block.partsGrid"][0]._key, "has": count(sections[_type == "block.partsGrid"][0].items[_key == "k8-strut-mounts"]) > 0 }`,
);
console.log("Anti-vibration mounts");
for (const d of avm) {
  await run(d._id, d, {}, d.has ? [`sections[_key=="${d.grid}"].items[_key=="k8-strut-mounts"]`] : []);
}

/* Sponge & foam */
const foam = await client.fetch<(Doc & { buildUp?: unknown })[]>(
  `*[_type == "productCategory" && slug.current == "sponge-foam-rubber" && ${notVersion}]{ _id, _rev, "buildUp": sections[_key == "subCategorySection"][0].buildUp }`,
);
console.log("Sponge & foam");
for (const d of foam) {
  await run(d._id, d, {}, d.buildUp ? ['sections[_key=="subCategorySection"].buildUp'] : []);
}
if (!write) console.log("Dry run. Re-run with --write.");
