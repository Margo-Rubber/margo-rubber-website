/**
 * The hub cards for the pages sheets 36–42 built without one (OPEN-ITEMS
 * 94, 104). Each card is the page's own copy, read from its document —
 * name, H1 as kicker, its first types or applications as chips, its
 * opening sentence as the sector body — so the /products and /industries
 * appliers can rebuild their grids from the sheets and still keep the six.
 * Photograph slots: `products.card.<slug>` / `industries.<slug>` (stand-ins
 * from the heroes, src/content/images.ts).
 */

import { client } from "../lib.mts";

const plain = (s: string) => s.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
const kicker = (h1: string) => plain(h1).replace(/[.。]\s*$/, "").toUpperCase();

const TAG: Record<string, string> = { diaphragms: "Sealing", seals: "Sealing", "bonded-components": "Anti-Vibration", "rubber-lining": "Lining" };

export async function newCategoryCards() {
  const cats = (await client.fetch(
    `*[_type=="productCategory" && slug.current in ["diaphragms","seals","bonded-components","rubber-lining"]]{
      "slug": slug.current, navLabel, h1, "chips": sections[_type=="block.cardGrid"][0].items[0..1].name
    } | order(slug)`,
  )) as { slug: string; navLabel: string; h1: string; chips: string[] }[];
  return cats.map((c) => ({
    slug: c.slug,
    title: c.navLabel,
    kicker: kicker(c.h1),
    tag: TAG[c.slug],
    chips: c.chips,
    image: `products.card.${c.slug}`,
    span: "normal" as const,
    // Sheet 38 §10: "A third group is needed: sheet and lining products."
    ...(c.slug === "rubber-lining" ? { groupLabel: "Sheet and lining products" } : {}),
  }));
}

export async function newSectorCards() {
  const inds = (await client.fetch(
    `*[_type=="industry" && slug.current in ["construction","transport"]]{
      "slug": slug.current, navLabel, intro, "tags": sections[_type=="block.cardGrid"][0].items[0..3].name
    } | order(slug)`,
  )) as { slug: string; navLabel: string; intro: string; tags: string[] }[];
  return inds.map((i) => ({
    slug: i.slug,
    name: i.navLabel,
    chip: i.slug === "transport" ? "Transport" : i.navLabel,
    body: plain(i.intro).split(/(?<=\.)\s/)[0],
    tags: i.tags,
    image: `industries.${i.slug}`,
  }));
}
