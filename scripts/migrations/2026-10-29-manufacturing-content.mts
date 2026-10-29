/**
 * MIGRATION — /manufacturing page content (3rd Shade keyword pack K5, 25 Oct 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-29-manufacturing-content.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-29-manufacturing-content.mts --write
 *   then: npm run revalidate -- --all   (SITE=https://www.margorubber.com for the live site)
 *
 * Creates the manufacturingPage document at a fixed id, filled with the K5
 * copy VERBATIM from Drive Margo 2 / "05 Competitor-keyword website changes" /
 * Margo_Website_Changes_for_Developer_2026-10-25.md. Status is `published`,
 * so the page enters /sitemap.xml through publishedRoutes the moment it
 * deploys (the pack: "Add to the main sitemap.xml").
 *
 * Run only AFTER the deploy that adds the manufacturingPage type and the
 * /manufacturing route — the Studio rejects documents of unknown types, and a
 * CMS document with no route is a page nobody can see.
 *
 * Content matches src/content/pages/manufacturing.mdx, the file fallback.
 * Pack rules: no FAQPage schema, no quality-plan document numbers on the page
 * (the plans are unsigned and carry the old Ambad address), no "95 countries",
 * no IATF claims, MOQ only ever 10,000 pieces per part number, per compound.
 *
 * Idempotent: an existing document is diffed field by field and only changed
 * fields are patched (ifRevisionId, so a concurrent Studio edit fails the
 * write rather than being overwritten). A draft, if one exists, gets the same
 * content so a later publish cannot undo this.
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

const ID = "manufacturingPage-manufacturing";

const section = (key: string, s: Record<string, unknown>) => ({ _key: key, _type: "processSection", ...s });
const row = (cells: string[]) => cells.join(" | ");

const DOC = {
  _id: ID,
  _type: "manufacturingPage",
  slug: { _type: "slug", current: "manufacturing" },
  status: "published",
  h1: "Rubber Moulding in India: Compound, Mould, Cure, Inspect",
  seo: {
    title: "Rubber Compression & Transfer Moulding, India | Margo",
    description:
      "How Margo moulds rubber parts in Nashik, India: in-house compound, own toolroom, compression, transfer and injection moulding, post-cure, lot inspection.",
  },
  sections: [
    section("ops", {
      heading: "The six operations every part goes through",
      intro:
        "Our PPAP process flow MRP/PF/01 numbers the operations in tens. It was written for one part, an insulator bush, and other parts follow the same sequence.",
      table: {
        columns: ["Op", "Operation", "What is checked"],
        rows: [
          row(["10", "Raw material receipt", "Rubber and SRF carbon black: grade and visual, each lot. Chemicals: brand and shelf life, each lot"]),
          row(["20", "Raw material inspection", "Material is inspected before it is issued to production"]),
          row(["30", "Moulding", "Mixing: functional and weight check, every batch. Set-up: 2 pieces dimensionally approved. Run: dimensions every ½ hour, temperature and time every hour"]),
          row(["40", "Deflashing and cleaning", "Flash removed, parts cleaned"]),
          row(["50", "Inspection", "ID, OD and thickness, and hardness, each lot"]),
          row(["60", "Packing", "HDPE bags, labelled cartons; export packing on export lots"]),
        ],
        caption: "The six operations of process flow MRP/PF/01",
      },
      outro:
        "For that bush, MRP/PF/01 sets the mould temperature at 160 ± 10 °C. The figure belongs to that part. Your part gets its own setting on its own control plan.",
    }),
    section("compound", {
      heading: "Custom compound, mixed in-house",
      intro: [
        "Eight compounds are mixed in-house: EPDM, NBR, FKM, silicone, AEM, neoprene, SBR and natural rubber. A trader buys compound pre-mixed. We mix ours and keep the batch record.",
        "Raw rubber, chemicals and SRF carbon black are booked in separately. Every mixed batch gets a functional and weight check, 100 % of batches. The ODR rheometer then runs the cure curve to ISO 6502-2, and the torque and scorch safety from that curve set the press cycle time.",
        "If your drawing calls for a hardness, a temperature range or a fluid we don't already run, the compound is formulated for it. Compound batch, cure parameters and inspection results stay retrievable per production batch.",
      ].join("\n\n"),
    }),
    section("toolroom", {
      heading: "Mould making and prototypes, in-house",
      intro:
        "The mould is designed and cut in our own toolroom, from a CAD file, a section drawing or a worn part in an envelope. No outside tool shop sits in the loop, so a revision takes days, not weeks.",
      bullets: [
        "Prototype: 48 to 72 hours from an approved drawing",
        "Fitment samples: inside two weeks",
        "Tooling cost: quoted upfront, then amortised into the piece price or credited against committed volume",
      ],
    }),
    section("moulding", {
      heading: "Moulding: compression, transfer or injection, chosen by the part",
      intro: [
        "**Compression moulding.** A measured blank goes into the open cavity and the press closes on it. Tooling is simpler and cheaper to cut. It suits thick sections, larger parts and moderate volumes: pads, buffers, mounts, large gaskets.",
        "**Transfer moulding.** Compound is forced from a pot through sprues into a closed mould. We use it for parts with metal inserts and where the flash has to be tighter than compression gives.",
        "**Injection moulding.** Compound is injected into a closed, heated mould. Short cycles and repeatable fill suit high-volume small parts.",
        "**Rubber-to-metal bonding.** Bushes, mounts and bonded seals are bonded in-house. Bond design and failure modes are in our [rubber-to-metal bonded parts guide](/resources/rubber-to-metal-bonded-parts-guide).",
        "**Sponge and foam.** Moulded sponge and closed-cell foam parts run on the same presses.",
        "**Extrusion.** Profiles, cords and tubing are made by continuous-cure extrusion, quoted to ISO 3302-1 class E1 to E3.",
        "Presses hold cure temperature and pressure closed-loop. Two pieces are dimensionally approved at set-up before the run starts.",
      ].join("\n\n"),
    }),
    section("post-cure", {
      heading: "Post-cure and finishing",
      intro:
        "Programmable electric ovens run post-cure where the compound needs it. Each batch keeps a record of cure time, temperature and pressure that we can pull up later. Flash comes off by cryogenic deflashing or by trimming on variable-speed grinder-cutters.",
    }),
    section("inspection", {
      heading: "Inspection and release",
      intro:
        "First article, then in-process checks through the run, then a final check on every despatch lot before it is released. Sampling follows an AQL table based on IS 2500.",
      table: {
        columns: ["Test", "Standard"],
        rows: [
          row(["Hardness, Shore A durometer", "ASTM D2240"]),
          row(["Tensile strength and elongation", "ASTM D412 · ISO 37"]),
          row(["Compression set", "ASTM D395 · ISO 815-1"]),
          row(["Cure curve, ODR rheometer", "ISO 6502-2"]),
          row(["Heat ageing, hot-air oven to 200 °C", "ASTM D573 · ISO 188"]),
          row(["Specific gravity", "ASTM D297 · ISO 2781"]),
          row(["Dimensions, verniers and micrometers to ±0.01 mm", "ISO 3302-1"]),
        ],
        caption: "In-house tests and the standards they follow",
      },
      outro:
        "Ozone, abrasion, tear, rebound, low-temperature brittleness, fluid immersion and flammability tests go to NABL-accredited partner laboratories on request. Supplier calibration certificates are reviewed against a 13-point checklist. APQP and PPAP where your programme requires them.",
    }),
    section("lead-times", {
      heading: "Lead times and minimum order",
      table: {
        columns: ["Stage", "Time"],
        rows: [
          row(["Quotation and feasibility report", "48 hours"]),
          row(["Prototype, from an approved drawing", "48 to 72 hours"]),
          row(["Production, existing tooling", "3 to 4 weeks ex-works Nashik; 2 weeks express where capacity is confirmed"]),
          row(["New tooling", "3 to 4 weeks plus tooling time"]),
        ],
        caption: "Lead times by stage",
      },
      outro:
        "Minimum run is 10,000 pieces per part number, per compound. Prototype and first-article lots sit outside the minimum and are quoted separately. Installed capacity is five million components a month.",
    }),
    section("certificate", {
      heading: "What the certificate covers",
      intro:
        "ISO 9001:2015, certificate 09111526A, Integral Certification Ltd, valid to 21 February 2027. Scope: rubber moulded components. The scope extension to the extruded and cellular lines is in hand. IATF 16949 is not held; the upgrade is in progress.",
    }),
    section("send-a-drawing", {
      heading: "Send a drawing",
      intro:
        "Send the drawing or a sample, the compound or the service conditions (medium, temperature, pressure) and the annual volume. You get a quotation and feasibility report within 48 hours.",
    }),
  ],
  cta: { label: "Send a Drawing", href: "/contact" },
};

/* ── Apply ─────────────────────────────────────────────────────────────── */

type Doc = { _id: string; _rev: string; [k: string]: unknown };
const existing = await client.fetch<Doc[]>(`*[_id in [$id, "drafts." + $id]]`, { id: ID });

const strip = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(strip);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>)
        .filter(([k]) => !["_rev", "_createdAt", "_updatedAt", "_system", "_originalId"].includes(k))
        .map(([k, val]) => [k, strip(val)]),
    );
  }
  return v;
};

if (existing.length === 0) {
  console.log(`+ create ${ID} (status: published, ${DOC.sections.length} sections)${write ? "" : "  — DRY RUN"}`);
  if (write) await client.createIfNotExists(DOC as never);
} else {
  for (const doc of existing) {
    const isDraft = doc._id.startsWith("drafts.");
    const target = isDraft ? { ...DOC, _id: doc._id } : DOC;
    const current = strip(doc);
    const wanted = strip({ ...target, _id: doc._id });
    if (JSON.stringify(current) === JSON.stringify(wanted)) {
      console.log(`✓ ${doc._id} — already carries the K5 content`);
      continue;
    }
    console.log(`~ ${doc._id} — replacing content with the K5 copy${write ? "" : "  — DRY RUN"}`);
    const { _id: _ignored, _type: _t, ...fields } = target as Record<string, unknown>;
    if (write) await client.patch(doc._id).ifRevisionId(doc._rev).set(fields).commit();
  }
}

console.log(
  write
    ? "\nDone. Revalidate, then verify https://www.margorubber.com/manufacturing returns 200 with a self-canonical and is in /sitemap.xml."
    : "\nDry run — nothing written. Re-run with --write to apply.",
);
