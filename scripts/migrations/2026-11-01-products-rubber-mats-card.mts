/**
 * MIGRATION — Rubber Mats card in the products page range grid.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/migrations/2026-11-01-products-rubber-mats-card.mts [--write]
 *
 * Appends a card after Rubber Lining & Skirting in productsHub-products →
 * range.cards (so the "Sheet and lining products" group becomes a pair) and
 * adds a "Mats" filter.
 *
 * RUN ONLY AFTER the commit that adds the "products.card.rubber-mats" image
 * slot (src/content/images.ts) is merged to main and deployed: an unknown
 * image key throws when the card renders. Idempotent.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
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
const card = {
  _key: "rubber-mats",
  _type: "rangeCard",
  slug: "rubber-mats",
  title: "Rubber Mats",
  kicker: "SOLID RUBBER MATS FOR VEHICLES, FLOORS AND PANELS",
  tag: "Mats",
  chips: ["Car floor mats", "Anti-fatigue mats"],
  image: "products.card.rubber-mats",
  span: "normal",
};

const range = await client.fetch<{ filters: string[]; cards: { _key: string }[] } | null>(
  `*[_id == $id][0].range{filters, "cards": cards[]{_key}}`,
  { id: ID },
);
if (!range) throw new Error(`${ID} has no range`);
const hasCard = range.cards.some((c) => c._key === card._key);
const hasFilter = range.filters.includes(card.tag);
console.log(`${ID}: ${range.cards.length} cards; filters ${JSON.stringify(range.filters)}`);
console.log(`Card: ${hasCard ? "already there" : "will add after rubber-lining"}; filter "${card.tag}": ${hasFilter ? "already there" : "will add"}`);

if (!write || (hasCard && hasFilter)) {
  if (!write) console.log("Dry run. Re-run with --write.");
  process.exit(0);
}

let patch = client.patch(ID);
if (!hasCard) patch = patch.insert("after", 'range.cards[_key=="rubber-lining"]', [card]);
if (!hasFilter) patch = patch.insert("after", "range.filters[-1]", [card.tag]);
const result = await patch.commit();
console.log(`Patched ${result._id} rev ${result._rev}`);
