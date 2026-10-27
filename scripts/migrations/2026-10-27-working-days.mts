/**
 * MIGRATION — working days Mon–Sat → Sun–Fri, and the plant's coordinates
 * (27 Oct 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-working-days.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-working-days.mts --write
 *
 * Site settings → Company & contact:
 *   · "Hours, as displayed"          Mon–Sat → Sun–Fri (times kept as they are)
 *   · "Hours, for search engines"    days → Sunday … Friday (Saturday closed)
 *
 *   · "Plant coordinates"            → 19.935449556805665, 73.73311970828622
 *                                      (confirmed by Margo; the Google listing's
 *                                      pin is ~400 m south)
 *
 * The displayed hours appear on the Contact page; the days and coordinates
 * feed the structured data Google reads.
 *
 * Published AND draft settings. Idempotent. ifRevisionId on every write.
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

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const GEO = { lat: 19.935449556805665, lng: 73.73311970828622 };

type Doc = {
  _id: string;
  _rev: string;
  entity?: { hours?: string; hoursSchema?: { days?: string[] }; geo?: { lat?: number; lng?: number } };
};
const docs = await client.fetch<Doc[]>(
  `*[_type == "siteSettings" && !(_id in path("versions.**"))]{ _id, _rev, entity }`,
);
console.log(`${docs.length} settings document(s)${write ? "" : " — DRY RUN"}`);

let changed = 0;
for (const doc of docs) {
  const label = doc._id.startsWith("drafts.") ? `${doc._id} [draft]` : doc._id;
  const set: Record<string, unknown> = {};

  const hours = doc.entity?.hours;
  if (hours) {
    const next = hours.replace(/Mon(?:day)?\s*[–-]\s*Sat(?:urday)?/i, "Sun–Fri");
    if (next !== hours) set["entity.hours"] = next;
  }
  if (JSON.stringify(doc.entity?.hoursSchema?.days ?? []) !== JSON.stringify(DAYS)) {
    set["entity.hoursSchema.days"] = DAYS;
  }

  if (doc.entity?.geo?.lat !== GEO.lat || doc.entity?.geo?.lng !== GEO.lng) {
    set["entity.geo.lat"] = GEO.lat;
    set["entity.geo.lng"] = GEO.lng;
  }

  if (!Object.keys(set).length) {
    console.log(`  ✓ ${label} — already up to date`);
    continue;
  }
  changed++;
  console.log(`\n■ ${label}`);
  console.log(`    hours: ${hours ?? "(empty)"}  →  ${set["entity.hours"] ?? "(unchanged)"}`);
  console.log(`    days:  ${(doc.entity?.hoursSchema?.days ?? []).join(", ") || "(empty)"}  →  ${DAYS.join(", ")}`);
  console.log(`    geo:   ${doc.entity?.geo?.lat}, ${doc.entity?.geo?.lng}  →  ${GEO.lat}, ${GEO.lng}`);
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit();
}

console.log(`\n${write ? "Updated" : "Would update"} ${changed} document(s).`);
if (!write) console.log("Dry run. Re-run with --write to apply.");
