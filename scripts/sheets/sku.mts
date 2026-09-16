/**
 * The SKU page (sheets 32 + 34): one applier over the 31 part sheets.
 *
 * Sheet 32 rewrote the template — the shared boilerplate is in SkuBlocks'
 * SAMPLE block; each part sheet (34_SKU_Sheets) then writes the page
 * section by section. The sheets' "Ships as" cells are the copy; a cell
 * that reads "[no change]" (or the generator's U+0001 byte) keeps the live
 * value, an empty or "Remove" cell drops the row. On the sheets written
 * before the format rule (01–18) a cell may still carry its rationale after
 * an em dash; `shipped()` strips a trailing segment that reads as one.
 */

import { z } from "zod";
import { skuSchema } from "../../src/content/schemas/index.ts";
import { stripNullsDeep } from "../../src/content/blocks.ts";
import { applyDocument, client, field, lit, loadSheet, paragraphs, rows } from "./lib.mts";
import type { Section } from "./lib.mts";

/** The raw document, reshaped as the route's GROQ does (router rows are `{cells}`). */
export const skuDocSchema = z.preprocess((raw) => {
  const d = stripNullsDeep(raw) as { compoundRouter?: { columns: string[]; rows: { cells: string[] }[] } };
  return d.compoundRouter
    ? { ...d, compoundRouter: { columns: d.compoundRouter.columns, rows: d.compoundRouter.rows.map((r) => r.cells) } }
    : d;
}, skuSchema.passthrough());

const NO_CHANGE = (v: string) => v.charCodeAt(0) === 1 || /^\[no change/i.test(v.trim());
const REMOVED = (v: string) => !v.trim() || /^remove\b/i.test(v.trim()) || /^—$/.test(v.trim());
/**
 * A Live | Ships as pair. The generator's U+0001 means "nothing to write":
 * the live value stays where it was not struck through, and a struck live
 * value (which the parser blanks) is gone.
 */
const resolve = (live: string, ships: string) => (NO_CHANGE(ships) ? live.trim() : shipped(ships));

/** Rationale left inside a cell after an em dash (sheets 01–18, retrofit pending). */
const RATIONALE =
  /\b(this part|this page|the one page|the live|live page|which covers|company profile|see the|or remove|or hide|publish it|nearly a|because |the number that|which is|since the|not a |worth |the page|the template|client-instructed)\b/i;
export function shipped(cell: string): string {
  const parts = cell.split(/\s+—\s+/);
  const kept = [parts[0]];
  for (const p of parts.slice(1)) {
    if (RATIONALE.test(p)) break;
    kept.push(p);
  }
  return kept
    .join(" — ")
    .replace(/\s*\[[^\]]*\]\s*$/, "")
    .replace(/^🛑\s*/, "")
    .trim();
}

/**
 * A selector reason or card body may end with a sentence about the live
 * page ("Currently offered on this page", "Absent from every selector on
 * this site"); that is the sheet talking to the developer, not the buyer.
 * The severity glyph goes with it.
 */
const LIVE_NOTE = /\b(live page|live selector|live menu|on this page|on this site|every selector on this site|the sheet|currently offered|pre-selected)\b/i;
export function buyerCopy(text: string): string {
  return text
    .replace(/🛑\s*/g, "")
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((sentence) => {
      const m = LIVE_NOTE.exec(sentence);
      if (!m) return sentence;
      // Keep the clause before the note where the sentence has one:
      // "No oil resistance at all, and it is on the live menu…".
      const head = sentence.slice(0, m.index);
      const cut = Math.max(head.lastIndexOf(", and "), head.lastIndexOf(" — "), head.lastIndexOf("; "));
      return cut > 0 ? head.slice(0, cut).replace(/[,;\s]+$/, "") + (/[.!?]$/.test(sentence) ? "." : "") : "";
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

const has = (sec: Section, label: string) =>
  sec.fields.some((f) => f.label.toLowerCase().startsWith(label.toLowerCase()));

/** The icon a card title takes. */
const ICON: [RegExp, string][] = [
  [/automotive|vehicle|glazing/i, "gear"],
  [/heavy|plant|machinery|industr/i, "factory"],
  [/oil|gas|energy|hydrocarbon|generator|compressor/i, "bolt"],
  [/infrastructure|construction|building|site/i, "crane"],
  [/electrical|enclosure|panel|cabinet/i, "layers"],
  [/agri|tractor|harvester/i, "globe"],
  [/rail|bus|coach|transport|commercial vehicle/i, "ship"],
];
const iconFor = (title: string) => ICON.find(([re]) => re.test(title))?.[1] ?? "gear";

/** Sheets 01–20: Card | Decision — the instruction carries the copy in quotes or after a colon. */
export function decisionCard(card: string, decision: string): { name: string; body: string } | null {
  if (/^🛑?\s*remove\b/i.test(decision)) return null;
  let name = card.replace(/\s*\[new( lead)?\]\s*$/, "");
  if (name.includes("→")) name = name.split("→").pop()!.trim();
  const retitle = decision.match(/Retitle to “([^”]+)”/);
  if (retitle) name = retitle[1];
  // The template's two retitles (sheet 32 §06) unless the part says otherwise.
  else if (name === "Energy & Oil") name = "Oil & Gas";
  else if (name === "Construction") name = "Infrastructure";
  const ships = decision.match(/Ships as[:]? “([^”]+)”/);
  if (ships) return { name, body: cap(ships[1]) };
  const quoted = decision.match(/“([^”]+)”/);
  if (quoted && !retitle) return { name, body: cap(quoted[1]) };
  const after = decision.match(/(?:narrow(?: it)?(?: to)?|specific|Add\.|lead and narrow|make it \w+):?\s*(.+)$/i);
  if (after) return { name, body: cap(firstSentence(after[1])) };
  return { name, body: cap(firstSentence(decision.replace(/^(Keep[^.:]*[.:]\s*)/i, ""))) };
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const firstSentence = (s: string) => s.split(/(?<=[a-z0-9)”])\.\s+(?=[A-Z])/)[0].replace(/\.$/, "");

/** The live six steps (sheet 32 §07), for a sheet that keeps one or writes only its body. */
const LIVE_STEPS = [
  { name: "Material Compounding", body: "Raw polymer blending, additive integration and batch QC testing in our in-house lab." },
  { name: "Mould Design & CNC", body: "Precision steel tooling manufactured in-house and held as a controlled record." },
  { name: "Compression Moulding", body: "Hydraulic press cycles at controlled temperature and pressure profiles per product spec." },
  { name: "Post-Cure & Trimming", body: "Oven post-cure for dimensional stability, followed by flash trimming." },
  { name: "Quality Inspection", body: "Dimensional check, hardness testing and batch sampling before release." },
  { name: "Export Packaging", body: "Industrial packing with documentation for international shipping. ISPM-15 treated pallets where timber packaging is used." },
];

/**
 * Sheets 01–20 write section 05 as Card | Decision, with the shipped copy
 * inside the instruction. Read once and set down here, card by card, so
 * nothing is guessed at run time: a card the sheet keeps unchanged carries
 * the live body; a card whose copy the sheet only describes ("add, with the
 * caveat") is left out and listed in OPEN-ITEMS.
 */
const DECISION_CARDS: Record<string, { name: string; body: string }[]> = {
  "SKU_01_ac-vibration-weight": [
    { name: "Automotive", body: "Seals, mounts, vibration dampers" },
    { name: "Heavy Industry", body: "Conveyor liners, impact buffers" },
    { name: "Oil & Gas", body: "Static seals and gaskets for surface equipment" },
    { name: "Infrastructure", body: "Sealing profiles, pads and gaskets for plant and building services" },
  ],
  "SKU_03_bumper-stopper": [
    { name: "Automotive", body: "Seals, mounts, vibration dampers" },
    { name: "Heavy Industry", body: "Panel and access-door stops on plant, and buffers on conveyors and material-handling equipment" },
    { name: "Infrastructure", body: "Panel, access-door and hatch stops on site cabinets and enclosures" },
  ],
  "SKU_06_aem-insulation-bush": [
    { name: "Automotive", body: "Engine bay, turbo and transmission positions" },
    { name: "Oil & Gas", body: "Static seals and bushes for hot-oil surface equipment" },
    { name: "Heavy Industry", body: "Bushes and mounts near engines, compressors and hydraulic packs, where ambient temperature is the constraint" },
    { name: "Infrastructure", body: "Plant and generator-set mounting bushes" },
  ],
  "SKU_07_c-pillar-garnish": [
    { name: "Automotive", body: "Trim and body sealing — pillars, garnishes, tailgates and lamp housings" },
    { name: "Infrastructure", body: "Closed-cell foam gap seals for windows, doors, panels and access covers" },
    { name: "Heavy Industry", body: "Enclosure, cabinet and access-panel gap seals on plant" },
  ],
  "SKU_08_epdm": [
    { name: "Water & Fluid Management", body: "Pipe joints, valve and pump housings, treatment skids, tanks" },
    { name: "Automotive", body: "Cooling and brake systems, body sealing and trim" },
    { name: "Heavy Industry", body: "Enclosure, cover and access-panel sealing on plant" },
    { name: "Infrastructure", body: "Pipework, window and access-cover sealing" },
  ],
  "SKU_09_foam-gaskets": [
    { name: "Electrical & Enclosures", body: "Control panels, junction boxes, outdoor cabinets, and the gasket is what carries the enclosure’s IP rating under IEC 60529" },
    { name: "Automotive", body: "Body and trim sealing, lamp housings, HVAC ducting joints — where light clamp is all that is available" },
    { name: "Heavy Industry", body: "Machine guards, access covers, acoustic and dust sealing on plant enclosures" },
    { name: "Infrastructure", body: "Expansion-gap, window and cladding sealing" },
  ],
  "SKU_10_3-pin-hole-pad": [
    { name: "Automotive", body: "Bulkhead and floor-pan harness pass-throughs, door-to-body cable transitions, lamp and switch wiring" },
    { name: "Electrical & Enclosures", body: "Control panels, junction boxes and outdoor cabinets, where the grommet is what carries the enclosure’s IP rating under IEC 60529" },
    { name: "Heavy Industry", body: "Harness entries on machine enclosures and control cabinets, where dust and washdown are the threats" },
    { name: "Infrastructure", body: "Cable entries on roadside cabinets, pump housings and site equipment" },
  ],
  "SKU_11_internal-fit": [
    { name: "Automotive", body: "Body and floor-pan holes, drain and drift holes, single-cable entries, and blanking plugs where a variant deletes an option" },
    { name: "Electrical & Enclosures", body: "Single-cable entries and unused knockouts on control panels and outdoor cabinets, where the grommet contributes to the enclosure’s IP rating under IEC 60529" },
    { name: "Heavy Industry", body: "Access and cable holes on machine guarding and control cabinets — dust and washdown" },
    { name: "Infrastructure", body: "Cable entries and blanking on roadside cabinets and site equipment" },
  ],
  "SKU_12_seal-filler-cap-o-rings": [
    { name: "Automotive", body: "Oil filler caps and necks, cam-cover and dipstick seals, fluid-reservoir caps" },
    { name: "Heavy Industry", body: "Hydraulic and pneumatic fittings, gearbox and hydraulic-reservoir caps, static seals on plant" },
    { name: "Pumps & Valves", body: "Static O-ring seals are core pump and valve hardware" },
    { name: "Infrastructure", body: "Hydraulic fittings on site plant and equipment" },
  ],
  "SKU_13_compression-pump-inlays": [
    { name: "Pumps & Valves", body: "" },
    { name: "Heavy Industry", body: "Process and transfer pumps on plant" },
    { name: "Water & Fluid Management", body: "Dosing and metering pumps on treatment skids" },
    { name: "Automotive", body: "Fluid and vacuum pumps" },
  ],
  "SKU_14_oil-seals-epdm": [
    { name: "Water & Fluid Management", body: "Treatment skids, circulation and dosing pumps, mixer shafts" },
    { name: "Pumps & Valves", body: "Rotary shaft seals are core pump hardware" },
    { name: "Automotive", body: "Coolant pumps and water-circuit shafts" },
    { name: "Heavy Industry", body: "Gearbox and drive shafts on plant running water-based or process media" },
  ],
  "SKU_15_oil-seals-fkm": [
    { name: "Automotive", body: "Engine and transmission shafts, turbocharger-adjacent seals, fuel-system components" },
    { name: "Heavy Industry", body: "Hot gearbox and drive shafts, process plant handling hydrocarbons and solvents" },
    { name: "Pumps & Valves", body: "Chemical transfer and process pumps" },
    { name: "Infrastructure", body: "Hydraulic systems on hot-running site plant" },
  ],
  "SKU_16_fkm-compression-pump-inlays": [
    { name: "Pumps & Valves", body: "" },
    { name: "Heavy Industry", body: "Chemical transfer, process and dosing pumps on plant" },
    { name: "Automotive", body: "Fuel-system and hot fluid pumps" },
    // Water & Fluid Management: the sheet asks for a card that flags FKM as
    // wrong for hot water and steam, without writing it — OPEN-ITEMS.
  ],
  "SKU_17_oil-seals-nbr": [
    { name: "Automotive", body: "Engine, gearbox, axle and wheel-end shafts, hydraulic and steering systems" },
    { name: "Heavy Industry", body: "Gearbox, drive and hydraulic shafts on plant and machinery" },
    { name: "Pumps & Valves", body: "Oil and hydraulic pump shafts" },
    // Agriculture: "add, with the caveat" — the caveat is not written — OPEN-ITEMS.
  ],
  "SKU_18_oil-seals-silicone": [
    { name: "Heavy Industry", body: "Ovens, dryers, kilns and furnace-adjacent equipment — slow-turning shafts in high ambient heat" },
    // Food & Beverage: "the card must say Margo holds no food-contact approval" — not written — OPEN-ITEMS.
    { name: "Automotive", body: "Exhaust-adjacent and engine-bay heat — not oil-wetted shafts" },
    { name: "Pumps & Valves", body: "High-temperature process pumps" },
  ],
  "SKU_19_ac-flaps": [
    { name: "Automotive", body: "Cabin pressure relief behind the rear bumper and in quarter panels, on passenger cars, vans and buses" },
    { name: "Electrical & Enclosures", body: "The same valve does the same job on an outdoor cabinet — letting warm air out while keeping rain and dust from following it back in" },
    { name: "Heavy Industry", body: "Cab ventilation on plant and agricultural machinery — where the cab is pressurised to keep dust out and the flap is what makes that work" },
    { name: "Infrastructure", body: "Ventilation flaps on site cabins and enclosures" },
  ],
  "SKU_20_big-support-pad": [
    { name: "Automotive", body: "Body and cab mounting pads on ladder-frame vehicles, radiator and fuel-tank support pads, load-bed packing" },
    { name: "Heavy Industry", body: "Machine feet and anti-vibration pads under compressors, pumps and generator sets — where the disturbing frequency governs the design" },
    { name: "Agriculture", body: "Cab and platform mounting pads on tractors and harvesters" },
    { name: "Infrastructure", body: "Plant and equipment mounting" },
  ],
};

/**
 * Sheets 01–20 were written before the format rule and a "Ships as" cell
 * there may still carry the reasoning after its value. Each such cell,
 * read once and set down as the rule would have it: the value only. A null
 * drops the row; an instruction that renames a row is applied here too.
 * Keyed by sheet number, section (hero / visual / specs / overlay) and label.
 */
const CELL: Record<string, string | null> = {
  "01|hero|HARDNESS": "To your drawing",
  "02|visual|Run length": "Cut length per set",
  "02|specs|Lead Time": "Confirmed with the quotation, from approved section drawing",
  "04|hero|HARDNESS": "60–75 Shore A typical",
  "07|hero|DENSITY": "To your specification, kg/m³",
  "07|visual|Compressed height": "What the seal becomes once the trim is clipped down",
  "07|specs|Hardness (Shore A)": null,
  "07|specs|Tensile Strength": null,
  "07|specs|Density": "To your specification, kg/m³",
  "09|hero|HARDNESS": null,
  "09|hero|TEMPERATURE": "Per sponge grade — see section 03",
  "09|visual|Run length": "Extruded sponge cord and strip are supplied by the metre",
  "09|specs|Hardness (Shore A)": null,
  "09|specs|Operating Temperature": "Per sponge grade — see section 03",
  "09|specs|Compression Set": "Tested to ASTM D1056",
  "09|specs|Cell structure": "Closed cell",
  "10|hero|HARDNESS": "50–60 Shore A typical for a pass-through grommet, 40–90 available",
  "10|hero|TEMPERATURE": "−40 to +140 °C on the default EPDM",
  "10|overlay|TENSILE": "Per compound datasheet, tested to ASTM D412",
  "10|visual|Interference": "How far each hole is undersized against its wire",
  "10|specs|Hardness (Shore A)": "50–60 typical, 40–90 available",
  "10|specs|Elongation at Break": "Per compound datasheet, ASTM D412",
  "11|specs|Hardness (Shore A)": "50–60 typical, 40–90 available",
  "12|hero|HARDNESS": "70 Shore A standard, 50–90 available",
  "12|hero|TEMPERATURE": "−30 to +120 °C on NBR; −20 to +250 °C on FKM",
  "12|specs|Elongation at Break": "Per compound datasheet, ASTM D412",
  "13|hero|HARDNESS": "40–90 Shore A, to your drawing",
  "13|overlay|TENSILE": "Per compound datasheet, ASTM D412",
  "13|specs|Tensile Strength": "Per compound datasheet, ASTM D412",
  "13|specs|Compression Set": "Tested to ASTM D395 Method B",
  "15|specs|Compression Set": "ASTM D395 Method B",
  "15|specs|Density": "Per grade datasheet",
  "15|specs|Colour Options": "Black standard; brown and green are common FKM identifiers",
  "16|hero|HARDNESS": "40–90 Shore A, to your drawing",
  "16|visual|Working compression": "Percentage of free thickness",
  "16|specs|Compression Set": "Tested to ASTM D395 Method B",
  "16|specs|Density": "Per grade datasheet",
  "16|specs|Colour Options": "Black standard; brown and green are common FKM identifiers",
  "17|hero|TEMPERATURE": "−30 to +120 °C",
  "18|hero|TEMPERATURE": "−60 to +220 °C",
  "18|overlay|TENSILE": "Per compound datasheet, ASTM D412",
  "18|specs|Tensile Strength": "Per compound datasheet, ASTM D412",
  // A cycle-life row "to your specification, tested" is the fatigue claim
  // the build instructions rule out (no rig in-house or at the partner
  // lab). Held back — OPEN-ITEMS.
  "22|hero|CYCLE LIFE": null,
  "22|specs|Cycle life": null,
};
/** Sheet 09 replaces the hardness row with compression force deflection. */
const EXTRA_SPECS: Record<string, { after: string; label: string; value: string }[]> = {
  "09": [{ after: "Material", label: "Compression force deflection (CFD)", value: "Force to compress 25%, per ASTM D1056 grade" }],
};

/**
 * The sheets link related parts at the URLs they propose for them (the
 * category moves and renames of sheet 33) or by a shortened slug. Until
 * those moves land (Phase 7) the links resolve to where the parts are.
 */
const RELATED_ALIAS: Record<string, string> = {
  "/sponge-foam-rubber/c-pillar-garnish-seal": "/gaskets/c-pillar-garnish",
  "/sponge-foam-rubber/foam-gasket": "/gaskets/foam-gaskets",
  "/sponge-foam-rubber/foam-gaskets": "/gaskets/foam-gaskets",
  "/pads-stoppers-caps/compression-pump-inlays": "/oil-seals/compression-pump-inlays",
};

export type SkuOptions = {
  stem: string;
  id: string;
  /** Existing category slug — the page's URL (moves are Phase 7). */
  category: string;
  /** Print the derived values without writing. */
  review?: boolean;
};

const COMPOUND_CODE: Record<string, string> = {
  AEM: "AEM",
  FKM: "FKM",
  Silicone: "VMQ",
  VMQ: "VMQ",
  EPDM: "EPDM",
  NBR: "NBR",
  Neoprene: "CR",
  CR: "CR",
  SBR: "SBR",
  "Natural rubber": "NR",
  "Natural Rubber": "NR",
  NR: "NR",
};

export async function applySku(o: SkuOptions): Promise<Record<string, unknown>> {
  const sheet = loadSheet(o.stem);
  const sec = (re: RegExp) => {
    const s = sheet.sections.find((x) => re.test(x.title));
    if (!s) throw new Error(`${o.stem}: no section ${re}`);
    return s;
  };
  const expect: string[] = [];
  const E = (v: string) => (expect.push(v.replace(/\*\*/g, "")), v);
  const current = (await client.fetch(`*[_id == $id][0]`, { id: o.id })) as Record<string, unknown>;
  if (!current) throw new Error(`${o.id}: no document`);
  const patch: Record<string, unknown> = {
    "seo.title": sheet.head.title,
    "seo.description": sheet.head.description,
    confirmWithMargo: [],
    // The template's boilerplate is now the sheets'; nothing older survives.
    stockLabel: undefined,
    compounds: [],
    compoundProperties: {},
    downloads: [],
  };

  /* 01 Hero, spec block & visual reference */
  const hero = sec(/^Hero/);
  // OEM pages are written twice; version A ships unless a supply agreement exists.
  const h1f = hero.fields.find((f) => /^H1( — version A)?$/.test(f.label))!;
  const h1 = h1f.kind === "heading" ? h1f.value : h1f.kind === "lit" ? h1f.value : "";
  if (!h1) throw new Error(`${o.stem}: no H1`);
  patch.h1 = E(h1);
  patch.navLabel = h1.split(" — ")[0];
  let intro = paragraphs(hero, "Intro sentence")[0];
  const fitment = hero.fields.find((f) => /^Fitment.*version A/.test(f.label));
  if (fitment?.kind === "paragraphs") intro = `${intro} ${fitment.paragraphs[0]}`;
  patch.intro = E(intro);
  patch.assurances = lit(hero, "Badges").split(" · ").map((b) => E(b));
  const qty = lit(hero, "Quantity selector").match(/^QTY \(([^)]+)\)\s*−\s*([\d,]+)\s*\+\s*(.*)$/);
  if (!qty) throw new Error(`${o.stem}: quantity selector`);
  patch.order = { unit: E(qty[1]), defaultQty: E(qty[2]), minNote: E(qty[3]) };
  const num = o.stem.slice(4, 6);
  const cell = (section: string, label: string, value: string): string | null => {
    const key = `${num}|${section}|${label}`;
    return key in CELL ? CELL[key] : value;
  };
  const specBlock = rows(hero, "Hero spec block")
    .map((r) => [r[0], cell(/^(SHORE A|TENSILE)$/.test(r[0]) ? "overlay" : "hero", r[0], resolve(r[1], r[2]))] as const)
    .filter((x): x is readonly [string, string] => x[1] !== null && !REMOVED(x[1]));
  // SHORE A and TENSILE sit on the plate; the rest are the tiles beside the H1.
  patch["gallery.overlay"] = specBlock.filter(([k]) => /^(SHORE A|TENSILE)$/.test(k)).map(([k, v]) => ({ label: E(k), value: E(v) }));
  patch.quickSpecs = specBlock.filter(([k]) => !/^(SHORE A|TENSILE)$/.test(k)).map(([k, v]) => ({ label: E(k), value: E(v) }));
  patch["gallery.thumbs"] = [];
  const vis = field(hero, "Visual reference", "composite");
  const vt = vis.parts.find((p) => p.kind === "table");
  const vp = vis.parts.find((p) => p.kind === "para");
  if (vt?.kind !== "table" || vp?.kind !== "para") throw new Error(`${o.stem}: visual reference shape`);
  const vrows = vt.rows
    .map((r) => [r[0], cell("visual", r[0], resolve(r[1], r[2]))] as const)
    .filter((x): x is readonly [string, string] => x[1] !== null && !REMOVED(x[1]));
  const cross = vrows.find(([k]) => /cross section/i.test(k));
  patch.dimensional = {
    caption: E(cross?.[0] ?? "Cross section view"),
    ...(cross ? { note: E(cross[1]) } : {}),
    tiles: vrows.filter(([k]) => !/cross section/i.test(k)).map(([k, v]) => ({ label: E(k), value: E(v) })),
    footnote: E(vp.text),
  };

  /* 02 Engineering data */
  const eng = sec(/^Engineering data/);
  const SETTINGS_ROWS = /^(Product Family|Certifications|Minimum Order)$/;
  const specs: { label: string; value: string }[] = [];
  for (const r of rows(eng, "Table")) {
    const [label, live, ships] = r;
    if (SETTINGS_ROWS.test(label)) continue;
    if (label === "Product Code") {
      // "{part.code} — or remove the row": no sheet gives a code, so the
      // row is off and whatever the record carried goes with it.
      const code = /\{part\.code\}|remove the row/i.test(ships) || NO_CHANGE(ships) ? "" : buyerCopy(shipped(ships));
      patch.productCode = code ? E(code) : undefined;
      continue;
    }
    const value = cell("specs", label, resolve(live, ships));
    if (value === null || REMOVED(value)) continue;
    specs.push({ label: E(label), value: E(value) });
    for (const x of EXTRA_SPECS[num] ?? []) if (x.after === label) specs.push({ label: E(x.label), value: E(x.value) });
  }
  patch.specs = specs;
  patch.hardness = undefined;
  patch.dimensions = undefined;

  /* 03 Rubber compound options */
  const cmp = sec(/^Rubber compound options/);
  const sel = field(cmp, "Selector", "table");
  const tempCol = sel.columns.findIndex((c) => /Temperature|As sponge|Cabin service/.test(c));
  const hardCol = sel.columns.findIndex((c) => /Hardness/.test(c));
  const whyCol = sel.columns.length - 1;
  // "EPDM closed-cell", "Silicone sponge" — a foam form of a compound.
  const codeOf = (cell: string) => {
    const base = cell.replace(/\s*\(.*\)$/, "").replace(/\s+(closed-cell|sponge)(\s+sponge)?$/i, "").trim();
    return COMPOUND_CODE[base];
  };
  const isRanking = sel.rows.every((r) => codeOf(r[1]));
  if (isRanking) {
    patch.compoundRanking = sel.rows.map((r, i) => {
      const code = codeOf(r[1])!;
      const display = r[1].replace(/\s*\(.*\)$/, "").trim();
      return {
        code,
        rank: i + 1,
        rankLabel: E(r[0].replace(/^🛑\s*/, "").trim()),
        ...(display !== code && !/^(Silicone|Neoprene|Natural rubber)$/i.test(display) ? { name: E(display) } : {}),
        ...(tempCol > 0 ? { temperature: E(r[tempCol]) } : {}),
        ...(hardCol > 0 ? { hardness: E(r[hardCol]) } : {}),
        reason: E(buyerCopy(r[whyCol])),
      };
    });
    patch.compoundRouter = undefined;
  } else {
    // A compound-variant page: the table routes, as written; the
    // severity glyphs and a trailing sheet note come off a cell.
    patch.compoundRanking = [];
    patch.compoundRouter = {
      columns: sel.columns.map((c) => E(c)),
      rows: sel.rows.map((r) => ({ cells: r.map((cell) => E(buyerCopy(cell))) })),
    };
  }

  /* 04 Why specifiers choose Margo */
  const why = sec(/^Why specifiers/);
  // "SIZE STANDARD / DIN 3760 / shaft Ø × bore Ø × width": label, figure, note.
  const chip = lit(why, "Quality chip").split("\n");
  if (chip.length < 2) throw new Error(`${o.stem}: quality chip "${chip.join(" ")}"`);
  patch.qualityChip = { label: E(chip[0]), value: E(chip[1]), ...(chip[2] ? { note: E(chip.slice(2).join(" ")) } : {}) };
  const oldAdv = ((current.advantages as { icon?: string }[]) ?? []).map((a) => a.icon);
  const ADV_ICON = ["shield", "bolt", "globe", "layers"];
  patch.advantages = rows(why, "Cards").map((r, i) => ({
    icon: oldAdv[i] ?? ADV_ICON[i] ?? "shield",
    name: E(buyerCopy(r[2])),
    body: E(buyerCopy(r[3])),
  }));

  /* 05 Global applications */
  const app = sec(/^Global applications/);
  const cards = field(app, "Cards", "table");
  let apps: { name: string; body: string }[];
  if (cards.columns[0] === "Slot") {
    // Slot | Live | Ships as — "Title — body" per row; empty slots are gone.
    apps = cards.rows
      .map((r) => r[2])
      .filter((v) => v.trim())
      .map((v) => {
        const m = v.match(/^(.*?)\s+—\s+(.*)$/);
        return m ? { name: m[1], body: m[2] } : { name: v, body: "" };
      });
  } else {
    apps = DECISION_CARDS[o.stem];
    if (!apps) throw new Error(`${o.stem}: Card | Decision layout with no set-down cards`);
    // Every set-down card must still be a card the sheet keeps, by name.
    const kept = cards.rows.filter((r) => !/^🛑?\s*remove/i.test(r[1])).map((r) => decisionCard(r[0], r[1])?.name);
    for (const a of apps) if (!kept.includes(a.name)) throw new Error(`${o.stem}: card "${a.name}" is not on the sheet`);
  }
  patch.applications = apps.map((a) => ({ icon: iconFor(a.name), name: E(a.name), body: E(a.body) }));

  /* 06 From compound to certification */
  const proc = sec(/^From compound/);
  patch.process = rows(proc, "Steps").map((r, i) => {
    const raw = r[1].trim();
    const noChange = /\[no change[^\]]*\]\s*$/i.test(raw);
    const text = raw.replace(/\s*\[[^\]]*\]\s*$/, "").trim();
    const m = text.match(/^(.*?)\s+—\s+(.*)$/);
    // "Title — body", or a sentence under the live step's title; a step
    // marked no change keeps the live body.
    if (m && m[2]) return { name: E(m[1]), body: E(cap(m[2])) };
    const name = m ? m[1] : LIVE_STEPS[i].name;
    return noChange || !text ? { name: E(name), body: E(LIVE_STEPS[i].body) } : { name: E(name), body: E(text) };
  });

  /* 07 Certified to international standards */
  const cert = sec(/^Certified/);
  // Three lines of certificate, then any roadmap lines ("IATF 16949 —
  // upgrade in progress…") as further cards and any sentences the sheet
  // adds for this part (a scope or non-claim) as the note beneath.
  const certLines = lit(cert, "Certificate block").split("\n");
  const [certName, certIssuer, certValidity] = certLines;
  const roadmap = certLines.slice(3).filter((l) => /^(IATF|ISO 14001)/.test(l));
  const noteLines = certLines.slice(3).filter((l) => !/^(IATF|ISO 14001)/.test(l));
  const certificates = [
    { name: E(certName), issuer: E(certIssuer), validity: E(certValidity) },
    // The whole line as the card's name: a standard named apart from its
    // "upgrade in progress" reads as held.
    ...roadmap.map((l) => ({ name: E(l), issuer: "", validity: "" })),
  ];
  const metrics = rows(cert, "Production metrics").map((r) => {
    const [label, live, ships] = r;
    const value = /^publish it/i.test(ships) ? live || "On request" : resolve(live, ships) || "On request";
    return { label: E(label), value: E(value) };
  });
  const bodyF = cert.fields.find((f) => f.label === "Body");
  patch.quality = {
    heading: "Certified to International Standards",
    body:
      bodyF?.kind === "paragraphs"
        ? E(bodyF.paragraphs[0])
        : "Every product leaves our facility with a documentation package — material test reports, dimensional inspection sheets and a certificate of conformance — giving traceability from raw material to finished part.",
    certificates,
    metrics,
    tour: { title: "Facility walkthrough", note: "Film pending" },
    ...(noteLines.length ? { note: E(noteLines.join(" ")) } : {}),
  };

  /* 08 Technical documentation */
  const doc = sec(/^Technical documentation/);
  const ships = field(doc, "Ships as", "composite");
  const dp = ships.parts.find((p) => p.kind === "para");
  const dl = ships.parts.find((p) => p.kind === "lit");
  if (dp?.kind !== "para" || dl?.kind !== "lit") throw new Error(`${o.stem}: documentation shape`);
  const cta = dl.value.match(/^\[\s*(.*?)\s*→\s*(\S+?)\s*\]$/);
  if (!cta) throw new Error(`${o.stem}: documentation cta "${dl.value}"`);
  patch.documentation = { body: E(dp.text), cta: { label: E(cta[1]), href: cta[2] } };

  /* 09 Technical & commercial questions */
  const faq = sec(/^Technical & commercial/);
  patch.faqs = faq.fields
    .filter((f) => /^Q\d/.test(f.label) && f.kind === "paragraphs")
    .map((f) => {
      const p = f as { paragraphs: string[]; lits?: string[] };
      if (!p.lits?.[0]) throw new Error(`${o.stem}: ${f.label} has no question`);
      return { q: E(p.lits[0]), a: E(p.paragraphs[0]) };
    });

  /* 10 You may also need */
  // SKU 12 has no related section on its sheet (a dead end the sheet names).
  const rel = sheet.sections.find((x) => /^You may also need/.test(x.title));
  const related: { slug: string }[] = [];
  if (rel && has(rel, "Cards")) {
    for (const r of rows(rel, "Cards")) {
      const m = r[1].match(/(\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)\s*$/);
      if (!m) continue;
      const path = (RELATED_ALIAS[m[1]] ?? m[1]).replace(/^\/products(?=\/)/, "");
      const [, cat, slug] = path.split("/");
      // A sibling by slug; a part elsewhere, a category or an industry by path.
      related.push({ slug: slug && cat === o.category ? slug : path.slice(1) });
    }
  }
  patch.relatedParts = related.slice(0, 4);

  /* 11 Quote CTA */
  const qcta = sec(/^Quote CTA/);
  patch.ctaBody = E(paragraphs(qcta, "Body")[0]);

  if (o.review) return patch;
  await applyDocument({ id: o.id, type: "sku", schema: skuDocSchema, patch, expect });
  return patch;
}
