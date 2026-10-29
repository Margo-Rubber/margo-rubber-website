/**
 * MIGRATION — 3rd Shade keyword pack K1, K7, K4, K8 (25 Oct 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-29-k-pack.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-29-k-pack.mts --write
 *   then: npm run revalidate -- --all   (SITE=https://www.margorubber.com for the live site)
 *
 * Source: Drive Margo 2 / "05 Competitor-keyword website changes (K1-K8)" /
 * Margo_Website_Changes_for_Developer_2026-10-25.md. Old values were fetched
 * live on 25 Oct 2026, so every replacement matches on the exact old string
 * and anything that no longer matches is LISTED under "Check by hand" rather
 * than guessed at.
 *
 *  K1  Home page title.
 *  K7  /about title + meta description (adds Maharashtra and the locality).
 *  K4  /export title, meta, H1 and hero intro; "Countries Served" loses
 *      "+86 MORE"; a short export paragraph on /products/gaskets and
 *      /products/o-rings directly above "Lead Times and How We Quote";
 *      one in-body link to /export in the India-vs-China guide.
 *  K8  /products/anti-vibration-mounts: one sentence on the intro
 *      ("vibration control"), a Strut Mounts card in the parts list, and a
 *      strut-mount row in the Mount Types table.
 *
 * K5 (the new /manufacturing page) is NOT here — it ships with the page code
 * and scripts/migrations/2026-10-29-manufacturing-content.mts. The two
 * internal links to /manufacturing ARE here (home step 04, products step 03):
 * run this only after the /manufacturing deploy, or those links 404.
 *
 * Pack rules carried over: no FAQPage schema, no city pages, no "95
 * countries", no IATF claims, no MOQ other than 10,000 pieces per part
 * number, per compound.
 *
 * Published documents AND their drafts are patched, so an open draft cannot
 * publish the old text back. Every write uses ifRevisionId: a concurrent
 * Studio edit makes it fail rather than be overwritten. Idempotent — every
 * replacement matches the OLD string only, and inserted blocks/items/rows
 * carry fixed _keys, so a second run changes nothing.
 */
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

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

type Doc = { _id: string; _rev: string; [k: string]: unknown };
const manual: string[] = [];
let changes = 0;

/* ── The pack, verbatim ────────────────────────────────────────────────── */

const K1_HOME_TITLE = "Rubber Parts & Components Manufacturer, Exporter India | Margo";

const K7_ABOUT_TITLE = "Rubber Moulding Company in Nashik, Maharashtra | Margo";
const K7_ABOUT_DESC =
  "Rubber moulding company in Vilholi, Nashik, Maharashtra, since 2005. Eight compounds mixed in-house, parts moulded to drawing. ISO 9001:2015 for moulded parts.";

const K4_EXPORT_TITLE = "Rubber Parts Exporter from India | FOB Nhava Sheva | Margo";
const K4_EXPORT_DESC =
  "Rubber parts exported from Nashik, India, FOB Nhava Sheva or CIF. MOQ 10,000 per part number, per compound. Certificate of origin and inspection report.";

const K4_HERO_OLD =
  "Margo Rubber Products ships precision moulded and extruded rubber components from Nashik, India, FOB Nhava Sheva or CIF to your port. The moulded line is ISO 9001:2015 certified. Nine markets have a country-level sourcing playbook below — duty treatment, certificate requirements, transit time and destination port. Click a lane to jump to yours.";
const K4_HERO_NEW =
  "Margo Rubber Products exports moulded and extruded parts from Nashik, India, to Australia, the UK, the UAE, Saudi Arabia, Malaysia, the USA, Singapore, Kenya and Tanzania. We ship Terms: FOB Nhava Sheva or CIF; EXW, DAP by agreement. MOQ: 10,000 per part number, per compound. Every shipment carries a commercial invoice, packing list, certificate of origin and inspection release report. The moulded line is ISO 9001:2015 certified. The lanes below set out duty treatment, certificates, transit time and port.";

const K4_COUNTRIES_OLD = "AU · GB · AE · SA · MY · US · SG · KE · TZ · +86 MORE";
const K4_COUNTRIES_NEW = "AU · GB · AE · SA · MY · US · SG · KE · TZ";

const K8_INTRO_OLD =
  "Margo Rubber Products moulds rubber-to-metal bonded and unbonded anti-vibration mounts at its ISO 9001:2015 certified plant in Nashik, India — bobbin, conical, sandwich and buffer forms in natural rubber, neoprene and NBR. Engineered to your load rating, deflection and mounting geometry, to OEM drawing rather than off the shelf.";
const K8_INTRO_ADD =
  "These are vibration control parts: a mount isolates a running machine from the frame it stands on, and a buffer absorbs the impact at the end of travel.";

const K8_STRUT_BODY =
  "A strut mount, or top mount, sits between a MacPherson strut and the vehicle body. Rubber bonded between steel plates carries the spring and damper load and keeps road noise and vibration out of the cabin. We mould strut mounts to OEM drawing or from a sample, bonded in-house, with compound and hardness set from your load and stiffness figures. Send the drawing with the axial and radial stiffness, the preload and the insert specification. Minimum run is 10,000 pieces per part number, per compound.";

const K8_TABLE_ROW = [
  "Strut / top mount",
  "Per drawing",
  "Per drawing",
  "MacPherson strut to body: carries spring and damper load, isolates road noise",
];

/** Markdown link in a plain CMS string renders through emphasised(). */
const K5_HOME_STEP_ADD = "Process detail: [how we mould a rubber part](/manufacturing).";
const K5_HUB_STEP_ADD = "How each method works, step by step: [our moulding process](/manufacturing).";

/* Portable-text paragraphs for the two category pages (block.richText). */
function exportParagraph(key: string, lead: string, middle: string, linkText: string, tail: string) {
  const linkKey = `${key}-l`;
  return {
    _key: key,
    _type: "block.richText" as const,
    content: [
      {
        _type: "block",
        _key: `${key}-p`,
        style: "normal",
        markDefs: [{ _key: linkKey, _type: "link", href: "/export" }],
        children: [
          { _type: "span", _key: `${key}-s1`, text: lead, marks: ["strong"] },
          { _type: "span", _key: `${key}-s2`, text: ` ${middle} `, marks: [] },
          { _type: "span", _key: `${key}-s3`, text: linkText, marks: [linkKey] },
          { _type: "span", _key: `${key}-s4`, text: tail, marks: [] },
        ],
      },
    ],
  };
}

const GASKETS_BLOCK = exportParagraph(
  "k4-export-gaskets",
  "Exporting gaskets from India.",
  "We ship gaskets FOB Nhava Sheva, 185 km from the plant, or CIF to your port. Each shipment leaves with a commercial invoice carrying the HS code, a packing list, a certificate of origin from the Nashik Chamber of Commerce and a signed inspection release report. Transit times and documents for each market are on our",
  "rubber parts export page",
  ".",
);

const ORINGS_BLOCK = exportParagraph(
  "k4-export-o-rings",
  "O-rings shipped from India.",
  "AS568 and ISO 3601 sizes, and non-catalogue sizes cut to your drawing, ship on the same terms: FOB Nhava Sheva or CIF, with inspection release data on every lot. Tell us the destination at quotation stage: Kenya and Tanzania need PVoC pre-shipment inspection, arranged before departure. Every pallet is ISPM-15 heat-treated. Lanes and documents by country:",
  "export from India",
  ".",
);

/** The India-vs-China guide sentence, as a portable-text paragraph. */
const GUIDE_SENTENCE = {
  _type: "block",
  _key: "k4-export-link",
  style: "normal",
  markDefs: [{ _key: "k4-export-link-l", _type: "link", href: "/export" }],
  children: [
    { _type: "span", _key: "k4-el-s1", text: "Our own lanes, transit times and export documents are set out on the ", marks: [] },
    { _type: "span", _key: "k4-el-s2", text: "rubber parts export page", marks: ["k4-export-link-l"] },
    { _type: "span", _key: "k4-el-s3", text: ".", marks: [] },
  ],
};

/* ── Helpers ───────────────────────────────────────────────────────────── */

async function fetchBoth(id: string): Promise<Doc[]> {
  return client.fetch<Doc[]>(`*[_id in [$id, "drafts." + $id]]`, { id });
}
async function fetchBySlug(type: string, slug: string): Promise<Doc[]> {
  return client.fetch<Doc[]>(
    `*[_type == $type && slug.current == $slug && !(_id in path("versions.**"))]`,
    { type, slug },
  );
}

const label = (d: Doc, route: string) => `${route}${d._id.startsWith("drafts.") ? " [draft]" : ""}`;

/** Deep-replace exact string values; returns {path: newValue} set entries. */
function replaceEverywhere(value: unknown, path: string, from: string, to: string, set: Record<string, unknown>) {
  if (typeof value === "string") {
    if (value === from) set[path] = to;
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => {
      const key = v && typeof v === "object" && "_key" in (v as object) ? `[_key=="${(v as { _key: string })._key}"]` : `[${i}]`;
      replaceEverywhere(v, `${path}${key}`, from, to, set);
    });
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("_") || k === "asset") continue;
      replaceEverywhere(v, path ? `${path}.${k}` : k, from, to, set);
    }
  }
}

async function commit(doc: Doc, set: Record<string, unknown>, route: string, notes: string[] = []) {
  const entries = Object.entries(set);
  if (!entries.length && !notes.length) return;
  console.log(`\n■ ${label(doc, route)}  (${doc._id})`);
  for (const n of notes) console.log(`    · ${n}`);
  for (const [p, v] of entries) {
    const shown = typeof v === "string" ? v : `${JSON.stringify(v).slice(0, 160)}…`;
    console.log(`  ${p}\n    + ${shown}`);
  }
  changes += entries.length;
  if (write && entries.length) await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit();
}

/** Set a field only when it differs; flag when the old value is unexpected. */
function setField(doc: Doc, set: Record<string, unknown>, path: string, next: string, route: string) {
  const current = path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), doc);
  if (current === next) return;
  set[path] = next;
  if (current === undefined) manual.push(`${route}: ${path} was empty before this run — confirm on the page`);
}

type Block = { _key: string; _type: string; heading?: string; items?: unknown[]; rows?: unknown[]; columns?: unknown[]; [k: string]: unknown };

/* ── K1 · Home title ───────────────────────────────────────────────────── */
for (const doc of await fetchBoth("homePage-home")) {
  const set: Record<string, unknown> = {};
  setField(doc, set, "seo.title", K1_HOME_TITLE, "/");

  // K5's internal link: end STEP 04 "Production & in-process QC" of the
  // "How we work" list with the /manufacturing sentence.
  const steps = (doc as { process?: { steps?: { name?: string; body?: string }[] } }).process?.steps ?? [];
  const i = steps.findIndex((s) => /production/i.test(s.name ?? "") && /in-process|qc/i.test(s.name ?? ""));
  if (i === -1) {
    manual.push(`/ : "How we work" has no step matching "Production & in-process QC" — add by hand: ${K5_HOME_STEP_ADD}`);
  } else if (!steps[i].body?.includes("/manufacturing")) {
    set[`process.steps[${i}].body`] = `${(steps[i].body ?? "").trim()} ${K5_HOME_STEP_ADD}`;
  }

  await commit(doc, set, "/");
}

/* ── K7 · /about ───────────────────────────────────────────────────────── */
for (const doc of await fetchBoth("aboutPage-about")) {
  const set: Record<string, unknown> = {};
  setField(doc, set, "seo.title", K7_ABOUT_TITLE, "/about");
  setField(doc, set, "seo.description", K7_ABOUT_DESC, "/about");
  await commit(doc, set, "/about");
}

/* ── K4 · /export ──────────────────────────────────────────────────────── */
for (const doc of await fetchBoth("exportPage-export")) {
  const set: Record<string, unknown> = {};
  const notes: string[] = [];
  setField(doc, set, "seo.title", K4_EXPORT_TITLE, "/export");
  setField(doc, set, "seo.description", K4_EXPORT_DESC, "/export");

  // H1: live reads "Rubber Components, Exported from Nashik." — stored as the
  // flat h1 plus hero.h1Lines (which may split it over lines and carry
  // *accent* markers), so the two fragments are replaced wherever they sit.
  const h1Fix = (s: string) =>
    s.replace(/Rubber Components\b/g, "Rubber Parts").replace(/from Nashik\.(?!,)/g, "from Nashik, India.");
  const hero = (doc as { hero?: { h1Lines?: string[]; intro?: string } }).hero;
  if (typeof doc.h1 === "string" && h1Fix(doc.h1) !== doc.h1) set["h1"] = h1Fix(doc.h1);
  (hero?.h1Lines ?? []).forEach((line, i) => {
    if (h1Fix(line) !== line) set[`hero.h1Lines[${i}]`] = h1Fix(line);
  });
  if (!hero?.h1Lines?.length && typeof doc.h1 !== "string") {
    manual.push("/export: no h1 / hero.h1Lines found — set the H1 by hand: Rubber Parts, Exported from Nashik, India.");
  }

  // Hero intro: exact old paragraph → the new 79-word answer paragraph.
  if (hero?.intro === K4_HERO_NEW) {
    // already applied
  } else if (hero?.intro === K4_HERO_OLD) {
    set["hero.intro"] = K4_HERO_NEW;
  } else if (hero) {
    manual.push(`/export: hero.intro does not match the 25 Oct snapshot — paste by hand. Current starts: "${String(hero.intro).slice(0, 80)}…"`);
  }

  // "Export summary" card → Countries Served loses "+86 MORE". The exact old
  // string is replaced wherever it sits (summary.facts value, chips, etc.).
  replaceEverywhere(doc, "", K4_COUNTRIES_OLD, K4_COUNTRIES_NEW, set);
  if (!Object.keys(set).some((k) => set[k] === K4_COUNTRIES_NEW)) {
    const flat = JSON.stringify(doc);
    if (flat.includes("+86")) manual.push(`/export: a "+86" remains but not as the exact Countries Served string — fix by hand`);
  }

  await commit(doc, set, "/export", notes);
}

/* ── K4 · export paragraphs on /products/gaskets and /products/o-rings ─── */
async function insertAboveLeadTimes(slug: string, block: Block) {
  for (const doc of await fetchBySlug("productCategory", slug)) {
    const route = `/products/${slug}`;
    const sections = [...(((doc as { sections?: Block[] }).sections ?? []) as Block[])];
    if (sections.some((b) => b._key === block._key)) {
      console.log(`  ✓ ${label(doc, route)} — export paragraph already in place`);
      continue;
    }
    const i = sections.findIndex((b) => /^lead times and how we quote$/i.test((b.heading ?? "").trim()));
    if (i === -1) {
      manual.push(`${route}: no section headed "Lead Times and How We Quote" — insert the export paragraph by hand`);
      continue;
    }
    sections.splice(i, 0, block);
    changes++;
    console.log(`\n■ ${label(doc, route)}  (${doc._id})\n  + block.richText "${block._key}" inserted above "${sections[i + 1].heading}"`);
    if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set({ sections }).commit();
  }
}
await insertAboveLeadTimes("gaskets", GASKETS_BLOCK);
await insertAboveLeadTimes("o-rings", ORINGS_BLOCK);

/* ── K4 · India-vs-China guide: in-body link to /export ────────────────── */
for (const doc of await fetchBySlug("resource", "india-vs-china-rubber-sourcing")) {
  const route = "/resources/india-vs-china-rubber-sourcing";
  type PT = { _key: string; _type: string; style?: string; children?: { text?: string }[] };
  const body = [...(((doc as { body?: PT[] }).body ?? []) as PT[])];
  if (!body.length) {
    manual.push(`${route}: document has no body (portable text) — the guide may still serve from its .mdx; add the sentence by hand`);
    continue;
  }
  if (body.some((b) => b._key === GUIDE_SENTENCE._key)) {
    console.log(`  ✓ ${label(doc, route)} — export link sentence already in place`);
    continue;
  }
  const textOf = (b: PT) => (b.children ?? []).map((c) => c.text ?? "").join("");
  const isHeading = (b: PT) => b._type === "block" && /^h[23]$/.test(b.style ?? "");
  const start = body.findIndex((b) => isHeading(b) && /total landed cost/i.test(textOf(b)));
  if (start === -1) {
    manual.push(`${route}: no heading "Total landed cost, and the line nobody budgets" in the body — add the sentence by hand`);
    continue;
  }
  let end = body.length;
  for (let j = start + 1; j < body.length; j++) if (isHeading(body[j])) { end = j; break; }
  body.splice(end, 0, GUIDE_SENTENCE as unknown as PT);
  changes++;
  console.log(`\n■ ${label(doc, route)}  (${doc._id})\n  + export-link paragraph at the end of "Total landed cost" (position ${end})`);
  if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set({ body }).commit();
}

/* ── K8 · /products/anti-vibration-mounts ──────────────────────────────── */
for (const doc of await fetchBySlug("productCategory", "anti-vibration-mounts")) {
  const route = "/products/anti-vibration-mounts";
  const set: Record<string, unknown> = {};
  const notes: string[] = [];

  // 1. Intro gains the "vibration control" sentence.
  replaceEverywhere(doc, "", K8_INTRO_OLD, `${K8_INTRO_OLD} ${K8_INTRO_ADD}`, set);
  if (!Object.keys(set).length && !JSON.stringify(doc).includes("vibration control parts")) {
    manual.push(`${route}: intro does not match the 25 Oct snapshot — append by hand: ${K8_INTRO_ADD}`);
  }

  const sections = [...(((doc as { sections?: Block[] }).sections ?? []) as Block[])];
  let sectionsChanged = false;

  // 2. "Mounts We Make to Order" gains card 20, Strut Mounts, with the K8
  //    paragraph as its description. Heading count ("N …") follows.
  const gi = sections.findIndex((b) => b._type === "block.partsGrid");
  if (gi === -1) {
    manual.push(`${route}: no parts grid ("Mounts We Make to Order") — add the Strut Mounts card by hand`);
  } else {
    const grid = { ...sections[gi] } as Block & { items?: { _key: string; name?: string }[]; heading?: string };
    const items = [...(grid.items ?? [])];
    if (!items.some((x) => x._key === "k8-strut-mounts" || /^strut mounts$/i.test(x.name ?? ""))) {
      items.push({
        _key: "k8-strut-mounts",
        _type: "partName",
        name: "Strut Mounts",
        availability: "Made to order",
        description: K8_STRUT_BODY,
      } as never);
      grid.items = items;
      if (typeof grid.heading === "string" && /^\d+\s/.test(grid.heading)) {
        grid.heading = grid.heading.replace(/^\d+/, String(items.length));
      }
      sections[gi] = grid;
      sectionsChanged = true;
      notes.push(`Strut Mounts card added to "${grid.heading}" (${items.length} cards)`);
    } else {
      console.log(`  ✓ ${label(doc, route)} — Strut Mounts card already in place`);
    }
  }

  // 3. "Mount Types and Load Ranges" gains the strut-mount row.
  const ti = sections.findIndex((b) => b._type === "block.specTable" && /mount types/i.test(b.heading ?? ""));
  if (ti === -1) {
    manual.push(`${route}: no spec table headed like "Mount Types and Load Ranges" — add the row by hand: | ${K8_TABLE_ROW.join(" | ")} |`);
  } else {
    const table = { ...sections[ti] } as Block & { columns?: string[]; rows?: unknown[] };
    const rows = [...(table.rows ?? [])];
    const hasRow = rows.some((r) => JSON.stringify(r).includes("Strut / top mount"));
    if (!hasRow) {
      const cols = table.columns?.length ?? 0;
      if (cols && cols !== K8_TABLE_ROW.length) {
        manual.push(`${route}: table "${table.heading}" has ${cols} columns, the pack row has ${K8_TABLE_ROW.length} — add by hand`);
      } else {
        // Rows are stored as { _type: "row", cells: string[] } in the Studio
        // schema; a raw string[] is accepted too in case an older shape remains.
        const sample = rows[0];
        const row =
          sample && typeof sample === "object" && !Array.isArray(sample)
            ? { _type: "row", _key: `k8-strut-${randomUUID().slice(0, 6)}`, cells: K8_TABLE_ROW }
            : K8_TABLE_ROW;
        rows.push(row);
        table.rows = rows;
        sections[ti] = table;
        sectionsChanged = true;
        notes.push(`strut-mount row added to "${table.heading}" (${rows.length} rows)`);
      }
    } else {
      console.log(`  ✓ ${label(doc, route)} — strut-mount table row already in place`);
    }
  }

  if (sectionsChanged) set["sections"] = sections;
  await commit(doc, set, route, notes);
}

/* ── K5 link · /products hub step 03 ───────────────────────────────────── */
for (const doc of await fetchBoth("productsHub-products")) {
  const set: Record<string, unknown> = {};
  const steps = (doc as { process?: { steps?: { n?: string; title?: string; body?: string }[] } }).process?.steps ?? [];
  const i = steps.findIndex((s) => /moulding/i.test(s.title ?? "") && /extrusion/i.test(s.title ?? ""));
  if (i === -1) {
    manual.push(`/products: no process step titled like "Moulding & extrusion" — add by hand: ${K5_HUB_STEP_ADD}`);
  } else if (!steps[i].body?.includes("/manufacturing")) {
    set[`process.steps[${i}].body`] = `${(steps[i].body ?? "").trim()} ${K5_HUB_STEP_ADD}`;
  }
  await commit(doc, set, "/products");
}

/* ── Done ──────────────────────────────────────────────────────────────── */
console.log(`\n${write ? "Wrote" : "Would write"} ${changes} change(s).`);
if (manual.length) {
  console.log("\nCheck by hand:");
  for (const m of manual) console.log(`  · ${m}`);
}
if (!write) console.log("\nDry run — nothing written. Read the output above, then re-run with --write.");
