/**
 * MIGRATION — EV and Food & Beverage in the products page "Industries we serve".
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/migrations/2026-11-01-products-sectors-ev-food.mts [--write] [--with-images]
 *
 * Appends two hubSector items to productsHub-products → sectors.items, after
 * Agriculture. Copy comes from each industry page's own description; neither
 * page names clients, so "Typical clients" describes the buyer, as the HVAC,
 * Water and Agriculture cards already do.
 *
 * IMAGES. The card image is optional (Agriculture has none), but an unknown
 * image key throws when the card renders. The two image slots ship in the
 * same commit as this script, so:
 *   - without --with-images the cards are written image-less — safe on any
 *     deployed build;
 *   - with --with-images they also get their image — run that only after the
 *     commit is merged to main and deployed.
 * Idempotent: skips cards already there; --with-images also updates them.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
const withImages = process.argv.includes("--with-images");
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

const ID = "productsHub-products";
const cards = [
  {
    _key: "ev-energy-storage-renewables",
    _type: "hubSector",
    name: "EV & Renewables",
    body: "Battery-pack and cabinet gaskets, grommets and junction-box seals for EV, BESS, solar and wind equipment, made to drawing.",
    products: "Gaskets, Sponge & Foam, Grommets, O-Rings",
    clients: "EV, battery-storage, solar and wind equipment builders",
    href: "/industries/ev-energy-storage-renewables",
    image: "products.sectors.ev-energy-storage-renewables",
  },
  {
    _key: "food-beverage-pharma",
    _type: "hubSector",
    name: "Food & Beverage",
    body: "Clamp gaskets, O-rings, valve seats and door seals for dairy, brewery, food and pharma process lines, made to drawing.",
    products: "Gaskets, O-Rings, Oil Seals, Bellows",
    clients: "Dairy, brewery, bottling and food-machinery builders",
    href: "/industries/food-beverage-pharma",
    image: "products.sectors.food-beverage-pharma",
  },
];

const keys = await client.fetch<string[] | null>(`*[_id == $id][0].sectors.items[]._key`, { id: ID });
if (!keys) throw new Error(`${ID} has no sectors.items`);
const add = cards
  .filter((c) => !keys.includes(c._key))
  .map(({ image, ...c }) => (withImages ? { ...c, image } : c));
console.log(`${ID}: ${keys.length} sectors. Adding: ${add.map((c) => c.name).join(", ") || "nothing"}${withImages ? " (with images)" : " (no images)"}`);

if (!write) {
  console.log("Dry run. Re-run with --write.");
  process.exit(0);
}

let patch = client.patch(ID);
if (add.length) patch = patch.insert("after", "sectors.items[-1]", add);
if (withImages) {
  for (const c of cards.filter((c) => keys.includes(c._key))) {
    patch = patch.set({ [`sectors.items[_key=="${c._key}"].image`]: c.image });
  }
}
const result = await patch.commit();
console.log(`Patched ${result._id} rev ${result._rev}`);
