/**
 * MIGRATION — 3rd Shade fixes 3 and 15, the parts that live in Sanity
 * (5 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-05-number-first-and-titles.mts [--write]
 *
 *   · 29 catalogue parts: the top FAQ answer opens with "10,000 pieces per part
 *     number". Same terms, reordered.
 *   · 3 category pages (anti-vibration mounts, pads, rubber mats): the material
 *     section opens with the figures from its own cards.
 *   · 7 guides: the answer under the first heading opens with a figure, or with
 *     a count of what the guide lists where it has no spec to lead with.
 *   · New titles for gaskets/epdm, oil-seals/fkm and oil-seals/nbr, so they stop
 *     competing with their category pages.
 *
 * Published AND draft documents. Idempotent; ifRevisionId on every write.
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

const notVersion = '!(_id in path("versions.**"))';

// ── Part titles ──────────────────────────────────────────────────────────────
const TITLES: Record<string, string> = {
  "gaskets--epdm": "EPDM Gaskets for Water, Steam & Weather | Margo Rubber",
  "oil-seals--fkm": "FKM (Viton) Oil Seals for Heat & Fuel | Margo Rubber",
  "oil-seals--nbr": "NBR Nitrile Oil Seals, Engine & Gearbox | Margo Rubber",
};
for (const t of Object.values(TITLES)) if (t.length >= 60) throw new Error(`title too long: ${t}`);

// ── Part FAQ: the figure first ───────────────────────────────────────────────
const MOQ_OLD = "We supply in bulk. The minimum run is 10,000 pieces per part number, per compound";
const MOQ_NEW = "10,000 pieces per part number, per compound, is the minimum run";
const GLAZING_OLD =
  "We supply in bulk. For extruded profile the minimum is quoted against the die and your annual metreage rather than a piece count; for moulded parts it is 10,000 pieces per part number, per compound.";
const GLAZING_NEW =
  "10,000 pieces per part number, per compound, is the minimum for moulded parts; for extruded profile the minimum is quoted against the die and your annual metreage rather than a piece count.";

function reorderMoq(a: string): string {
  if (a.startsWith(GLAZING_OLD)) return GLAZING_NEW + a.slice(GLAZING_OLD.length);
  if (a.startsWith(MOQ_OLD)) return MOQ_NEW + a.slice(MOQ_OLD.length);
  return a;
}

// ── Category material sections ───────────────────────────────────────────────
const SECTIONS: Record<string, { from: string; to: string }> = {
  "anti-vibration-mounts": {
    from: "On a mount the compound is chosen for how it behaves under repeated load, not for what it resists chemically. Natural rubber is the default and the right answer most of the time; the others are what you move to when oil, heat or weather rules it out.",
    to: "−20 to +90 °C at 30–80 Shore A in natural rubber, the default and the right answer most of the time. On a mount the compound is chosen for how it behaves under repeated load, not for what it resists chemically; the others are what you move to when oil, heat or weather rules it out.",
  },
  "pads-stoppers-caps": {
    from: "Each catalogue component is moulded in the compound its duty calls for: EPDM where the part sees weather, water or coolant, nitrile where it sees oil, natural rubber where it takes repeated impact.",
    to: "−40 to +140 °C in EPDM where the part sees weather, water or coolant, −30 to +120 °C in nitrile where it sees oil, −20 to +90 °C in natural rubber where it takes repeated impact: each catalogue component is moulded in the compound its duty calls for.",
  },
  "rubber-mats": {
    from: "Start from what lands on the mat and the temperature, then the pattern.",
    to: "−40 to +140 °C in EPDM for sun, ozone, water and wash-down, −30 to +120 °C in NBR where oil, fuel or coolant lands on the mat. Start from what lands on the mat and the temperature, then the pattern.",
  },
};

// ── Guide answers ────────────────────────────────────────────────────────────
const GUIDES: Record<string, { from: string; to: string }> = {
  "fkm-vs-nbr-oil-seal-guide": {
    from: "Use NBR for mineral oil, fuel, grease and hydraulic fluid up to about +120 °C. It handles most oil duty in industry and costs a fraction of the alternative. Escalate to FKM when the temperature goes beyond nitrile’s range, up to about +250 °C, or when",
    to: "+120 °C, roughly, is the limit for NBR: use it up to there for mineral oil, fuel, grease and hydraulic fluid. It handles most oil duty in industry and costs a fraction of the alternative. Escalate to FKM, up to about +250 °C, when the temperature goes beyond nitrile’s range or when",
  },
  "gasket-material-selection-guide": {
    from: "Name the fluid first, then the continuous operating temperature. The fluid eliminates most compounds outright — EPDM swells in mineral oil, NBR hardens in steam — and the temperature eliminates most of what is left. NBR handles oils and fuels to about +120 °C; EPDM handles water, steam and brake fluid to about +140 °C; FKM handles aggressive media to about +250 °C at several times the cost.",
    to: "+120 °C for NBR in oils and fuels, +140 °C for EPDM in water, steam and brake fluid, +250 °C for FKM in aggressive media at several times the cost: those are the rough limits. Name the fluid first, then the continuous operating temperature. The fluid eliminates most compounds outright — EPDM swells in mineral oil, NBR hardens in steam — and the temperature eliminates most of what is left.",
  },
  "how-to-evaluate-a-rubber-manufacturer": {
    from: "Ask for the certificate number and its scope, not whether they are certified. Ask whether",
    to: "8 questions, starting with the certificate number and its scope, not whether they are certified. Ask whether",
  },
  "india-vs-china-rubber-sourcing": {
    from: "Decide it on the things that do not change. Duty positions have moved several times in 2026 and are not a durable basis for a sourcing decision. What is durable is tooling ownership, how your drawing is protected, the real minimum order, how quickly a technical question gets answered, and the total landed cost including freight, duty, inspection and the cost of a bad batch.",
    to: "5 things do not change, so decide on those: tooling ownership, how your drawing is protected, the real minimum order, how quickly a technical question gets answered, and the total landed cost including freight, duty, inspection and the cost of a bad batch. Duty positions have moved several times in 2026 and are not a durable basis for a sourcing decision.",
  },
  "o-ring-size-chart": {
    from: "Measure the inside diameter and the cross-section — the thickness of the rubber. Those two figures identify the ring in every system.",
    to: "2 measurements identify the ring in every system: the inside diameter and the cross-section, which is the thickness of the rubber.",
  },
  "rubber-to-metal-bonded-parts-guide": {
    from: "The bond is made during vulcanisation, not afterwards. The metal is degreased, roughened and coated with a primer and a bonding agent, then placed in the mould.",
    to: "4 steps, in order: the metal is degreased, roughened and coated, then moulded. The bond is made during vulcanisation, not afterwards. The coat is a primer and a bonding agent, and the coated metal is then placed in the mould.",
  },
  "silicone-vs-epdm-high-temperature-seals": {
    from: "Use EPDM for steam, hot water and anything outdoors — it is far tougher, far cheaper, and peroxide-cured grades hold steam to around +135 °C. Use silicone for dry heat above about +150 °C, where EPDM has run out, and for cold below −40 °C.",
    to: "+150 °C of dry heat, roughly, is the dividing line: above it EPDM has run out, so use silicone, which also suits cold below −40 °C. Use EPDM for steam, hot water and anything outdoors — it is far tougher, far cheaper, and peroxide-cured grades hold steam to around +135 °C.",
  },
};

type Doc = { _id: string; _rev: string; [k: string]: unknown };

async function commit(d: Doc, set: Record<string, unknown>, what: string) {
  if (!Object.keys(set).length) {
    console.log(`  ${d._id}: no change`);
    return;
  }
  console.log(`  ${d._id}: ${what}`);
  if (!write) return;
  const r = await client.patch(d._id).ifRevisionId(d._rev).set(set).commit();
  console.log(`    rev ${r._rev}`);
}

console.log(`Parts${write ? "" : " — DRY RUN"}`);
const skus = await client.fetch<(Doc & { slug: string; faqs?: { a: string }[]; title?: string })[]>(
  `*[_type == "sku" && ${notVersion}]{ _id, _rev, "slug": slug.current, faqs, "title": seo.title }`,
);
for (const d of skus) {
  const set: Record<string, unknown> = {};
  const what: string[] = [];
  const first = d.faqs?.[0]?.a;
  if (first) {
    const next = reorderMoq(first);
    if (next !== first) {
      set["faqs[0].a"] = next;
      what.push("top answer");
    } else if (!next.startsWith("10,000")) {
      console.log(`  ! ${d._id}: top answer not recognised: ${first.slice(0, 60)}`);
    }
  }
  const title = TITLES[d.slug];
  if (title && d.title !== title) {
    set["seo.title"] = title;
    what.push(`title → ${title}`);
  }
  await commit(d, set, what.join(", "));
}

console.log("Category pages");
const cats = await client.fetch<(Doc & { slug: string; sections?: { _key: string; _type: string; body?: string }[] })[]>(
  `*[_type == "productCategory" && slug.current in $slugs && ${notVersion}]{ _id, _rev, "slug": slug.current, sections }`,
  { slugs: Object.keys(SECTIONS) },
);
for (const d of cats) {
  const { from, to } = SECTIONS[d.slug];
  const s = d.sections?.find((x) => x._type === "block.materialCards");
  if (!s?.body) throw new Error(`${d._id}: no material section`);
  if (s.body.startsWith(to)) await commit(d, {}, "");
  else if (!s.body.includes(from)) console.log(`  ! ${d._id}: text changed since this was written, skipped`);
  else await commit(d, { [`sections[_key=="${s._key}"].body`]: s.body.replace(from, to) }, "material section");
}

console.log("Guides");
const guides = await client.fetch<(Doc & { slug: string; body?: { _key: string; _type: string; body?: string }[] })[]>(
  `*[_type == "resource" && slug.current in $slugs && ${notVersion}]{ _id, _rev, "slug": slug.current, body }`,
  { slugs: Object.keys(GUIDES) },
);
for (const d of guides) {
  // The guides set a non-breaking space between the figure and °C.
  const nbsp = (s: string) => s.replaceAll(" °C", " °C");
  const from = nbsp(GUIDES[d.slug].from);
  const to = nbsp(GUIDES[d.slug].to);
  const c = d.body?.find((x) => x._type === "callout");
  if (!c?.body) throw new Error(`${d._id}: no answer callout`);
  if (c.body.startsWith(to)) await commit(d, {}, "");
  else if (!c.body.includes(from)) console.log(`  ! ${d._id}: text changed since this was written, skipped`);
  else await commit(d, { [`body[_key=="${c._key}"].body`]: c.body.replace(from, to) }, "answer");
}
if (!write) console.log("Dry run. Re-run with --write.");
