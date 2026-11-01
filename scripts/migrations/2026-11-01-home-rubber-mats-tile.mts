/**
 * MIGRATION — Rubber Mats tile on the home page portfolio grid.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/migrations/2026-11-01-home-rubber-mats-tile.mts [--write]
 *
 * Appends a twelfth tile to homePage-home → portfolio.items, linking to
 * /products/rubber-mats. Twelve tiles fill four rows of three.
 *
 * RUN ONLY AFTER the commit that adds the "home.portfolio.rubber-mats" image
 * slot (src/content/images.ts) is merged to main and deployed. An unknown
 * image key throws, so writing this first breaks the live home page on its
 * next render. Idempotent: does nothing if the tile is already there.
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

const ID = "homePage-home";
const tile = {
  _key: "rubber-mats",
  _type: "portfolioItem",
  name: "Rubber Mats",
  spec: "CAR / ANTI-FATIGUE / CHECKER",
  image: "home.portfolio.rubber-mats",
  href: "/products/rubber-mats",
};

const keys = await client.fetch<string[]>(`*[_id == $id][0].portfolio.items[]._key`, { id: ID });
if (!keys) throw new Error(`${ID} has no portfolio.items`);
console.log(`${ID}: ${keys.length} tiles`);
if (keys.includes(tile._key)) {
  console.log("Rubber Mats tile already present — nothing to do.");
  process.exit(0);
}

if (!write) {
  console.log(`Dry run: would append "${tile.name}" as tile ${keys.length + 1}. Re-run with --write.`);
  process.exit(0);
}

const result = await client
  .patch(ID)
  .setIfMissing({ portfolio: { items: [] } })
  .insert("after", "portfolio.items[-1]", [tile])
  .commit();
console.log(`Patched ${result._id} rev ${result._rev}`);
