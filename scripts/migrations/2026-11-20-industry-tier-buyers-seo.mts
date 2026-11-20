/**
 * MIGRATION — automotive and medical pages aimed at Tier 1 / Tier 2 buyers
 * (Ayyaz, 20 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-20-industry-tier-buyers-seo.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-20-industry-tier-buyers-seo.mts --write
 *   then: SITE=https://www.margorubber.com npm run revalidate -- --all
 *
 * Goal: leads from Tier 2 (and Tier 1) automotive and medical-equipment
 * suppliers for high-volume work. The two industry pages are retitled for
 * the buyer's search ("automotive rubber parts supplier", "Tier 1 / Tier 2",
 * "medical device rubber parts manufacturer"), the automotive page gets an
 * answer block, and both get FAQs a volume buyer asks.
 *
 * Facts used, all already on the site or in the claim rules (site.ts):
 *   - minimum run 10,000 pieces per part number, per compound
 *   - installed capacity 5 million parts a month, current about 1.5 million
 *   - quotation in 48 hours, production in three to four weeks
 *   - named accounts from site settings: Mahindra & Mahindra, Tata, Hyundai
 *     (automotive), Vactech Surgical Equipment (medical equipment)
 * No target-company names (Bosch etc. are forbidden as fabricated clients),
 * no IATF / ISO 13485 claim, no patient-contact claim. Titles ≤ 60 and
 * descriptions ≤ 155 characters (asserted below).
 *
 * Every change names the exact OLD value; a live value that differs is
 * listed under "Check by hand" and skipped. FAQs are appended by _key, so a
 * second run reports them as done. Published documents and drafts are both
 * patched; every write uses ifRevisionId.
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

type Set = [path: string, from: unknown, to: unknown];
type Sub = [path: string, from: string, to: string];
type Faq = { _key: string; _type: "faq"; q: string; a: string };
type Change = { id: string; set?: Set[]; sub?: Sub[]; faqs?: Faq[] };

const faq = (_key: string, q: string, a: string): Faq => ({ _key, _type: "faq", q, a });

const CHANGES: Change[] = [
  {
    id: "industry-automotive",
    set: [
      ["seo.title",
        "Automotive Rubber Components Manufacturer India | Margo",
        "Automotive Rubber Parts Supplier, Tier 1 & 2 India | Margo"],
      ["seo.description",
        "Moulded rubber components for automotive OEMs and Tier 1 suppliers from Nashik, India — AEM bushes, anti-vibration mounts, oil seals and seals to your drawing. ISO 9001:2015. Quote in 48 hours.",
        "High-volume rubber bushes, mounts, oil seals, O-rings and grommets for automotive OEMs, Tier 1 and Tier 2 suppliers, moulded to drawing in Nashik, India."],
      ["seo.secondaryKeywords", undefined, [
        "automotive rubber parts manufacturer india",
        "rubber parts supplier for tier 1 automotive",
        "tier 2 automotive rubber components supplier",
        "automotive rubber bushes manufacturer india",
        "automotive rubber grommets",
        "automotive oil seal manufacturer india",
        "high volume rubber moulding india",
        "automotive rubber parts manufacturer pune",
        "automotive rubber parts manufacturer nashik",
      ]],
      ["badge",
        "TIER-1 OEM SUPPLIER · DRAWING-MATCHED PRODUCTION",
        "OEM, TIER 1 & TIER 2 SUPPLY · HIGH-VOLUME PRODUCTION"],
      ["h1",
        "Rubber Parts for Automotive OEMs, Manufactured in India",
        "Automotive Rubber Parts for OEMs, Tier 1 and Tier 2 Suppliers"],
      ["h1Lines",
        ["Rubber Parts for Automotive OEMs,", "Manufactured in India"],
        ["Automotive Rubber Parts for OEMs,", "Tier 1 & Tier 2 Suppliers"]],
      ["heroAnswer", undefined,
        "Margo Rubber Products moulds automotive rubber parts for OEMs, Tier 1 and Tier 2 suppliers at its ISO 9001:2015 certified plant in Nashik, Maharashtra: rubber bushes, engine and cab mounts, oil seals, O-rings, grommets, dust boots, pads and stoppers, made to your drawing in AEM, NBR, EPDM or natural rubber. Installed capacity is 5 million parts a month, and the minimum run is 10,000 pieces per part number, per compound. Quotation in 48 hours, production in three to four weeks."],
      ["related.industries",
        ["mining", "electrical-electronics"],
        ["ev-energy-storage-renewables", "transport", "mining", "electrical-electronics"]],
    ],
    sub: [[
      "intro",
      "Moulded rubber components for powertrain, chassis, body and under-bonnet assemblies, produced to your drawing",
      "Moulded rubber components for powertrain, chassis, body and under-bonnet assemblies, supplied to OEMs, Tier 1 and Tier 2 suppliers in high volume and produced to your drawing",
    ]],
    faqs: [
      faq("tier-volume-orders",
        "Do you take high-volume orders from Tier 1 and Tier 2 suppliers?",
        "Yes. Volume work for Tier 1 and Tier 2 automotive suppliers is our main business. Installed capacity is 5 million parts a month against about 1.5 million in current production, so a new programme has room. The minimum run is 10,000 pieces per part number, per compound. Send the drawing and annual volume and we quote within 48 hours."),
      faq("tier-parts-range",
        "Which automotive rubber parts do you make for Tier 2 suppliers?",
        "Rubber bushes and silent blocks, engine, gearbox and cab mounts, bumper stoppers, oil seals, O-rings, wiring-harness and firewall grommets, dust boots and gaiters, support pads, glove-box stoppers, filler caps and A/C or radiator shroud flaps. Each is moulded to your drawing or sample in AEM, NBR, EPDM or natural rubber."),
      faq("tier-cluster-supply",
        "Can you supply plants in Pune, Chakan, Aurangabad and Mumbai?",
        "Yes. We mould at one plant in Vilholi, Nashik, within road reach of the Nashik, Pune, Chakan, Ranjangaon, Aurangabad and Mumbai automotive clusters, and despatch across India. Automotive customers include Mahindra & Mahindra, Tata and Hyundai. Production takes three to four weeks from drawing approval."),
    ],
  },
  {
    id: "industry-medical-devices",
    set: [
      ["seo.title",
        "Rubber components for medical & laboratory equipment | Margo",
        "Medical Device Rubber Parts Manufacturer India | Margo"],
      ["seo.description",
        "Rubber parts for laboratory and diagnostic equipment, moulded to drawing in EPDM, FKM or silicone at our ISO 9001:2015 plant in Nashik, India.",
        "Silicone, EPDM and FKM rubber parts for medical, laboratory and diagnostic equipment makers: O-rings, gaskets, diaphragms. Moulded to drawing in India."],
      ["seo.secondaryKeywords", undefined, [
        "medical device rubber parts manufacturer india",
        "medical equipment rubber components supplier",
        "silicone rubber parts for medical devices india",
        "medical silicone o rings manufacturer",
        "diagnostic equipment rubber seals",
        "laboratory equipment rubber gaskets",
        "steriliser door gasket manufacturer india",
      ]],
      ["badge",
        "OEM COMPONENT SUPPLIER · DRAWING-MATCHED PRODUCTION",
        "MEDICAL EQUIPMENT OEM, TIER 1 & TIER 2 SUPPLY · DRAWING-MATCHED"],
      ["h1",
        "Rubber components for medical & laboratory equipment",
        "Rubber components for medical device & laboratory equipment makers"],
      ["h1Lines",
        ["Rubber components for", "medical & laboratory equipment"],
        ["Rubber components for medical", "device & laboratory equipment makers"]],
      ["related.industries",
        ["water-fluid-management", "electrical-electronics"],
        ["food-beverage-pharma", "water-fluid-management", "electrical-electronics"]],
    ],
    sub: [[
      "heroAnswer",
      "Margo Rubber Products moulds rubber components for laboratory and diagnostic equipment at its",
      "Margo Rubber Products moulds rubber components for medical device, laboratory and diagnostic equipment makers and their Tier 1 and Tier 2 suppliers at its",
    ]],
    faqs: [
      faq("tier-medical-volume",
        "Do you supply medical equipment makers and their suppliers in volume?",
        "Yes. We mould non-patient-contact parts such as fluid-path O-rings, valve and pump diaphragms, steriliser door gaskets, port plugs and instrument feet for equipment makers and their Tier 1 and Tier 2 suppliers. Installed capacity is 5 million parts a month. Medical equipment customers include Vactech Surgical Equipment."),
      faq("tier-medical-documents",
        "What documents come with a medical equipment order?",
        "Each shipment carries the material test report, batch record and the drawing revision the parts were made to. The compound supplier’s data for silicone, EPDM or FKM is shared on request, so you can file it with the device records. Send the drawing, fluid and sterilisation method and we quote within 48 hours."),
    ],
  },
];

/* ── Guards: length and forbidden claims on every new string ───────────── */
const problems: string[] = [];
for (const c of CHANGES) {
  for (const [path, , to] of c.set ?? []) {
    for (const s of Array.isArray(to) ? to : [to]) {
      if (typeof s !== "string") continue;
      if (path === "seo.title" && s.length > 60) problems.push(`${c.id} title ${s.length} chars`);
      if (path === "seo.description" && s.length > 155) problems.push(`${c.id} description ${s.length} chars`);
      for (const h of claimHits(s)) problems.push(`${c.id} ${path}: forbidden claim "${h.match}"`);
    }
  }
  for (const [path, , to] of c.sub ?? []) for (const h of claimHits(to)) problems.push(`${c.id} ${path}: forbidden claim "${h.match}"`);
  for (const f of c.faqs ?? []) {
    if (f.a.length < 40 || f.a.length > 700) problems.push(`${c.id} faq ${f._key}: answer ${f.a.length} chars`);
    for (const h of claimHits(`${f.q} ${f.a}`)) problems.push(`${c.id} faq ${f._key}: forbidden claim "${h.match}"`);
  }
}
if (problems.length) {
  console.error("Refusing to run:\n  " + problems.join("\n  "));
  process.exit(1);
}

/* ── Apply ─────────────────────────────────────────────────────────────── */
type Doc = { _id: string; _rev: string; faqs?: Faq[]; [k: string]: unknown };
const get = (o: any, path: string) => path.split(".").reduce((x, k) => (x == null ? x : x[k]), o);
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

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
      const cur = get(doc, path);
      if (typeof cur === "string" && cur.includes(to)) { done.push(`${doc._id} ${path} (sub)`); continue; }
      if (typeof cur !== "string" || !cur.includes(from)) { manual.push(`${doc._id} ${path}: text not found: "${from.slice(0, 70)}…"`); continue; }
      setOps[path] = cur.replace(from, to);
      lines.push(`  ${path}\n    - …${from}…\n    + …${to}…`);
    }
    const have = new Set((doc.faqs ?? []).map((f) => f._key));
    const add = (c.faqs ?? []).filter((f) => {
      if (have.has(f._key)) { done.push(`${doc._id} faq ${f._key}`); return false; }
      return true;
    });
    for (const f of add) lines.push(`  faqs += ${f._key}\n    Q ${f.q}\n    A ${f.a}`);
    if (!lines.length) continue;
    changes += lines.length;
    console.log(`\n${doc._id}\n${lines.join("\n")}`);
    if (write) {
      let p = client.patch(doc._id).ifRevisionId(doc._rev);
      if (Object.keys(setOps).length) p = p.set(setOps);
      if (add.length) p = p.setIfMissing({ faqs: [] }).append("faqs", add);
      await p.commit();
    }
  }
}

console.log(`\n${changes} change(s) ${write ? "WRITTEN" : "to write (dry run — add --write)"}; ${done.length} already done.`);
if (manual.length) console.log("\nCheck by hand:\n  " + manual.join("\n  "));
