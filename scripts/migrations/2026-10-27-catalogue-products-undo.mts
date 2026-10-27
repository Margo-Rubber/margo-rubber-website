/**
 * UNDO for 2026-10-27-catalogue-products.mts — takes the catalogue cards off
 * every product page again.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-catalogue-products-undo.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-catalogue-products-undo.mts --write
 *
 * Per product page (published AND draft), in "Parts in this category":
 *   · removes every card the import added (keys "cat-…");
 *   · if what is left is only the linked parts the import copied in (keys
 *     "anchor-…"), clears the list, so the page shows its original linked
 *     cards again;
 *   · removes a section the import created (key "partsGrid-…") once empty;
 *   · puts an "N parts we make to order" heading back to the right N.
 * Cards added by hand in Studio are never touched. Uploaded photos stay in
 * the media library (unused), so re-running the import is quick.
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

type Item = { _key: string };
type Block = { _key: string; _type: string; heading?: string; items?: Item[]; [k: string]: unknown };
type Doc = { _id: string; _rev: string; slug?: { current?: string }; anchors?: unknown[]; sections?: Block[] };

const docs = await client.fetch<Doc[]>(
  `*[_type == "productCategory" && !(_id in path("versions.**"))]{ _id, _rev, slug, anchors, sections }`,
);
console.log(`${docs.length} product pages${write ? "" : " — DRY RUN"}`);

let changed = 0;
for (const doc of docs) {
  const label = `/products/${doc.slug?.current ?? doc._id}${doc._id.startsWith("drafts.") ? " [draft]" : ""}`;
  const before = JSON.stringify(doc.sections ?? []);
  let removed = 0;

  const sections = (doc.sections ?? []).flatMap((b): Block[] => {
    if (b._type !== "block.partsGrid" || !b.items) return [b];
    let items = b.items.filter((x) => !x._key.startsWith("cat-"));
    removed += b.items.length - items.length;
    if (items.length > 0 && items.every((x) => x._key.startsWith("anchor-"))) items = [];
    if (items.length === 0 && b._key.startsWith("partsGrid-")) return []; // the import made this section
    // An empty list is dropped rather than stored, as before the import.
    const next: Block = { ...b, items };
    if (items.length === 0) delete next.items;
    if (typeof next.heading === "string" && /^\d+ parts\b/.test(next.heading)) {
      const n = items.length || (doc.anchors?.length ?? 0);
      next.heading = next.heading.replace(/^\d+/, String(n));
    }
    return [next];
  });

  if (JSON.stringify(sections) === before) continue;
  changed++;
  console.log(`■ ${label} — ${removed} catalogue card(s) removed`);
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set({ sections }).commit();
}

console.log(`\n${write ? "Reverted" : "Would revert"} ${changed} document(s).`);
if (!write) console.log("Dry run. Re-run with --write to apply.");
