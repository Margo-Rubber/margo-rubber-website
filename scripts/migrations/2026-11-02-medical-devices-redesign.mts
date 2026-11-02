/**
 * MIGRATION — Medical Devices industry page, redesigned (client, 2 Nov 2026).
 *
 *   npx tsx --env-file=.env.local scripts/migrations/2026-11-02-medical-devices-redesign.mts [--write]
 *
 * Content from Margo_Medical_Page_NEW_2026-11-02.html (Drive), the "28 Oct
 * change brief" page: hero, the ten components, applications, compounds,
 * process, quality, export, FAQs and closing copy, verbatim. Positioned for
 * laboratory and diagnostic equipment — no patient-contact parts and no
 * biocompatibility claim, so every "biocompatible silicone" line goes.
 *
 * Without the "Nashik location": the custom-engineering photo loses its
 * "Nashik, Maharashtra, India" caption but keeps its photograph (the slot's
 * Studio upload, a lab tubing shot); the numbered process sits under the
 * heading beside it.
 *
 * Photos are image-registry keys added in code (industries.medical-devices.
 * hero-lab and .part.*), so nothing is uploaded here — the hero moves to a new
 * key because the old one has a Studio upload over it.
 *
 * Needs the code that reads the new fields (heroLead / heroNote / heroAnswer,
 * card groups, the compound table, the numbered process): deploy that first.
 * Before writing, the merged page is checked with the site's own validator —
 * a page that fails it silently falls back to the old .mdx copy.
 *
 * Published AND draft; ifRevisionId on every write. Run twice and the second
 * run finds nothing to change.
 */
import { createClient } from "@sanity/client";
import { validateIndustryDocument } from "../../src/lib/cms-validate.ts";

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

const ID = "industry-medical-devices";
const CARD_BODY = "Made to your drawing. Send the drawing (or a sample), the medium and the working temperature.";

/* ── Top-level fields ─────────────────────────────────────────────────── */
const TOP = {
  h1: "Rubber components for medical & laboratory equipment",
  h1Lines: ["Rubber components for", "medical & laboratory equipment"],
  h1AccentLines: [1],
  heroLead: "Parts for laboratory and diagnostic equipment. We do not make patient-contact parts.",
  intro: "Lab and diagnostic instrument parts in EPDM, FKM or silicone, chosen by chemistry.",
  heroNote: "ISO 9001:2015 certified. Medical-device certification is in progress.",
  heroAnswer:
    "Margo Rubber Products moulds rubber components for laboratory and diagnostic equipment at its ISO 9001:2015 certified plant in Nashik, India: fluid-path O-rings, valve-manifold gaskets, steriliser door gaskets, port plugs, instrument feet and laboratory stoppers, made to your drawing in EPDM, FKM or silicone. We do not make patient-contact parts. Prototypes take 48 to 72 hours with an existing tool, about 1 week for a new part, and material test reports ship with every shipment.",
  hero: {
    image: "industries.medical-devices.hero-lab",
    alt: "Rubber seals, gaskets, port plugs and feet on a laboratory bench",
  },
  heroBoost: false,
  "seo.title": "Rubber components for medical & laboratory equipment | Margo",
  "seo.description":
    "Rubber parts for laboratory and diagnostic equipment, moulded to drawing in EPDM, FKM or silicone at our ISO 9001:2015 plant in Nashik, India.",
  nonClaims: [
    "ISO 9001:2015 certified. Medical-device certification is in progress. Silicone (VMQ) is offered as a moulding capability; suitability is assessed on the finished device.",
  ],
  "related.products": ["o-rings", "gaskets", "diaphragms", "extrusion", "grommets", "pads-stoppers-caps"],
  faqs: [
    {
      _key: "medical-device-certification",
      q: "Do you hold medical-device certification?",
      a: "ISO 9001:2015 certified. Medical-device certification is in progress. Our ISO 9001:2015 certificate is 09111526A. We mould parts to your drawing in EPDM, FKM and silicone for laboratory and diagnostic equipment, not patient-contact parts. Regulatory responsibility for the finished device stays with the manufacturer; we provide material certificates, batch records and drawing-revision documentation.",
    },
    {
      _key: "are-your-parts-biocompatible",
      q: "Are your parts biocompatible?",
      a: "We do not claim biocompatibility. It is assessed on the finished device. We make non-patient-contact parts for laboratory and diagnostic equipment.",
    },
    {
      _key: "silicone-or-epdm-for-steam",
      q: "Silicone or EPDM for steam?",
      a: "EPDM for steam and autoclave sterilisation. Silicone is not suitable for steam above 121 °C and has a limited life in steam below that.",
    },
    {
      _key: "compounds-for-fluid-path",
      q: "Which compounds are available for fluid-path components?",
      a: "EPDM for steam and aqueous reagents, FKM for solvents and oils, and silicone (VMQ) for dry heat. Send the fluid and the cleaning or sterilisation method and we will confirm the compound and what the compound supplier can evidence.",
    },
    {
      _key: "minimum-order",
      q: "What is the minimum order?",
      a: "Minimum order is set against part size and tooling, not a fixed number. Send the drawing and annual volume and we quote both. Prototype within 48 to 72 hours for a part with an existing tool; about 1 week for a new part.",
    },
    {
      _key: "can-you-produce-to-our-validated-drawing",
      q: "Can you produce to our validated drawing revision?",
      a: "Yes. Every component is produced against a controlled drawing revision with no substitutions without approval, and the revision is recorded on the despatch documentation. A change to compound, hardness or geometry is quoted and approved as a change, never made silently.",
    },
  ],
};

/* ── Sections, by _key: fields merged over what is there ──────────────── */
const card = (key: string, name: string, href: string, image: string, group: string) => ({
  _key: key,
  key,
  name,
  body: CARD_BODY,
  bullets: [],
  image: `industries.medical-devices.part.${image}`,
  cta: { label: "View product", href },
  group,
});

const SECTIONS: Record<string, Record<string, unknown>> = {
  components: {
    body: "A laboratory-equipment rubber component is a moulded or extruded elastomer part, such as a seal, gasket, plug or foot, that sits inside an instrument rather than touching a patient. We don’t stock generic parts. Each component is produced against your drawing or an OEM sample — compound, hardness and geometry matched to the fluid path and the sterilisation cycle rather than picked from a catalogue.",
    items: [
      card("fluid-path-o-rings", "Fluid-path O-rings", "/products/o-rings", "fluid-path-o-rings", "Fluid path"),
      card("valve-manifold-gaskets", "Valve-manifold gaskets & flange seals", "/products/gaskets#valve-manifold-gaskets-flange-seals", "valve-manifold-gaskets", "Fluid path"),
      card("instrument-valve-diaphragms", "Instrument valve diaphragms", "/products/diaphragms#instrument-valve-diaphragms", "instrument-valve-diaphragms", "Fluid path"),
      card("micro-pump-diaphragms", "Instrument micro-pump diaphragms", "/products/diaphragms#instrument-micro-pump-diaphragms", "micro-pump-diaphragms", "Fluid path"),
      card("silicone-pump-tubing", "Silicone pump tubing & profiles", "/products/extrusion#silicone-pump-tubing-profiles", "silicone-pump-tubing", "Fluid path"),
      card("instrument-door-lid-gaskets", "Instrument door & lid gaskets", "/products/gaskets#instrument-door-lid-gaskets", "instrument-door-lid-gaskets", "Chambers, doors & ports"),
      card("steriliser-door-gaskets", "Steriliser lid & door gaskets", "/products/gaskets#steriliser-lid-door-gaskets", "steriliser-door-gaskets", "Chambers, doors & ports"),
      card("access-port-plugs-grommets", "Access-port plugs & pass-through grommets", "/products/grommets#access-port-plugs-pass-through-grommets", "access-port-plugs-grommets", "Chambers, doors & ports"),
      card("instrument-feet", "Instrument feet & suction feet", "/products/pads-stoppers-caps#instrument-feet-suction-feet", "instrument-feet", "Bench hardware"),
      card("laboratory-stoppers", "Laboratory stoppers", "/products/pads-stoppers-caps#laboratory-stoppers", "laboratory-stoppers", "Bench hardware"),
    ],
    footnote: "Illustrative product images.",
  },
  applications: {
    items: [
      {
        _key: "analysers-diagnostic-instruments",
        name: "Analysers and diagnostic instruments",
        body: "Fluid-path seals and [gaskets](/products/gaskets) for analysers and sample-handling equipment, in EPDM, FKM or silicone.",
      },
      {
        _key: "laboratory-pumps-valves",
        name: "Laboratory pumps and valves",
        body: "Extruded silicone tubing for pump sets, and moulded [diaphragms](/products/diaphragms) produced against controlled drawing revisions.",
      },
      {
        _key: "sterilisers-incubators",
        name: "Sterilisers and incubators",
        body: "Door and lid gaskets in EPDM for steam cycles, made to the OEM drawing.",
      },
      {
        _key: "lab-benches-glassware",
        name: "Lab benches and glassware",
        body: "Instrument feet, suction feet and laboratory stoppers.",
      },
    ],
  },
  conditions: {
    body: "Medical and laboratory equipment places specific demands on the materials in the fluid path. Compound selection is driven by the fluids contacted, the cleaning or sterilisation method and the service temperature.",
    items: [
      { _key: "epdm", icon: "shield", name: "EPDM", body: "Steam and aqueous reagents." },
      { _key: "fkm", icon: "thermo", name: "FKM (fluoroelastomer)", body: "Solvents and oils." },
      {
        _key: "silicone",
        icon: "wave",
        name: "Silicone (VMQ)",
        body: "Dry-heat steriliser gaskets and seals; limited life in steam (use EPDM for steam). Tell us the fluid and the cleaning or sterilisation method and we will confirm what the compound supplier can evidence.",
      },
    ],
    table: {
      caption: "Which compound for which duty",
      columns: ["Compound", "Choose it for", "Limit"],
      rows: [
        { _key: "epdm", cells: ["EPDM", "Steam, autoclave sterilisation, aqueous reagents", "Not stated on this page"] },
        { _key: "fkm", cells: ["FKM (fluoroelastomer)", "Solvents and oils", "Not stated on this page"] },
        {
          _key: "silicone",
          cells: [
            "Silicone (VMQ)",
            "Dry-heat steriliser gaskets and seals; −60 to +200 °C (standard grade, dry air)",
            "Not suitable for steam above 121 °C; limited life in steam below that",
          ],
        },
      ],
    },
  },
  custom: {
    bullets: [],
    // The photo stays (its Studio upload is the lab tubing and valves shot,
    // not the plant); only the Nashik caption over it goes.
    image: "industries.medical-devices.facility",
    steps: {
      heading: "How Margo takes a lab-equipment part from drawing to shipment",
      note: "This is Margo's own process at the Nashik plant.",
      items: [
        "You send the drawing or a sample, the fluid contacted, the cleaning or sterilisation method and the working temperature.",
        "We recommend EPDM, FKM or silicone and confirm what the compound supplier can evidence.",
        "Prototype: 48 to 72 hours with an existing tool; about 1 week for a new part.",
        "You approve the pre-production sample before volume release.",
        "Production runs against your controlled drawing revision, and the revision is recorded on every despatch document.",
        "Material test reports ship with every shipment.",
      ],
    },
  },
  quality: {
    body: "ISO 9001:2015 certified. Medical-device certification is in progress. Our quality management system covers incoming raw material inspection, in-process control and outgoing batch documentation.",
    items: [
      {
        _key: "iso-9001-2015",
        chip: "",
        name: "ISO 9001:2015",
        body: "Certified quality management covering all production and inspection processes. Certificate 09111526A, Integral Certification Ltd. Documentation available on request.",
      },
      {
        _key: "iso-3601-as568",
        chip: "",
        name: "ISO 3601-1 / SAE AS568",
        body: "O-ring sizes to ISO 3601-1 (ISO) and SAE AS568 (SAE International).",
      },
      { _key: "certification", chip: "", name: "Certification", body: "Biocompatibility sits with the finished device." },
    ],
  },
  exportLane: {
    heading: "Supply from Nashik to laboratory and diagnostic equipment makers.",
    paragraphs: [
      "We can supply laboratory and diagnostic equipment makers in the markets listed, with full export documentation managed from Nashik.",
      "Components are produced against your controlled drawing revision, with pre-production sample approval before volume release — and the drawing revision is recorded on every despatch document, so your change control and ours stay in step.",
    ],
  },
  closing: {
    body: "Send the drawing, an existing part, or the instrument make and model, with the fluid contacted and the cleaning or sterilisation method. Our engineering team responds within 48 hours with a compound recommendation, dimensional confirmation and a quotation, and confirms what the compound supplier can evidence.",
    contacts: [
      { _key: "contacts_0", icon: "phone", text: "+91 96655 79276" },
      { _key: "contacts_1", icon: "email", text: "info@margorubber.in" },
      { _key: "contacts_2", icon: "cert", text: "ISO 9001:2015 · Certificate 09111526A" },
    ],
  },
};
/** Removed from the custom-engineering panel: the "Nashik, Maharashtra, India" caption. */
const CUSTOM_UNSET = ["imageCaption", "body"];

type Section = { _key: string; _type: string } & Record<string, unknown>;
type Doc = { _id: string; _rev: string; sections: Section[]; card?: unknown } & Record<string, unknown>;

const docs = await client.fetch<Doc[]>(`*[_id in [$id, "drafts." + $id]]`, { id: ID });
if (!docs.length) throw new Error(`${ID} not found`);

for (const doc of docs) {
  const missing = Object.keys(SECTIONS).filter((k) => !doc.sections.some((s) => s._key === k));
  if (missing.length) throw new Error(`${doc._id}: no section(s) ${missing.join(", ")}`);

  const sections = doc.sections.map((s) => {
    const add = SECTIONS[s._key];
    if (!add) return s;
    const next: Section = { ...s, ...add };
    if (s._key === "exportLane") {
      next.card = { ...(s.card as object), subtitle: "Shipped from Nashik, Maharashtra" };
    }
    if (s._key === "custom") for (const f of CUSTOM_UNSET) delete next[f];
    return next;
  });

  // The page as the site will read it, checked with the site's own validator.
  const merged: Record<string, unknown> = { ...doc, sections, slug: "medical-devices" };
  for (const [k, v] of Object.entries(TOP)) {
    const [a, b] = k.split(".");
    if (b) merged[a] = { ...(merged[a] as object), [b]: v };
    else merged[a] = v;
  }
  const check = validateIndustryDocument(merged, "medical-devices");
  if (!check.ok) {
    console.error(`${doc._id}: the new page would FAIL validation — nothing written.`, check.issues);
    process.exit(1);
  }

  const before = JSON.stringify({ ...doc, _rev: null, _updatedAt: null });
  const after = JSON.stringify({ ...merged, slug: doc.slug, _rev: null, _updatedAt: null });
  if (before === after) {
    console.log(`${doc._id}: already done — nothing to do.`);
    continue;
  }

  console.log(`${doc._id}: valid. Hero, ${(SECTIONS.components.items as unknown[]).length} components, ${Object.keys(SECTIONS).length} sections and ${TOP.faqs.length} FAQs to write; custom-engineering photo kept, caption removed.`);
  if (!write) continue;
  const res = await client
    .patch(doc._id)
    .ifRevisionId(doc._rev)
    .set({ ...TOP, sections })
    .commit();
  console.log(`  Patched → rev ${res._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
