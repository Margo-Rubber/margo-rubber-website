/**
 * HUB CARDS FOR THE SIX NEW PAGES (OPEN-ITEMS 94, 104).
 *
 *   node scripts/migrations/hub-cards-new-pages.mts [--write]
 *
 * Sheets 36–42 built four category pages and two industry pages but wrote
 * no card for the /products or /industries grids, so the six were reachable
 * from the menus and the footer and not from the hubs. Each card here is
 * made only of the page's own copy — its name, its H1 as the kicker, the
 * first application or type names it lists as chips, its hero photograph
 * as a stand-in (its own slot, per the one-slot-per-placement rule) — and
 * nothing composed. Construction leaves the "additional sectors" list, as
 * sheet 41 asks; the hub headings still say "Nine Industries" (sheet 05),
 * which is now a contradiction for Margo to rule on (OPEN-ITEMS 104).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { client } from "../sheets/lib.mts";
import { PRODUCT_GROUPS } from "../../src/content/routes.ts";

const WRITE = process.argv.includes("--write");
const IMAGES = "src/content/images.ts";
const LABELS = "src/content/image-slot-labels.ts";
let images = readFileSync(IMAGES, "utf8");
let labels = readFileSync(LABELS, "utf8");

const entry = (text: string, key: string) => {
  const re = new RegExp(`\\n  "${key.replace(/[.\-]/g, "\\$&")}": \\{[\\s\\S]*?\\n  \\},`);
  return text.match(re)?.[0] ?? null;
};
const addAfter = (text: string, after: string, block: string) => {
  const e = entry(text, after);
  if (!e) throw new Error(`no entry "${after}"`);
  return text.replace(e, e + block);
};
const has = (key: string) => !!entry(images, key);

const plain = (s: string) => s.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
const kicker = (h1: string) => plain(h1).replace(/[.。]\s*$/, "").toUpperCase();

/* ── /products: four category cards ────────────────────────────────────── */
const TAG: Record<string, string> = { diaphragms: "Sealing", seals: "Sealing", "bonded-components": "Anti-Vibration", "rubber-lining": "Lining" };
const cats = (await client.fetch(
  `*[_type=="productCategory" && slug.current in ["diaphragms","seals","bonded-components","rubber-lining"]]{
    "slug": slug.current, navLabel, h1, hero,
    "chips": sections[_type=="block.cardGrid"][0].items[0..1].name
  } | order(slug)`,
)) as { slug: string; navLabel: string; h1: string; hero: { image: string; alt: string }; chips: string[] }[];

const hub = (await client.fetch(`*[_id=="productsHub-products"][0].range{filters, "slugs": cards[].slug}`)) as { filters: string[]; slugs: string[] };
const productCards = cats
  .filter((c) => !hub.slugs.includes(c.slug))
  .map((c) => ({
    _key: c.slug,
    _type: "rangeCard",
    slug: c.slug,
    title: c.navLabel,
    kicker: kicker(c.h1),
    tag: TAG[c.slug],
    chips: c.chips,
    image: `products.card.${c.slug}`,
    span: "normal",
    ...(c.slug === "rubber-lining" ? { groupLabel: "Sheet & Lining" } : {}),
  }));
// Order the cards as the registry groups them, so a new sealing card sits with sealing.
const order = PRODUCT_GROUPS.flatMap((g) => g.items.map((i) => i.slug));
const filters = hub.filters.includes("Lining") ? hub.filters : [...hub.filters, "Lining"];

/* ── /industries: two sector cards ──────────────────────────────────────── */
const inds = (await client.fetch(
  `*[_type=="industry" && slug.current in ["construction","transport"]]{
    "slug": slug.current, navLabel, intro, hero,
    "tags": sections[_type=="block.cardGrid"][0].items[0..3].name
  } | order(slug)`,
)) as { slug: string; navLabel: string; intro: string; hero: { image: string; alt: string }; tags: string[] }[];
const ihub = (await client.fetch(`*[_id=="industriesHub-industries"][0]{ "slugs": primary.items[].slug, "extra": additional.items[]{_key, name} }`)) as {
  slugs: string[];
  extra: { _key: string; name: string }[];
};
const sectorCards = inds
  .filter((i) => !ihub.slugs.includes(i.slug))
  .map((i) => ({
    _key: i.slug,
    _type: "sector",
    slug: i.slug,
    name: i.navLabel,
    chip: i.slug === "transport" ? "Transport" : i.navLabel,
    // The page's own opening sentence, its emphasis marks removed.
    body: plain(i.intro).split(/(?<=\.)\s/)[0],
    tags: i.tags,
    image: `industries.${i.slug}`,
  }));
const dropExtra = ihub.extra.filter((e) => /^Construction/.test(e.name)).map((e) => e._key);

/* ── Report ─────────────────────────────────────────────────────────────── */
for (const c of productCards) console.log(`  + /products card  ${c.slug.padEnd(20)} ${c.tag.padEnd(14)} chips: ${c.chips.join(" · ")}`);
for (const s of sectorCards) console.log(`  + /industries card ${s.slug.padEnd(19)} tags: ${s.tags.join(" · ")}`);
for (const k of dropExtra) console.log(`  − /industries additional sector "${k}" (now a page)`);
const slots = [
  ...productCards.map((c) => ({ key: c.image, from: `products.${c.slug}.hero`, after: "products.card.sponge-foam-rubber", title: `Products page — ${c.title} card`, where: `Products page range grid. Stand-in: the ${c.title} page's hero photograph until the card's own is uploaded.`, page: "/products" })),
  ...sectorCards.map((s) => ({ key: s.image, from: `industries.${s.slug}.hero`, after: "industries.water-fluid-management", title: `Industries page — ${s.name} card`, where: `Industries page grid. Stand-in: the ${s.name} page's hero photograph until the card's own is uploaded.`, page: "/industries" })),
].filter((s) => !has(s.key));
for (const s of slots) console.log(`  + slot ${s.key.padEnd(36)} ← ${s.from}`);
if (!WRITE) {
  console.log("\nDry run — nothing written.");
  process.exit(0);
}

/* ── Write ──────────────────────────────────────────────────────────────── */
for (const s of slots) {
  const src = entry(images, s.from);
  if (!src) throw new Error(`no source entry ${s.from}`);
  images = addAfter(images, s.after, src.replace(`"${s.from}": {`, `"${s.key}": {`));
  labels = addAfter(labels, s.after, `\n  "${s.key}": {\n    title: ${JSON.stringify(s.title)},\n    where: ${JSON.stringify(s.where)},\n    page: "${s.page}",\n  },`);
}
writeFileSync(IMAGES, images);
writeFileSync(LABELS, labels);

if (productCards.length) {
  const existing = (await client.fetch(`*[_id=="productsHub-products"][0].range.cards`)) as { slug: string }[];
  const all = [...existing, ...productCards].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  await client.patch("productsHub-products").set({ "range.cards": all, "range.filters": filters }).commit();
}
if (sectorCards.length) {
  await client.patch("industriesHub-industries").insert("after", "primary.items[-1]", sectorCards).commit();
}
if (dropExtra.length) {
  await client
    .patch("industriesHub-industries")
    .unset(dropExtra.map((k) => `additional.items[_key=="${k}"]`))
    .commit();
}
console.log("✓ written");
