/**
 * MIGRATION — one phone number for every country (25 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-25-one-phone-number.mts [--write]
 *
 * Reverses 2026-11-19-india-contact.mts: +91 96655 79276 is shown to every
 * visitor, India included. Unsets settings.entity.india, which switches
 * RegionalContact off and drops the India contact point from the JSON-LD.
 * Undo: run the 19 Nov script.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN;
if (!token) throw new Error("SANITY_WRITE_TOKEN is not set — run with --env-file=.env.local");
const client = createClient({ projectId: "jyg2beas", dataset: "production", apiVersion: "2024-01-01", token, useCdn: false, perspective: "raw" });
const docs = await client.fetch(`*[_type == "siteSettings" && !(_id in path("versions.**"))]{ _id, _rev, entity }`);
if (!docs.length) throw new Error("no siteSettings document found");
for (const d of docs) {
  if (d.entity?.phone !== "+91 96655 79276" || d.entity?.whatsapp !== "+91 96655 79276") { console.log("CHECK BY HAND", d._id); continue; }
  if (!d.entity.india) { console.log(`${d._id}: already one number`); continue; }
  console.log(`${d._id}: entity.india ${JSON.stringify(d.entity.india)} → (removed)`);
  if (write) await client.patch(d._id).ifRevisionId(d._rev).unset(["entity.india"]).commit();
}
console.log(write ? "WRITTEN" : "Dry run. Add --write to apply.");
