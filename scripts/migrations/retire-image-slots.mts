/**
 * IMAGE SLOTS — the clean-up the split of 2026-09-15 left for later.
 *
 *   node scripts/migrations/retire-image-slots.mts [--write]
 *
 * Three things, all against src/content/images.ts and image-slot-labels.ts:
 *
 *   1. The retired slots (label title "Retired — …") come out. Every place
 *      they appeared has its own slot since the split; the script proves
 *      nothing in the dataset or the source still names them first.
 *   2. The six parts the SKU sheets moved keep their photograph under the
 *      key of their new slug (sku.<category>--<part>.photo), and the two
 *      folded duplicates' slots come out. The part documents are re-pointed.
 *   3. Every part slot's label reads the part's current name and page —
 *      the labels were written from the old site's names.
 *
 * Image files under public/ that no remaining slot uses are removed too.
 */

import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { client } from "../sheets/lib.mts";
import { REDIRECTS } from "../../src/content/redirects.ts";

const WRITE = process.argv.includes("--write");
const IMAGES = "src/content/images.ts";
const LABELS = "src/content/image-slot-labels.ts";
let images = readFileSync(IMAGES, "utf8");
let labels = readFileSync(LABELS, "utf8");

/** The text of one `"key": { … },` entry (two-space indented, closed by `  },`). */
const entry = (text: string, key: string) => {
  const re = new RegExp(`\\n  "${key.replace(/[.\-]/g, "\\$&")}": \\{[\\s\\S]*?\\n  \\},`);
  const m = text.match(re);
  return m ? m[0] : null;
};
const remove = (text: string, key: string) => {
  const e = entry(text, key);
  if (!e) throw new Error(`no entry "${key}"`);
  return text.replace(e, "");
};

/* ── 1. Retired slots ─────────────────────────────────────────────────── */
const retired = [...labels.matchAll(/"([a-z0-9.\-]+)":\s*\{\s*\n\s*title:\s*"Retired — /g)].map((m) => m[1]);

/* ── 2. Moved and folded parts ────────────────────────────────────────── */
const skuKey = (path: string) => `sku.${path.replace(/^\/products\//, "").replace("/", "--")}.photo`;
const skus = (await client.fetch(`*[_type == "sku"]{_id, "slug": slug.current, navLabel, category, "gallery": gallery{main, thumbs}}`)) as {
  _id: string;
  slug: string;
  navLabel: string;
  category: string;
  gallery?: { main?: string; thumbs?: string[] };
}[];
const renames: { from: string; to: string }[] = [];
const folded: string[] = [];
for (const r of REDIRECTS) {
  const from = skuKey(r.from);
  const to = skuKey(r.to);
  if (!entry(images, from)) continue; // already done, or never a part
  if (skus.some((s) => `sku.${s.slug}.photo` === to)) {
    // The survivor already has a slot of its own: this one is a duplicate's.
    if (entry(images, to)) folded.push(from);
    else renames.push({ from, to });
  } else renames.push({ from, to });
}

/* ── Prove the removals are safe ──────────────────────────────────────── */
const everything = JSON.stringify(await client.fetch(`*[]`));
const referenced = (key: string) => {
  const cms = everything.split(`"${key}"`).length - 1;
  const src = execSync(
    `/usr/bin/grep -rl --include='*.ts' --include='*.tsx' --include='*.mdx' -F '"${key}"' src | /usr/bin/grep -v 'content/images.ts\\|image-slot-labels.ts' || true`,
  )
    .toString()
    .trim();
  return cms || src ? `cms×${cms}${src ? ` src: ${src.replace(/\n/g, ", ")}` : ""}` : "";
};
let blocked = 0;
for (const k of [...retired, ...folded]) {
  const r = referenced(k);
  console.log(`  ${r ? "✗" : "ok"}  remove ${k}${r ? `  ← ${r}` : ""}`);
  if (r) blocked++;
}
for (const { from, to } of renames) console.log(`  →   rename ${from} → ${to}`);
if (blocked) {
  console.error(`\n${blocked} slot(s) still referenced — nothing written.`);
  process.exit(1);
}

/* ── Apply to the two registries ──────────────────────────────────────── */
const srcOf = (key: string) => entry(images, key)?.match(/src: "([^"]+)"/)?.[1];
const removedSrcs = new Set<string>();
for (const k of [...retired, ...folded]) {
  const s = srcOf(k);
  if (s) removedSrcs.add(s);
  images = remove(images, k);
  labels = remove(labels, k);
}
for (const { from, to } of renames) {
  images = images.replace(`"${from}": {`, `"${to}": {`);
  labels = labels.replace(`"${from}": {`, `"${to}": {`);
}
// A file only the removed slots used goes with them.
const orphaned = [...removedSrcs].filter((s) => !images.includes(`"${s}"`) && existsSync(`public${s}`));

/* ── 3. Part labels: the part's current name and page ─────────────────── */
let relabelled = 0;
for (const s of skus) {
  const key = `sku.${s.slug}.photo`;
  const e = entry(labels, key);
  if (!e) {
    console.warn(`  !   no label for ${key}`);
    continue;
  }
  const page = `/products/${s.category}/${s.slug.slice(s.slug.indexOf("--") + 2)}`;
  const next = e
    .replace(/title: "[^"]*"/, `title: ${JSON.stringify(`${s.navLabel} — product photo`)}`)
    .replace(/where: "[^"]*"/, `where: ${JSON.stringify(`The part page for ${s.navLabel}: the main gallery image and thumbnails 1 and 4.`)}`)
    .replace(/page: "[^"]*"/, `page: "${page}"`);
  if (next !== e) {
    labels = labels.replace(e, next);
    relabelled++;
  }
}

console.log(`\n${retired.length} retired + ${folded.length} folded slot(s) removed · ${renames.length} renamed · ${relabelled} part label(s) refreshed · ${orphaned.length} orphaned file(s)`);
if (!WRITE) {
  console.log("dry run — nothing written.");
  process.exit(0);
}

writeFileSync(IMAGES, images);
writeFileSync(LABELS, labels);
for (const s of orphaned) unlinkSync(`public${s}`);

// Re-point the moved parts' galleries.
for (const s of skus) {
  const g = s.gallery;
  if (!g) continue;
  const map = (k?: string) => renames.find((r) => r.from === k)?.to ?? k;
  const main = map(g.main);
  const thumbs = (g.thumbs ?? []).map((t) => map(t));
  if (main === g.main && thumbs.every((t, i) => t === g.thumbs?.[i])) continue;
  await client.patch(s._id).set({ "gallery.main": main, "gallery.thumbs": thumbs }).commit();
  console.log(`  ✓ ${s.slug}: gallery re-pointed`);
}
console.log("✓ written");
