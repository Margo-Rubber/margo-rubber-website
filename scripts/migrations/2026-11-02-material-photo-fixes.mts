/**
 * MIGRATION — two follow-ups to the Nov 2026 material cards.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-material-photo-fixes.mts [--write]
 *
 *  · Sponge & foam cards: "For hVAC gaskets…" — the generated sentence
 *    lower-cased an acronym. Restores "For HVAC…".
 *  · Gaskets, EPDM sponge card: the photograph uploaded in Studio
 *    (Photographs → Gaskets page) is replaced by the Nov 2026 EPDM material
 *    photograph (client, 2 Nov 2026). The old upload stays in the media
 *    library.
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

const SPONGE = "productCategory-sponge-foam-rubber";
const sponge = await client.fetch<{ _rev: string; sections: { _key: string; items?: { summary: string }[] }[] }>(
  `*[_id == $id][0]{ _rev, sections }`,
  { id: SPONGE },
);
const sections = sponge.sections.map((s) =>
  s._key === "materialSection"
    ? { ...s, items: s.items!.map((i) => ({ ...i, summary: i.summary.replace(/\bFor hVAC\b/, "For HVAC") })) }
    : s,
);
const spongeChanged = JSON.stringify(sections) !== JSON.stringify(sponge.sections);
console.log(`${SPONGE}: ${spongeChanged ? "fix HVAC" : "no change"}`);

const OVERRIDE = "imageOverride-products__gaskets__material__epdm-sponge";
const FILE = "public/images/materials/material-epdm.webp";
const override = await client.fetch<{ _rev: string; image?: { asset?: { _ref: string } } }>(`*[_id == $id][0]`, { id: OVERRIDE });
console.log(`${OVERRIDE}: currently ${override?.image?.asset?._ref}`);

if (!write) {
  console.log("Dry run. Re-run with --write.");
  process.exit(0);
}
if (spongeChanged) {
  const r = await client.patch(SPONGE).ifRevisionId(sponge._rev).set({ sections }).commit();
  console.log(`  sponge → rev ${r._rev}`);
}
const asset = await client.assets.upload("image", createReadStream(FILE), { filename: "material-epdm.webp" });
const r = await client
  .patch(OVERRIDE)
  .ifRevisionId(override._rev)
  .set({
    image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
    alt: "EPDM sponge rubber sample on a light studio surface, illustrative",
  })
  .commit();
console.log(`  gaskets EPDM sponge → ${asset._id}, rev ${r._rev}`);
