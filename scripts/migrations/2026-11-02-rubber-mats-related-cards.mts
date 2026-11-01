/**
 * MIGRATION — rubber mats, "You May Also Need": a plain list of links that
 * read as grey text becomes link cards (client, 2 Nov 2026). Each card's
 * name is the link, with a one-line description, as in the other card grids.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-rubber-mats-related-cards.mts [--write]
 *
 * Idempotent; the write uses ifRevisionId.
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

const ID = "productCategory-rubber-mats";
const KEY = "section-15";
const items = [
  {
    name: "Anti-vibration mounts",
    href: "/products/anti-vibration-mounts",
    body: "Rubber-to-metal mounts that isolate engines, pumps and machines from the frame they sit on.",
  },
  {
    name: "Pads, stoppers & caps",
    href: "/products/pads-stoppers-caps",
    body: "Moulded support pads, buffers, stoppers and caps for vehicles and equipment.",
  },
  {
    name: "Rubber lining",
    href: "/products/rubber-lining",
    body: "Sheet lining and conveyor skirting for chutes, hoppers and tanks.",
  },
  {
    name: "Gaskets",
    href: "/products/gaskets",
    body: "Moulded and cut gaskets in eight compounds, to your drawing.",
  },
  {
    name: "Exhaust hangers & isolators",
    href: "/products/anti-vibration-mounts/exhaust-hangers-isolators",
    body: "Rubber hangers that carry the exhaust and keep its vibration out of the body.",
  },
].map((i, n) => ({ _key: `related_${n}`, ...i }));

const doc = await client.fetch<{ _rev: string; sections: { _key: string; _type: string; eyebrow?: string; heading?: string }[] }>(
  `*[_id == $id][0]{ _rev, sections }`,
  { id: ID },
);
const old = doc.sections.find((s) => s._key === KEY);
if (!old) throw new Error(`${KEY} not found`);
if (old._type === "block.cardGrid") {
  console.log("Already cards — nothing to do.");
  process.exit(0);
}
const cards = {
  _key: KEY,
  _type: "block.cardGrid",
  id: "related",
  layout: "plain",
  eyebrow: old.eyebrow,
  heading: old.heading,
  items,
};
const sections = doc.sections.map((s) => (s._key === KEY ? cards : s));
console.log(`${ID}: ${KEY} ${old._type} → block.cardGrid (${items.length} cards)`);
if (!write) {
  console.log("Dry run. Re-run with --write.");
  process.exit(0);
}
const res = await client.patch(ID).ifRevisionId(doc._rev).set({ sections }).commit();
console.log(`Patched → rev ${res._rev}`);
