/**
 * 37_Product_Bonded_Components → productCategory-bonded-components (new).
 *
 *   node scripts/sheets/apply/bonded-components.mts [--write]
 */

import { applyNewPage, linksTo } from "../new-page.mts";

await applyNewPage({
  stem: "37_Product_Bonded_Components",
  id: "productCategory-bonded-components",
  slug: "bonded-components",
  type: "productCategory",
  navLabel: "Bonded Components",
  plan: [
    // Six links on the part names; the one family with no page ("— enquire")
    // goes to the form with the part pre-filled.
    { kind: "cards", num: "02", key: "applications", hrefFor: (r) => linksTo(r[2], "/contact?part=Bonded%20Components") },
    // "Link compound in panel 2 to the compound router in section 05, and
    // tooling in the closing note to /about" — §03 notes.
    {
      kind: "accordion",
      num: "03",
      key: "process",
      panels: ["Panel 1 — Metal preparation", "Panel 2 — Two-coat bonding system", "Panel 3 — Bonded during vulcanisation"],
      closing: "Closing note",
      links: [
        ["compound", "#compound"],
        ["Tooling", "/about"],
      ],
    },
    { kind: "table", num: "04", key: "substrates", label: "Metals table" },
    { kind: "table", num: "05", key: "compound", label: "Compound router", compounds: true },
    { kind: "table", num: "06", key: "verification", label: "Test table", body: "Body", closing: "Ships with every consignment" },
    { kind: "table", num: "07", key: "specification", label: "Spec table", footnote: "Footnote", links: [["See section 04", "#substrates"]] },
    { kind: "certification", num: "08" },
    { kind: "faq", num: "09" },
    { kind: "cta", num: "10" },
  ],
  schemaProduct: {
    name: "Rubber-to-Metal Bonded Components",
    description:
      "Rubber vulcanised directly to steel, stainless steel, aluminium or brass in a single cure - mounts, bushes, rollers, plungers and sealing elements, made to customer drawing.",
    material: ["Natural Rubber", "NBR", "EPDM", "Neoprene", "SBR", "FKM", "AEM", "Silicone"],
  },
  related: { products: ["anti-vibration-mounts", "bushes", "diaphragms"] },
});
