/**
 * MIGRATION — internal notes left in live copy (SEO audit, 21 Oct 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-21-editorial-notes.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-21-editorial-notes.mts --write
 *
 * The four oil-seal parts (EPDM, FKM, NBR, silicone) show editorial notes in
 * their manufacturing-process steps, e.g.
 *   "Margo does rubber-to-metal bonding in-house (client-confirmed)."
 *   "Pending the assembly question."
 *
 * This script, across every document (published AND drafts):
 *   · removes the "(client-confirmed)" marker and similar parentheticals;
 *   · removes whole sentences that are notes: "Pending the …", "TBC …",
 *     "To be confirmed …";
 *   · collapses a word repeated with "&" ("Silicone & Silicone & Silicone &
 *     Rubber…" → "Silicone & Rubber…") — the 16 Oct script added "Silicone &"
 *     to the medical H1 on every run;
 *   · LISTS, without changing, every sentence that says the rubber is bonded
 *     to a metal case or that a garter spring is fitted. Whether Margo makes
 *     metal-cased seals is Mehboob's to confirm; rewrite those by hand after.
 *
 * Idempotent: a second run finds nothing to change. Each write uses
 * ifRevisionId, so a concurrent Studio edit makes it fail, not be overwritten.
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

type Doc = { _id: string; _rev: string; _type: string; slug?: { current?: string }; [k: string]: unknown };

const MARKER = /\s*\((?:client[- ]confirmed|to confirm|confirm|tbc|pending[^)]*)\)/gi;
const NOTE_SENTENCE = /^(?:Pending the\b|Pending:|TBC\b|To be confirmed\b)[^.!?]*[.!?]?$/i;
const FOR_MEHBOOB = /metal case|bonded to the case|garter spring/i;

const sentences = (s: string) => s.split(/(?<=[.!?])\s+/);
const REPEAT = /\b(\w+) & (?:\1 & )+/g;

function clean(s: string): string {
  s = s.replace(REPEAT, "$1 & ");
  if (!MARKER.test(s) && !sentences(s).some((p) => NOTE_SENTENCE.test(p.trim()))) return s;
  MARKER.lastIndex = 0;
  return sentences(s.replace(MARKER, ""))
    .filter((p) => !NOTE_SENTENCE.test(p.trim()))
    .join(" ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const review: string[] = [];
let changes = 0;

function walk(value: unknown, path: string, set: Record<string, unknown>, label: string) {
  if (typeof value === "string") {
    const next = clean(value);
    if (next !== value) set[path] = next;
    for (const p of sentences(next)) if (FOR_MEHBOOB.test(p)) review.push(`${label} ${path}: ${p}`);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => {
      const key = v && typeof v === "object" && "_key" in v ? `[_key=="${(v as { _key: string })._key}"]` : `[${i}]`;
      walk(v, `${path}${key}`, set, label);
    });
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("_") || k === "asset" || k === "slug") continue;
      walk(v, path ? `${path}.${k}` : k, set, label);
    }
  }
}

const docs = await client.fetch<Doc[]>(
  `*[!(_type match "sanity.*") && !(_type match "system.*") && !(_id in path("versions.**"))]`,
);
console.log(`${docs.length} documents (published and drafts)${write ? "" : " — DRY RUN"}`);

for (const doc of docs) {
  if (doc._type === "industry" && doc.slug?.current === "medical-devices")
    console.log(`medical-devices H1 now${doc._id.startsWith("drafts.") ? " [draft]" : ""}:`, JSON.stringify(doc.h1Lines ?? doc.h1));
  const label = `${doc._type} ${doc.slug?.current ?? doc._id}${doc._id.startsWith("drafts.") ? " [draft]" : ""}`;
  const set: Record<string, unknown> = {};
  walk(doc, "", set, label);
  const entries = Object.entries(set);
  if (!entries.length) continue;
  console.log(`\n■ ${label}  (${doc._id})`);
  for (const [p, v] of entries) console.log(`  ${p}\n    + ${v}`);
  changes += entries.length;
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit();
}

console.log(`\n${write ? "Wrote" : "Would change"} ${changes} field(s).`);
if (review.length) {
  console.log("\nFor Mehboob — metal-case / spring claims, NOT changed (rewrite by hand once confirmed):");
  for (const r of [...new Set(review)]) console.log(`  · ${r}`);
}
if (!write) console.log("\nDry run. Re-run with --write to apply.");
