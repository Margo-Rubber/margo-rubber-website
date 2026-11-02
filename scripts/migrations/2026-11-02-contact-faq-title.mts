/**
 * MIGRATION — contact page: the questions block gets a title (client,
 * 2 Nov 2026). Studio → Contact page → "Questions block — heading" was
 * empty, so the three questions rendered with no heading.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-contact-faq-title.mts [--write]
 *
 * Published AND draft documents. Leaves a heading someone has typed alone.
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

const docs = await client.fetch<{ _id: string; _rev: string; heading?: string }[]>(
  `*[_type == "contactPage" && !(_id in path("versions.**"))]{ _id, _rev, "heading": faqSection.heading }`,
);
for (const d of docs) {
  if (d.heading) {
    console.log(`${d._id}: already "${d.heading}"`);
    continue;
  }
  console.log(`${d._id}: set questions heading`);
  if (!write) continue;
  const r = await client
    .patch(d._id)
    .ifRevisionId(d._rev)
    .set({ faqSection: { eyebrow: "FREQUENTLY ASKED QUESTIONS", heading: "Before You Send an Enquiry" } })
    .commit();
  console.log(`  rev ${r._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
