/**
 * MIGRATION — O-rings page: the B2 ring products from the client's photo pack.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/migrations/2026-11-02-o-rings-b2-parts.mts "<photo folder>" [--write]
 *
 * The pack ("products - o-rings", 2 Nov 2026) is 30 photos named
 * CODE_product-name. Fourteen are already cards in the "O-Rings We Make to
 * Order" grid (catalogue import, 27 Oct). This adds the B2 products that are
 * not, using only ring photos (client instruction):
 *   - B2-08 face-seal toric rings, B2-32 D-rings & oval rings and B2-33
 *     filter-housing / irrigation seals are skipped: the grid already has
 *     those products (MH-07, OR-02, PF-24 + PF-31);
 *   - names come from the file names; there is no description copy for the
 *     B2 codes, so the cards carry name and availability only, like the
 *     grid's original 23.
 * Each photo is uploaded as a Sanity image asset (deduplicated by Sanity on
 * content hash). Idempotent: cards already in the grid are skipped.
 *
 * It also removes the four catalogue cards whose photos are not rings
 * (client instruction, 2 Nov 2026): AT-04 coolant & radiator seals
 * (rectangular gasket), AT-29 connector seals & cavity plugs, OG-04 seal kits
 * (bagged kit with a square gasket) and OR-01 assortment kits (a box).
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const write = process.argv.includes("--write");
const dir = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!dir) throw new Error("Pass the folder holding the pack's .jpg files");
const token = process.env.SANITY_WRITE_TOKEN;
if (write && !token) throw new Error("SANITY_WRITE_TOKEN is not set — run with --env-file=.env.local");

const client = createClient({
  projectId: "jyg2beas",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

const ID = "productCategory-o-rings";
const AVAILABILITY = "O-Rings · Made to order";
const parts: { code: string; name: string }[] = [
  { code: "B2-20", name: "Hydraulic-cylinder static O-rings for mobile machinery" },
  { code: "B2-21", name: "Sprayer nozzle-body O-rings" },
  { code: "B2-22", name: "Refrigerant-circuit HVAC O-rings" },
  { code: "B2-23", name: "Pipe-coupling & water-fitting O-rings" },
  { code: "B2-24", name: "Laboratory-instrument fluid-path O-rings" },
  { code: "B2-25", name: "Food, beverage & pharma process O-rings" },
  { code: "B2-26", name: "Chemical-process O-rings, FKM or EPDM by medium" },
  { code: "B2-27", name: "Battery-pack connector O-rings" },
  { code: "B2-28", name: "Appliance O-rings & small parts" },
  { code: "B2-29", name: "Oil & gas equipment O-rings, NBR, HNBR, FKM" },
  { code: "B2-30", name: "ISO 3601 metric O-rings" },
  { code: "B2-31", name: "Hydraulic port & tube-fitting O-rings" },
  { code: "B2-34", name: "Micro O-rings" },
];

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jpg"));
const fileFor = (code: string) => {
  const f = files.find((x) => x.startsWith(`${code}_`));
  if (!f) throw new Error(`No photo for ${code} in ${dir}`);
  return path.join(dir, f);
};

const keyFor = (code: string) => `cat-${code.toLowerCase()}`;
const DROP = ["AT-04", "AT-29", "OG-04", "OR-01"].map(keyFor);
const existing = await client.fetch<{ _key: string; name: string }[] | null>(
  `*[_id == $id][0].sections[_key == "partsGrid"][0].items[]{_key, name}`,
  { id: ID },
);
if (!existing) throw new Error(`${ID} has no partsGrid items`);
const keys = new Set(existing.map((i) => i._key));
const names = new Set(existing.map((i) => i.name.toLowerCase()));
const todo = parts.filter((p) => !keys.has(keyFor(p.code)) && !names.has(p.name.toLowerCase()));

const drop = existing.filter((i) => DROP.includes(i._key));

console.log(`${ID}: ${existing.length} cards in the grid.`);
for (const p of todo) console.log(`  + ${p.code}  ${p.name}  ← ${path.basename(fileFor(p.code))}`);
for (const d of drop) console.log(`  - ${d._key}  ${d.name}`);
if (!todo.length && !drop.length) console.log("  nothing to change");

if (!write || (!todo.length && !drop.length)) {
  if (!write) console.log("Dry run. Re-run with --write.");
  process.exit(0);
}

const items = [];
for (const p of todo) {
  const file = fileFor(p.code);
  const asset = await client.assets.upload("image", fs.createReadStream(file), {
    filename: path.basename(file),
  });
  console.log(`  uploaded ${path.basename(file)} → ${asset._id}`);
  items.push({
    _key: keyFor(p.code),
    _type: "partName",
    name: p.name,
    availability: AVAILABILITY,
    image: { _type: "image", alt: p.name, asset: { _type: "reference", _ref: asset._id } },
  });
}

// The insert and the unset are separate patches (one insert per patch),
// committed together.
const tx = client.transaction();
if (items.length) {
  tx.patch(client.patch(ID).insert("after", 'sections[_key=="partsGrid"].items[-1]', items));
}
if (drop.length) {
  tx.patch(
    client.patch(ID).unset(drop.map((d) => `sections[_key=="partsGrid"].items[_key=="${d._key}"]`)),
  );
}
const result = await tx.commit();
console.log(`Committed ${result.transactionId}: +${items.length} cards, -${drop.length} cards`);
