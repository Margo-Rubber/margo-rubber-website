/**
 * MIGRATION — Dynamic Seals and Diaphragms tabs on industry pages (20 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-20-industry-focus-tabs.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-20-industry-focus-tabs.mts --write
 *
 * Why: after the 20 Nov internal-link pass, /products/seals (now "Dynamic
 * Seals", a focus line) still had only 3 links from page content and no
 * industry page linked to it. Each industry page's "components we supply"
 * tabs (block.componentTabs) are where buyers go from a sector to a product,
 * so a tab there is a visible, relevant link.
 *
 * Adds a Dynamic Seals tab to five industries whose equipment the seals page
 * already names (reciprocating, dosing and sprayer pumps; rods and pistons),
 * and a Diaphragms tab to oil & gas (regulators, valves and metering pumps,
 * as the diaphragms page says). Same shape as the existing tabs, same hero
 * images the category pages use. Bullets repeat only what the seals and
 * diaphragms pages already state; nothing new is claimed.
 *
 * Appends; never reorders or edits an existing tab. Skips a page that already
 * has the tab (idempotent). ifRevisionId on every write; drafts patched too.
 */
import { createClient } from "@sanity/client";
import { claimHits } from "../../src/content/site.ts";

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN;
if (!token) throw new Error("SANITY_WRITE_TOKEN is not set — run with --env-file=.env.local");
const client = createClient({
  projectId: "jyg2beas",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

const SEAL_BULLETS = [
  "Plunger cups, U-cups, rod and piston seals",
  "V-packings and wipers",
  "Moulded to your stroke, pressure and clearance gap",
  "Compound chosen for the fluid you pump",
];
const seals = (body: string) => ({
  _key: "dynamic-seals",
  body,
  bullets: SEAL_BULLETS,
  cta: { href: "/products/seals", label: "Request Specs for Dynamic Seals" },
  image: "products.seals.hero",
  key: "Dynamic Seals",
  name: "Dynamic Seals",
});
const diaphragms = (body: string) => ({
  _key: "diaphragms",
  body,
  bullets: [
    "Flat, rolling and convoluted",
    "Plain or fabric-reinforced",
    "Compound chosen for the medium",
    "Moulded to your stroke and pressure",
  ],
  cta: { href: "/products/diaphragms", label: "Request Specs for Diaphragms" },
  image: "products.diaphragms.hero",
  key: "Diaphragms",
  name: "Diaphragms",
});

const ADD: Record<string, ReturnType<typeof seals>[]> = {
  "industry-pumps-valves": [seals("Plunger cups, rod and piston seals for reciprocating, dosing and plunger pumps")],
  "industry-water-fluid-management": [seals("Plunger and piston seals for dosing and reciprocating pumps")],
  "industry-agriculture": [seals("Plunger cups and piston seals for sprayer pumps and hydraulic cylinders")],
  "industry-oil-gas": [
    seals("Rod, piston and plunger seals for reciprocating pumps and actuators"),
    diaphragms("Regulator, valve and metering-pump diaphragms, compound chosen for the medium"),
  ],
  "industry-mining": [seals("Rod and piston seals for hydraulic cylinders on mobile machinery")],
};

for (const items of Object.values(ADD))
  for (const it of items)
    for (const s of [it.body, ...it.bullets]) {
      const h = claimHits(s);
      if (h.length) throw new Error(`Forbidden claim in "${s}": ${h[0].match}`);
    }

const manual: string[] = [];
let changes = 0;
let already = 0;
for (const [id, add] of Object.entries(ADD)) {
  const docs: any[] = await client.fetch(`*[_id in [$id, "drafts." + $id]]`, { id });
  if (!docs.length) { manual.push(`${id}: not found`); continue; }
  for (const doc of docs) {
    const idx = (doc.sections ?? []).findIndex((s: any) => s._type === "block.componentTabs" && s._key === "components");
    if (idx < 0) { manual.push(`${doc._id}: no componentTabs section`); continue; }
    const items: any[] = doc.sections[idx].items ?? [];
    const lines: string[] = [];
    const next = [...items];
    for (const it of add) {
      if (items.some((x) => x._key === it._key || x.cta?.href === it.cta.href)) { already++; continue; }
      next.push(it);
      lines.push(`  + tab "${it.name}" → ${it.cta.href}: ${it.body}`);
    }
    if (!lines.length) continue;
    changes += lines.length;
    console.log(`\n${doc._id} (${items.length} → ${next.length} tabs)\n${lines.join("\n")}`);
    if (write)
      await client.patch(doc._id).ifRevisionId(doc._rev).set({ [`sections[_key=="components"].items`]: next }).commit();
  }
}
console.log(`\n${changes} tab(s) ${write ? "WRITTEN" : "to add (dry run — add --write)"}; ${already} already there.`);
if (manual.length) console.log("\nCheck by hand:\n  " + manual.join("\n  "));
