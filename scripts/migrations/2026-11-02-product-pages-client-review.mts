/**
 * MIGRATION — product category pages, client review of 2 Nov 2026.
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-product-pages-client-review.mts --pdfs "<folder>"           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-product-pages-client-review.mts --pdfs "<folder>" --write
 *
 * --pdfs is the extracted Drive folder "06 Product-line catalogues v4 (PDF
 * per product page)". Card photos are found by code in /catalogue-images (git
 * ignores it): C12-01…03 from the Sponge & Foam book (pp. 13–14) and AT-26
 * from the Extrusion book (p. 19), cut out of the PDFs.
 *
 * Every category page with a parts grid:
 *   · the parts grid moves to the top, straight under the hero. Where the
 *     page's other sections are numbered, the grid's eyebrow is numbered too
 *     (the renderer renumbers in order, so "01" is a placeholder).
 * Per page:
 *   · oil-seals — cards 13 Wheel Hub Seals and 14 Valve Stem Seals removed
 *     (the cards after them renumber, being numbered by position);
 *   · bushes — cards 02, 03 (Suspension Arm Bushes), 05, 06, 08, 12, 19, 20,
 *     21 and 22 removed;
 *   · diaphragms, seals — the compound table becomes material cards like the
 *     other product pages, keeping its copy (medium + note per compound);
 *   · leak-test-rubber — a parts grid with the three leak-test cards from the
 *     Sponge & Foam catalogue (C12-01…03);
 *   · extrusion — photo for Rear Windscreen Glazing Rubber (AT-26 glazing
 *     mouldings card); the Extrusion catalogue PDF with a hero button to it;
 *   · sponge-foam-rubber — parts, then the compound selector, cell structure,
 *     density and sectors; the compound reference table, self-adhesive tape,
 *     applications and engineering-brief sections removed; the Sponge & Foam
 *     catalogue PDF with a hero button to it;
 *   · rubber-mats — the original category treatment (no hero buttons, so no
 *     alternating grey bands; short hero figures); the compound table becomes
 *     material cards straight after the mat types; why-Margo, applications,
 *     process, quality, documentation and FAQ sections removed.
 *
 * Each write is the whole sections array with ifRevisionId, so a concurrent
 * Studio edit makes it fail rather than be overwritten. A second run changes
 * nothing.
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const write = process.argv.includes("--write");
const pdfArg = process.argv.indexOf("--pdfs");
const PDFS = pdfArg > -1 ? process.argv[pdfArg + 1] : undefined;
if (!PDFS || !existsSync(PDFS)) throw new Error('Pass --pdfs "<folder with the v4 catalogue PDFs>"');
const IMAGES = "catalogue-images";

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

type Section = { _key: string; _type: string; eyebrow?: string; [k: string]: unknown };
type Item = { _key: string; name: string; image?: unknown; [k: string]: unknown };
type Doc = { _id: string; _rev: string; slug: { current: string }; sections: Section[]; [k: string]: unknown };

/* ── Files ───────────────────────────────────────────────────────────────── */

function findFile(dir: string, test: (name: string) => boolean): string | undefined {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      const hit = findFile(p, test);
      if (hit) return hit;
    } else if (test(name)) return p;
  }
}
const photo = (code: string) => {
  const p = findFile(IMAGES, (n) => n.startsWith(`${code}_`) && /\.(jpe?g|png|webp)$/i.test(n));
  if (!p) throw new Error(`No photo for ${code} in ${IMAGES}`);
  return p;
};
const pdf = (name: string) => {
  const p = findFile(PDFS, (n) => n === name);
  if (!p) throw new Error(`${name} not in ${PDFS}`);
  return p;
};

const uploads = new Map<string, string>();
async function uploadImage(file: string): Promise<string> {
  if (!write) return `image-DRYRUN-${basename(file)}`;
  if (!uploads.has(file)) {
    const asset = await client.assets.upload("image", createReadStream(file), { filename: basename(file) });
    uploads.set(file, asset._id);
  }
  return uploads.get(file)!;
}
async function uploadPdf(file: string): Promise<string> {
  if (!write) return `file-DRYRUN-${basename(file)}`;
  const asset = await client.assets.upload("file", createReadStream(file), {
    filename: basename(file),
    contentType: "application/pdf",
  });
  return asset._id;
}
const imageField = (ref: string, alt: string) => ({
  _type: "image",
  alt,
  asset: { _type: "reference", _ref: ref },
});

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const NUMBERED = /^\s*\d{1,2}\s*[·•\-–—]\s*/;
const isGrid = (s: Section) => s._type === "block.partsGrid";

/** Parts grid first; numbered like its neighbours when they are numbered. */
function gridToTop(sections: Section[]): Section[] {
  const at = sections.findIndex(isGrid);
  if (at === -1) return sections;
  const grid = { ...sections[at] };
  const rest = sections.filter((_, i) => i !== at);
  const numbered = rest.some((s) => typeof s.eyebrow === "string" && NUMBERED.test(s.eyebrow));
  if (numbered && typeof grid.eyebrow === "string" && !NUMBERED.test(grid.eyebrow)) {
    grid.eyebrow = `01 · ${grid.eyebrow}`;
  }
  return [grid, ...rest];
}

function dropItems(sections: Section[], keys: string[]): Section[] {
  return sections.map((s) =>
    isGrid(s) ? { ...s, items: (s.items as Item[]).filter((i) => !keys.includes(i._key)) } : s,
  );
}

const MATERIAL_NAMES: Record<string, string> = {
  EPDM: "EPDM",
  NBR: "NBR (Nitrile)",
  FKM: "FKM (Viton®)",
  AEM: "AEM (Vamac®)",
  CR: "Neoprene (CR)",
  NR: "Natural rubber (NR)",
  SBR: "SBR",
  VMQ: "Silicone (VMQ)",
};
const HARDNESS: Record<string, string> = {
  EPDM: "40–90 Shore A",
  NBR: "40–90 Shore A",
  FKM: "60–90 Shore A",
  AEM: "50–80 Shore A",
  CR: "40–90 Shore A",
  NR: "30–80 Shore A",
  SBR: "40–90 Shore A",
  VMQ: "30–80 Shore A",
};
const IMAGE_CODE: Record<string, string> = { VMQ: "silicone" };
const material = (slug: string, code: string, tempRange: string, summary: string) => ({
  _key: code.toLowerCase(),
  _type: "material",
  code,
  name: MATERIAL_NAMES[code],
  tempRange,
  hardness: HARDNESS[code],
  summary,
  image: `products.${slug}.material.${IMAGE_CODE[code] ?? code.toLowerCase()}`,
});

/** A compound table → material cards, keeping its heading copy. */
function compoundToCards(
  sections: Section[],
  key: string,
  card: { eyebrow: string; heading: string; body?: string; footnote?: string; items: ReturnType<typeof material>[] },
): Section[] {
  return sections.map((s) =>
    s._key === key
      ? {
          _key: "materialSection",
          _type: "block.materialCards",
          eyebrow: card.eyebrow,
          heading: card.heading,
          ...(card.body ? { body: card.body } : {}),
          ...(card.footnote ? { footnote: card.footnote } : {}),
          items: card.items,
        }
      : s,
  );
}

function order(sections: Section[], keys: string[]): Section[] {
  const out = keys.map((k) => {
    const s = sections.find((x) => x._key === k);
    if (!s) throw new Error(`no section ${k}`);
    return s;
  });
  const left = sections.filter((s) => !keys.includes(s._key)).map((s) => s._key);
  if (left.length) console.log(`    removed sections: ${left.join(", ")}`);
  return out;
}

/* ── Page edits ──────────────────────────────────────────────────────────── */

type Edit = (doc: Doc) => Promise<{ sections: Section[]; set?: Record<string, unknown>; unset?: string[] }>;

const edits: Record<string, Edit> = {
  "oil-seals": async (d) => ({ sections: dropItems(d.sections, ["wheel-hub-seals", "valve-stem-seals"]) }),

  bushes: async (d) => ({
    sections: dropItems(d.sections, [
      "silent-block-bushes",
      "suspension-arm-bushes",
      "spring-eye-bushes",
      "torque-rod-bushes",
      "engine-mounting-bushes",
      "double-sleeve-bonded-bushes",
      "cat-bu-02",
      "cat-bu-03",
      "cat-bu-01",
      "cat-bu-04",
    ]),
  }),

  diaphragms: async (d) => {
    if (d.sections.some((s) => s._key === "materialSection")) return { sections: d.sections };
    const old = d.sections.find((s) => s._key === "compound")!;
    return {
      sections: compoundToCards(d.sections, "compound", {
        eyebrow: "04 · MATERIAL SELECTION",
        heading: "Which Diaphragm Material Do I Need?",
        body: old.body as string,
        footnote: old.closing as string,
        items: [
          material("diaphragms", "EPDM", "−40 to +140 °C", "For water, coolant, steam, dosing chemicals, dilute acids and alkalis, and brake fluid. The default for water treatment and dosing. Never in oil, fuel or grease."),
          material("diaphragms", "NBR", "−30 to +120 °C", "For mineral oil, fuel, hydraulic fluid and grease. The default for oil duty and the lowest cost of the oil-capable compounds."),
          material("diaphragms", "FKM", "−20 to +250 °C\ncontinuous to +200 °C", "For solvents, aggressive chemistry and hot hydrocarbons. The escalation when NBR is out of range. Poor in the cold, and it fails in steam and glycol brake fluid."),
          material("diaphragms", "AEM", "−40 to +175 °C\ncontinuous to +160 °C", "For hot oil and oil mist above nitrile’s ceiling. The middle answer between NBR and FKM, at well under FKM cost."),
          material("diaphragms", "CR", "−40 to +120 °C", "For refrigerants, moderate oil, outdoor and marine duty. General purpose, with flame-retardant grades available."),
          material("diaphragms", "NR", "−20 to +90 °C", "For large low-pressure diaphragms with a high stroke, in air or water. The best flex-fatigue resistance of the eight. No oil contact."),
          material("diaphragms", "SBR", "−30 to +100 °C", "For abrasive slurry and water. Abrasion resistance at commodity cost. No oil contact."),
          material("diaphragms", "VMQ", "−60 to +220 °C", "For clean, high-temperature, low-pressure duty. The widest temperature range and the weakest diaphragm: low tear strength and poor flex fatigue. Specify it only where temperature forces it, and expect a shorter life."),
        ],
      }),
    };
  },

  seals: async (d) => {
    if (d.sections.some((s) => s._key === "materialSection")) return { sections: d.sections };
    const old = d.sections.find((s) => s._key === "compound")!;
    return {
      sections: compoundToCards(d.sections, "compound", {
        eyebrow: "05 · MATERIAL SELECTION",
        heading: "Which Seal Material Do I Need?",
        body: old.body as string,
        footnote: old.closing as string,
        items: [
          material("seals", "NBR", "−30 to +120 °C", "For mineral oil, hydraulic fluid, grease and fuel. The default for reciprocating duty and the compound most of this category is made from, with good abrasion resistance at seal hardnesses."),
          material("seals", "EPDM", "−40 to +140 °C", "For water, coolant, steam, dosing chemicals and brake fluid. The default for pumps handling water and dosing chemistry. Never in mineral oil."),
          material("seals", "FKM", "−20 to +250 °C\ncontinuous to +200 °C", "For solvents, aggressive chemistry and hot hydrocarbons. The escalation when NBR is out of range on temperature or medium. Poor in the cold, and it fails in steam and glycol brake fluid."),
          material("seals", "AEM", "−40 to +175 °C\ncontinuous to +160 °C", "For hot oil above nitrile’s ceiling. The middle answer between NBR and FKM at well under FKM cost."),
          material("seals", "CR", "−40 to +120 °C", "For refrigerants, marine duty and moderate oil. General purpose, with flame-retardant grades where a fire rating is specified."),
          material("seals", "NR", "−20 to +90 °C", "For low pressure and high stroke, in water or air. The best flex-fatigue resistance of the eight, but too soft for pressure duty and no oil contact."),
          material("seals", "SBR", "−30 to +100 °C", "For abrasive water at low cost, where abrasion governs and pressure is low. No oil contact."),
          material("seals", "VMQ", "−60 to +220 °C", "For clean, high-temperature, very-low-pressure duty. Almost never right on a reciprocating seal: low tear strength, poor abrasion resistance and it extrudes readily."),
        ],
      }),
    };
  },

  "leak-test-rubber": async (d) => {
    if (d.sections.some(isGrid)) return { sections: d.sections };
    const cards = [
      {
        code: "C12-01",
        name: "Alloy-wheel leak-test rubber",
        description:
          "A sealing ring that seats a car or SUV alloy wheel on an automated leak-test rig, so every wheel is proven airtight before dispatch. It is bought on cycle life: a worn ring stops the station.",
      },
      {
        code: "C12-02",
        name: "Commercial-vehicle rim leak-test rubber",
        description:
          "Leak-test rings for commercial-vehicle rims, profiled to the larger diameters and heavier clamp loads of truck and bus wheel test stations. Send the current ring, worn, and we take the geometry off it.",
      },
      {
        code: "C12-03",
        name: "Custom leak-test rig seals",
        description:
          "Seals profiled for rigs that leak-test castings and housings: pump bodies, covers and cast housings. Each is cut to the part’s sealing face and the rig’s clamp.",
      },
    ];
    const items = [];
    for (const c of cards) {
      items.push({
        _key: `cat-${c.code.toLowerCase()}`,
        _type: "partName",
        name: c.name,
        availability: "Leak-test parts",
        description: c.description,
        image: imageField(await uploadImage(photo(c.code)), c.name),
      });
    }
    const grid: Section = {
      _key: "partsGrid",
      _type: "block.partsGrid",
      eyebrow: "IN THIS CATEGORY",
      heading: `${items.length} parts we make to order`,
      body: "Each part below is made to your drawing or to a worn sample. Full dimensional data is issued with the quotation.",
      items,
    };
    return { sections: [grid, ...d.sections] };
  },

  extrusion: async (d) => {
    const sections = await Promise.all(
      d.sections.map(async (s) => {
        if (!isGrid(s)) return s;
        const items = await Promise.all(
          (s.items as Item[]).map(async (i) =>
            i._key === "rear-windscreen-glazing-rubber" && !i.image
              ? { ...i, image: imageField(await uploadImage(photo("AT-26")), i.name) }
              : i,
          ),
        );
        return { ...s, items };
      }),
    );
    return { sections, ...(await catalogueSet(d, "Margo_Extrusion_Catalogue_2026_v4_PRINT.pdf")) };
  },

  "sponge-foam-rubber": async (d) => {
    const sections = order(
      d.sections.map((s) =>
        s._key === "compoundSection"
          ? {
              ...s,
              body: "Five elastomer families, each optimised for distinct thermal, chemical and mechanical operating envelopes. Pick the tab that matches your environment.",
            }
          : s,
      ),
      ["partsGrid", "compoundSection", "compareSection", "densitySection", "sectorsSection", "cta"],
    );
    return { sections, ...(await catalogueSet(d, "Margo_Sponge-and-Foam_Catalogue_2026_v4_PRINT.pdf")) };
  },

  "rubber-mats": async (d) => {
    let sections = d.sections;
    if (!sections.some((s) => s._key === "materialSection")) {
      sections = compoundToCards(sections, "section-8", {
        eyebrow: "02 · MATERIAL SELECTION",
        heading: "Which Mat Material Do I Need?",
        body: "Start from what lands on the mat and the temperature, then the pattern.",
        items: [
          material("rubber-mats", "EPDM", "−40 to +140 °C", "For mats that see sun, ozone, water and wash-down. Not where oil or fuel lands on the mat."),
          material("rubber-mats", "NBR", "−30 to +120 °C", "For floors and machines where oil, fuel or coolant lands on the mat."),
          material("rubber-mats", "FKM", "−20 to +250 °C", "For mats exposed to hot fuels and aggressive chemicals."),
          material("rubber-mats", "VMQ", "−60 to +200 °C", "For mats on hot, dry surfaces."),
          material("rubber-mats", "AEM", "−40 to +160 °C", "For hot oil around engines and gearboxes."),
          material("rubber-mats", "CR", "−40 to +120 °C", "For oil splash together with outdoor weather."),
          material("rubber-mats", "SBR", "−30 to +100 °C", "For general floor and vehicle mats where cost matters."),
          material("rubber-mats", "NR", "−20 to +90 °C", "For wear, grip and damping on dry floors and in vehicles."),
        ],
      });
    }
    // The engineering-data table pointed at the compound table "below".
    sections = sections.map((s) =>
      s._key === "section-6"
        ? {
            ...s,
            rows: (s.rows as { _key: string; cells: string[] }[]).map((r) =>
              r.cells[0] === "Operating temperature" ? { ...r, cells: [r.cells[0], "By compound; see Material Selection above"] } : r,
            ),
          }
        : s,
    );
    sections = order(sections, [
      "section-1",
      "section-2",
      "section-3",
      "materialSection",
      "section-4",
      "section-5",
      "section-6",
      "section-7",
      "section-15",
      "section-16",
    ]);
    return {
      sections,
      set: {
        heroActions: [],
        heroLink: { href: "/contact?product=Rubber%20Mats", label: "Send a Mat Drawing" },
        heroStats: [
          { _key: "heroStat_0", value: "11", label: "Mat types" },
          { _key: "heroStat_1", value: "Solid rubber", label: "No PVC, TPE or foam" },
          { _key: "heroStat_2", value: "−60 to +250 °C", label: "Across eight compounds" },
          { _key: "heroStat_3", value: "48 hrs", label: "Quotation Turnaround" },
        ],
      },
      unset: ["heroEyebrow", "heroStatsAlign"],
    };
  },
};

/** The catalogue PDF and a hero button to it — once. */
async function catalogueSet(d: Doc, file: string) {
  const set: Record<string, unknown> = {};
  const cat = d.catalogue as { file?: { asset?: { _ref?: string } } } | undefined;
  if (!cat?.file?.asset?._ref) {
    const ref = await uploadPdf(pdf(file));
    set.catalogue = { _type: "object", file: { _type: "file", asset: { _type: "reference", _ref: ref } } };
  }
  const actions = (d.heroActions as { href?: string }[] | undefined) ?? [];
  if (!actions.some((a) => a.href === "#catalogue")) {
    set.heroActions = [
      ...actions,
      { _key: "download-catalogue", _type: "heroAction", label: "Download Catalogue", href: "#catalogue", variant: "secondary" },
    ];
  }
  return Object.keys(set).length ? { set } : {};
}

/* ── Run ─────────────────────────────────────────────────────────────────── */

const docs = await client.fetch<Doc[]>(`*[_type == "productCategory" && !(_id in path("versions.**"))]`);
console.log(`${docs.length} product category documents${write ? "" : " — DRY RUN"}`);

for (const doc of docs) {
  const slug = doc.slug.current;
  const label = `${slug}${doc._id.startsWith("drafts.") ? " [draft]" : ""}`;
  const edit = edits[slug];
  const r = edit ? await edit(doc) : { sections: doc.sections };
  const sections = gridToTop(r.sections);

  const before = JSON.stringify(doc.sections);
  const changed = JSON.stringify(sections) !== before || r.set || r.unset?.some((k) => k in doc);
  if (!changed) {
    console.log(`  ${label}: no change`);
    continue;
  }
  console.log(`  ${label}:`);
  console.log(`    before: ${doc.sections.map((s) => s._key).join(", ")}`);
  console.log(`    after:  ${sections.map((s) => s._key).join(", ")}`);
  for (const s of sections.filter(isGrid)) {
    const was = doc.sections.find((x) => x._key === s._key) as Section | undefined;
    const n0 = (was?.items as Item[] | undefined)?.length ?? 0;
    const n1 = (s.items as Item[]).length;
    if (n0 !== n1) console.log(`    parts: ${n0} → ${n1}`);
  }
  if (r.set) console.log(`    set: ${Object.keys(r.set).join(", ")}`);
  if (r.unset) console.log(`    unset: ${r.unset.filter((k) => k in doc).join(", ")}`);

  if (!write) continue;
  let p = client.patch(doc._id).ifRevisionId(doc._rev).set({ sections, ...(r.set ?? {}) });
  if (r.unset?.length) p = p.unset(r.unset);
  const res = await p.commit();
  console.log(`    patched → rev ${res._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
