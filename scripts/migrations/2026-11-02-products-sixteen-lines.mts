/**
 * MIGRATION — /products: fifteen product lines become sixteen (Rubber Mats).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-products-sixteen-lines.mts [--write]
 *
 * Knock-on edits C01–C09 and P01 of the 29 Oct release pack: title, meta
 * description, H1 third line, intro, hero stat, catalogue heading and
 * sentence, installed-capacity tile, drawing FAQ, and the industries intro
 * ("The sixteen lines serve thirteen sectors."). C03, the share-image alt,
 * is in src/app/(site)/products/opengraph-image.tsx.
 *
 * Exact-string swaps over every string in the products hub document, plus
 * the two stat tiles whose number is the line count. Published AND draft
 * documents. Idempotent; ifRevisionId on every write.
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

const SWAPS: [RegExp, string][] = [
  [/India: 15 Lines \| Margo/g, "India: 16 Lines | Margo"],
  [/Fifteen custom rubber component lines (.*?)AV mounts\./g, "Sixteen custom rubber component lines $1AV mounts, mats."],
  [/\bFifteen Product Lines\b/g, "Sixteen Product Lines"],
  [/extrudes fifteen lines\b/g, "extrudes sixteen lines"],
  [/\bFifteen Rubber Component Lines\b/g, "Sixteen Rubber Component Lines"],
  [/\btwelve moulded, one continuous/g, "thirteen moulded, one continuous"],
  [/\b12 moulded · 1 extruded/g, "13 moulded · 1 extruded"],
  [/on every one of the 15 product lines/g, "on every one of the 16 product lines"],
  [/The fifteen lines serve (?:eleven|thirteen) sectors\./g, "The sixteen lines serve thirteen sectors."],
];

/** A stat tile whose number is the line count: label mentions product lines. */
const isLineStat = (o: Record<string, unknown>) =>
  Object.values(o).some((v) => typeof v === "string" && /product lines/i.test(v));

type Change = { path: string; from: unknown; to: unknown };

function collect(v: unknown, path: string, out: Change[]) {
  if (Array.isArray(v)) {
    v.forEach((x, i) => {
      const key = (x as { _key?: string })?._key;
      collect(x, key ? `${path}[_key=="${key}"]` : `${path}[${i}]`, out);
    });
    return;
  }
  if (!v || typeof v !== "object") return;
  const o = v as Record<string, unknown>;
  for (const [k, x] of Object.entries(o)) {
    if (k.startsWith("_")) continue;
    const p = path ? `${path}.${k}` : k;
    if (typeof x === "string") {
      let next = x;
      for (const [re, to] of SWAPS) next = next.replace(re, to);
      if (isLineStat(o) && /^\s*15\s*\+?\s*$/.test(x)) next = x.replace("15", "16");
      if (next !== x) out.push({ path: p, from: x, to: next });
    } else if (typeof x === "number") {
      if (x === 15 && isLineStat(o)) out.push({ path: p, from: x, to: 16 });
    } else {
      collect(x, p, out);
    }
  }
}

const docs = await client.fetch<Record<string, unknown>[]>(
  `*[_type == "productsHub" && !(_id in path("versions.**"))]`,
);
if (!docs.length) throw new Error("No productsHub document found");

for (const d of docs) {
  const changes: Change[] = [];
  collect(d, "", changes);
  if (!changes.length) {
    console.log(`${d._id}: no change`);
    continue;
  }
  console.log(`${d._id}: ${changes.length} change(s)`);
  for (const c of changes) console.log(`  ${c.path}\n    - ${JSON.stringify(c.from)}\n    + ${JSON.stringify(c.to)}`);
  if (!write) continue;
  const set = Object.fromEntries(changes.map((c) => [c.path, c.to]));
  const r = await client.patch(d._id as string).ifRevisionId(d._rev as string).set(set).commit();
  console.log(`  rev ${r._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
