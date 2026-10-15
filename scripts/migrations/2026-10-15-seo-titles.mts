/**
 * MIGRATION — search-led page titles for the product categories and parts.
 *
 *   node --env-file=.env.local scripts/migrations/2026-10-15-seo-titles.mts           (dry run)
 *   node --env-file=.env.local scripts/migrations/2026-10-15-seo-titles.mts --write   (apply)
 *   then: npm run revalidate --all   (once, against the live site: SITE=https://www.margorubber.com)
 *
 * Why (Search Console, Oct 2026):
 *   · Searchers type "rubber insulator bush", "insulator bush", "rubber stopper",
 *     "boot tailgate" — the part titles read "AEM Insulation Bush | Margo", so
 *     the words they search for were missing or in a different form.
 *   · "| Margo" alone is ambiguous: "margo" / "margo company" are dominated by
 *     Margo neem soap. Every title now ends "| Margo Rubber", which ties each
 *     page to the brand searches we already win ("margo rubber products", #1).
 *
 * Rules every title follows: the phrase a buyer types first, generic part
 * words ("rubber", "manufacturer") rather than internal names, ~60 characters
 * or fewer so Google does not cut the brand off, no claims the page does not
 * make (no prices, stock, "best", "No.1").
 *
 * Only `seo.title` is touched. Safe to re-run: a document whose title already
 * matches is skipped. Patched with ifRevisionId, so a concurrent Studio edit
 * makes the write fail rather than be overwritten.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN;
if (write && !token) throw new Error("SANITY_WRITE_TOKEN is not set — run with --env-file=.env.local");

const client = createClient({
  projectId: "jyg2beas",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "published",
});

/** Product categories — matched by document _id. */
const CATEGORIES: Record<string, string> = {
  "productCategory-anti-vibration-mounts": "Anti-Vibration Mount Manufacturer India | Margo Rubber",
  "productCategory-bellows": "Rubber Bellows & Boots Manufacturer India | Margo Rubber",
  "productCategory-bonded-components": "Rubber to Metal Bonded Parts Manufacturer | Margo Rubber",
  "productCategory-bushes": "Rubber Bush & Bushing Manufacturer India | Margo Rubber",
  "productCategory-diaphragms": "Rubber Diaphragm Manufacturer India | Margo Rubber",
  "productCategory-extrusion": "Rubber Extrusion Profile Manufacturer India | Margo Rubber",
  "productCategory-gaskets": "Rubber Gasket Manufacturer India | Margo Rubber",
  "productCategory-grommets": "Rubber Grommet Manufacturer India | Margo Rubber",
  "productCategory-leak-test-rubber": "Alloy Wheel Leak Test Rubber Manufacturer | Margo Rubber",
  "productCategory-o-rings": "O-Ring Manufacturer India | AS568, ISO 3601 | Margo Rubber",
  "productCategory-oil-seals": "Oil Seal Manufacturer India | FKM, NBR Seals | Margo Rubber",
  "productCategory-pads-stoppers-caps": "Rubber Pads, Stoppers & Caps Manufacturer | Margo Rubber",
  "productCategory-rubber-lining": "Rubber Lining & Conveyor Skirting India | Margo Rubber",
  "productCategory-seals": "Plunger, Rod & Piston Seals Manufacturer | Margo Rubber",
  "productCategory-sponge-foam-rubber": "Sponge & Foam Rubber Manufacturer India | Margo Rubber",
};

/** Parts — keyed "category--slug", matched on category + slug. */
const SKUS: Record<string, string> = {
  "anti-vibration-mounts--ac-vibration-weight": "A/C Extractor Damper Weight, Rubber Bonded | Margo Rubber",
  "anti-vibration-mounts--bumper-stopper": "Rubber Bumper Stopper & Bump Stop | Margo Rubber",
  "anti-vibration-mounts--cv-suspension-bump-stop": "Commercial Vehicle Suspension Bump Stop | Margo Rubber",
  "bushes--aem-insulation-bush": "Rubber Insulator Bush, AEM High-Temperature | Margo Rubber",
  "extrusion--rear-windscreen-glazing-rubber": "Rear Windscreen Glazing Rubber Manufacturer | Margo Rubber",
  "gaskets--epdm": "EPDM Rubber Gasket Manufacturer India | Margo Rubber",
  "grommets--3-pin-hole-pad": "3-Hole Rubber Grommet, Cable Pass-Through | Margo Rubber",
  "grommets--internal-fit": "Internal Fit Rubber Grommet & Blanking Plug | Margo Rubber",
  "o-rings--seal-filler-cap-o-rings": "Oil Filler Cap O-Ring, NBR & FKM | Margo Rubber",
  "oil-seals--compression-pump-inlays": "Compression Pump Rubber Inlays | Margo Rubber",
  "oil-seals--epdm": "EPDM Oil Seal for Water, Coolant & Steam | Margo Rubber",
  "oil-seals--fkm": "FKM (Viton) Oil Seal Manufacturer India | Margo Rubber",
  "oil-seals--nbr": "NBR Nitrile Oil Seal Manufacturer India | Margo Rubber",
  "oil-seals--silicone": "Silicone Oil Seal, High-Temperature | Margo Rubber",
  "pads-stoppers-caps--ac-flaps": "Car Air Extractor Rubber Flap | Margo Rubber",
  "pads-stoppers-caps--big-support-pad": "Rubber Support Pad, Anti-Vibration | Margo Rubber",
  "pads-stoppers-caps--bolero-support-pad": "Body Mount Rubber Pad for Mahindra Bolero | Margo Rubber",
  "pads-stoppers-caps--boot-tailgate-switch": "Boot Tailgate Switch Rubber Cover | Margo Rubber",
  "pads-stoppers-caps--c-pad": "C-Pad Slotted Rubber Packing Pad | Margo Rubber",
  "pads-stoppers-caps--epdm-pad": "EPDM Rubber Pad, Flat Packing Pad | Margo Rubber",
  "pads-stoppers-caps--glove-box-stopper": "Glove Box Rubber Stopper & Bumper | Margo Rubber",
  "pads-stoppers-caps--insulator-head-cover": "Cylinder Head Cover Rubber Insulator | Margo Rubber",
  "pads-stoppers-caps--l-pad": "L-Pad Angle Rubber Packing Pad | Margo Rubber",
  "pads-stoppers-caps--oil-filler-cap": "Rubber Oil Filler Cap Manufacturer | Margo Rubber",
  "pads-stoppers-caps--radiator-shroud-flaps": "Radiator Shroud Rubber Flaps & Seals | Margo Rubber",
  "pads-stoppers-caps--side-step-pad": "Anti-Slip Rubber Side Step Pad for SUVs | Margo Rubber",
  "seals--plunger-seals": "Plunger Seals & Rubber Plunger Cups | Margo Rubber",
  "sponge-foam-rubber--c-pillar-garnish-seal": "C-Pillar Garnish Seal, EPDM Foam | Margo Rubber",
  "sponge-foam-rubber--foam-gaskets": "Closed-Cell Foam Gasket Manufacturer India | Margo Rubber",
};

type Doc = { _id: string; _rev: string; title?: string };

const MAX = 60;
let changed = 0;
let skipped = 0;
const problems: string[] = [];

async function apply(label: string, doc: Doc | null, title: string) {
  if (title.length > MAX) problems.push(`${label}: new title is ${title.length} chars (> ${MAX})`);
  if (!doc) {
    problems.push(`${label}: no published document found — not changed`);
    return;
  }
  if (doc.title === title) {
    skipped++;
    return;
  }
  console.log(`\n${label}  (${doc._id})\n  − ${doc.title ?? "(none)"}\n  + ${title}  [${title.length}]`);
  changed++;
  if (write) {
    await client.patch(doc._id).ifRevisionId(doc._rev).set({ "seo.title": title }).commit();
  }
}

for (const [id, title] of Object.entries(CATEGORIES)) {
  const doc = await client.fetch<Doc | null>(
    `*[_id == $id][0]{ _id, _rev, "title": seo.title }`,
    { id },
  );
  await apply(id, doc, title);
}

for (const [key, title] of Object.entries(SKUS)) {
  const [category, part] = key.split("--");
  // Slugs are stored either as the part alone or as "category--part"; accept both.
  const doc = await client.fetch<Doc | null>(
    `*[_type == "sku" && (slug.current == $part || slug.current == $key)
       && (!defined(category) || category == $category)][0]{ _id, _rev, "title": seo.title }`,
    { part, key, category },
  );
  await apply(`sku ${key}`, doc, title);
}

console.log(
  `\n${write ? "Wrote" : "Would change"} ${changed} title(s); ${skipped} already up to date.`,
);
if (problems.length) {
  console.log("\nCheck these:");
  for (const p of problems) console.log(`  · ${p}`);
}
if (!write) console.log("\nDry run. Re-run with --write to apply.");
