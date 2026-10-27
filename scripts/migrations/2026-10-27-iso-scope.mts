/**
 * MIGRATION — developer to-do of 25 Oct 2026, N2: ISO 9001 wording, last spots.
 *
 *   node --experimental-strip-types scripts/migrations/2026-10-27-iso-scope.mts           (dry run, no token needed)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-iso-scope.mts --write
 *
 * The certificate covers moulded components only. Google's AI answer merged
 * these lines into "ISO 9001:2015 certified manufacturer of custom-moulded and
 * extruded" parts. Each fix below is the to-do's own wording:
 *
 *   · home hero badge  "… ISO 9001:2015 CERTIFIED" → "… ISO 9001:2015 (MOULDED PARTS)"
 *   · the search descriptions that end "…extruded … in Nashik, India. ISO 9001:2015."
 *     → "… ISO 9001:2015 for moulded components." — /industries/construction
 *     and /industries/transport (named in the to-do; llms.txt is built from
 *     them) and /products (same pattern, found 27 Oct).
 *
 * The home FAQ answer and the category hero fallback badge are in code
 * (src/content/answer-blocks.ts, src/app/(site)/products/[category]/page.tsx).
 *
 * Exact replacements only: a field whose text is no longer the old wording is
 * reported and left alone, so a Studio edit made since 27 Oct is never
 * overwritten. Drafts are patched too when a token is set, so an open draft
 * cannot publish the old text back. Each write uses ifRevisionId.
 *
 * NOT touched (D11, waiting on Margo): /products FAQ 7 — "with extension to
 * the extruded and cellular lines in hand" and the IATF date.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN;
if (write && !token) throw new Error("SANITY_WRITE_TOKEN is not set — run with --env-file=.env.local");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "jyg2beas",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  // Drafts are only visible with a token; without one the dry run checks the
  // published documents alone.
  perspective: token ? "raw" : "published",
});

type Fix = { id: string; path: string; from: string; to: string };

const SEO_DESCRIPTION_MAX = 220;

const ISO_END =[" ISO 9001:2015.", " ISO 9001:2015 for moulded components."] as const;

const FIXES: Fix[] = [
  {
    id: "homePage-home",
    path: "hero.eyebrow",
    from: "SINCE 2005 · NASHIK, INDIA · ISO 9001:2015 CERTIFIED",
    to: "SINCE 2005 · NASHIK, INDIA · ISO 9001:2015 (MOULDED PARTS)",
  },
  // Construction and transport: the to-do's ending alone would take them past
  // the 220-character cap, so each loses a few words of its own text (no new
  // facts) — "facade" and "your" (218), and "builders" (217). Approved 27 Oct.
  {
    id: "industry-construction",
    path: "seo.description",
    from: "EPDM glazing gaskets, facade expansion joint seals, weatherseal profiles and plant isolation mounts for construction and infrastructure — extruded and moulded to your drawing in Nashik, India." + ISO_END[0],
    to: "EPDM glazing gaskets, expansion joint seals, weatherseal profiles and plant isolation mounts for construction and infrastructure — extruded and moulded to drawing in Nashik, India." + ISO_END[1],
  },
  {
    id: "industry-transport",
    path: "seo.description",
    from: "EPDM window and door seals, hatch and porthole gaskets, acoustic foam and vibration mounts for rolling stock builders and shipyards — moulded and extruded to your drawing in Nashik, India." + ISO_END[0],
    to: "EPDM window and door seals, hatch and porthole gaskets, acoustic foam and vibration mounts for rolling stock and shipyards — moulded and extruded to your drawing in Nashik, India." + ISO_END[1],
  },
  {
    id: "productsHub-products",
    path: "seo.description",
    from: "Fifteen custom rubber component lines moulded and extruded to your drawing in Nashik, India: O-rings, oil seals, gaskets, AV mounts." + ISO_END[0],
    to: "Fifteen custom rubber component lines moulded and extruded to your drawing in Nashik, India: O-rings, oil seals, gaskets, AV mounts." + ISO_END[1],
  },
];

const get = (doc: unknown, path: string) =>
  path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), doc);

const ids = [...new Set(FIXES.map((f) => f.id))];
const docs = await client.fetch<{ _id: string; _rev: string }[]>(`*[_id in $ids]`, {
  ids: [...ids, ...ids.map((id) => `drafts.${id}`)],
});
console.log(`${docs.length} document(s)${token ? " (published and drafts)" : " (published only — no token)"}${write ? "" : " — DRY RUN"}`);

const manual: string[] = [];
let changes = 0;

for (const doc of docs) {
  const set: Record<string, string> = {};
  for (const f of FIXES.filter((x) => doc._id === x.id || doc._id === `drafts.${x.id}`)) {
    const now = get(doc, f.path);
    if (now === f.to) continue; // already fixed
    if (now !== f.from) {
      manual.push(`${doc._id} ${f.path}: text has changed since 27 Oct, fix by hand: ${JSON.stringify(now)}`);
      continue;
    }
    // The Studio's own cap (sanity/schemaTypes/objects.ts). The API would
    // accept a longer value, and the Studio would then refuse to publish the
    // document until someone shortened it.
    if (f.path === "seo.description" && f.to.length > SEO_DESCRIPTION_MAX) {
      console.log(`\n■ ${doc._id}  — NOT WRITTEN: ${f.to.length} characters, the Studio allows ${SEO_DESCRIPTION_MAX}`);
      console.log(`  ${f.path}\n    - ${f.from}\n    + ${f.to}`);
      manual.push(`${doc._id} ${f.path}: new text is ${f.to.length} characters (max ${SEO_DESCRIPTION_MAX}); needs a shorter wording`);
      continue;
    }
    set[f.path] = f.to;
  }
  const entries = Object.entries(set);
  if (!entries.length) continue;
  console.log(`\n■ ${doc._id}`);
  for (const [p, v] of entries) {
    console.log(`  ${p}\n    - ${get(doc, p)}\n    + ${v}`);
  }
  changes += entries.length;
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit();
}

const missing = ids.filter((id) => !docs.some((d) => d._id === id));
for (const id of missing) manual.push(`${id}: document not found`);

console.log(`\n${write ? "Wrote" : "Would change"} ${changes} field(s).`);
if (manual.length) {
  console.log("\nCheck by hand:");
  for (const m of manual) console.log(`  · ${m}`);
}
if (!write) console.log("\nDry run. Re-run with --write to apply.");
