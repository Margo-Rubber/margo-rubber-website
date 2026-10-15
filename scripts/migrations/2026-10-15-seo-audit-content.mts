/**
 * MIGRATION — SEO audit (15 Oct 2026): image alt text + product meta descriptions.
 *
 *   node --experimental-strip-types scripts/migrations/2026-10-15-seo-audit-content.mts           (dry run, no token needed)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-15-seo-audit-content.mts --write
 *
 * 1. ALT TEXT (imageOverride documents). The uploaded photographs carried
 *    editor labels as alt text — "Mining page — hero background", typos
 *    ("Hero Bacjkgroun", "KM Rotary Shaft Seals", a stray " T"), the oil & gas
 *    hero labelled as mining, and the shared SKU fallback photo labelled
 *    "EPDM Rotary Shaft Seals" on every part page that uses it. Alt text now
 *    says what the picture shows, in the words a buyer searches with.
 *
 * 2. META DESCRIPTIONS for the 15 categories and 29 parts, trimmed to
 *    ~140–155 characters (Google cuts at ~155-160) and led by the part, the
 *    compound/standard and "Nashik, India". No MOQ, price or temperature
 *    claims that are still awaiting sign-off.
 *
 * Only `alt` and `seo.description` are touched. A value that already matches
 * is skipped. Every patch uses ifRevisionId, so a concurrent Studio edit makes
 * the write fail rather than be overwritten.
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

// ── 1. ALT TEXT ──────────────────────────────────────────────────────────
const ALT: Record<string, string> = {
  "imageOverride-about__hero": "Margo Rubber Products manufacturing plant, Nashik",
  "imageOverride-about__founder": "Founder of Margo Rubber Products",
  "imageOverride-contact__hero": "Margo Rubber Products, rubber components manufacturer in Nashik, India",
  "imageOverride-export__market__1": "Moulded rubber components packed for export",
  "imageOverride-export__market__2": "Export market: UAE and Saudi Arabia",
  "imageOverride-export__market__5": "Export market: Malaysia",
  "imageOverride-export__market__6": "Export market: United States",
  "imageOverride-export__market__7": "Export market: Singapore",
  "imageOverride-export__market__8": "Export market: Kenya and Tanzania",

  "imageOverride-industries__agriculture": "Rubber components for agricultural machinery",
  "imageOverride-industries__agriculture__hero": "Agricultural machinery using moulded rubber seals and mounts",
  "imageOverride-industries__automotive": "Rubber components for automotive OEMs",
  "imageOverride-industries__automotive__hero": "Automotive assembly using moulded rubber bushes, seals and grommets",
  "imageOverride-industries__construction": "Rubber components for construction equipment",
  "imageOverride-industries__construction__hero": "Construction equipment using rubber mounts and seals",
  "imageOverride-industries__electrical-electronics": "Rubber components for electrical and electronics enclosures",
  "imageOverride-industries__electrical-electronics__hero": "Electrical equipment sealed with rubber gaskets and grommets",
  "imageOverride-industries__hvac": "Rubber components for HVAC equipment",
  "imageOverride-industries__hvac__hero": "HVAC units using rubber anti-vibration mounts and seals",
  "imageOverride-industries__medical-devices": "Rubber components for medical devices",
  "imageOverride-industries__medical-devices__hero": "Medical device components moulded in silicone and EPDM",
  "imageOverride-industries__mining": "Rubber components for mining equipment",
  "imageOverride-industries__mining__hero": "Mining equipment using rubber lining, skirting and mounts",
  "imageOverride-industries__oil-gas": "Rubber sealing components for oil and gas",
  // Was labelled "Mining page — hero background". If the photo itself is the
  // mining image, replace the photo in Studio too.
  "imageOverride-industries__oil-gas__hero": "Oil and gas equipment using FKM and NBR rubber seals",
  "imageOverride-industries__pumps-valves": "Rubber seals and diaphragms for pumps and valves",
  "imageOverride-industries__pumps-valves__hero": "Pumps and valves sealed with moulded rubber components",
  "imageOverride-industries__transport": "Rubber components for rail and marine transport",
  "imageOverride-industries__transport__hero": "Rail and marine equipment using rubber mounts and seals",
  "imageOverride-industries__water-fluid-management": "Rubber seals and gaskets for water and fluid management",
  "imageOverride-industries__water-fluid-management__hero": "Water and fluid systems sealed with EPDM gaskets",
  "imageOverride-products__anti-vibration-mounts__hero": "Bonded rubber anti-vibration mounts",
  "imageOverride-products__o-rings__hero": "Precision moulded rubber O-rings",
  "imageOverride-products__o-rings__material__epdm": "EPDM rubber O-rings",
  "imageOverride-home__portfolio__extrusion": "Rubber extrusion profiles",

  // The shared fallback photo on every part page without its own photograph.
  "imageOverride-sku__product": "Moulded rubber components by Margo Rubber Products",

  "imageOverride-sku__anti-vibration-mounts--ac-vibration-weight__photo": "Rubber-bonded A/C extractor damper weight",
  "imageOverride-sku__anti-vibration-mounts--bumper-stopper__photo": "Moulded rubber bumper stopper and bump stop",
  "imageOverride-sku__anti-vibration-mounts--cv-suspension-bump-stop__photo": "Commercial vehicle rubber suspension bump stop",
  "imageOverride-sku__bushes--aem-insulation-bush__photo": "AEM rubber insulator bush for high-temperature engine bay use",
  "imageOverride-sku__extrusion--rear-windscreen-glazing-rubber__photo": "EPDM rear windscreen glazing rubber profile",
  "imageOverride-sku__gaskets--epdm__photo": "Moulded EPDM rubber gaskets",
  "imageOverride-sku__grommets--3-pin-hole-pad__photo": "Three-hole rubber cable grommet",
  "imageOverride-sku__grommets--internal-fit__photo": "Internal fit rubber grommet and blanking plug",
  "imageOverride-sku__o-rings--seal-filler-cap-o-rings__photo": "Oil filler cap O-rings in NBR and FKM",
  "imageOverride-sku__oil-seals--compression-pump-inlays__photo": "Moulded rubber compression pump inlays",
  "imageOverride-sku__oil-seals--epdm__photo": "EPDM rotary shaft oil seals",
  "imageOverride-sku__oil-seals--fkm__photo": "FKM rotary shaft oil seals",
  "imageOverride-sku__oil-seals--nbr__photo": "NBR nitrile rotary shaft oil seals",
  "imageOverride-sku__oil-seals--silicone__photo": "Silicone rotary shaft oil seals",
  "imageOverride-sku__pads-stoppers-caps--ac-flaps__photo": "Moulded rubber car air extractor flap",
  "imageOverride-sku__pads-stoppers-caps--big-support-pad__photo": "Rubber anti-vibration support pad",
  "imageOverride-sku__pads-stoppers-caps--bolero-support-pad__photo": "Rubber body mount pad with bonded steel insert",
  "imageOverride-sku__pads-stoppers-caps--boot-tailgate-switch__photo": "Rubber tailgate switch boot cover",
  "imageOverride-sku__pads-stoppers-caps--c-pad__photo": "C-section slotted rubber packing pad",
  "imageOverride-sku__pads-stoppers-caps--epdm-pad__photo": "Flat EPDM rubber packing pad",
  "imageOverride-sku__pads-stoppers-caps--glove-box-stopper__photo": "Glove box rubber stopper",
  "imageOverride-sku__pads-stoppers-caps--insulator-head-cover__photo": "Rubber cylinder head cover insulator",
  "imageOverride-sku__pads-stoppers-caps--l-pad__photo": "L-section angle rubber packing pad",
  "imageOverride-sku__pads-stoppers-caps--oil-filler-cap__photo": "Moulded rubber oil filler cap",
  "imageOverride-sku__pads-stoppers-caps--radiator-shroud-flaps__photo": "Rubber radiator shroud flaps",
  "imageOverride-sku__pads-stoppers-caps--side-step-pad__photo": "Anti-slip rubber side step pad",
  "imageOverride-sku__seals--plunger-seals__photo": "Rubber plunger seals and plunger cups",
  "imageOverride-sku__sponge-foam-rubber--c-pillar-garnish-seal__photo": "EPDM foam C-pillar garnish seal",
  "imageOverride-sku__sponge-foam-rubber--foam-gaskets__photo": "Closed-cell foam rubber gaskets",
};

// ── 2. META DESCRIPTIONS ─────────────────────────────────────────────────
const CAT = (s: string) => `productCategory-${s}`;
const SKU = (s: string) => `sku-${s}`;

const DESC: Record<string, string> = {
  [CAT("anti-vibration-mounts")]: "Bonded rubber anti-vibration mounts, bump stops and buffers, moulded to your drawing in NR, Neoprene or EPDM. ISO 9001:2015 plant in Nashik, India.",
  [CAT("bellows")]: "Custom rubber bellows and boots for actuators, steering and machinery, moulded in EPDM, NBR, Neoprene or silicone. ISO 9001:2015 plant, Nashik, India.",
  [CAT("bonded-components")]: "Rubber-to-metal bonded parts cured in one cycle: mounts, bushes and dampers to your drawing. ISO 9001:2015 rubber manufacturer in Nashik, India.",
  [CAT("bushes")]: "Rubber bushes and bushings, plain or metal-bonded, moulded to your drawing in AEM, NBR, NR or Neoprene. ISO 9001:2015 manufacturer in Nashik, India.",
  [CAT("diaphragms")]: "Rubber diaphragms for pumps, valves and actuators, moulded to your stroke and pressure, fabric-reinforced on request. ISO 9001:2015, Nashik, India.",
  [CAT("extrusion")]: "Rubber extrusion profiles in EPDM, silicone and NBR: door seals, glazing rubber, cords and custom sections to your drawing. Made in Nashik, India.",
  [CAT("gaskets")]: "Custom rubber gaskets, moulded or die-cut, to ASME B16.21, EN 1514 or your drawing, in eight compounds. ISO 9001:2015 manufacturer, Nashik, India.",
  [CAT("grommets")]: "Custom rubber grommets for cables, harnesses and panels, in EPDM, NBR or Neoprene, sized to your panel and hole. ISO 9001:2015 plant, Nashik, India.",
  [CAT("leak-test-rubber")]: "Alloy wheel leak test rubber seals and pads, moulded to your test fixture for long cycle life. ISO 9001:2015 rubber manufacturer in Nashik, India.",
  [CAT("o-rings")]: "Precision O-rings to AS568, ISO 3601, JIS and DIN sizes or your drawing, in NBR, FKM, EPDM and silicone. ISO 9001:2015 manufacturer in Nashik, India.",
  [CAT("oil-seals")]: "Rotary and static oil seals to DIN 3760 and ISO 6194, in NBR, FKM, AEM, EPDM and silicone. ISO 9001:2015 oil seal manufacturer in Nashik, India.",
  [CAT("pads-stoppers-caps")]: "Rubber pads, stoppers, caps and flaps moulded to your drawing, including body mount pads and glove box stoppers. ISO 9001:2015 plant, Nashik, India.",
  [CAT("rubber-lining")]: "Rubber lining and conveyor skirting cut to your drawing for chutes, hoppers and belts, in abrasion-resistant compounds. Made in Nashik, India.",
  [CAT("seals")]: "Reciprocating rubber seals for rods, pistons and plungers, compound chosen for the fluid you pump. ISO 9001:2015 seal manufacturer in Nashik, India.",
  [CAT("sponge-foam-rubber")]: "Closed and open cell sponge and foam rubber: gaskets, strips and seals to ASTM D1056, die-cut or moulded. ISO 9001:2015 plant in Nashik, India.",

  [SKU("anti-vibration-mounts--ac-vibration-weight")]: "Rubber-bonded A/C extractor damper weight that stops cabin vent flaps fluttering and buzzing. Moulded to your drawing at our Nashik plant, ISO 9001:2015.",
  [SKU("anti-vibration-mounts--bumper-stopper")]: "Moulded rubber bumper stoppers and bump stops for bonnets, boot lids, doors and panels, in NR or EPDM. Made to drawing in Nashik, India.",
  [SKU("anti-vibration-mounts--cv-suspension-bump-stop")]: "Rubber suspension bump stops for commercial vehicle axles, cabs and load bodies, bonded to bracket. Moulded to drawing in Nashik, India.",
  [SKU("bushes--aem-insulation-bush")]: "AEM rubber insulator bush for hot, oily engine-bay positions, -40 to +160 °C continuous. Moulded to your drawing in Nashik, India. ISO 9001:2015.",
  [SKU("extrusion--rear-windscreen-glazing-rubber")]: "EPDM rear windscreen glazing rubber that seals the backlight against water and wind noise. Extruded and corner-moulded to drawing in Nashik, India.",
  [SKU("gaskets--epdm")]: "EPDM rubber gaskets for weather, steam and water service, -40 to +140 °C, to ASME B16.21, AWWA C111, EN 681-1 or your drawing. Made in Nashik, India.",
  [SKU("grommets--3-pin-hole-pad")]: "Three-hole rubber cable grommet that seals a harness through a panel against water and dust, in EPDM, NBR or Neoprene. Made in Nashik, India.",
  [SKU("grommets--internal-fit")]: "Internal fit rubber grommets held by their own groove, open or blanking, in EPDM, NBR or Neoprene, sized to your panel. Made in Nashik, India.",
  [SKU("o-rings--seal-filler-cap-o-rings")]: "Oil filler cap O-rings in NBR or FKM, to ISO 3601 and AS568 sizes or your drawing. ISO 9001:2015 O-ring manufacturer in Nashik, India.",
  [SKU("oil-seals--compression-pump-inlays")]: "Moulded rubber compression pump inlays in silicone, FKM or NBR, chosen for heat, chemicals or oil. Made to drawing or sample in Nashik, India.",
  [SKU("oil-seals--epdm")]: "EPDM rotary shaft oil seals for water, coolant, steam and glycol to +140 °C, DIN 3760 and ISO 6194 sizes. Not for mineral oil. Made in Nashik.",
  [SKU("oil-seals--fkm")]: "FKM (Viton) rotary shaft oil seals for heat, fuel and aggressive chemicals, DIN 3760 and ISO 6194 sizes. ISO 9001:2015 manufacturer, Nashik, India.",
  [SKU("oil-seals--nbr")]: "NBR nitrile rotary shaft oil seals for engine and gearbox oil to +120 °C, DIN 3760 and ISO 6194 sizes. ISO 9001:2015 manufacturer in Nashik, India.",
  [SKU("oil-seals--silicone")]: "Silicone rotary shaft oil seals for -60 to +220 °C on slow-turning shafts, DIN 3760 and ISO 6194 sizes. Not for mineral oil. Made in Nashik, India.",
  [SKU("pads-stoppers-caps--ac-flaps")]: "Moulded EPDM car air extractor flaps: one-way cabin pressure relief that keeps water, dust and road noise out. Made to drawing in Nashik, India.",
  [SKU("pads-stoppers-caps--big-support-pad")]: "Rubber support pads specified on load and deflection, in NR, Neoprene or EPDM, plain or with bonded metal inserts. Moulded in Nashik, India.",
  [SKU("pads-stoppers-caps--bolero-support-pad")]: "Rubber body mount pads to suit the Mahindra Bolero, with bonded steel insert, in NR or Neoprene, to original dimensions. Moulded in Nashik, India.",
  [SKU("pads-stoppers-caps--boot-tailgate-switch")]: "Moulded EPDM rubber boot for tailgate and boot release switches: seals out water and dust and still presses with a glove. Made in Nashik, India.",
  [SKU("pads-stoppers-caps--c-pad")]: "C-section slotted rubber packing pads that slide in beside a bolt or shaft, sized on load, deflection and slot width. Moulded in Nashik, India.",
  [SKU("pads-stoppers-caps--epdm-pad")]: "Flat moulded EPDM rubber packing pads sized on the load they carry and the deflection you allow, in any of eight compounds. Made in Nashik, India.",
  [SKU("pads-stoppers-caps--glove-box-stopper")]: "Glove box rubber stoppers and interior closure bumpers with a damped close, no rattle and low odour. Moulded to drawing in Nashik, India.",
  [SKU("pads-stoppers-caps--insulator-head-cover")]: "Rubber cylinder head cover insulators that damp cam cover noise, in AEM for hot oil-mist service. Moulded to your drawing in Nashik, India.",
  [SKU("pads-stoppers-caps--l-pad")]: "L-section angle rubber packing pads that carry load in one plane and locate in the other, angle held to tolerance. Moulded in Nashik, India.",
  [SKU("pads-stoppers-caps--oil-filler-cap")]: "Moulded rubber oil filler caps for engines, gearboxes and hydraulic tanks, in NBR, sealed or vented. Made to your drawing in Nashik, India.",
  [SKU("pads-stoppers-caps--radiator-shroud-flaps")]: "Rubber and sponge radiator shroud flaps that stop cooling air bypassing the core, self-adhesive on request. Made to drawing in Nashik, India.",
  [SKU("pads-stoppers-caps--side-step-pad")]: "Anti-slip rubber side step pads for SUV side steps and running boards, in UV-resistant EPDM. Moulded to your drawing in Nashik, India.",
  [SKU("seals--plunger-seals")]: "Rubber plunger seals and plunger cups for dosing pumps and sprayers, bonded to the stem on request, compound chosen for the fluid. Nashik, India.",
  [SKU("sponge-foam-rubber--c-pillar-garnish-seal")]: "Closed-cell EPDM foam C-pillar garnish seals that stop trim buzz, wind noise and water at low closing force. Made to drawing in Nashik, India.",
  [SKU("sponge-foam-rubber--foam-gaskets")]: "Closed-cell foam rubber gaskets to ASTM D1056 for enclosures and light housings, in EPDM, Neoprene or silicone sponge. Made in Nashik, India.",
};

// ── run ──────────────────────────────────────────────────────────────────
type Row = { _id: string; _rev: string; value?: string | null };
let changed = 0, skipped = 0;
const problems: string[] = [];

async function apply(id: string, field: "alt" | "seo.description", next: string) {
  const projection = field === "alt" ? "alt" : "seo.description";
  const doc = await client.fetch<Row | null>(`*[_id == $id][0]{ _id, _rev, "value": ${projection} }`, { id });
  if (!doc) { problems.push(`${id}: not found — not changed`); return; }
  if (doc.value === next) { skipped++; return; }
  if (field === "seo.description" && (next.length < 120 || next.length > 160)) {
    problems.push(`${id}: description is ${next.length} chars`);
  }
  console.log(`\n${id}  [${field}]\n  − ${doc.value ?? "(none)"}\n  + ${next}${field === "seo.description" ? `  [${next.length}]` : ""}`);
  changed++;
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set({ [field]: next }).commit();
}

for (const [id, alt] of Object.entries(ALT)) await apply(id, "alt", alt);
for (const [id, d] of Object.entries(DESC)) await apply(id, "seo.description", d);

console.log(`\n${write ? "Wrote" : "Would change"} ${changed} field(s); ${skipped} already up to date.`);
if (problems.length) {
  console.log("\nCheck these:");
  for (const p of problems) console.log(`  · ${p}`);
}
if (!write) console.log("\nDry run. Re-run with --write to apply.");
