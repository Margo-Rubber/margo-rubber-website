/**
 * 41_Industry_Construction → industry-construction (new).
 *
 *   node scripts/sheets/apply/construction.mts [--write]
 */

import { applyNewPage, linksTo } from "../new-page.mts";

await applyNewPage({
  stem: "41_Industry_Construction",
  id: "industry-construction",
  slug: "construction",
  type: "industry",
  navLabel: "Construction",
  tier: 3,
  plan: [
    { kind: "cards", num: "02", key: "products", hrefFor: (r) => linksTo(r[2]) },
    { kind: "cards", num: "03", key: "applications", noteLabel: "Compound" },
    { kind: "table", num: "04", key: "compound", label: "Compound router", compounds: true },
    {
      kind: "table",
      num: "05",
      key: "standards",
      label: "Standards table",
      links: [
        ["See section 06", "#boundaries"],
        ["/industries/water-fluid-management", "/industries/water-fluid-management"],
      ],
    },
    { kind: "table", num: "06", key: "boundaries", label: "Boundaries table" },
    { kind: "certification", num: "07" },
    { kind: "faq", num: "08" },
    { kind: "cta", num: "09" },
  ],
  // "Q3 carries an internal link on water and fluid management page."
  faqLinks: { Q3: [["water and fluid management page", "/industries/water-fluid-management"]] },
  schemaService: {
    name: "Rubber Components for Construction and Infrastructure",
    description:
      "Extruded EPDM glazing and weatherseal profiles, cellular expansion joint seals, building-services gaskets and plant isolation mounts, produced to customer drawing.",
  },
  related: {
    products: ["extrusion", "sponge-foam-rubber", "gaskets", "anti-vibration-mounts", "o-rings", "rubber-lining", "bonded-components"],
  },
});
