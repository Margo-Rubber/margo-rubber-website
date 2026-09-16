/**
 * 42_Industry_Transport → industry-transport (new).
 *
 *   node scripts/sheets/apply/transport.mts [--write]
 *
 * §03 is two grids under one heading — rail and marine are different
 * buyers — with anchors #rail and #marine.
 */

import { applyNewPage, linksTo } from "../new-page.mts";

await applyNewPage({
  stem: "42_Industry_Transport",
  id: "industry-transport",
  slug: "transport",
  type: "industry",
  navLabel: "Transport — Rail & Marine",
  tier: 3,
  plan: [
    { kind: "cards", num: "02", key: "products", hrefFor: (r) => linksTo(r[2]) },
    { kind: "cards", num: "03", key: "rail", label: "Rail — cards", noteLabel: "Compound", group: "Rail" },
    { kind: "cards", num: "03", key: "marine", label: "Marine — cards", noteLabel: "Compound", group: "Marine", noHeader: true },
    { kind: "table", num: "04", key: "compound", label: "Compound router", compounds: true },
    { kind: "table", num: "05", key: "standards", label: "Standards table", links: [["See section 06", "#scope"]] },
    { kind: "table", num: "06", key: "scope", label: "Scope table", body: "Body" },
    { kind: "certification", num: "07" },
    { kind: "faq", num: "08" },
    { kind: "cta", num: "09" },
  ],
  schemaService: {
    name: "Rubber Components for Rail and Marine Builders",
    description:
      "Extruded window, door and hatch seals, cellular acoustic insulation, gaskets and vibration mounts, produced to customer drawing for rolling stock builders, integrators and shipyards.",
  },
  related: {
    products: ["extrusion", "sponge-foam-rubber", "anti-vibration-mounts", "gaskets", "grommets", "bonded-components"],
  },
});
