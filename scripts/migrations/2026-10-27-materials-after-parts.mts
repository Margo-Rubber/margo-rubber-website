/**
 * MIGRATION — on every product page, put the Materials section directly
 * after "Parts in this category" (27 Oct 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-materials-after-parts.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-materials-after-parts.mts --write
 *
 * Only the order changes; no section's content is touched. Pages without
 * both sections are left as they are. Published AND draft documents.
 * Idempotent (a page already in that order is skipped), and every write uses
 * ifRevisionId, so a concurrent Studio edit makes it fail, not be overwritten.
 * To put a page back, drag the section in Studio, or restore it from the
 * document's History.
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

type Block = { _key: string; _type: string; heading?: string; [k: string]: unknown };
type Doc = { _id: string; _rev: string; slug?: { current?: string }; sections?: Block[] };

const PARTS = "block.partsGrid";
const MATERIALS = "block.materialCards";

/** Short readable label for a section in the printed order. */
const label = (b: Block) => {
  const t = b._type.replace(/^block\./, "");
  const h = typeof b.heading === "string" ? b.heading.replace(/\*/g, "").slice(0, 32) : "";
  return b._type === PARTS || b._type === MATERIALS ? `[${t}${h ? `: ${h}` : ""}]` : t;
};

const docs = await client.fetch<Doc[]>(
  `*[_type == "productCategory" && !(_id in path("versions.**"))]{ _id, _rev, slug, sections } | order(slug.current)`,
);
console.log(`${docs.length} product page document(s)${write ? "" : " — DRY RUN"}`);

let changed = 0;
for (const doc of docs) {
  const name = `/products/${doc.slug?.current ?? doc._id}${doc._id.startsWith("drafts.") ? " [draft]" : ""}`;
  const sections = [...(doc.sections ?? [])];
  const p = sections.findIndex((b) => b._type === PARTS);
  const m = sections.findIndex((b) => b._type === MATERIALS);

  if (p === -1 || m === -1) {
    console.log(`  · ${name} — no ${p === -1 ? "parts" : "materials"} section, left as is`);
    continue;
  }
  if (m === p + 1) {
    console.log(`  ✓ ${name} — already in order`);
    continue;
  }

  const [materials] = sections.splice(m, 1);
  sections.splice(sections.findIndex((b) => b._type === PARTS) + 1, 0, materials);

  changed++;
  console.log(`\n■ ${name}`);
  console.log(`    before: ${doc.sections!.map(label).join(" › ")}`);
  console.log(`    after:  ${sections.map(label).join(" › ")}`);
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set({ sections }).commit();
}

console.log(`\n${write ? "Reordered" : "Would reorder"} ${changed} document(s).`);
if (!write) console.log("Dry run. Re-run with --write to apply.");
