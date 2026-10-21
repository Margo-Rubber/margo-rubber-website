/**
 * MIGRATION — developer to-do of 21 Oct 2026, content part (D3, D5, D9).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-21-todo-content.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-21-todo-content.mts --write
 *
 * Read the dry run before --write. It prints every change, old → new, and a
 * "Check by hand" list of anything the rules could not fix safely.
 *
 *  D3  ISO 9001 second pass. The certificate covers moulded components only.
 *      The 16 Oct pass caught "ISO 9001 … extruded"; this one catches the
 *      reverse order, "extruded … at our ISO 9001:2015 plant", live on 7
 *      pages (/export, /industries, /industries/construction,
 *      /industries/transport, /products, /products/extrusion,
 *      /products/sponge-foam-rubber). The ISO phrase leaves the sentence and
 *      a separate sentence follows it: "The moulded line is ISO 9001:2015
 *      certified."
 *  D5  The /about "Discover Our Story" button pointed at #story; the section
 *      is now #company-history (the id "story" made crawlers drop the page).
 *  D9  Legal pages: "use margorubber.in", "published on margorubber.in" and
 *      the like name the website, which is now www.margorubber.com. Email
 *      addresses (info@margorubber.in) are NOT touched — that mailbox stays.
 *      The /about "formerly margorubber.in" line is in code (AboutBlocks).
 *
 * Published documents AND drafts are patched, so an open draft cannot publish
 * the old text back. Each write uses ifRevisionId, so a concurrent Studio
 * edit makes it fail rather than be overwritten. Re-running is safe: every
 * rule only matches text it has not already fixed.
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

/* ── D3: ISO 9001 next to extrusion, either order ─────────────────────── */

const ISO_NEAR_EXTRUSION = /extrud[^.<]{0,120}?ISO 9001|ISO 9001(?::2015)?[^.<]{0,120}?extrud/i;
const ISO_SENTENCE = "The moulded line is ISO 9001:2015 certified.";

/** The ISO phrases found in those sentences, longest first. */
const ISO_PHRASES: [RegExp, string][] = [
  [/,? under an ISO 9001(?::2015)? quality system/i, ""],
  [/ under ISO 9001(?::2015)?(?=,)/i, ""],
  [/ under ISO 9001(?::2015)?/i, ""],
  [/ at (?:our|its) ISO 9001(?::2015)?(?: certified)? plant in Nashik/i, " in Nashik"],
  [/ at (?:our|its) ISO 9001(?::2015)?(?: certified)? plant/i, ""],
];

// Sentences end at . ! ? — or at ".**" when the sentence is bold Markdown.
const sentences = (s: string) => s.split(/(?<=[.!?](?:\*\*)?)\s+/);

function isoFix(s: string, where: string, manual: string[]): string {
  if (!ISO_NEAR_EXTRUSION.test(s)) return s;
  const out = sentences(s).map((p) => {
    if (!ISO_NEAR_EXTRUSION.test(p) || p.includes(ISO_SENTENCE)) return p;
    let q = p;
    for (const [rx, to] of ISO_PHRASES) q = q.replace(rx, to);
    q = q.replace(/\s{2,}/g, " ").replace(/\s+([,.;:])/g, "$1");
    if (q === p || ISO_NEAR_EXTRUSION.test(q)) {
      manual.push(`${where}: ISO next to extrusion, rewrite by hand: ${p}`);
      return p;
    }
    return `${q} ${ISO_SENTENCE}`;
  });
  return out.join(" ");
}

/* ── D5: the old #story anchor ─────────────────────────────────────────── */

const anchorFix = (s: string) =>
  s === "#story" ? "#company-history" : s === "/about#story" ? "/about#company-history" : s;

/* ── D9: the old domain named as the website, on legal pages ───────────── */

// "margorubber.in" or "www.margorubber.in" not preceded by "@" (an email) or
// a "/" or ":" (a URL being quoted, e.g. a redirect source).
const OLD_SITE = /(?<![@/:\w.])(?:www\.)?margorubber\.in\b(?![\w/])/g;
const legalFix = (s: string) => s.replace(OLD_SITE, "www.margorubber.com");

/* ── Walk every string ─────────────────────────────────────────────────── */

const SKIP_KEYS = new Set(["asset", "slug", "legacyUrl", "email", "url", "href", "src"]);

function walk(
  value: unknown,
  path: string,
  set: Record<string, unknown>,
  label: string,
  isLegal: boolean,
  manual: string[],
) {
  if (typeof value === "string") {
    const key = path.split(".").pop()?.replace(/\[.*$/, "") ?? "";
    let next = anchorFix(value);
    if (next === value && !SKIP_KEYS.has(key)) {
      next = isoFix(value, `${label} ${path}`, manual);
      if (isLegal) next = legalFix(next);
    }
    if (next !== value) set[path] = next;
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => {
      const key = v && typeof v === "object" && "_key" in v ? `[_key=="${(v as { _key: string })._key}"]` : `[${i}]`;
      walk(v, `${path}${key}`, set, label, isLegal, manual);
    });
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("_") || k === "asset" || k === "slug") continue;
      walk(v, path ? `${path}.${k}` : k, set, label, isLegal, manual);
    }
  }
}

const docs = await client.fetch<Doc[]>(
  `*[!(_type match "sanity.*") && !(_type match "system.*") && !(_id in path("versions.**"))]`,
);
console.log(`${docs.length} documents (published and drafts)${write ? "" : " — DRY RUN"}`);

const manual: string[] = [];
let changes = 0;

for (const doc of docs) {
  const label = `${doc._type} ${doc.slug?.current ?? doc._id}${doc._id.startsWith("drafts.") ? " [draft]" : ""}`;
  const set: Record<string, unknown> = {};
  walk(doc, "", set, label, doc._type === "legal", manual);
  const entries = Object.entries(set);
  if (!entries.length) continue;
  console.log(`\n■ ${label}  (${doc._id})`);
  for (const [p, v] of entries) console.log(`  ${p}\n    + ${typeof v === "string" ? v : JSON.stringify(v)}`);
  changes += entries.length;
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit();
}

console.log(`\n${write ? "Wrote" : "Would change"} ${changes} field(s).`);
if (manual.length) {
  console.log("\nCheck by hand:");
  for (const m of [...new Set(manual)]) console.log(`  · ${m}`);
}
if (!write) console.log("\nDry run. Re-run with --write to apply.");
