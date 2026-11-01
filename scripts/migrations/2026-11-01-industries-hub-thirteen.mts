/**
 * MIGRATION — industries hub: EV and Food, Beverage & Pharma; eleven → thirteen.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/migrations/2026-11-01-industries-hub-thirteen.mts [--write] [--final-images]
 *
 * On industriesHub-industries:
 *   - appends the two Oct 2026 industries to the "Core industries" grid, in
 *     the format of the other cards (copy from each industry page's own
 *     description; tags are the parts that description names);
 *   - adds filter chips for every card that has none — Construction,
 *     Transport and the two new ones;
 *   - restates the count as thirteen in the H1, intro, grid heading,
 *     count label and SEO title/description.
 *
 * IMAGES. A card image is required and an unknown key throws on render.
 * The cards' own slots ("industries.ev-energy-storage-renewables",
 * "industries.food-beverage-pharma") ship in the same commit as this script;
 * the industry pages' hero slots are already on main. So:
 *   - without --final-images the cards use the hero slots — safe now;
 *   - with --final-images they use their own slots — run that only after the
 *     commit is merged to main and deployed.
 * Idempotent.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
const finalImages = process.argv.includes("--final-images");
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

const ID = "industriesHub-industries";
const img = (slug: string) => (finalImages ? `industries.${slug}` : `industries.${slug}.hero`);
const cards = [
  {
    _key: "ev-energy-storage-renewables",
    _type: "sector",
    slug: "ev-energy-storage-renewables",
    name: "EV, Energy Storage & Renewables",
    chip: "EV & Renewables",
    body: "Battery-pack and cabinet gaskets, grommets and junction-box seals for EV, BESS, solar and wind equipment.",
    image: img("ev-energy-storage-renewables"),
    tags: ["Battery-pack gaskets", "Cabinet gaskets", "Grommets", "Junction-box seals"],
  },
  {
    _key: "food-beverage-pharma",
    _type: "sector",
    slug: "food-beverage-pharma",
    name: "Food, Beverage & Pharma",
    chip: "Food & Beverage",
    body: "Clamp gaskets, O-rings, valve seats and door seals for dairy, brewery, food and pharma process lines.",
    image: img("food-beverage-pharma"),
    tags: ["Clamp gaskets", "O-rings", "Valve seats", "Door seals"],
  },
];

const text = {
  h1: "Rubber Components for Thirteen Industries",
  h1Lines: ["Rubber Components", "for Thirteen Industries"],
  intro:
    "Precision moulded and extruded rubber components, manufactured in Nashik, India, supplied to demanding sectors across thirteen core industries. The moulded line is ISO 9001:2015 certified.",
  "primary.heading": "Thirteen Industries, *One Compound Library*",
  "primary.countLabel": "13 of 13 showing",
  "seo.title": "Rubber Components by Industry | 13 Sectors | Margo, India",
  "seo.description":
    "Rubber components for thirteen industries: automotive, oil & gas, mining, pumps, HVAC, electrical, agriculture, medical, water, construction, transport, EV and food & pharma.",
};

const doc = await client.fetch<{ chips: string[]; items: { _key: string; chip: string }[] } | null>(
  `*[_id == $id][0]{"chips": filter.chips, "items": primary.items[]{_key, chip}}`,
  { id: ID },
);
if (!doc) throw new Error(`${ID} not found`);
const have = new Set(doc.items.map((i) => i._key));
const add = cards.filter((c) => !have.has(c._key));
const allChips = [...doc.items.map((i) => i.chip), ...add.map((c) => c.chip)];
const missingChips = allChips.filter((c, i) => allChips.indexOf(c) === i && !doc.chips.includes(c));

console.log(`${ID}: ${doc.items.length} cards, chips ${JSON.stringify(doc.chips)}`);
console.log(`Adding cards: ${add.map((c) => c.name).join(", ") || "none"} (images: ${finalImages ? "own slots" : "hero slots"})`);
console.log(`Adding chips: ${missingChips.join(", ") || "none"}`);
console.log(`Setting: ${Object.keys(text).join(", ")}`);

if (!write) {
  console.log("Dry run. Re-run with --write.");
  process.exit(0);
}

// One insert per patch: the client keeps a single `insert` operation per
// patch, so a second .insert() silently replaces the first. Each list edit
// is its own patch, committed together in one transaction.
let main = client.patch(ID).set(text);
if (finalImages) {
  for (const c of cards.filter((c) => have.has(c._key))) {
    main = main.set({ [`primary.items[_key=="${c._key}"].image`]: c.image });
  }
}
const tx = client.transaction().patch(main);
if (add.length) tx.patch(client.patch(ID).insert("after", "primary.items[-1]", add));
if (missingChips.length) tx.patch(client.patch(ID).insert("after", "filter.chips[-1]", missingChips));
const result = await tx.commit();
console.log(`Committed transaction ${result.transactionId}`);
