/**
 * MIGRATION — the eight new part pages on their category pages.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-category-grids-new-parts.mts [--write]
 *
 * Knock-on edits K-gaskets, K-bellows, K-bellows-count, K-extrusion and
 * K-anti-vibration-mounts of the 29 Oct release pack. Client, 2 Nov 2026:
 * "in gaskets I can't find sanitary-tri-clamp".
 *
 *   · Gaskets: the three cards that already describe a new page link to it
 *     (Cover, sump, carrier & housing; Hygienic clamp & dairy coupling; EV
 *     battery-pack & charger); a new card for Flat rubber washers.
 *   · Bellows: cards for Convoluted moulded bellows and Dust covers &
 *     protective boots; heading "8 parts" → "10 parts".
 *   · Extrusion: a card for Edge trim (all-rubber).
 *   · Anti-vibration mounts: a card for Exhaust Hangers & Isolators, built
 *     like the three linked cards at the top of that grid.
 *
 * New cards take the part page's own photo (public/images/release-2026-10),
 * uploaded once as a Sanity asset. Names, group labels and text are the
 * pack's. Published AND draft documents. Idempotent; ifRevisionId on every
 * write.
 */
import { createReadStream } from "node:fs";
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

type NewCard = {
  _key: string;
  name: string;
  availability: string;
  description?: string;
  href: string;
  photo: string;
};

const PLAN: Record<
  string,
  { add: NewCard[]; link?: Record<string, string>; heading?: [string, string] }
> = {
  gaskets: {
    link: {
      "cat-at-02": "/products/gaskets/rocker-cover-sump-gaskets",
      "cat-gk-06": "/products/gaskets/sanitary-tri-clamp-gaskets",
      "cat-gk-01": "/products/gaskets/ev-battery-pack-gaskets",
    },
    add: [
      {
        _key: "flat-rubber-washers",
        name: "Flat rubber washers",
        availability: "Flange, moulded & cut",
        description: "Flat rubber washers die-cut, lathe-cut or moulded to your ID, OD and thickness.",
        href: "/products/gaskets/flat-rubber-washers",
        photo: "b1-02_flat-rubber-washers.webp",
      },
    ],
  },
  bellows: {
    heading: ["8 parts we make to order", "10 parts we make to order"],
    add: [
      {
        _key: "convoluted-bellows",
        name: "Convoluted moulded bellows",
        availability: "Bellows & dust boots",
        description:
          "Convoluted rubber bellows moulded to your end IDs, lengths and stroke, keeping dust and coolant off rods and slides.",
        href: "/products/bellows/convoluted-bellows",
        photo: "b3-32_convoluted-moulded-bellows.webp",
      },
      {
        _key: "dust-covers-boots",
        name: "Dust covers & protective boots",
        availability: "Vehicle & equipment boots",
        description:
          "Moulded rubber dust covers and protective boots for linkages, levers, switches, rod ends and connectors, made to your drawing or a sample.",
        href: "/products/bellows/dust-covers-boots",
        photo: "b3-05_dust-covers-protective-boots.webp",
      },
    ],
  },
  extrusion: {
    add: [
      {
        _key: "edge-trim",
        name: "Edge trim (all-rubber)",
        availability: "Industrial & equipment",
        description:
          "Extruded U-profiles with fins that grip the panel edge, no metal carrier. EPDM, to your profile or sample.",
        href: "/products/extrusion/edge-trim",
        photo: "b4-01_edge-trim.webp",
      },
    ],
  },
  "anti-vibration-mounts": {
    add: [
      {
        _key: "exhaust-hangers-isolators",
        name: "Exhaust Hangers & Isolators",
        availability: "Anti-Vibration Mounts · Made to order",
        href: "/products/anti-vibration-mounts/exhaust-hangers-isolators",
        photo: "b3-01_exhaust-hangers-isolators.webp",
      },
    ],
  },
};

const PHOTO_DIR = "public/images/release-2026-10/";
const uploaded = new Map<string, string>();
async function assetFor(file: string): Promise<string> {
  if (!uploaded.has(file)) {
    if (!write) {
      createReadStream(PHOTO_DIR + file).close(); // fail the dry run on a missing file
      uploaded.set(file, `(upload ${file})`);
    } else {
      const a = await client.assets.upload("image", createReadStream(PHOTO_DIR + file), { filename: file });
      uploaded.set(file, a._id);
    }
  }
  return uploaded.get(file)!;
}

type Item = { _key: string; name: string; href?: string };
type Doc = { _id: string; _rev: string; slug: string; grid: string; heading?: string; items: Item[] };

const docs = await client.fetch<Doc[]>(
  `*[_type == "productCategory" && slug.current in $slugs && !(_id in path("versions.**"))]{
    _id, _rev, "slug": slug.current,
    "grid": sections[_type == "block.partsGrid"][0]._key,
    "heading": sections[_type == "block.partsGrid"][0].heading,
    "items": sections[_type == "block.partsGrid"][0].items[]{_key, name, href}
  }`,
  { slugs: Object.keys(PLAN) },
);

for (const d of docs) {
  const plan = PLAN[d.slug];
  const grid = `sections[_key=="${d.grid}"]`;
  const set: Record<string, unknown> = {};
  const append: unknown[] = [];

  for (const [key, href] of Object.entries(plan.link ?? {})) {
    const item = d.items.find((i) => i._key === key);
    if (!item) throw new Error(`${d._id}: no card ${key}`);
    if (item.href !== href) set[`${grid}.items[_key=="${key}"].href`] = href;
  }
  if (plan.heading && d.heading === plan.heading[0]) set[`${grid}.heading`] = plan.heading[1];

  for (const c of plan.add) {
    if (d.items.some((i) => i._key === c._key || i.href === c.href)) continue;
    append.push({
      _key: c._key,
      _type: "partName",
      name: c.name,
      availability: c.availability,
      ...(c.description ? { description: c.description } : {}),
      href: c.href,
      image: { _type: "image", alt: c.name, asset: { _type: "reference", _ref: await assetFor(c.photo) } },
    });
  }

  if (!Object.keys(set).length && !append.length) {
    console.log(`${d._id}: no change`);
    continue;
  }
  console.log(`${d._id}:`);
  for (const [k, v] of Object.entries(set)) console.log(`  set ${k} = ${JSON.stringify(v)}`);
  for (const a of append) console.log(`  add card ${(a as { name: string }).name}`);
  if (!write) continue;
  let p = client.patch(d._id).ifRevisionId(d._rev);
  if (Object.keys(set).length) p = p.set(set);
  if (append.length) p = p.insert("after", `${grid}.items[-1]`, append);
  const r = await p.commit();
  console.log(`  rev ${r._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
