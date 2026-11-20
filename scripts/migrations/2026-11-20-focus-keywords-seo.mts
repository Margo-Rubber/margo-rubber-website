/**
 * MIGRATION — focus-line keywords (Ayyaz, 20 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-20-focus-keywords-seo.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-20-focus-keywords-seo.mts --write
 *   then: SITE=https://www.margorubber.com npm run revalidate -- --all
 *
 * Heavy SEO on: O-rings, food grade O-rings, static oil seals, metal bonded
 * oil seals, dynamic seals, sealing, rubber bushes, rubber cushion bush,
 * rubber support pad, grommets, metal bonded rubber gaskets (India),
 * diaphragms, main rubber profiles, cords.
 * Excluded from SEO: generic "bonded components" keywords and mats — they
 * lose their place in the home and products-hub snippets. Sponge: minimum
 * (dropped from the gasket intro's lead list).
 *
 * Source: Margo-Keyword-Sheet-Bushes-First-20-Nov-2026.xlsx (focus lines,
 * Search Console 20 Oct–16 Nov baseline, 19 Nov India keyword research).
 *
 * Claim rules kept: no FDA claim (food grade = "food-grade compound on
 * request", as the site already says), no MOQ wording (the old
 * "bulk … MOQ 500" secondary keywords are replaced), no "95 countries"
 * change (that wording stays by decision), titles ≤ 60 and descriptions
 * ≤ 155 characters (asserted below).
 *
 * Every change names the exact OLD value. If the live value differs, the
 * change is listed under "Check by hand" and skipped — nothing is guessed.
 * Published documents and their drafts are both patched; every write uses
 * ifRevisionId. Idempotent: a second run reports everything as done.
 */
import { createClient } from "@sanity/client";
import { claimHits } from "../../src/content/site.ts";

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

/** Set a whole field: [path, old, new]. */
type Set = [path: string, from: unknown, to: unknown];
/** Replace a substring inside a string field: [path, oldPart, newPart]. */
type Sub = [path: string, from: string, to: string];
type Change = { id: string; set?: Set[]; sub?: Sub[] };

const CHANGES: Change[] = [
  {
    id: "homePage-home",
    set: [[
      "seo.description",
      "ISO 9001:2015 certified rubber parts maker in Nashik, India. O-rings, oil seals, gaskets and mounts moulded to your drawing. Quote within 48 hours.",
      "ISO 9001:2015 rubber parts maker, Nashik, India: O-rings, oil seals, rubber bushes, grommets, gaskets and seals moulded to your drawing. Quote in 48 hours.",
    ]],
    sub: [[
      "*",
      "moulding and extruding O-rings, oil seals, gaskets and bellows to customer drawing",
      "moulding and extruding O-rings, oil seals, rubber bushes, grommets, gaskets and diaphragms to customer drawing",
    ]],
  },
  {
    id: "productsHub-products",
    set: [[
      "seo.description",
      "Sixteen custom rubber component lines moulded and extruded to your drawing in Nashik, India: O-rings, oil seals, gaskets, AV mounts, mats. ISO 9001:2015 for moulded components.",
      "Custom rubber parts moulded and extruded to your drawing in Nashik, India: O-rings, oil seals, rubber bushes, grommets, gaskets, diaphragms and profiles.",
    ]],
    sub: [[
      "intro",
      "in Nashik, India — sealing, anti-vibration, protection, continuous profile and cellular.",
      "in Nashik, India — O-rings, oil seals, dynamic seals, rubber bushes, grommets, support pads, gaskets, diaphragms, rubber profiles and cords.",
    ]],
  },
  {
    id: "productCategory-bushes",
    set: [
      ["seo.title", "Rubber Bush & Bushing Manufacturer India | Margo Rubber", "Rubber Bush & Cushion Bush Manufacturer India | Margo Rubber"],
      ["seo.description",
        "Rubber bushes and bushings, plain or metal-bonded, moulded to your drawing in AEM, NBR, NR or Neoprene. ISO 9001:2015 manufacturer in Nashik, India.",
        "Rubber bushes, cushion bushes and silent-block bushings, plain or metal-bonded, moulded to your drawing in AEM, NBR, NR or Neoprene. Nashik, India."],
      ["seo.primaryKeyword", "rubber bush bushing manufacturer India custom", "rubber bush manufacturer India"],
      ["seo.secondaryKeywords",
        ["custom bushes manufacturer ISO 9001", "bulk bushes manufacturer MOQ 500"],
        ["rubber cushion bush manufacturer", "rubber bushes manufacturer in India", "silent block bush manufacturer", "rubber insulator bush"]],
      ["h1", "Rubber Bushes and Bushings, Manufactured in India", "Rubber Bushes and Cushion Bushes, Manufactured in India"],
    ],
    sub: [["intro", "moulds silent-block, bonded and insulation bushes", "moulds rubber bushes — silent-block, bonded, cushion and insulation bushes —"]],
  },
  {
    id: "productCategory-o-rings",
    set: [
      ["seo.title", "O-Ring Manufacturer India | AS568, ISO 3601 | Margo Rubber", "O-Ring Manufacturer India | Food Grade, AS568 | Margo Rubber"],
      ["seo.description",
        "Precision O-rings to AS568, ISO 3601, JIS and DIN sizes or your drawing, in NBR, FKM, EPDM and silicone. ISO 9001:2015 manufacturer in Nashik, India.",
        "O-rings to AS568, ISO 3601 or your drawing in NBR, FKM, EPDM and silicone, food-grade compound on request. ISO 9001:2015 maker in Nashik, India."],
      ["seo.secondaryKeywords",
        ["custom o-ring manufacturer ISO 9001", "bulk o-ring manufacturer MOQ 500"],
        ["food grade o rings", "o ring manufacturer in India", "viton o ring manufacturer India", "o ring cord"]],
    ],
    sub: [["intro", "Tolerance follows the standard and the section.", "Food-grade O-rings are moulded on request. Tolerance follows the standard and the section."]],
  },
  {
    id: "productCategory-oil-seals",
    set: [
      ["seo.title", "Oil Seal Manufacturer India | FKM, NBR Seals | Margo Rubber", "Static & Metal Bonded Oil Seal Manufacturer India | Margo"],
      ["seo.description",
        "Rotary and static oil seals to DIN 3760 and ISO 6194, in NBR, FKM, AEM, EPDM and silicone. ISO 9001:2015 oil seal manufacturer in Nashik, India.",
        "Static, rotary and metal bonded oil seals to DIN 3760 and ISO 6194, in NBR, FKM, AEM, EPDM and silicone. ISO 9001:2015 oil seal maker, Nashik, India."],
      ["seo.secondaryKeywords",
        ["custom oil seals manufacturer ISO 9001", "bulk oil seals manufacturer MOQ 500"],
        ["static oil seal", "metal bonded oil seal manufacturer", "oil seal manufacturer in India", "fkm oil seal manufacturer India"]],
      ["h1", "Rotary and Static Oil Seals, Manufactured in India", "Static, Rotary and Metal Bonded Oil Seals, Manufactured in India"],
    ],
    sub: [["intro", "moulds rotary and static oil seals", "moulds static, rotary and metal bonded oil seals"]],
  },
  {
    id: "productCategory-seals",
    set: [
      ["seo.title", "Plunger, Rod & Piston Seals Manufacturer | Margo Rubber", "Dynamic Seals: Rod, Piston & Plunger Seals | Margo Rubber"],
      ["seo.description",
        "Reciprocating rubber seals for rods, pistons and plungers, compound chosen for the fluid you pump. ISO 9001:2015 seal manufacturer in Nashik, India.",
        "Dynamic rubber seals for rods, pistons and plungers, compound chosen for the fluid you pump. ISO 9001:2015 sealing manufacturer in Nashik, India."],
      ["seo.primaryKeyword", undefined, "dynamic seals manufacturer India"],
      ["seo.secondaryKeywords", undefined, ["rubber seals manufacturer India", "hydraulic rod seal", "piston seal manufacturer", "plunger seal"]],
      ["h1", "Reciprocating Rubber Seals for Rods, Pistons and Plungers.", "Dynamic Rubber Seals for Rods, Pistons and Plungers."],
    ],
    sub: [["intro", "**Plunger cups, U-cups, rod and piston seals, V-packings and wipers —", "**Dynamic seals — plunger cups, U-cups, rod and piston seals, V-packings and wipers —"]],
  },
  {
    id: "productCategory-grommets",
    set: [
      ["seo.primaryKeyword", "rubber grommet manufacturer India exporter", "rubber grommet manufacturer India"],
      ["seo.secondaryKeywords",
        ["custom grommets manufacturer ISO 9001", "bulk grommets manufacturer MOQ 500"],
        ["rubber grommets manufacturer in India", "wire harness grommet", "automotive rubber grommets", "cable grommet"]],
    ],
  },
  {
    id: "productCategory-pads-stoppers-caps",
    set: [
      ["seo.title", "Rubber Pads, Stoppers & Caps Manufacturer | Margo Rubber", "Rubber Support Pad & Stopper Manufacturer | Margo Rubber"],
      ["seo.description",
        "Rubber pads, stoppers, caps and flaps moulded to your drawing, including body mount pads and glove box stoppers. ISO 9001:2015 plant, Nashik, India.",
        "Rubber support pads, stoppers, caps and flaps moulded to your drawing, including body mount pads and glove box stoppers. ISO 9001:2015, Nashik, India."],
      ["seo.primaryKeyword", "rubber pads stoppers caps manufacturer India", "rubber support pad manufacturer India"],
      ["seo.secondaryKeywords",
        ["custom pads, stoppers & caps manufacturer ISO 9001", "bulk pads, stoppers & caps manufacturer MOQ 500"],
        ["rubber support pad", "anti vibration rubber pad", "rubber pad manufacturer India", "rubber stopper"]],
      ["h1", "Rubber Pads, Stoppers and Caps, Manufactured in India", "Rubber Support Pads, Stoppers and Caps, Manufactured in India"],
    ],
  },
  {
    id: "productCategory-gaskets",
    set: [
      ["seo.title", "Rubber Gasket Manufacturer India | Margo Rubber", "Rubber Gasket & Metal Bonded Gasket Manufacturer | Margo"],
      ["seo.description",
        "Custom rubber gaskets, moulded or die-cut, to ASME B16.21, EN 1514 or your drawing, in eight compounds. ISO 9001:2015 manufacturer, Nashik, India.",
        "Rubber and metal bonded gaskets, moulded or die-cut, to ASME B16.21, EN 1514 or your drawing, in eight compounds. ISO 9001:2015, Nashik, India."],
      ["seo.secondaryKeywords",
        ["custom gaskets manufacturer ISO 9001", "bulk gaskets manufacturer MOQ 500"],
        ["metal bonded rubber gasket", "rubber gasket manufacturer in India", "rubber gasket suppliers", "epdm gasket manufacturer India"]],
      ["h1", "Custom Rubber Gaskets, Manufactured in India", "Rubber and Metal Bonded Gaskets, Manufactured in India"],
    ],
    sub: [["intro", "flange, enclosure, sponge and cut-to-print profiles in eight compounds", "flange, enclosure, metal bonded and cut-to-print gaskets in eight compounds"]],
  },
  {
    id: "productCategory-diaphragms",
    set: [
      ["seo.primaryKeyword", undefined, "rubber diaphragm manufacturer India"],
      ["seo.secondaryKeywords", undefined, ["pump diaphragm manufacturer", "valve diaphragm manufacturer", "fabric reinforced rubber diaphragm"]],
    ],
  },
  {
    id: "productCategory-extrusion",
    set: [
      ["seo.title", "Rubber Extrusion Profile Manufacturer India | Margo Rubber", "Rubber Profiles, Cords & Extrusions India | Margo Rubber"],
      ["seo.description",
        "Rubber extrusion profiles in EPDM, silicone and NBR: door seals, glazing rubber, cords and custom sections to your drawing. Made in Nashik, India.",
        "Main rubber profiles and cords in EPDM, silicone and NBR: door seals, glazing rubber, solid cord and custom sections to your drawing. Nashik, India."],
      ["seo.primaryKeyword", "rubber extrusion profiles manufacturer India", "rubber profile manufacturer India"],
      ["seo.secondaryKeywords",
        ["custom rubber extruded profiles to drawing", "EPDM extrusion profile supplier"],
        ["rubber cord manufacturer India", "epdm rubber profile", "rubber extrusion manufacturer India", "silicone rubber cord"]],
      ["h1", "Rubber Extrusion Profiles, Manufactured in India", "Rubber Profiles, Cords and Extrusions, Manufactured in India"],
    ],
    sub: [["intro", "Continuous-length seals, channels and structural profiles extruded to drawing", "Main rubber profiles, solid cords, seals and channels extruded to drawing"]],
  },
  {
    id: "sku-pads-stoppers-caps--big-support-pad",
    set: [["seo.title", "Rubber Support Pad, Anti-Vibration | Margo Rubber", "Rubber Support Pad Manufacturer India | Margo Rubber"]],
  },
];

/* ── Guards: length and forbidden claims on every new string ───────────── */
const problems: string[] = [];
for (const c of CHANGES) {
  for (const [path, , to] of c.set ?? []) {
    const strs = Array.isArray(to) ? to : [to];
    for (const s of strs) {
      if (typeof s !== "string") continue;
      if (path === "seo.title" && s.length > 60) problems.push(`${c.id} title ${s.length} chars`);
      if (path === "seo.description" && s.length > 155) problems.push(`${c.id} description ${s.length} chars`);
      for (const h of claimHits(s)) problems.push(`${c.id} ${path}: forbidden claim "${h.match}"`);
    }
  }
  for (const [path, , to] of c.sub ?? []) for (const h of claimHits(to)) problems.push(`${c.id} ${path}: forbidden claim "${h.match}"`);
  const h1 = c.set?.find(([p]) => p === "h1");
  if (h1) (c as Change & { h1: string }).h1 = h1[2] as string;
}
if (problems.length) {
  console.error("Refusing to run:\n  " + problems.join("\n  "));
  process.exit(1);
}

/* ── Apply ─────────────────────────────────────────────────────────────── */
type Doc = { _id: string; _rev: string; [k: string]: unknown };
const get = (o: any, path: string) => path.split(".").reduce((x, k) => (x == null ? x : x[k]), o);
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Every string path in a document that contains `needle`. */
function findPaths(o: unknown, needle: string, base = ""): string[] {
  if (typeof o === "string") return o.includes(needle) ? [base] : [];
  if (Array.isArray(o))
    return o.flatMap((v, i) => {
      const key = v && typeof v === "object" && "_key" in v ? `[_key=="${(v as { _key: string })._key}"]` : `[${i}]`;
      return findPaths(v, needle, base + key);
    });
  if (o && typeof o === "object")
    return Object.entries(o).flatMap(([k, v]) => (k.startsWith("_") ? [] : findPaths(v, needle, base ? `${base}.${k}` : k)));
  return [];
}
const getByPatch = (o: any, p: string): string => {
  const parts = p.match(/[^.[\]]+|\[[^\]]+\]/g)!;
  let x = o;
  for (const part of parts) {
    if (part.startsWith("[_key==")) x = x.find((v: any) => v._key === part.slice(8, -2));
    else if (part.startsWith("[")) x = x[Number(part.slice(1, -1))];
    else x = x[part];
  }
  return x;
};

const manual: string[] = [];
const done: string[] = [];
let changes = 0;

for (const c of CHANGES) {
  const docs: Doc[] = await client.fetch(`*[_id in [$id, "drafts." + $id]]`, { id: c.id });
  if (!docs.length) { manual.push(`${c.id}: document not found`); continue; }
  for (const doc of docs) {
    const setOps: Record<string, unknown> = {};
    const lines: string[] = [];
    for (const [path, from, to] of c.set ?? []) {
      const cur = get(doc, path);
      if (same(cur, to)) { done.push(`${doc._id} ${path}`); continue; }
      if (!same(cur, from)) { manual.push(`${doc._id} ${path}: live value is ${JSON.stringify(cur)}`); continue; }
      setOps[path] = to;
      lines.push(`  ${path}\n    - ${JSON.stringify(from)}\n    + ${JSON.stringify(to)}`);
    }
    for (const [path, from, to] of c.sub ?? []) {
      const paths = path === "*" ? findPaths(doc, from) : (typeof get(doc, path) === "string" && (get(doc, path) as string).includes(from) ? [path] : []);
      const already = path === "*" ? findPaths(doc, to).length > 0 : String(get(doc, path) ?? "").includes(to);
      if (!paths.length) { if (already) done.push(`${doc._id} ${path} (sub)`); else manual.push(`${doc._id} ${path}: text not found: "${from.slice(0, 70)}…"`); continue; }
      for (const p of paths) {
        const cur = path === "*" ? getByPatch(doc, p) : (get(doc, p) as string);
        setOps[p] = cur.replace(from, to);
        lines.push(`  ${p}\n    - …${from}…\n    + …${to}…`);
      }
    }
    if (!lines.length) continue;
    changes += lines.length;
    console.log(`\n${doc._id}\n${lines.join("\n")}`);
    if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set(setOps).commit();
  }
}

console.log(`\n${changes} change(s) ${write ? "WRITTEN" : "to write (dry run — add --write)"}; ${done.length} already done.`);
if (manual.length) console.log("\nCheck by hand:\n  " + manual.join("\n  "));
