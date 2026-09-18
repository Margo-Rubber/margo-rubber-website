/**
 * MIGRATION — `compoundProperties` on every part: `{}` → `[]`.
 *
 *   node scripts/migrations/2026-09-18-sku-compound-properties-array.mts [--write]
 *
 * The apply script wrote the field as an empty object (the content files'
 * map shape) where the Studio schema declares an array of code/values pairs.
 * The site never noticed — its reader accepts either — but the Studio did:
 * every part failed validation ("Expected type Array, got Object") and no
 * part page could be published from the Studio. sku.mts now writes `[]`;
 * this puts the 29 documents already in the dataset right.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN;
if (write && !token) throw new Error("SANITY_WRITE_TOKEN is not set — source .env.local first");

const client = createClient({
  projectId: "jyg2beas",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

type Row = { _id: string; kind: string };
const rows = await client.fetch<Row[]>(
  `*[_type == "sku" && defined(compoundProperties)]{_id, "kind": select(
     compoundProperties._type != null || count(compoundProperties) == null => "object",
     "array")}`,
);
const wrong = rows.filter((r) => r.kind === "object");
console.log(`${rows.length} part(s) carry compoundProperties; ${wrong.length} as an object.`);
if (!wrong.length) process.exit(0);
if (!write) {
  for (const r of wrong) console.log(`  would fix ${r._id}`);
  console.log("\nDry run. Add --write to patch.");
  process.exit(0);
}

let tx = client.transaction();
for (const r of wrong) tx = tx.patch(r._id, { set: { compoundProperties: [] } });
const result = await tx.commit();
console.log(`patched ${wrong.length} document(s); transaction ${result.transactionId}`);
