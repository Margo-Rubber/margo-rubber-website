/**
 * MIGRATION — the plant's coordinates (client, 2 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-plant-coordinates.mts [--write]
 *
 * Site settings → Company & contact → "Plant coordinates" held the Google
 * listing's pin (19.93214, 73.73324); the 27 Oct migration meant to replace
 * it never wrote. Margo has now given the building itself. The contact map
 * (scripts/gen-contact-map.mts) is centred on the same point.
 *
 * Published AND draft settings. Idempotent; ifRevisionId on every write.
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

const GEO = { lat: 19.932445350253296, lng: 73.73282183068572 };
const docs = await client.fetch<{ _id: string; _rev: string; geo?: { lat?: number; lng?: number } }[]>(
  `*[_type == "siteSettings" && !(_id in path("versions.**"))]{ _id, _rev, "geo": entity.geo }`,
);
for (const d of docs) {
  if (d.geo?.lat === GEO.lat && d.geo?.lng === GEO.lng) {
    console.log(`${d._id}: already set`);
    continue;
  }
  console.log(`${d._id}: ${d.geo?.lat}, ${d.geo?.lng} → ${GEO.lat}, ${GEO.lng}`);
  if (!write) continue;
  const r = await client.patch(d._id).ifRevisionId(d._rev).set({ "entity.geo.lat": GEO.lat, "entity.geo.lng": GEO.lng }).commit();
  console.log(`  patched → rev ${r._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
