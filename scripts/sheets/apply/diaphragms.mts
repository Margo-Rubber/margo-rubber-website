/**
 * 36_Product_Diaphragms → productCategory-diaphragms (new).
 *
 *   node scripts/sheets/apply/diaphragms.mts [--write]
 */

import { applyNewPage } from "../new-page.mts";

await applyNewPage({
  stem: "36_Product_Diaphragms",
  id: "productCategory-diaphragms",
  slug: "diaphragms",
  type: "productCategory",
  navLabel: "Diaphragms",
  plan: [
    // "Internal links on the application names" — §02 notes.
    {
      kind: "cards",
      num: "02",
      key: "types",
      noteLabel: "Typical use",
      links: [
        ["Metering and dosing pumps", "/industries/pumps-valves"],
        ["sprayer heads", "/industries/agriculture"],
      ],
    },
    { kind: "table", num: "03", key: "specification", label: "Spec table", footnote: "Footnote" },
    { kind: "table", num: "04", key: "compound", label: "Compound router", compounds: true, closing: "Closing line" },
    // "moulded in" → the bonded components page now that it exists (sheet 37
    // §11); the guide is the supporting read.
    {
      kind: "accordion",
      num: "05",
      key: "construction",
      panels: ["Panel 1 — Fabric reinforcement", "Panel 2 — Moulded-in inserts", "Panel 3 — Plain moulded"],
      closing: "Closing note",
      links: [
        ["moulded in", "/products/bonded-components"],
        ["The bond is made during cure", "/resources/rubber-to-metal-bonded-parts-guide"],
      ],
    },
    { kind: "table", num: "06", key: "quality", label: "Test table", closing: "Ships with every consignment" },
    { kind: "certification", num: "07" },
    { kind: "faq", num: "08" },
    { kind: "cta", num: "09" },
  ],
  schemaProduct: {
    name: "Rubber Diaphragms",
    description:
      "Flat, rolling and convoluted rubber diaphragms, plain or fabric-reinforced, moulded to customer drawing and specified by effective diameter, stroke, working pressure and medium.",
    material: ["EPDM", "NBR", "FKM", "Neoprene", "Natural Rubber", "AEM", "Silicone", "SBR"],
  },
  related: { products: ["bellows", "gaskets", "o-rings"], industries: ["pumps-valves", "agriculture"] },
});
