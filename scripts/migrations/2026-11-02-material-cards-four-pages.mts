/**
 * MIGRATION — material cards on four more category pages (client, 2 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-material-cards-four-pages.mts [--write]
 *
 * The compound section on each page becomes material cards, with the Nov 2026
 * material photographs (slots products.<page>.material.<code>):
 *   · bonded-components, rubber-lining — the compound tables; each row's duty
 *     and note become the card's "when to choose it". Figures come from Site
 *     settings, as on every other solid-rubber page.
 *   · extrusion — the compound specification table. Extrusion hardness bands
 *     are narrower than moulding, so the cards keep their own figures
 *     (ownFigures) and the table's footnote.
 *   · sponge-foam-rubber — the compound selector. Sponge grades are rated
 *     cooler than solid rubber, so the cards keep the cellular figures
 *     (ownFigures).
 * Idempotent; each write uses ifRevisionId.
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

type Section = { _key: string; _type: string; [k: string]: unknown };
type Doc = { _id: string; _rev: string; sections: Section[] };

const NAMES: Record<string, string> = {
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
/** "[Natural rubber](/products#natural-rubber)" → NR */
const CODE_OF: Record<string, string> = {
  "natural-rubber": "NR",
  nbr: "NBR",
  epdm: "EPDM",
  neoprene: "CR",
  sbr: "SBR",
  aem: "AEM",
  fkm: "FKM",
  silicone: "VMQ",
};
const imageKey = (slug: string, code: string) => `products.${slug}.material.${code === "VMQ" ? "silicone" : code.toLowerCase()}`;

/** A duty-ranked compound table (If the duty is | Compound | Service temperature | Note). */
function fromDutyTable(slug: string, s: Section, card: { eyebrow: string; heading: string }): Section {
  const rows = s.rows as { cells: string[] }[];
  return {
    _key: "materialSection",
    _type: "block.materialCards",
    eyebrow: card.eyebrow,
    heading: card.heading,
    body: s.body,
    items: rows.map((r) => {
      const anchor = r.cells[1].match(/#([a-z-]+)\)/)?.[1] ?? "";
      const code = CODE_OF[anchor];
      if (!code) throw new Error(`no code for ${r.cells[1]}`);
      const duty = r.cells[0].charAt(0).toLowerCase() + r.cells[0].slice(1);
      return {
        _key: code.toLowerCase(),
        _type: "material",
        code,
        name: NAMES[code],
        tempRange: r.cells[2],
        hardness: HARDNESS[code],
        summary: `For ${duty}. ${r.cells[3].replace(/\.?$/, ".")}`,
        image: imageKey(slug, code),
      };
    }),
  };
}

const edits: Record<string, (d: Doc) => Section[]> = {
  "productCategory-bonded-components": (d) =>
    d.sections.map((s) =>
      s._key === "compound"
        ? fromDutyTable("bonded-components", s, { eyebrow: "05 · MATERIAL SELECTION", heading: "Which Bonded-Part Material Do I Need?" })
        : s,
    ),

  "productCategory-rubber-lining": (d) =>
    d.sections.map((s) =>
      s._key === "compound"
        ? fromDutyTable("rubber-lining", s, { eyebrow: "04 · MATERIAL SELECTION", heading: "Which Lining Material Do I Need?" })
        : s,
    ),

  "productCategory-extrusion": (d) =>
    d.sections.map((s) =>
      s._key === "specSection"
        ? {
            _key: "materialSection",
            _type: "block.materialCards",
            eyebrow: s.eyebrow,
            heading: s.heading,
            body: s.body,
            footnote: String(s.footnote).replace(/\*\*/g, ""),
            ownFigures: true,
            items: [
              { code: "EPDM", h: "50–80", t: "−40 to +140 °C", why: "Weather, ozone and water — the default for external sealing profiles." },
              { code: "NBR", h: "55–80", t: "−30 to +120 °C", why: "Profiles that run in contact with oils and fuels." },
              { code: "FKM", h: "60–85", t: "−20 to +250 °C\ncontinuous to +200 °C", why: "Aggressive chemicals and high heat." },
              { code: "VMQ", h: "40–75", t: "−60 to +220 °C", why: "Temperature extremes and purity requirements." },
              { code: "CR", h: "50–75", t: "−40 to +120 °C", why: "Balanced general-purpose duty with flame retardancy." },
            ].map((m) => ({
              _key: m.code.toLowerCase(),
              _type: "material",
              code: m.code,
              name: NAMES[m.code],
              tempRange: m.t,
              hardness: `${m.h} Shore A`,
              summary: m.why,
              image: imageKey("extrusion", m.code),
            })),
          }
        : s,
    ),

  "productCategory-sponge-foam-rubber": (d) =>
    d.sections.map((s) => {
      if (s._key !== "compoundSection") return s;
      const items = s.items as { code: string; fullName: string; applications: string; hardness: string; tempRange: string }[];
      return {
        _key: "materialSection",
        _type: "block.materialCards",
        eyebrow: s.eyebrow,
        heading: s.heading,
        body:
          "Five elastomer families, each optimised for distinct thermal, chemical and mechanical operating envelopes. Sponge grades are rated cooler than the same compound in solid rubber — the figures below are cellular ratings to ASTM D1056.",
        ownFigures: true,
        items: items.map((m) => ({
          _key: m.code.toLowerCase(),
          _type: "material",
          code: m.code,
          name: `${NAMES[m.code]} sponge`,
          tempRange: m.tempRange,
          hardness: m.hardness,
          summary: `${m.fullName}. For ${m.applications.charAt(0).toLowerCase()}${m.applications.slice(1)}.`,
          image: imageKey("sponge-foam-rubber", m.code),
        })),
      };
    }),
};

for (const [id, edit] of Object.entries(edits)) {
  const doc = await client.fetch<Doc>(`*[_id == $id][0]{ _id, _rev, sections }`, { id });
  if (doc.sections.some((s) => s._key === "materialSection")) {
    console.log(`${id}: already has material cards`);
    continue;
  }
  const sections = edit(doc);
  const cards = sections.find((s) => s._key === "materialSection");
  if (!cards) throw new Error(`${id}: compound section not found`);
  console.log(`${id}: ${(cards.items as { code: string }[]).map((i) => i.code).join(", ")}`);
  if (!write) continue;
  const res = await client.patch(id).ifRevisionId(doc._rev).set({ sections }).commit();
  console.log(`  patched → rev ${res._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
