/**
 * MIGRATION — SEO audit, part 2 (15 Oct 2026).
 *
 *   node --experimental-strip-types scripts/migrations/2026-10-15-seo-audit-content-2.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-15-seo-audit-content-2.mts --write
 *
 * 1. COUNTS. The site shows 15 product lines and 11 industries, but titles,
 *    H1s and intros still said "11 lines" and "nine industries". Every
 *    occurrence in the Products and Industries hub documents is corrected.
 * 2. QUOTE TIME. The Products meta said "Quote in 24 hours"; every page body
 *    says 48. Now 48 everywhere.
 * 3. EDITOR NOTES. "Pending the … CONFIRM." sentences left in part-page
 *    process steps are removed from every part document.
 * 4. META DESCRIPTIONS for the core pages, ~140–158 characters.
 * 5. CASE STUDY 01. The empty "Nothing Published Yet" page becomes the first
 *    case study: the engine-cover insulator bush, AEM → FKM. The customer is
 *    not named. It reports what is true today — failure, root cause, the
 *    specified fix and its status — and no outcome that has not happened.
 *
 * Every write is a field-level patch with ifRevisionId; a concurrent Studio
 * edit makes it fail rather than be overwritten. Re-running is safe.
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

type Doc = { _id: string; _rev: string; [k: string]: unknown };
let changes = 0;
const problems: string[] = [];

/** JSONMatch path for Sanity patches: keyed array members by _key. */
function walk(
  value: unknown,
  path: string,
  visit: (path: string, s: string) => string | null,
  out: Record<string, string>,
) {
  if (typeof value === "string") {
    const next = visit(path, value);
    if (next !== null && next !== value) out[path] = next;
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => {
      const key = v && typeof v === "object" && "_key" in v ? `[_key=="${(v as { _key: string })._key}"]` : `[${i}]`;
      walk(v, `${path}${key}`, visit, out);
    });
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("_")) continue;
      walk(v, path ? `${path}.${k}` : k, visit, out);
    }
  }
}

async function commit(doc: Doc, set: Record<string, unknown>, label: string) {
  const entries = Object.entries(set);
  if (!entries.length) return;
  console.log(`\n${label}  (${doc._id})`);
  for (const [p, v] of entries) console.log(`  ${p}\n    + ${typeof v === "string" ? v : JSON.stringify(v)}`);
  changes += entries.length;
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit();
}

// ── 1 + 2. Counts and quote time, by phrase, anywhere in the two hubs ────
const PHRASES: Array<[RegExp, string]> = [
  [/\b11 Product Lines\b/g, "15 Product Lines"],
  [/\beleven lines of\b/g, "fifteen lines of"],
  [/\bNine Industries\b/g, "Eleven Industries"],
  [/\bnine core industries\b/g, "eleven core industries"],
  [/\bnine industries\b/g, "eleven industries"],
  [/\b9 Sectors\b/g, "11 Sectors"],
  [/\bnine sectors\b/g, "eleven sectors"],
  [/Quote in 24 hours/g, "Quote in 48 hours"],
];
for (const id of ["productsHub-products", "industriesHub-industries"]) {
  const doc = await client.fetch<Doc | null>(`*[_id == $id][0]`, { id });
  if (!doc) { problems.push(`${id}: not found`); continue; }
  const set: Record<string, string> = {};
  walk(doc, "", (_p, s) => {
    let t = s;
    for (const [re, to] of PHRASES) t = t.replace(re, to);
    return t;
  }, set);
  await commit(doc, set, "counts / quote time");
}

// ── 3. Editor notes left in part pages ───────────────────────────────────
const NOTE = /\s*Pending the [^.]*?CONFIRM\b[^.]*\.?/g;
const HAS_NOTE = /Pending the [^.]*?CONFIRM/;
const skus = await client.fetch<Doc[]>(`*[_type == "sku"]`);
for (const doc of skus) {
  const set: Record<string, string> = {};
  walk(doc, "", (_p, s) => (HAS_NOTE.test(s) ? s.replace(NOTE, "").trim() : null), set);
  await commit(doc, set, "editor note removed");
}

// ── 4. Core page meta descriptions ───────────────────────────────────────
const DESC: Record<string, string> = {
  "homePage-home": "ISO 9001:2015 rubber component manufacturer in Nashik, India. O-rings, oil seals, gaskets, mounts and extrusions moulded to your drawing. Quote in 48 hours.",
  "productsHub-products": "Fifteen custom rubber component lines moulded and extruded to your drawing in Nashik, India: O-rings, oil seals, gaskets, AV mounts. ISO 9001:2015.",
  "industriesHub-industries": "Rubber components for eleven industries: automotive, oil & gas, mining, pumps, HVAC, electrical, agriculture, medical, water, construction and transport.",
  "aboutPage-about": "Margo Rubber Products, Nashik: precision rubber moulding and extrusion since 2005. ISO 9001:2015 certified, eight compounds mixed in-house, made to drawing.",
  "certificationsPage-certifications": "Margo Rubber Products is ISO 9001:2015 certified (certificate 09111526A). Scope, validity, and the test documents supplied with every order.",
  "contactPage-contact": "Send a drawing, specification or sample to Margo Rubber Products, Nashik, India. Engineering review and quotation within 48 hours. +91 96655 79276.",
  "resourcesHub-resources": "Rubber engineering guides from Margo: O-ring size chart, FKM vs NBR oil seals, gasket material selection, silicone vs EPDM and sourcing from India.",
  "exportPage-export": "Rubber components exported from Nashik, India to 95 countries. ISO 9001:2015, with test certificate, raw material TC and pre-delivery inspection. 48 h quote.",
  "caseStudiesPage-case-studies": "Case study: an engine-cover bush failing at six months, traced to BS6 engine-bay heat above 200 °C, and the FKM compound Margo specified to fix it.",
};
for (const [id, d] of Object.entries(DESC)) {
  const doc = await client.fetch<(Doc & { d?: string }) | null>(`*[_id == $id][0]{ _id, _rev, "d": seo.description }`, { id });
  if (!doc) { problems.push(`${id}: not found`); continue; }
  if (d.length > 160) problems.push(`${id}: description ${d.length} chars`);
  if (doc.d === d) continue;
  await commit(doc, { "seo.description": d }, `meta description [${d.length}]  − ${doc.d ?? "(none)"}`);
}

// ── 5. Case study 01 ─────────────────────────────────────────────────────
type Item = { _key: string };
const cs = await client.fetch<(Doc & {
  methodology?: { items?: Item[] };
  hero?: { actions?: Item[] };
}) | null>(`*[_id == "caseStudiesPage-case-studies"][0]`);
if (!cs) problems.push("caseStudiesPage-case-studies: not found");
else {
  const items = cs.methodology?.items ?? [];
  const actions = cs.hero?.actions ?? [];
  if (items.length < 4) problems.push(`case study: expected 4 methodology items, found ${items.length} — not changed`);
  else {
    const I = (n: number, f: string) => `methodology.items[_key=="${items[n]._key}"].${f}`;
    const set: Record<string, unknown> = {
      "seo.title": "Case Study: Engine Bush, AEM to FKM | Margo Rubber",
      "hero.eyebrow": "CASE STUDY 01 · MARGO RUBBER PRODUCTS",
      "hero.h1Lines": ["Case Study 01:", "*Beating Engine-Bay Heat.*"],
      // The first paragraph (customers, tenure, repeat orders) is kept as
      // written; only the "we have no case studies" paragraph is replaced.
      "hero.paragraphs[1]": "Our first documented case: an engine-cover insulator bush failing years early on a Tier-1 Indian SUV platform — why it failed, and the compound change that fixes it. The customer is not named; the engineering is real.",
      "methodology.label": "CASE STUDY 01",
      "methodology.heading": "Engine-Cover Insulator Bush: *AEM to FKM*",
      "methodology.body": "A material upgrade on a high-volume automotive part, in four parts: what failed, why it failed, what we specified, and where it stands today.",

      [I(0, "eyebrow")]: "CHALLENGE",
      [I(0, "name")]: "A 24-Month Part Failing at Six",
      [I(0, "body")]: "Rubber insulator bushes on the engine cover of a Tier-1 Indian SUV OEM's diesel platforms were hardening and cracking at around six months in service, against a 24-month requirement. The OEM listed it among its top ten problem parts.",
      [I(0, "statValue")]: "6 of 24 months",
      [I(0, "statNote")]: "Service life reached vs. required",

      [I(1, "eyebrow")]: "ROOT CAUSE",
      [I(1, "name")]: "Engine-Bay Heat Beyond the Compound",
      [I(1, "body")]: "BS6 Phase 2 engines run hotter under the cover. Engine-bay temperatures were consistently above 200 °C, while the AEM (Vamac Ultra HT) compound in use is rated to about 175 °C continuous. The part was not defective — the compound had been outpaced by the engine.",
      [I(1, "statValue")]: ">200 °C",
      [I(1, "statNote")]: "Sustained engine-bay temperature vs. ~175 °C rating",

      [I(2, "eyebrow")]: "COMPONENT SPECIFIED",
      [I(2, "name")]: "Moving the Bush to FKM",
      [I(2, "body")]: "We specified an FKM (Viton-class) compound rated for 200–220 °C continuous service and resistant to hot oil mist, moulded to the existing bush drawing so the mating parts stay unchanged.",
      [I(2, "statValue")]: "200–220 °C",
      [I(2, "statNote")]: "FKM continuous service rating",

      [I(3, "eyebrow")]: "STATUS",
      [I(3, "name")]: "Proposed, With the Data Behind It",
      [I(3, "body")]: "The FKM upgrade has been put to the customer with the full technical and commercial case. We will publish the measured service-life result here when validation closes — the outcome, whatever it is, not a forecast.",
      [I(3, "statValue")]: "In review",
      [I(3, "statNote")]: "Result published when validation closes",
    };
    if (actions[0]) set[`hero.actions[_key=="${actions[0]._key}"].label`] = "Send Us a Problem Part";
    await commit(cs, set, "case study 01");
  }
}

console.log(`\n${write ? "Wrote" : "Would change"} ${changes} field(s).`);
if (problems.length) {
  console.log("\nCheck these:");
  for (const p of problems) console.log(`  · ${p}`);
}
if (!write) console.log("\nDry run. Re-run with --write to apply.");
