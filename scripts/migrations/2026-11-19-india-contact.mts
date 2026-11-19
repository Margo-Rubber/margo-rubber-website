/**
 * MIGRATION — the India contact number (19 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-19-india-contact.mts [--write]
 *
 * Visitors in India see +91 95799 54288 (phone and WhatsApp); everyone else
 * keeps the export number, +91 96655 79276. Sets settings.entity.india on the
 * published Site settings document and its draft, if one exists.
 *
 * Idempotent; ifRevisionId on every write. Dry run without --write.
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

const INDIA = { phone: "+91 95799 54288", whatsapp: "+91 95799 54288" };

const docs: { _id: string; _rev: string; entity?: { phone?: string; india?: typeof INDIA } }[] =
  await client.fetch(
    `*[_type == "siteSettings" && !(_id in path("versions.**"))]{ _id, _rev, entity }`,
  );
if (!docs.length) throw new Error("no siteSettings document found");

for (const d of docs) {
  const now = d.entity?.india;
  if (now?.phone === INDIA.phone && now?.whatsapp === INDIA.whatsapp) {
    console.log(`${d._id}: already set`);
    continue;
  }
  console.log(`${d._id}: entity.india ${JSON.stringify(now ?? null)} → ${JSON.stringify(INDIA)} (export phone stays ${d.entity?.phone})`);
  if (write) {
    await client.patch(d._id).ifRevisionId(d._rev).set({ "entity.india": INDIA }).commit();
    console.log("  written");
  }
}
if (!write) console.log("\nDry run. Add --write to apply.");
