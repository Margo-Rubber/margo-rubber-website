/**
 * MIGRATION — client review, 2 Nov 2026.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-self-adhesive-profiles-to-sponge.mts [--write]
 *
 *   · "Self-adhesive profiles" (catalogue EX-19, card 28 on Extrusion
 *     Profiles) moves to the Sponge & Foam Rubber parts grid, last, under
 *     the sponge page's "Strip, cord & profiles" family. Same name,
 *     description and photo.
 *   · Sponge & Foam Rubber: "Closed Cell vs Open Cell" goes first, above
 *     the parts grid.
 * Sanity transaction with ifRevisionId on both documents, so the card is
 * never on both pages or neither. Idempotent.
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

const KEY = "cat-ex-19";
type Section = { _key: string; _type: string; items?: { _key: string; [k: string]: unknown }[] };
type Doc = { _id: string; _rev: string; sections: Section[] };

const [ext, foam] = await Promise.all(
  ["productCategory-extrusion", "productCategory-sponge-foam-rubber"].map((id) =>
    client.fetch<Doc>(`*[_id == $id][0]{ _id, _rev, sections }`, { id }),
  ),
);

const extGrid = ext.sections.find((s) => s._type === "block.partsGrid")!;
const foamGrid = foam.sections.find((s) => s._type === "block.partsGrid")!;
const card = extGrid.items?.find((i) => i._key === KEY);
const onFoam = foamGrid.items?.some((i) => i._key === KEY);

const tx = client.transaction();
let changes = 0;

if (card || !onFoam) {
  if (!card && !onFoam) throw new Error(`${KEY} is on neither page`);
  if (card) {
    console.log(`extrusion: remove ${KEY} "${card.name}"`);
    tx.patch(client.patch(ext._id).ifRevisionId(ext._rev).unset([`sections[_key=="${extGrid._key}"].items[_key=="${KEY}"]`]));
    changes++;
  }
}

let sections = foam.sections;
if (card && !onFoam) {
  sections = sections.map((s) =>
    s._key === foamGrid._key ? { ...s, items: [...(s.items ?? []), { ...card, availability: "Strip, cord & profiles" }] } : s,
  );
  console.log(`sponge: add ${KEY} as card ${(foamGrid.items?.length ?? 0) + 1}`);
}
const cmp = sections.find((s) => s._key === "compareSection");
if (cmp && sections[0]._key !== "compareSection") {
  sections = [cmp, ...sections.filter((s) => s._key !== "compareSection")];
  console.log("sponge: Closed Cell vs Open Cell to the top");
}
if (JSON.stringify(sections) !== JSON.stringify(foam.sections)) {
  tx.patch(client.patch(foam._id).ifRevisionId(foam._rev).set({ sections }));
  changes++;
}

if (!changes) {
  console.log("Nothing to change.");
  process.exit(0);
}
if (!write) {
  console.log("Dry run. Re-run with --write.");
  process.exit(0);
}
const r = await tx.commit();
console.log(`Committed ${r.transactionId}`);
