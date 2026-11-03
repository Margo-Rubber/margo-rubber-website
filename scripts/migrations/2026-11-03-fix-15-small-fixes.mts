/**
 * MIGRATION — 3rd Shade fix 15, the parts that need no further input
 * (3 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-03-fix-15-small-fixes.mts [--write]
 *
 *   · Footer legal links: + Export Compliance (/legal/export-compliance),
 *     after Disclaimer.
 *   · /products H1: "Fifteen Product Lines." → "Sixteen Product Lines." The
 *     title, the stat, the catalogue heading and the sectors copy already
 *     say 16 — the route registry lists sixteen lines (Rubber Mats is the
 *     sixteenth).
 *   · Home <title>: "Rubber Parts & Components Manufacturer, Exporter India |
 *     Margo" (62 characters) → "Rubber Parts Manufacturer & Exporter, India
 *     | Margo" (51).
 *
 * Not here, waiting on 3rd Shade: the new titles for gaskets/epdm,
 * oil-seals/fkm and oil-seals/nbr.
 *
 * Published AND draft documents. Idempotent; ifRevisionId on every write.
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

const HOME_TITLE = "Rubber Parts Manufacturer & Exporter, India | Margo";
if (HOME_TITLE.length >= 60) throw new Error("home title is not under 60 characters");

type Doc = { _id: string; _rev: string; [k: string]: unknown };
const notVersion = '!(_id in path("versions.**"))';

async function patch(d: Doc, set: Record<string, unknown>, insert?: { at: string; items: unknown[] }) {
  if (!Object.keys(set).length && !insert) {
    console.log(`  ${d._id}: no change`);
    return;
  }
  console.log(`  ${d._id}: ${[...Object.keys(set), ...(insert ? ["+ legal link"] : [])].join(", ")}`);
  if (!write) return;
  let p = client.patch(d._id).ifRevisionId(d._rev);
  if (Object.keys(set).length) p = p.set(set);
  if (insert) p = p.insert("after", insert.at, insert.items);
  const r = await p.commit();
  console.log(`    rev ${r._rev}`);
}

console.log(`Footer${write ? "" : " — DRY RUN"}`);
for (const d of await client.fetch<(Doc & { legal?: { href: string }[] })[]>(
  `*[_type == "siteFooter" && ${notVersion}]{ _id, _rev, legal }`,
)) {
  const has = (d.legal ?? []).some((l) => l.href === "/legal/export-compliance");
  await patch(
    d,
    {},
    has
      ? undefined
      : { at: "legal[-1]", items: [{ _key: "footer_legal_export", href: "/legal/export-compliance", label: "Export Compliance" }] },
  );
}

console.log("Products page");
for (const d of await client.fetch<(Doc & { h1Lines?: string[] })[]>(
  `*[_type == "productsHub" && ${notVersion}]{ _id, _rev, h1Lines }`,
)) {
  const i = (d.h1Lines ?? []).findIndex((l) => /^Fifteen Product Lines/.test(l));
  await patch(d, i < 0 ? {} : { [`h1Lines[${i}]`]: "Sixteen Product Lines." });
}

console.log("Home page");
for (const d of await client.fetch<(Doc & { title?: string })[]>(
  `*[_type == "homePage" && ${notVersion}]{ _id, _rev, "title": seo.title }`,
)) {
  await patch(d, d.title === HOME_TITLE ? {} : { "seo.title": HOME_TITLE });
}
if (!write) console.log("Dry run. Re-run with --write.");
