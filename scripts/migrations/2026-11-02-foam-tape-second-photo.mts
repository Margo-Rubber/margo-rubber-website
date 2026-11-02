/**
 * MIGRATION — sponge & foam, self-adhesive foam tape: the die-cut foam gasket
 * photograph beside the tape (client, 2 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-foam-tape-second-photo.mts [--write]
 *
 * Sets the section's "Second photo" to the image already on the Foam Gaskets
 * card (parts grid, card 02). With two photos the heading and paragraph sit
 * above the pair again, and the photos run in equal halves.
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

const docs = await client.fetch<{ _id: string; _rev: string; ref?: string; detail?: string }[]>(
  `*[_type == "productCategory" && slug.current == "sponge-foam-rubber" && !(_id in path("versions.**"))]{
    _id, _rev,
    "ref": sections[_key == "partsGrid"][0].items[_key == "foam-gaskets"][0].image.asset._ref,
    "detail": sections[_key == "subCategorySection"][0].detailPhoto.asset._ref
  }`,
);
for (const d of docs) {
  if (!d.ref) throw new Error(`${d._id}: no Foam Gaskets photo to use`);
  if (d.detail === d.ref) {
    console.log(`${d._id}: already set`);
    continue;
  }
  console.log(`${d._id}: second photo → ${d.ref}`);
  if (!write) continue;
  const r = await client
    .patch(d._id)
    .ifRevisionId(d._rev)
    .set({
      'sections[_key=="subCategorySection"].detailPhoto': {
        _type: "image",
        alt: "Die-cut self-adhesive foam gaskets with release liner, blue and yellow",
        asset: { _type: "reference", _ref: d.ref },
      },
    })
    .commit();
  console.log(`  rev ${r._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
