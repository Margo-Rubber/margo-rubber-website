/**
 * 38_Product_Rubber_Lining → productCategory-rubber-lining (new).
 *
 *   node scripts/sheets/apply/rubber-lining.mts [--write]
 *
 * §07 is written twice; Margo confirmed fitting on 2026-09-03, so Version B
 * (the second H2 and its two panels) ships and Version A stays in the sheet.
 * The line on what a fitted job does not include comes from the same
 * section's "Also required" note.
 */

import { applyNewPage, linksTo } from "../new-page.mts";

await applyNewPage({
  stem: "38_Product_Rubber_Lining",
  id: "productCategory-rubber-lining",
  slug: "rubber-lining",
  type: "productCategory",
  navLabel: "Rubber Lining & Skirting",
  plan: [
    { kind: "cards", num: "02", key: "applications", hrefFor: (r) => linksTo(r[2]), links: [["See section 05", "#skirting"]] },
    { kind: "table", num: "03", key: "specification", label: "Sheet table", closing: "What to send", links: [["see section 05", "#skirting"]] },
    { kind: "table", num: "04", key: "compound", label: "Compound router", compounds: true },
    // Its own <h2> and anchor: the industry pages link to #skirting directly.
    { kind: "table", num: "05", key: "skirting", label: "Skirting table", body: "Body", closing: "Boundary note" },
    {
      kind: "table",
      num: "06",
      key: "testing",
      label: "Test table",
      body: "Body",
      closing: "Ships with every consignment",
      links: [["See sheet 37", "/products/bonded-components"]],
    },
    { kind: "prose", num: "07", key: "fitting", h2Index: 4, paragraphIndexes: [5, 6], links: [["bonded components page", "/products/bonded-components"]] },
    { kind: "certification", num: "08" },
    { kind: "faq", num: "09" },
    { kind: "cta", num: "10" },
  ],
  service: {
    exclusionsHeading: "Not included",
    exclusions: ["Scaffolding", "Confined-space entry", "Plant shutdown coordination"],
  },
  schemaProduct: {
    name: "Rubber Sheet Lining and Conveyor Skirting",
    description:
      "Abrasion and chemical resistant rubber sheet lining for chutes, hoppers, tanks, sumps and pump casings, and conveyor skirting cut to length, supplied cut and prepared to customer drawing.",
    material: ["Natural Rubber", "SBR", "Neoprene", "EPDM", "NBR", "FKM", "AEM", "Silicone"],
  },
  related: {
    products: ["bonded-components", "sponge-foam-rubber", "anti-vibration-mounts"],
    industries: ["mining", "pumps-valves", "water-fluid-management"],
  },
});
