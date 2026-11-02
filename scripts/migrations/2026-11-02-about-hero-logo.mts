/**
 * MIGRATION — About hero: the company logo, cut out of its dark square
 * (client, 2 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-about-hero-logo.mts [--write]
 *
 * The logo uploaded to Photographs → About page → "About page — hero logo"
 * sat small inside a 1254 × 1254 square of near-black (#0C0E11), a different
 * shade from the hero's surface, so it showed as a box. The same logo, with
 * that background keyed to transparent and the square trimmed to the mark
 * and wordmark (566 × 473), is public/images/about/margo-logo-transparent.png;
 * this uploads it to the slot. The original upload stays in the media library.
 */
import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";

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

const ID = "imageOverride-about__hero";
const FILE = "public/images/about/margo-logo-transparent.png";
const doc = await client.fetch<{ _rev: string; name?: string } | null>(
  `*[_id == $id][0]{ _rev, "name": image.asset->originalFilename }`,
  { id: ID },
);
if (!doc) throw new Error(`${ID} not found`);
console.log(`${ID}: ${doc.name} → margo-logo-transparent.png`);
if (!write) {
  console.log("Dry run. Re-run with --write.");
  process.exit(0);
}
const asset = await client.assets.upload("image", createReadStream(FILE), { filename: "margo-logo-transparent.png" });
const r = await client
  .patch(ID)
  .ifRevisionId(doc._rev)
  .set({
    image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
    alt: "Margo Rubber Products logo",
  })
  .commit();
console.log(`  ${asset._id}, rev ${r._rev}`);
