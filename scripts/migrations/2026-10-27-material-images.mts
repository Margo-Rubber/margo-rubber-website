/**
 * MIGRATION — new material card images from Figma (27 Oct 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-material-images.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-material-images.mts --write
 *
 * BEFORE RUNNING: export the nine frames of the Figma section "Margo —
 * Material card images (1500×600, export these)" as JPG at 1× into
 * /material-images at the root of this repo (git ignores it). Figma names
 * the files after the frames: material-aem.jpg, material-fkm.jpg …
 * Another folder: --images "C:\path\to\folder".
 *
 * WHAT IT DOES: every material card on every product page keeps its compound
 * and copy; only its photograph changes. Each card's photograph is a slot
 * (e.g. products.o-rings.material.fkm), replaced through the same
 * "Photographs" documents Studio uses — so each one can still be swapped or
 * restored from Studio → Photographs afterwards. One upload per compound,
 * reused by every page that lists it.
 *
 * Compounds with an image but no card anywhere (PTFE today) are reported and
 * left alone: a card needs its temperature range and hardness first.
 *
 * Idempotent: a slot already showing the same upload is skipped. Published
 * photographs are written directly (they go live); a draft of the same slot,
 * if one exists, gets the same image so a later publish does not undo it.
 */
import { createClient } from "@sanity/client";
import { readdir } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import { join, basename } from "node:path";

const write = process.argv.includes("--write");
const imgArg = process.argv.indexOf("--images");
const IMAGES = imgArg > -1 ? process.argv[imgArg + 1] : "material-images";

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

/** Card code → the Figma frame (and so the file) that pictures it. */
const FILE_FOR: Record<string, string> = {
  AEM: "material-aem",
  FKM: "material-fkm",
  NBR: "material-nbr",
  EPDM: "material-epdm",
  VMQ: "material-silicone",
  SILICONE: "material-silicone",
  CR: "material-cr",
  SBR: "material-sbr",
  NR: "material-nr",
  PTFE: "material-ptfe",
};

// ── Files ──────────────────────────────────────────────────────────────────
if (!existsSync(IMAGES)) {
  throw new Error(`Folder "${IMAGES}" not found. Export the Figma frames there, or pass --images <folder>.`);
}
const files = new Map<string, string>(); // "material-fkm" → path
for (const e of await readdir(IMAGES, { withFileTypes: true })) {
  if (!e.isFile() || !/\.(jpe?g|png|webp)$/i.test(e.name)) continue;
  const stem = e.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/\s+/g, "-");
  const key = Object.values(FILE_FOR).find((f) => stem === f || stem.startsWith(f));
  if (key) files.set(key, join(IMAGES, e.name));
}
console.log(`${files.size} of 9 material images found in ${IMAGES}${write ? "" : " — DRY RUN"}`);
for (const f of new Set(Object.values(FILE_FOR))) if (!files.has(f)) console.log(`  ! missing ${f}.jpg`);

// ── Cards ──────────────────────────────────────────────────────────────────
type Card = { code?: string; name?: string; image?: string };
type Page = { slug: string; cards: Card[] };
const pages = await client.fetch<Page[]>(
  `*[_type == "productCategory" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{
     "slug": slug.current,
     "cards": sections[_type == "block.materialCards"][].items[]{ code, name, image }
   } | order(slug)`,
);

const slotsFor = new Map<string, { slot: string; name: string; page: string }[]>(); // file → slots
const noImage: string[] = [];
for (const p of pages) {
  for (const c of p.cards ?? []) {
    const code = (c.code ?? "").trim().toUpperCase();
    const file = FILE_FOR[code];
    if (!c.image) continue; // a card without a slot draws no photograph at all
    if (!file) {
      noImage.push(`/products/${p.slug} · ${c.code}`);
      continue;
    }
    slotsFor.set(file, [...(slotsFor.get(file) ?? []), { slot: c.image, name: c.name ?? code, page: p.slug }]);
  }
}

const idFor = (slot: string) => `imageOverride-${slot.replace(/\./g, "__")}`;

let changed = 0;
for (const [file, slots] of [...slotsFor].sort()) {
  const path = files.get(file);
  console.log(`\n■ ${file} — ${slots.length} card(s)${path ? "" : "  (no file — skipped)"}`);
  if (!path) continue;

  let assetId: string | undefined;
  if (write) {
    const asset = await client.assets.upload("image", createReadStream(path), { filename: basename(path) });
    assetId = asset._id;
  }

  for (const s of slots) {
    const id = idFor(s.slot);
    const existing = await client.fetch<{ _id: string; image?: { asset?: { _ref?: string } } }[]>(
      `*[_id in [$id, "drafts." + $id]]{ _id, image }`,
      { id },
    );
    if (assetId && existing.length > 0 && existing.every((d) => d.image?.asset?._ref === assetId)) {
      console.log(`    ✓ ${s.page} (${s.slot}) — already this image`);
      continue;
    }
    changed++;
    console.log(`    + /products/${s.page} · ${s.name}  →  ${s.slot}`);
    if (!write || !assetId) continue;

    const image = { _type: "image", asset: { _type: "reference", _ref: assetId } };
    const alt = `${s.name} rubber compound sample`;
    await client.createIfNotExists({ _id: id, _type: "imageOverride" });
    await client.patch(id).set({ image, alt, decorative: false }).commit();
    if (existing.some((d) => d._id === `drafts.${id}`)) {
      await client.patch(`drafts.${id}`).set({ image, alt, decorative: false }).commit();
    }
  }
}

const unused = [...files.keys()].filter((f) => !slotsFor.has(f));
if (unused.length) console.log(`\nImages with no card on any page (left unused): ${unused.join(", ")}`);
if (noImage.length) console.log(`\nCards with no matching image (unchanged): ${noImage.join(" · ")}`);

console.log(`\n${write ? "Updated" : "Would update"} ${changed} card photograph(s).`);
if (!write) console.log("Dry run — nothing uploaded or written. Re-run with --write to apply.");
