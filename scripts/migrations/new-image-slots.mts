/**
 * IMAGE SLOTS FOR THE PLACEMENTS THE COPY PASS ADDED.
 *
 *   node scripts/migrations/new-image-slots.mts [--write]
 *
 * The sheets added material panels the old pages never had (NR, CR, SBR,
 * AEM — and EPDM sponge on Gaskets, PTFE on O-Rings) and six pages with a
 * hero and no photograph. A panel or hero with no slot renders black and,
 * worse, has nothing in the Studio's Photographs list for Margo to replace.
 *
 * Each such placement gets its own slot — Ayaz's rule: one slot per place
 * — filled for now with a photograph the site already has (the panel next
 * to it, or the nearest page's hero), labelled as a stand-in so whoever
 * opens Photographs knows it is waiting for the real picture. The alt text
 * stays the borrowed picture's, because that is what is on the page.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { client } from "../sheets/lib.mts";

const WRITE = process.argv.includes("--write");
const IMAGES = "src/content/images.ts";
const LABELS = "src/content/image-slot-labels.ts";
let images = readFileSync(IMAGES, "utf8");
let labels = readFileSync(LABELS, "utf8");

const entry = (text: string, key: string) => {
  const re = new RegExp(`\\n  "${key.replace(/[.\-]/g, "\\$&")}": \\{[\\s\\S]*?\\n  \\},`);
  return text.match(re)?.[0] ?? null;
};
/** Append a slot to a registry, right after `after` (so the file stays grouped by page). */
const addAfter = (text: string, after: string, block: string) => {
  const e = entry(text, after);
  if (!e) throw new Error(`no entry "${after}" to add after`);
  return text.replace(e, e + block);
};
const has = (key: string) => !!entry(images, key);

type Add = { key: string; from: string; after: string; title: string; where: string; page: string; patch: { id: string; path: string } };
const adds: Add[] = [];
const seen = new Set<string>();

/* ── Material panels ──────────────────────────────────────────────────── */
const COMPOUND: Record<string, string> = {
  NR: "Natural rubber (NR)",
  CR: "Neoprene (CR)",
  SBR: "SBR",
  AEM: "AEM (Vamac®)",
  EPDM: "EPDM",
  NBR: "NBR (Nitrile)",
  FKM: "FKM (Viton®)",
  VMQ: "Silicone (VMQ)",
  "EPDM-SPONGE": "EPDM sponge",
  PTFE: "PTFE-encapsulated",
};
const cats = (await client.fetch(
  `*[_type == "productCategory"]{_id, "slug": slug.current, navLabel, "items": sections[_key=="materialSection"][0].items[]{code, image}} | order(slug)`,
)) as { _id: string; slug: string; navLabel: string; items?: { code: string; image?: string }[] }[];
for (const c of cats) {
  const items = c.items ?? [];
  const withImage = items.filter((i) => i.image && has(i.image));
  if (!withImage.length) continue;
  let n = 0;
  items.forEach((it, i) => {
    if (it.image) return;
    const key = `products.${c.slug}.material.${it.code.toLowerCase()}`;
    // Borrow the panels' own photographs in turn, so two new panels side by side differ.
    const from = withImage[n++ % withImage.length].image!;
    adds.push({
      key,
      from,
      after: withImage[withImage.length - 1].image!,
      title: `${c.navLabel} — ${COMPOUND[it.code] ?? it.code} material card`,
      where: `${c.navLabel} category page, ‘Material selection’ section — card ${i + 1} of ${items.length}. Stand-in: shows the ${COMPOUND[withImage.find((w) => w.image === from)?.code ?? ""] ?? "neighbouring"} card's photograph until its own is uploaded.`,
      page: `/products/${c.slug}`,
      patch: { id: c._id, path: `sections[_key=="materialSection"].items[${i}].image` },
    });
  });
}

/* ── Heroes of the six new pages ──────────────────────────────────────── */
const HEROES: { id: string; key: string; from: string; title: string; page: string; alt: string }[] = [
  { id: "productCategory-diaphragms", key: "products.diaphragms.hero", from: "products.bellows.hero", title: "Diaphragms page — hero background", page: "/products/diaphragms", alt: "Fabric-reinforced rubber diaphragms moulded at Margo Rubber Products, Nashik" },
  { id: "productCategory-bonded-components", key: "products.bonded-components.hero", from: "products.anti-vibration-mounts.hero", title: "Bonded Components page — hero background", page: "/products/bonded-components", alt: "Rubber-to-metal bonded mounts and bushes moulded at Margo Rubber Products, Nashik" },
  { id: "productCategory-rubber-lining", key: "products.rubber-lining.hero", from: "industries.mining.hero", title: "Rubber Lining & Skirting page — hero background", page: "/products/rubber-lining", alt: "Natural rubber chute lining and conveyor skirting cut at Margo Rubber Products, Nashik" },
  { id: "productCategory-seals", key: "products.seals.hero", from: "products.oil-seals.hero", title: "Reciprocating Seals page — hero background", page: "/products/seals", alt: "Moulded rubber plunger cups and rod seals produced at Margo Rubber Products, Nashik" },
  { id: "industry-construction", key: "industries.construction.hero", from: "products.extrusion.hero", title: "Construction page — hero background", page: "/industries/construction", alt: "EPDM glazing gaskets and expansion joint seals extruded at Margo Rubber Products, Nashik" },
  { id: "industry-transport", key: "industries.transport.hero", from: "industries.automotive.hero", title: "Transport — Rail & Marine page — hero background", page: "/industries/transport", alt: "Extruded EPDM window and hatch seals produced at Margo Rubber Products, Nashik" },
];
for (const h of HEROES) {
  if (has(h.key)) continue;
  adds.push({
    key: h.key,
    from: h.from,
    after: h.from,
    title: h.title,
    where: `${h.title.replace(" — hero background", "")}, the photograph behind the heading at the top. Stand-in: another page's photograph until this page's own is uploaded — the content sheet asks for “${h.alt}”.`,
    page: h.page,
    patch: { id: h.id, path: "hero" },
  });
}

/* ── Report, then write ───────────────────────────────────────────────── */
for (const a of adds) {
  if (seen.has(a.key)) throw new Error(`duplicate ${a.key}`);
  seen.add(a.key);
  console.log(`  + ${a.key.padEnd(48)} ← ${a.from}`);
}
console.log(`\n${adds.length} slot(s) to add.${WRITE ? "" : " Dry run — nothing written."}`);
if (!WRITE) process.exit(0);

for (const a of adds) {
  const src = entry(images, a.from);
  if (!src) throw new Error(`no source entry ${a.from}`);
  images = addAfter(images, a.after, src.replace(`"${a.from}": {`, `"${a.key}": {`));
  const label = `\n  "${a.key}": {\n    title: ${JSON.stringify(a.title)},\n    where: ${JSON.stringify(a.where)},\n    page: "${a.page}",\n  },`;
  const labelAfter = entry(labels, a.after) ? a.after : a.from;
  labels = addAfter(labels, labelAfter, label);
}
writeFileSync(IMAGES, images);
writeFileSync(LABELS, labels);

for (const a of adds) {
  const hero = HEROES.find((h) => h.key === a.key);
  const value = hero ? { image: a.key, alt: hero.alt } : a.key;
  await client.patch(a.patch.id).set({ [a.patch.path]: value }).commit();
}
console.log("✓ written");
