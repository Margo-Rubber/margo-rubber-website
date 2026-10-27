/**
 * MIGRATION — 133 Master Catalogue products onto their product pages
 * (27 Oct 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-catalogue-products.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-catalogue-products.mts --write
 *
 * BEFORE RUNNING: download the Drive folder "08 Catalogue products missing
 * from website (images per product page)" as a zip and extract it into
 * /catalogue-images at the root of this repo (git ignores it). Sub-folder
 * names do not matter — photos are found by file name, e.g. EX-01_e-section-
 * profiles.jpg. Another location: --images "C:\path\to\folder".
 *
 * RUN ONLY AFTER THE SITE WITH THE "One-line description" FIELD IS DEPLOYED
 * (src/content/blocks.ts accepts it; older code would ignore it, harmlessly).
 *
 * What it does, per product page (published AND draft documents):
 *   · finds the "Parts in this category" section (block.partsGrid); adds one
 *     before the page's last section if the page has none;
 *   · if that section shows linked part cards (from Search & links → Parts in
 *     this category) and has no plain list yet, first copies those parts into
 *     the list WITH their links — filling the list replaces the linked cards,
 *     so without this they would vanish;
 *   · appends each catalogue product as a card: name, family, one-line
 *     description and photo (uploaded to Sanity once, reused by drafts);
 *   · updates a heading of the form "N parts we make to order" to the new N.
 *
 * Data: scripts/data/catalogue-products-2026-10-27.json (from the catalogue
 * cross-check page). Idempotent — each card's key is its catalogue code
 * (cat-ex-01 …), so a second run adds nothing. Every write uses ifRevisionId:
 * a concurrent Studio edit makes it fail rather than be overwritten.
 */
import { createClient } from "@sanity/client";
import { readFile, readdir } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { randomUUID } from "node:crypto";

const write = process.argv.includes("--write");
const imgArg = process.argv.indexOf("--images");
const IMAGES = imgArg > -1 ? process.argv[imgArg + 1] : "catalogue-images";

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

type Product = { page: string; code: string; name: string; family: string; description: string; image: string };
type Item = {
  _key: string;
  _type?: string;
  name: string;
  availability?: string;
  description?: string;
  href?: string;
  image?: { _type: "image"; asset: { _type: "reference"; _ref: string }; alt?: string };
};
type Block = { _key: string; _type: string; heading?: string; items?: Item[]; [k: string]: unknown };
type Doc = {
  _id: string;
  _rev: string;
  navLabel?: string;
  slug?: { current?: string };
  anchors?: { id: string; label: string }[];
  sections?: Block[];
};

const { products } = JSON.parse(
  await readFile("scripts/data/catalogue-products-2026-10-27.json", "utf8"),
) as { products: Product[] };

// ── Photos: index every file under the folder by name ──────────────────────
async function indexFiles(dir: string, map = new Map<string, string>()) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await indexFiles(p, map);
    else map.set(e.name.toLowerCase(), p);
  }
  return map;
}
if (!existsSync(IMAGES)) {
  throw new Error(`Photo folder "${IMAGES}" not found. Extract the Drive folder there, or pass --images <folder>.`);
}
const files = await indexFiles(IMAGES);
const missing = products.filter((p) => !files.has(p.image.toLowerCase()));
console.log(`${products.length} products · ${files.size} files in ${IMAGES} · ${missing.length} photo(s) missing${write ? "" : " — DRY RUN"}`);
for (const m of missing) console.log(`  ! no photo for ${m.code} ${m.name} (${m.image}) — card will be added without one`);

const assetFor = new Map<string, string>();
async function upload(p: Product): Promise<string | undefined> {
  const path = files.get(p.image.toLowerCase());
  if (!path || !write) return undefined;
  const hit = assetFor.get(p.code);
  if (hit) return hit;
  const asset = await client.assets.upload("image", createReadStream(path), { filename: basename(path) });
  assetFor.set(p.code, asset._id);
  return asset._id;
}

const keyOf = (code: string) => `cat-${code.toLowerCase()}`;
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

// ── Pages ──────────────────────────────────────────────────────────────────
const bySlug = new Map<string, Product[]>();
for (const p of products) bySlug.set(p.page, [...(bySlug.get(p.page) ?? []), p]);

let changedDocs = 0;
for (const [slug, list] of bySlug) {
  const docs = await client.fetch<Doc[]>(
    `*[_type == "productCategory" && slug.current == $slug && !(_id in path("versions.**"))]{ _id, _rev, navLabel, slug, anchors, sections }`,
    { slug },
  );
  if (docs.length === 0) {
    console.log(`\n✖ /products/${slug} — no Sanity document; ${list.length} product(s) skipped`);
    continue;
  }

  for (const doc of docs) {
    const label = `/products/${slug}${doc._id.startsWith("drafts.") ? " [draft]" : ""}`;
    const sections = [...(doc.sections ?? [])];
    let i = sections.findIndex((b) => b._type === "block.partsGrid");
    const notes: string[] = [];

    if (i === -1) {
      const block: Block = {
        _key: `partsGrid-${randomUUID().slice(0, 8)}`,
        _type: "block.partsGrid",
        eyebrow: "IN THIS CATEGORY",
        heading: "0 parts we make to order",
        body: "Each part below is manufactured to customer drawing or to our standard tooling. Full dimensional and compound data is issued with quotation.",
        items: [],
      };
      i = Math.max(0, sections.length - 1);
      sections.splice(i, 0, block);
      notes.push(`new "Parts in this category" section, placed before the last section`);
    }

    const block = { ...sections[i] };
    let items: Item[] = [...(block.items ?? [])];

    // Linked cards → list, keeping their links, so they survive the switch.
    if (items.length === 0 && (doc.anchors?.length ?? 0) > 0) {
      items = doc.anchors!.map((a) => ({
        _key: `anchor-${a.id}`,
        _type: "partName",
        name: a.label,
        availability: "Made to order",
        href: `/products/${slug}/${a.id}`,
      }));
      notes.push(`${items.length} existing linked part(s) carried into the list`);
    }

    const have = new Set(items.map((x) => x._key));
    const names = new Set(items.map((x) => norm(x.name)));
    const added: string[] = [];
    for (const p of list) {
      if (have.has(keyOf(p.code))) continue;
      if (names.has(norm(p.name))) {
        notes.push(`skipped ${p.code} "${p.name}" — a card with that name is already there`);
        continue;
      }
      const ref = await upload(p);
      items.push({
        _key: keyOf(p.code),
        _type: "partName",
        name: p.name,
        availability: p.family,
        description: p.description,
        ...(ref ? { image: { _type: "image", asset: { _type: "reference", _ref: ref }, alt: p.name } } : {}),
      });
      added.push(`${p.code} ${p.name}`);
    }

    const before = JSON.stringify(sections[i]);
    block.items = items;
    if (typeof block.heading === "string" && /^\d+ parts\b/.test(block.heading)) {
      block.heading = block.heading.replace(/^\d+/, String(items.length));
    }
    sections[i] = block;

    if (JSON.stringify(block) === before) {
      console.log(`  ✓ ${label} — already up to date (${items.length} cards)`);
      continue;
    }

    changedDocs++;
    console.log(`\n■ ${label} — ${added.length} added, ${items.length} cards in total`);
    for (const n of notes) console.log(`    · ${n}`);
    for (const a of added) console.log(`    + ${a}`);
    if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set({ sections }).commit();
  }
}

console.log(`\n${write ? "Updated" : "Would update"} ${changedDocs} document(s).`);
if (!write) console.log("Dry run — no photos uploaded, nothing written. Re-run with --write to apply.");
