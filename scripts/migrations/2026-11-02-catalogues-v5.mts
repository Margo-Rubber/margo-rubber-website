/**
 * MIGRATION — catalogue PDFs: the v5 industry books rebuilt on 1 Nov 2026 and
 * the v5 master catalogue (client, 2 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-catalogues-v5.mts --industry "<folder>" --master "<file>" [--write]
 *
 * --industry  the Drive folder "02 Industry catalogues v5 (PDF)/v5 rebuilt
 *             2026-11-01 (13 books, PRINT + WEB)". The PRINT edition goes on
 *             each industry page, as before.
 * --master    the master catalogue PDF for the Products page (Products page →
 *             Catalogue). Studio asks for under ~10 MB, so the v5 WEB edition
 *             (2.4 MB) rather than PRINT (15.9 MB).
 *
 * Industry page → catalogue file (the books are named by sector, not slug):
 * EV and Food & Beverage get their first catalogue; the other eleven are
 * replaced. Sanity deduplicates uploads by content, so an unchanged book
 * re-uses its asset. Published AND draft documents; ifRevisionId on writes.
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync } from "node:fs";
import { basename, join } from "node:path";

const write = process.argv.includes("--write");
const arg = (name: string) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const INDUSTRY = arg("--industry");
const MASTER = arg("--master");
if (!INDUSTRY || !existsSync(INDUSTRY)) throw new Error('Pass --industry "<folder of v5 rebuilt books>"');
if (!MASTER || !existsSync(MASTER)) throw new Error('Pass --master "<master catalogue PDF>"');

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

const BOOKS: Record<string, string> = {
  agriculture: "Margo_Agriculture_Catalogue_v5_PRINT.pdf",
  automotive: "Margo_Automotive_Catalogue_v5_PRINT.pdf",
  construction: "Margo_Construction_Catalogue_v5_PRINT.pdf",
  "electrical-electronics": "Margo_Electrical_Catalogue_v5_PRINT.pdf",
  "ev-energy-storage-renewables": "Margo_EV_Energy_Renewables_Catalogue_v5_PRINT.pdf",
  "food-beverage-pharma": "Margo_Food_Beverage_Pharma_Catalogue_v5_PRINT.pdf",
  hvac: "Margo_HVAC_Catalogue_v5_PRINT.pdf",
  "medical-devices": "Margo_Medical_Catalogue_v5_PRINT.pdf",
  mining: "Margo_Mining_Catalogue_v5_PRINT.pdf",
  "oil-gas": "Margo_OilGas_Catalogue_v5_PRINT.pdf",
  "pumps-valves": "Margo_Pumps_Valves_Catalogue_v5_PRINT.pdf",
  transport: "Margo_Rail_Marine_Catalogue_v5_PRINT.pdf",
  "water-fluid-management": "Margo_Water_Fluid_Catalogue_v5_PRINT.pdf",
};

type Doc = { _id: string; _rev: string; slug?: string; ref?: string; name?: string };

async function upload(file: string): Promise<string> {
  if (!write) return `file-DRYRUN-${basename(file)}`;
  const asset = await client.assets.upload("file", createReadStream(file), {
    filename: basename(file),
    contentType: "application/pdf",
  });
  return asset._id;
}

async function attach(doc: Doc, file: string) {
  const label = doc._id;
  const ref = await upload(file);
  if (doc.ref === ref) {
    console.log(`  ${label}: already ${basename(file)}`);
    return;
  }
  console.log(`  ${label}: ${doc.name ?? "—"} → ${basename(file)}`);
  if (!write) return;
  const r = await client
    .patch(doc._id)
    .ifRevisionId(doc._rev)
    .set({ "catalogue.file": { _type: "file", asset: { _type: "reference", _ref: ref } } })
    .commit();
  console.log(`    rev ${r._rev}`);
}

const industries = await client.fetch<Doc[]>(
  `*[_type == "industry" && !(_id in path("versions.**"))]{ _id, _rev, "slug": slug.current, "ref": catalogue.file.asset._ref, "name": catalogue.file.asset->originalFilename }`,
);
console.log(`Industry pages${write ? "" : " — DRY RUN"}`);
for (const d of industries) {
  const book = BOOKS[d.slug ?? ""];
  if (!book) {
    console.log(`  ${d._id}: no book for "${d.slug}" — left as is`);
    continue;
  }
  const file = join(INDUSTRY, book);
  if (!existsSync(file)) throw new Error(`${book} not in ${INDUSTRY}`);
  await attach(d, file);
}

const hubs = await client.fetch<Doc[]>(
  `*[_type == "productsHub" && !(_id in path("versions.**"))]{ _id, _rev, "ref": catalogue.file.asset._ref, "name": catalogue.file.asset->originalFilename }`,
);
console.log("Products page");
for (const d of hubs) await attach(d, MASTER);
if (!write) console.log("Dry run. Re-run with --write.");
