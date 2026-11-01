/**
 * MIGRATION — products page certifications heading: held certifications only.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/migrations/2026-11-01-products-certifications-held-only.mts [--write]
 *
 * The section now lists only what is held (ISO 9001:2015), so the heading
 * "What We Hold, and What We Do Not" becomes "What We Hold" and the lede about
 * stating each status on the badge is removed (client instruction, 1 Nov 2026).
 * Content-only and schema-safe (heading stays ≥ 4 chars, body is optional), so
 * it can run before or after deploy.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN;
if (write && !token) throw new Error("SANITY_WRITE_TOKEN is not set — run with --env-file=.env.local");

const client = createClient({
  projectId: "jyg2beas",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

const ID = "productsHub-products";
const current = await client.fetch<{ heading?: string; body?: string } | null>(
  `*[_id == $id][0].certifications{heading, body}`,
  { id: ID },
);
if (!current) throw new Error(`${ID} has no certifications section`);
console.log(`${ID} certifications: heading ${JSON.stringify(current.heading)}; body ${current.body ? "present" : "absent"}`);
console.log(`Will set heading "What We Hold" and remove body.`);

if (!write) {
  console.log("Dry run. Re-run with --write.");
  process.exit(0);
}

const result = await client
  .patch(ID)
  .set({ "certifications.heading": "What We Hold" })
  .unset(["certifications.body"])
  .commit();
console.log(`Patched ${result._id} rev ${result._rev}`);
