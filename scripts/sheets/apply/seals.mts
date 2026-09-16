/**
 * 39_Product_Seals → productCategory-seals (new).
 *
 *   node scripts/sheets/apply/seals.mts [--write]
 *
 * The slug stays /products/seals, as the sheet recommends, and §02 ships as
 * a router — the two are one decision. The plunger cups card links to the
 * part, now under this category (SKU sheet 31).
 */

import { applyNewPage } from "../new-page.mts";

await applyNewPage({
  stem: "39_Product_Seals",
  id: "productCategory-seals",
  slug: "seals",
  type: "productCategory",
  navLabel: "Reciprocating Seals",
  plan: [
    { kind: "router", num: "02", key: "router", label: "Router cards" },
    {
      kind: "cards",
      num: "03",
      key: "types",
      noteLabel: "Typical use",
      hrefFor: (r) => (r[0] === "Plunger cups" ? "/products/seals/plunger-seals" : undefined),
    },
    {
      kind: "table",
      num: "04",
      key: "specification",
      label: "Spec table",
      footnote: "Footnote",
      links: [
        ["see section 06", "#housing"],
        ["See section 06", "#housing"],
      ],
    },
    { kind: "table", num: "05", key: "compound", label: "Compound router", compounds: true, closing: "Boundary line" },
    { kind: "accordion", num: "06", key: "housing", panels: ["Panel 1 — Surface finish", "Panel 2 — Extrusion and the clearance gap"] },
    { kind: "table", num: "07", key: "quality", label: "Test table", closing: "Ships with every consignment" },
    { kind: "certification", num: "08" },
    { kind: "faq", num: "09" },
    { kind: "cta", num: "10" },
  ],
  // "Q1's closing sentence carries an internal link on oil seals page."
  faqLinks: { Q1: [["oil seals page", "/products/oil-seals"]] },
  schemaProduct: {
    name: "Rubber Reciprocating Seals",
    description:
      "Plunger cups, U-cups, rod and piston seals, V-packings and wipers, moulded to customer drawing and specified by rod or bore diameter, stroke, working pressure and clearance gap.",
    material: ["NBR", "FKM", "EPDM", "Neoprene", "Natural Rubber", "SBR", "AEM", "Silicone"],
  },
  related: { products: ["o-rings", "oil-seals", "diaphragms"] },
});
