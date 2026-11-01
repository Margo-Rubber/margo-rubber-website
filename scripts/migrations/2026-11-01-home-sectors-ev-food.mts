/**
 * MIGRATION — EV and Food & Beverage on the home page "Sectors we serve".
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/migrations/2026-11-01-home-sectors-ev-food.mts [--write]
 *
 * Appends two sector cards to homePage-home → sectors.items, linking to the
 * existing industry pages, and changes the heading from "Nine" to "Eleven".
 * Card copy is taken from each industry page's own SEO description.
 *
 * ICONS. The page schema (src/content/schemas/index.ts) validates sector
 * icons against a closed list, and a document that fails validation falls
 * back to the local .mdx copy of the WHOLE page. "bolt" and "cup" only joined
 * that list in the commit that adds this script, so:
 *   - without --final-icons the cards get "wind" / "droplet", which every
 *     deployed build accepts (this is what was written on 2026-11-01);
 *   - with --final-icons they get "bolt" / "cup" — run that only after the
 *     commit is merged to main and deployed.
 * Idempotent: skips cards already there; --final-icons also updates them.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
const finalIcons = process.argv.includes("--final-icons");
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

const ID = "homePage-home";
const cards = [
  {
    _key: "ev-energy-storage-renewables",
    _type: "homeSector",
    icon: finalIcons ? "bolt" : "wind",
    name: "EV, Energy Storage & Renewables",
    body: "Battery-pack and cabinet gaskets, grommets and junction-box seals for EV, BESS, solar and wind equipment, made to drawing.",
    href: "/industries/ev-energy-storage-renewables",
  },
  {
    _key: "food-beverage-pharma",
    _type: "homeSector",
    icon: finalIcons ? "cup" : "droplet",
    name: "Food, Beverage & Pharma",
    body: "Clamp gaskets, O-rings, valve seats and door seals for dairy, brewery, food and pharma process lines, made to drawing.",
    href: "/industries/food-beverage-pharma",
  },
];
const lines = ["Rubber Components", "*for Eleven Industries*"];

const sectors = await client.fetch<{ lines: string[]; items: { _key: string }[] } | null>(
  `*[_id == $id][0].sectors{lines, "items": items[]{_key}}`,
  { id: ID },
);
if (!sectors) throw new Error(`${ID} has no sectors`);
const have = new Set(sectors.items.map((i) => i._key));
const add = cards.filter((c) => !have.has(c._key));
console.log(`${ID}: ${sectors.items.length} sectors, heading ${JSON.stringify(sectors.lines)}`);
console.log(`Adding: ${add.map((c) => c.name).join(", ") || "nothing"}; heading → ${JSON.stringify(lines)}`);

if (!write) {
  console.log("Dry run. Re-run with --write.");
  process.exit(0);
}

let patch = client.patch(ID).set({ "sectors.lines": lines });
if (add.length) patch = patch.insert("after", "sectors.items[-1]", add);
if (finalIcons) {
  for (const c of cards.filter((c) => have.has(c._key))) {
    patch = patch.set({ [`sectors.items[_key=="${c._key}"].icon`]: c.icon });
  }
}
const result = await patch.commit();
console.log(`Patched ${result._id} rev ${result._rev}`);
