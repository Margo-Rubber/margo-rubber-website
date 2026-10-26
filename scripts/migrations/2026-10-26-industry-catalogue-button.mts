/**
 * MIGRATION — industry hero button: "View Certifications" → "Download Catalogue"
 * (26 Oct 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-26-industry-catalogue-button.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-26-industry-catalogue-button.mts --write
 *
 * Every industry page now ends with its own catalogue section (id
 * "catalogue"), and the hero's second button scrolls to it. This script makes
 * the Sanity documents say so, so Studio shows what the site shows.
 *
 * For each industry document (published AND drafts), in "Hero buttons":
 *   · a button linking to /certifications or /products#catalogue, or labelled
 *     "…Certification…", becomes  Download Catalogue → #catalogue  (its style
 *     is kept);
 *   · if no button points at #catalogue after that, one is added as an
 *     outline button.
 *
 * Idempotent: a second run finds nothing to change. Each write uses
 * ifRevisionId, so a concurrent Studio edit makes it fail, not be overwritten.
 */
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

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

type Action = { _key?: string; _type?: string; label?: string; href?: string; variant?: string };
type Doc = { _id: string; _rev: string; slug?: { current?: string }; actions?: Action[] };

const LABEL = "Download Catalogue";
const HREF = "#catalogue";
const isOld = (a: Action) =>
  a.href === "/certifications" ||
  a.href === "/products#catalogue" ||
  /certific/i.test(a.label ?? "");

const docs = await client.fetch<Doc[]>(
  `*[_type == "industry" && !(_id in path("versions.**"))]{ _id, _rev, slug, actions }`,
);
console.log(`${docs.length} industry documents (published and drafts)${write ? "" : " — DRY RUN"}`);

let changed = 0;
for (const doc of docs) {
  const label = `${doc.slug?.current ?? doc._id}${doc._id.startsWith("drafts.") ? " [draft]" : ""}`;
  const before = doc.actions ?? [];

  let after = before.map((a) =>
    isOld(a) ? { ...a, label: LABEL, href: HREF, variant: a.variant ?? "secondary" } : a,
  );
  if (!after.some((a) => a.href === HREF)) {
    after = [...after, { _key: randomUUID().slice(0, 12), _type: "action", label: LABEL, href: HREF, variant: "secondary" }];
  }

  if (JSON.stringify(after) === JSON.stringify(before)) {
    console.log(`  ✓ ${label} — already done`);
    continue;
  }

  changed++;
  console.log(`\n■ ${label}  (${doc._id})`);
  for (const a of before) console.log(`    - ${a.label} → ${a.href}`);
  for (const a of after) console.log(`    + ${a.label} → ${a.href}`);
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set({ actions: after }).commit();
}

console.log(`\n${write ? "Updated" : "Would update"} ${changed} document(s).`);
if (!write) console.log("Dry run. Re-run with --write to apply.");
