/**
 * MIGRATION — rubber mats: ribbed anti-slip mats dropped from the range
 * (client, 2 Nov 2026). Removes the product card and the word from the
 * intro list and the surface-pattern spec row, in the published document
 * and its draft.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-rubber-mats-drop-ribbed.mts [--write]
 *
 * Idempotent; each write uses ifRevisionId.
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

type Doc = {
  _id: string;
  _rev: string;
  intro?: string;
  sections: { _key: string; items?: { _key: string; name?: string }[]; rows?: { _key: string; cells: string[] }[] }[];
};

for (const id of ["productCategory-rubber-mats", "drafts.productCategory-rubber-mats"]) {
  const doc = await client.fetch<Doc | null>(`*[_id == $id][0]`, { id });
  if (!doc) {
    console.log(`${id}: not found — skipped.`);
    continue;
  }
  const patch = client.patch(id).ifRevisionId(doc._rev);
  const changes: string[] = [];

  const intro = doc.intro?.replace("mats, ribbed, checker, coin and diamond", "mats, checker, coin and diamond");
  if (intro && intro !== doc.intro) {
    patch.set({ intro });
    changes.push("intro");
  }
  for (const s of doc.sections) {
    for (const it of s.items ?? []) {
      if (it.name === "Ribbed anti-slip mats") {
        patch.unset([`sections[_key=="${s._key}"].items[_key=="${it._key}"]`]);
        changes.push(`card ${s._key}/${it._key}`);
      }
    }
    for (const r of s.rows ?? []) {
      const cell = r.cells[1]?.replace(/^Ribbed, checker,/, "Checker,");
      if (cell && cell !== r.cells[1]) {
        patch.set({ [`sections[_key=="${s._key}"].rows[_key=="${r._key}"].cells[1]`]: cell });
        changes.push(`spec row ${s._key}/${r._key}`);
      }
    }
  }

  if (!changes.length) {
    console.log(`${id}: already done — nothing to do.`);
    continue;
  }
  console.log(`${id}: ${changes.join(", ")}`);
  if (write) console.log(`  Patched → rev ${(await patch.commit())._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
