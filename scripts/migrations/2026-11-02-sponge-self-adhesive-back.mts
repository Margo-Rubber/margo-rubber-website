/**
 * MIGRATION — sponge & foam: the self-adhesive foam tape section back
 * (client, 2 Nov 2026), after density and before sectors.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-sponge-self-adhesive-back.mts "<section.json>" [--write]
 *
 * <section.json> is the subCategorySection block as it was before
 * 2026-11-02-product-pages-client-review.mts removed it. Idempotent; the
 * write uses ifRevisionId.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const write = process.argv.includes("--write");
const file = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!file) throw new Error("Pass the saved section JSON");
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

const ID = "productCategory-sponge-foam-rubber";
const section = JSON.parse(readFileSync(file, "utf8"));
if (section._key !== "subCategorySection") throw new Error("not the subCategorySection block");

const doc = await client.fetch<{ _rev: string; sections: { _key: string }[] }>(`*[_id == $id][0]{ _rev, sections }`, { id: ID });
if (doc.sections.some((s) => s._key === section._key)) {
  console.log("Already there — nothing to do.");
  process.exit(0);
}
const at = doc.sections.findIndex((s) => s._key === "densitySection");
const sections = [...doc.sections];
sections.splice(at === -1 ? sections.length - 1 : at + 1, 0, section);
console.log(`after: ${sections.map((s) => s._key).join(", ")}`);
if (!write) {
  console.log("Dry run. Re-run with --write.");
  process.exit(0);
}
const res = await client.patch(ID).ifRevisionId(doc._rev).set({ sections }).commit();
console.log(`Patched → rev ${res._rev}`);
