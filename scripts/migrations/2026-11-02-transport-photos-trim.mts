/**
 * MIGRATION — transport (client, 2 Nov 2026):
 *   · product photos on the "Six Product Lines" cards — each card reuses
 *     the group photo already uploaded on its product page's parts grid;
 *   · the certification strip, "What We Hold, and What We Do Not" and
 *     "We Supply the Builder, Not the Railway" sections removed.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-transport-photos-trim.mts [--write]
 *
 * Idempotent; the write uses ifRevisionId. Patches the draft too if one exists.
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

const DROP = ["certification", "standards", "scope"];

type Item = { _key: string; name: string; href?: string; image?: { asset?: { _ref: string } } };
type Doc = { _id: string; _rev: string; sections: { _key: string; items?: Item[] }[] };

for (const id of ["industry-transport", "drafts.industry-transport"]) {
  const doc = await client.fetch<Doc | null>(`*[_id == $id][0]`, { id });
  if (!doc) {
    console.log(`${id}: not found — skipped.`);
    continue;
  }
  const patch = client.patch(id).ifRevisionId(doc._rev);
  const changes: string[] = [];

  const drop = doc.sections.filter((s) => DROP.includes(s._key)).map((s) => `sections[_key=="${s._key}"]`);
  if (drop.length) {
    patch.unset(drop);
    changes.push(`remove ${drop.length} section(s)`);
  }

  for (const it of doc.sections.find((s) => s._key === "products")?.items ?? []) {
    if (it.image?.asset) continue;
    const slug = it.href?.match(/^\/products\/([a-z0-9-]+)$/)?.[1];
    if (!slug) throw new Error(`${it._key}: no product link to take a photo from`);
    const ref = await client.fetch<string | null>(
      `*[_id == "productCategory-" + $slug][0].sections[defined(groupPhoto.asset)][0].groupPhoto.asset._ref`,
      { slug },
    );
    if (!ref) throw new Error(`${it._key}: /products/${slug} has no group photo`);
    patch.set({
      [`sections[_key=="products"].items[_key=="${it._key}"].image`]: {
        _type: "image",
        asset: { _type: "reference", _ref: ref },
        alt: `${it.name} made by Margo Rubber Products`,
      },
    });
    changes.push(`photo ${it._key} ← ${ref}`);
  }

  if (!changes.length) {
    console.log(`${id}: already done — nothing to do.`);
    continue;
  }
  console.log(`${id}:\n  ${changes.join("\n  ")}`);
  if (write) console.log(`  Patched → rev ${(await patch.commit())._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
