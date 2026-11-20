/**
 * MIGRATION — internal links toward the focus lines (20 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-20-focus-internal-links.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-20-focus-internal-links.mts --write
 *
 * Why: a live crawl on 20 Nov counted the links in each page's content (not
 * the menu). /products/seals had 3, /products/diaphragms 8, the AEM insulator
 * bush (Margo's best non-brand ranking) 7, and the home page linked to rubber
 * mats and sponge but not to seals or diaphragms. Focus lines per Ayyaz,
 * 20 Nov: O-rings, oil seals (static, metal bonded), dynamic seals, sealing,
 * bushes (incl. cushion), support pads, grommets, gaskets (metal bonded),
 * diaphragms, profiles, cords. Generic bonded and mats excluded; sponge minimum.
 *
 *  1. Category "related products": focus lines link to each other; links from
 *     focus pages to sponge / bonded components are swapped for focus lines.
 *  2. Home portfolio tiles: focus lines first, mats and sponge last; tile
 *     names and spec lines carry the focus words. Same twelve tiles and
 *     images, so no new image slot is needed.
 *  3. Products hub: the seals card reads "Dynamic Seals".
 *  4. Part pages "You may also need" (max 4): sponge and bonded links on
 *     focus parts are swapped for focus parts; the empty list on the oil
 *     filler cap O-ring page is filled.
 *
 * Every change states the exact current value; anything that differs is
 * listed under "Check by hand" and skipped. ifRevisionId on every write;
 * drafts patched too. Idempotent.
 */
import { createClient } from "@sanity/client";

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

type Doc = { _id: string; _rev: string; [k: string]: any };
const manual: string[] = [];
let changes = 0;
let already = 0;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

async function docsFor(id: string): Promise<Doc[]> {
  const d: Doc[] = await client.fetch(`*[_id in [$id, "drafts." + $id]]`, { id });
  if (!d.length) manual.push(`${id}: not found`);
  return d;
}
async function commit(doc: Doc, set: Record<string, unknown>, lines: string[]) {
  if (!lines.length) return;
  changes += lines.length;
  console.log(`\n${doc._id}\n${lines.join("\n")}`);
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit();
}

/* 1 ── related.products on categories ─────────────────────────────────── */
const RELATED: Record<string, [string[], string[]]> = {
  "bushes": [["anti-vibration-mounts", "oil-seals"], ["pads-stoppers-caps", "anti-vibration-mounts", "oil-seals"]],
  "o-rings": [["oil-seals"], ["oil-seals", "seals", "gaskets"]],
  "oil-seals": [["o-rings"], ["o-rings", "seals", "bushes"]],
  "gaskets": [["o-rings", "oil-seals"], ["o-rings", "oil-seals", "extrusion"]],
  "extrusion": [["sponge-foam-rubber", "gaskets"], ["gaskets", "o-rings", "grommets"]],
  "pads-stoppers-caps": [["anti-vibration-mounts", "grommets"], ["bushes", "anti-vibration-mounts", "grommets"]],
  "diaphragms": [["bellows", "gaskets", "o-rings"], ["seals", "o-rings", "gaskets"]],
  "grommets": [["bushes", "extrusion"], ["bushes", "extrusion", "o-rings"]],
  "bellows": [["oil-seals", "grommets"], ["oil-seals", "grommets", "seals"]],
  "rubber-lining": [["bonded-components", "sponge-foam-rubber", "anti-vibration-mounts"], ["anti-vibration-mounts", "gaskets", "extrusion"]],
  "sponge-foam-rubber": [["extrusion", "gaskets"], ["extrusion", "gaskets"]],
};
for (const [slug, [from, to]] of Object.entries(RELATED)) {
  for (const doc of await docsFor(`productCategory-${slug}`)) {
    const cur = doc.related?.products ?? [];
    if (same(cur, to)) { already++; continue; }
    if (!same(cur, from)) { manual.push(`${doc._id} related.products is ${JSON.stringify(cur)}`); continue; }
    await commit(doc, { "related.products": to }, [`  related.products\n    - ${from.join(", ")}\n    + ${to.join(", ")}`]);
  }
}

/* 2 ── home portfolio: order, names, spec lines ───────────────────────── */
const HOME_ORDER = [
  "bushes-bushings", "o-rings", "oil-seals", "grommets", "gaskets", "pads-stoppers-caps",
  "extrusion-profiles", "anti-vibration-mounts", "bellows", "leak-test-rubber", "sponge-foam-rubber", "rubber-mats",
];
const HOME_EDIT: Record<string, { name?: [string, string]; spec?: [string, string] }> = {
  "bushes-bushings": { name: ["Bushes & Bushings", "Rubber Bushes"], spec: ["SUSPENSION / CENTRE / FLANGED", "CUSHION / SILENT-BLOCK / FLANGED"] },
  "o-rings": { spec: ["AS568 / ISO 3601 / METRIC", "AS568 / FOOD GRADE / CORD"] },
  "oil-seals": { spec: ["ROTARY SHAFT / LIP / FKM", "STATIC / METAL BONDED / ROTARY"] },
  "gaskets": { spec: ["FLAT / PROFILE / FOAM", "FLAT / METAL BONDED / PROFILE"] },
  "pads-stoppers-caps": { name: ["Pads, Stoppers & Caps", "Support Pads, Stoppers & Caps"], spec: ["BUMPER / DUST / PROTECTIVE", "SUPPORT PAD / STOPPER / CAP"] },
  "extrusion-profiles": { name: ["Extrusion Profiles", "Rubber Profiles & Cords"] },
};
for (const doc of await docsFor("homePage-home")) {
  const items: any[] = doc.portfolio?.items ?? [];
  const keys = items.map((i) => i._key);
  if (keys.length !== HOME_ORDER.length || !HOME_ORDER.every((k) => keys.includes(k))) {
    manual.push(`${doc._id} portfolio tiles are ${keys.join(", ")}`);
    continue;
  }
  const lines: string[] = [];
  const next = HOME_ORDER.map((k) => {
    const it = { ...items.find((i) => i._key === k) };
    for (const f of ["name", "spec"] as const) {
      const e = HOME_EDIT[k]?.[f];
      if (!e) continue;
      if (it[f] === e[1]) continue;
      if (it[f] !== e[0]) { manual.push(`${doc._id} tile ${k} ${f} is "${it[f]}"`); continue; }
      lines.push(`  tile ${k} ${f}: "${e[0]}" → "${e[1]}"`);
      it[f] = e[1];
    }
    return it;
  });
  if (!same(keys, HOME_ORDER)) lines.unshift(`  tile order\n    - ${keys.join(", ")}\n    + ${HOME_ORDER.join(", ")}`);
  if (!lines.length) { already++; continue; }
  await commit(doc, { "portfolio.items": next }, lines);
}

/* 3 ── products hub: seals card ───────────────────────────────────────── */
for (const doc of await docsFor("productsHub-products")) {
  const json = JSON.stringify(doc);
  const paths: Record<string, unknown> = {};
  const lines: string[] = [];
  // find the rangeCard with slug "seals" wherever it sits
  const walk = (o: any, base: string) => {
    if (Array.isArray(o)) o.forEach((v, i) => walk(v, `${base}[${v?._key ? `_key=="${v._key}"` : i}]`));
    else if (o && typeof o === "object") {
      if (o._type === "rangeCard" && o.slug === "seals") {
        const edits: [string, string, string][] = [
          ["title", "Reciprocating Seals", "Dynamic Seals"],
          ["kicker", "RECIPROCATING SEALS FOR RODS, PISTONS AND PLUNGERS", "DYNAMIC SEALS FOR RODS, PISTONS AND PLUNGERS"],
        ];
        for (const [f, a, b] of edits) {
          if (o[f] === b) continue;
          if (o[f] !== a) { manual.push(`${doc._id} seals card ${f} is "${o[f]}"`); continue; }
          paths[`${base}.${f}`] = b;
          lines.push(`  seals card ${f}: "${a}" → "${b}"`);
        }
        return;
      }
      for (const [k, v] of Object.entries(o)) if (!k.startsWith("_")) walk(v, base ? `${base}.${k}` : k);
    }
  };
  walk(doc, "");
  if (!json.includes('"slug":"seals"')) manual.push(`${doc._id}: no seals card`);
  if (!lines.length) { already++; continue; }
  await commit(doc, paths, lines);
}

/* 4 ── part pages: "You may also need" ────────────────────────────────── */
const PARTS: Record<string, [string[], string[]]> = {
  "o-rings--seal-filler-cap-o-rings": [[], ["oil-seals/nbr", "seals/plunger-seals", "gaskets/epdm", "grommets/internal-fit"]],
  "grommets--3-pin-hole-pad": [
    ["internal-fit", "o-rings/seal-filler-cap-o-rings", "gaskets/epdm", "sponge-foam-rubber/foam-gaskets"],
    ["internal-fit", "o-rings/seal-filler-cap-o-rings", "gaskets/epdm", "bushes/aem-insulation-bush"]],
  "grommets--internal-fit": [
    ["3-pin-hole-pad", "o-rings/seal-filler-cap-o-rings", "gaskets/epdm", "sponge-foam-rubber/foam-gaskets"],
    ["3-pin-hole-pad", "o-rings/seal-filler-cap-o-rings", "gaskets/epdm", "bushes/aem-insulation-bush"]],
  "gaskets--epdm": [
    ["oil-seals/epdm", "sponge-foam-rubber/foam-gaskets", "sponge-foam-rubber/c-pillar-garnish-seal", "o-rings/seal-filler-cap-o-rings"],
    ["oil-seals/epdm", "seals/plunger-seals", "grommets/internal-fit", "o-rings/seal-filler-cap-o-rings"]],
  "extrusion--rear-windscreen-glazing-rubber": [
    ["sponge-foam-rubber/c-pillar-garnish-seal", "sponge-foam-rubber/foam-gaskets", "gaskets/epdm", "grommets/internal-fit"],
    ["edge-trim", "o-rings/seal-filler-cap-o-rings", "gaskets/epdm", "grommets/internal-fit"]],
  "pads-stoppers-caps--epdm-pad": [
    ["c-pad", "l-pad", "big-support-pad", "sponge-foam-rubber/foam-gaskets"],
    ["c-pad", "l-pad", "big-support-pad", "bushes/aem-insulation-bush"]],
  "pads-stoppers-caps--ac-flaps": [
    ["grommets/3-pin-hole-pad", "grommets/internal-fit", "sponge-foam-rubber/c-pillar-garnish-seal", "gaskets/epdm"],
    ["grommets/3-pin-hole-pad", "grommets/internal-fit", "bushes/aem-insulation-bush", "gaskets/epdm"]],
  "pads-stoppers-caps--big-support-pad": [
    ["bolero-support-pad", "anti-vibration-mounts/ac-vibration-weight", "anti-vibration-mounts/bumper-stopper", "epdm-pad"],
    ["bolero-support-pad", "bushes/aem-insulation-bush", "anti-vibration-mounts/bumper-stopper", "epdm-pad"]],
  "pads-stoppers-caps--glove-box-stopper": [
    ["anti-vibration-mounts/bumper-stopper", "boot-tailgate-switch", "sponge-foam-rubber/c-pillar-garnish-seal", "sponge-foam-rubber/foam-gaskets"],
    ["anti-vibration-mounts/bumper-stopper", "boot-tailgate-switch", "big-support-pad", "bushes/aem-insulation-bush"]],
  "pads-stoppers-caps--radiator-shroud-flaps": [
    ["sponge-foam-rubber/foam-gaskets", "ac-flaps", "gaskets/epdm", "insulator-head-cover"],
    ["bushes/aem-insulation-bush", "ac-flaps", "gaskets/epdm", "insulator-head-cover"]],
  "oil-seals--nbr": [["fkm", "epdm", "o-rings/seal-filler-cap-o-rings", "compression-pump-inlays"], ["fkm", "epdm", "o-rings/seal-filler-cap-o-rings", "seals/plunger-seals"]],
  "seals--plunger-seals": [["oil-seals/compression-pump-inlays", "o-rings", "oil-seals", "bonded-components"], ["oil-seals/compression-pump-inlays", "o-rings", "oil-seals", "diaphragms"]],
};
for (const [slug, [from, to]] of Object.entries(PARTS)) {
  for (const doc of await docsFor(`sku-${slug}`)) {
    const cur: any[] = doc.relatedParts ?? [];
    const curSlugs = cur.map((r) => r.slug);
    if (same(curSlugs, to)) { already++; continue; }
    if (!same(curSlugs, from)) { manual.push(`${doc._id} relatedParts is ${JSON.stringify(curSlugs)}`); continue; }
    // keep the existing entry (and its "difference" line) where the slug stays
    const next = to.map((s) => cur.find((r) => r.slug === s) ?? { _key: s.replace(/[^a-z0-9]/g, "-").slice(0, 40), _type: "relatedPart", slug: s });
    await commit(doc, { relatedParts: next }, [`  relatedParts\n    - ${from.join(", ") || "(empty)"}\n    + ${to.join(", ")}`]);
  }
}

console.log(`\n${changes} change(s) ${write ? "WRITTEN" : "to write (dry run — add --write)"}; ${already} already done.`);
if (manual.length) console.log("\nCheck by hand:\n  " + manual.join("\n  "));
