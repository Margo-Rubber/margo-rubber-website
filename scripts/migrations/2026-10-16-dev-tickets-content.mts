/**
 * MIGRATION — 3rd Shade developer tickets, content part (16 Oct 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-16-dev-tickets-content.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-16-dev-tickets-content.mts --write
 *
 * The dry run prints every change, old → new, and a "Check by hand" list of
 * anything the rules could not fix safely. Read it before --write.
 *
 *  T03  ISO 9001 is never in the same sentence as extrusion. The certificate
 *       covers moulded components only, so a sentence that claims both is
 *       split: the claim stays, the certificate moves to its own sentence,
 *       "Certified to ISO 9001:2015 for moulded rubber components."
 *       A ticker list that holds both an ISO item and an extrusion item
 *       loses the ISO item (it is stated elsewhere on the page).
 *  T05  "signature compound" sentences are removed; compounds are listed in
 *       one neutral (alphabetical) order and AEM's descriptor is neutral.
 *  T11  Eight titles, three meta descriptions and six H1s rewritten; "Medical
 *       Grade" off the medical title. Every "biocompatible" claim is LISTED
 *       for Margo to confirm or remove — not deleted (it depends on whether a
 *       USP Class VI / ISO 10993 test file exists).
 *  T12  Only the facts already decided: "eleven product lines" → 15, and
 *       AEM "rated to about 175 °C continuous" → 160 °C continuous, 175 °C
 *       peak (the figures in Site settings). "95 countries", "200+", the
 *       IATF date and the volume lines wait for Mehboob and are NOT touched.
 *  T16  "… page — hero background" alt texts emptied (decorative images).
 *  T09  Site settings get the confirmed sameAs profiles if they list none.
 *
 * Published documents AND their drafts are patched, so an open draft cannot
 * publish the old text back. Each write uses ifRevisionId: a concurrent
 * Studio edit makes it fail rather than be overwritten. Re-running is safe.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN;
if (!token) throw new Error("SANITY_WRITE_TOKEN is not set — run with --env-file=.env.local (drafts need the token even for the dry run)");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "jyg2beas",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

type Doc = { _id: string; _rev: string; _type: string; slug?: { current?: string }; [k: string]: unknown };
const manual: string[] = [];
let changes = 0;

/* ── Rules ─────────────────────────────────────────────────────────────── */

const ISO_EXTRUD = /ISO 9001(?::2015)?[^.<]{0,120}?extrud/i;
const ISO_SENTENCE = "Certified to ISO 9001:2015 for moulded rubber components.";
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/);

function isoFix(s: string): string {
  if (!ISO_EXTRUD.test(s)) return s;
  return sentences(s)
    .map((p) => {
      if (!ISO_EXTRUD.test(p)) return p;
      let q = p.replace(/\b(an?\s+)?ISO 9001(?::2015)?(?:\s+certified)?\s*/i, (_m, art?: string) => (art ? "a " : ""));
      q = q.replace(/\s{2,}/g, " ").replace(/\s+([,.;:])/g, "$1").trim();
      q = q.charAt(0).toUpperCase() + q.slice(1);
      if (!/[.!?]$/.test(q)) q += ".";
      return `${q} ${ISO_SENTENCE}`;
    })
    .join(" ");
}

const SIGNATURE = /signature (automotive )?compound/i;
const clauseFix = (s: string) =>
  s
    .replace(/\s*[—–-]\s*(still\s+)?(our|the|its)\s+signature (automotive )?compound/i, "")
    .replace(/,?\s*(is\s+)?(still\s+)?our signature (automotive )?compound,?/i, "")
    .replace(/\bsignature (automotive )?compound\b/i, "compound")
    .replace(/\s{2,}/g, " ")
    .trim();
function signatureFix(s: string, where: string): string {
  if (!SIGNATURE.test(s)) return s;
  const kept = sentences(s).filter((p) => !SIGNATURE.test(p));
  if (kept.length) return kept.join(" ");
  // The phrase IS the text (a chip, a one-sentence line): drop the words.
  const short = clauseFix(s);
  if (SIGNATURE.test(short)) manual.push(`${where}: rewrite by hand: ${s}`);
  return short;
}

function factsFix(s: string): string {
  return s
    .replace(/\beleven product lines\b/gi, "15 product lines")
    .replace(/rated to about 175\s?°C continuous/gi, "rated to 160 °C continuous and 175 °C peak")
    .replace(/rated to about 175\s?°C/gi, "rated to 160 °C continuous and 175 °C peak");
}

/** Every string in every document passes through these. */
function textRules(s: string, where: string): string {
  return factsFix(signatureFix(isoFix(s), where));
}

/* ── Page-specific copy ────────────────────────────────────────────────── */

const ROUTE: Record<string, (d: Doc) => string | null> = {
  homePage: () => "/",
  aboutPage: () => "/about",
  exportPage: () => "/export",
  productsHub: () => "/products",
  industry: (d) => `/industries/${d.slug?.current}`,
  resource: (d) => `/resources/${d.slug?.current}`,
  productCategory: (d) => `/products/${d.slug?.current}`,
};

const TITLES: Record<string, string> = {
  "/industries/construction": "Construction Rubber Seals, Glazing & Joint Profiles | Margo",
  "/industries/electrical-electronics": "Electrical Enclosure Rubber Seals & Gaskets, India | Margo",
  "/industries/pumps-valves": "Pump & Valve Seals, Gaskets & O-Rings, India | Margo",
  "/industries/transport": "Rail & Marine Rubber Seals, Mounts & Gaskets | Margo",
  "/products": "Custom Rubber Parts Manufacturer, India: 15 Lines | Margo",
  "/resources/rubber-to-metal-bonded-parts-guide": "Rubber-to-Metal Bonding: Design & Spec Guide | Margo",
  "/resources/sponge-foam-datasheet": "Sponge & Foam Rubber Datasheet: EPDM, CR, NBR | Margo",
  "/industries/medical-devices": "Silicone & Rubber Components for Medical Devices | Margo",
};

const METAS: Record<string, string> = {
  "/": "ISO 9001:2015 certified rubber parts maker in Nashik, India. O-rings, oil seals, gaskets and mounts moulded to your drawing. Quote within 48 hours.",
  "/about": "Margo Rubber Products, Nashik: precision rubber moulding and extrusion since 2005, with eight compounds mixed in-house and every part made to drawing.",
  "/export": "Rubber components shipped from Nashik, India, with test certificate, raw-material TC and pre-delivery inspection. Quote within 48 hours.",
};

/** H1 rewrites: [pattern, replacement, words the H1 must then contain]. */
const H1: Record<string, { from: RegExp; to: string; must: string[]; lines?: string[] }> = {
  "/industries/automotive": { from: /Rubber Components/i, to: "Rubber Parts", must: ["parts"] },
  "/industries/medical-devices": { from: /Rubber Components/i, to: "Silicone & Rubber Components", must: ["silicone"] },
  "/industries/pumps-valves": { from: /Rubber Components/i, to: "Rubber Seals & Components", must: ["seal"] },
  "/industries/water-fluid-management": { from: /Rubber Components/i, to: "Rubber Seals & Gaskets", must: ["seal"] },
  "/industries/transport": { from: /^$/, to: "", must: ["rail", "rubber"], lines: ["Rubber Seals and Mounts", "for Rail and Marine Builders"] },
  "/products/seals": { from: /\b(S|s)eals\b/, to: "$1eals", must: ["rubber"] },
};

/* ── Walk ──────────────────────────────────────────────────────────────── */

function walk(value: unknown, path: string, set: Record<string, unknown>, docLabel: string) {
  if (typeof value === "string") {
    if (path.endsWith("seo.title")) {
      if (ISO_EXTRUD.test(value)) manual.push(`${docLabel} ${path}: title claims ISO with extrusion — rewrite: ${value}`);
      return;
    }
    const next = textRules(value, `${docLabel} ${path}`);
    if (next !== value) set[path] = next;
    if (/MOQ\s*500|500\s*pcs/i.test(value)) manual.push(`${docLabel} ${path}: minimum of 500 pieces — check against 10,000: ${value.slice(0, 120)}`);
  } else if (Array.isArray(value)) {
    // A list of plain strings (a ticker): drop ISO items when it also lists extrusion.
    if (value.length && value.every((v) => typeof v === "string")) {
      const arr = value as string[];
      if (arr.some((v) => /extrud/i.test(v)) && arr.some((v) => /^ISO 9001/i.test(v.trim()))) {
        set[path] = arr.filter((v) => !/^ISO 9001/i.test(v.trim())).map((v) => textRules(v, `${docLabel} ${path}`));
        return;
      }
    }
    value.forEach((v, i) => {
      const key = v && typeof v === "object" && "_key" in v ? `[_key=="${(v as { _key: string })._key}"]` : `[${i}]`;
      walk(v, `${path}${key}`, set, docLabel);
    });
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("_") || k === "asset" || k === "slug") continue;
      walk(v, path ? `${path}.${k}` : k, set, docLabel);
    }
  }
}

async function commit(doc: Doc, set: Record<string, unknown>, label: string) {
  const entries = Object.entries(set);
  if (!entries.length) return;
  console.log(`\n■ ${label}  (${doc._id})`);
  for (const [p, v] of entries) {
    console.log(`  ${p}\n    + ${typeof v === "string" ? v : JSON.stringify(v)}`);
  }
  changes += entries.length;
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit();
}

const get = (obj: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);

const docs = await client.fetch<Doc[]>(
  `*[!(_type match "sanity.*") && !(_type match "system.*") && !(_id in path("versions.**"))]`,
);
console.log(`${docs.length} documents (published and drafts)${write ? "" : " — DRY RUN"}`);

for (const doc of docs) {
  const route = ROUTE[doc._type]?.(doc) ?? null;
  const label = `${doc._type}${route ? ` ${route}` : ""}${doc._id.startsWith("drafts.") ? " [draft]" : ""}`;
  const set: Record<string, unknown> = {};

  // 1. Every string: ISO scope, signature compound, decided facts.
  walk(doc, "", set, label);

  // 2. Titles, metas, H1s.
  if (route && TITLES[route]) {
    if (get(doc, "seo.title") !== TITLES[route]) set["seo.title"] = TITLES[route];
  }
  if (route && METAS[route]) {
    if (get(doc, "seo.description") !== METAS[route]) set["seo.description"] = METAS[route];
  }
  if (route && H1[route]) {
    const rule = H1[route];
    const lines = (doc.h1Lines as string[] | undefined) ?? undefined;
    const h1 = doc.h1 as string | undefined;
    if (rule.lines) {
      set["h1Lines"] = rule.lines;
      set["h1AccentLines"] = [1];
      if (h1 !== undefined) set["h1"] = rule.lines.join(" ");
    } else if (route === "/products/seals") {
      if (h1 && !/rubber/i.test(h1)) set["h1"] = h1.replace(rule.from, (m) => (m[0] === "S" ? `Rubber ${m}` : `rubber ${m}`));
    } else {
      if (lines?.length) {
        const next = lines.map((l) => l.replace(rule.from, rule.to));
        if (JSON.stringify(next) !== JSON.stringify(lines)) set["h1Lines"] = next;
      }
      if (h1 && rule.from.test(h1)) set["h1"] = h1.replace(rule.from, rule.to);
    }
    const after = (((set["h1Lines"] as string[]) ?? lines ?? []).join(" ") + " " + ((set["h1"] as string) ?? h1 ?? "")).toLowerCase();
    for (const w of rule.must) if (!after.includes(w)) manual.push(`${label}: H1 still lacks "${w}" — current: ${(lines ?? []).join(" / ") || h1}`);
  }

  // 3. Medical page: "Medical Grade" off the title. "Biocompatible" and
  //    "assessed to ISO 10993" stay until Margo decides: the ticket drops
  //    them only if there is no USP Class VI / ISO 10993 test file, which is
  //    Margo's to confirm — so they are listed for review, not deleted.
  if (route === "/industries/medical-devices") {
    const t = get(doc, "seo.title");
    if (typeof t === "string" && /medical[- ]grade/i.test(t) && !set["seo.title"]) set["seo.title"] = t.replace(/medical[- ]grade\s*/i, "").trim();
  }
  (function bio(v: unknown, p: string) {
    if (typeof v === "string") {
      if (/biocompatib/i.test(v)) manual.push(`${label} ${p}: biocompatibility claim — keep only if Margo has USP Class VI / ISO 10993 evidence: ${v.slice(0, 110)}`);
    } else if (Array.isArray(v)) v.forEach((x, i) => bio(x, `${p}[${i}]`));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!k.startsWith("_")) bio(x, p ? `${p}.${k}` : k);
  })(doc, "");

  // 4. Site settings: neutral compound order and descriptors; sameAs.
  if (doc._type === "siteSettings") {
    const compounds = (doc.compounds as { _key: string; name: string; code: string; descriptor?: string }[] | undefined) ?? [];
    if (compounds.length) {
      const sorted = [...compounds]
        .map((c) => {
          let descriptor = c.descriptor;
          if (c.code === "AEM" && descriptor && /signature|mahindra/i.test(descriptor)) descriptor = "Oil, heat and ozone together; engine-bay service";
          return { ...c, descriptor };
        })
        .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
      if (JSON.stringify(sorted) !== JSON.stringify(compounds)) {
        // The whole list is set, so drop any per-item edits from the walk.
        for (const k of Object.keys(set)) if (k.startsWith("compounds")) delete set[k];
        set["compounds"] = sorted;
      }
    }
    const sameAs = get(doc, "entity.sameAs") as string[] | undefined;
    if (!sameAs?.length) {
      set["entity.sameAs"] = [
        "https://www.linkedin.com/company/margo-rubber-products/",
        "https://www.instagram.com/margorubberproducts/",
        "https://www.google.com/maps/place/?q=place_id:ChIJjyRECkTr3TsRAPBPxlXi_jM",
      ];
    }
  }

  // 5. Decorative hero images: an empty alt, not "Mining page — hero background".
  if (doc._type === "imageOverride") {
    const alt = doc.alt as string | undefined;
    if (alt && /page\s*[—–-]\s*hero background/i.test(alt)) set["alt"] = "";
  }

  await commit(doc, set, label);
}

console.log(`\n${write ? "Wrote" : "Would change"} ${changes} field(s).`);
if (manual.length) {
  console.log("\nCheck by hand:");
  for (const m of [...new Set(manual)]) console.log(`  · ${m}`);
}
if (!write) console.log("\nDry run. Re-run with --write to apply.");
